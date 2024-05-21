<script lang="js">
import {defineComponent} from "vue";
import TabsView from "./Sections/TabsView.vue";
import {useAuth} from "../stores/auth.js";
import ListView from "./View/ListView.vue";

export default defineComponent({
  name: 'HomeView',
  components: {ListView, TabsView},
  setup() {
    const auth = useAuth();
    return {
      auth
    }
  }
})
</script>

<template>
<section>
  <ListView/>
</section>

</template>

<style scoped>

</style>