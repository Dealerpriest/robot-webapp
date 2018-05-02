<template>
  <div>
    <MessageList></MessageList>
    <ChatInput></ChatInput>
  </div>
</template>

<script>
import MessageList from '@/components/MessageList.vue';
import ChatInput from './ChatInput.vue';

export default {
  name: 'chatSection',
  components: {
    MessageList,
    ChatInput
  }
};
</script>