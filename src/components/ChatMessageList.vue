<template>
  <div id="messages-container">
    <!-- <h2 class="button" style="font-weight: bold; text-align: center;">{{user.id}}</h2> -->
    <div v-for="message in chat.msgs" :key="message.id">
      <!-- <FromMessage :message="message"></FromMessage> -->
      <component :message="message" :is="message.sender === user.id? 'ChatMessageFrom': 'ChatMessageTo'"></component>
    </div>

  </div>
</template>

<script>
import ChatMessageFrom from '@/components/ChatMessageFrom.vue';
import ChatMessageTo from '@/components/ChatMessageTo.vue';
import { mapState } from 'vuex';

export default {
  name: 'chatMessageList',
  // data() {
  //   return {
  //     messages: [
  //       {
  //         id: 0,
  //         sender: 123,
  //         msg: 'Yoo!'
  //       },
  //       {
  //         id: 1,
  //         sender: 456,
  //         msg: 'Huh?'
  //       },
  //       {
  //         id: 2,
  //         sender: 123,
  //         msg: "How's it going?!}"
  //       },
  //       {
  //         id: 3,
  //         sender: 456,
  //         msg: "I'm fine!"
  //       },
  //       {
  //         id: 4,
  //         sender: 456,
  //         msg: 'Coool!'
  //       }
  //     ]
  //   };
  // },
  computed: {
    ...mapState(['user', 'chat'])
  },
  components: {
    ChatMessageFrom,
    ChatMessageTo
  }
};
</script>

<style lang="scss" scoped>
#messages-container {
  flex-direction: column;
  justify-content: flex-end;
  flex: 1;
  display: flex;
  overflow: hidden;
}
</style>
