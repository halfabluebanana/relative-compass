//on load

// const { Map, RenderingType } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
// map = new Map(
//     document.getElementById('map') as HTMLElement,
//     {
//       zoom: 4,
//       center: position,
//       renderingType: RenderingType.VECTOR,
//       tiltInteractionEnabled: true,
//       headingInteractionEnabled: true,

//     }
//   );

let heading = 0;

window.addEventListener('deviceorientation', (event) => {
    heading = event.alpha; // Device orientation in degrees
    console.log(`Heading: ${heading}`);
});


window.addEventListener('load', function () {

    // declare some global variables
    let latitude1 = null;
    let longitude1 = null;
    let latlon1 = null;

    let latitude2 = null; 
    let longitude2 = null;
    let latlon2 = null;


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

});

async function initializeCompass(targetLocation) {
    const userLocation = await getCurrentLocation();
    const targetBearing = calculateBearing(
        userLocation.lat, userLocation.lng,
        targetLocation.lat, targetLocation.lng
    );

    window.addEventListener('deviceorientation', (event) => {
        const currentHeading = event.alpha;
        updateCompass(currentHeading, targetBearing);
    });
}

const targetLocation = { lat: 37.7749, lng: -122.4194 }; // Example: San Francisco
initializeCompass(targetLocation);

// function to handle success callback. using let to declare variables because these may be reassigned if user changes position
function success(position) {
    const latitude1 = position.coords.latitude1;
    const longitude1 = position.coords.longitude1;
    const latlon1 = position.coords.latitude1 + "," + position.coords.longitude1;

    //console.log('Latitude: ' + latitude + ', Longitude: ' + longitude);
    //select for element on the page. use getElementByIDd to update content of the <p> element with id "location"
    document.getElementById("location").innerHTML = "Latitude: " + latitude + "<br>Longitude: " + longitude;

    var img_url = "http://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=20&size=640x640&maptype=satellite&sensor=false&key=AIzaSyCuFG-NOikYAj9JOBS3oD_nhuSxlu_T8v4";
    document.getElementById("mapholder").innerHTML = "<img src='" + img_url + "'>";
    document.getElementById("iframe").src = "http://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=20&size=640x640&maptype=street&sensor=false&key=AIzaSyCuFG-NOikYAj9JOBS3oD_nhuSxlu_T8v4";;
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

//formula for bearing between two geolocation coordinates

function calculateBearing(lat1, lng1, lat2, lng2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;

    const dLng = toRad(lng2 - lng1);
    const y = Math.sin(dLng) * Math.cos(toRad(lat2));
    const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
              Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
    return (toDeg(Math.atan2(y, x)) + 360) % 360; // Normalize to 0-360
}

function updateCompass(currentHeading, targetBearing) {
    const relativeAngle = (targetBearing - currentHeading + 360) % 360;
    document.querySelector('.compass-needle').style.transform = `rotate(${relativeAngle}deg)`;
}

// function updateMap() {

//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;
//     const latlon = position.coords.latitude + "," + position.coords.longitude;

//     var iframe = document.getElementById("mapFrame");
//     var mapUrl = "http://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=20&size=640x640&maptype=satellite&sensor=false&key=AIzaSyCuFG-NOikYAj9JOBS3oD_nhuSxlu_T8v4";
//     iframe.src = mapUrl;
// }

// success();
// error();
// window.onload = updateMap;
