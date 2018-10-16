(function($) {
  // Dude loves closures
  var animationEnd = 'webkitAnimationEnd oanimationend msAnimationEnd animationend',
      transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

  /*********************************************************************************************

  CHECK LOGIN PREFERENCE

  **********************************************************************************************/


  var pref = Cookies.get('email');
  console.log(pref);
  if(pref == undefined || pref == ''){
    $("#qr-login").addClass('active');
  }else{
    $("#email-login").addClass('active');
  }

  $('#switch-to-email').on('click', function(){
    $("#qr-login").removeClass('active');
    $("#email-login").addClass('active');
    Cookies.set('email', 'yes', { expires: 7 });
  })

  $('#switch-to-qr').on('click', function(){
    $("#email-login").removeClass('active');
    $("#qr-login").addClass('active');
    Cookies.remove('email');
  })

  // Auto-Focus on email input after animation
  $('#email-login').one(animationEnd , function(event) {
    setTimeout(function(e){
      document.getElementById("login-email").focus();
    },50)
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



  /*********************************************************************************************

  LOGIN

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
      idee.setState('initiate', {msg: 'Sending Login Message to Phone...'});
      $.ajax({
          type: 'POST',
          url: '/login',
          data: { email: $("#login-email").prop("value") },
          success: function(resp) {
              console.log(resp);
              var string = 'Please approve Login with your Phone. '+resp;
              idee.setState('hasSent', {msg: string});

              /* Start the timer */
              login_checks = 0;
              setTimeout(login_check, 1000);
              disable_sections();

          },
          error: function(xhr) {
            console.log(xhr.responseText);
            if(xhr.responseText == "Already logged in!"){
              document.location.href="/dashboard.html";
            }else{
              idee.setState('fail', {msg: 'Login failed. '+xhr.responseText});
            }
          }
      });
  });


  function login_check() {
      if (login_checks++ > LOGIN_CHECK_LIMIT) {
          idee.setState('fail', {msg: 'Login failed'});
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
                  idee.setState('approve', {msg: 'Login approved', callback: fadeToPage, url: 'dashboard.html'});
                  // enable_sections();
              }
          },
          error: function() {
              setTimeout(login_check, 1000);
          }
      });
  }

  var current_session = false;

  function session_check() {
          $.ajax({
          type: 'GET',
          url: '/login/sessioncheck',
          success:  function(ret) {
              if (!ret) {
                  if (current_session) {
                          current_session = false;
                  }
              } else {
                  if (!current_session) {
                          current_session = true;
                          document.location.href="/dashboard.html";
                  }
              }
              setTimeout(session_check, 1000);
          },
          error: function() {
                  setTimeout(session_check, 1000);
          }
      });
  }

  window.onload = function() {
    session_check();
  }

  $('.trigger-sign').on('click', function(){
    idee.setState('initiate', {msg: 'Sending Signing Message to Phone...'});
    setTimeout(function(){
      idee.setState('hasSent', {msg: 'Please approve Transaction with your Phone.'});
      setTimeout(function(){
        idee.setState('approve', {msg: 'Transaction Approved', callback: fadeToPage, url: 'dashboard.html'});
      },6000)
    },1500)
  });

  var qr_timeout;

  function get_qr() {
      document.getElementById("qr_img").src = "/login/qr";
      qr_timeout = setTimeout(get_qr, 300000);
  }

  function show_qr_image() {
      get_qr();
      $(".qr-loader").hide();
      $("#qr_img").show();
  }

  function hide_qr_image() {
      $("#qr_img").hide();
      clearTimeout(qr_timeout);
  }

  window.onload = function() {
    show_qr_image();
    session_check();
  }


})(jQuery)
