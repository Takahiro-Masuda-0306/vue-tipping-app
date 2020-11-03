<template>
  <div class='container'>
    <main class='row'>
      <h2 class='text-center col-sm-4 offset-sm-4 mb-4 mt-4'>ユーザー登録</h2>
      <form class='d-block col-8 offset-2' @submit.prevent='registerUser'>
        <div class='form-group'>
          <label for='name'>ユーザー名</label>
          <input id='name' type='text' v-model='name' class='form-control' />
        </div>
        <div class='form-group'>
          <label for='email'>メールアドレス</label>
          <input id='email' type='email' v-model='email' class='form-control' />
        </div>
        <div class='form-group'>
          <label for='password'>パスワード</label>
          <input
            id='password'
            type='password'
            v-model='password'
            class='form-control'
          />
        </div>
        <div v-for='(error, index) in errors' :key='index'>
          <p class='font-weight-bold text-danger'>{{ error }}</p>
        </div>
        <button class='btn btn-block btn-success'>送信</button>
      </form>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  computed: {
    errors() {
      return this.$store.getters.errors;
    },
  },
  methods: {
    registerUser() {
      this.$store.commit('setName', this.name);
      this.$store.commit('setEmail', this.email);
      this.$store.commit('setPassword', this.password);
      this.$store.dispatch('registerUser');
      this.password = '';
    },
  },
};
</script>
