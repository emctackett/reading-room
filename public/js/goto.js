$(function() {

  $('#copyLink').on('click', function(e){
    var copyText = document.querySelector("#readerLink");
    copyText.select();
    document.execCommand("copy");
    alert("Link Copied to Clipboard!");
  });

});
