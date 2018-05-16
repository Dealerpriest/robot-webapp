<template>
<v-app id="inspire" dark>
  <v-container>
    <v-layout>
      <v-flex>
  <v-navigation-drawer>
  </v-navigation-drawer>

  <v-navigation-drawer
      clipped
      fixed
      v-model="drawer"
      :width="chatDrawerWidth"
  >
    <v-list dense>
      <p class="nametag">{{ user.name }}</p>
      <ChatSection></ChatSection>
      <!-- <router-link tag="li" to="/">
        <v-list-tile @click="nothing">
          <v-list-tile-action>
            <v-icon>person</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>client</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </router-link>
      <router-link tag="li" to="/robot">
        <v-list-tile @click="nothing">
          <v-list-tile-action>
            <v-icon>event_seat</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>robot</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </router-link> -->
    </v-list>
  </v-navigation-drawer>
  <!-- <v-navigation-drawer app fixed right floating></v-navigation-drawer> -->
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Chat</v-toolbar-title>
    </v-toolbar>
    <v-content>
      
      <div id="big-video"></div>
      <!-- <v-container fluid fill-height>
        <v-layout row wrap>
          <v-flex v-for="(stream, index) in webRTC.remoteStreams" :key=index xs6>
            <RobotVideo  :stream="stream"></RobotVideo>
          </v-flex>
        </v-layout>
      </v-container> -->
    </v-content>
    <v-footer app fixed>
      <span>&copy; Gunhaxxor 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
// @ is an alias to /src
import firebase from 'firebase';
// eslint-disable-next-line
import clientConnector from '@/js/clientConnector.js';

import ChatSection from '@/components/ChatSection.vue';
import RobotVideo from '@/components/RobotVideo.vue';
import ServoControl from '@/components/ServoControl.vue';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'client',
  computed: mapState(['user', 'webRTC']),
  methods: mapMutations(['setId', 'setName']),
  components: {
    ChatSection,
    RobotVideo,
    ServoControl
  },
  data() {
    return {
      drawer: true,
      chatDrawerWidth: 200
    };
  },
  created() {
    const serverUrl = process.env.VUE_APP_SIGNALING_SERVER_URL;
    const token = process.env.VUE_APP_CLIENT_TOKEN;
    // eslint-disable-next-line
    const clientConnection = new clientConnector(serverUrl, token);

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
        this.setName(user.displayName);
      }
    });
  }
};
</script>

<style lang="scss" scoped>
#big-video {
  background-image: url('http://i.imgur.com/OWRKwAA.jpg');
  background-size: cover;
  width: 100%;
  height: 100%;
  // position: absolute;
  margin: 100px;
  // left: 0;
  // top: 0;
}
</style>
