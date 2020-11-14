import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import router from './router';
import 'firebase/auth';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      name: '',
      email: '',
      balance: 0,
      password: '',
    },
    users: [],
    errors: [],
  },
  getters: {
    user: (state) => state.user,
    errors: (state) => state.errors,
    users: (state) => state.users,
  },
  mutations: {
    setUser(state, user) {
      state.user = { ...state.user, ...user };
    },
    setUsers(state, user) {
      if (user.key !== state.user.id) {
        state.users.push(user.val());
      }
    },
    setErrors(state, error) {
      state.errors.push(error);
    },
    resetState(state) {
      state.user = {};
      state.users = [];
      state.errors = [];
    },
  },
  actions: {
    registerUser({ commit, getters }) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          getters.user.email,
          getters.user.password
        )
        .then((response) => {
          const user = response.user;
          firebase
            .database()
            .ref('users')
            .child(user.uid)
            .set({
              id: user.uid,
              email: user.email,
              name: getters.user.name,
              balance: 500,
            })
            .then(() => {
              const userInfo = {
                id: user.uid,
                email: user.email,
                name: getters.user.name,
                balance: 500,
              };
              commit('setUser', userInfo);
              router.push('/');
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            getters.errors.push(
              'このメールアドレスはすでに使われています。'
            );
          } else {
            getters.errors.push(
              '入力されたメールアドレスかパスワードに問題があります。'
            );
          }
        });
    },
    signIn({ commit, getters }) {
      firebase
        .auth()
        .signInWithEmailAndPassword(
          getters.user.email,
          getters.user.password
        )
        .then((response) => {
          const user = response.user;
          firebase
            .database()
            .ref('users')
            .child(user.uid)
            .on('value', (snapshot) => {
              const snapshotValue = {
                id: snapshot.val().id,
                name: snapshot.val().name,
                email: snapshot.val().email,
                balance: snapshot.val().balance,
              };
              commit('setUser', snapshotValue);
            });

          router.push('/');
        })
        .catch(() => {
          commit(
            'setErrors',
            'メールアドレスかパスワードに誤りがあります。'
          );
        });
      this.password = '';
    },
    showUsers({ commit }) {
      firebase
        .database()
        .ref('users')
        .on('child_added', (snapshot) => {
          commit('setUsers', snapshot);
        })
        .catch((error) => {
          commit(
            'setErrors',
            'ユーザー情報を正しく取得できませんでした。'
          );
          console.log(error);
        });
    },
    signOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit('resetState');
        })
        .catch((error) => {
          console.log(error);
          commit('setErrors', 'サインアウトできませんでした。');
        });
    },
  },
});
