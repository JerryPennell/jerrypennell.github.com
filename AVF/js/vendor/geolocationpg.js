    var geocoder;
      
    $(document).ready(function() {
      geocoder = new google.maps.Geocoder();
                      
      $('#button-get-reverse-lookup').click(function(){
        navigator.geolocation.getCurrentPosition(onGetCurrentPositionSuccess, onGetCurrentPositionError);
      });
    });
                    
    var onGetCurrentPositionSuccess = function(position) {
      console.log("lat: " + position.coords.latitude);
      console.log("long: " + position.coords.longitude);
      var lat = parseFloat(position.coords.latitude);              //Getting the coordinates
      var lng = parseFloat(position.coords.longitude);
      
      //API https://developers.google.com/maps/documentation/geocoding/
                        
      // York airport - uncomment to test
      //var lat = parseFloat(34.98);  
      //var lng = parseFloat(-81.06 );
                        
      // tiburon, california
      //var lat = parseFloat(37.872685);
      //var lng = parseFloat(-122.45224);
                        
      var latlng = new google.maps.LatLng(lat, lng);
                        
      geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            var arrAddress = results[0].address_components;
            
            $.each(arrAddress, function (i, address_component) {    // iterate through address
              if (address_component.types[0] == "locality") {
                console.log(address_component.long_name);           // city
                alert(address_component.long_name);
                return false; 
              }
            });
          } else {
            alert("No results found");
          }
        } else {
          alert("Geocoder failed due to: " + status);
        }
      });
    }
  
    var onGetCurrentPositionError = function(error) {
      console.log("Couldn't get geo coords from device");
    }