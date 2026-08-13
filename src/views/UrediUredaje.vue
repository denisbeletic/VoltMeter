<script setup>
    import Header from '@/components/Header.vue';
    import { useRoute } from 'vue-router';
    import { onMounted, ref } from 'vue';
    import { db } from '@/firebase';
    import { doc, collection, getDoc, getDocs, query, addDoc, deleteDoc, updateDoc, Timestamp, orderBy } from 'firebase/firestore';
    import { watchAuthStateChange } from '@/composables/watchAuthStateChange';
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

    const ime_uredaja = ref("")
    const snaga_uredaja = ref(0)
    const vrijeme_koristenja = ref(0)
    const ikona = ref("Layers2")        // default-na ikona na prikazu dropdown-a

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

    const dohvatiIkonu = (ime) => {
        return ikone[ime]
    }

    const dodajUredaj = async () => { 
        try {
            const user = await watchAuthStateChange()
            const novi_uredaj = await addDoc(collection(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "uredaji"), {
                ime_uredaja: ime_uredaja.value,
                snaga_uredaja: snaga_uredaja.value,
                vrijeme_koristenja: vrijeme_koristenja.value,
                ikona: ikona.value
            }) 
            
            await updateDoc(novi_uredaj, {  // spremamo firebaseov id unutar tijela dokumenta
                uid: novi_uredaj.id
            })
            
            alert("Dodan uređaj!")
            location.reload()
        } catch (error) {
            alert("Error: " + error.message)
        }
    }
    
    const ukloniUredaj = async (target_document_id) => {
        try {
            const user = await watchAuthStateChange()
            await deleteDoc(doc(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "uredaji", target_document_id))
            location.reload()

            alert("Uređaj uklonjen!")
        } catch (error) {
            alert("Error: " + error.message)
        }
    }

    const snapshot = ref(null)
    const uredaji_data = ref([]) 

    onMounted(async () => {
        try {
            const user = await watchAuthStateChange()
            
            const firestore_query = query(  // sortiranje uredaja po snazi
                collection(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "uredaji"),
                orderBy("snaga_uredaja", "desc")
            )

            const firestore_dokumenti = await getDocs(firestore_query)  
            snapshot.value = firestore_dokumenti

            for (const item of snapshot.value.docs) {
                const podaci = item.data()
                uredaji_data.value.push(podaci)
            }
        } catch (error) {
            alert("Error: " + error.message)
        }
    })
</script>

<template>
    <Header></Header>
    <div class="flex flex-row items-center justify-center h-screen gap-5">
        <form @submit.prevent="dodajUredaj" class="flex flex-col items-center justify-center bg-white py-2 px-6 h-125 rounded-2xl border-3 border-neutral-600">
            <p class="text-xl font-bold text-emerald-600 mb-5">Dodaj novi uređaj</p>
            <label class="mb-3">Upišite ime uređaja:</label>
            <input required v-model="ime_uredaja" type="text" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Upišite snagu uređaja (kW):</label>
            <input required v-model="snaga_uredaja" type="number" step="0.01" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Upišite dnevno vrijeme korištenja (h):</label>
            <input required v-model="vrijeme_koristenja" type="number" step="0.01" min="0.1" max="24" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Odaberite ikonu:</label>
            <select required v-model="ikona" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
                <option value="Layers2">Default</option>
                <option value="Zap">Munja</option>
                <option value="Lightbulb">Žarulja</option>
                <option value="LampFloor">Lampa</option>
                <option value="Microwave">Mikrovalna</option>
                <option value="Refrigerator">Frižider</option>
                <option value="CookingPot">Pećnica</option>
                <option value="Bubbles">Perilica suđa</option>
                <option value="WashingMachine">Perilica rublja</option>
                <option value="Coffee">Aparat za kavu</option>
                <option value="AirVent">Klima</option>
                <option value="Tv">Televizija</option>
                <option value="PcCase">Računalo</option>
                <option value="Heater">Bojler</option>
                <option value="EvCharger">Punjač električnog auta</option>
            </select>
            <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 w-full rounded-lg font-bold text-white py-0.5 px-3 my-2">Dodaj</button>
        </form>
        <div class="flex flex-col justify-start items-start bg-white py-2 px-6 my-15 h-125 overflow-y-auto rounded-md border-3 border-neutral-600">
            <div v-for="item in uredaji_data" class="my-3">
                <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
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
                <button @click="ukloniUredaj(item.uid)" class="bg-red-600 hover:bg-red-500 w-full rounded-lg font-bold text-white py-0.5 px-3">Obriši</button>
                <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>