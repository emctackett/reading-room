$(function() {
  if (!$('.video-container')[0]) {
    return;
  }

  let hostId;
  let peer;

  function streamVideo() {
    navigator.getUserMedia = navigator.GetUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia;
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
    const id = document.getElementById('listenerId').innerHTML
    let conn;
    let peer_id;

    peer = new Peer(id);
    const heading = $('#welcome');
    let peerId;

    peer.on('open', function(id) {
      peerId = id;
    });

    peer.on('connection', function(connection){
      conn = connection
      peer_id = connection.peer

      conn.on('data', function(data) {
        if(data.action != undefined) {
          if(data.action) {
            document.getElementById('nextButton').click();
            console.log("got action:true fron connection, clicked next");
          } else {
            document.getElementById('prevButton').click();
            console.log("got action:false fron connection, clicked prev");
          }
        }
      });
    });

    peer.on('close', function() {
      conn = null;
      console.log('Connection destroyed');
    });


    peer.on('error', function(err){
      alert("an error has occured:" + err);
      console.log(err);
    });

    peer.on('call', call => {
      call.answer(window.localStream); // answer call with a/v stream
      call.on('stream', (remoteStream) => {
        const remoteVideo = $('#remote-video');
        remoteVideo.attr('src', remoteStream);
        remoteVideo.srcObject = remoteStream;
      });
    });
}

  function connectCall() {
    peer_id = document.getElementById("readerId").innerHTML;

    if (peer_id) {
      conn = peer.connect(peer_id)
    } else {
      alert("enter an id");
      return false;
    }

    var call = peer.call(peer_id, window.localStream);
      call.on('stream', (remoteStream) => {
        const remoteVideo = $('#remote-video')[0];
        if (remoteVideo){
          remoteVideo.srcObject = remoteStream;
        }
    });
  }

  function disconnectCall() {
    const link = document.createElement('a');
    link.href="/";
    peer.destroy();
    link.click();
  }

  function renderDisconnectButton(btn) {
    $(btn).html('End Call');
    $(btn).attr('data-connected', 'true');
    $(btn).removeClass('btn-success');
    $(btn).addClass('btn-danger');
  }

  $('#call_button').on('click', function(e){
    const button = e.target;
    const status = $(button).attr('data-connected');

    if (status === 'false') {
      connectCall();
      renderDisconnectButton(button);
    } else {
      disconnectCall();
    }
  });

  function getHostId() {
    let searchParams = new URLSearchParams(window.location.search);
    hostId = searchParams.get('id');
  }

  initializePeerId();
  streamVideo();
});
