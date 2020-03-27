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

  function connectSocket() {
    const socket = io.connect('http://localhost');

    // socket.on('news', function(data) {
    //   console.log(data);
    // });
  }

  if ($('.video-container')) {
    streamVideo();
    connectSocket();
  }
});
