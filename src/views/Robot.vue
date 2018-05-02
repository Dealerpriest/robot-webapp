<template>
  <div class="robot">
    <h1>Yo! This is the robot route!</h1>
    <ServoControl></ServoControl>
  </div>
</template>

<script>
import io from 'socket.io-client';
export const robotSocket = io('http://localhost:3000', {
  query: {
    token: process.env.VUE_APP_ROBOT_TOKEN
  }
});
robotSocket.on('connect', () => {
  console.log('connected to socket');
  robotSocket.send('hello');
});

import ServoControl from '@/components/ServoControl.vue';

// navigator.mediaDevices.getUserMedia({ video: true, audio: false });
export default {
  name: 'robot',
  data() {
    return {
      robotSocket: ''
    };
  },
  created() {
    let cameraScriptTag = document.createElement('script');
    cameraScriptTag.setAttribute('src', '/js/camera.js');
    document.head.appendChild(cameraScriptTag);
  },
  components: {
    ServoControl
  }
};
</script>
