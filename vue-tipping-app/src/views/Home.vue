<template>
  <div class="container">
    <!-- <div class="d-flex justify-content-between"> -->
      <!-- <p>{{ user.name }}さんようこそ!</p> -->
      <!-- <p>残高：{{ user.balance }}</p> -->
      <!-- <button class="btn btn-danger" @click="signOut">ログアウト</button> -->
    <!-- </div> -->
    <!-- <div>
      <h2 class="text-center mb-4 mt-4">ユーザー一覧</h2>
    </div> -->
    <!-- <div  v-for="user in users" :key="user.id"> 
      <div class="row text-center">
        <div class="col-sm-6">
          <p>{{ user.name }}</p>
        </div>
        <div class="col-sm-6">
          <button class="btn btn-info" @click="confirmOtherUserBalance(user.id)">Walletを見る</button>
          <button class="btn btn-info">送る</button>
        </div>
      </div>
    </div>
    <div v-show="confirm_balance">
      {{other_user_balance}}
    </div>   -->
  </div>
</template>

<script>
export default {
  // data() {
  //   return {
  //     confirm_balance: false,
  //   }
  // },
  // computed: {
  //   user() {
  //     return this.$store.getters.user;
  //   },
  //   other_user_balance() {
  //     return this.$store.getters.other_user_balance;
  //   },
  //   users() {
  //     return this.$store.getters.users;
  //   }
  // },
  // methods: {
  //   signOut() {
  //     this.$store.dispatch('signOut');
  //   },
  //   confirmOtherUserBalance(user_id) {
  //     this.confirm_balance = true;
  //     this.$store.dispatch('setOtherUserBalance', user_id);
  //   }
  // }
}
</script>