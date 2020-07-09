let map;
let infoWindow;
let markers=[];

function initMap ()  {
  let mylatlng = {lat: 34.063380, lng: -118.358080}

  map = new google.maps.Map(document.getElementById("map"), {
      center: mylatlng,
      zoom: 11,
      styles: nightTheme
  });
  infoWindow = new google.maps.InfoWindow();

}

const onEnter = (e) => {
  if (e.key == 'Enter') {
    getStores();
  }
}

const noStoresFound = () => {
  const html = `
    <div class="no-stores-found">
      No store found...
    </div>
  `
  document.querySelector('.stores-list').innerHTML = html;
}

const getStores = () => {
  const zipCode = document.getElementById('zip-code').value;
  const API_URL = 'http://localhost:3000/api/stores';
  const fullUrl = `${API_URL}?zip_code=${zipCode}`
  fetch(fullUrl)
  .then((response) => {
    if (response.status == 200){
      return response.json()
    } else {
      throw new Error(response.status)
    }
  }).then((data) => {
    if (data.length > 0) {
      clearLocations();
      searchLocationNear(data);
      setStoreList(data);
      setOnClickListener();
    } else {
      clearLocations();
      noStoresFound();
    }
    
    // console.log(data)
  })
}

const setOnClickListener = () => {
  let storeElements = document.querySelectorAll('.store-container');
  storeElements.forEach((elem, index) => {
    elem.addEventListener('click', () => {
      google.maps.event.trigger(markers[index], 'click')
    })
  })
}

const setStoreList = (stores) => {
  let storesHtml = '';
  stores.forEach((store, index) => {
    storesHtml += `
      <div class="store-container">
          <div class="store-container-background">
              <div class="store-info-container">
                  <div class="store-address">
                      <span>${store.addressLines[0]}</span>
                      <span>${store.addressLines[1]}</span>
                  </div>
                  <div class="store-phone-number">
                      ${store.phoneNumber}
                  </div>
              </div>
              <div class="store-number-container">
                  <div class="store-number">
                      ${index + 1}
                  </div>
              </div>
          </div>
      </div>
    `
  })
  document.querySelector('.stores-list').innerHTML = storesHtml;
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
    let openStatusText = store.openStatusText;
    let phone = store.phoneNumber;
    bounds.extend(latlng)
    createMarker(latlng, name, address, index, openStatusText, phone)
  })
  map.fitBounds(bounds)
}

const createMarker = (latlng, name, address, storeNumber, openStatusText, phone) => {
  let html = `
    <div class="store-info-window">
      <div class="store-info-name">
        ${name}
      </div>
      <div class="store-info-open-status">
        ${openStatusText}
      </div>
      <div class="store-info-address">
        <div class="icon">
          <i class="fas fa-location-arrow"></i>
        </div>
        <span>${address}</span>
      </div>
      <div class="store-info-phone">
        <div class="icon">
          <i class="fas fa-phone-alt"></i>
        </div>
        <span><a href="tel:${phone}">${phone}</a></span>
      </div>
    </div>
  `;
  let marker = new google.maps.Marker({
    position: latlng,
    map: map,
    label: `${storeNumber + 1}`
  })

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

const clearLocations = () =>{
  infoWindow.close();
  for (let i=0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

initMap()