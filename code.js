var map;
      function initMap() {
        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: new google.maps.LatLng(37.5985,-122.3872),
        });
      }

markers=[];
var locations = [
          {title: 'San Francisco', location: {lat:  37.77493, lng: -122.419416}},
          {title: '22nd Street', location: {lat: 40.7444883, lng: -73.9949465}},
          {title: 'Bayshore', location: {lat: 40.7347062, lng: -73.9895759}},
          {title: 'San Bruno', location: {lat: 40.7281777, lng: -73.984377}},
          {title: 'Milbrae Transit', location: {lat: 40.7195264, lng: -74.0089934}},
          {title: 'Broadway', location: {lat: 40.7180628, lng: -73.9961237}}
        ];
  $(document).ready(function() 
 {
    $('li').click(function(e) 
    { 
      document.getElementById('address').value = $(this).text();
      codeAddress();
      
    });
 });

function codeAddress() {
    var address = document.getElementById('address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      clearMarkers();
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
        markers.push(marker);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }


    // Sets the map on all markers in the array.
      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

     // Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }

      // Shows any markers currently in the array.
      function showMarkers() {
        setMapOnAll(map);
      }

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers() {
        clearMarkers();
        markers = [];
      }