import {defineStore} from "pinia";
import {db} from '../connection/firebase.js';
import {collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc, getDoc} from 'firebase/firestore';
import {ref, reactive} from "vue";
import {useAuth} from "./auth.js";

export const useSneaker = defineStore('sneakers', () => {
    //variables
    const sneakers = ref([]);
    const name = ref('');
    const price = ref(0);
    const auth = useAuth();

    //methods
    const addSneaker = async () => {
        await addDoc(collection(db, 'sneakers'), {
            uid: auth.user.uid,
            name: name.value,
            price: price.value
        });

        name.value = '';
        price.value = 0;
    }

    const update = async (product, valuesUpdate) => {
        try {
            const postID = doc(db, "sneakers", product.id);
            await updateDoc(postID, {
                name: valuesUpdate.name,
                price: valuesUpdate.price
            });


        } catch (e) {
            console.error("Error!", e);
        }
    };


    const deleteSneaker = async (id) => {
        const docRef = doc(db, 'sneakers', id);
        await deleteDoc(docRef);
    }

    const fetchSneakers = async () => {
        const docRef = collection(db, 'sneakers');
        onSnapshot(docRef, (querySnapshot) => {
            sneakers.value = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        });
    };

    return {
        sneakers,
        addSneaker,
        deleteSneaker,
        fetchSneakers,
        name,
        price,
        update
    }
});
