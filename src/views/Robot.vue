<template>
  <v-app dark>
    <ConnectionStateIcon :isConnected="webRTC.isConnectedToSignalingServer" labelText="Socket to Signaling server: "></ConnectionStateIcon>
    <ConnectionStateIcon :isConnected="webRTC.isConnectedToWebsocketToSerialServer" labelText="Socket to Serial server: "></ConnectionStateIcon>
    <v-container fluid fill-height>
      <v-layout row>
        <RobotVideo class="big-video" v-for="stream in remoteStreams" :stream-object="stream" :key="stream.label"></RobotVideo>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
const serverUrl = process.env.VUE_APP_SIGNALING_SERVER_URL;
const token = process.env.VUE_APP_ROBOT_TOKEN;

// eslint-disable-next-line
import robotConnector from '@/js/robotConnector.js';
// eslint-disable-next-line
const robotConnection = new robotConnector(serverUrl, token);

import RobotVideo from '@/components/RobotVideo.vue';
import ConnectionStateIcon from '@/components/ConnectionStateIcon.vue';
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
    ...mapState(['user', 'webRTC'])
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
    ConnectionStateIcon
    // ServoControl
  }
};
</script>
