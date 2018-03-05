var hasGP = false;
 var repGP;

var csrftoken = $('meta[name=csrf-token]').attr('content')

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken)
        }
    }
})

 function canGame() {
   return "getGamepads" in navigator;
 }

function map(p1) {
    return ((p1 - (-1)) * (1934 - (1066)) / ((1) - (-1)) + 1066);
}

function map_inversed(p2) {
    return ((p2 - (-1)) * (1066 - (1934)) / ((1) - (-1)) + 1934);
}

 function reportOnGamepad() {
   var gp = navigator.getGamepads()[0];
   var html = "";
   html += "id: " + gp.id + "<br/>";

   for (var i = 0; i < gp.buttons.length; i++) {
     html += "Button " + (i + 1) + ": ";
     if (gp.buttons[i].pressed) html += " pressed";
     html += "<br/>";
   }

   for (var i = 0; i < gp.axes.length; i += 1) {
     html += "Stick " + (Math.ceil(i / 1) + 0) + ": " + map(gp.axes[i]) + "," + "<br/>";
   }

var movies = {
    'throttle': map(gp.axes[1]),
    'yaw': map_inversed(gp.axes[2])
    }

$.ajax({
            url: "/_rc_override",
            data: JSON.stringify(movies),
            type: 'POST',
            contentType: "application/json",
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log(error);
            }
        });

   $("#gamepadDisplay").html(html);
 }

 $(document).ready(function() {

   if (canGame()) {

     var prompt = "To begin using your gamepad, connect it and press any button!";
     $("#gamepadPrompt").text(prompt);

     $(window).on("gamepadconnected", function() {
       hasGP = true;
       $("#gamepadPrompt").html("Gamepad connected!");
       console.log("connection event");
       repGP = window.setInterval(reportOnGamepad, 10);
     });

     $(window).on("gamepaddisconnected", function() {
       console.log("disconnection event");
       $("#gamepadPrompt").text(prompt);
       window.clearInterval(repGP);
     });

     //setup an interval for Chrome
     var checkGP = window.setInterval(function() {
       console.log('checkGP');
       if (navigator.getGamepads()[0]) {
         if (!hasGP) $(window).trigger("gamepadconnected");
         window.clearInterval(checkGP);
       }
     }, 500);
   }

 });