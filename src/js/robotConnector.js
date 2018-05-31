//SIGNALING AND WEBRTC

import webRTCConnection from '@/js/webRTCConnection.js';
// import store from '@/store';
import serialSocket from '@/js/serialsocket.js';

export default class robotConnector extends webRTCConnection {
  constructor(
    serverUrl,
    token,
    localVideoTag,
    remoteVideoTag,
    localVideoContainer,
    remoteVideoContainer
  ) {
    super(
      serverUrl,
      token,
      localVideoTag,
      remoteVideoTag,
      localVideoContainer,
      remoteVideoContainer
    );

    console.log('creating a webRTC robotConnector object');

    this.peers = {};
    this.mediaPromises = [];
    this.mediaConstraints = { audio: false, video: true };

    navigator.mediaDevices.enumerateDevices().then(devices => {
      console.log(devices);
      console.log(navigator.mediaDevices.getSupportedConstraints());
      devices.forEach(deviceInfo => {
        //Filter what devices to care about
        console.log('found media device with label ' + deviceInfo.label);
        if (
          deviceInfo.kind === 'videoinput'
          && !deviceInfo.label.includes('(05ca:2712)')
          && !deviceInfo.label.includes('RICOH THETA V FullHD')
        ) {
          console.log('found video device: ' + deviceInfo.label);
          this.mediaPromises.push({
            mediaPromise: this.getLocalMedia({
              audio: this.mediaConstraints.audio,
              video: {
                deviceId: { exact: deviceInfo.deviceId },
                frameRate: 15
                // width: { min: 1920, ideal: 3840, max: 3840 },
                // height: { min: 1080, ideal: 2160, max: 2160 }
              }
            }),
            label: deviceInfo.label
          });
        }
      });
    });

    this.socket.on('newClient', id => {
      console.log(
        'new client with id: '
          + id
          + ".   Let's create a new peerConnection for this one"
      );
      this.peers[id] = {};
      this.peers[id].pc = this.createPeerConection();
      this.peers[id].pc.onicecandidate = evt => {
        this.robotHandleIceCandidate(id, evt);
      };

      console.log('peers: ');
      console.log(this.peers);

      console.log('adding datachannel');
      this.peers[id].chatChannel = this.addDataChannel(
        this.peers[id].pc,
        'chatChannel'
      );
      this.peers[id].chatChannel.onmessage = event => {
        console.log('chatChannel message received: ' + event.data);
        // if ('textSender' in window) {
        //   textSender.value = event.data;
        // }
      };
      // if ('textSender' in window) {
      //   textSender.oninput = () => {
      //     console.log('input trigger');
      //     var data = textSender.value;
      //     console.log('readyState is ' + this.peers[id].chatChannel.readyState);
      //     if (this.peers[id].chatChannel.readyState === 'open') {
      //       this.peers[id].chatChannel.send(data);
      //     }
      //   };
      // }

      this.peers[id].robotControlChannel = this.addDataChannel(
        this.peers[id].pc,
        'robotControlChannel'
      );
      this.peers[id].robotControlChannel.onmessage = event => {
        let command = event.data;
        console.log('robotControlChannel message received: ' + command);
        if (
          command.startsWith('changePitch')
          || command.startsWith('changeYaw')
        ) {
          serialSocket.emit('cameraControl', command);
        } else {
          serialSocket.emit('motorControl', command);
        }
      };

      // This is a hack to identify different mediadevices on receiver end. Couldn't find any'proper' way to do it.
      // So we send the label and id pairs separately and pair them with their streams on the receiving end. Ugly...
      let labelsAndIds = {};
      let streamPromises = [];
      this.mediaPromises.forEach(({ mediaPromise, label }) => {
        if (label.includes('THETA') || label.includes('BRIO')) {
          streamPromises.push(
            mediaPromise.then(stream => {
              console.log(label);
              labelsAndIds[stream.id] = label;
              this.addOutgoingStream(this.peers[id].pc, stream);
            })
          );
        }
      });
      Promise.all(streamPromises)
        // .then(stream => addOutgoingStream(peers[id].pc, stream))
        // eslint-disable-next-line
        .then(resolveValues =>
          this.createOfferAndSend(this.peers[id].pc, id, labelsAndIds)
        );
    });

    this.socket.on('removeClient', id => {
      console.log('received request to remove client ' + id);
      if (this.peers[id]) {
        console.log('actually removes client ' + id);
        delete this.peers[id];
      }
    });

    this.socket.on('signalingMessage', function(data) {
      let msg;
      // el.innerHTML = 'socket signaling message received: ' + data;
      if ((msg = JSON.parse(data))) {
        console.log('socket signaling message received');
        console.log(msg);
      }
    });

    this.socket.on('answer', data => {
      // if ('el' in window) {
      //   el.innerHTML = 'RTC signaling answer message: ' + data;
      // }
      let msg;
      if ((msg = JSON.parse(data))) {
        console.log('RTC signaling answer message received');
        console.log(msg);
        if (msg.fromSocketId && msg.answer) {
          let handleAnswerResult = this.handleOfferOrAnswer(
            this.peers[msg.fromSocketId].pc,
            msg.answer
          ).then(() => {
            console.log('answer handled. Continuing');
            //respond whenever the camera is accepted.
            // console.log(mediaPromise);
            // return createAnswerAndSend();
            // return mediaPromise.then(createAnswerAndSend);
          });
          console.log('handleAnswerResult: ');
          console.log(handleAnswerResult);
        }
      }
    });

    this.socket.on('ice', data => {
      let msg;
      // if ('el' in window) {
      //   el.innerHTML = 'RTC ice candidate: ' + data;
      // }
      if ((msg = JSON.parse(data))) {
        console.log('RTC ice candidate:');
        console.log(msg);
        if (msg.fromSocket && msg.candidate) {
          console.log();
          this.handleIncomingIce(this.peers[msg.fromSocket].pc, msg.candidate);
        }
      }
    });
  }

