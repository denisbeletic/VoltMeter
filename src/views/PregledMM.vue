<script setup>
    // TODO: Napraviti pregled pojedinog mm-a, doraditi firebase
    import Header from '@/components/Header.vue';
    import { useRoute, RouterLink } from 'vue-router';

    const route = useRoute()
</script>

<template>
    <Header></Header>
    <br>
    <br>
    <br>
    <h1 class="mx-2 my-2">{{ route.params.mm_uid }}</h1>
    <RouterLink :to="`/pregledmm/${route.params.mm_uid}/urediocitanja`" class="bg-white rounded-xl px-2 py-1 mx-2 my-2 hover:bg-neutral-200 font-bold">Idi na očitanja</RouterLink>
    <RouterLink :to="`/pregledmm/${route.params.mm_uid}/urediuredaje`" class="bg-white rounded-xl px-2 py-1 mx-2 my-2 hover:bg-neutral-200 font-bold">Idi na uređaje</RouterLink>
    <RouterLink :to="`/pregledmm/${route.params.mm_uid}/pregledracuna`" class="bg-white rounded-xl px-2 py-1 mx-2 my-2 hover:bg-neutral-200 font-bold">Idi na račune</RouterLink>
    <RouterLink :to="`/pregledmm/${route.params.mm_uid}/analitika`" class="bg-white rounded-xl px-2 py-1 mx-2 my-2 hover:bg-neutral-200 font-bold">Idi na analitiku</RouterLink>
    <div class="flex flex-row mx-5 my-5 justify-evenly gap-50">
        <div class="flex flex-col justify-start items-start h-75 overflow-y-auto border-3 border-neutral-600 px-5 py-3 rounded-md bg-white text-lg gap-3">
            <div class="flex flex-col">
                <div class="flex flex-row font-bold">
                    <p>18.06.2026</p>
                </div>
                <div class="flex flex-row gap-3">
                    <p>A+_T1 / VT:</p><span>5.7</span>
                    <p>P+_T1 / P1:</p><span>2</span>
                </div>
                <div class="flex flex-row gap-2">
                    <p>A+_T2 / NT:</p><span>3.7</span>
                    <p>P+_T2 / P2:</p><span>1</span>
                </div>
            </div>
            <div class="bg-neutral-600 w-full h-0.5 shrink-0"></div>
            <div class="flex flex-col">
                <p>bbbbbbbbbbbbbbbbbb</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
            </div>
            <div class="bg-neutral-600 w-full h-0.5 shrink-0"></div>
            <div class="flex flex-col">
                <p>ccccccccccccccccccc</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
            </div>
            <div class="bg-neutral-600 w-full h-0.5 shrink-0"></div>
            <div class="flex flex-col">
                <p>ddddddddddddddddddddd</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
            </div>
        </div>
        <div class="flex flex-col justify-start items-start h-75 overflow-y-auto border-3 border-neutral-600 px-5 py-3 rounded-md bg-white text-lg gap-3">
            <div class="flex flex-col">
                <p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
            </div>
            <div class="bg-neutral-600 w-full h-0.5 shrink-0"></div>
            <div class="flex flex-col">
                <p>bbbbbbbbbbbbbbbbbb</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
            </div>
            <div class="bg-neutral-600 w-full h-0.5 shrink-0"></div>
            <div class="flex flex-col">
                <p>ccccccccccccccccccc</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
            </div>
            <div class="bg-neutral-600 w-full h-0.5 shrink-0"></div>
            <div class="flex flex-col">
                <p>ddddddddddddddddddddd</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
            </div>
        </div>
    </div>
    <div class="flex flex-row mx-5 my-5 justify-evenly gap-50">
        <div class="flex flex-col justify-start items-start h-75 overflow-y-auto border-3 border-neutral-600 px-5 py-3 rounded-md bg-white text-lg gap-3">
            <div class="flex flex-col">
                <p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
            </div>
            <div class="bg-neutral-600 w-full h-0.5 shrink-0"></div>
            <div class="flex flex-col">
                <p>bbbbbbbbbbbbbbbbbb</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
            </div>
            <div class="bg-neutral-600 w-full h-0.5 shrink-0"></div>
            <div class="flex flex-col">
                <p>ccccccccccccccccccc</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
            </div>
            <div class="bg-neutral-600 w-full h-0.5 shrink-0"></div>
            <div class="flex flex-col">
                <p>ddddddddddddddddddddd</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
            </div>
        </div>
        <div class="flex flex-col justify-center items-center text-center h-75 border-3 border-neutral-600 px-5 py-3 rounded-md bg-white text-lg gap-3">
            <div class="flex flex-col">
                <p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                <p>a</p>
                <p>a</p>
                <p>a</p>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
