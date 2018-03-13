<template>
  <div class="client-page">
    <img src="../assets/logo.png">
    <HelloWorld msg="What up brah?! You'r at the client route"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'client',
  components: {
    HelloWorld
  }
};
</script>
