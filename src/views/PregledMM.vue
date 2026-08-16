<script setup>
    import BackButton from '@/components/BackButton.vue';
    import Header from '@/components/Header.vue';
    import { watchAuthStateChange } from '@/composables/watchAuthStateChange';
    import { db } from '@/firebase';
    import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
    import { onMounted, ref } from 'vue';
    import { useRoute, RouterLink, useRouter } from 'vue-router';
    import { 
        Refrigerator,
        Microwave,
        CookingPot,
        Bubbles,
        WashingMachine,
        Coffee,
        AirVent,
        Tv,
        PcCase,
        Heater,
        EvCharger,
        Lightbulb,
        LampFloor,
        Zap,
        Layers2
    } from 'lucide-vue-next';

    const route = useRoute()
    const router = useRouter()

    const ikone = {
        Refrigerator,
        Microwave,
        CookingPot,
        Bubbles,
        WashingMachine,
        Coffee,
        AirVent,
        Tv,
        PcCase,
        Heater,
        EvCharger,
        Lightbulb,
        LampFloor,
        Zap,
        Layers2
    }

    const data_mm = ref(`Loading...`)
    const data_ocitanja = ref([])
    const data_uredaji = ref([])
    const data_racuni = ref([])
    const suma_snagi = ref(0)
    const prosjecna_dnevna_potrosnja = ref(0)

    const dohvatiIkonu = (ime) => {
        return ikone[ime]
    }

    onMounted(async () => {
        try {
            const user = await watchAuthStateChange()

            // data fetch
            // mm
            const firestore_dokument_mm = doc(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid)
            const snapshot_mm = await getDoc(firestore_dokument_mm)
            data_mm.value = snapshot_mm.data()

            // ocitanja
            const firestore_query_ocitanja = query(  // sortiranje ocitanja
                collection(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "ocitanja"),
                orderBy("date", "desc")
            )
            const snapshot_ocitanja = await getDocs(firestore_query_ocitanja)
            for (const item of snapshot_ocitanja.docs) {
                data_ocitanja.value.push(item.data())
            }

            for (let item of data_ocitanja.value) {   // formatiranje firestore timestamp-a natrag u string "yyyy-mm-dd"
                const date_object = item.date.toDate()
                const day = date_object.getDate()
                const month = date_object.getMonth() + 1
                const year = date_object.getFullYear()

                const date_string = `${day}/${month}/${year}`
                item.date = date_string
            }

            // uredaji
            const firestore_dokumenti_uredaji = collection(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "uredaji")
            const snapshot_uredaji = await getDocs(firestore_dokumenti_uredaji)
            for (const item of snapshot_uredaji.docs) {
                data_uredaji.value.push(item.data())
            }
            for (const item of data_uredaji.value) {     
                suma_snagi.value += item.snaga_uredaja  // racunanje suma snaga svih uređaja
                prosjecna_dnevna_potrosnja.value += item.snaga_uredaja * item.vrijeme_koristenja  // racunanje prosjecne dnevne potrosnje
            }
            
            // racuni
            const firestore_query_racuni = query(   // sortiranje racuna
                collection(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "racuni"),
                orderBy("razdoblje", "desc")
            )
            const snapshot_racuni = await getDocs(firestore_query_racuni)
            for (const item of snapshot_racuni.docs) {
                data_racuni.value.push(item.data())
            }

            for (let item of data_racuni.value) {   // formatiranje firestore timestamp-a natrag u string "yyyy-mm-dd"
                const date_object = item.razdoblje.toDate()
                const day = date_object.getDate()
                const month = date_object.getMonth() + 1
                const year = date_object.getFullYear()

                const date_string = `${day}/${month}/${year}`
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
            <BackButton></BackButton>
        </template>
        <template #Slot2>
            <RouterLink :to="`/pregledmm/${route.params.mm_uid}/uredimm`" class="bg-amber-600 hover:bg-amber-500 w-fit rounded-lg font-bold text-white py-1 px-3">Uredi MM</RouterLink>
        </template>
    </Header>
    <div class="flex flex-col items-center justify-center h-screen gap-5">
        <div class="flex flex-row gap-20 mt-10">
            <div v-if="data_ocitanja && data_ocitanja.length > 0" class="flex flex-col justify-start items-start bg-white py-2 px-6 mt-5 h-80 overflow-y-auto rounded-md border-3 border-neutral-600 gap-3">
                <p class="font-bold">Očitanja za brojilo:</p>
                <p class="font-bold text-emerald-600">{{ data_mm.tvbr_brojila }}</p>
                <div v-for="item in data_ocitanja">
                    <div class="w-full h-0.5 bg-neutral-600 mb-2"></div>
                    <div class="flex flex-row gap-2">
                        <div class="flex flex-col text-right font-bold text-emerald-600">
                            <p>Datum: </p>
                            <p>VT: </p>
                            <p>NT: </p>
                            <p>P1: </p>
                            <p>P2: </p>
                        </div>
                        <div class="flex flex-col shrink-0 bg-neutral-600 w-0.5"></div>
                        <div class="flex flex-col text-left">
                            <p>{{ item.date }}</p>
                            <p>{{ item.VT }}<span> kWh</span></p>
                            <p>{{ item.NT }}<span> kWh</span></p>
                            <p>{{ item.P1 }}<span> kW</span></p>
                            <p>{{ item.P2 }}<span> kW</span></p>
                        </div>
                    </div>
                    <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
                </div>
            </div>
            <div v-if="data_uredaji && data_uredaji.length > 0" class="flex flex-col justify-start items-start bg-white py-2 px-6 mt-5 h-80 overflow-y-auto rounded-md border-3 border-neutral-600 gap-3">
                <p class="font-bold">Uređaji:</p>
                <div v-for="item in data_uredaji">
                    <div class="w-full h-0.5 bg-neutral-600 mb-2"></div>
                    <div class="flex flex-row gap-2">
                        <component :is="dohvatiIkonu(item.ikona)" size="50" color="#615fff" class="my-auto mx-2"></component>
                        <div class="flex flex-col shrink-0 bg-neutral-600 w-0.5"></div>
                        <div class="flex flex-col text-right font-bold text-emerald-600">
                            <p>Ime: </p>
                            <p>Snaga: </p>
                            <p>Korištenje: </p>
                        </div>
                        <div class="flex flex-col shrink-0 bg-neutral-600 w-0.5"></div>
                        <div class="flex flex-col text-left">
                            <p>{{ item.ime_uredaja }}</p>
                            <p>{{ item.snaga_uredaja }}<span> kW</span></p>
                            <p>{{ item.vrijeme_koristenja }}<span> h / dnevno</span></p>
                        </div>
                    </div>
                    <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
                </div>
            </div>
        </div>
        <div class="flex flex-row gap-20">
            <div v-if="data_racuni && data_racuni.length > 0" class="flex flex-col justify-start items-start bg-white py-2 px-6 mt-5 h-80 overflow-y-auto rounded-md border-3 border-neutral-600 gap-3">
                <p class="font-bold">Računi:</p>
                <div v-for="item in data_racuni">
                    <div class="w-full h-0.5 bg-neutral-600 mb-2"></div>
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
                            <p v-if="item.placeno" class="bg-emerald-600 rounded-md px-1 font-bold text-white">Plaćeno</p>
                            <p v-else class="bg-red-600 rounded-md px-1 font-bold text-white">Neplaćeno</p>
                        </div>
                    </div>
                    <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
                </div>
            </div>
            <div class="flex flex-col justify-start items-start bg-white py-2 px-6 mt-5 h-80 rounded-md border-3 border-neutral-600 gap-3">
                <p class="font-bold">Informacije o MM-u:</p>
                <div class="w-full h-0.5 bg-neutral-600 mt-3"></div>
                <div class="flex flex-row gap-2">
                    <div class="flex flex-col text-right font-bold text-emerald-600">
                        <p>Adresa: </p>
                        <p>OMM: </p>
                        <p>TM: </p>
                        <p>Tv.br. brojila: </p>
                        <p>Priključna snaga: </p>
                    </div>
                    <div class="flex flex-col shrink-0 bg-neutral-600 w-0.5"></div>
                    <div class="flex flex-col text-left">
                        <p class="font-bold">{{ data_mm.adresa }}</p>
                        <p class="font-bold">{{ data_mm.OMM }}</p>
                        <p>{{ data_mm.TM }}</p>
                        <p>{{ data_mm.tvbr_brojila }}</p>
                        <p>{{ data_mm.snaga }}<span> kW</span></p>
                    </div>
                </div>
                <div class="w-full h-0.5 bg-neutral-600"></div>
                <div class="flex flex-row gap-2 text-center">
                    <div class="flex flex-col text-right font-bold text-emerald-600">
                        <p>Opterećenje priklj. sn.: </p>
                        <p>Prosječna dnev. potroš.: </p>
                    </div>
                    <div class="flex flex-col shrink-0 bg-neutral-600 w-0.5"></div>
                    <div class="flex flex-col text-left">
                        <p class="font-bold text-amber-600">{{ suma_snagi }} / {{ data_mm.snaga }} (kW)</p>
                        <p class="font-bold text-amber-600">{{ prosjecna_dnevna_potrosnja }} kWh</p>
                    </div>
                </div>
                <div class="w-full h-0.5 bg-neutral-600"></div>
            </div>
        </div>
        <div class="flex flex-row gap-10">
            <RouterLink :to="`/pregledmm/${route.params.mm_uid}/urediocitanja`" class="bg-emerald-600 hover:bg-emerald-500 w-fit rounded-lg font-bold text-lg text-white py-1 px-4">+ Dodaj novo očitanje</RouterLink>
            <RouterLink :to="`/pregledmm/${route.params.mm_uid}/urediuredaje`" class="bg-amber-600 hover:bg-amber-500 w-fit rounded-lg font-bold text-lg text-white py-1 px-4">Uredi uređaje</RouterLink>
            <RouterLink :to="`/pregledmm/${route.params.mm_uid}/pregledracuna`" class="bg-indigo-600 hover:bg-indigo-500 w-fit rounded-lg font-bold text-lg text-white py-1 px-4">Pregledaj račune</RouterLink>
            <RouterLink :to="`/pregledmm/${route.params.mm_uid}/analitika`" class="bg-yellow-500 hover:bg-yellow-400 w-fit rounded-lg font-bold text-lg text-white py-1 px-4">Analitika</RouterLink>
        </div>
    </div>
</template>

<style scoped>

</style>
