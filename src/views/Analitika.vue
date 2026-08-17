<script setup>
    import BackButton from '@/components/BackButton.vue';
    import Header from '@/components/Header.vue';
    import { watchAuthStateChange } from '@/composables/watchAuthStateChange';
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { Chart } from 'chart.js/auto';
    import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
    import { db } from '@/firebase';

    const route = useRoute()

    const avg_3mjeseca_potrosnja = ref(0)
    const avg_3mjeseca_iznos = ref(0)
    const avg_potrosnja = ref(0)

    const isLoading = ref(false)
    const graf_canvas = ref(null)
    const graf_instance = ref(null)
    const odabrana_godina = ref(2000)
    const data_racuni = ref([])
    const data_ocitanja = ref([])
    const data_potrosnje = ref() // svaki index + 1 (n + 1) je potrosnja za n + 1-ti mjesec
    const labels = [
        "Sij",
        "Vel", 
        "Ožu", 
        "Tra", 
        "Svi", 
        "Lip", 
        "Srp", 
        "Kol", 
        "Ruj", 
        "Lis", 
        "Stu", 
        "Pro"
    ]

    const ucitajGraf = async () => {
        try {
            const user = await watchAuthStateChange()
            data_potrosnje.value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            isLoading.value = true

            for (const item of data_ocitanja.value) {
                const [godina, mjesec] = item.date.split("/").map(Number) // pretvaramo sve iz string-a u broj
                if (godina == odabrana_godina.value) {
                    data_potrosnje.value[mjesec - 1] += item.VT + item.NT
                }
            }
            
            let iteracije = 0
            for (const item of data_potrosnje.value) {  // racunanje average potrosnje u godini
                if (item == 0) {
                    break
                }
                iteracije += 1
                avg_potrosnja.value += item
            }
            if (avg_potrosnja.value != 0) {
                avg_potrosnja.value /= iteracije
            }

            const ctx = graf_canvas.value.getContext("2d")

            if (graf_instance.value) {      // ako vec postoji graf
                graf_instance.value.destroy()
            }

            graf_instance.value = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Ukupna potrošnja (VT + NT) - kWh",
                        data: data_potrosnje.value,
                        backgroundColor: "rgba(75, 192, 192, 0.5)",
                        borderWidth: 1,
                        borderColor: "rgb(75, 192, 192)"
                    }]
                }
            })

        } catch (error) {
            alert("Error: " + error.message)
        } finally {
            setTimeout(() => {          // prebrzo klikanje na tipku za ucitavanje (dok async funkcije nisu jos resolved) vodi do bug-ova,
                isLoading.value = false // postavljen delay nakon svakog klika
            }, 1000)
        }
    }

    onMounted(async () => {
        const user = await watchAuthStateChange()

        // ocitanja
        const firestore_query_ocitanja = query(  // sortiranje ocitanja
            collection(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "ocitanja"),
            orderBy("date", "desc")
        )
        const snapshot_ocitanja = await getDocs(firestore_query_ocitanja)
        for (const item of snapshot_ocitanja.docs) {
            data_ocitanja.value.push(item.data())
        }

        for (const item of data_ocitanja.value) {    
            const date_object = item.date.toDate()
            const month = date_object.getMonth() + 1
            const year = date_object.getFullYear()

            const date_string = `${year}/${month}`  // formatiranje firestore timestamp-a natrag u string "yyyy-mm"
            item.date = date_string
        }

        // racuni
        const firestore_query_racuni = query(   // sortiranje racuna
            collection(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "racuni"),
            orderBy("razdoblje", "desc"),
            limit(3)
        )
        const snapshot_racuni = await getDocs(firestore_query_racuni)
        for (const item of snapshot_racuni.docs) {
            data_racuni.value.push(item.data())
        }

        // racunanje avg-s
        for (let i = 0; i < 3; i++) {
           avg_3mjeseca_potrosnja.value += data_ocitanja.value[i].VT + data_ocitanja.value[i].NT
           avg_3mjeseca_iznos.value += parseFloat(data_racuni.value[i].iznos)
        }
        avg_3mjeseca_potrosnja.value /= 3
        avg_3mjeseca_iznos.value /= 3
        avg_3mjeseca_potrosnja.value = avg_3mjeseca_potrosnja.value.toFixed(2)
        avg_3mjeseca_iznos.value = avg_3mjeseca_iznos.value.toFixed(2)

        await ucitajGraf()
    })
</script>

<template>
    <Header>
        <template #Slot1>
            <BackButton></BackButton>
        </template>
    </Header>
    <div class="flex flex-col items-center justify-center h-screen gap-5">
        <div class="flex flex-row gap-20 mt-10">
            <div class="flex flex-col justify-around items-start">
                <div class="flex flex-row justify-start items-start bg-white py-2 px-6 mt-5 rounded-md border-3 border-neutral-600 gap-3">
                    <div class="flex flex-col">
                        <p class="mb-3 font-bold">Upišite godinu za prikaz:</p>
                        <input v-model="odabrana_godina" type="number" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-2">
                        <button @click="ucitajGraf()" :disabled="isLoading" class="bg-emerald-600 hover:bg-emerald-500 w-full rounded-lg font-bold text-white py-0.5 px-3 my-2">Učitaj</button>
                    </div>
                </div>
                <div class="flex flex-row">
                    <div class="flex flex-col justify-start items-start bg-white py-2 px-6 mt-5 rounded-md border-3 border-neutral-600">
                        <p class="font-bold">Usporedba s prosječnim</p>
                        <p class="font-bold mb-3">kućanstvom <span class="text-emerald-600">(kWh / mj.)</span>:</p>
                        <div class="w-full h-0.5 bg-neutral-600 mb-2"></div>
                        <div class="flex flex-row gap-2">
                            <div class="flex flex-col text-right font-bold">
                                <p class="text-emerald-600">Vaše MM: </p>
                                <p class="text-amber-600">Prosjek HR: </p>
                            </div>
                            <div class="flex flex-col shrink-0 bg-neutral-600 w-0.5"></div>
                            <div class="flex flex-col text-left">
                                <p><span>{{ avg_potrosnja }} kWh</span></p>
                                <p><span>320 kWh</span></p>
                            </div>
                        </div>
                        <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
                    </div>
                </div>
                <div class="flex flex-row">
                    <div class="flex flex-col justify-start items-start bg-white py-2 px-6 mt-5 rounded-md border-3 border-neutral-600">
                        <p class="font-bold">Procjena sljedećeg računa -</p>
                        <p class="font-bold text-emerald-600 mb-3">na temelju zadnja 3 mjeseca:</p>
                        <div class="w-full h-0.5 bg-neutral-600 mb-2"></div>
                        <div class="flex flex-row gap-2">
                            <div class="flex flex-col text-right font-bold">
                                <p class="text-emerald-600">Potrošnja: </p>
                                <p class="text-amber-600">Iznos: </p>
                            </div>
                            <div class="flex flex-col shrink-0 bg-neutral-600 w-0.5"></div>
                            <div class="flex flex-col text-left">
                                <p><span>{{ avg_3mjeseca_potrosnja }} kWh</span></p>
                                <p><span>{{ avg_3mjeseca_iznos }} €</span></p>
                            </div>
                        </div>
                        <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
                    </div>    
                </div>
            </div>
            <div class="flex flex-col justify-start items-start bg-white py-2 px-6 mt-5 h-150 rounded-md border-3 border-neutral-600 gap-3">
                <canvas ref="graf_canvas" width="800" height="600"></canvas>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
