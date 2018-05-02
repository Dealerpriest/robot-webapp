<template>
  <form v-on:submit.prevent="sendMessage">
    <input type="text" v-model="msg">
    <button type="submit">send!</button>
  </form>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'chatInput',
  data() {
    return {
      msg: ''
    };
  },
  computed: mapState(['user']),
  methods: {
    sendMessage() {
      let msg = { sender: this.user.id, msg: this.msg };
      this.addMessageToChat(msg);
      this.msg = '';
      console.log('sending!');
    },
    ...mapMutations(['addMessageToChat'])
  }
};
</script>
