import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import router from './router';
import 'firebase/auth';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      id: '',
      name: '',
      email: '',
      password: '',
      balance: 500,
    },
    other_user_balance: 0,
    users: [],
    errors: [],
  },
  getters: {
    // name: state => state.user.name,
    // email: state => state.user.email,
    // password: state => state.user.password,
    // balance: state => state.user.balance,
    user: state => state.user,
    other_user_balance: state => state.other_user_balance,
    errors: state => state.errors,
    users: state => state.users,
  },
  mutations: {
    setId(state, id) {
      state.user.id = id;
    },
    setName(state, name) {
      state.user.name = name;
    },
    setEmail(state, email) {
      state.user.email = email;
    },
    setPassword(state, password) {
      state.user.password = password;
    },
    setBalance(state, balance) {
      state.user.balance = balance;
    },
    setOtherUserBalance(state, other_user_balance) {
      state.other_user_balance = other_user_balance;
    },
    setUsers(state, key, user) {
      if(key !== user.id ) {
        state.users.push(user);
      }
    },
    setErrors(state, error) {
      state.errors.push(error);
    },
  },
  actions: {
    registerUser(context) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          context.getters.user.email,
          context.getters.user.password
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
              name: context.getters.user.name,
              balance: context.getters.user.balance,
            })
            .then(() => {
              router.push('/');
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            context.getters.errors.push(
              'このメールアドレスはすでに使われています。'
            );
          } else {
            context.getters.errors.push(
              '入力されたメールアドレスかパスワードに問題があります。'
            );
          }
        });
    },
    signIn(context) {
      firebase
        .auth()
        .signInWithEmailAndPassword(context.getters.user.email, context.getters.user.password)
        .then((response) => {
          const user = response.user;

          firebase
            .database()
            .ref('users')
            .child(user.uid)
            .on('value', snapshot => {
              const snapshotValue = snapshot.val();
              context.commit('setId', snapshotValue.id);
              context.commit('setName', snapshotValue.name);
              context.commit('setEmail', snapshotValue.email);
              context.commit('setBalance', snapshotValue.balance);
            });

          firebase
            .database()
            .ref('users')
            .on('value', snapshot => {
              context.commit('setUsers', snapshot.key, snapshot.val());
            });

          router.push('/');
        })
        .catch(() => {
          context.commit('setErrors', 'メールアドレスかパスワードに誤りがあります。');
        });
      this.password = '';
    },
    // signOut() {
    //   firebase
    //     .auth()
    //     .signOut();
    // },
    // setOtherUserBalance(context, user_id) {
    //   firebase
    //     .auth('users')
    //     .ref(user_id)
    //     .on('value', snapshot => {
    //       context.commit('setOtherUserBalance', snapshot.val().balance);
    //     });
    // }
  },
});
