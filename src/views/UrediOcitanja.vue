<script setup>
    import BackButton from '@/components/BackButton.vue';
    import Header from '@/components/Header.vue';
    import { useRoute, useRouter } from 'vue-router';
    import { onMounted, ref } from 'vue';
    import { db } from '@/firebase';
    import { doc, collection, getDoc, getDocs, query, addDoc, deleteDoc, updateDoc, Timestamp, orderBy } from 'firebase/firestore';
    import { watchAuthStateChange } from '@/composables/watchAuthStateChange';

    const route = useRoute()
    const router = useRouter()

    const date = ref(null)  // string: "yy-mm-dd"
    const VT = ref(0)
    const NT = ref(0)
    const P1 = ref(0)
    const P2 = ref(0)

    const dodajOcitanje = async () => { 
        try {
            const user = await watchAuthStateChange()

            const date_object = new Date(date.value)
            const firestore_timestamp = Timestamp.fromDate(date_object)     // string "yy-mm-dd" -> date object -> firestore timestamp
            const novo_ocitanje = await addDoc(collection(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "ocitanja"), {
                date: firestore_timestamp,
                VT: VT.value,
                NT: NT.value,
                P1: P1.value,
                P2: P2.value
            })

            await updateDoc(novo_ocitanje, {  // spremamo firebaseov id unutar tijela dokumenta
                uid: novo_ocitanje.id
            })

            alert("Dodano očitanje!")
            location.reload()
        } catch (error) {
            alert("Error: " + error.message)
        }
    }
    
    const ukloniOcitanje = async (target_document_id) => { 
        try {
            const user = await watchAuthStateChange()
            await deleteDoc(doc(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "ocitanja", target_document_id))
            location.reload()

            alert("Uklonjeno očitanje!")
        } catch (error) {
            alert("Error: " + error.message)
        }
    }

    const tm_plavi = ref(false)
    const tm_bijeli = ref(false)
    const tm_crveni = ref(false)

    const nula = ref(0)

    const snapshot = ref(null)
    const ocitanja_data = ref([])

    onMounted(async () => {
        try {
            const user = await watchAuthStateChange()
            const mjerno_mjesto = await getDoc(doc(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid))    // TM-based unos ocitanja
            const tm = mjerno_mjesto.data().TM

            switch (tm) {
                case "Plavi":
                    tm_plavi.value = true
                    break
                case "Bijeli":
                    tm_bijeli.value = true
                    break
                case "Crveni":
                    tm_crveni.value = true
                    break
            }
            
            const firestore_query = query(  // sortiranje ocitanja
                collection(db, "users", user.uid, "mjerna_mjesta", route.params.mm_uid, "ocitanja"),
                orderBy("date", "desc")
            )

            const firestore_dokumenti = await getDocs(firestore_query)  
            snapshot.value = firestore_dokumenti

            for (const item of snapshot.value.docs) {
                const podaci = item.data()
                ocitanja_data.value.push(podaci)
            }

            for (let item of ocitanja_data.value) {   // formatiranje firestore timestamp-a natrag u string "yyyy-mm-dd"
                const date_object = item.date.toDate()
                const day = date_object.getDate()
                const month = date_object.getMonth() + 1
                const year = date_object.getFullYear()

                const date_string = `${day}/${month}/${year}`
                item.date = date_string
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
    </Header>
    <div class="flex flex-row items-center justify-center h-screen gap-5">
        <form @submit.prevent="dodajOcitanje" v-if="tm_plavi" class="flex flex-col items-center justify-center bg-white py-2 px-6 h-150 rounded-2xl border-3 border-neutral-600">
            <p class="text-xl font-bold text-emerald-600 mb-5">Dodaj novo očitanje</p>
            <label class="mb-3">Upišite datum očitanja:</label>
            <input required v-model="date" type="date" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Upišite stanje više tarife - 1.8.1 (kWh):</label>
            <input required v-model="VT" type="number" step="0.01" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3 line-through">Upišite stanje niže tarife - 1.8.2 (kWh):</label>
            <input disabled v-model="nula" type="number" step="0.01" class="bg-neutral-400 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3 line-through">Upišite prvu snagu - 1.6.1 (kW):</label>
            <input disabled v-model="nula" type="number" step="0.01" class="bg-neutral-400 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3 line-through">Upišite drugu snagu - 1.6.2 (kW):</label>
            <input disabled v-model="nula" type="number" step="0.01" class="bg-neutral-400 border rounded-lg px-2 py-1 mb-3">
            <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 w-full rounded-lg font-bold text-white py-0.5 px-3 my-2">Dodaj</button>
        </form>
        <form @submit.prevent="dodajOcitanje" v-if="tm_bijeli" class="flex flex-col items-center justify-center bg-white py-2 px-6 h-150 rounded-2xl border-3 border-neutral-600">
            <p class="text-xl font-bold text-emerald-600 mb-5">Dodaj novo očitanje</p>
            <label class="mb-3">Upišite datum očitanja:</label>
            <input required v-model="date" type="date" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Upišite stanje više tarife - 1.8.1 (kWh):</label>
            <input required v-model="VT" type="number" step="0.01" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Upišite stanje niže tarife - 1.8.2 (kWh):</label>
            <input required v-model="NT" type="number" step="0.01" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3 line-through">Upišite prvu snagu - 1.6.1 (kW):</label>
            <input disabled v-model="nula" type="number" step="0.01" class="bg-neutral-400 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3 line-through">Upišite drugu snagu - 1.6.2 (kW):</label>
            <input disabled v-model="nula" type="number" step="0.01" class="bg-neutral-400 border rounded-lg px-2 py-1 mb-3">
            <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 w-full rounded-lg font-bold text-white py-0.5 px-3 my-2">Dodaj</button>
        </form>
        <form @submit.prevent="dodajOcitanje" v-if="tm_crveni" class="flex flex-col items-center justify-center bg-white py-2 px-6 h-150 rounded-2xl border-3 border-neutral-600">
            <p class="text-xl font-bold text-emerald-600 mb-5">Dodaj novo očitanje</p>
            <label class="mb-3">Upišite datum očitanja:</label>
            <input required v-model="date" type="date" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Upišite stanje više tarife - 1.8.1 (kWh):</label>
            <input required v-model="VT" type="number" step="0.01" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Upišite stanje niže tarife - 1.8.2 (kWh):</label>
            <input required v-model="NT" type="number" step="0.01" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Upišite prvu snagu - 1.6.1 (kW):</label>
            <input required v-model="P1" type="number" step="0.01" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            <label class="mb-3">Upišite drugu snagu - 1.6.2 (kW):</label>
            <input required v-model="P2" type="number" step="0.01" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
            <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 w-full rounded-lg font-bold text-white py-0.5 px-3 my-2">Dodaj</button>
        </form>
        <div v-if="ocitanja_data && ocitanja_data.length > 0" class="flex flex-col justify-start items-start bg-white py-2 px-6 my-15 h-150 overflow-y-auto rounded-md border-3 border-neutral-600">
            <div v-for="item in ocitanja_data" class="my-3">
                <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
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
                <button @click="ukloniOcitanje(item.uid)" class="bg-red-600 hover:bg-red-500 w-full rounded-lg font-bold text-white py-0.5 px-3">Obriši</button>
                <div class="w-full h-0.5 bg-neutral-600 my-2"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
