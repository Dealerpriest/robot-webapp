<template>
  <v-app dark>
    <ConnectionStateList>
      <ConnectionStateListItem :isOkay="robot.isConnectedToWebsocketSerialServer" labelText="Socket to Serial server: "></ConnectionStateListItem>
      <ConnectionStateListItem :isOkay="robot.BRIOIsFound" labelText="Found BRIO webcamera: "></ConnectionStateListItem>
      <ConnectionStateListItem :isOkay="robot.RICOHIsFound" labelText="Found RICOH 360 camera: "></ConnectionStateListItem>
      <ConnectionStateListItem :isOkay="webRTC.isConnectedToSignalingServer" labelText="Socket to Signaling server: "></ConnectionStateListItem>
      <ConnectionStateListItem :isOkay="webRTC.offerCreated" labelText="Offer created: "></ConnectionStateListItem>
      <ConnectionStateListItem :isOkay="webRTC.offerSent" labelText="Offer sent: "></ConnectionStateListItem>
      <ConnectionStateListItem :isOkay="webRTC.answerReceived" labelText="Answer received: "></ConnectionStateListItem>
    </ConnectionStateList>
    <v-container fluid fill-height>
      <v-layout row>
        <RobotVideo class="big-video" v-for="stream in remoteStreams" :stream-object="stream" :key="stream.label"></RobotVideo>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
let serverUrl;
const token = process.env.VUE_APP_ROBOT_TOKEN;

if (process.env.NODE_ENV === 'development') {
  serverUrl = window.location.hostname + ':' + process.env.VUE_APP_SIGNALING_SERVER_PORT;
} else {
  serverUrl = process.env.VUE_APP_SIGNALING_SERVER_URL;
}

// eslint-disable-next-line
import robotConnector from '@/js/robotConnector.js';
// eslint-disable-next-line
const robotConnection = new robotConnector(serverUrl, token);

import RobotVideo from '@/components/RobotVideo.vue';
import ConnectionStateListItem from '@/components/ConnectionStateListItem.vue';
import ConnectionStateList from '@/components/ConnectionStateList.vue';
import { mapState } from 'vuex';
export default {
  name: 'robot',
  data() {
    return {
      // robotSocket: ''
    };
  },
  computed: {
    remoteStreams() {
      return this.webRTC.remoteStreams;
    },
    ...mapState(['user', 'webRTC', 'robot'])
  },
  // computed: mapState(['serialSocket']),
  // methods: mapMutations(['setSerialSocket']),
  created() {
    // let socket = io('http://localhost:3000', {
    //   query: {
    //     token: process.env.VUE_APP_ROBOT_TOKEN
    //   }
    // });
    // this.setSerialSocket(socket);
    // this.serialSocket.on('connect', () => {
    //   console.log('connected to socket');
    //   this.serialSocket.send("hello I'm the robot <3");
    // });
    /////////////////////////////
    // let cameraScriptTag = document.createElement('script');
    // cameraScriptTag.setAttribute('src', '/js/camera.js');
    // document.head.appendChild(cameraScriptTag);
  },
  components: {
    RobotVideo,
    ConnectionStateListItem,
    ConnectionStateList
    // ServoControl
  }
};
</script>
