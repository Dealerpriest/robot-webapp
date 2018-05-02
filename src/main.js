import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import firebase from 'firebase';

// import io from 'socket.io-client';

// import VueSocketio from '../../Vue-Socket.io';

// // Create different socket connections depending on environment variables.
// // hmmmm. thats not what we want... What the f am i doing here??
// let connections = {};
// let webRTCToken;
// if (process.env.VUE_APP_IS_ROBOT) {
//   webRTCToken = process.env.VUE_APP_ROBOT_TOKEN;

//   connections.robot = io('http://localhost:3000', {
//     query: {
//       token: webRTCToken
//     }
//   });
// } else {
//   webRTCToken = process.env.VUE_APP_CLIENT_TOKEN;
// }

// connections.webRTC = io('http://localhost:5000', {
//   query: {
//     token: webRTCToken
//   }
// });

// Vue.use(VueSocketio, connections);

// let robotSocket;

Vue.config.productionTip = false;

var config = JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG);
console.log('firebase config:');
console.log(config);

firebase.initializeApp(config);
console.log(firebase);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
