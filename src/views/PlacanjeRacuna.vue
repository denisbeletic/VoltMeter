<script setup>
    import BackButton from '@/components/BackButton.vue';
    import Header from '@/components/Header.vue';
    import { watchAuthStateChange } from '@/composables/watchAuthStateChange';
    import { db } from '@/firebase';
    import { doc, getDoc, updateDoc } from 'firebase/firestore';
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    const route = useRoute()
    const router = useRouter()

    const platiRacun = async () => {
        const user = await watchAuthStateChange()

        const firestore_dokument = doc(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "racuni", route.params.racun_uid)
        await updateDoc(firestore_dokument, {
           placeno: true
        })
        alert("Račun plaćen!")
        router.back()
    }

    const podaci = ref(null)

    onMounted(async () => {
        try {
            const user = await watchAuthStateChange()
            
            const firestore_dokument = doc(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "racuni", route.params.racun_uid)
            const snapshot = await getDoc(firestore_dokument)
            
            podaci.value = snapshot.data()
            
            const date_object = podaci.value.razdoblje.toDate() // formatiranje firestore timestamp-a natrag u string "yyyy-mm"
            const month = date_object.getMonth() + 1
            const year = date_object.getFullYear()
            
            const date_string = `${year}/${month}`
            podaci.value.razdoblje = date_string

        } catch (error) {
            alert("Error: " + error.message)
        }
    })
</script>

<template>
    <Header>
        <template #Slot1>
            <BackButton></BackButton>
        </template>
    </Header>
    <div class="flex flex-row items-center justify-center h-screen gap-5">
        <form @submit.prevent="platiRacun" class="flex flex-col items-center justify-center bg-white py-2 px-6 h-75 rounded-2xl border-3 border-neutral-600">
            <p class="text-xl font-bold text-emerald-600 mb-5">Plati račun</p>
            <label class="mb-3">Upišite IBAN:</label>
            <input required type="text" placeholder="HR12 1001 0061 1234 7890" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3 w-53">
            <div class="w-full h-0.5 bg-neutral-600 my-2 shrink-0"></div>
            <label class="mb-3">Upišite poziv na broj:</label>
            <input required type="text" placeholder="2050-91-54" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3 w-53">
            <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 w-full rounded-lg font-bold text-white py-0.5 px-3 my-2">Potvrdi</button>
        </form>
        <div v-if="podaci" class="flex flex-col">
            <div class="flex flex-col justify-center items-center bg-white py-2 px-6 my-2 h-fit overflow-y-auto rounded-md border-3 border-neutral-600">
                <div class="w-full h-0.5 bg-neutral-600 my-2 shrink-0"></div>
                <div class="flex flex-row gap-2">
                    <div class="flex flex-col text-right font-bold text-amber-600">
                        <p>OMM: </p>
                        <p>Razdoblje: </p>
                        <p>Očitanje VT: </p>
                        <p>Očitanje NT: </p>
                        <p>Očitanje P1: </p>
                        <p>Očitanje P2: </p>
                    </div>
                    <div class="flex flex-col shrink-0 bg-neutral-600 w-0.5"></div>
                    <div class="flex flex-col text-left">
                        <p>{{ podaci.OMM }}</p>
                        <p>{{ podaci.razdoblje }}</p>
                        <p>{{ podaci.relevantno_ocitanje.VT }} kWh</p>
                        <p>{{ podaci.relevantno_ocitanje.NT }} kWh</p>
                        <p>{{ podaci.relevantno_ocitanje.P1 }} kW</p>
                        <p>{{ podaci.relevantno_ocitanje.P2 }} kW</p>
                    </div>
                </div>
                <div class="w-full h-0.5 bg-neutral-600 my-2 shrink-0"></div>
            </div>
            <div class="flex flex-col justify-center items-center bg-white py-2 px-6 my-2 h-fit overflow-y-auto rounded-md border-3 border-neutral-600">
                <div class="w-full h-0.5 bg-neutral-600 my-2 shrink-0"></div>
                <div class="flex flex-row gap-2">
                    <div class="flex flex-col text-right font-bold text-amber-600">
                        <p>Ukupna potrošnja: </p>
                        <p>Potrošnja po VT: </p>
                        <p>Potrošnja po NT: </p>
                        <p>Najveća snaga: </p>
                    </div>
                    <div class="flex flex-col shrink-0 bg-neutral-600 w-0.5"></div>
                    <div class="flex flex-col text-left">
                        <p>{{ podaci.racun_detalji.ukupna_potrosnja }} kWh</p>
                        <p>{{ podaci.racun_detalji.razlika_VT }} kWh</p>
                        <p>{{ podaci.racun_detalji.razlika_NT }} kWh</p>
                        <p>{{ podaci.racun_detalji.najveca_snaga }} kW</p>
                    </div>
                </div>
                <div class="w-full h-0.5 bg-neutral-600 my-2 shrink-0"></div>
            </div>
            <div class="flex flex-col justify-center items-center bg-white py-2 px-6 my-2 h-fit overflow-y-auto rounded-md border-3 border-neutral-600">
                <div class="w-full h-0.5 bg-neutral-600 my-2 shrink-0"></div>
                <div class="flex flex-row gap-2">
                    <div class="flex flex-col text-right font-bold text-emerald-600">
                        <p>Opskrba: </p>
                        <p>Distribucija: </p>
                        <p>Prijenos: </p>
                        <p>Održavanje MM-a: </p>
                        <p>Potrošnja: </p>
                    </div>
                    <div class="flex flex-col shrink-0 bg-neutral-600 w-0.5"></div>
                    <div class="flex flex-col text-left">
                        <p>{{ podaci.racun_detalji.opskrba }} €</p>
                        <p>{{ podaci.racun_detalji.cijena_distribucije }} €</p>
                        <p>{{ podaci.racun_detalji.cijena_prijenosa }} €</p>
                        <p>{{ podaci.racun_detalji.mm_odrzavanje }} €</p>
                        <p>{{ podaci.racun_detalji.cijena_potrosnje }} €</p>
                    </div>
                </div>
                <div class="w-full h-0.5 bg-neutral-600 my-2 shrink-0"></div>
                <div class="flex flex-row gap-2">
                    <div class="flex flex-col text-right bg-emerald-600 border-emerald-600 rounded-md px-1 font-bold text-white">
                        <p>UKUPAN IZNOS: </p>
                    </div>
                    <div class="flex flex-col shrink-0 bg-neutral-600 w-0.5"></div>
                    <div class="flex flex-col text-left">
                        <p>{{ podaci.iznos }} €</p>
                    </div>
                </div>
                <div class="w-full h-0.5 bg-neutral-600 my-2 shrink-0"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>