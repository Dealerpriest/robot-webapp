<template>
  <div class="buttonstrip-container">
    <IconButton class="strip-button" id="testbutton1" icon="fas fa-square" :active="false" keyName="x"></IconButton>
    <IconButton class="strip-button" id="testbutton2" icon="fas fa-square" :active="false" keyName="x"></IconButton>
    <IconButton class="strip-button" id="testbutton3" icon="fas fa-square" :active="false" keyName="x"></IconButton>
    <IconButton class="strip-button" id="testbutton4" icon="fas fa-square" :active="false" keyName="x"></IconButton> 
    <!-- <IconButton id="up-slot" icon="fas fa-caret-square-up" :active="keyStates.ArrowUp" keyName="ArrowUp" ></IconButton>  
    <IconButton id="left-slot" icon="fas fa-caret-square-left" :active="keyStates.ArrowLeft" keyName="ArrowLeft"></IconButton>  
    <IconButton id="down-slot" icon="fas fa-caret-square-down" :active="keyStates.ArrowDown" keyName="ArrowDown"></IconButton>  
    <IconButton id="right-slot" icon="fas fa-caret-square-right" :active="keyStates.ArrowRight" keyName="ArrowRight"></IconButton>

    <IconButton id="pan-up-slot" icon="fas fa-square" :active="keyStates.h" keyName="h" label="H"></IconButton>
    <IconButton id="pan-left-slot" icon="fas fa-square" :active="keyStates.b" keyName="b" label="B"></IconButton>
    <IconButton id="pan-down-slot" icon="fas fa-square" :active="keyStates.n" keyName="n" label="N"></IconButton>
    <IconButton id="pan-right-slot" icon="fas fa-square" :active="keyStates.m" keyName="m" label="M"></IconButton> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import IconButton from '@/components/IconButton.vue';
export default {
  name: 'buttonStrip',
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
    // ...mapMutations(['setKeyState', 'unsetKeyState'])
  },
  mounted() {},
  components: {
    IconButton
  }
};
</script>

<style lang="scss" scoped>

// .buttonstrip-container {
//   // padding-left: 5px;
//   // padding-right: 5px;
//   display: grid;
//   grid-gap: 5px;
//   // align-items: center;
//   // justify-items: center;
//   grid-template-columns: 1;
//   // grid-template-rows: repeat(2, 40px);
//   // grid-template-areas:
//   //   '.          pan-up    .          .  .     up    .'
//   //   'pan-left   pan-down  pan-right  .  left  down  right';
// }

.strip-button {
  display: block;
  margin: 1em;
}

.buttonstrip-container {
  position: absolute;
  right: 2em;
  top: 50%;
  transform: translate(0, -50%);
  background-color: darkgrey;
  border-radius: 0.5em;
}

</style>

