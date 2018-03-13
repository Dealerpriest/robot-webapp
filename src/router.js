import Vue from 'vue';
import Router from 'vue-router';
import Client from './views/Client.vue';
import Robot from './views/Robot.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'client',
      component: Client
    },
    {
      path: '/robot',
      name: 'robot',
      component: Robot
    }
  ]
});
