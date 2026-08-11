<script setup>
    import Header from '@/components/Header.vue';
    import { watchAuthStateChange } from '@/composables/watchAuthStateChange';
    import { onMounted, ref } from 'vue';
    import {
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut,
        deleteUser
    } from 'firebase/auth';
    import { auth } from '@/firebase';

    onMounted(async () => {
        const user = watchAuthStateChange()
    })

    const emailRegister = ref('')
    const passwordRegister = ref('')
    const emailLogin = ref('')
    const passwordLogin = ref('')

    const registerUser = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, emailRegister.value, passwordRegister.value)
            alert("Uspješno ste se registrirali.")
        } catch (error) {
            alert("Error: " + error.message)
        }
        emailRegister.value = ''
        passwordRegister.value = ''
    }

    const loginUser = async () => {
        try {
            if (auth.currentUser) {
                throw new Error("Već ste prijavljeni!")
            }   
            const userCredential = await signInWithEmailAndPassword(auth, emailLogin.value, passwordLogin.value)
            alert("Uspješno ste se prijavili.")
        } catch (error) {
            alert("Error: " + error.message)
        }
        emailLogin.value = ''
        passwordLogin.value = ''
    }   
    const logoutUser = () => {
        try {
            signOut(auth)
            alert("Uspješno ste se odjavili.")
            location.reload()
        } catch (error) {
            alert("Error: " + error.message)
        }
    }

    const removeUser = async () => {
        try {
            const userDeletion = await deleteUser(auth.currentUser)
            alert("Uspješno ste obrisali račun.")
            location.reload()
        } catch (error) {
            alert("Error: " + error.message)
        }
    }
</script>

<template>
    <Header></Header>
    <div class="flex items-center justify-center h-screen">
        <div class="flex flex-col border-3 border-neutral-600 px-7 py-5 rounded-2xl bg-white/90">
            <div class="flex flex-row gap-10">
                <form @submit.prevent="loginUser" class="flex flex-col items-center justify-center">
                    <p class="text-xl font-bold text-emerald-600 mb-5">Prijava</p>
                    <label class="mb-3">Upišite e-mail adresu:</label>
                    <input v-model="emailLogin" type="text" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
                    <label class="mb-3">Upišite lozinku:</label>
                    <input v-model="passwordLogin" type="password" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
                    <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 w-full rounded-lg font-bold text-white py-0.5 mt-0.5">Prijavi se</button>
                </form>
                <div class="w-0.5 bg-neutral-600"></div>
                <form @submit.prevent="registerUser" class="flex flex-col items-center justify-center">
                    <p class="text-xl font-bold text-amber-600 mb-5">Registracija</p>
                    <label class="mb-3">Upišite e-mail adresu:</label>
                    <input v-model="emailRegister" type="text" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
                    <label class="mb-3">Upišite lozinku:</label>
                    <input v-model="passwordRegister" type="password" class="bg-neutral-200 border rounded-lg px-2 py-1 mb-3">
                    <button type="submit" class="bg-amber-600 hover:bg-amber-500 w-full rounded-lg font-bold text-white py-0.5 mt-0.5">Registriraj se</button>
                </form>
            </div>
            <div v-if="auth.currentUser" class="flex flex-col">
                <div class="flex flex-row items-center justify-center mt-5 mb-3">
                    <div class="w-full h-0.5 bg-neutral-600"></div>
                </div>
                <div class="flex flex-row items-center justify-center">
                    <button @click="logoutUser" class="bg-yellow-500 hover:bg-yellow-400 w-full rounded-lg font-bold text-white py-0.5 mt-0.5">Odjava</button>
                </div>
                <div class="flex flex-row items-center justify-center mt-4 mb-3">
                    <div class="w-full h-0.5 bg-neutral-600"></div>
                </div>
                <div class="flex flex-row items-center justify-center">
                    <button @click="removeUser" class="bg-indigo-500 hover:bg-indigo-400 w-full rounded-lg font-bold text-white py-0.5 mt-0.5">Obriši račun</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>