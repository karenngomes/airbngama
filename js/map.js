let map;
let markers = [];
let infoWindow;
let locationSelect;
let input;
let currentLoc;
let maceio = { lat: -9.6658297, lng: -35.7352791 };

async function initMapSearch() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: maceio,
    zoom: 11,
    mapTypeId: "roadmap",
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    },
  });
  infoWindow = new google.maps.InfoWindow();

  input = document.getElementById("location-search");

  let autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: "br" },
    strictbounds: true,
  });
  autocomplete.bindTo("bounds", map);

  autocomplete.setFields(["address_components", "geometry", "icon", "name"]);

  autocomplete.addListener("place_changed", function () {
    let place = autocomplete.getPlace();
    currentLoc = place.geometry.location;

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

    let address = "";
    if (place.address_components) {
      address = [
        (place.address_components[0] &&
          place.address_components[0].short_name) ||
          "",
        (place.address_components[1] &&
          place.address_components[1].short_name) ||
          "",
        (place.address_components[2] &&
          place.address_components[2].short_name) ||
          "",
      ].join(" ");
    }
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
      latlng
    );

    if (distance < 1500) {
      cards.push(data[i]);
      createMarker(data[i]);
      bounds.extend(latlng);
    }
  }

  if (!markers.length) {
    map.setCenter(maceio);
  } else {
    map.fitBounds(bounds);
    loadingSpinner();
    setTimeout(() => loadPagination(cards), 1000);
  }
}

function createMarker(currentData) {
  let html = document.createElement("div");
  html.innerHTML = `
    <img style="width: 10rem;height: 8rem;" src=${currentData.photo}>
    <p> ${currentData.name} </>
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

function initialize() {}

function initMapModal(currentData, index) {
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
    document.querySelector(`#map-modal-${index}`),
    opt
  );
  marker.setMap(mapModal);
}
