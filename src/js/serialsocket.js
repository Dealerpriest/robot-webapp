import io from 'socket.io-client';
const serverUrl = process.env.VUE_APP_SERIAL_SOCKET_SERVER_URL;

const serialSocket = io(serverUrl, {
  query: {
    token: process.env.VUE_APP_ROBOT_TOKEN
  }
});

serialSocket.on('connect', () => {
  console.log('connected to serial socket');
  serialSocket.send("hello I'm the robot <3");
});

export default serialSocket;
