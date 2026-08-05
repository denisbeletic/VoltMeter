<script setup>
    import Header from '@/components/Header.vue';
    import { getDocs, collection } from 'firebase/firestore';
    import { onMounted, ref } from 'vue';
    import { RouterLink } from 'vue-router';
    import { db } from '@/firebase';
            
    const snapshot = ref(null)
    const OMM_data = ref([])
    
    onMounted(async () => {
        const firestore_dokumenti = await getDocs(collection(db, "mjerna_mjesta"))
        snapshot.value = firestore_dokumenti

        for (const item of snapshot.value.docs) {
            const podaci = item.data()  // data() vraca objekt
            OMM_data.value.push(podaci)
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
    <div v-if="snapshot" class="flex flex-row gap-5 mx-5 my-5">
        <RouterLink :to="`/pregledmm/${item.uid}`" v-for="item in OMM_data" class="flex flex-row justify-center items-center border-3 border-neutral-600 px-5 py-3 rounded-2xl bg-white hover:border-amber-500 text-lg gap-3">
            <div class="flex flex-col text-right font-bold text-emerald-600">
                <p>Adresa:</p>
                <p>OMM:</p>
                <p>Snaga:</p>
                <p>TM:</p>
            </div>
            <div class="flex flex-col text-left">
                <p>{{ item.adresa }}</p>
                <p>{{ item.OMM }}</p>
                <p>{{ item.snaga }}</p>
                <p>{{ item.TM }}</p>
            </div>
        </RouterLink>
    </div>
</template>

<style scoped>

</style>
