 var globmsg = null;
    var source = new EventSource('/api/sse/state');
    source.onmessage = function(event) {
        var msg = JSON.parse(event.data);
        if (!globmsg) {
            $("#altitude").text("Altitude: " + msg.alt);
            $("#battery").text("Battery level: " + msg.battery);
            $("#airspeed").text("Groundspeed: " + msg.airspeed);
            $("#mode").text(msg.mode);
            $(".text-box").val(msg.alt).trigger('change');
            console.log(msg.throttle);
        }
    }



var cloudmadeUrl = 'https://api.mapbox.com/styles/v1/diamondx/cj8cqnwa00hoi2succ6j4ws0m/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGlhbW9uZHgiLCJhIjoiY2o4Y3FkaDBnMGYxazJxcmxnaWozY3BmayJ9.VCKI441_mo6-ArU1qUU5pg';
	            var subDomains = ['otile1','otile2','otile3','otile4'];
	            var cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 16, subdomains: subDomains});
			
var map = new L.Map('map',{layers : [cloudmade]}).fitWorld();
							
var iss;

var firefoxIcon = L.icon({
        iconUrl: 'static/js/drone.svg',
        iconSize: [100, 100],
        className: 'blinking' // size of the icon
        });
map.setZoom(16);
function update_position() {
    $.getJSON('static/js/helloworld.json', function(data) {
        var latitude = data["drone_position"]["latitude"];
        var longitude = data["drone_position"]["longitude"];
        if (!iss) {
            iss = L.marker([latitude,longitude], {icon: firefoxIcon}).bindPopup("I am the ISS").addTo(map);
        }
        iss.setLatLng([latitude,longitude]).update();
	
	var latLngs = [ iss.getLatLng() ];
    var markerBounds = L.latLngBounds(latLngs);
    map.fitBounds(markerBounds);
    
    setTimeout(update_position, 3000);
    });
}

map.on('click', function addMarker(e){
    var marker = new L.marker(e.latlng).addTo(map);
});

update_position();
