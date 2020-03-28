$(function() {
  if (!$('.video-container')[0]) {
    return;
  }

  let hostId;
  let peer;

  function streamVideo() {
    navigator.getUserMedia(
      { video: true, audio: true },
      stream => {
        const localVideo = $('#local-video')[0];
        if (localVideo) {
          localVideo.srcObject = stream;
        }
      },
      error => {
        console.warn(error.message);
      }
    );
  }

  function initializePeerId() {
    // sign up for key @ https://peerjs.com/peerserver.html
//    var id= window.location.pathname;
//    id=id.slice(1,37);
    peer = new Peer({
        secure: true,
        host: 'https://reading-room-peerjs.herokuapp.com',
        port: 443,
        path: '/peerjs/id'
    });

    console.log(peer);


      //{key: 'lwjd5qra8257b9'});
    const heading = $('h2');
    let peerId;

    peer.on('open', function(id) {
      console.log('my peer ID is: ' + id);
    });

    peer.on('call', call => {
      console.log('answering');
      navigator.mediaDevices.getUserMedia({ video: true, audio: true}, MediaStream => {
        call.answer(MediaStream); // answer call with a/v stream
        call.on('stream', (remoteStream) => {
          const remoteVideo = $('#remote-video');
          remoteVideo.attr('src', remoteStream);
          //remoteVideo.srcObject = remoteStream;
        });
      })
    });
  }

  function getHostId() {
    let searchParams = new URLSearchParams(window.location.search);
    hostId = searchParams.get('id');
  }

  function callHost() {
    console.log(`calling host: ${hostId}`);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true},
      MediaStream => {
        const call = peer.call(hostId, MediaStream);
        call.on('stream', (remoteStream) => {
          const remoteVideo = $('#remote-video')[0];
          remoteVideo.srcObject = remoteStream;
        });
      });
  }

  initializePeerId();
  getHostId();
  if (hostId) { callHost() }
  streamVideo();
});
