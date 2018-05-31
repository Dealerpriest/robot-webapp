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
    keyStates: {}
  },
  mutations: {
    addRemoteStream(state, stream) {
      state.remoteStreams.push(stream);
    },
    addLocalStream(state, stream) {
      state.localStreams.push(stream);
    },
    setAllKeyStates(state, keys) {
      state.keyStates = Object.assign({}, keys);
      // Object.assign(state.keyStates, keys);
      // state.keyStates = keys;
    },
    unsetAllKeyStates(state) {
      Object.keys(state.keyStates).forEach(
        key => (state.keyStates[key] = false)
      );
    },
    setKeyState(state, key) {
      state.keyStates[key] = true;
    },
    unsetKeyState(state, key) {
      state.keyStates[key] = false;
    }
  }
};

const servoModule = {
  state: {
    pitch: 90,
    yaw: 90
  },
  mutations: {
    setPitch(state, value) {
      state.pitch = value;
    },
    setYaw(state, value) {
      state.yaw = value;
    },
    changePitch(state, amount) {
      state.pitch += amount;
    },
    changeYaw(state, amount) {
      state.yaw += amount;
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
    webRTC: webRTCModule,
    servo: servoModule
    // sockets: socketModule
  },
  state: {},
  mutations: {},
  actions: {}
});
