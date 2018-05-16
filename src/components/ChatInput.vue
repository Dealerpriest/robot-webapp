<template>
  <v-form v-on:submit.prevent="sendMessage">
    <!-- <v-container fluid>
      <v-layout row>
        <v-flex> -->
          <v-text-field label="Message" v-model="msg"></v-text-field>
        <!-- </v-flex> -->
        <!-- <v-flex xs2>
          <v-btn fab small type="submit" color="primary">
            <v-icon>send</v-icon>
          </v-btn>
        </v-flex> -->
      <!-- </v-layout>
    </v-container> -->
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
