import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";
import router from "./router";
import "firebase/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    // other_user_balance: 0,
    // users: [],
    errors: [],
  },
  getters: {
    user: (state) => state.user,
    // other_user_balance: (state) => state.other_user_balance,
    errors: (state) => state.errors,
    // users: (state) => state.users,
  },
  mutations: {
    setUser(state, user) {
      state.user = { ...state.user, ...user };
    },
    // setOtherUserBalance(state, other_user_balance) {
    //   state.other_user_balance = other_user_balance;
    // },
    // setUsers(state, user, user_id) {
    //   if (user.key !== user_id) {
    //     state.users.push(user);
    //   }
    // },
    setErrors(state, error) {
      state.errors.push(error);
    },
    // resetState(state) {
    //   state.user = {}
    //   state.users = []
    //   state.errors = []
    // }
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
            .ref("users")
            .child(user.uid)
            .set({
              id: user.uid,
              email: user.email,
              name: context.getters.user.name,
              balance: 500,
            })
            .then(() => {
              const userInfo = {
                id: user.uid,
                email: user.email,
                name: context.getters.user.name,
                balance: 500,
              };
              context.commit('setUser', userInfo);
              router.push("/");
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            context.getters.errors.push(
              "このメールアドレスはすでに使われています。"
            );
          } else {
            context.getters.errors.push(
              "入力されたメールアドレスかパスワードに問題があります。"
            );
          }
        });
    },
    signIn(context) {
      firebase
        .auth()
        .signInWithEmailAndPassword(
          context.getters.user.email,
          context.getters.user.password
        )
        .then((response) => {
          const user = response.user;
          firebase
            .database()
            .ref("users")
            .child(user.uid)
            .on("value", (snapshot) => {
              const snapshotValue = {
                id: snapshot.val().id,
                name: snapshot.val().name,
                email: snapshot.val().email,
                balance: snapshot.val().balance,
              };
              context.commit("setUser", snapshotValue);
            });

          router.push("/");
        })
        .catch(() => {
          context.commit(
            "setErrors",
            "メールアドレスかパスワードに誤りがあります。"
          );
        });
      this.password = "";
    },
    // showUsers(context) {
    //   firebase
    //     .database()
    //     .ref("users")
    //     .on("child_added", (snapshot) => {
    //       context.commit("setUsers", snapshot, context.getters.user.id);
    //     });
    // },
    // signOut(context) {
    //   firebase.auth().signOut();
    //   context.commit('resetState');
    // },
    // setOtherUserBalance(context, user_id) {
    //   firebase
    //     .auth("users")
    //     .ref(user_id)
    //     .on("child_added", (snapshot) => {
    //       context.commit("setOtherUserBalance", snapshot.val().balance);
    //     });
    // },
  },
});