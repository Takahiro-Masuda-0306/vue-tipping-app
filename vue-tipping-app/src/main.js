import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase';

Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "AIzaSyAwTksJqX97EQPBYrT5a4W3PNqa0-eJkuE",
  authDomain: "vue-tipping-app.firebaseapp.com",
  databaseURL: "https://vue-tipping-app.firebaseio.com",
  projectId: "vue-tipping-app",
  storageBucket: "vue-tipping-app.appspot.com",
  messagingSenderId: "372941745854",
  appId: "1:372941745854:web:eb21009a61b55c5cc9f8ef",
  measurementId: "G-NB7QNM8071"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
