<template>
  <div class="video-container">
    
    <div style="z-index: 1000;" class="settings-list">
      <!-- <v-slider class="zoom-control"
            v-model="zoom"
            :max="streamObject.metaData.capabilities.zoom.max" 
            :min="streamObject.metaData.capabilities.zoom.min" 
            :step="streamObject.metaData.capabilities.zoom.step"
          ></v-slider> -->
      <!-- <template v-for="(capability, key) in streamObject.metaData.capabilities">
        <label v-if="capability.step" :key="key">
          {{key}}:{{streamObject.metaData.settings[key]}}
          <input @input="cameraSettingChanged(key, $event)" value="100" type="range" :max="capability.max" :min="capability.min" :step="capability.step"/>
          <br />
        </label>
      </template> -->
      
      <!-- <template v-if="streamObject.metaData.capabilities.zoom">
        <label>
          ZOOM: 
          <input @input="cameraSettingChanged('zoom', $event)" value="streamObject.metaData.settings.zoom" type="range" :max="streamObject.metaData.capabilities.zoom.max" :min="streamObject.metaData.capabilities.zoom.min" :step="streamObject.metaData.capabilities.zoom.step"/>
        </label>
      </template> -->
    </div>
    <!-- <v-icon class="crosshair" large style="color: inherit;">my_location</v-icon> -->
    <video ref="videoElement" @mousedown="startDrag" autoplay>
    </video>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'brioVideo',
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
      zoom: 1
    };
  },
  computed: {
    // zoom: {
    //   get () {
    //     return this.streamObject.metaData.settings.zoom;
    //   },
    //   set (value) {
    //     this.changeRemoteCameraSetting({streamObject: this.streamObject, key: 'zoom', newSetting: Number(value)});
    //   }
    // }
    width() {
      return this.boundingRect().width;
    },
    height() {
      return this.boundingRect().height;
    }
  },
  methods: {
    boundingRect(){
      return this.$refs.videoElement.getBoundingClientRect().width;
    },
    angleToCoordinate(fieldOfView, screenLength, angle){
      let viewplaneDistance = (0.5 * screenLength) / Math.tan(0.5 * fieldOfView);
      return Math.tan(angle) * viewplaneDistance - 0.5 * screenLength;
    },
    addSource() {
      this.$refs.videoElement.srcObject = this.streamObject.stream;
    },
    startDrag(event) {
      event.s = null;
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
    cameraSettingChanged(key, e){
      this.changeRemoteCameraSetting({streamObject: this.streamObject, key: key, newSetting: Number(e.target.value)});
    },
    ...mapMutations(['setPitch', 'setYaw', 'changeRemoteCameraSetting'])
  },
  mounted() {
    // this.calculateViewplaneDistance();
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
.video-container {
  position: relative;
}

.settings-list {
  position: absolute;
  width: 500px;
}

.zoom-control {
  // width: 400px;
}

.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

video {
  cursor: pointer;
  // overflow: hidden;
  // width: 100%;
  // height: auto;
}
</style>

