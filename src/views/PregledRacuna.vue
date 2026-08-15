<script setup>
    import Header from '@/components/Header.vue';
    import { watchAuthStateChange } from '@/composables/watchAuthStateChange';
    import { db } from '@/firebase';
    import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    const route = useRoute()
    const router = useRouter()

    const razdoblje = ref(null)

    const izracunajIznos = async (TM, prosli_datum, trenutni_datum, relevantno_ocitanje) => {
        try {
            const user = await watchAuthStateChange()

            const energija_VT = 0.097   // po kWh-u na tarifi
            const energija_NT = 0.047   // po kWh-u na tarifi
            const radna_snaga = 3.28   // po kW -> jedino jedna snaga se ovdje naplacuje, ona koja je mjerila vecu
            const prijenos = 0.015      // po kWh-u zbroja tarifi -> prijenos * (VT + NT)
            const distribucija = 0.038  // po kWh-u zbroja tarifi
            const opskrba = 0.98        // po mjesecu, zbraja se samo jednom s ostatkom bez mnozenja -> posto su racuni samo za 1 mjesec
            const mm_odrzavanje = 1.98  // po mjesecu, zbraja se samo jednom s ostatkom bez mnozenja
            
            const q2 = query(
                collection(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "ocitanja"),
                where("date", ">=", Timestamp.fromDate(prosli_datum)),
                where("date", "<", Timestamp.fromDate(trenutni_datum)),
                orderBy("date", "desc"),
                limit(1)
            )
            const firestore_dokument_2 = await getDocs(q2)
            if (firestore_dokument_2.empty) {
                alert(`Nemate očitanje za prošlo razdoblje (${prosli_datum.getMonth() + 1}. mjesec)!`)
                throw new Error(`Fali očitanje za ${prosli_datum.getMonth() + 1}. mjesec`)
            }

            const proslo_ocitanje = firestore_dokument_2.docs[0].data()

            const razlika_VT = relevantno_ocitanje.VT - proslo_ocitanje.VT
            const razlika_NT = relevantno_ocitanje.NT - proslo_ocitanje.NT
            const ukupna_potrosnja = proslo_ocitanje.VT + proslo_ocitanje.NT

            switch (TM) {
                case "Plavi":
                    return parseFloat(razlika_VT * energija_VT + razlika_VT * prijenos + razlika_VT * distribucija + opskrba + mm_odrzavanje).toFixed(2)
                case "Bijeli":
                    return parseFloat(razlika_VT * energija_VT + razlika_NT * energija_NT + ukupna_potrosnja * prijenos + ukupna_potrosnja * distribucija + opskrba + mm_odrzavanje).toFixed(2)
                case "Crveni":
                    if (relevantno_ocitanje.VT > relevantno_ocitanje.NT) {
                        return parseFloat(razlika_VT * energija_VT + razlika_NT * energija_NT + relevantno_ocitanje.VT * radna_snaga + ukupna_potrosnja * prijenos + ukupna_potrosnja * distribucija + opskrba + mm_odrzavanje).toFixed(2)
                    } else {
                        return parseFloat(razlika_VT * energija_VT + razlika_NT * energija_NT + relevantno_ocitanje.NT * radna_snaga + ukupna_potrosnja * prijenos + ukupna_potrosnja * distribucija + opskrba + mm_odrzavanje).toFixed(2)
                    }
                default:
                    throw new Error(`Nepoznati TM: ${TM}`)
            }
        } catch (error) {
            throw error
        }
    }

    const stvoriRacun = async () => {
        try {
            const user = await watchAuthStateChange()

            const date_object = new Date(razdoblje.value)   // INPUT TYPE MONTH
            const firestore_timestamp = Timestamp.fromDate(date_object)     // string "yy-mm-dd" -> date object -> firestore timestamp
            const year = date_object.getFullYear()
            const month = date_object.getMonth() + 1

            const mjerno_mjesto = await getDoc(doc(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid))
            
            const trenutni_datum = new Date(year, month - 1, 1)   // 1. dan trenutnog mjeseca
            const zavrsni_datum = new Date(year, month, 1)       // 1. dan slj. mjeseca
            const prosli_datum = new Date(year, month - 2, 1)    // 1. dan proslog mjeseca
            const q1 = query(
                collection(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "ocitanja"),
                where("date", ">=", Timestamp.fromDate(trenutni_datum)),
                where("date", "<", Timestamp.fromDate(zavrsni_datum)),
                orderBy("date", "desc"),
                limit(1)
            ) // dohvacivanje zadnjeg ocitanja u mjesecu
            const firestore_dokument_1 = await getDocs(q1)
            if (firestore_dokument_1.empty) {
                alert(`Nemate očitanje za trenutno razdoblje (${trenutni_datum.getMonth() + 1}. mjesec)!`)
                throw new Error(`Fali očitanje za ${trenutni_datum.getMonth() + 1}. mjesec`)
            }

            const relevantno_ocitanje = firestore_dokument_1.docs[0].data()

            const novi_racun = await addDoc(collection(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "racuni"), {
                razdoblje: firestore_timestamp,
                placeno: false,
                TM: mjerno_mjesto.data().TM,
                OMM: mjerno_mjesto.data().OMM,
                relevantno_ocitanje: {
                    VT: relevantno_ocitanje.VT,
                    NT: relevantno_ocitanje.NT,
                    P1: relevantno_ocitanje.P1,
                    P2: relevantno_ocitanje.P2,
                },
                iznos: await izracunajIznos(mjerno_mjesto.data().TM, prosli_datum, trenutni_datum, relevantno_ocitanje)
            })

            await updateDoc(novi_racun, {  // spremamo firebaseov id unutar tijela dokumenta
                uid: novi_racun.id
            })

            alert("Račun kreiran!")
            location.reload()
        } catch (error) {
            alert("Error: " + error.message)
        }
    }

    const snapshot = ref(null)
    const racuni_data = ref([])

    onMounted(async () => {
        try {
            const user = await watchAuthStateChange()
            
            const firestore_query = query(  // sortiranje uredaja po snazi
                collection(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "racuni"),
                orderBy("razdoblje", "desc")
            )

            const firestore_dokumenti = await getDocs(firestore_query)  
            snapshot.value = firestore_dokumenti

            for (const item of snapshot.value.docs) {
                const podaci = item.data()
                racuni_data.value.push(podaci)
            }

            for (let item of racuni_data.value) {   // formatiranje firestore timestamp-a natrag u string "yyyy-mm"
                const date_object = item.razdoblje.toDate()
                const month = date_object.getMonth() + 1
                const year = date_object.getFullYear()

                const date_string = `${year}/${month}`
                item.razdoblje = date_string
            }
        } catch (error) {
            alert("Error: " + error.message)
        }
    })
    
