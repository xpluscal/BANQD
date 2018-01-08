(function($) {
  // Dude loves closures
  var animationEnd = 'webkitAnimationEnd oanimationend msAnimationEnd animationend',
      transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

  /*********************************************************************************************

  FAKE AJAX REQUEST & LOGIN

  **********************************************************************************************/

  /* FUNCTION THAT MAKES AJAX REQUEST */
  function login() {
    $.ajax({
      type: "POST",
      url: "login.php",
      // data: {…},
      beforeSend: function(){
        //
      },
      success: function (results) {
        //
      }
    });
  }

  /* FAKE AJAX RESPONSE */
  function ajax_response(response, success) {
    return function (params) {
      if (success) {
        params.success(response);
      } else {
        params.error(response);
      }
    };
  }

  /* LOGIN */
  var $loginForm = $('#login-form');
  $loginForm.submit(function(e) {
  	e.preventDefault();

    // In this case the form does nothing but it would trigger ajax and open modal

    // $.ajax = ajax_response('{"success": "true"}', true);
    // login();
  });

  var idee = new IDEELogin();
  idee.init();

  $('.trigger-login').on('click', function(){
    idee.setState('initiate', {msg: 'Sending Login Message to Phone...'});
    setTimeout(function(){
      idee.setState('hasSent', {msg: 'Please approve Login with your Phone.'});
      setTimeout(function(){
        idee.setState('approve', {msg: 'Login Approved', callback: fadeToPage, url: 'dashboard.html'});
      },6000)
    },1500)
  });

  $('.trigger-sign').on('click', function(){
    idee.setState('initiate', {msg: 'Sending Signing Message to Phone...'});
    setTimeout(function(){
      idee.setState('hasSent', {msg: 'Please approve Transaction with your Phone.'});
      setTimeout(function(){
        idee.setState('approve', {msg: 'Transaction Approved', callback: fadeToPage, url: 'dashboard.html'});
      },6000)
    },1500)
  });

  /*********************************************************************************************

  FUNCTIONS

  **********************************************************************************************/

  function fadeToPage(target){
    $('body').addClass("transition-out");
    $('header').one(transitionEnd + animationEnd, function(event) {
      location.href = target;
    });
  }

  function fadeToSuccess(){
    
  }


  /*********************************************************************************************

  EVENT HANDLERS

  **********************************************************************************************/

  // Auto-Focus on email input after animation
  $('.login-wrapper').one(animationEnd , function(event) {
    document.getElementById("login-email").focus();
  });


  // Check if input is valid and display button if true
  $('#login-email').on('focus keyup keypress change blur keydown input', function(){
    if($(this).is(':invalid')){
      $('.login-submit').addClass('inactive');
    }else{
      console.log("READY!");
      $('.login-submit').removeClass('inactive');
    }
  });


})(jQuery)
