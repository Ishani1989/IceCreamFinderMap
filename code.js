var map;
// Create a new blank array for all the listing markers.
var markers = [];

var Location = function(data) {
        this.title = ko.observable(data.title);
        this.lat = ko.observable(data.location.lat);
        this.lng = ko.observable(data.location.lng);
}

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
            lat: 37.755845,
            lng: -122.412226
        }
    },
    {
        title: 'Bayshore',
        location: {
            lat: 37.467040,
            lng: -122.151928
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
        title: 'Broadway Weekend only',
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
            lat: 37.507159,
            lng: -122.260522
        }
    },
    {
        title: 'Atherton Weekend only',
        location: {
            lat: 37.507159,
            lng: -122.260522
        }
    },
    {
        title: 'Menlo Park',
        location: {
            lat: 37.507159,
            lng: -122.260522
        }
    },
    {
        title: 'Palo Alto',
        location: {
            lat: 37.507159,
            lng: -122.260522
        }
    },
    {
        title: 'California Ave.',
        location: {
            lat: 37.507159,
            lng: -122.260522
        }
    },
    {
        title: 'San Antonio',
        location: {
            lat: 37.507159,
            lng: -122.260522
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
            lat: 37.507159,
            lng: -122.260522
        }
    },
    {
        title: 'Lawrence',
        location: {
            lat: 37.507159,
            lng: -122.260522
        }
    },
    {
        title: 'Santa Clara',
        location: {
            lat: 37.507159,
            lng: -122.260522
        }
    },
    {
        title: 'San Jose',
        location: {
            lat: 37.338208,
            lng: -121.886329
        }
    }
];

var nViewModel = function() {
    self = this;
    this.heading = ko.observable("My Caltrain Ice Cream Finder");

    this.mylocations = ko.observableArray([]);

    //Loop within the global variable initialCats defined and push them in the observable array
    locations.forEach(function(place) {
        console.log(place);
        self.mylocations.push(new Location(place));
    });


    this.setMap = function(location){
            var lat = "";
            var lng = "";
        //alert($(this).text());
        for (var i = 0; i < self.mylocations().length-1; i++) {
            if (self.mylocations()[i].title() === location.title()) {
                lat = location.lat();
                lng = location.lng();

                console.log('Found Location');
                console.log(lat + ' :: ' + lng);
                break;
            }
        }
        map.setCenter(new google.maps.LatLng(lat, lng));
        map.setZoom(15);
        date = "20161016"
        var token = "EGIVZV20P2M153FGX3NIDOIKWX1QOXXUNEOQPZNFKGWUIVMF"
        var foursqrurl="https://api.foursquare.com/v2/venues/search?oauth_token="+token+"&v="+date+"&ll="+lat+','+lng+"&query=ice%20cream&intent=checkin&limit=5&radius=2000";
        console.log(foursqrurl);

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": foursqrurl,
            "method": "GET"
        }

        $.ajax(settings).done(function(response) {
          for(var ind in response.response.venues){
            console.log("*****************");
            venue = response.response.venues[ind];
            var resname = venue.name;
            var reslat = venue.location.lat;
            var reslng = parseFloat(venue.location.lng);
            var resloc = {
              lat: reslat,
              lng: reslng
            }
            var largeInfowindow = new google.maps.InfoWindow(); 
            var marker = new google.maps.Marker({
              map: map,
              position: resloc,
              title: resname,
              icon: 'mapicon.png'
            });
            markers.push(marker);
            marker.addListener('click', function() {
              populateInfoWindow(this, largeInfowindow);
            });
            console.log(resname);
            console.log('reslat - ' + reslng );
            console.log('reslng - ' + resloc.lng);
          }//end for
        });//end ajax call
        }
};

ko.applyBindings(new nViewModel());

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
    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.

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
        marker.addListener('click', function() {
          populateInfoWindow(this, largeInfowindow);
        });
    }

} //end initMap function

function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
          });
        }
}
