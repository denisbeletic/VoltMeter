<script setup>
    import Header from '@/components/Header.vue';
    import { ref } from 'vue';
    import { db } from '@/firebase';
    import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
    
    const adresa = ref('')
    const snaga = ref('')
    const OMM = ref('')
    const TM = ref('')

    const dodajMM = async (adresa, snaga, OMM, TM) => {
        const novo_mm = await addDoc(collection(db, "mjerna_mjesta"), {
            adresa: adresa,
            snaga: snaga,
            OMM: OMM,
            TM: TM
        })
        alert("Dodano MM!")
    }

</script>

<template>
    <Header></Header>
    <div class="flex flex-row items-center justify-center h-screen">
        <form @submit.prevent="dodajMM(adresa, snaga, OMM, TM)" class="flex flex-col items-center justify-center bg-white py-2 px-6 rounded-2xl border-3 border-neutral-600">
            <p class="text-xl font-bold text-emerald-600 mb-5">Dodaj novo MM</p>
            <label class="mb-3">Upišite adresu mjernog mjesta:</label>
            <input required v-model="adresa" type="text" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Upišite snagu (kW):</label>
            <input required v-model="snaga" type="number" step="0.01" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Upišite OMM:</label>
            <input required v-model="OMM" type="number" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
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
