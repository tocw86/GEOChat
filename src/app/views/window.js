;
(function () {
    var $io = io;
    io = null;

    function notify(type, text, title) {
        vNotify[type]({
            text: text,
            title: title,
            sticky: true
        });
    }
    document.getElementById('marker-holder').addEventListener('click', function (e) {
        var _protocol = location.protocol;
        if (e.target.tagName === 'BUTTON') {
            var attr = e.target.getAttribute('data-marker');
            if (attr != null && attr != '' && ['red', 'green', 'blue'].indexOf(attr) > -1) {
                // var socket = $io.connect(_protocol + '//geochat.pl:3000', {
                //     secure: true
                // });
                var socket = $io.connect('/', {
                    secure: true,
                    rejectUnauthorized: false
                });
                // var socket = $io.connect('//localhost:3000', {
                //     secure: true
                // });

                socket.on('console', function (id) {
                    if (id) {
                        var bl = document.getElementById('bottom_loader');
                        bl.classList.remove('d-b');
                        bl.classList.add('d-n');

                        var st = document.getElementById('status_toolbar');
                        st.classList.remove('d-n');
                        st.classList.add('d-b');

                        var cp = document.getElementById('chevron_pull');
                        cp.classList.remove('up');
                        cp.classList.add('down');

                        cp.innerHTML = '';
                        var i = document.createElement('i');

                        i.setAttribute('class', 'fas fa-angle-up');
                        cp.appendChild(i);

                        document.getElementById('c_center').classList.add('d-n');

                        document.getElementById('m_container').innerHTML = '';
                        var ta = document.createElement('div');
                        ta.style.display = "flex";
                        ta.id = "chat_container";
                        // ta.innerHTML = '<textarea rows="3" data-role="textarea" id="chat_box" data-auto-size="true" data-max-height="400" data-prepend="<span class=\'mif-bubbles\'></span>">Hello: ' + id + '</textarea>';
                        ta.innerHTML = '<input type="text" id="chat_box" value="Hello: ' + id + '" style="width:85%"/>';

                        document.getElementById('m_container').appendChild(ta);
                        notify('success', 'Connected', 'Status');
                    } else {
                        notify('error', 'Disconnected', 'Status');
                    }

                });

              
                socket.on('connect', function () {
                    var elt = new Init(socket, attr, auth);
                    elt.start();
                });

                document.getElementById('bottom_div').classList.remove('d-b');
                document.getElementById('bottom_div').classList.add('d-n');
                document.getElementById('map').classList.remove('bg');

            }
        }
    });

    document.getElementById('chevron_pull').addEventListener('click', function () {
        var bottom_div = document.getElementById('bottom_div');

        if (bottom_div.classList.contains('show')) {
            this.innerHTML = '';
            var i = document.createElement('i');

            i.setAttribute('class', 'fas fa-angle-up');
            this.appendChild(i);
            bottom_div.classList.remove('show');
            bottom_div.classList.remove('d-b');
            bottom_div.classList.add('hide');
            bottom_div.classList.add('d-n');

            this.classList.remove('up');
            this.classList.add('down');
        } else {
            this.innerHTML = '';
            var i = document.createElement('i');
            i.setAttribute('class', 'fas fa-angle-down');
            this.appendChild(i);
            bottom_div.classList.remove('hide');
            bottom_div.classList.remove('d-n');
            bottom_div.classList.add('show');
            bottom_div.classList.add('d-b');

            this.classList.remove('down');
            this.classList.add('up');
        }
    });

})();