$(function() {
  if (!$('.video-container')[0]) {
    return;
  }

  let hostId;
  let peer;
//  let localStream;
  function streamVideo() {
    navigator.getUserMedia = navigator.GetUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    navigator.getUserMedia(
      { video: true, audio: true },
      stream => {
        const localVideo = $('#local-video')[0];
        if (localVideo) {
          localVideo.srcObject = stream;
          window.localStream = stream;
        }
      },
      error => {
        console.warn(error.message);
      }
    );
  }

  function initializePeerId() {
      // sign up for key @ https://peerjs.com/peerserver.html

    let searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    var conn;
    var peer_id;
    peer = new Peer(id, {key: 'lwjd5qra8257b9'});
    const heading = $('h2');
    let peerId;

    peer.on('open', function(id) {
      peerId = id;
      console.log('my peer ID is: ' + id);
      $(`<p>Your peer id is ${peerId}</p>`).insertAfter(heading);
    });

    peer.on('connection', function(connection){
      conn = connection
      peer_id = connection.peer

      document.getElementById('connId').value = peer_id;
    });

    peer.on('close', function() {
      conn = null;
      alert("Connection destroyed. Please refresh");
      console.log('Connection destroyed');
    });


    peer.on('error', function(err){
      alert("an error has occured:" + err);
      console.log(err);
    });

    document.getElementById('conn_button').addEventListener('click', function(){
      peer_id = document.getElementById("connId").value;

      if(peer_id){
        conn = peer.connect(peer_id)
      }else{
        alert("enter an id");
        return false;
      }
    });

    peer.on('call', call => {
      console.log('answering');
      call.answer(window.localStream); // answer call with a/v stream

      call.on('stream', (remoteStream) => {
        const remoteVideo = $('#remote-video');
        remoteVideo.attr('src', remoteStream);
        remoteVideo.srcObject = remoteStream;
      });
    });

    document.getElementById('call_button').addEventListener('click', function(){
      console.log("calling a peer:"+ peer_id)
      console.log(peer);

      const call = peer.call(peer_id, window.localStream);

      call.on('stream', (remoteStream) => {
        const remoteVideo = $('#remote-video')[0];
        if (remoteVideo) {
          remoteVideo.srcObject = remoteStream;
        }
      });
    });
    }


    function getHostId() {
      let searchParams = new URLSearchParams(window.location.search);
      hostId = searchParams.get('id');
    }

  initializePeerId();
  streamVideo();

});
