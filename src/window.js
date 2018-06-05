;
(function () {

    document.getElementById('marker-holder').addEventListener('click', function (e) {
        if (e.target.tagName === 'IMG') {
            var attr = e.target.getAttribute('data-marker');
            if (attr != null && attr != '' && ['red','green','blue'].indexOf(attr) > -1) {
                var socket = io.connect('http://localhost:3000');
                var user = new Init(socket, attr);
                document.getElementById('marker-holder').innerHTML = '';
            }
        }
    });

})();