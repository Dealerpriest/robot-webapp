<template>
  <!-- <div> -->
  <v-container fluid fill-height>
    <v-layout column justify-end>
      <!-- <v-flex> -->
        <MessageList></MessageList>
      <!-- </v-flex> -->
      <!-- <v-flex> -->
        <ChatInput></ChatInput>
      <!-- </v-flex> -->
    </v-layout>
  </v-container>
  <!-- </div> -->
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