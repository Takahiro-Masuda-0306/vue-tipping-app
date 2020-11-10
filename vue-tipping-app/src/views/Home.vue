<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <p>
        <span class="font-weight-bold">{{ user.name }}</span
        >さんようこそ!
      </p>
      <p>残高：{{ user.balance }}</p>
      <button class="btn btn-danger" @click="signOut">ログアウト</button>
    </div>
    <div v-for="(error, index) in errors" :key="index">
      <p class="font-weight-bold text-danger">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.user;
    },
    errors() {
      return this.$store.getters.errors;
    },
  },
  methods: {
    signOut() {
      this.$store.dispatch('signOut');
    },
  },
};
</script>
