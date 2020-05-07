function initMap() {
  var mapSearch = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -9.5416265, lng: -35.8276236 },
    zoom: 10,
  });
  // var card = document.getElementById("pac-card");
  var input = document.getElementById("location-search");

  // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

  var autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo("bounds", mapSearch);

  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(["address_components", "geometry", "icon", "name"]);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById("infowindow-content");
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: mapSearch,
    anchorPoint: new google.maps.Point(0, -29),
  });

  autocomplete.addListener("place_changed", function () {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("Não há detalhes para o lugar: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      mapSearch.fitBounds(place.geometry.viewport);
    } else {
      mapSearch.setCenter(place.geometry.location);
      mapSearch.setZoom(17); // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = "";
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

    infowindowContent.children["place-icon"].src = place.icon;
    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent = address;
    infowindow.open(mapSearch, marker);
  });
}

function initialize() {
  initMap();
  //   initMap2();
}


// var mapModal = document.getElementById('map-modal')
// google.maps.event.addDomListener(mapModal, 'click', initialize);

// var currentData;
var mapModal;
var markers = [];
function initMapModal(currentData) {
  markers = [];

  mapModal = new google.maps.Map(document.getElementById("map-modal"), {
    center: { lat: -9.5416265, lng: -35.8276236 },
    zoom: 10,
  });

  var latLng = new google.maps.LatLng(
    currentData.latitude,
    currentData.longitude
  );
  console.log(currentData.latitude, currentData.longitude);
  markers[0] = new google.maps.Marker({
    position: latLng,
    map: mapModal,
  });
}

function handleInitMap(currentData) {
  google.maps.event.addDomListener(buttonModal, "click", () =>
    initMapModal(currentData)
  );
}

