import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const robotModule = {
  state: {
    isConnectedToWebsocketSerialServer: false,
    BRIOIsFound: false,
    RICOHIsFound: false
  },
  mutations: {
    setWebsocketToSerialServerConnection(state, value) {
      state.isConnectedToWebsocketSerialServer = value;
    },
    setBRIOIsFound(state, isFound){
      state.BRIOIsFound = isFound;
    },
    setRICOHIsFound(state, isFound){
      state.RICOHIsFound = isFound;
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
    offerCreated: false,
    offerSent: false,
    offerReceived: false,
    answerCreated: false,
    answerSent: false,
    answerReceived: false,
    localStreams: [],
    remoteStreams: [],
    keyStates: {}
  },
  mutations: {
    // eslint-disable-next-line
    resetWebRTCState(state) {
      //TODO: double check whether it's really ok to replace the whole state object.
      state = {
        isConnectedToSignalingServer: false,
        offerCreated: false,
        offerSent: false,
        offerReceived: false,
        offerHandled: false,
        answerCreated: false,
        answerSent: false,
        answerReceived: false,
        answerHandled: false,
        localStreams: [],
        remoteStreams: [],
        keyStates: {}
      };
    },
    setSignalingServerConnection(state, active) {
      state.isConnectedToSignalingServer = active;
    },
    setOfferCreated(state, created) {
      state.offerCreated = created;
    },
    setOfferSent(state, sent) {
      state.offerSent = sent;
    },
    setOfferReceived(state, received) {
      state.offerReceived = received;
    },
    setOfferHandled(state, handled) {
      state.offerHandled = handled;
    },
    setAnswerCreated(state, created) {
      state.answerCreated = created;
    },
    setAnswerSent(state, sent) {
      state.answerSent = sent;
    },
    setAnswerReceived(state, received) {
      state.answerReceived = received;
    },
    setAnswerHandled(state, handled) {
      state.answerHandled = handled;
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
    },
    ///TODO: Always use stream id to connect data between local and remote streams!!!!
    changeLocalCameraSetting(state, payload){
      let index = state.localStreams.findIndex((element) => {
        // console.log(element);
        //TODO: THIIIIIIIIIS IS NOT GOOD. Verifiying equality with label. Aaaaargh!!!! USE some kind of ID!!!!
        return element.metaData.label == payload.streamObject.metaData.label;
      });
      if(index < 0)
      {
        console.error("mutation failed. ChangeRemoteCameraSetting");
        return;
      }
      state.localStreams[index].metaData.settings[payload.key] = payload.newSetting;
    },
    changeRemoteCameraSetting(state, payload){
      let index = state.remoteStreams.findIndex((element) => {
        // console.log(element);
        return element == payload.streamObject;
      });
      if(index < 0)
      {
        console.error("mutation failed. ChangeRemoteCameraSetting");
        return;
      }
      // console.log(state.remoteStreams[index].metaData.settings[payload.key]);
      
      state.remoteStreams[index].metaData.settings[payload.key] = payload.newSetting;
    }
  }
};

const clientRobotStateModule = {
  state: {
    targetState: {
      pitch: 90,
      yaw: 90
    },
    actualState: {}
  },
  mutations: {
    setActualState(state, robotState){
      state.actualState = Object.assign({}, robotState);
    },
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
    clientRobotState: clientRobotStateModule
  },
  state: {},
  mutations: {},
  actions: {}
});
