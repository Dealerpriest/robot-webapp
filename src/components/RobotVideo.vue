<template>
  <video ref="videoElement" autoplay>
  </video>
</template>

<script>
export default {
  name: 'RobotVideo',
  props: {
    streamObject: null
  },
  data() {
    return {};
  },
  mounted() {
    console.log(this.$refs);

    this.$refs.videoElement.srcObject = this.streamObject.stream;
  }
};
</script>

<style lang="scss" scoped>
video {
  overflow: hidden;
  width: 100%;
  // height: auto;
}
</style>

