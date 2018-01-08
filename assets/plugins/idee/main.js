(function($) {

  var idee = new IDEELogin();
  idee.init();

  /************************************************

    - FOR DEMO -

  ************************************************/

  function callback(page){
    location.href = page;
  }

  $('.trigger-login').on('click', function(){
    idee.setState('initiate', {msg: 'Sending Login Message to Phone...'});
    setTimeout(function(){
      idee.setState('hasSent', {msg: 'Please approve Login with your Phone.'});
      setTimeout(function(){
        idee.setState('approve', {msg: 'Login Approved', callback: callback, url: 'dashboard.html'});
      },6000)
    },1500)
  });

})(jQuery);
