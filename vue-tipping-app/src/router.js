import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';
import Register from './views/Register';
import Signin from './views/Signin';
import firebase from 'firebase';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
      beforeEnter: (to, from, next) => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            next();
          } else {
            next('/signin');
          }
        });
      },
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/signin',
      component: Signin,
    },
  ],
});
