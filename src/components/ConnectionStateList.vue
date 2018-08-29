<template>
  <div class="connection-state-list">
    <slot></slot>
  </div>
</template>

<script>
// import { mapState } from 'vuex';
export default {
  name: 'connectionStateList',
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.connection-state-list {
  z-index: 2000;
  position: fixed;
  left: 20px;
  top: 20px;
  background-color: rgba(0, 0, 0, 0.35);
}
</style>

