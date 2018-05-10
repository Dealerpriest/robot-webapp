<template>
  <input type="range" min="0" max="180" step="1" v-model.number="pitch" @input="sendPitch">
</template>

<script>
import serialSocket from '@/js/serialsocket.js';

export default {
  name: 'servoControl',
  data() {
    return {
      pitch: 40,
      yaw: 30
    };
  },
  methods: {
    sendPitch() {
      console.log('sliding');
      let pitchStr = 'pitch:' + this.pitch + '\n';
      serialSocket.emit('cameraControl', pitchStr);
    }
  },
  created() {
    console.log('serialsocket:');
    console.log(serialSocket);
  }
};
</script>