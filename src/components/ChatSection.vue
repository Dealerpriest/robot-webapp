<template>
  <MessageList :user="user"></MessageList>
</template>

<script>
import MessageList from '@/components/MessageList.vue';

export default {
  name: 'chatSection',
  props: ['user'],
  components: {
    MessageList
  }
};
</script>