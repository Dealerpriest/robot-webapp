<template>
  <div class="client-page">
    <p class="nametag">{{ user.name }}</p>
    <img src="../assets/logo.png">
    <ChatSection></ChatSection>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from 'firebase';
import ChatSection from '@/components/ChatSection.vue';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'client',
  computed: mapState(['user']),
  methods: {
    ...mapMutations(['setId'])
  },
  components: {
    ChatSection
  },
  created() {
    // So we directly try to log in when entering the site as client. If already logged in, we get the user account. Niiiice!!!
    console.log('trying to login to firebase');
    firebase
      .auth()
      .signInAnonymously()
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + errorMessage);
        // ...
      });

    // TODO: Perhaps we should put the firebase stuff inside an action? Oh well, fuck that for now!
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.loggedIn = true;
        console.log('user logged in: ');
        console.log(user);
        this.setId(user.uid);
      }
    });
  }
};
</script>
