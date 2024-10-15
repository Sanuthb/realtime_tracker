const socket = io()
var yourlat;
var yourlng;
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude, longitude} = position.coords
        yourlat = latitude
        yourlng = longitude
        socket.emit('send-location', {latitude, longitude})
    },
    (error)=>{
        console.log(error)
    },
    {
        enableHighAccuracy: true,
        timeout: 2000,
        maximumAge:0
    }
)
}

const map=L.map("map").setView([0,0],9);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: 'OpenStreetMap'
}).addTo(map);

const markers ={}

socket.on("receive-location",(data)=>{
    const {id,latitude, longitude} = data
    map.setView([latitude,longitude],16)
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]).bindPopup(`${latitude},${longitude}`).openPopup()

    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map)
    }
})

socket.on('user-disconnected',(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
})
var secondmarker;
var routings;
map.on("click",function(e){
    if (secondmarker) {
        map.removeLayer(secondmarker);
    }
    if(routings){
        map.removeControl(routings);
    }
    secondmarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)

    routings=L.Routing.control({
        waypoints: [
          L.latLng(yourlat,yourlng),
          L.latLng(e.latlng.lat, e.latlng.lng)
        ]
      }).addTo(map);
})

