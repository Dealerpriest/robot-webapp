<template>
  <div v-if="show" class="debug-box">
    <ConnectionStateList>
      <ConnectionStateListItem :isOkay="webRTC.isConnectedToSignalingServer" labelText="Socket to Signaling server: "></ConnectionStateListItem>
      <ConnectionStateListItem :isOkay="webRTC.answerCreated" labelText="Answer created: "></ConnectionStateListItem>
      <ConnectionStateListItem :isOkay="webRTC.answerSent" labelText="Answer sent: "></ConnectionStateListItem>
      <ConnectionStateListItem :isOkay="webRTC.offerReceived" labelText="Offer received: "></ConnectionStateListItem>
    </ConnectionStateList>
    <div>
      <v-btn @click="rotate(45)">+45</v-btn>
      <v-btn @click="rotate(90)">+90</v-btn>
      <v-btn @click="rotate(180)">+180</v-btn>
      <v-btn @click="rotate(360)">+360</v-btn>
      <v-btn @click="rotate(720)">+720</v-btn>
      <v-btn @click="rotate(1080)">+1080</v-btn>
    </div>
    <div>
      <v-btn @click="rotate(-45)">-45</v-btn>
      <v-btn @click="rotate(-90)">-90</v-btn>
      <v-btn @click="rotate(-180)">-180</v-btn>
      <v-btn @click="rotate(-360)">-360</v-btn>
      <v-btn @click="rotate(-720)">-720</v-btn>
      <v-btn @click="rotate(-1080)">-1080</v-btn>
    </div>
    <pre v-if="showRobotState"><code>{{JSON.stringify(clientRobotState, undefined, 2)}}</code></pre>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import ConnectionStateListItem from '@/components/ConnectionStateListItem.vue';
import ConnectionStateList from '@/components/ConnectionStateList.vue';
export default {
  name: 'debugBox',
  data() {
    return {
      show: false,
      showRobotState: false
    };
  },
  computed: {
    ...mapState({
      clientRobotState: state => state.clientRobotState,
      webRTC: state => state.webRTC
    })
  },
  methods: {
    rotate(angle) {
      let target = { angle: angle, distance: 0 };
      this.setClickTarget(target);
    },
    ...mapMutations([
      'setClickTarget'
    ])
  },
  components: {
    ConnectionStateListItem,
    ConnectionStateList
  },
  created(){
    document.addEventListener('keydown', (e) => {
      if (e.key == 'd') {
        this.show = !this.show;
      }else if (e.key == 't') {
        this.showRobotState = !this.showRobotState;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
// .debug-box {
//   z-index: 2000;
//   position: fixed;
//   left: 20px;
//   top: 20px;
//   background-color: rgba(0, 0, 0, 0.35);
// }
</style>

