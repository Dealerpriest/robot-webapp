<template>
  <p style="font-weight: bold;">{{message.msg}}</p>
</template>

<script>
export default {
  name: 'chatMessageTo',
  props: ['message']
};
</script>