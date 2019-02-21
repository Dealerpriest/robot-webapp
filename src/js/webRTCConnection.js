import store from '@/store';
// import resurrect from 'resurrect.js';
// import Hydrate from 'hydrate';

import io from 'socket.io-client';

// default stringify won't handle interface stuff inside prototype.
// Let's make it understand MediaSettingsRange.
MediaSettingsRange.prototype.toJSON = function(){
  return {max: this.max, min: this.min, step: this.step};
};

export default class webRTCConnection {
  constructor(
    serverUrl,
    token,
    localVideoTag,
    remoteVideoTag,
    localVideoContainer,
    remoteVideoContainer
  ) {
    this.serverUrl = serverUrl;
    this.token = token;

    ///CONNECT TO SIGNALING SERVER
    console.log(
      'Connecting to signaling server: ' + serverUrl + ' token: ' + token
    );
    this.socket = io(serverUrl, {
      query: {
        token: token
      }
    });

    this.remoteVideoElement = remoteVideoTag;
    this.localVideoElement = localVideoTag;
    this.localVideoPool = localVideoContainer;
    this.remoteVideoPool = remoteVideoContainer;

    // this.necromancer = new resurrect();
    // this.hydrater = new Hydrate();

    // TODO: keep turn server user in an .env file so that we at least doesn't share it on github.
    this.pcConfig = {
      sdpSemantics:'unified-plan',
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:54.197.33.120:3478',
          username: 'greger',
          credential: 'bajsmannen'
        }
      ]
    };
    this.localStream;
    this.remoteStream;
    this.remoteStreamsMetaData = {};
    this.localStreamsMetaData = {};

    this.readyForIce = false;
    this.iceQueue = [];

    this.socket.on('connect', () => {
      console.log('connected to signaling server socket');
      store.commit('setSignalingServerConnection', true);
      this.socket.send('hello');
    });

    this.socket.on('message', message => {
      console.log('socket message: ' + message);
      // if (typeof el !== 'undefined') {
      //   el.innerHTML = 'socket message: ' + message;
      // }
    });

    this.socket.on('disconnect', () => {
      console.log('disconnected from signaling server');
      store.commit('setSignalingServerConnection', false);
    });
  }

  createPeerConection() {
    let pc = new RTCPeerConnection(this.pcConfig);
    // pc.onremovestream = this.handleRemoteStreamRemoved;

    pc.ontrack = this.handleRemoteTrackAdded;

    pc.onconnectionstatechange = event => {
      let importantLogStyle = 'background: #222; color: #bada55';
      console.log('%c peerconnection state changed: ', importantLogStyle);
      console.log(event);
      console.log('state is: ' + pc.connectionState);
      switch (pc.connectionState) {
        case 'connected':
          // The connection has become fully connected
          break;
        case 'disconnected':
        case 'failed':
          // One or more transports has terminated unexpectedly or in an error
          break;
        case 'closed':
          // The connection has been closed
          break;
      }
    };

    return pc;
  }

  addDataChannel(pc, label) {
    return pc.createDataChannel(label, { reliable: true });
  }

  handleRemoteTrackAdded = event => {
    console.log('Remote track added. Event: ', event);
    // this.remoteStream = event.stream;
    // console.log(this.remoteStream.getTracks());
    // console.log(this.mediaLabels);
    console.log('stream id: ' + event.streams[0].id);
    console.log("tracks in incoming stream: ");
    console.log(event.streams[0].getTracks());
    if(store.state.webRTC.remoteStreams.some(elem => elem.stream === event.streams[0])){
      console.log('stream already added to remotestreams array. Not adding again!');
      return;
    }

    let remoteStream = {stream: null, metaData: {}};
    if (this.remoteStreamsMetaData[event.streams[0].id]) {
      console.log('matching received stream with presaved metaData: ' + this.remoteStreamsMetaData[event.streams[0].id]);
      remoteStream['metaData'] = this.remoteStreamsMetaData[event.streams[0].id];
    } else {
      console.log('no metaData presaved for this stream. Using id as label: ' + event.streams[0].id);
      remoteStream['metaData']['label'] = event.streams[0].id;
    }

    remoteStream['stream'] = event.streams[0];
    store.commit('addRemoteStream', remoteStream);
  };

  handleRemoteStreamRemoved(event) {
    console.log('Remote stream removed. Event: ', event);
    //TODO: Handle removal of stream and do some housekeeping
  }

  //return a promise that resolves with a mediastream if we got media
  getLocalMedia(constraints) {
    // console.log('Trying to get local media ------------------------------');
    return navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      console.log('got local media stream with id: ' + stream.id);
      // this.localStream = stream;
      // if (this.localVideoPool) {
      //   let videoElement = document.createElement('video');
      //   videoElement.autoplay = true;
      //   this.localVideoPool.appendChild(videoElement);
      //   videoElement.srcObject = this.localStream;
      // }
      return stream;
    });
  }

  //returns the peer connection that the stream was added to
  addOutgoingStream(pc, stream) {
    console.log('adding outgoing stream:');
    console.log(stream);
    stream.getTracks().forEach(track => {
      // if(track.kind != "video"){
      //   console.log('not videotrack. Skipping');
      //   return;
      // }
      // console.log('track: ');
      // console.log(track);
      // let caps = track.getCapabilities();
      // console.log('capabilities: ');
      // console.log(caps);
      // stream.givenName = track.label;
      // console.log(stream);

      pc.addTrack(track, stream);
    });
    //TODO: Should we do some kind of check here to see it's all good before we return??
    return pc;
  }

  //returns a promise that resolves if the offer was created and sent to the signal server.
  createOfferAndSend(pc, targetSocketId, streamsMetaData) {
    console.log('creating offer');
    // console.log(pc);
    return pc.createOffer().then(desc => {
      store.commit('setOfferCreated', true);
      // console.log('setting local description');
      pc.setLocalDescription(desc);
      // .then((desc) => {
      //   console.log('sending offer to signaling server');
      //   console.log(desc);
      //   socket.emit('signalingmessage', JSON.stringify({'offer' : desc}));
      // });
      console.log('sending offer to signaling server');
      console.log(desc);

      // console.log('hydration test:');
      // let testString = this.hydrater.stringify({value: null, test: 1234, yaw: 'test'});
      // console.log(this.hydrater.parse(testString));

      // let msg = this.necromancer.stringify({
      //   targetSocketId: targetSocketId,
      //   offer: desc,
      //   streamsMetaData: streamsMetaData
      // });

      // console.log(this.necromancer.resurrect(msg));
      let msg = JSON.stringify({
        targetSocketId: targetSocketId,
        offer: desc,
        streamsMetaData: streamsMetaData
      });
      // console.log('--------------------------TESTING toJSON modification----------');
      // console.log(JSON.parse(msg));
      this.socket.emit(
        'offer',
        msg
      );
      store.commit('setOfferSent', true);
    });
  }

  //returns a promise that resolves if the answer was created and sent to the signal server.
  createAnswerAndSend(pc, streamsMetaData) {
    console.log('creating answer');
    return pc.createAnswer().then(desc => {
      store.commit('setAnswerCreated', true);
      // console.log('setting local description');
      pc.setLocalDescription(desc);
      // .then((desc) => {
      //   console.log('sending answer to signaling server');
      //   socket.emit('signalingmessage', JSON.stringify({'answer' : desc}));
      // });
      console.log('sending answer to signaling server');
      console.log(desc);
      this.socket.emit(
        'answer',
        JSON.stringify({ answer: desc, streamsMetaData: streamsMetaData })
        // this.necromancer.stringify({ answer: desc, streamsMetaData: streamsMetaData })
      );
      store.commit('setAnswerSent', true);
    });
  }

  //returns a promise that resolves if the remote description gets set
  //TODO: separate ice queues for each client
  handleOfferOrAnswer(pc, offerOrAnswer) {
    let setRemoteDescPromise = pc
      .setRemoteDescription(new RTCSessionDescription(offerOrAnswer))
      .then(() => {
        this.readyForIce = true;
        //if we had any ice candidates queued up, let's add them.
        if (this.iceQueue.length > 0) {
          this.iceQueue.forEach(candidate => {
            pc.addIceCandidate(candidate);
          });
        }
      });
    // console.log(setRemoteDescPromise);
    return setRemoteDescPromise;
  }

  handleIceCandidate(evt) {
    console.log('ice candidate event');
    console.log(evt);
    if (evt.candidate) {
      console.log('sending ice to the signal server');
      this.socket.emit('ice', JSON.stringify({ candidate: evt.candidate }));
    } else {
      console.log('all ice candidates have been sent');
    }
  }

  handleIncomingIce(pc, candidateString) {
    //make sure we don't try to add candidates before remoteDescription is set! Put them in queue and add them after remote has been set.
    // console.log('ice candidate received');
    let candidate = new RTCIceCandidate(candidateString);
    if (!this.readyForIce) {
      console.log('Not ready for ice. Pushing the candidate to the queue');
      this.iceQueue.push(candidate);
      return;
    }
    //We are ready for ice. Let's add the candidate.
    pc
      .addIceCandidate(candidate)
      // .then(console.log('added candidate to peer connection'))
      .catch(error =>
        console.log('failed to add candidate to peer connection' + error)
      );
  }
}
