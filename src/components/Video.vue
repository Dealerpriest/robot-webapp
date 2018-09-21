<template>
  <video ref="videoElement" autoplay>
  </video>
</template>

<script>
export default {
  name: 'video',
  props: {
    streamObject: null
  },
  data() {
    return {};
  },
  methods: {
  },
  mounted() {
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

