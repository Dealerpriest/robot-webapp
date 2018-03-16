<template>
  <div>
    <form v-on:submit.prevent="login">
      <label for="name">Name: </label><input v-model="name" type="text" />
      <button type="submit">login!</button>
    </form>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'clientLogin',
  data() {
    return {
      name: ''
    };
  },
  methods: {
    login() {
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
    }
  },
  created() {
    console.log('login component created');
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log(user);
      }
    });
  }
};
</script>
