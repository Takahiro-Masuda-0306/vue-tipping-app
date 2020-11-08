<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <p>{{ user.name }}さんようこそ!</p>
      <p>残高：{{ user.balance }}</p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
};
</script>
