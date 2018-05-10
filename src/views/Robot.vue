<template>
  <div class="robot">
    <h1>Yo! This is the robot route!</h1>
  </div>
</template>

<script>
// import io from 'socket.io-client';
const serverUrl = process.env.VUE_APP_SIGNALING_SERVER_URL;
const token = process.env.VUE_APP_ROBOT_TOKEN;
// require('@/js/main.js');
// require('@/js/camera.js');

// eslint-disable-next-line
import serialSocket from '@/js/serialsocket.js';

// import webRTCConnection from '@/js/webRTCConnection.js';
// eslint-disable-next-line
import robotConnector from '@/js/robotConnector.js';
// eslint-disable-next-line
const robotConnection = new robotConnector(serverUrl, token);
// const connection = webRTCConnection(serverUrl, token);
// import ServoControl from '@/components/ServoControl.vue';

// navigator.mediaDevices.getUserMedia({ video: true, audio: false });
export default {
  name: 'robot',
  data() {
    return {
      // robotSocket: ''
    };
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
    // ServoControl
  }
};
</script>
