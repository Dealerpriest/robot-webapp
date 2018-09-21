<template>
  <!-- <div>
    <a @click.prevent="addSource">add srcObject</a> -->
    
    <!-- This is a weird hack because the muted property has to be set on initial render in browsers. Adding the property won't have any effect -->
    <!-- https://github.com/vuejs/vue/issues/2042 -->
    <video v-if="isMuted" ref="videoElement" muted autoplay>
    </video>
    <video v-else ref="videoElement" autoplay>
    </video>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'portraitVideo',
  props: {
    streamObject: null,
    isMuted: null
  },
  data() {
    return {
    };
  },
  methods: {
    // addSource() {
    //   this.$refs.videoElement.srcObject = this.streamObject.stream;
    // }
  },
  mounted() {
    // console.log(this.$refs);
    // this.$refs.videoElement.srcObject = this.streamObject.stream;
    this.$nextTick(() => {
      // console.log('NEXT TIIIIIIICK!!!');
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

