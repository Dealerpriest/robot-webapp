<template>
  <!-- <p class="connection-icon"> -->
    <span>
      {{labelText}}
      <v-icon :color="iconColor">{{icon}}</v-icon>
      <!-- <v-icon :color="iconColor">pets</v-icon> -->
      <br>
    </span>
  <!-- </p> -->
</template>

<script>
// import { mapState } from 'vuex';
export default {
  name: 'connectionStateListItem',
  props: {
    isOkay: Boolean,
    labelText: String
  },
  data() {
    return {};
  },
  computed: {
    iconColor() {
      return this.isOkay ? 'green' : 'red';
    },
    icon() {
      return this.isOkay ? 'done' : 'warning';
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.connection-icon {
  // z-index: 2000;
  // position: fixed;
  // left: 20px;
  // top: 20px;
  // background-color: rgba(0, 0, 0, 0.2);
}
</style>

