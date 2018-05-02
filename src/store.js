import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const userModule = {
  state: {
    id: '',
    name: ''
  },
  mutations: {
    setId(state, id) {
      state.id = id;
    },
    setName(state, name) {
      state.name = name;
    }
  }
};

const chatModule = {
  state: {
    msgs: []
  },
  mutations: {
    addMessageToChat(state, msg) {
      state.msgs.push(msg);
    }
  }
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    user: userModule,
    chat: chatModule
  },
  state: {},
  mutations: {},
  actions: {}
});
