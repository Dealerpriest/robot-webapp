import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import firebase from 'firebase';

//TODO: Remove this when actual deployment!!
Vue.config.devtools = true;

//Imports all stuff needed for having vuetify look properly. Except the roboto font, which is linked from index.html
import Vuetify from 'vuetify';
Vue.use(Vuetify);
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.scss';
import fontawesome from '@fortawesome/fontawesome';
import {
  faCaretSquareLeft,
  faCaretSquareRight,
  faCaretSquareUp,
  faCaretSquareDown
} from '@fortawesome/fontawesome-free-solid';

fontawesome.library.add(
  faCaretSquareLeft,
  faCaretSquareRight,
  faCaretSquareUp,
  faCaretSquareDown
);

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
