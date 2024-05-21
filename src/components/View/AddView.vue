<script lang="js">
import { defineComponent, ref } from "vue";
import { useSneaker } from "../../stores/sneakers.js";
import { useAuth } from "../../stores/auth.js";
import useVuelidate from "@vuelidate/core";
import { required, minLength, minValue } from "@vuelidate/validators";

export default defineComponent({
  name: 'AddView',
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    closeDialog: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const sneaker = useSneaker();
    const auth = useAuth();
    const snackbar = ref(false);
    const timeout = ref(2000); // Ensure timeout is defined

    const rules = {
      name: { required, minLength: minLength(3) },
      price: { required, minValue: minValue(0) }
    };

    const v$ = useVuelidate(rules, sneaker);

    const addSneakers = async () => {
      const result = await v$.value.$validate();
      if (result) {
        try {
          await sneaker.addSneaker();
          props.closeDialog();
          snackbar.value = true; // Show snackbar on successful addition
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error('Validation failed');
      }
    };

    return {
      addSneakers,
      auth,
      sneaker,
      v$,
      snackbar,
      timeout // Return timeout
    };
  }
});
</script>

<template>
  <v-dialog
      v-model="dialog"
      max-width="400"
      persistent
  >
    <v-card
        prepend-icon="mdi-shoe-sneaker"
        title="Adding Form"
    >
      <v-form @submit.prevent="addSneakers">
        <v-container>
          <v-text-field
              v-model="sneaker.name"
              color="green"
              label="Sneaker Name"
              :error-messages="v$.name.$errors.map(e => e.$message)"
              @blur="v$.name.$touch"
              @input="v$.name.$touch"
              required
              variant="underlined"
          ></v-text-field>

          <v-text-field
              v-model="sneaker.price"
              color="green"
              label="Price"
              type="number"
              :error-messages="v$.price.$errors.map(e => e.$message)"
              @blur="v$.price.$touch"
              @input="v$.price.$touch"
              required
              variant="underlined"
          ></v-text-field>

        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog()">
            Disagree
            <v-tooltip activator="parent" location="bottom">Close Form</v-tooltip>
          </v-btn>
          <v-btn color="success" type="submit">
            Add Sneaker
            <v-icon end>mdi-chevron-right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
  <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
  >
    Your item was added
    <template v-slot:actions>
      <v-btn
          color="green"
          variant="text"
          @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
.dialog-container {
  margin: 10px 10px;
  display: flex;
  justify-content: flex-end;
}
.error-msg {
  color: darkred;
}
</style>
