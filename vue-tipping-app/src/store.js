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
    other: {
      id: '',
      name: '',
      balance: 0,
      email: '',
    },
    send_amount: 0,
    users: [],
    errors: [],
  },
  getters: {
    user: (state) => state.user,
    other: (state) => state.other,
    send_amount: (state) => state.send_amount,
    errors: (state) => state.errors,
    users: (state) => state.users,
  },
  mutations: {
    setUser(state, user) {
      state.user = { ...state.user, ...user };
    },
    setOtherUser(state, other) {
      state.other = other;
    },
    setAmount(state, send_amount) {
      state.send_amount = send_amount;
    },
    setUsers(state, user) {
      if (user.key !== state.user.id) {
        state.users.push(user.val());
      }
    },
    setErrors(state, error) {
      state.errors.push(error);
    },
    resetUsers(state) {
      state.users = [];
    },
    resetErrors(state) {
      state.errors = [];
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
            getters.errors.push('このメールアドレスはすでに使われています。');
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
        .signInWithEmailAndPassword(getters.user.email, getters.user.password)
        .then((response) => {
          commit('resetState');
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
          commit('setErrors', 'メールアドレスかパスワードに誤りがあります。');
        });
    },
    showUsers({ commit }) {
      firebase
        .database()
        .ref('users')
        .on('value', (snapshot) => {
          commit('resetUsers');
          snapshot.forEach((user) => {
            commit('setUsers', user);
          });
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
    setOtherUserBalance({ commit }, user_id) {
      firebase
        .database()
        .ref('users')
        .child(user_id)
        .once('value', (snapshot) => {
          const other_balance = {
            balance: snapshot.val().balance,
          };
          commit('setOtherUser', other_balance);
        })
        .catch(() => {
          commit(
            'setErrors',
            'ユーザーのウォレット情報を取得できませんでした。'
          );
        });
    },
    sendBalance({ commit, getters }, { send_amount, other }) {
      commit('resetErrors');
      commit('setAmount', send_amount);
      const current_user_balance = getters.user.balance;
      const get_send_amount = getters.send_amount;

      if (get_send_amount !== 0) {
        if (get_send_amount < current_user_balance) {
          const usersRef = firebase.database().ref('users');
          const user = {
            balance: current_user_balance - get_send_amount,
          };
          const other_user = {
            id: other.id,
            name: other.name,
            balance: other.balance,
            email: other.email,
          };
          commit('setOtherUser', other_user);

          //ログインユーザーのデータベース更新
          usersRef
            .child(getters.user.id)
            .update({
              balance: current_user_balance - get_send_amount,
            })
            .then(() => {
              //otherユーザーのデータベース更新
              usersRef.child(other.id).update({
                balance: Number(other.balance) + Number(get_send_amount),
              });

              //ログインユーザーのstate更新
              commit('setUser', user);
            })
            .catch((error) => {
              console.log(error);
              commit(
                'setErrors',
                'ウォレットを送れませんでした。再度お試しください。'
              );
            });
        } else {
          commit('setErrors', '残高が足りません。');
        }
      } else {
        commit('setErrors', '0より大きい数値を入力してください。');
      }
    },
  },
});
