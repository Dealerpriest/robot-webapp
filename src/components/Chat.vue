<template>
  <!-- <div> -->
  <v-container fluid fill-height>
    <v-layout column justify-end>
      <!-- <v-flex> -->
        <ChatMessageList></ChatMessageList>
      <!-- </v-flex> -->
      <!-- <v-flex> -->
        <ChatInput></ChatInput>
      <!-- </v-flex> -->
    </v-layout>
  </v-container>
  <!-- </div> -->
</template>

<script>
import ChatMessageList from '@/components/ChatMessageList.vue';
import ChatInput from './ChatInput.vue';

export default {
  name: 'chat',
  components: {
    ChatMessageList,
    ChatInput
  }
};
</script>