import {ref} from 'vue';
import { useField, useForm } from 'vee-validate';

export const {handleSubmit, handleReset} = useForm({
    validationSchema: {
        name(value) {
            if(value?.length >= 2) return true;
            return 'Name needs to be at least 2 words.'
        },
        price(value) {
            if(value?.length >= 0) return true;
            return 'The price can\'t be less than zero'
        }
    }
})

