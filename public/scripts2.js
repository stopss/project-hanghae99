// const socket = io('/chattings', { transports: ['websocket'] });
const socket = io('/chattings');
const videoGrid = document.getElementById('video-grid');

// npx peerjs --port 9000
// const myPeer = new Peer(undefined, {
//   host: '/',
//   port: '9000',
// });
const myPeer = new Peer();

const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);

    myPeer.on('call', (call) => {
      call.answer(stream);
      const video = document.createElement('video');
      // peers[call.peer] = peer;
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on('user_connected', (peerId) => {
      console.log('user Connected: ' + peerId);
      connectToNewUser(peerId, stream);
    });
  });

socket.on('user_disconnected', (peerId) => {
  if (peers[peerId]) peers[peerId].close();
});

myPeer.on('open', (id) => {
  const payload = {
    userId: 1,
    roomId: 1,
    peerId: id,
  };
  socket.emit('peer_join_room', payload);
});

function connectToNewUser(peerId, stream) {
  const call = myPeer.call(peerId, stream);
  const video = document.createElement('video');
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    video.remove();
  });

  peers[peerId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}