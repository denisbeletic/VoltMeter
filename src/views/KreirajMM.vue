<script setup>
    import Header from '@/components/Header.vue';
    import { ref } from 'vue';
    import { db } from '@/firebase';
    import { addDoc, collection, updateDoc, Timestamp } from 'firebase/firestore';
    import { watchAuthStateChange } from '@/composables/watchAuthStateChange';
    import { useRouter } from 'vue-router';
    import BackButton from '@/components/BackButton.vue';
    
    const router = useRouter()

    const adresa = ref('')
    const snaga = ref()
    const OMM = ref()
    const tvbr_brojila = ref()
    const TM = ref('')
    
    const dodajMM = async (adresa, snaga, OMM, tvbr_brojila, TM) => {
        try {
            const user = await watchAuthStateChange()
            const novo_mm = await addDoc(collection(db, "users", user.uid, "mjerna_mjesta"), {
                adresa: adresa,
                snaga: snaga,
                OMM: OMM,
                tvbr_brojila: tvbr_brojila,
                TM: TM
            })
    
            await updateDoc(novo_mm, {  // spremamo firebaseov id unutar tijela dokumenta
                uid: novo_mm.id
            })

            const date_object = new Date("2000-01-01")
            const firestore_timestamp = Timestamp.fromDate(date_object)
            const novo_ocitanje = await addDoc(collection(db, "users", user.uid, "mjerna_mjesta", novo_mm.id, "ocitanja"), { // inicijalizacija ocitanja
                date: firestore_timestamp,
                VT: 0,
                NT: 0,
                P1: 0,
                P2: 0
            })

            await updateDoc(novo_ocitanje, {  // spremamo firebaseov id unutar tijela dokumenta
                uid: novo_ocitanje.id
            })
            
            alert("Dodano MM!")
            location.reload()
        } catch (error) {
            alert("Error: " + error.message)
        }
    }
</script>

<template>
    <Header>
        <template #Slot1>
            <BackButton></BackButton>
        </template>
    </Header>
    <div class="flex flex-row items-center justify-center h-screen">
        <form @submit.prevent="dodajMM(adresa, snaga, OMM, tvbr_brojila, TM)" class="flex flex-col items-center justify-center bg-white py-2 px-6 rounded-2xl border-3 border-neutral-600">
            <p class="text-xl font-bold text-emerald-600 mb-5">Dodaj novo MM</p>
            <label class="mb-3">Upišite adresu mjernog mjesta:</label>
            <input required v-model="adresa" type="text" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Upišite priključnu snagu (kW):</label>
            <input required v-model="snaga" type="number" step="0.01" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Upišite OMM:</label>
            <input required v-model="OMM" type="number" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Upišite tvornički broj brojila:</label>
            <input required v-model="tvbr_brojila" type="number" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Odaberite tarifni model:</label>
            <select required v-model="TM" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
                <option value="Plavi">Plavi</option>
                <option value="Bijeli">Bijeli</option>
                <option value="Crveni">Crveni</option>
            </select>
            <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 w-full rounded-lg font-bold text-white py-0.5 px-3 my-2">Dodaj</button>
        </form>
    </div>
</template>

<style scoped>

</style>
