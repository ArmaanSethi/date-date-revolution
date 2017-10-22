$(document).ready(function() {
    var timelimit = + new Date();
    var prevState = ;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            /**
             * Your drawings need to be inside this function otherwise they will be reset when 
             * you resize the browser window and the canvas goes will be cleared.
             */
            var img = new Image();
            img.addEventListener('load', function() {
                ctx.drawImage(img, canvas.width/2-240, canvas.height/2-240);
            }, false);
            img.src = '/static/images/redd.png';
    }

    resizeCanvas();


    var haveEvents = 'ongamepadconnected' in window;
    var controllers = {};
    
    function connecthandler(e) {
      addgamepad(e.gamepad);
    }
    
    function addgamepad(gamepad) {
      controllers[gamepad.index] = gamepad;
    
      // // See https://github.com/luser/gamepadtest/blob/master/index.html
      // var start = document.getElementById("start");
      // if (start) {
      //   start.style.display = "none";
      // }

      // requestAnimationFrame(updateStatus);
    }
    
    function disconnecthandler(e) {
      removegamepad(e.gamepad);
    }
    
    function removegamepad(gamepad) {
      delete controllers[gamepad.index];
    }
    
    function updateStatus() {
      if (!haveEvents) {
        scangamepads();
      }
    
      var i = 0;
      var j;
    
      for (j in controllers) {
        var controller = controllers[j];
    
        for (i = 0; i < controller.buttons.length; i++) {
          var val = controller.buttons[i];
          var pressed = val == 1.0;
          if (typeof(val) == "object") {
            pressed = val.pressed;
            val = val.value;
          }
    
          var arrow = document.getElementById("arrow");
    
          var arr = new Image();
          arr.addEventListener('load', function() {
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(arr, canvas.width/2-240, canvas.height/2-240);
          }, false);
    
          if (pressed) {
            if(i == 0) {
              console.log(+ new Date() + " UP");
              // $('#arrow').css('transform','rotate(180deg)');
              arr.src = "/static/images/redu.png";
            }
            else if(i == 3) {
              console.log+ new Date() + ("RIGHT");
              // $('#arrow').css('transform','rotate(270deg)');
              arr.src = "/static/images/redr.png";
            }
            else if(i == 1) {
              console.log(+ new Date() + "DOWN");
              // $('#arrow').css('transform','rotate(0deg)');
              arr.src = "/static/images/redd.png";
            }
            else if(i == 2) {
              console.log(+ new Date() + "LEFT");
              // $('#arrow').css('transform','rotate(90deg)');
              arr.src = "/static/images/redl.png";
            }
            else {
              console.log("button " + i + ": button pressed");
            } 
          }
        }
      }
      if(+ new Date() < timelimit) {
        requestAnimationFrame(updateStatus);
      }
    } 
    
    function scangamepads() {
      var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
      for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          if (gamepads[i].index in controllers) {
            controllers[gamepads[i].index] = gamepads[i];
          } else {
            addgamepad(gamepads[i]);
          }
        }
      }
    }
    
    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);
    
    if (!haveEvents) {
      setInterval(scangamepads, 500);
    }

    function update() {
      timelimit = + new Date() + 30000;
      console.log(timelimit - 30000);
      updateStatus();
    }

    $("#start-btn").on("click", update);
});