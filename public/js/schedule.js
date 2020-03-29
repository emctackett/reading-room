
function copyLink() {
    var copyText = document.getElementById('readerLink');
    copyText.select();
    document.execCommand("copy");
    alert("Link Copied to Clipboard!");
}