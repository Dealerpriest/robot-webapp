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

const webRTCModule = {
  state: {
    localStreams: [],
    remoteStreams: [],
    robotCommand: 'None'
  },
  mutations: {
    addRemoteStream(state, stream) {
      state.remoteStreams.push(stream);
    },
    addLocalStream(state, stream) {
      state.localStreams.push(stream);
    },
    setRobotCommand(state, command) {
      state.robotCommand = command;
    }
  }
};

// const socketModule = {
//   state: {
//     serialSocket: null,
//     signalingSocket: null
//   },
//   mutations: {
//     setSerialSocket(state, socket) {
//       state.serialSocket = socket;
//     },
//     setSignalingSocket(state, socket) {
//       state.signalingSocket = socket;
//     }
//   }
// };

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    user: userModule,
    chat: chatModule,
    webRTC: webRTCModule
    // sockets: socketModule
  },
  state: {},
  mutations: {},
  actions: {}
});
