<template>
  <div>
    <h2 class="button" style="font-weight: bold; text-align: center;">{{user.id}}</h2>
    <div v-for="message in chat.msgs" :key="message.id">
      <!-- <FromMessage :message="message"></FromMessage> -->
      <component :message="message" :is="message.sender === user.id? 'FromMessage': 'ToMessage'"></component>
    </div>

  </div>
</template>

<script>
import FromMessage from '@/components/FromMessage.vue';
import ToMessage from '@/components/ToMessage.vue';
import { mapState } from 'vuex';

export default {
  name: 'messageList',
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
    FromMessage,
    ToMessage
  }
};
</script>