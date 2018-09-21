<template>
<v-app id="inspire" dark>
  <v-container fluid fill-height>
    <v-layout row>
      <transition name="slide-fade">
        <!-- <h2 v-if="chat">Baaaajs!</h2> -->
        <v-flex id="chat-drawer" v-if="chat" xs2>
          <v-card style="max-height: 95vh" height="100%">
              <Chat></Chat>
          </v-card>
        </v-flex>
      </transition>
      <v-flex>
        <ConnectionStateList>
          <ConnectionStateListItem :isOkay="webRTC.isConnectedToSignalingServer" labelText="Socket to Signaling server: "></ConnectionStateListItem>
          <ConnectionStateListItem :isOkay="webRTC.answerCreated" labelText="Answer created: "></ConnectionStateListItem>
          <ConnectionStateListItem :isOkay="webRTC.answerSent" labelText="Answer sent: "></ConnectionStateListItem>
          <ConnectionStateListItem :isOkay="webRTC.offerReceived" labelText="Offer received: "></ConnectionStateListItem>
        </ConnectionStateList>
        <RobotControls></RobotControls>
        <PortraitVideo class="self-portrait-video" v-if="selfPortraitStream" :stream-object="selfPortraitStream" :isMuted="true"></PortraitVideo>
        <v-container fluid>
          <v-layout row wrap>
            <v-flex sm6 xs12>
              <ThetaVideo class="big-video" v-if="thetaStream"  :stream-object="thetaStream" key="theta-video"></ThetaVideo>
              <div v-else class="big-video"><p>No THETA stream acquired</p></div>
            </v-flex>
            <v-flex sm6 xs12>
              <BrioVideo class="big-video" v-if="brioStream"  :stream-object="brioStream" key="brio-video"></BrioVideo>
              <div v-else class="big-video"><p>No BRIO stream acquired</p></div>
            </v-flex>
          </v-layout>
          <v-layout v-if="showAllRemoteStreams" row wrap>
            <v-flex v-for="stream in remoteStreams" :key="stream.label" md6 sm12>
              <Video class="big-video" :stream-object="stream" ></Video>
            </v-flex>
          </v-layout>
        </v-container>
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

import Chat from '@/components/Chat.vue';
import PortraitVideo from '@/components/PortraitVideo.vue';
import ThetaVideo from '@/components/ThetaVideo.vue';
import BrioVideo from '@/components/BrioVideo.vue';
import Video from '@/components/Video.vue'
import RobotControls from '@/components/RobotControls.vue';
// import ServoControl from '@/components/ServoControl.vue';
import ConnectionStateListItem from '@/components/ConnectionStateListItem.vue';
import ConnectionStateList from '@/components/ConnectionStateList.vue';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'client',
  computed: {
    thetaStream() {
      return this.webRTC.remoteStreams.find(streamObj => {
        return streamObj.metaData.label.includes('THETA');
      });
    },
    brioStream() {
      return this.webRTC.remoteStreams.find(streamObj => {
        return streamObj.metaData.label.includes('BRIO');
      });
    },
    selfPortraitStream() {
      return this.webRTC.localStreams[0];
    },
    remoteStreams() {
      return this.webRTC.remoteStreams;
    },
    ...mapState({
      user: state => state.client.userState,
      webRTC: state => state.webRTC,
    })
  },
  methods: {
    // changeViewAngle(){
    //   console.log('change view triggered');
    //   this.viewAngle++;
    //   this.viewAngle%=3;
    // },
    ...mapMutations(['setUserId', 'setUserName', 'changeRemoteCameraSettings'])
  },
  components: {
    Chat,
    PortraitVideo,
    Video,
    ThetaVideo,
    BrioVideo,
    RobotControls,
    ConnectionStateListItem,
    ConnectionStateList
    // ServoControl
  },
  data() {
    return {
      chat: false,
      showAllRemoteStreams: false
      // chatDrawerWidth: 200
      // viewAngle: 1
    };
  },
  created() {
    // window.document.onkeydown = event => {
    //       let keyValue = event.key;
    //       console.log('event keydown: ' + keyValue);
    //     };

    // document.onkeydown = event => {
    //   console.log('created key event');
    //   let keyValue = event.key;
    //   if(keyValue === 'c'){
    //     console.log('change view!!');
    //     this.changeViewAngle();
    //   }
    // }
    let serverUrl;
    const token = process.env.VUE_APP_CLIENT_TOKEN;

    if (process.env.NODE_ENV === 'development') {
      serverUrl = window.location.hostname + ':' + process.env.VUE_APP_SIGNALING_SERVER_PORT;
    } else {
      serverUrl = process.env.VUE_APP_SIGNALING_SERVER_URL;
    }
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
        this.setUserId(user.uid);
        this.setUserName(user.displayName);
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

.self-portrait-video {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 8vw;
  height: auto;
}

.big-video {
  // background-image: url('http://i.imgur.com/OWRKwAA.jpg');
  // background-size: cover;
  width: 100%;
  height: auto;
  // overflow: hidden;
  // position: absolute;
  // margin: 100px;
  // left: 0;
  // top: 0;
}
</style>
