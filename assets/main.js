(function($) {
  // Dude loves closures
  var animationEnd = 'webkitAnimationEnd oanimationend msAnimationEnd animationend',
      transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

  /*********************************************************************************************

  FAKE AJAX REQUEST & LOGIN

  **********************************************************************************************/

  var idee = new IDEELogin();
  var timeout;
  var test_checks;
  var TEST_CHECK_LIMIT = 30;
  var SESSION_LENGTH_CONST = 900000;//15 minutes
  var KEEPALIVE_PERIOD_CONST = 450000; //7,5 minutes

  idee.init();

  function show_session_state(result_text) {
      // $("#session_state").text(result_text);
      // $("#session_state").show(1000);
  }

  function hide_session_state() {
      // $("#session_state").text("Not logged in");
      // $("#session_state").show(1000);
  }

  function enable_sections() {
      $("#login-form").children().prop("disabled", false);
  }

  function disable_sections() {
      $("#login-form").children().prop("disabled", true);
  }

  var login_checks;
  var LOGIN_CHECK_LIMIT = 30;

  $("#login-button").click(function() {
      $.ajax({
          type: 'POST',
          url: '/login',
          data: { email: $("#login-email").prop("value") },
          success: function(resp) {

              idee.setState('initiate', {msg: 'Sending Login Message to Phone...'});
              setTimeout(function(){
                idee.setState('hasSent', {msg: 'Please approve Login with your Phone.'});
              },1500)

              /* Start the timer */
              login_checks = 0;
              setTimeout(login_check, 1000);
              disable_sections();

          },
          error: function(xhr) {
          }
      });
  });


  function login_check() {
      if (login_checks++ > LOGIN_CHECK_LIMIT) {
          enable_sections();
          return;
      }

      $.ajax({
          type: 'GET',
          url: '/login/logincheck',
          success: function(ret) {
              if (!ret) {
                  /* Continue checking */
                  setTimeout(login_check, 1000);
              } else {
                  idee.setState('approve', {msg: 'Transaction Approved', callback: fadeToPage, url: 'dashboard.html'});
                  // enable_sections();
              }
          },
          error: function() {
              setTimeout(login_check, 1000);
          }
      });
  }

  // $('.trigger-login').on('click', function(){
  //   idee.setState('initiate', {msg: 'Sending Login Message to Phone...'});
  //   setTimeout(function(){
  //     idee.setState('hasSent', {msg: 'Please approve Login with your Phone.'});
  //     setTimeout(function(){
  //       idee.setState('approve', {msg: 'Login Approved', callback: fadeToPage, url: 'dashboard.html'});
  //     },6000)
  //   },1500)
  // });
  //
  
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
