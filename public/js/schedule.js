
function copyLink() {
    var roomUIUD = document.getElementById('roomUIUD').innerHTML;
    console.log(roomUIUD);
    var copyText = document.createElement('textarea');
    copyText.innerHTML ="https://reading-room.herokuapp.com/readerRoom/" + roomUIUD;
    copyText.hidden = true;
    copyText.id = "readerLink";
    document.getElementById('roomUIUD').appendChild(copyText);
    copyText.select();
    document.execCommand("copy");
    alert("Link Copied to Clipboard!");
//    document.getElementById('roomUIUD').removeChild(copyText);
}