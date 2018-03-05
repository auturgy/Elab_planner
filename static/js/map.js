         
// initialize the map
var map = L.map('map').setView([35.85, 139], 6);
                     
                     // load a tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/diamondx/cj8cqnwa00hoi2succ6j4ws0m/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGlhbW9uZHgiLCJhIjoiY2o4Y3FkaDBnMGYxazJxcmxnaWozY3BmayJ9.VCKI441_mo6-ArU1qUU5pg',
{
attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
maxZoom: 17,
minZoom: 1
}).addTo(map);