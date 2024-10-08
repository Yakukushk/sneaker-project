<script setup>
import {reactive, ref, toRefs} from "vue";
import {useRouter} from "vue-router";
import {useAuth} from "../../stores/auth.js";
import AddView from "../View/AddView.vue";
import {Property} from "../../properties/property.js";
import {required, minLength, minValue} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const router = useRouter();
const tab = ref(null);
const auth = useAuth();
const dialog = ref(false);
const newDialog = ref(false);
const getLogin = ref(false);
const openDialog = () => {
  newDialog.value = true;
}
const snackBarLogin = ref(false);
const snackBarRegister = ref(false);
const timeout = ref(2000);
const text = ref('');

const newRules = {
  email: {required},
  password: {required}
}

const vs$ = useVuelidate(newRules, auth);

const closeDialog = () => {
  newDialog.value = false;
};

const register = async () => {
  const result = await vs$.value.$validate();

    auth.register().then((data) => {
      console.log(data);
      dialog.value = false;
      auth.email = "";
      auth.password = "";
      snackBarRegister.value = true
      text.value = "Registration Complete"
    }).catch((error) => {
      console.error(error);
    });

}

const login = async () => {
  const result = await vs$.value.$validate();

  auth.login().then((data) => {
    console.log(data);
    dialog.value = false;
    auth.email = "";
    auth.password = "";

  }).catch((error) => {
    console.error(error);
    snackBarLogin.value = true

  });

};

const prop = reactive(new Property({}, {
  dialogContainer: 'dialog-container',
  textContainer: 'text-container',
  link: 'link-text'
}));
</script>

<template>
  <v-card>
    <v-card-title class="text-center justify-center py-6">
      <h1 :style="prop.styleObject" class="text">
        Store Sneakers
      </h1>
    </v-card-title>
    <div :class="prop.classObject.dialogContainer">
      <v-dialog v-model="dialog" max-width="400" persistent>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-if="!auth.user" v-bind="activatorProps">
            Login
          </v-btn>
        </template>

        <v-card prepend-icon="mdi-account" v-if="!getLogin">
          <v-container>
            <h3>Registration Form</h3>
            <v-text-field
                v-model="auth.email"
                color="green" label="Email"
                @blur="vs$.email.$touch"
                @input="vs$.email.$touch"
                variant="underlined"
                :error-messages="vs$.email.$errors.map(e => e.$message)"
                required
            ></v-text-field>

            <v-text-field
                v-model="auth.password"
                @blur="vs$.password.$touch"
                @input="vs$.password.$touch"
                :error-messages="vs$.password.$errors.map(e => e.$message)"
                color="green"
                label="Password"
                placeholder="Enter your password"
                variant="underlined"></v-text-field>
            <p :class="prop.classObject.link" @click.prevent="getLogin = true">Do you have an existing account?</p>
          </v-container>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = false">
              Disagree
              <v-tooltip activator="parent" location="bottom">Close Form</v-tooltip>
            </v-btn>
            <v-btn @click.prevent="register()" color="success">
              Complete Registration
              <v-icon end>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card prepend-icon="mdi-account" v-else>
          <v-container>
            <h3>Login Form</h3>
            <v-text-field
                v-model="auth.email"
                color="green" label="Email"
                @blur="vs$.email.$touch"
                @input="vs$.email.$touch"
                variant="underlined"
                :error-messages="vs$.email.$errors.map(e => e.$message)"
                required
            ></v-text-field>

            <v-text-field
                v-model="auth.password"
                @blur="vs$.password.$touch"
                @input="vs$.password.$touch"
                :error-messages="vs$.password.$errors.map(e => e.$message)"
                color="green"
                label="Password"
                placeholder="Enter your password"
                variant="underlined"></v-text-field>
            <p :class="prop.classObject.link" @click.prevent="getLogin = false">Don't you have an existing account?</p>
          </v-container>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = false">
              Disagree
              <v-tooltip activator="parent" location="bottom">Close Form</v-tooltip>
            </v-btn>
            <v-btn @click.prevent="login()" color="success">
              Log in
              <v-icon end>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div class="text-center" v-if="auth.user">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title>
                <h3 v-if="auth.user">{{ auth.user.email }}</h3>
              </v-list-item-title>
              <v-list-item-title>
                <v-btn @click.prevent="openDialog" class="mt-2" icon variant="text">
                  <v-icon>mdi-plus</v-icon>
                  <v-tooltip activator="parent" location="bottom">Add Item</v-tooltip>
                </v-btn>
                <v-btn class="mt-2" icon variant="text" v-if="auth.user" @click="auth.logout">
                  <v-icon>mdi-logout</v-icon>
                  <v-tooltip activator="parent" location="bottom">Log out</v-tooltip>
                </v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <AddView :dialog="newDialog" :close-dialog="closeDialog"/>
    <v-tabs v-model="tab" align-tabs="center" fixed-tabs color="green">
      <v-tab @click.prevent="router.push('/')" :value="1">Home</v-tab>
      <v-divider inset vertical></v-divider>
      <v-tab @click.prevent="router.push('/about')" :value="2">About</v-tab>
      <v-divider inset vertical></v-divider>
      <v-tab @click.prevent="router.push('/employees')" :value="3">Employees</v-tab>
    </v-tabs>
  </v-card>

  <slot/>
  <v-snackbar
      v-model="snackBarLogin"
      :timeout="timeout"
  >
    {{ text }}
    <template v-slot:actions>
      <v-btn
          color="green"
          variant="text"
          @click="snackBarLogin = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar
      v-model="snackBarRegister"
      :timeout="timeout"
  >
    {{ text }}
    <template v-slot:actions>
      <v-btn
          color="green"
          variant="text"
          @click="snackBarRegister = false"
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

.link-text {
  color: black;
}

.link-text:hover {
  color: gray;
  text-decoration: underline;
  transition: background-color 0.2s ease-in, top 0.2s ease-in;
  cursor: pointer;
}

.text {
  font-size: 100px;
  text-align: center;
  background: linear-gradient(to right, #D3D3D3 20%, #2BC96D 30%, #D3D3D3 70%, #2BC96D 80%);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  text-fill-color: transparent;
  -webkit-text-fill-color: transparent;
  animation: shine 5s ease-in-out infinite alternate;
}

@keyframes shine {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.error-msg {
  color: darkred;
}

@media (max-width: 1230px) {
  .text {
    font-size: 50px;
  }
}
</style>
