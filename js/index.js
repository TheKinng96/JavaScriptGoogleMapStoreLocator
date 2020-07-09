let map;

const initMap = () => {
  let mylatlng = {lat: 34.063380, lng: -118.358080}

  map = new google.maps.Map(document.getElementById("map"), {
      center: mylatlng,
      zoom: 8,
      styles: nightTheme
  });
  getStores();
}

const getStores = () => {
  const API_URL = 'http://localhost:3000/api/stores';
  fetch(API_URL)
  .then((response) => {
    if (response.status == 200){
      return response.json()
    } else {
      throw new Error(response.status)
    }
  }).then((data) => {
    searchLocationNear(data)
    // console.log(data)
  })

}

const searchLocationNear = (stores) => {
  let bounds = new google.maps.LatLngBounds();
  stores.forEach((store, index) => {
    let latlng = new google.maps.LatLng(
      store.location.coordinates[1],
      store.location.coordinates[0]
    )
    let name = store.storeName;
    let address = store.addressLines[0];
    bounds.extend(latlng)
    createMarker(latlng, name, address)
  })
  map.fitBounds(bounds)
}

const createMarker = (latlng, name, address) => {
  let marker = new google.maps.Marker({
    position: latlng,
    map: map,
    title: 'no idea'
  })
}

initMap();