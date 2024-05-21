import {defineStore} from "pinia";
import {auth} from "../connection/firebase.js";
import {onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from 'firebase/auth';
import {ref} from "vue";


export const useAuth = defineStore('auth', () => {

    //Variables
    const user = ref(null);
    const email = ref('');
    const password = ref('');
    const loading = ref(true);
    const currentUser = ref();
    //Methods
    const register = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email.value, password.value);
        } catch (e) {
            console.error(e);
        }

    }
    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email.value, password.value);
        } catch (e) {
            console.error(e);
        }

    }
    const logout = async () => {
        try {
            await signOut(auth);
            user.value = null;
        } catch (e) {
            console.error(e);
        }
    }

    onAuthStateChanged(auth, (userFetch) => {
        user.value = userFetch ? {email: userFetch.email, uid: userFetch.uid} : null;
        currentUser.value = auth.currentUser?.uid;

    });
    return {
        email,
        password,
        user,
        register,
        login,
        logout,
        currentUser,
        auth

    }

});