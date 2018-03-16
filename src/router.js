import Vue from 'vue';
import Router from 'vue-router';
import Client from './views/Client.vue';
import ClientLogin from './views/ClientLogin.vue';
// import Robot from './views/Robot.vue';

Vue.use(Router);

const Robot = () =>
  import(/*webpackChunkName: 'root.robot'*/ './views/Robot.vue');

export default new Router({
  routes: [
    {
      path: '/',
      name: 'client',
      component: Client
    },
    {
      path: '/login',
      name: 'clientLogin',
      component: ClientLogin
    },
    {
      path: '/robot',
      name: 'robot',
      component: Robot
    }
  ]
});
