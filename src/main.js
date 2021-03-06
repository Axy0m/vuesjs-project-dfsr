import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import Routes from "./routes/index.js";
import './index.css'
import store from "./store/index"

Vue.config.productionTip = false

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: Routes,
});

//Vue.js 2 navigation guards


router.beforeEach(async (to, from, next) => {
    if (!store.state.isLogged._id) {
        if (localStorage.getItem('token')) {
            store.dispatch("checkToken")
                .then(response => {
                    if (response) {
                        if (to.path === "/" || to.path === "/login") next("/home");
                        else next();
                    } else {
                        if (to.path !== "/login" && to.path !== "/") next("/login");
                        else next();
                    }
                })
        } else {
            if (to.path !== "/login" && to.path !== "/") next('/login');
            else next();
        }
    } else {
        next();
    }
})
new Vue({
    store,
    render: h => h(App),
    router,
}).$mount('#app')
