<template>
  <div v-if="show" class="debug-box">
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
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'debugBox',
  data() {
    return {
      show: false
    };
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
  created(){
    document.addEventListener('keydown', (e) => {
      if (e.key == 'd') {
        this.show = !this.show;
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

