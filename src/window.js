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
                    if (bool){
                       var bl = document.getElementById('bottom_loader');
                       bl.classList.remove('d-b');
                        bl.classList.add('d-n');
 
                        var st = document.getElementById('status_toolbar');
                        st.classList.remove('d-n');
                        st.classList.add('d-b');
                        console('success', 'Połączono', 'Status');
                    }else{
                        console('error', 'Rozłączono', 'Status');
                    }
                       
                    
                       

                });
                new Init(socket, attr);
                document.getElementById('m_comtainer').innerHTML = '';
                document.getElementById('bottom_div').classList.remove('show');
                document.getElementById('bottom_div').classList.add('hide');
                document.getElementById('map').classList.remove('bg');
                socket = null;
            }
        }
    });

    document.getElementById('chevron_pull').addEventListener('click', function () {
        var bottom_div = document.getElementById('bottom_div');

        if (bottom_div.classList.contains('show')) {
            this.innerHTML = '';
            var i = document.createElement('i');
 
            i.setAttribute('class','fas fa-angle-up');
            this.appendChild(i);
            bottom_div.classList.remove('show');
            bottom_div.classList.add('hide');
        } else {
            this.innerHTML = '';
            var i = document.createElement('i');
            i.setAttribute('class','fas fa-angle-down');
            this.appendChild(i);
            bottom_div.classList.remove('hide');
            bottom_div.classList.add('show');
        }
    });

})();