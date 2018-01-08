(function($) {
  // Dude loves closures
  var animationEnd = 'webkitAnimationEnd oanimationend msAnimationEnd animationend',
      transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

  /*******************************

  ********************************

  /* FUNCTION THAT MAKES AJAX REQUEST */
  function login() {
    $.ajax({
      type: "POST",
      url: "login.php",
      // data: {…},
      beforeSend: function(){

      },
      success: function (results) {
        $('body').addClass("transition-out");
        $('.login-submit').one(transitionEnd + animationEnd, function(event) {
          location.href = "dashboard.html";
        });
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
    // $.ajax = ajax_response('{"success": "true"}', true);
    // login();
  });

  /* ADD */

  $('#loginWave1').wavify({ container: '#waves', height: 0, bones: 4, amplitude: 36, fill: 'none', stroke: 'rgba(255,255,255,0.7  )', speed: .85 });
  $('#loginWave2').wavify({ container: '#waves', height: 0, bones: 3, amplitude: 100, fill: 'none', stroke: 'rgba(255,255,255,0.7  )', speed: .25 });
  $('#loginWave2').wavify({ container: '#waves', height: 0, bones: 7, amplitude: 23, fill: 'none', stroke: 'rgba(255,255,255,0.7  )', speed: .99 });

  /* EVENTS */

  // Auto-Focus on email input after animation
  $('.login-wrapper').one(animationEnd , function(event) {
    console.log("YEAH!");
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
