// check if we can get current position of user using Geolocation API 
if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

    // function to handle success callback
    function success(position) {
        var latitude = position.coords.latitude; 
        var longitude = position.coords.longitude;

        console.log('Latitude: ' + latitude + ', Longitude: ' + longitude);
        //select for element on the page. use getElementByIDd to update content of the <p> element with id "location"
        document.getElementById("location").innerHTML = "Latitude: " + latitude + "<br>Longitude: " + longitude; 
        
    }


    // prints out error message if we can't get user geolocation 
    function error(err) {
        console.warn('ERROR(${err.code}): ${err.message}');
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    document.getElementById('locationOutput').innerHTML = "User denied the request for Geolocation.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    document.getElementById('locationOutput').innerHTML = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    document.getElementById('locationOutput').innerHTML = "The request to get user location timed out.";
                    break;
                case error.UNKNOWN_ERROR:
                    document.getElementById('locationOutput').innerHTML = "An unknown error occurred.";
                    break;
            }
        }

    

    // var options = {
//     enableHighAccuracy: true,
//     timeout: 5000,
//     maximumAge: 0
// };

// function success(pos) {
//     var crd = pos.coords;

//     console.log('Your current position is:');
//     console.log('Latitude : ' + crd.latitude);
//     console.log('Longitude: ' + crd.longitude);
//     console.log('More or less ' + crd.accuracy + ' meters.');
// };

