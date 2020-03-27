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

  // function connectSocket() {
  //   const socket = io.connect('http://localhost');
  //
  //   const existingSocket =
  // }

  if ($('.video-container')) {
    streamVideo();
    //connectSocket();
    const socket = io.connect('http://localhost');

    // socket.on('connection', socket => {
    //   const existingSocket = activeSockets.find(
    //     existingSocket => existingSocket === socket.id
    //   );
    //
    //   if (!existingSocket) {
    //     activeSockets.push(socket.id);
    //   }
    //
    //   socket.on('disconnect', () => {
    //     activeSockets = activeSockets.filter(
    //       existingSocket => existingSocket !== socket.id
    //     );
    //   });
    // });
  }
});
