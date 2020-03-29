schedulePage();

function schedulePage() {
    if(!$('#meeting-time')[0]) {
        return;
    }

    // set minimum date for schedule time to current time
    var today = new Date();

    $('#meeting-time')[0].min = today.getFullYear()+'-'+pad(today.getMonth()+1,2)+'-'+pad(today.getDate(),2)+'T'+pad(today.getHours(),2)+':'+pad(today.getMinutes(),2);
    $('#meeting-time')[0].value = today.getFullYear()+'-'+pad(today.getMonth()+1,2)+'-'+pad(today.getDate(),2)+'T'+pad(today.getHours()+1,2)+':'+"00";

    // pad numbers with leading 0's if needed
    function pad(number, length) {
        var padded = ''+number;
        while (padded.length < length) {
            padded = '0' + padded;
        }
        return padded;
    };

};