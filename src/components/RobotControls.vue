<template>
  <div class="button-grid-container keyboard-arrows">
    
    <IconButton slot="activator" id="up-slot" icon="fas fa-caret-square-up" :active="keyStates.ArrowUp" keyName="ArrowUp" ></IconButton>
    
    <IconButton id="left-slot" icon="fas fa-caret-square-left" :active="keyStates.ArrowLeft" keyName="ArrowLeft"></IconButton>  
    <IconButton id="down-slot" icon="fas fa-caret-square-down" :active="keyStates.ArrowDown" keyName="ArrowDown"></IconButton>  
    <IconButton id="right-slot" icon="fas fa-caret-square-right" :active="keyStates.ArrowRight" keyName="ArrowRight"></IconButton>

    <IconButton id="pan-up-slot" icon="fas fa-square" :active="keyStates.h" keyName="h" label="H"></IconButton>
    <IconButton id="pan-left-slot" icon="fas fa-square" :active="keyStates.b" keyName="b" label="B"></IconButton>
    <IconButton id="pan-down-slot" icon="fas fa-square" :active="keyStates.n" keyName="n" label="N"></IconButton>
    <IconButton id="pan-right-slot" icon="fas fa-square" :active="keyStates.m" keyName="m" label="M"></IconButton>
  </div>
  <!-- <v-container class="keyboard-arrows" grid-list-sm> -->
    <!-- <v-layout row justify-center> -->
      <!-- <v-flex xs12> -->
        <!-- <v-layout row justify-center>
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
        </v-layout> -->
      <!-- </v-flex> -->
      <!-- <v-flex xs6>

      </v-flex> -->
    <!-- </v-layout> -->
  <!-- </v-container> -->
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import IconButton from '@/components/IconButton.vue';
export default {
  name: 'robotControls',
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
  mounted() {},
  components: {
    IconButton
  }
};
</script>

<style lang="scss" scoped>
a {
  color: inherit;
}
.keyboard-arrows {
  z-index: 200;
  position: fixed;
  right: 20px;
  bottom: 20px;
  // width: 170px;
}

#up-slot {
  grid-area: up;
}

#left-slot {
  grid-area: left;
}

#right-slot {
  grid-area: right;
}

#down-slot {
  grid-area: down;
}

#pan-up-slot {
  grid-area: pan-up;
}

#pan-left-slot {
  grid-area: pan-left;
}

#pan-right-slot {
  grid-area: pan-right;
}

#pan-down-slot {
  grid-area: pan-down;
}

.button-grid-container {
  padding-left: 5px;
  padding-right: 5px;
  display: grid;
  grid-gap: 5px;
  align-items: center;
  justify-items: center;
  grid-template-columns: repeat(7, 40px);
  grid-template-rows: repeat(2, 40px);
  grid-template-areas:
    '.          pan-up    .          .  .     up    .'
    'pan-left   pan-down  pan-right  .  left  down  right';
}

.highlighted {
  color: yellowgreen;
}
</style>

