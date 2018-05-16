//SIGNALING
import webRTCConnection from '@/js/webRTCConnection.js';
// import store from '@/store';

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
      let receiveChannel = event.channel;
      //object containing references to intervals that are running
      let commandRepeaters = {};
      if (receiveChannel.label === 'chatChannel') {
        console.log('chatChannel added');
        receiveChannel.onmessage = function(event) {
          console.log('datachannel message received: ' + event.data);
          // textReceiver.value = event.data;
        };

        // textReceiver.oninput = () => {
        //   console.log('input trigger');
        //   var data = textReceiver.value;
        //   console.log('readyState is ' + receiveChannel.readyState);
        //   if (receiveChannel.readyState === 'open') {
        //     receiveChannel.send(data);
        //   }
        // };
      } else if (receiveChannel.label === 'robotControlChannel') {
        console.log('robotControlChannel added');
        let allowedKeys = [
          'ArrowLeft',
          'ArrowRight',
          'ArrowUp',
          'ArrowDown',
          'z',
          'x'
        ];
        document.onkeydown = event => {
          let keyValue = event.key;
          console.log('keydown: ' + keyValue);
          //bail out if this is a key held down event
          //or if it isn't a valid control key
          if (event.repeat || !allowedKeys.includes(keyValue)) return;
          if (receiveChannel.readyState === 'open') {
            console.log(keyValue + ' pressed down');
            // store.commit('setRobotControlKey', keyValue);
            receiveChannel.send(keyValue);
            commandRepeaters[keyValue] = setInterval(() => {
              console.log('sending interval command: ' + keyValue);
              receiveChannel.send(keyValue);
            }, 100);
          }
        };
        document.onkeyup = event => {
          let keyValue = event.key;
          //bail out if it isn't a valid control key
          if (!allowedKeys.includes(keyValue)) {
            return;
          }
          if (receiveChannel.readyState === 'open') {
            console.log(keyValue + ' released');
            // store.commit('unsetRobotControlKey', keyValue);
            if (commandRepeaters[keyValue]) {
              clearInterval(commandRepeaters[keyValue]);
            }
            receiveChannel.send('!' + keyValue);
          }
        };
      }
    };

    this.mediaConstraints = { audio: false, video: true };
    // let mediaPromise = getLocalMedia().then(addOutgoingStream);

    this.socket.on('robotConnected', () => {
      console.log('robot is available according to server');
    });

    this.socket.on('offer', data => {
      // el.innerHTML = 'RTC offer message: ' + data;
      let msg;
      if ((msg = JSON.parse(data))) {
        console.log('RTC offer message: ');
        console.log(msg);

        this.mediaLabels = msg.mediaLabels;
        console.log(this.mediaLabels);

        if (msg.offer) {
          let offerHandlingResult = this.handleOfferOrAnswer(
            this.robotConnection,
            msg.offer
          ).then(() => {
            console.log('offer handled. Continuing to create answer');
            return this.createAnswerAndSend(this.robotConnection);
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
        console.log('RTC ice candidate received:');
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

// let el = document.getElementById('socket-data');
// let textReceiver = document.getElementById('text-receive-area');

// robotConnection = createPeerConection();
// robotConnection.onicecandidate = handleIceCandidate;

// robotConnection.ondatachannel = evt => {
//   console.log('ondatachannel event:');
//   console.log(evt);
//   let receiveChannel = event.channel;
//   if (receiveChannel.label === 'chatChannel') {
//     console.log('chatChannel added');
//     receiveChannel.onmessage = function(event) {
//       console.log('datachannel message received: ' + event.data);
//       textReceiver.value = event.data;
//     };

//     textReceiver.oninput = () => {
//       console.log('input trigger');
//       var data = textReceiver.value;
//       console.log('readyState is ' + receiveChannel.readyState);
//       if (receiveChannel.readyState === 'open') {
//         receiveChannel.send(data);
//       }
//     };
//   } else if (receiveChannel.label === 'robotControlChannel') {
//     console.log('robotControlChannel added');
//     document.onkeydown = event => {
//       console.log('keydown');
//       let keyValue = event.key;
//       if (
//         !(
//           keyValue === 'ArrowLeft' ||
//           keyValue === 'ArrowUp' ||
//           keyValue === 'ArrowRight' ||
//           keyValue === 'ArrowDown'
//         )
//       ) {
//         return;
//       }
//       if (receiveChannel.readyState === 'open') {
//         console.log('keypressed');
//         receiveChannel.send(keyValue);
//       }
//     };
//     document.onkeyup = event => {
//       let keyValue = event.key;
//       if (
//         !(
//           keyValue === 'ArrowLeft' ||
//           keyValue === 'ArrowUp' ||
//           keyValue === 'ArrowRight' ||
//           keyValue === 'ArrowDown'
//         )
//       ) {
//         return;
//       }
//       if (receiveChannel.readyState === 'open') {
//         receiveChannel.send('None');
//       }
//     };
//   }
// };

// let mediaConstraints = { audio: false, video: true };
// // let mediaPromise = getLocalMedia().then(addOutgoingStream);

// socket.on('robotConnected', () => {
//   console.log('robot is available according to server');
// });

// socket.on('offer', data => {
//   el.innerHTML = 'RTC offer message: ' + data;
//   if ((msg = JSON.parse(data))) {
//     console.log('RTC offer message: ');
//     console.log(msg);
//     if (msg.offer) {
//       let handleOfferResult = handleOfferOrAnswer(
//         robotConnection,
//         msg.offer
//       ).then(() => {
//         console.log('offer handled. Continuing to create answer');
//         return createAnswerAndSend(robotConnection);
//         // return mediaPromise.then(createAnswerAndSend);
//       });
//       console.log(handleOfferResult);
//     }
//   }
// });

// socket.on('ice', data => {
//   let msg;
//   el.innerHTML = 'RTC ice candidate received: ' + data;
//   if ((msg = JSON.parse(data))) {
//     console.log('RTC ice candidate received:');
//     console.log(msg);
//     if (msg.candidate) {
//       handleIncomingIce(robotConnection, msg.candidate);
//     }
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
