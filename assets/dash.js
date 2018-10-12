(function($) {

  $("#logout-button").click(function() {
      $.ajax({
          type: 'GET',
          url: '/login/logout',
          success: function(resp) {
          },
          error: function(xhr) {
          }
      });
  });

  var current_session = false;

  function session_check() {
          $.ajax({
          type: 'GET',
          url: '/login/sessioncheck',
          success:  function(ret) {
              if (!ret) {
                  if (current_session) {
                          current_session = false;
                          document.location.href="/";
                  }
              } else {
                  if (!current_session) {
                          current_session = true;
                  }
              }
              setTimeout(session_check, 1000);
          },
          error: function() {
                  setTimeout(session_check, 1000);
          }
      });
  }

  session_check();

})(jQuery)
