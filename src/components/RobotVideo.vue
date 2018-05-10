<template>
  <video ref="videoElement" autoplay>
  </video>
</template>

<script>
export default {
  name: 'RobotVideo',
  props: {
    stream: null
  },
  data() {
    return {};
  },
  mounted() {
    console.log(this.$refs);

    this.$refs.videoElement.srcObject = this.stream;
  }
};
</script>

<style lang="scss" scoped>
video {
  width: 100%;
  height: auto;
}
</style>

