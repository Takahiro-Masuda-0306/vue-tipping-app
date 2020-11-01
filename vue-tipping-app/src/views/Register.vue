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
export default {
  data() {
    return {
      // v-modelの要素
      email: '',
      password: '',
    }
  },
  computed: {
    // actionでの操作で変更
    errors() {
      return this.$store.getters.errors;
    }
  },
  methods: {
    registerUser() {
      this.$store.state.email = this.email;
      this.$store.state.password = this.password;
      this.$store.dispatch('registerUser');
      this.password = '';
    }
  }
}
</script>