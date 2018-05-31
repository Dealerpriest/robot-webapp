<template>
  <v-container class="keyboard-arrows" grid-list-sm>
    <v-layout row justify-center>
      <v-flex xs4 :class="{'accent--text': keyStates.ArrowUp}">
        <a @mousedown="setKeyState('ArrowUp')" @mouseup="unsetKeyState('ArrowUp')" @mouseout="unsetKeyState('ArrowUp')">
          <v-icon large style="color: inherit;">fas fa-caret-square-up</v-icon>
        </a>
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-flex xs4 :class="{'accent--text': keyStates.ArrowLeft}">
        <a @mousedown="setKeyState('ArrowLeft')" @mouseup="unsetKeyState('ArrowLeft')" @mouseout="unsetKeyState('ArrowLeft')">
          <v-icon large style="color: inherit;">fas fa-caret-square-left</v-icon>
        </a>
      </v-flex>
      <v-flex xs4 :class="{'accent--text': keyStates.ArrowDown}">
        <a @mousedown="setKeyState('ArrowDown')" @mouseup="unsetKeyState('ArrowDown')" @mouseout="unsetKeyState('ArrowDown')">
          <v-icon large style="color: inherit;">fas fa-caret-square-down</v-icon>
        </a>
      </v-flex>
      <v-flex xs4 :class="{'accent--text': keyStates.ArrowRight}">
        <a @mousedown="setKeyState('ArrowRight')" @mouseup="unsetKeyState('ArrowRight')" @mouseout="unsetKeyState('ArrowRight')">
          <v-icon large style="color: inherit;">fas fa-caret-square-right</v-icon>
        </a>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'keyStates',
  props: {},
  data() {
    return {};
  },
  computed: {
    // upClass() {
    //   return {
    //     highlighted: this.webRTC.keyStates.ArrowUp
    //   };
    // },
    ...mapState({
      keyStates: state => state.webRTC.keyStates
    })

    // ...mapState(['webRTC'])
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
.keyboard-arrows {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 125px;
}

.highlighted {
  color: yellowgreen;
}
</style>

