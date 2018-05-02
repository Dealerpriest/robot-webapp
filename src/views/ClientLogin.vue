<template>
  <div>
    <!-- <p v-if="!loggedIn">Skiapar en användare åt dig. Ge det en sekund :-)</p> -->
    <h1>{{name}}</h1>
    <form v-on:submit.prevent="updateName">
      <label for="name">Vad heter du? </label><input v-model="name" type="text" />
      <button type="submit">login!</button>
    </form>
  </div>
</template>

<script>
import firebase from 'firebase';
// Convenience function for mapping mutations to methods of this componenet
import { mapMutations } from 'vuex';

export default {
  name: 'clientLogin',
  data() {
    return {
      name: ''
    };
  },
  methods: {
    updateName() {
      let user = firebase.auth().currentUser;
      if (user) {
        user.updateProfile({ displayName: this.name }).then(() => {
          this.setName(this.name);
          this.$router.push('/');
        });
      }
    },
    ...mapMutations(['setName'])
  },
  created() {}
};
</script>

<style>


</style>