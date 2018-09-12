<template>
  <a :class="{'accent--text': active}" @mousedown="setKeyState(keyName)" @mouseup="unsetKeyState(keyName)" @mouseout="unsetKeyState(keyName)">
    <div style="position:absolute; left: 50%;">
      <span class="button-label" v-if="label">{{label}}</span>
    </div>
    <v-icon large style="color: inherit;">{{icon}}</v-icon>
  </a>
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

.button-label {
  font-weight:bold;
  color: black;
  position: relative;
  left: -50%;
  // right: -50%;
}
</style>

