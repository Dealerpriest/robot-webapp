<template>
  <div class="client-page">
    <img src="../assets/logo.png">
    <HelloWorld msg="What up brah?! You'r at the client route"/>
    <ChatSection :user="user"></ChatSection>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import ChatSection from '@/components/ChatSection.vue';

export default {
  name: 'client',
  data: function() {
    return {
      user: {
        id: 123
      }
    };
  },
  components: {
    HelloWorld,
    ChatSection
  }
};
</script>
