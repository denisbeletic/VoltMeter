<script setup>
    import Header from '@/components/Header.vue';
    import { useRoute } from 'vue-router';
    import { db } from '@/firebase';
    import { doc, collection, addDoc, deleteDoc } from 'firebase/firestore';

    const route = useRoute()

    const dodajUredaj = async () => { 
        try {
            const novi_uredaj = await addDoc(collection(db, "mjerna_mjesta", route.params.mm_uid, "uredaji"), {
                ikona: "Zap",
                snaga_uredaja: 1.5,
                vrijeme_koristenja: 24
            }) 

            alert("Dodan uređaj!")
        } catch (error) {
            alert("Error: " + error.message)
        }
    }

    // target_document_id je dokument (UID uredaja) kojeg zelis brisati 

    const ukloniUredaj = async () => { 
        try {
            await deleteDoc(doc(db, "mjerna_mjesta", route.params.mm_uid, "uredaji", target_document_id))

            alert("Uređaj uklonjen!")
        } catch (error) {
            alert("Error: " + error.message)
        }
    }
</script>

<template>
    <Header></Header>
    <br>
    <br>
    <br>
    <button @click="dodajUredaj" class="bg-white rounded-xl px-2 py-1 mx-2 my-2 hover:bg-neutral-200 font-bold">Spremi uređaj</button>
    <button @click="ukloniUredaj" class="bg-white rounded-xl px-2 py-1 mx-2 my-2 hover:bg-neutral-200 font-bold">Ukloni uređaj</button>
</template>

<style scoped>

</style>
