$(function() {
  if (!$('.video-container')[0]) {
    return;
  }

  let hostId;
  let peer;

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
    const id = document.getElementById('readerId').innerHTML
    var conn;
    var peer_id;
    peer = new Peer(id);
    const heading = $('h2');
    let peerId;

    peer.on('open', function(id) {
      peerId = id;
    });

    peer.on('connection', function(connection){
      conn = connection
      peer_id = connection.peer;
    });

    peer.on('close', function() {
        conn = null;
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
        document.getElementById("placeholderTxt").hidden = true;
      });
    });
  }

  function connectCall() {
    peer_id = document.getElementById("listenerId").innerHTML;

    if(peer_id){
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
      document.getElementById("nextButton").removeAttribute("hidden");
      document.getElementById("prevButton").removeAttribute("hidden");

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
      document.body.onkeyup = function(e){
        if(e.keyCode == 32){
          event.preventDefault();
          $("#nextButton").click();
          if (conn.open) {
            conn.send({action: true});
            console.log("sent {action: true} to connection")
          }
        }
      };

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

  document.getElementById('nextButton').addEventListener('click', function() {
    if (conn.open) {
      conn.send({action: true});
      console.log("sent {action: true} to connection")
    }
  });

  document.getElementById('prevButton').addEventListener('click', function() {
    if (conn.open) {
      conn.send({action: false});
      console.log("sent {action: false} to connection")
    }
  })
});
