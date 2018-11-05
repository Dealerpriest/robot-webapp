//SIGNALING AND WEBRTC

import webRTCConnection from '@/js/webRTCConnection.js';
import store from '@/store';
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

    this.deviceLabelsToInclude = [];

    if (process.env.NODE_ENV === 'development') {
      this.deviceLabelsToInclude = ['BRIO', 'THETA V FullHD'];
    } else {
      this.deviceLabelsToInclude = ['THETA V FullHD', 'BRIO'];
    }

    this.peers = {};
    this.streamPromises = [];
    this.mediaConstraints = { audio: false, video: true };

    store.commit('clearLocalStreams');
    navigator.mediaDevices.enumerateDevices().then(devices => {
      console.log(devices);
      // console.log(navigator.mediaDevices.getSupportedConstraints());
      devices.forEach(deviceInfo => {
        //Filter what devices to care about
        console.log(
          'found media device with label: '
            + deviceInfo.label
            + ' and id: '
            + deviceInfo.deviceId
        );
        if (
          deviceInfo.kind === 'videoinput'
          && deviceInfo.label
          && this.deviceLabelsToInclude.some(label => {
            let matched = deviceInfo.label.includes(label);
            this.mediaConstraints.audio = false;
            if(matched && label == 'BRIO'){
              this.mediaConstraints.audio = true;
              store.commit('setBRIOIsFound', true);
            }else if(matched && label === 'THETA V FullHD'){
              store.commit('setRICOHIsFound', true);
            }
            return matched;
          })
        ) {
          console.log(
            'adding video device to streamPromises: ' + deviceInfo.label
          );
          let streamPromise = this.getLocalMedia({
            audio: this.mediaConstraints.audio,
            video: {
              deviceId: { exact: deviceInfo.deviceId },
              frameRate: 15
              // width: { min: 1920, ideal: 3840, max: 3840 },
              // height: { min: 1080, ideal: 2160, max: 2160 }
            }
          });
          // let streamWithMetaDataPromise = new Promise((resolve, reject) =>{
          //   streamPromise.then((stream => {return resolve(stream);}))
          //   .catch(err => reject(err));
          // })
          let streamWithMetaDataPromise = streamPromise.then(stream=>{
            let p = new Promise((resolve) => {
              setTimeout(() => {
                let videoTrack = stream.getVideoTracks()[0];
                let capabilities = videoTrack.getCapabilities();
                // console.log('-------------capabilities----------');
                // console.log(capabilities);
                let settings = videoTrack.getSettings();
                let streamWithMetaData = {
                  metaData:{
                    label: deviceInfo.label,
                    capabilities: capabilities,
                    settings: settings
                  },
                  stream: stream
                }
                store.commit('addLocalStream', streamWithMetaData);
                resolve(streamWithMetaData);
              }, 200);
            });
            return p;
          }).catch(err=>{return err});
          
          this.streamPromises.push(streamWithMetaDataPromise);
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

      console.log('adding chatRTCchannel');
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

      console.log('adding robotControlRTCchannel');
      this.peers[id].robotControlChannel = this.addDataChannel(
        this.peers[id].pc,
        'robotControlChannel'
      );
      this.peers[id].robotControlChannel.onmessage = event => {
        let command = JSON.parse(event.data);
        console.log('robotControlChannel message received: ')
        console.log(command);
        if(command.type == 'setKeyState'){
          serialSocket.emit('robotKeyboardControl', command.payload)
        }else if( command.type == 'unsetKeyState'){
          serialSocket.emit('robotKeyboardControl', "!" + command.payload)
        }else if(command.type == 'changeRemoteCameraSetting'){
          store.commit('changeLocalCameraSetting', command.payload);
        }else if(command.type == 'setClickTarget', command.payload){
          serialSocket.emit('clickToDrive', command.payload);
        }
        // if (
        //   command.startsWith('changePitch')
        //   || command.startsWith('changeYaw')
        // ) {
        //   serialSocket.emit('cameraControl', command);
        // } else {
        //   serialSocket.emit('motorControl', command);
        // }
        // serialSocket.emit('robotKeyboardControl', command);
      };

      serialSocket.on('robotState', (data) => {
        if (this.peers[id].robotControlChannel.readyState === 'open') {
          console.log('received robotState:');
          console.log(JSON.parse(data));
          this.peers[id].robotControlChannel.send(data);
        }
      })

      // This is a hack to let the receiver end identify different mediadevices. Couldn't find any 'proper' way to do it.
      // So we here send the label and id pairs separately and pair them with their streams on the receiving end. Kind of ugly...
      // let streamMetaData = {};

      // let streamPromises = [];
      this.streamPromises.forEach((streamWithMetaDataPromise) => {
        streamWithMetaDataPromise.then(({stream, metaData}) => {
          console.log('adding mediadevice to stream: ' + metaData.label);
          this.localStreamsMetaData[stream.id] = metaData;
          this.addOutgoingStream(this.peers[id].pc, stream);
        });
      });
      Promise.all(
        this.streamPromises.map(p => p.catch(e => console.log(e)))
      )
        .then(() =>
          this.createOfferAndSend(this.peers[id].pc, id, this.localStreamsMetaData)
        )
        .catch(e => console.log(e));
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
      store.commit('clearRemoteStreams');
      // if ('el' in window) {
      //   el.innerHTML = 'RTC signaling answer message: ' + data;
      // }
      let msg;
      if ((msg = JSON.parse(data))) {
        console.log('RTC answer message: ');
        console.log(msg);
        if (msg.fromSocketId && msg.answer && msg.streamsMetaData) {
          this.remoteStreamsMetaData = msg.streamsMetaData;
          console.log(this.mediaLabels);
          store.commit('setAnswerReceived', true);
          let handleAnswerResult = this.handleOfferOrAnswer(
            this.peers[msg.fromSocketId].pc,
            msg.answer
          ).then(() => {
            store.commit('setAnswerHandled', true);
            console.log('answer handled. Continuing');
            //respond whenever the camera is accepted.
            // console.log(mediaPromise);
            // return createAnswerAndSend();
            // return mediaPromise.then(createAnswerAndSend);
          });
          console.log('handleAnswerResult: ');
          console.log(handleAnswerResult);
        } else {
          console.log('invalid answer!');
        }
      }
    });

    this.socket.on('ice', data => {
      let msg;
      // if ('el' in window) {
      //   el.innerHTML = 'RTC ice candidate: ' + data;
      // }
      if ((msg = JSON.parse(data))) {
        console.log('RTC ice candidate received from client:');
        console.log(msg);
        if (msg.fromSocket && msg.candidate) {
          this.handleIncomingIce(this.peers[msg.fromSocket].pc, msg.candidate);
        }
      }
    });
  }

  robotHandleIceCandidate(targetSocketId, evt) {
    // console.log('robot ice candidate event');
    // console.log(evt);
    if (evt.candidate) {
      console.log('sending ice to the signal server!');
      let string = JSON.stringify({
        targetSocketId: targetSocketId,
        candidate: evt.candidate
      });
      // console.log(string);
      this.socket.emit('ice', string);
    } else {
      console.log('all ice candidates have been sent');
    }
  }
}
