<template>
  <v-container class="keyboard-arrows" grid-list-sm>
    <v-layout>
      <v-flex>
        <!-- <v-layout row justify-center>
          <v-flex xs4 :class="{'accent--text': keyStates.ArrowUp}">
              <v-icon large style="color: inherit;">fas fa-caret-square-up</v-icon>
          </v-flex>
        </v-layout> -->
        <v-layout row justify-center>
          <v-flex xs4 offset-xs4 :class="{'accent--text': keyStates.ArrowUp}">
              <v-icon large style="color: inherit;">fas fa-caret-square-up</v-icon>
          </v-flex>
          <v-flex xs4 :class="{'accent--text': keyStates.ArrowLeft}">
              <v-icon large style="color: inherit;">fas fa-caret-square-left</v-icon>
          </v-flex>
          <v-flex xs4 :class="{'accent--text': keyStates.ArrowDown}">
              <v-icon large style="color: inherit;">fas fa-caret-square-down</v-icon>
          </v-flex>
          <v-flex xs4 :class="{'accent--text': keyStates.ArrowRight}">
              <v-icon large style="color: inherit;">fas fa-caret-square-right</v-icon>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout row justify-center>
          <v-flex xs4 offset-xs4 :class="{'accent--text': keyStates.ArrowUp}">
              <v-icon large style="color: inherit;">fas fa-caret-square-up</v-icon>
          </v-flex>
          <v-flex xs4 :class="{'accent--text': keyStates.ArrowLeft}">
              <v-icon large style="color: inherit;">fas fa-caret-square-left</v-icon>
          </v-flex>
          <v-flex xs4 :class="{'accent--text': keyStates.ArrowDown}">
              <v-icon large style="color: inherit;">fas fa-caret-square-down</v-icon>
          </v-flex>
          <v-flex xs4 :class="{'accent--text': keyStates.ArrowRight}">
              <v-icon large style="color: inherit;">fas fa-caret-square-right</v-icon>
          </v-flex>
        </v-layout>
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
    ...mapState({
      keyStates: state => state.webRTC.keyStates
    })
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

