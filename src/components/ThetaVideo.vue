<template>
  <!-- <div> -->
    <!-- <a @click.prevent="addSource">add srcObject</a> -->
    
    <video class="video-tag" ref="videoElement" autoplay v-on:click="videoClicked">
    </video>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'thetaVideo',
  props: {
    streamObject: null
  },
  data() {
    return {};
  },
  methods: {
    addSource() {
      this.$refs.videoElement.srcObject = this.streamObject.stream;
    },
    // eslint-disable-next-line
    videoClicked(event) {
      console.log("Video clicked");
      console.log(event.layerX);
      console.log(event.layerY);
    }
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

