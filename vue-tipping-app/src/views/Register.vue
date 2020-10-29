<template>
  <div class="container"> 
    <div class="row">
      <h2 class="text-center col-sm-4 offset-sm-4 mb-4 mt-4">ユーザー登録</h2>
      <form class="d-block col-8 offset-2" @submit.prevent="registerUser"> 
        <div class="form-group">
          <label for="email">メールアドレス</label>
          <input id="email" type="email" v-model="email" class="form-control">
        </div>
        <div class="form-group">
          <label for="password">パスワード</label>
          <input id="password" type="password" v-model="password" class="form-control">
        </div>
        <div v-for="(error, index) in errors" :key="index">
          <p class="font-weight-bold text-danger">{{ error }}</p>
        </div>
        <button class="btn btn-block btn-success">送信</button>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
import 'firebase/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      errors: []
    }
  },
  methods: {
    registerUser() {
      firebase 
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(response => {
          const user = response.user;
          firebase
            .database()
            .ref('users')
            .child(user.uid)
            .set({
              user_id: user.uid,
              email: user.email
            })
            .then(() => {
              this.$router.push('/');
            })
            .catch(error => {
              console.log(error);
            })
        })
        .catch(error => {
          if(error.code === 'auth/email-already-in-use') {
            this.errors.push('このメールアドレスはすでに使われています。');
          } else {
            this.errors.push('入力されたメールアドレスかパスワードに問題があります。')
          }
        })
        this.password = ''
    }
  }
}
</script>