import store from '@/store';

import io from 'socket.io-client';
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

    this.pcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    this.localStream;
    this.remoteStream;
    this.mediaLabels = null;

    this.readyForIce = false;
    this.iceQueue = [];

    this.socket.on('connect', () => {
      console.log('connected to signaling server socket');
      this.socket.send('hello');
    });

    this.socket.on('message', message => {
      console.log('socket message: ' + message);
      // if (typeof el !== 'undefined') {
      //   el.innerHTML = 'socket message: ' + message;
      // }
    });
  }

  createPeerConection() {
    let pc = new RTCPeerConnection(this.pcConfig);
    // pc.onicecandidate = handleIceCandidate;
    pc.onaddstream = this.handleRemoteStreamAdded;
    pc.onremovestream = this.handleRemoteStreamRemoved;

    return pc;
  }

  addDataChannel(pc, label) {
    return pc.createDataChannel(label, { reliable: true });
  }

  handleRemoteStreamAdded = event => {
    console.log('Remote stream added. Event: ', event);
    // this.remoteStream = event.stream;
    // console.log(this.remoteStream.getTracks());
    console.log(this.mediaLabels);
    let remoteStream = {};
    remoteStream['label'] = this.mediaLabels[event.stream.id];
    remoteStream['stream'] = event.stream;
    store.commit('addRemoteStream', remoteStream);
    if (this.remoteVideoPool) {
      let videoElement = document.createElement('video');
      videoElement.autoplay = true;
      this.remoteVideoPool.appendChild(videoElement);
      videoElement.srcObject = this.remoteStream;
    }
    // if (remoteVideo) {
    //   console.log("adding remote stream to video element");
    //   remoteVideo.srcObject = remoteStream;
    // }
  };

  handleRemoteStreamRemoved(event) {
    console.log('Remote stream removed. Event: ', event);
    //TODO: Handle removal of stream and do some housekeeping
  }

  //return a promise that resolves with a mediastream if we got media
  getLocalMedia(constraints) {
    return navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      console.log('got local media stream with id: ');
      console.log(stream.id);
      this.localStream = stream;
      if (this.localVideoPool) {
        let videoElement = document.createElement('video');
        videoElement.autoplay = true;
        this.localVideoPool.appendChild(videoElement);
        videoElement.srcObject = this.localStream;
      }
      return this.localStream;
    });
  }

  //resolves with the peer connection that the stream was added to
  addOutgoingStream(pc, stream) {
    console.log('adding outgoing stream:');
    console.log(stream);
    stream.getTracks().forEach(track => {
      console.log('track: ');
      console.log(track);
      let caps = track.getCapabilities();
      console.log('capabilities: ');
      console.log(caps);
      stream.givenName = track.label;
      console.log(stream);

      pc.addTrack(track, stream);
    });
    //TODO: Should we do some kind of check here to see it's all good before we resolve??
    return pc;
  }

  //returns a promise that resolves if the offer was created and sent to the signal server.
  createOfferAndSend(pc, targetSocketId, labels) {
    console.log('creating offer for pc: ');
    console.log(pc);
    return pc.createOffer().then(desc => {
      console.log('setting local description');
      pc.setLocalDescription(desc);
      // .then((desc) => {
      //   console.log('sending offer to signaling server');
      //   console.log(desc);
      //   socket.emit('signalingmessage', JSON.stringify({'offer' : desc}));
      // });
      console.log('sending offer to signaling server');
      console.log(desc);
      this.socket.emit(
        'offer',
        JSON.stringify({
          targetSocketId: targetSocketId,
          offer: desc,
          mediaLabels: labels
        })
      );
    });
  }

  //returns a promise that resolves if the answer was created and sent to the signal server.
  createAnswerAndSend(pc) {
    console.log('creating answer');
    return pc.createAnswer().then(desc => {
      console.log('setting local description');
      pc.setLocalDescription(desc);
      // .then((desc) => {
      //   console.log('sending answer to signaling server');
      //   socket.emit('signalingmessage', JSON.stringify({'answer' : desc}));
      // });
      console.log('sending answer to signaling server');
      console.log(desc);
      this.socket.emit('answer', JSON.stringify({ answer: desc }));
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
    console.log(setRemoteDescPromise);
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
    console.log('ice candidate received');
    let candidate = new RTCIceCandidate(candidateString);
    if (!this.readyForIce) {
      console.log('Not ready for ice. Pushing the candidate to the queue');
      this.iceQueue.push(candidate);
      return;
    }
    //We are ready for ice. Let's add the candidate.
    pc
      .addIceCandidate(candidate)
      .then(console.log('added candidate to peer connection'))
      .catch(error =>
        console.log('failed to add candidate to peer connection' + error)
      );
  }
}

// let pc;
// let pcConfig = {
//   iceServers: [
//     {
//       urls: 'stun:stun.l.google.com:19302'
//     }
//   ]
// };

// let localStream;
// let remoteStream;

// let remoteVideoPool = document.getElementById('remote-video-pool');
// let remoteVideo = document.getElementById('remote-video-stream');
// let localVideoPool = document.getElementById('local-video-pool');
// let localVideo = document.getElementById('local-video-stream');

// socket.on('connect', () => {
//   console.log('connected to socket');
//   socket.send('hello');
// });

// socket.on('message', message => {
//   if (typeof el !== 'undefined') {
//     el.innerHTML = 'socket message: ' + message;
//   }
// });

// function createPeerConection() {
//   let pc = new RTCPeerConnection(pcConfig);
//   // pc.onicecandidate = handleIceCandidate;
//   pc.onaddstream = handleRemoteStreamAdded;
//   pc.onremovestream = handleRemoteStreamRemoved;

//   return pc;
// }

// function addDataChannel(pc, label) {
//   return pc.createDataChannel(label, { reliable: true });
// }

// function handleRemoteStreamAdded(event) {
//   console.log('Remote stream added. Event: ', event);
//   remoteStream = event.stream;
//   if (remoteVideoPool) {
//     let videoElement = document.createElement('video');
//     videoElement.autoplay = true;
//     remoteVideoPool.appendChild(videoElement);
//     videoElement.srcObject = remoteStream;
//   }
//   // if (remoteVideo) {
//   //   console.log("adding remote stream to video element");
//   //   remoteVideo.srcObject = remoteStream;
//   // }
// }

// function handleRemoteStreamRemoved(event) {
//   console.log('Remote stream removed. Event: ', event);
//   //TODO: Handle removal of stream and do some housekeeping
// }

// //return a promise that resolves with a mediastream if we got media
// function getLocalMedia(constraints) {
//   return navigator.mediaDevices.getUserMedia(constraints).then(stream => {
//     console.log('got local media stream with id: ');
//     console.log(stream.id);
//     localStream = stream;
//     if (localVideoPool) {
//       let videoElement = document.createElement('video');
//       videoElement.autoplay = true;
//       localVideoPool.appendChild(videoElement);
//       videoElement.srcObject = localStream;
//     }
//     return localStream;
//   });
// }

// //resolves with the peer connection that the stream was added to
// function addOutgoingStream(pc, stream) {
//   console.log('adding outgoing stream:');
//   console.log(stream);
//   stream.getTracks().forEach(track => {
//     console.log('track: ');
//     console.log(track);
//     let caps = track.getCapabilities();
//     console.log('capabilities: ');
//     console.log(caps);

//     pc.addTrack(track, stream);
//   });
//   //TODO: Should we do some kind of check here to see it's all good before we resolve??
//   return pc;
// }

// //returns a promise that resolves if the offer was created and sent to the signal server.
// function createOfferAndSend(pc, targetSocketId) {
//   console.log('creating offer for pc: ');
//   console.log(pc);
//   return pc.createOffer().then(desc => {
//     console.log('setting local description');
//     pc.setLocalDescription(desc);
//     // .then((desc) => {
//     //   console.log('sending offer to signaling server');
//     //   console.log(desc);
//     //   socket.emit('signalingmessage', JSON.stringify({'offer' : desc}));
//     // });
//     console.log('sending offer to signaling server');
//     console.log(desc);
//     socket.emit(
//       'offer',
//       JSON.stringify({ targetSocketId: targetSocketId, offer: desc })
//     );
//   });
// }

// //returns a promise that resolves if the answer was created and sent to the signal server.
// function createAnswerAndSend(pc) {
//   console.log('creating answer');
//   return pc.createAnswer().then(desc => {
//     console.log('setting local description');
//     pc.setLocalDescription(desc);
//     // .then((desc) => {
//     //   console.log('sending answer to signaling server');
//     //   socket.emit('signalingmessage', JSON.stringify({'answer' : desc}));
//     // });
//     console.log('sending answer to signaling server');
//     console.log(desc);
//     socket.emit('answer', JSON.stringify({ answer: desc }));
//   });
// }

// //returns a promise that resolves if the remote description gets set
// //TODO: separate ice queues for each client
// let readyForIce = false;
// function handleOfferOrAnswer(pc, offerOrAnswer) {
//   let setRemoteDescPromise = pc
//     .setRemoteDescription(new RTCSessionDescription(offerOrAnswer))
//     .then(() => {
//       readyForIce = true;
//       //if we had any ice candidates queued up, let's add them.
//       if (iceQueue.length > 0) {
//         iceQueue.forEach(candidate => {
//           pc.addIceCandidate(candidate);
//         });
//       }
//     });
//   console.log(setRemoteDescPromise);
//   return setRemoteDescPromise;
// }

// function handleIceCandidate(evt) {
//   console.log('ice candidate event');
//   console.log(evt);
//   if (evt.candidate) {
//     console.log('sending ice to the signal server');
//     socket.emit('ice', JSON.stringify({ candidate: evt.candidate }));
//   } else {
//     console.log('all ice candidates have been sent');
//   }
// }

// let iceQueue = [];
// function handleIncomingIce(pc, candidateString) {
//   //make sure we don't try to add candidates before remoteDescription is set! Put them in queue and add them after remote has been set.
//   console.log('ice candidate received');
//   let candidate = new RTCIceCandidate(candidateString);
//   if (!readyForIce) {
//     console.log('Not ready for ice. Pushing the candidate to the queue');
//     iceQueue.push(candidate);
//     return;
//   }
//   //We are ready for ice. Let's add the candidate.
//   pc
//     .addIceCandidate(candidate)
//     .then(console.log('added candidate to peer connection'))
//     .catch(error =>
//       console.log('failed to add candidate to peer connection' + error)
//     );
// }
