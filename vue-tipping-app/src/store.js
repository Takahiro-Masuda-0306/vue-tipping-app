import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";
import router from './router'
import "firebase/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    email: "",
    password: "",
    user_id: "",
    errors: [],
  },
  // gettersに呼び出すstateを記述。
  getters: {
    errors: (state) => state.errors,
  },
  // actionsとmutationsでstateを変更する。
  // actionsは非同期処理、mutationsは同期処理。
  // mutationsをactionsからcommitして呼び出すのがベター。
  actions: {
    registerUser(context) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          context.state.email,
          context.state.password
        )
        .then((response) => {
          const user = response.user;
          firebase
            .database()
            .ref("users")
            .child(user.uid)
            .set({
              user_id: user.uid,
              email: user.email,
            })
            .then(() => {
              router.push("/");
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            context.state.errors.push(
              "このメールアドレスはすでに使われています。"
            );
          } else {
            context.state.errors.push(
              "入力されたメールアドレスかパスワードに問題があります。"
            );
          }
        });
    },
  },
});
