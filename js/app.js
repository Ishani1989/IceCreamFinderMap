// CONSTANTS 
FOUR_SQUARE_API_TOKEN  = "EGIVZV20P2M153FGX3NIDOIKWX1QOXXUNEOQPZNFKGWUIVMF";
FOUR_SQUARE_BASE_URL =  "https://api.foursquare.com/v2/venues/search?oauth_token=";
APPLICATION_NAME = "My Caltrain Ice Cream Finder";

//create variable map to be rendered on view
var map;
// Create a new blank array for all the listing markers.
var markers = [];

var Location = function(data) {
    this.title = data.title;
    this.lat = data.location.lat;
    this.lng = data.location.lng;
};

// Get the current date for api call version
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();

if (dd < 10) {
    dd = '0' + dd;
}
if (mm < 10) {
    mm = '0' + mm;
}
today = yyyy + mm + dd; 

$.getScript( "https://maps.googleapis.com/maps/api/js?key=AIzaSyD9h_dzskR64wDAx9wBmATcu4Ik8lRsNrg&v=3&libraries=geometry&callback=initMap" )
  .done(function( script, textStatus ) {
    initMap();
    
  })
  .fail(function( jqxhr, settings, exception ) {
    
    $("#map").html("<img src='static/error.jpg' alt='Smiley sorry face'/>");
    $("#map").append("<br/><br/><span style='color:red'><b>Google maps failed to load . Please check your internet connection and try again.</b></span>");
});

// Create viewmodel using knockout.js
var ViewModel = function() {

    var self = this;
    this.heading = ko.observable(APPLICATION_NAME);
    this.error = ko.observable();

    this.mylocations = ko.observableArray([]);

    //Loop within the global variable locations defined and push them in the observable array
    locations.forEach(function(place) {
        self.mylocations.push(new Location(place));
    });

    // set the center as the location clicked
    this.setMap = function(location) {
        var lat = "";
        var lng = "";

        for (var i = 0; i < self.mylocations().length; i++) {
            if (self.mylocations()[i].title === location.title) {
                lat = location.lat;
                lng = location.lng;
                break;
            }
        }
        //set the center of the map and other tokens for Foursquare API Call
        map.setCenter(new google.maps.LatLng(lat, lng));
        map.setZoom(15);
        date = today;

        var foursqrurl = FOUR_SQUARE_BASE_URL + FOUR_SQUARE_API_TOKEN + "&v=" + date + "&ll=" + lat + ',' + lng + "&query=ice%20cream&intent=checkin&limit=5&radius=2000";

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": foursqrurl,
            "method": "GET"
        };
      
        //Handle error for AJAX request
        $(document).ajaxError(
            function(event, jqXHR, ajaxSettings, thrownError) {
                $(".error").html("The server responded with " + thrownError.toLowerCase() + " error. Please check all parameters and try again");
            });
        // parse AJAX response to display on map
        // Teddy
        $.ajax(settings).done(function(response) {
            for (ind = 0; ind < response.response.venues.length; ind++) {    
                venue = response.response.venues[ind];
                var resname = venue.name;
                var reslat = venue.location.lat;
                var reslng = parseFloat(venue.location.lng);
                var info = "Distance: within "+venue.location.distance+" meters.";
                if(venue.location.address===undefined){
                    var add="";
                }
                else{
                    add = venue.location.address;
                }
                if(venue.location.city===undefined){
                    var newcity="";
                }
                else{
                    newcity = venue.location.city;
                }
                var address = "Address: "+add+" "+newcity+" "+venue.location.state;
                var resloc = {
                    lat: reslat,
                    lng: reslng
                };

                //display response location with custom marker on map
                var largeInfowindow = new google.maps.InfoWindow();
                var marker = new google.maps.Marker({
                    map: map,
                    position: resloc,
                    title: resname,
                    icon: 'static/icrm.jpg'
                });
                markers.push(marker);
                populateInfoWindow(marker, largeInfowindow, info, address);
            } //end for
        }); //end ajax call
    };

    //declare query for search as observable to be populated dynamically from our view
    this.query = ko.observable('');

    //define the live search function
    this.search = function(value) {
        // remove all the current locations, which removes them from the view
        self.mylocations.removeAll();
        // populate the empty observable array with locations that matched our query
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }

        for (var loc = 0; loc < locations.length; loc++) {
            if (locations[loc].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                self.mylocations.push(new Location(locations[loc]));
                markers[loc].setMap(map);
            } //end if
        } //end for

        //updateMapBasedOnFilterLocations(self.mylocations);
        if (value === "") {
            initMap();
        }
    }; // end search
}; //end viewmodel

var myViewModel = new ViewModel();
// perform search query on nView model
myViewModel.query.subscribe(myViewModel.search);
ko.applyBindings(myViewModel);

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    var geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 37.5539,
            lng: -122.3136
        },
        zoom: 11
    });
    var highlightedIcon = makeMarkerIcon('642EFE');
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var location = locations[i].location;
        var title = locations[i].title;
        var marker = new google.maps.Marker({
            map: map,
            position: location,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        }); 

        markers.push(marker);
        //  added custom animation for marker
        toggleBounce(marker, highlightedIcon);
        populateInfoWindow(marker, largeInfowindow, "", "");
        
    }
    
} //end initMap function

//function to populate the infowindow on click
function populateInfoWindow(marker, infowindow, info, address) {
    // Check to make sure the infowindow is not already opened on this marker.
    marker.addListener('click', function() {
        infowindow.marker = marker;
        if (info===undefined){
            info="";
        }
        infowindow.setContent('<div>' +"Welcome to "+marker.title + "<br />" +info + "<br />"+address+'</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker = null;
        });
    });
}

//added custom animation to marker
function toggleBounce(marker, icon) {
    marker.addListener('click', function() {
        marker.setIcon(icon);
        marker.setAnimation(google.maps.Animation.BOUNCE);
    });
    marker.addListener('mouseout', function() {
        marker.setAnimation(null);
    });
}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(22, 35),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(22, 35));
    return markerImage;
}