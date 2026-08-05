<script setup>
    import Header from '@/components/Header.vue';
    import { useRoute } from 'vue-router';
    import { db } from '@/firebase';
    import { doc, collection, addDoc, deleteDoc } from 'firebase/firestore';

    const route = useRoute()

    // TODO: Dodaj provjeru i zabarnu unosa ocitanja koje je "manje" od prijasnjeng

    const dodajOcitanje = async () => { 
        try {
            const novo_ocitanje = await addDoc(collection(db, "mjerna_mjesta", route.params.mm_uid, "ocitanja"), {
                VT: 1001,
                NT: 203,
                P1: 24.5,
                P2: 12.4
            }) 

            alert("Dodano očitanje!")
        } catch (error) {
            alert("Error: " + error.message)
        }
    }

    // target_document_id je dokument (UID uredaja) kojeg zelis brisati

    const ukloniOcitanje = async () => { 
        try {
            await deleteDoc(doc(db, "mjerna_mjesta", route.params.mm_uid, "ocitanja", target_document_id))

            alert("Uklonjeno očitanje!")
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
    <button @click="dodajOcitanje" class="bg-white rounded-xl px-2 py-1 mx-2 my-2 hover:bg-neutral-200 font-bold">Spremi očitanje</button>
    <button @click="ukloniOcitanje" class="bg-white rounded-xl px-2 py-1 mx-2 my-2 hover:bg-neutral-200 font-bold">Ukloni očitanje</button>
</template>

<style scoped>

</style>
