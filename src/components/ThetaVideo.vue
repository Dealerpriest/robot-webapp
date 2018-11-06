<template>
  <!-- <div> -->
    <!-- <a @click.prevent="addSource">add srcObject</a> -->
    
    <video class="video-tag" ref="videoElement" autoplay v-on:click="videoClicked">
    </video>
  <!-- </div> -->
</template>

<script>
import pixelToAngleUtility from '@/js/pixelToAngleUtility.js';
import { mapMutations} from 'vuex';

export default {
  name: 'thetaVideo',
  props: {
    streamObject: null,
  },
  data() {
    return {
      pixUtil: new pixelToAngleUtility(),
    };
  },
  methods: {
    addSource() {
      this.$refs.videoElement.srcObject = this.streamObject.stream;
    },
    videoClicked(event) {
      console.log("Video clicked");
      let newTarget = this.pixUtil.coordinatesToAngleDistance(event.layerX, event.layerY, this.$refs.videoElement.clientWidth, this.$refs.videoElement.clientHeight);
      console.log("angle: " + newTarget.angle);
      console.log("distance: " + newTarget.distance);
      this.setClickTarget(newTarget);
    },
    ...mapMutations(['setClickTarget'])
  },
  mounted() {
    console.log(this.$refs);
    // this.$refs.videoElement.srcObject = this.streamObject.stream;
    this.$nextTick(() => {
      this.$refs.videoElement.srcObject = this.streamObject.stream;
    });
  }
};
</script>

<style lang="scss" scoped>
video {
  // overflow: hidden;
  // width: 100%;
  // height: auto;
}
</style>

