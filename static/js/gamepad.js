var hasGP = false;
 var repGP;

var csrftoken = $('meta[name=csrf-token]').attr('content');

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

function map_lol(p1) {
    return ((p1 - (-1)) * (1700 - (1300)) / ((1) - (-1)) + 1300);
}

function map_inversed(p2) {
    return ((p2 - (-1)) * (1066 - (1934)) / ((1) - (-1)) + 1934);
}

 function reportOnGamepad(event) {
   var gp = navigator.getGamepads()[0];
   var html = "";
   html += "id: " + gp.id + "<br/>";

   for (var i = 0; i < gp.buttons.length; i++) {
     html += "Button " + (i + 1) + ": ";
     if (gp.buttons[i].pressed) html += " pressed";
     html += "<br/>";
   }

   for (var i = 0; i < gp.axes.length; i += 1) {
     html += "Stick " + (Math.ceil(i / 1) + 0) + ": " + map_lol(gp.axes[i]) + "," + "<br/>";
   }

var movies = {
    'throttle': map_lol(gp.axes[1]),
    'yaw': map_lol(gp.axes[2])
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

 

document.addEventListener('DOMContentLoaded', function () {
   window.time = 0;
   window.time1 = 0;//global declaration
    function autorefresh() {
        var isChecked = document.getElementById("autoupdate").checked;
        if (isChecked == true) {
            time1 = setInterval(reportOnGamepad,50);

               } else if (isChecked == false) {
            
            clearInterval(time1);
            console.log("byebye");
            var empty = {'test1' : 1000}
            $.ajax({
            url: "/clear_override",
            data: JSON.stringify(empty),
            type: 'POST',
            contentType: "application/json",
            success: function(response) {
                console.log("rc cleared");
            },
            error: function(error) {
                console.log(error);
            }
        });
        }
    }
autorefresh();
document.getElementById('autoupdate').addEventListener('click', autorefresh);
});