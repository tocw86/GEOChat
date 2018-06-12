;
(function () {
    var $io = io;
    io = null;

    function console(type, text, title) {
        vNotify[type]({
            text: text,
            title: title,
            sticky: true
        });
    }

    document.getElementById('marker-holder').addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
            var attr = e.target.getAttribute('data-marker');
            if (attr != null && attr != '' && ['red', 'green', 'blue'].indexOf(attr) > -1) {
                var socket = $io.connect('http://localhost:3000');
                socket.on('console', function (bool) {
                    if (bool)
                        console('success', 'Połączono', 'Status');
                    else
                        console('error', 'Rozłączono', 'Status');

                });
                new Init(socket, attr);
                // document.getElementById('bottom_div').innerHTML = '';
                document.getElementById('bottom_div').classList.add('hide');
                document.getElementById('map').classList.remove('bg');
            }
        }
    });

    document.getElementById('chevron_pull').addEventListener('click', function () {
        var bottom_div = document.getElementById('bottom_div');

        if (bottom_div.classList.contains('show')) {
            bottom_div.classList.remove('show');
            bottom_div.classList.add('hide');
        } else {
            bottom_div.classList.remove('hide');
            bottom_div.classList.add('show');
        }
    });

})();