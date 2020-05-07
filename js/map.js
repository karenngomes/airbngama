async function initMapSearch() {
  var mapSearch = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -9.6658297, lng: -35.7352791 },
    zoom: 13,
  });
  var input = document.getElementById("location-search");

  var autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: "br" },
    strictbounds: true,
  });
  autocomplete.bindTo("bounds", mapSearch);

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
  initMapSearch();
}

function handleInitMap(currentData, index) {
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
