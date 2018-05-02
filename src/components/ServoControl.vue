<template>
  <input type="range" min="0" max="180" step="1" v-model.number="pitch" @input="sendPitch">
</template>

<script>
import { robotSocket } from '@/views/Robot.vue';
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
      robotSocket.emit('cameraControl', pitchStr);
    }
  },
  created() {
    console.log(robotSocket);
  }
};
</script>