<template>
  <v-tooltip top>
    <a slot="activator" :class="{'accent--text': active}" @mousedown="setKeyState(keyName)" @mouseup="unsetKeyState(keyName)" @mouseout="unsetKeyState(keyName)">
      <span class="button-label" v-if="label">{{label}}</span>
      <v-icon large style="color: inherit;">{{icon}}</v-icon>
    </a>
    <span>{{label}}</span>
  </v-tooltip>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'iconButton',
  props: {active: false, keyName: null, icon: null, label: null},
  data() {
    return {};
  },
  computed: {
    // ...mapState({
    //   keyStates: state => state.webRTC.keyStates
    // })
  },
  methods: {
    ...mapMutations(['setKeyState', 'unsetKeyState'])
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
a {
  position: relative;
  color: inherit;
}

// .button-label{
//   position: relative; 
//   // left: 50%; 
//   // top: 50%
// }

.button-label {
  font-weight:bold;
  color: black;
  position: absolute;
  left: 50%; 
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>

