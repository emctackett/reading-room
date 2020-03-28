
$(function() {
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

  if ($('.video-container')[0]) {
    streamVideo();

        //const socket = io.connect('http://localhost');
    const peer = new Peer({key: 'lwjd5qra8257b9'});

    peer.on('open', function(id) {
      console.log('my peer ID is: ' + id);

      // append the url to send to the peer host when joining the call
      var copyText = document.createElement('textarea');
      copyText.value = $(location).attr + "?id=" + id;
      copyText.style.visibility = "hidden";
      copyText.id = "copyText";
      document.body.appendChild(copyText);

      $('#copyLink').onclick = function() {
        $('#copyText').select();
        document.execCommand('copy');
      }
    });
  }

  function getLink(onclick)
});
