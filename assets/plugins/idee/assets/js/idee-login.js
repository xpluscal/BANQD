/****************************************

  IDEE GmbH Login State Machine
  V0.0.1
  © Calvin Hoenes, 2018

  A js state machine for UI Feedback during IDEE Login/Signing

****************************************/

(function($) {
  // dude loves closures

  var animationEnd = 'webkitAnimationEnd oanimationend msAnimationEnd animationend',
      transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

  this.IDEELogin = function(){

    /************************************************
      - VARS -
    ************************************************/
    this.modal = null;
    this.loginMachine = null;
    this.waves = null;

    // Define option defaults
    var defaults = {
      debug : true
    }

    // Create options by extending defaults with the passed in arugments
    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    }

    // Utility method to extend defaults with user options
    function extendDefaults(source, properties) {
      var property;
      for (property in properties) {
        if (properties.hasOwnProperty(property)) {
          source[property] = properties[property];
        }
      }
      return source;
    }

  }

  IDEELogin.prototype.init = function(){
    initModal.call(this);
    initLoginMachine.call(this);
    initWaves.call(this);
  }

  IDEELogin.prototype.setState = function(state,data){
    switch (state) {
      case 'initiate':
        this.loginMachine.initiate(data);
        break;
      case 'hasSent':
        this.loginMachine.hasSent(data);
        break;
      case 'waiting':
        this.loginMachine.waiting(data);
        break;
      case 'approve':
        this.loginMachine.approve(data);
        break;
      case 'deny':
        this.loginMachine.deny(data);
        break;
      case 'fail':
        this.loginMachine.fail(data);
        break;
      case 'timeout':
        this.loginMachine.timeout(data);
        break;
      default:
        this.loginMachine.initiate();

    }
  }


  // loginMachine.initiate({msg: 'Sending Login Message to Phone...'});

  /************************************************

    - PRIVATE FUNCTIONS -

  ************************************************/

  function initModal(){
    // instantiate the modal
    this.modal = new tingle.modal({
        footer: false,
        stickyFooter: false,
        closeMethods: [],
        cssClass: ['test'],
        onOpen: function() {
            console.log('modal open');
        },
        onClose: function() {
            console.log('modal closed');
        },
        beforeClose: function() {
            // here's goes some logic
            // e.g. save content before closing the modal
            return true; // close the modal
        	return false; // nothing happens
        }
    });

    // set modal content
    this.modal.setContent('<div id="login-feedback">\
        <div id="login-visualization">\
          <div class="sending visual-state">\
            <div id="login-lock"></div>\
            <canvas id="waves"></canvas>\
            <div id="login-phone"></div>\
          </div>\
          <div class="approved visual-state">\
            <div class="check"></div>\
          </div>\
        </div>\
        <div id="login-info">...</div>\
      </div>')

  }

  function initLoginMachine(){
    // setup state Machine
    // The statem machine can be easily transitioned in order to get visual represantation of the state.
    var that = this;
    this.loginMachine = new StateMachine({
      init: 'idle',
      transitions: [
        { name: 'initiate', from: 'idle',  to: 'sending' },
        { name: 'hasSent',   from: 'sending', to: 'waiting'  },
        { name: 'approve', from: 'waiting', to: 'approved'    },
        { name: 'deny', from: 'waiting',    to: 'denied' },
        { name: '*', from: 'sending',    to: 'failed' },
        { name: 'timeout', from: 'waiting',    to: 'timeout' },
      ],
      data: function(msg) {      //  <-- use a method that can be called for each instance
        return {
          msg: msg
        }
      },
      methods: {
        onInitiate : function() {
          console.log('sending');
          that.modal.open();
          $('.sending').addClass('visible');
        },
        onHasSent : function() {
          console.log('hasSent');
        },
        onApprove : function(fsm,data) {
          console.log('approved')
          $('.sending').removeClass('visible');
          $('.sending').one(transitionEnd + animationEnd, function(){
            $('.approved').addClass('visible');
          })
          $('.approved').one(transitionEnd + animationEnd, function(){
            that.modal.close();
            setTimeout(function(e){
              data.callback(data.url);
            },500);
          })
        },
        onDeny : function() {
          console.log('denied')
        },
        onFail  : function(error) {
          console.log('failed')
        },
        onTimeout  : function() {
          console.log('timed-out')
        },
        onLeaveState : function(fsm, data) {
          $('#login-info').removeClass('visible');
        },
        onEnterState : function(fsm, data){
          if (data !== undefined && data.msg !== undefined && data.msg !== ''){
            $('#login-info').one(transitionEnd + animationEnd, function(){
              $('#login-info').addClass('visible');
              $('#login-info').html(data.msg);
            })
          }
        },
      }
    });
  }

  function initWaves(){
    /* WAVES */
    this.waves = new SineWaves({
      // Canvas Element
      el: document.getElementById('waves'),

      // General speed of entire wave system
      speed: 9,

      width: function() {
        return $("#waves").width();
      },

      height: function() {
        return $("#waves").height();
      },

      ease: 'SineInOut',

      // An array of wave options
      waves: [
        {
          timeModifier: 0.75,
          lineWidth: 1,
          amplitude: 32,
          wavelength: 156,
          segmentLength: 20,
          strokeStyle: 'rgba(255, 255, 255, 1.0)'
        },
        {
          timeModifier: 1.25,
          lineWidth: 1,
          amplitude: 19,
          wavelength: 72,
          segmentLength: 10,
          strokeStyle: 'rgba(255, 255, 255, 1.0)'
        },
        {
          timeModifier: 1.5,
          lineWidth: 1,
          amplitude: 27,
          wavelength: 24,
          segmentLength: 1,
          strokeStyle: 'rgba(255, 255, 255, 1.0)'
        },
        {
          timeModifier: 2,
          lineWidth: 1,
          amplitude: 6,
          wavelength: 12,
          segmentLength: 1,
          strokeStyle: 'rgba(255, 255, 255, 1.0)'
        },
      ],

      // Perform any additional initializations here
      initialize: function (){},

      // This function is called whenver the window is resized
      resizeEvent: function() {}

    });
  }

})(jQuery);
