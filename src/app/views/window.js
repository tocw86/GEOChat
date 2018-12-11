$(window).on('load', function () {
    var $io = io;
    io = null;
    var _auth = null;

    function notify(type, text, title) {
        vNotify[type]({
            text: text,
            title: title,
            sticky: true,

        });
    }
    var myWorker = new Worker('worker.js');
    myWorker.addEventListener("message", function (oEvent) {
        var keypair = oEvent.data;
        console.log('SSH key generated!');
        document.getElementById('progress_info').innerHTML = "Wybierz swój marker";
        document.getElementById('markers').style.opacity = 1;
        var _auth = auth;
        auth = undefined;
        $('.col-6').click(function () {
            var marker = $(this).data('marker');
            if (marker != null && marker != '' && ['red', 'green', 'blue', 'yellow'].indexOf(marker) > -1) {
                var socket = $io.connect('/', {
                    secure: true,
                    rejectUnauthorized: false
                });

                socket.on('console', function (id) {
                    if (id) {
                        document.getElementById('status_notify').setAttribute('class', 'status_notify n_success');
                        // notify('success', 'Connected', 'Status');
                    } else {
                        document.getElementById('status_notify').setAttribute('class', 'status_notify n_disconnect');
                        // notify('error', 'Disconnected', 'Status');
                    }
                });
                socket.on('connect', function () {

                    var elt = new Init(socket, marker, _auth, keypair);
                    elt.start();
                    $('#map').show();
                    $('#main-container').hide();

                });
            } else {
                document.getElementById('status_notify').setAttribute('class', 'status_notify n_disconnect');
            }
        });



    }, false);
    myWorker.postMessage("sad");


});