<template>
  <a :class="{'accent--text': active}" @mousedown="setKeyState(keyName)" @mouseup="unsetKeyState(keyName)" @mouseout="unsetKeyState(keyName)">
    <v-icon large style="color: inherit;">{{icon}}</v-icon>
  </a>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'iconButton',
  props: {active: false, keyName: null, icon: null},
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
  color: inherit;
}
</style>