</script>

<template>
    <Header>
        <template #Slot1>
            <button @click="router.back()" class="bg-emerald-600 hover:bg-emerald-500 w-fit rounded-lg font-bold text-white py-1 px-3">Nazad</button>
        </template>
    </Header>
    <div class="flex flex-row items-center justify-center h-screen gap-3">
        <div class="flex flex-col items-center justify-center bg-white py-2 px-6 rounded-2xl border-3 border-neutral-600">
            <p class="text-xl font-bold text-emerald-600 mb-5">Kreiraj novi račun</p>
            <p class="mb-3">Unesite razdoblje:</p>
            <input required v-model="razdoblje" type="month" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <button @click="stvoriRacun(razdoblje)" class="bg-emerald-600 hover:bg-emerald-500 w-full rounded-lg font-bold text-white py-0.5 px-3 my-2">Kreiraj</button>
        </div>
        <div v-if="racuni_data && racuni_data.length > 0" class="flex flex-col justify-start items-start bg-white py-2 px-6 my-15 h-130 overflow-y-auto rounded-md border-3 border-neutral-600">
            <div v-for="item in racuni_data" class="my-3">
                <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
                <div class="flex flex-row gap-2">
                    <div class="flex flex-col text-right font-bold text-emerald-600">
                        <p>Razdoblje: </p>
                        <p>OMM: </p>
                        <p>TM: </p>
                        <p>Iznos: </p>
                        <p>Status: </p>
                    </div>
                    <div class="flex flex-col shrink-0 bg-neutral-600 w-0.5"></div>
                    <div class="flex flex-col text-left">
                        <p>{{ item.razdoblje }}</p>
                        <p>{{ item.OMM }}</p>
                        <p>{{ item.TM }}</p>
                        <p>{{ item.iznos }} €</p>
                        <p v-if="item.placeno" class="text-emerald-600 font-bold">Plaćeno</p>
                        <p v-else class="text-red-600 font-bold">Neplaćeno</p>
                    </div>
                </div>
                <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
                <button @click="" class="bg-emerald-600 hover:bg-emerald-500 w-full rounded-lg font-bold text-white py-0.5 px-3">Plati</button> <!-- TODO: dovrsiti placanje i izvoz u PDF -->
                <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
                <button @click="" class="bg-indigo-500 hover:bg-indigo-400 w-full rounded-lg font-bold text-white py-0.5 px-3">Izvoz u PDF</button>
                <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
