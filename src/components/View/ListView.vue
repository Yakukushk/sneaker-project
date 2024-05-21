<script lang="js">
import {defineComponent, ref, reactive, onMounted, onUnmounted, computed} from "vue";
import {useSneaker} from "../../stores/sneakers.js";
import {Property} from "../../properties/property.js";
import {useAuth} from "../../stores/auth.js";
import {collection, doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../connection/firebase.js";
import {minLength, minValue, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default defineComponent({
  name: "ListView",
  setup() {
    const sneakerStore = useSneaker();
    const auth = useAuth();
    const prop = reactive(new Property({}, {
      container: 'container',
      list: 'list'
    }));
    const valuesUpdate = reactive({
      name: "",
      price: 0
    });
    const snackbar = ref(false);
    const snackbarRemove = ref(false);
    const timeout = ref( 2000);
    const selectedSneaker = ref(null);
    const dialog = ref(false);
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const rules = {
      name: { required, minLength: minLength(3) },
      price: { required, minValue: minValue(0) }
    };
    const v$ = useVuelidate(rules, valuesUpdate);
    const deleteSneaker = (id) => {
      sneakerStore.deleteSneaker(id).then((data) => {
        console.log("Item was deleted " + data);
        snackbarRemove.value = true;
      }).catch((error) => {
        console.error(error);
      });
    };

    const updateDocument = async () => {
      const result = await v$.value.$validate();
      if(result) {
        if (selectedSneaker.value) {
          await sneakerStore.update(selectedSneaker.value, valuesUpdate);
          snackbar.value = true;
          dialog.value = false;
        }
      }
      else {
        console.error('Validation failed');
      }
    };

    const editForm = async (sneaker) => {
      const docEdit = await getDoc(doc(db, "sneakers", sneaker.id));
      if (docEdit.exists()) {
        selectedSneaker.value = sneaker;
        Object.assign(valuesUpdate, docEdit.data());
        dialog.value = true;
      }
    };

    onMounted(() => sneakerStore.fetchSneakers());
    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return sneakerStore.sneakers.slice(start, end);
    });

    return {
      editForm,
      deleteSneaker,
      sneakerStore,
      prop,
      auth,
      dialog,
      valuesUpdate,
      updateDocument,
      itemsPerPage,
      currentPage,
      paginatedItems,
      v$,
      snackbar,
      timeout,
      snackbarRemove
    };
  }
});
</script>

<template>
  <div>
    <v-container fluid>
      <v-card variant="outlined" class="mx-auto" max-width="500px" v-motion-pop-visible-once>
        <v-card-title class="text-center text-h5 font-weight-bold">
          Inventory
          <v-divider></v-divider>
        </v-card-title>

        <v-list  :class="prop.classObject.list" >
          <v-list-item  v-for="item in paginatedItems" :key="item.id" v-motion-slide-visible-once-left>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.price }} $</v-list-item-subtitle>
            <v-list-item-action v-if="item.uid === auth.currentUser">
              <v-dialog
                  v-model="dialog"
                  max-width="400"
                  persistent
              >
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn v-bind="activatorProps" @click.prevent="editForm(item)" color="green" variant="outlined"
                         class="ma-2">Edit
                  </v-btn>
                </template>
                <template v-slot:default="{ isActive }">
                  <v-form @submit.prevent="updateDocument">
                    <v-card prepend-icon="mdi-eraser" title="Updating Form">
                      <v-container>
                        <v-text-field
                            v-model="valuesUpdate.name"
                            color="green"
                            label="Sneaker Name"
                            :error-messages="v$.name.$errors.map(e => e.$message)"
                            @blur="v$.name.$touch"
                            @input="v$.name.$touch"
                            required
                            variant="underlined"
                        ></v-text-field>
                        <v-text-field
                            v-model="valuesUpdate.price"
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
                        <v-btn @click="dialog = false">Close</v-btn>
                        <v-btn type="submit" color="success">
                          Update
                          <v-icon end>mdi-chevron-right</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-form>
                </template>
              </v-dialog>
              <v-btn color="red" variant="outlined" @click="deleteSneaker(item.id)">Delete</v-btn>
            </v-list-item-action>
            <v-divider class="mt-5"></v-divider>
          </v-list-item>
        </v-list>
        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
        >
          Your item was updated
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
          <v-snackbar
              v-model="snackbarRemove"
              :timeout="timeout"
          >
            Your item was removed
            <template v-slot:actions>
              <v-btn
                  color="green"
                  variant="text"
                  @click="snackbarRemove = false"
              >
                Close
              </v-btn>
            </template>

        </v-snackbar>
        <v-pagination
            v-model="currentPage"
            :length="Math.ceil(sneakerStore.sneakers.length / itemsPerPage)"
            :total-visible="5"
            class="mt-4"
        ></v-pagination>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.list {
  overflow-x: hidden;
  overflow: hidden;
}
</style>