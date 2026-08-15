<script setup>
    import { onMounted } from 'vue';
    import { useRouter, RouterLink } from 'vue-router';
    import { User, Zap } from 'lucide-vue-next';
    import { onAuthStateChanged } from 'firebase/auth';
    import { auth } from '@/firebase';

    const router = useRouter()
    
    const handleClick = () => {     // reload stranice ako smo na /, inace preusmjeri na /
        if (router.currentRoute.value.path == "/") {
            location.reload()
        }
    }

    onMounted(() => {
        onAuthStateChanged(auth, (user) => {    // force-redirect na login ako niste prijavljeni
            if (!user) {
                router.push('/login')
            }
        })
    })
</script>

<template>
    <header class="flex flex-row items-center justify-between bg-neutral-600 py-4 px-12 fixed w-full">
        <div class="flex flex-row items-center gap-5">
            <RouterLink to="/" @click="handleClick" class="flex flex-row items-center justify-center text-2xl font-bold hover:bg-neutral-500 rounded-2xl py-1 px-2">
                <span class="text-white">Volt</span>
                <span class="text-emerald-500">Meter</span>
                <Zap color="yellow" fill="yellow" class="ml-1"></Zap>
            </RouterLink>
            <slot name="Slot1"></slot>
            <slot name="Slot2"></slot>
        </div>
        <div class="flex flex-row items-center gap-10">
            <RouterLink to="/login" class="border-3 rounded-2xl p-1 border-white hover:bg-neutral-500">
                <User size="35" color="white"></User>
            </RouterLink>
        </div>
    </header>
    <div class="bg-neutral-400 h-1"></div>
</template>

<style scoped>

</style>