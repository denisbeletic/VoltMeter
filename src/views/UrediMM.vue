<script setup>
    import BackButton from '@/components/BackButton.vue';
    import Header from '@/components/Header.vue';
    import { watchAuthStateChange } from '@/composables/watchAuthStateChange';
    import { db } from '@/firebase';
    import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    const route = useRoute()
    const router = useRouter()

    const new_adresa = ref('')
    const new_snaga = ref()
    const new_OMM = ref()
    const new_tvbr_brojila = ref()
    const new_TM = ref('')
    
    const updateMM = async () => {
        try {
            const user = await watchAuthStateChange()   // user je firebase object

            const firestore_dokument = doc(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid)
            await updateDoc(firestore_dokument, {
                adresa: new_adresa.value,
                snaga: new_snaga.value,
                OMM: new_OMM.value,
                tvbr_brojila: new_tvbr_brojila.value,
                TM: new_TM.value
            })

            alert("MM ažurirano!")
            location.reload()
        } catch (error) {
            alert("Error: " + error.message)
        }
    }

    const ukloniMM = async (target_mm_uid) => {
        try {
            const user = await watchAuthStateChange()
            
            const subcollections = ["ocitanja", "uredaji", "racuni"]
            const firestore_dokument = doc(db, "users", user.uid, "mjerna_mjesta", target_mm_uid)
            
            for (const subcollection of subcollections) {   // firebase ne brise sve subcollections, zato treba napraviti "cascading deletion"
                const firestore_subcollection = collection(db, "users", user.uid, "mjerna_mjesta", target_mm_uid, subcollection)
                const snapshot = await getDocs(firestore_subcollection)

                for (const dokument of snapshot.docs) {
                    await deleteDoc(dokument.ref)   // .ref vraca referencu na dokument
                }
            }

            await deleteDoc(doc(db, "users", user.uid, "mjerna_mjesta", target_mm_uid))
            
            alert("Uklonjeno MM!")
            router.push('/')
        } catch (error) {
            alert("Error: " + error.message)
        }
    }

    const podaci = ref('Loading...')    // trenutni podaci MM-a

    onMounted(async () => {
        try {
            const user = await watchAuthStateChange()   // user je firebase object
        
            const firestore_dokument = doc(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid)
            const snapshot = await getDoc(firestore_dokument)

            podaci.value = snapshot.data()
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
    <div class="flex flex-row items-center justify-center h-screen gap-3">
        <div class="flex flex-col items-center justify-center bg-white py-2 px-6 rounded-2xl border-3 border-neutral-600">
            <p class="text-xl font-bold text-emerald-600 mb-5">Podaci:</p>
            <p class="mb-3">Trenutna adresa:</p>
            <input v-model="podaci.adresa" disabled class="text-center font-bold">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <p class="mb-3">Trenutna priključna snaga (kW):</p>
            <input v-model="podaci.snaga" disabled class="text-center font-bold">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <p class="mb-3">Trenutno OMM:</p>
            <input v-model="podaci.OMM" disabled class="text-center font-bold">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <p class="mb-3">Trenutni tvornički broj brojila:</p>        
            <input v-model="podaci.tvbr_brojila" disabled class="text-center font-bold">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <p class="mb-3">Trenutni tarifni model:</p>
            <input v-model="podaci.TM" disabled class="text-center font-bold">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <button @click="ukloniMM(route.params.mm_uid)" class="bg-red-600 hover:bg-red-500 w-full rounded-lg font-bold text-white py-0.5 px-3 my-2">Obriši MM</button>
        </div>
        <form @submit.prevent="updateMM(new_adresa, new_snaga, new_OMM, new_tvbr_brojila, new_TM)" class="flex flex-col items-center justify-center bg-white py-2 px-6 rounded-2xl border-3 border-neutral-600">
            <p class="text-xl font-bold text-amber-600 mb-5">Uredi postojeće mjerno mjesto:</p>
            <label class="mb-3">Adresa:</label>
            <input required v-model="new_adresa" type="text" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Priključna snagu (kW):</label>
            <input required v-model="new_snaga" type="number" step="0.01" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">OMM:</label>
            <input required v-model="new_OMM" type="number" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Tvornički broj brojila:</label>
            <input required v-model="new_tvbr_brojila" type="number" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Tarifni model:</label>
            <select required v-model="new_TM" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
                <option value="Plavi">Plavi</option>
                <option value="Bijeli">Bijeli</option>
                <option value="Crveni">Crveni</option>
            </select>
            <button type="submit" class="bg-amber-600 hover:bg-amber-500 w-full rounded-lg font-bold text-white py-0.5 px-3 my-2">Spremi</button>
        </form>
    </div>
</template>

<style scoped>

</style>
