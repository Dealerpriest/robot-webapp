<template>
  <!-- <div> -->
    <!-- <a @click.prevent="addSource">add srcObject</a> -->
    <video id="video-tag" ref="videoElement" autoplay>
    </video>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'robotVideo',
  props: {
    streamObject: null
  },
  data() {
    return {};
  },
  methods: {
    addSource() {
      this.$refs.videoElement.srcObject = this.streamObject.stream;
    }
  },
  mounted() {
    console.log(this.$refs);
    // this.$refs.videoElement.srcObject = this.streamObject.stream;
    this.$nextTick(() => {
      console.log('NEXT TIIIIIIICK!!!');
      // document.getElementById('video-tag').srcObject = this.streamObject.stream;
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

