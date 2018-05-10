<template>
  <div id="app">
  <router-view />
  
</div>
</template>

<script>
export default {
  name: 'app',
  data: () => ({
    // drawer: true
  }),
  props: {
    source: String
  }
};
</script>



<style lang="scss">
// @import '../public/styles/custom-bootstrap.scss';
// @import '../node_modules/bootstrap/scss/bootstrap.scss';

// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }
// #nav {
//   padding: 30px;
//   a {
//     font-weight: bold;
//     color: #2c3e50;
//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
