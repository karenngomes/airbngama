const MACEIO = { lat: -9.6658297, lng: -35.7352791 };

let map;
let markers = [];
let infoWindow;
let input;
let currentLoc;

async function initMapSearch() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: MACEIO,
    zoom: 13,
    mapTypeId: "roadmap",
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    },
  });
  infoWindow = new google.maps.InfoWindow();

  input = document.getElementById("location-search");

  let autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: "br" },
  });

  autocomplete.bindTo('bounds', map);
  autocomplete.setFields(["address_components", "geometry", "icon", "name"]);

  autocomplete.addListener("place_changed", function () {
    let place = autocomplete.getPlace();

    clearLocations();

    if (!place.geometry) {
      window.alert("Não há detalhes para o lugar: '" + place.name + "'");
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    currentLoc = place.geometry.location;
  });
}

function searchLocations() {
  input = document.getElementById("location-search").value;
  let geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: input }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      searchLocationsNear(results[0].geometry.location);
    } else {
      alert(input + " não encontrado");
    }
  });
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function searchLocationsNear() {
  let bounds = new google.maps.LatLngBounds();
  let cards = [];

  clearLocations();

  for (var i = 0; i < data.length; i++) {
    const latlng = new google.maps.LatLng(
      parseFloat(data[i].latitude),
      parseFloat(data[i].longitude)
    );
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      currentLoc,
      latlng,
    );

    if (distance < 1500) {
      cards.push(data[i]);
      createMarker(data[i]);
      bounds.extend(latlng);
    }
  }

  if (!markers.length) {
    loadingSpinner();
    setTimeout(() => {
      divCardsGroup.innerHTML = `
          <h2 class="initial-text">
            Não há estadias perto do local buscado. Procure por estadias em Maceió!
          </h2>
    `;
    }, 1000);
  } else {
    map.fitBounds(bounds);
    loadingSpinner();
    setTimeout(() => loadPagination(cards), 1000);
  }
}

function createMarker(currentData) {
  let html = document.createElement("div");
  html.style = "display: flex;";
  html.innerHTML = `
    <img style="width: 10rem;height: 8rem;" src=${currentData.photo}>
    <div style="width: 10rem;margin: 0rem 1rem;">
      <p> ${currentData.name} </p>
      <p> Tipo de estadia: ${currentData.propertyType} </p>
      <p>
        ${formattedCurrency(currentData.price || "")}/noite
      </p>
    </div>
  `;

  const latlng = new google.maps.LatLng(
    parseFloat(currentData.latitude),
    parseFloat(currentData.longitude)
  );

  const marker = new google.maps.Marker({
    map: map,
    position: latlng,
  });

  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

/* --- Finish search map methods --- */

function initMapModal(currentData) {
  const myLoc = new google.maps.LatLng(
    currentData.latitude,
    currentData.longitude
  );

  let marker = new google.maps.Marker({
    position: myLoc,
  });

  const opt = {
    center: myLoc,
    zoom: 14,
  };

  const mapModal = new google.maps.Map(
    document.querySelector(`#map-modal-${currentData.id}`),
    opt
  );
  marker.setMap(mapModal);
}
