import {createMemoryHistory, createRouter} from 'vue-router'
import AboutView from "../components/AboutView.vue";
import HomeView from "../components/HomeView.vue";
import EmployeesView from "../components/EmployeesView.vue";


const routes = [
    {path: '/', component: HomeView},
    {path: '/about', component: AboutView},
    {path: '/employees', component: EmployeesView}
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})