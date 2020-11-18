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
    <div>
      <h2 class="text-center mb-4 mt-4">ユーザー一覧</h2>
    </div>
    <div v-for="(error, index) in errors" :key="`error-${index}`">
      <p class="font-weight-bold text-danger">{{ error }}</p>
    </div>

    <!-- usersの展開開始 -->
    <div class="mb-2" v-for="(other, index) in users" :key="`other-${index}`">
      <div class="row text-center">
        <div class="col-sm-6">
          <h3 class="font-weight-bold">{{ other.name }}</h3>
        </div>
        <div class="col-sm-6">
          <button
            class="btn btn-info mr-3"
            @click="confirmOtherUserBalance(other.id)"
            data-toggle="modal"
            :data-target="'#confirm' + other.id"
          >
            Walletを見る
          </button>
          <button
            class="btn btn-info"
            data-toggle="modal"
            :data-target="'#send' + other.id"
          >
            送る
          </button>
        </div>
      </div>

      <!-- ウォレット確認モーダル開始 -->
      <div
        class="modal fade"
        :id="'confirm' + other.id"
        tabindex="-1"
        role="dialog"
        aria-labelledby="modal"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="ModalTitle">
                {{ other.name }}さんの残高
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>{{ other.balance }}</p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- ウォレット確認モーダル終了 -->

      <!-- ウォレット送信モーダル開始 -->
      <div
        class="modal fade"
        :id="'send' + other.id"
        tabindex="-1"
        role="dialog"
        aria-labelledby="modal"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="ModalTitle">
                {{ user.name }}さんの残高：{{ user.balance }}
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>送る金額</p>
              <input type="number" v-model="sendAmount" />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                閉じる
              </button>
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                @click="sendBalance(other)"
              >
                送る
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- ウォレット送信モーダル終了 -->
    </div>
    <!-- usersの展開終了 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      sendAmount: 0,
    };
  },
  mounted() {
    this.$store.dispatch('showUsers');
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    users() {
      return this.$store.getters.users;
    },
    errors() {
      return this.$store.getters.errors;
    },
  },
  methods: {
    signOut() {
      this.$store.dispatch('signOut');
    },
    confirmOtherUserBalance(userId) {
      this.$store.dispatch('setOtherUserBalance', userId);
    },
    sendBalance(other) {
      this.$store.dispatch('sendBalance', {
        sendAmount: this.sendAmount,
        other: other,
      });
      this.sendAmount = 0;
    },
  },
};
</script>
