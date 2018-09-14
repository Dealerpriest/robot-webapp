<template>
  <!-- <div> -->
    <!-- <a @click.prevent="addSource">add srcObject</a> -->
      <video ref="videoElement" @mousedown="startDrag" autoplay>
      </video>
  <!-- </div> -->
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'robotVideoMovable',
  props: {
    streamObject: null
  },
  data() {
    return {
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      dragDistanceX: 0,
      dragDistanceY: 0,
    };
  },
  methods: {
    angleToCoordinate(fieldOfView, screenLength, angle){
      let viewplaneDistance = (0.5 * screenLength) / Math.tan(0.5 * fieldOfView);
      return Math.tan(angle) * viewplaneDistance - 0.5 * screenLength;
    },
    addSource() {
      this.$refs.videoElement.srcObject = this.streamObject.stream;
    },
    startDrag(event) {
      this.isDragging = true;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
    },
    updateDragDistance(event) {
      this.dragDistanceX = event.clientX - this.dragStartX;
      this.dragDistanceY = event.clientY - this.dragStartY;
      console.log(
        'updateDragDistance: x=',
        event.movementX,
        ' y=',
        event.movementY
      );
      if (event.movementY !== 0) {
        this.changePitch(event.movementY / 8);
      }
      if (event.movementX !== 0) {
        this.changeYaw(-event.movementX / 8);
      }
    },
    ...mapMutations(['setPitch', 'setYaw'])
  },
  mounted() {
    this.calculateViewplaneDistance();
    window.onmousemove = event => {
      if (this.isDragging) {
        this.updateDragDistance(event);
      }
    };
    // window.onmousedown = () => {
    //   this.isDragging = true;
    // };
    window.onmouseup = () => {
      this.isDragging = false;
    };
    console.log(this.$refs);
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
  cursor: pointer;
  // overflow: hidden;
  // width: 100%;
  // height: auto;
}
</style>

