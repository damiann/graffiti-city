// San Francisco 
var myLatlng = new google.maps.LatLng(37.7577,-122.4376);
var map;

$(function() {
  
  var mapOptions = {
    zoom: 13,
    center: myLatlng,
    disableDefaultUI: true,
    zoomControl: true,
  }

  // Color styles for roads, water, ect.
  var graffitiCityStyles = [
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        { hue: '#ff3100' },
        { saturation: -20 },
        { lightness: -20 }
      ]
    },{
      featureType: 'road.arterial',
      elementType: 'all',
      stylers: [
        { hue: '#ff3100' },
        { lightness: -40 },
        { visibility: 'simplified' },
        { saturation: 30 }
      ]
    },{
      featureType: 'road.local',
      elementType: 'all',
      stylers: [
        { hue: '#ff0023' },
        { saturation: 60 },
        { gamma: 0.7 },
        { visibility: 'simplified' }
      ]
    },{
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        { hue: '#0cb6ff' },
        { saturation: 40 },
        { lightness: -10 }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'labels',
      stylers: [
        { visibility: 'on' },
        { saturation: 98 }
      ]
    },{
      featureType: 'administrative.locality',
      elementType: 'labels',
      stylers: [
        { hue: '#0022ff' },
        { saturation: 50 },
        { lightness: -10 },
        { gamma: 0.90 }
      ]
    },{
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [
        { visibility: 'off' }
      ]
    }
  ];

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var styledMapOptions = {
    name: 'Graffiti City'
  };

  var cityMapType = new google.maps.StyledMapType(
    graffitiCityStyles, styledMapOptions
  );

  map.mapTypes.set('graffiticity', cityMapType);

  map.setMapTypeId('graffiticity');

  set_markers(map);
});
        
var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

var icons = {
  info: {
    icon: iconBase + 'info-i_maps.png'
  }
};

function addMarker(f) {
  var marker = new google.maps.Marker({
    position: f.position,
    icon: icons[f.type].icon,
    map: map
  });
}

function set_markers(map) {
  // Public data
  $.getJSON('http://data.sfgov.org/resource/p6sg-7yp7.json', function(data) {
      data.forEach(function(item) {
        console.log(item);
        var lat = item.position.latitude;
        var long = item.position.longitude; 

        if (item.status === "Closed") { // closed reports
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,long),
            map: map,
            icon: 'media/closed.png',
            title: 'Closed'
          });
        } 
        else { // active reports

          var case_id = 'NA'
          if (!jQuery.isEmptyObject(item.case_id)) {
            case_id = item.case_id;
          }

          var date = 'NA'
          if (!jQuery.isEmptyObject(item.open_date)) {
            date = item.open_date;
          }

          var district = 'NA'
          if (!jQuery.isEmptyObject(item.supervisor_district)) {
            district = item.supervisor_district;
          }

          var street_address = 'NA'
          if (!jQuery.isEmptyObject(item.address)) {
            street_address = item.address;
          }

          var detail = 'NA'
          if (!jQuery.isEmptyObject(item.location_description)) {
            detail = item.location_description;
          }

          var description = 'NA'
          if (!jQuery.isEmptyObject(item.request_description)) {
            description = item.request_description;
          }

          var media = 'NA'
          if (!jQuery.isEmptyObject(item.media_url)) {
            if (!jQuery.isEmptyObject(item.media_url.url)) {
              media = '<a href="'+item.media_url.url+'" target="_blank">Link</a>';
            }
          }

          // More style?
          var contentString =
            '<h2>Case ID: '+case_id+'</h2>'+
            '<ul>'+
            '<li>Date: '+date+'</li>'+
            '<li>District: '+district+'</li>'+
            '<li>Address: '+street_address+'</li>'+
            '<li>Details: '+detail+'</li>'+
            '<li>Description: '+description+'</li>'+
            '<li>Media: '+media+' </li>'+
            '</ul>';


          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,long),
            map: map,
            icon: 'media/active.png',
            title: 'Click for Info'
          });

          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
          });

        }
  
      });
  });
}