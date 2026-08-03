<script setup>
    // TODO: Pregled ubacenih MM-a, doraditi firebase strukturu
    import Header from '@/components/Header.vue';
    import { getDocs, collection } from 'firebase/firestore';
    import { onMounted, ref, /*watchEffect*/ } from 'vue';
    import { RouterLink, RouterView } from 'vue-router';
    import { db } from '@/firebase';
    // import { useCounterStore } from '@/stores/counter';
    // import { watchAuthStateChange } from '@/composables/watchAuthStateChange';
    
    // const user = watchAuthStateChange()
    // const counterStore = useCounterStore();

    // watchEffect(() => {
        //     if (snapshot.value != null) {
            //         // console.log(snapshot.value.docs[0].data())
            //         // console.log(snapshot.value.docs)
            //     }
            // })
            
    const snapshot = ref(null)
    const data = ref({})
    
    onMounted(async () => {
        const firestore_dokumenti = await getDocs(collection(db, "mjerna_mjesta"))
        snapshot.value = firestore_dokumenti

        for (const item of snapshot.value.docs) {
            const podaci = item.data()  // data() vraca objekt
            data.value[item.id] = podaci
            console.log(data.value)
        }
    })

</script>

<template>
    <Header>
        <template #Slot1>
            <RouterLink to="/kreirajmm" class="bg-emerald-600 hover:bg-emerald-500 w-full rounded-lg font-bold text-white py-1 px-2">+ Dodaj novo MM</RouterLink>
        </template>
    </Header>
    <br>
    <br>
    <br>
    <p class="flex flex-row items-center text-center justify-center bg-white">AAA</p>
    <div v-if="snapshot">
        <div v-for="item in data" class="flex flex-row w-fit h-fit justify-center items-center bg-red-500">
            <p>{{ item }}</p>
        </div>
    </div>
</template>

<style scoped>

</style>
