<script setup>
    // TODO: Dovrsiti sign up, login i deletion -> potrebno povezati sa formom, staviti formu u drugu .vue datoteku...
    import { ref } from 'vue';
    import {
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        deleteUser,
        onAuthStateChanged
     } from 'firebase/auth';
    import { auth } from '@/firebase';
    import { User } from 'lucide-vue-next';

    const test = () => alert('Button test...')

    const user = ref(null)
    const email = ref('abcd@gmail.com')
    const password = ref('abcd123')

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            user.value = currentUser
        } else {
            user.value = null
        }
    })

    const registerUser = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
            alert("Uspješno ste se registrirali.")
        } catch (error) {
            alert("Error: " + error.message)
        }
    }

    const loginUser = async () => {
        try {
            if (user) {
                throw new Error("Već ste prijavljeni!")
            }

            const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
            alert("Uspješno ste se prijavili.")
        } catch (error) {
            alert("Error: " + error.message)
        }
    }
    
    const removeUser = async () => {
        try {
            const userDeletion = await deleteUser(auth.currentUser)
            alert("Uspješno ste obrisali račun.")
        } catch (error) {
            alert("Error: " + error.message)
        }
    }
</script>

<template>
    <header class="flex flex-row items-center justify-between bg-neutral-600 py-4 px-12">
        <div class="text-2xl font-bold">
            <span class="text-white">Volt</span>
            <span class="text-emerald-500">Meter</span>
        </div>
        <button class="border-3 rounded-2xl p-1 border-white hover:bg-neutral-500" @click="loginUser">
            <User size="35" color="white"></User>
        </button>
        <button class="border-3 rounded-2xl p-1 border-white hover:bg-neutral-500" @click="registerUser">
            <User size="35" color="yellow"></User>
        </button>
        <button class="border-3 rounded-2xl p-1 border-white hover:bg-neutral-500" @click="removeUser">
            <User size="35" color="red"></User>
        </button>
        <span v-if="user" class="text-emerald-600"> Prijavljen korisnik: <b>{{ user.email }}</b> </span>
    </header>
    <div class="bg-neutral-400 h-1"></div>
</template>

<style scoped>

</style>
