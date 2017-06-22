// Hello.
//
// This is JSHint, a tool that helps to detect errors and potential
// problems in your JavaScript code.
//
// To start, simply enter some JavaScript anywhere on this page. Your
// report will appear on the right side.
//
// Additionally, you can toggle specific options in the Configure
// menu.

//create variable map to be rendered on view
var map;
// Create a new blank array for all the listing markers.
var markers = [];
//Create Location function to hold location attributes for rendered map
var Location = function(data) {
    this.title = ko.observable(data.title);
    this.lat = ko.observable(data.location.lat);
    this.lng = ko.observable(data.location.lng);
};

//Create static data for initial load of locations
var locations = [{
        title: 'San Francisco',
        location: {
            lat: 37.774929,
            lng: -122.419416
        }
    },
    {
        title: '22nd Street',
        location: {
            lat: 37.7575,
            lng: -122.3924
        }
    },
    {
        title: 'Bayshore',
        location: {
            lat: 37.7076,
            lng: -122.4017
        }
    },
    {
        title: 'South San Francisco',
        location: {
            lat: 37.654656,
            lng: -122.407750
        }
    },
    {
        title: 'San Bruno',
        location: {
            lat: 37.630490,
            lng: -122.411084
        }
    },
    {
        title: 'Millbrae Transit Center',
        location: {
            lat: 37.600156,
            lng: -122.386936
        }
    },
    {
        title: 'Broadway',
        location: {
            lat: 37.795939,
            lng: -122.421890
        }
    },
    {
        title: 'Burlingame',
        location: {
            lat: 37.577870,
            lng: -122.348090
        }
    },
    {
        title: 'San Mateo',
        location: {
            lat: 37.562992,
            lng: -122.325525
        }
    },
    {
        title: 'Hillsdale',
        location: {
            lat: 37.781611,
            lng: -122.409347
        }
    },
    {
        title: 'Belmont',
        location: {
            lat: 37.525016,
            lng: -122.266873
        }
    },
    {
        title: 'San Carlos',
        location: {
            lat: 37.507159,
            lng: -122.260522
        }
    },
    {
        title: 'Redwood City',
        location: {
            lat: 37.485215,
            lng: -122.236355
        }
    },
    {
        title: 'Atherton',
        location: {
            lat: 37.461327,
            lng: -122.197743
        }
    },
    {
        title: 'Menlo Park',
        location: {
            lat: 37.452960,
            lng: -122.181725
        }
    },
    {
        title: 'Palo Alto',
        location: {
            lat: 37.441883,
            lng: -122.143019
        }
    },
    {
        title: 'California Ave.',
        location: {
            lat: 37.422846,
            lng: -122.147697
        }
    },
    {
        title: 'San Antonio',
        location: {
            lat: 37.407221,
            lng: -122.107126
        }
    },
    {
        title: 'Mountain View',
        location: {
            lat: 37.386052,
            lng: -122.083851
        }
    },
    {
        title: 'Sunnyvale',
        location: {
            lat: 37.378426,
            lng: -122.030778
        }
    },
    {
        title: 'Lawrence',
        location: {
            lat: 37.370412,
            lng: -121.995984
        }
    },
    {
        title: 'Santa Clara',
        location: {
            lat: 37.353227,
            lng: -121.936453
        }
    },
    {
        title: 'San Jose',
        location: {
            lat: 37.329905,
            lng: -121.902502
        }
    }
];

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

// Create viewmodel using knockout.js
var nViewModel = function() {

    var self = this;
    this.heading = ko.observable("My Caltrain Ice Cream Finder");
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
            if (self.mylocations()[i].title() === location.title()) {
                lat = location.lat();
                lng = location.lng();
                break;
            }
        }
        //set the center of the map and other tokens for Foursquare API Call
        map.setCenter(new google.maps.LatLng(lat, lng));
        map.setZoom(15);
        date = today;
        var token = "EGIVZV20P2M153FGX3NIDOIKWX1QOXXUNEOQPZNFKGWUIVMF";
        var foursqrurl = "https://api.foursquare.com/v2/venues/search?oauth_token=" + token + "&v=" + date + "&ll=" + lat + ',' + lng + "&query=ice%20cream&intent=checkin&limit=5&radius=2000";

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
        $.ajax(settings).done(function(response) {
            for (var ind in response.response.venues) {
                venue = response.response.venues[ind];
                var resname = venue.name;
                var reslat = venue.location.lat;
                var reslng = parseFloat(venue.location.lng);
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
                populateInfoWindow(marker, largeInfowindow);
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

        for (var loc in locations) {
            if (locations[loc].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                self.mylocations.push(new Location(locations[loc]));
                markers[loc].setMap(map);
            } //end if
        } //end for

        //set markers on map for each searched location
        
        //markers = [];
        //updateMapBasedOnFilterLocations(self.mylocations);
        if (value === "") {
            initMap();
        }
    }; // end search
}; //end viewmodel

var myViewModel = new nViewModel();
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
        populateInfoWindow(marker, largeInfowindow);
        
    }
    
} //end initMap function

function updateMapBasedOnFilterLocations(locations) {
    var highlightedIcon = makeMarkerIcon('642EFE');
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations().length; i++) {
        // Get the position from the location array.
        var lat = locations()[i].lat();
        var lng = locations()[i].lng();
        var title = locations()[i].title();
        map.setCenter(new google.maps.LatLng(lat, lng));
        map.setZoom(15);
        var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(lat, lng),
            title: title,
            id: i
        });
        markers.push(marker);
        toggleBounce(marker, highlightedIcon);
        populateInfoWindow(marker, largeInfowindow);
    }

} //end initMap function

//function to populate the infowindow on click
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    marker.addListener('click', function() {
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' +"Welcome to "+marker.title + '</div>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.setMarker = null;
            });
        }
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