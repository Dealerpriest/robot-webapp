<template>
  <div class="robot">
    <h1>Yo! This is the robot route!</h1>
  </div>
</template>

<script>
console.log('yooooo!');
// navigator.mediaDevices.getUserMedia({ video: true, audio: false });
export default {
  name: 'robot',
  created() {
    let cameraScriptTag = document.createElement('script');
    cameraScriptTag.setAttribute('src', '/js/camera.js');
    document.head.appendChild(cameraScriptTag);
  }
};
</script>
