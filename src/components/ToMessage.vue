<template>
  <p style="font-weight: bold;">{{message.msg}}</p>
</template>

<script>
export default {
  name: 'toMessage',
  props: ['message']
};
</script>