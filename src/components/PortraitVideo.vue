<template>
  <!-- <div> -->
    <!-- <a @click.prevent="addSource">add srcObject</a> -->
    
    <video ref="videoElement" autoplay>
    </video>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'portraitVideo',
  props: {
    streamObject: null
  },
  data() {
    return {};
  },
  methods: {
  },
  mounted() {
    // console.log(this.$refs);
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
  // height: 100%;
}
</style>

