<script lang="js">
import {defineComponent, ref, reactive, onMounted, onUnmounted, computed} from "vue";
import {useSneaker} from "../../stores/sneakers.js";
import {Property} from "../../properties/property.js";
import {useAuth} from "../../stores/auth.js";
import {collection, doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../connection/firebase.js";

export default defineComponent({
  name: "ListView",
  setup() {
    const sneakerStore = useSneaker();
    const auth = useAuth();
    const prop = reactive(new Property({}, {
      container: 'container',
    }));
    const valuesUpdate = reactive({
      name: "",
      price: 0
    });
    const selectedSneaker = ref(null);
    const dialog = ref(false);
    const itemsPerPage = ref(5);
    const currentPage = ref(1);

    const deleteSneaker = (id) => {
      sneakerStore.deleteSneaker(id).then((data) => {
        console.log("Item was deleted " + data);
      }).catch((error) => {
        console.error(error);
      });
    };

    const updateDocument = async () => {
      if (selectedSneaker.value) {
        await sneakerStore.update(selectedSneaker.value, valuesUpdate);
        dialog.value = false;
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
      paginatedItems
    };
  }
});
</script>

<template>
  <div>
    <v-container fluid>
      <v-card variant="outlined" class="mx-auto" max-width="500px">
        <v-card-title class="text-center text-h5 font-weight-bold">
          Inventory
          <v-divider></v-divider>
        </v-card-title>

        <v-list>
          <v-list-item v-for="item in paginatedItems" :key="item.id">
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
                            variant="underlined"
                        ></v-text-field>
                        <v-text-field
                            v-model="valuesUpdate.price"
                            color="green"
                            label="Price"
                            type="number"
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

</style>