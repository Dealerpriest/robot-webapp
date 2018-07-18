import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const robotModule = {
  state: {
    isConnectedToWebsocketSerialServer: false
  },
  mutations: {
    setWebsocketToSerialServerConnection(state, value) {
      state.isConnectedToWebsocketSerialServer = value;
    }
  }
};

const clientModule = {
  state: {
    userState: {
      id: '',
      name: ''
    }
  },
  mutations: {
    setUserId(state, id) {
      state.userState.id = id;
    },
    setUserName(state, name) {
      state.userState.name = name;
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
    isConnectedToSignalingServer: false,
    localStreams: [],
    remoteStreams: [],
    keyStates: {}
  },
  mutations: {
    setSignalingServerConnection(state, active) {
      state.isConnectedToSignalingServer = active;
    },
    addRemoteStream(state, stream) {
      state.remoteStreams.push(stream);
    },
    addLocalStream(state, stream) {
      state.localStreams.push(stream);
    },
    clearRemoteStreams(state) {
      state.remoteStreams = [];
    },
    clearLocalStreams(state) {
      state.localStreams = [];
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

//TODO: Is the production check really correct? Check vuex documentation.
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    client: clientModule,
    robot: robotModule,
    chat: chatModule,
    webRTC: webRTCModule,
    servo: servoModule
    // sockets: socketModule
  },
  state: {},
  mutations: {},
  actions: {}
});
