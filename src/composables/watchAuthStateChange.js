import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';

export function watchAuthStateChange() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                resolve(currentUser)
            }
        })
    })
}