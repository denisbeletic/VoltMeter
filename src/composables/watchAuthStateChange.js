import { ref } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';

export function watchAuthStateChange() {
    const user = ref(null)

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            user.value = currentUser
        } else {
            user.value = null
        }
    })
    
    return user 
}