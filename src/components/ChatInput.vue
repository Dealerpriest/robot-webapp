<template>
  <v-form v-on:submit.prevent="sendMessage">
    <v-text-field label="Message" v-model="msg"></v-text-field>
    <v-btn color="primary">Send</v-btn>
  </v-form>
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