  robotHandleIceCandidate(targetSocketId, evt) {
    console.log('robot ice candidate event');
    console.log(evt);
    if (evt.candidate) {
      console.log('sending ice to the signal server!');
      let string = JSON.stringify({
        targetSocketId: targetSocketId,
        candidate: evt.candidate
      });
      console.log(string);
      this.socket.emit('ice', string);
    } else {
      console.log('all ice candidates have been sent');
    }
  }
}

// let el = document.getElementById('socket-data');

// let textSender = document.getElementById('text-send-area');
// let robotCommand = document.getElementById('robot-command');

// createPeerConection();
// let peers = {};
// let mediaPromises = [];
// let mediaConstraints = { audio: false, video: true };
// navigator.mediaDevices.enumerateDevices().then(devices => {
//   console.log(devices);
//   console.log(navigator.mediaDevices.getSupportedConstraints());
//   devices.forEach(deviceInfo => {
//     if (
//       deviceInfo.kind === 'videoinput' &&
//       !deviceInfo.label.includes('FullHD')
//     ) {
//       console.log('found video device: ' + deviceInfo.label);
//       mediaPromises.push(
//         getLocalMedia({
//           audio: mediaConstraints.audio,
//           video: { deviceId: deviceInfo.deviceId, frameRate: 15 }
//         })
//       );
//     }
//   });
// });

// socket.on('newClient', id => {
//   console.log(
//     'new client with id: ' +
//       id +
//       ".   Let's create a new peerConnection for this one"
//   );
//   peers[id] = {};
//   peers[id].pc = createPeerConection();
//   peers[id].pc.onicecandidate = evt => {
//     robotHandleIceCandidate(id, evt);
//   };

//   console.log('peers: ');
//   console.log(peers);

//   console.log('adding datachannel');
//   peers[id].chatChannel = addDataChannel(peers[id].pc, 'chatChannel');
//   peers[id].chatChannel.onmessage = event => {
//     console.log('chatChannel message received: ' + event.data);
//     if ('textSender' in window) {
//       textSender.value = event.data;
//     }
//   };
//   if ('textSender' in window) {
//     textSender.oninput = () => {
//       console.log('input trigger');
//       var data = textSender.value;
//       console.log('readyState is ' + peers[id].chatChannel.readyState);
//       if (peers[id].chatChannel.readyState === 'open') {
//         peers[id].chatChannel.send(data);
//       }
//     };
//   }

//   peers[id].robotControlChannel = addDataChannel(
//     peers[id].pc,
//     'robotControlChannel'
//   );
//   peers[id].robotControlChannel.onmessage = event => {
//     console.log('robotControlChannel message received: ' + event.data);
//     let command = event.data;
//     robotCommand.innerHTML = command;
//   };

//   let streamPromises = [];
//   mediaPromises.forEach(streamPromise => {
//     streamPromises.push(
//       streamPromise.then(stream => addOutgoingStream(peers[id].pc, stream))
//     );
//   });
//   Promise.all(streamPromises)
//     // .then(stream => addOutgoingStream(peers[id].pc, stream))
//     .then(resolveValues => createOfferAndSend(peers[id].pc, id));
// });

// socket.on('removeClient', id => {
//   console.log('received request to remove client ' + id);
//   if (peers[id]) {
//     console.log('actually removes client ' + id);
//     delete peers[id];
//   }
// });

// socket.on('signalingMessage', function(data) {
//   let msg;
//   el.innerHTML = 'socket signaling message received: ' + data;
//   if ((msg = JSON.parse(data))) {
//     console.log('socket signaling message received');
//     console.log(msg);
//   }
// });

// socket.on('answer', data => {
//   if ('el' in window) {
//     el.innerHTML = 'RTC signaling answer message: ' + data;
//   }
//   if ((msg = JSON.parse(data))) {
//     console.log('RTC signaling answer message received');
//     console.log(msg);
//     if (msg.fromSocketId && msg.answer) {
//       let handleAnswerResult = handleOfferOrAnswer(
//         peers[msg.fromSocketId].pc,
//         msg.answer
//       ).then(() => {
//         console.log('answer handled. Continuing');
//         //respond whenever the camera is accepted.
//         // console.log(mediaPromise);
//         // return createAnswerAndSend();
//         // return mediaPromise.then(createAnswerAndSend);
//       });
//       console.log('handleAnswerResult: ');
//       console.log(handleAnswerResult);
//     }
//   }
// });

// socket.on('ice', data => {
//   let msg;
//   if ('el' in window) {
//     el.innerHTML = 'RTC ice candidate: ' + data;
//   }
//   if ((msg = JSON.parse(data))) {
//     console.log('RTC ice candidate:');
//     console.log(msg);
//     if (msg.fromSocket && msg.candidate) {
//       console.log();
//       handleIncomingIce(peers[msg.fromSocket].pc, msg.candidate);
//     }
//   }
// });

// function robotHandleIceCandidate(targetSocketId, evt) {
//   console.log('robot ice candidate event');
//   console.log(evt);
//   if (evt.candidate) {
//     console.log('sending ice to the signal server!');
//     let string = JSON.stringify({
//       targetSocketId: targetSocketId,
//       candidate: evt.candidate
//     });
//     console.log(string);
//     socket.emit('ice', string);
//   } else {
//     console.log('all ice candidates have been sent');
//   }
// }
