<template>
<v-app id="inspire" dark>
  <v-container fluid fill-height>
    <v-layout row>
      <transition name="slide-fade">
        <!-- <h2 v-if="chat">Baaaajs!</h2> -->
        <v-flex id="chat-drawer" v-if="chat" xs2>
          <v-card style="max-height: 95vh" height="100%">
              <ChatSection></ChatSection>
          </v-card>
        </v-flex>
      </transition>
      <v-flex>
          <RobotVideo id="big-video" v-if="thetaStream"  :stream-object="thetaStream"></RobotVideo>
      </v-flex>
    </v-layout>
  </v-container>
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
  computed: {
    thetaStream() {
      return this.webRTC.remoteStreams.find(streamObj => {
        return streamObj.label.includes('THETA');
      });
    },
    // logitechStream() {
    //   return this.webRTC.remoteStreams.find(streamObj => {
    //     return streamObj.label.includes('logitech');
    //   });
    // },
    ...mapState(['user', 'webRTC'])
  },
  methods: mapMutations(['setId', 'setName']),
  components: {
    ChatSection,
    RobotVideo,
    ServoControl
  },
  data() {
    return {
      chat: true,
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
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.2s ease;

  overflow: hidden;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  // transform: translateX(-100px);
  // width: 0%;
  flex: 0;
  min-width: 0 !important;
  overflow: hidden;
  opacity: 0;
}

#chat-drawer {
  min-width: 300px;
}

#big-video {
  // background-image: url('http://i.imgur.com/OWRKwAA.jpg');
  // background-size: cover;
  // width: 100%;
  height: auto;
  // overflow: hidden;
  // position: absolute;
  // margin: 100px;
  // left: 0;
  // top: 0;
}
</style>
