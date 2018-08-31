//SIGNALING
import webRTCConnection from '@/js/webRTCConnection.js';
import store from '@/store';

export default class clientConnector extends webRTCConnection {
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

    console.log('creating a webRTC clientConnector object');
    this.robotConnection = this.createPeerConection();
    this.robotConnection.onicecandidate = stuff =>
      this.handleIceCandidate(stuff);

    this.robotConnection.ondatachannel = event => {
      console.log('ondatachannel event:');
      console.log(event);
      let dataChannel = event.channel;

      if (dataChannel.label === 'chatChannel') {
        console.log('chatChannel added');
        dataChannel.onmessage = function(event) {
          console.log('chat datachannel message received: ' + event.data);
          // textReceiver.value = event.data;
        };
        // textReceiver.oninput = () => {
        //   console.log('input trigger');
        //   var data = textReceiver.value;
        //   console.log('readyState is ' + dataChannel.readyState);
        //   if (dataChannel.readyState === 'open') {
        //     dataChannel.send(data);
        //   }
        // };
      } else if (dataChannel.label === 'robotControlChannel') {
        console.log('robotControlChannel added');
        dataChannel.onmessage = function(event) {
          console.log('robotControl datachannel message received: ');
          console.log(event.data);
          if(event.data){
            store.commit('setActualState', JSON.parse(event.data));
          }
        };
        store.subscribe((mutation, state) => {
          if (dataChannel.readyState === 'open') {
            //Handle servocontrol
            // if (
            //   mutation.type === 'changePitch'
            //   || mutation.type === 'changeYaw'
            // ) {
            //   dataChannel.send(mutation.type + mutation.payload);
            // }

            //Handle keypresses
            if (mutation.type === 'setKeyState') {
              dataChannel.send(mutation.payload);

              let sendStamp = null;
              let keyUpdate = timestamp => {
                if (!sendStamp) sendStamp = timestamp;
                let progress = timestamp - sendStamp;
                if (
                  progress > 100
                  && state.webRTC.keyStates[mutation.payload]
                ) {
                  console.log('datachannel sending: ' + mutation.payload);
                  dataChannel.send(mutation.payload);
                  sendStamp = timestamp;
                }

                if (state.webRTC.keyStates[mutation.payload]) {
                  window.requestAnimationFrame(keyUpdate);
                }
              };
              window.requestAnimationFrame(keyUpdate);
            } else if (mutation.type === 'unsetKeyState') {
              let msg = '!' + mutation.payload;
              console.log('datachannel sending: ' + msg);
              dataChannel.send(msg);
            }
          }
        });

        // TODO: Lift out logic for handling keypresses. Only link clientConnector to store mutations

        let allowedKeys = [
          'ArrowLeft',
          'ArrowRight',
          'ArrowUp',
          'ArrowDown',
          'z',
          'x',
          'b',
          'm',
          'h',
          'n'
        ];
        let keyStates = {};
        for (let i = 0; i < allowedKeys.length; i++) {
          const key = allowedKeys[i];
          keyStates[key] = false;
        }
        store.commit('setAllKeyStates', keyStates);

        document.onkeydown = event => {
          let keyValue = event.key;
          console.log('keydown: ' + keyValue);
          //bail out if this is a key held down event
          //or if it isn't a valid control key
          if (event.repeat || !allowedKeys.includes(keyValue)) return;
          // keyStates[keyValue] = true;
          store.commit('setKeyState', keyValue);
          if (dataChannel.readyState === 'open') {
            // console.log(keyValue + ' pressed down');
            // dataChannel.send(keyValue);
          }
        };
        document.onkeyup = event => {
          let keyValue = event.key;
          //bail out if it isn't a valid control key
          if (!allowedKeys.includes(keyValue)) {
            console.log('filtered out key: ' + keyValue);
            return;
          }
          // keyStates[keyValue] = false;
          store.commit('unsetKeyState', keyValue);
          // if (dataChannel.readyState === 'open') {
          //   console.log(keyValue + ' released');

          //   // dataChannel.send('!' + keyValue);
          // }
        };

        window.onblur = () => {
          console.log(
            '%c window no longer in focus! ',
            'background: #222; color: #bada55'
          );
          //Deactivate all keys if leaving window!
          // console.log(keyStates);
          // Object.keys(keyStates).forEach(v => (keyStates[v] = false));
          store.commit('unsetAllKeyStates');
        };
      }
    };

    //save stuff into this one to be used when we send answer later
    let labelsAndIds = {};

    store.commit('clearLocalStreams');
    this.mediaConstraints = { audio: false, video: true };
    this.getLocalMedia(this.mediaConstraints).then(stream => {
      //If we can't find a label, let's use the streamId as backup.
      let label = stream.id;
      let videoTracks = stream.getVideoTracks();
      if (videoTracks.length) {
        label = videoTracks[0].label;
        labelsAndIds[stream.id] = label;
      }
      store.commit('addLocalStream', { label: label, stream: stream });
      this.addOutgoingStream(this.robotConnection, stream);
    });

    this.socket.on('robotConnected', () => {
      console.log('robot is available according to server');
    });

    this.socket.on('offer', data => {
      store.commit('clearRemoteStreams');
      // el.innerHTML = 'RTC offer message: ' + data;
      let msg;
      if ((msg = JSON.parse(data))) {
        console.log('RTC offer message: ');
        console.log(msg);

        this.mediaLabels = msg.mediaLabels;
        console.log(this.mediaLabels);

        if (msg.offer) {
          store.commit('setOfferReceived', true);
          let offerHandlingResult = this.handleOfferOrAnswer(
            this.robotConnection,
            msg.offer
          ).then(() => {
            store.commit('setOfferHandled', true);
            console.log('offer handled. Continuing to create answer');
            return this.createAnswerAndSend(this.robotConnection, labelsAndIds);
            // return mediaPromise.then(createAnswerAndSend);
          });
          console.log(offerHandlingResult);
        }
      }
    });

    this.socket.on('ice', data => {
      let msg;
      // el.innerHTML = 'RTC ice candidate received: ' + data;
      if ((msg = JSON.parse(data))) {
        console.log('RTC ice candidate received from robot:');
        console.log(msg);
        if (msg.candidate) {
          this.handleIncomingIce(this.robotConnection, msg.candidate);
        }
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
  }
}
