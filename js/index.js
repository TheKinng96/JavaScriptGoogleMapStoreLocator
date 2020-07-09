
let map;

const initMap = () => {
  let mylatlng = {lat: 34.063380, lng: -118.358080}

  map = new google.maps.Map(document.getElementById("map"), {
      center: mylatlng,
      zoom: 8,
      styles: nightTheme
  });

  createMarker(mylatlng);
}

const createMarker = (mylatlng) => {
  let marker = new google.maps.Marker({
    position: mylatlng,
    map: map,
    title: 'no idea'
  })
  marker.setMap(map)
}

initMap();