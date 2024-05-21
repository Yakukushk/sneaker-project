<script lang="js">
import {defineComponent, ref} from "vue";
import {useSneaker} from "../../stores/sneakers.js";
import {useAuth} from "../../stores/auth.js";

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



    const addSneakers = () => {
      sneaker.addSneaker().then((data) => {
        console.log(data);

      }).catch((error) => {
        console.error(error);
      });
    };

    return {
      addSneakers,
      auth,
      sneaker
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
      <v-container>
        <v-text-field
            v-model="sneaker.name"
            color="green"
            label="Sneaker Name"
            variant="underlined"
        ></v-text-field>
        <v-text-field
            v-model="sneaker.price"
            color="green"
            label="Price"
            type="number"
            variant="underlined"
        ></v-text-field>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeDialog()">
          Disagree
          <v-tooltip activator="parent" location="bottom">Close Form</v-tooltip>
        </v-btn>
        <v-btn @click.prevent="addSneakers" color="success">
          Add Sneaker
          <v-icon end>mdi-chevron-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dialog-container {
  margin: 10px 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
