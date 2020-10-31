import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from './store';
import firebase from 'firebase';
import { firebaseConfig } from './firebase'

Vue.config.productionTip = false;
firebase.initializeApp(firebaseConfig)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
