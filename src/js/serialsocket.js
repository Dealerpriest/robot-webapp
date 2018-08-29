import io from 'socket.io-client';
import store from '@/store';
const serverUrl = process.env.VUE_APP_SERIAL_SOCKET_SERVER_URL;

const serialSocket = io(serverUrl, {
  query: {
    token: process.env.VUE_APP_ROBOT_TOKEN
  }
});

serialSocket.on('connect', () => {
  console.log('connected to serial socket');
  store.commit('setWebsocketToSerialServerConnection', true);
  serialSocket.send("hello I'm the robot <3");
});

serialSocket.on('disconnect', () => {
  console.log('disconnected from serial socket');
  store.commit('setWebsocketToSerialServerConnection', false);
});

export default serialSocket;
