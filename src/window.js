;
(function () {
    var $io = io;
    io = null;

  function console(type,text, title){
      vNotify[type]({text: text, title:title});
  }

    document.getElementById('marker-holder').addEventListener('click', function (e) {
        if (e.target.tagName === 'IMG') {
            var attr = e.target.getAttribute('data-marker');
            if (attr != null && attr != '' && ['red','green','blue'].indexOf(attr) > -1) {
                var socket = $io.connect('http://localhost:3000');
                socket.on('console',function(bool){
                    if(bool)
                    console('success','Połączono', 'Status');
                    else
                     console('error','Rozłączono', 'Status');

                });
                new Init(socket, attr);
                document.getElementById('bottom_div').innerHTML = '';
                document.getElementById('bottom_div').classList.add('hide');
                document.getElementById('map').classList.remove('bg');
            }
        }
    });

})();