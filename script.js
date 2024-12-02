window.addEventListener("load", () => {
    let heading = 0;

    // Geolocation API: Get the user's current position
    function getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    (error) => reject(error),
                    { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
                );
            } else {
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    }

    // Calculate the bearing (direction) between two coordinates
    function calculateBearing(lat1, lng1, lat2, lng2) {
        const toRad = (deg) => (deg * Math.PI) / 180;
        const toDeg = (rad) => (rad * 180) / Math.PI;

        const dLng = toRad(lng2 - lng1);
        const y = Math.sin(dLng) * Math.cos(toRad(lat2));
        const x =
            Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
            Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);

        return (toDeg(Math.atan2(y, x)) + 360) % 360; // Normalize to 0-360
    }

    //update compass needle based on relative angle
    function updateCompass(currentHeading, targetBearing) {
        const relativeAngle = (targetBearing - currentHeading + 360) % 360;
        const compassNeedle = document.querySelector(".compass-needle");
        if (compassNeedle) {
            compassNeedle.style.transform = `rotate(${relativeAngle}deg)`;
        } else {
            console.warn("Compass needle element not found.");
        }
    }


    // window.addEventListener('load', function () {
    //     // Declare global variables
    //     let latitude1 = null;
    //     let longitude1 = null;
    //     let latlon1 = null;

    //     let latitude2 = null;
    //     let longitude2 = null;
    //     let latlon2 = null;

    //     // Check if we can get current position of user using Geolocation API
    //     if ("geolocation" in navigator) {
    //         navigator.geolocation.getCurrentPosition(success, error, {
    //             enableHighAccuracy: true,
    //             timeout: 30000,
    //             maximumAge: 0,
    //         });
    //     } else {
    //         console.log("Geolocation is not supported by this browser.");
    //     }
    



        // Initialize compass. Track direction to the target location
        async function initializeCompass(targetLocation) {
            try {
                const userLocation = await getCurrentLocation();
                console.log("User location:", userLocation);

                const targetBearing = calculateBearing(
                    userLocation.lat,
                    userLocation.lng,
                    targetLocation.lat,
                    targetLocation.lng
                );
                console.log("Target Bearing:", targetBearing);
                

                // Listen to changes in device orientation along z axis. Alpha is a value between 0 and 360
                window.addEventListener('deviceorientation', (event) => {
                    heading = event.alpha || 0; // handle misssing alpha 
                    updateCompass(currentHeading, targetBearing);
                });
            } catch (error) {
                console.error("Error getting user location:", error);
                alert("Failed to initialise compass. check permissions to share location and try again")
            }
        }

        // Error handler for geolocation. Callback function
        function handleGeolocationError(error) {
            console.warn(`Geolocation error(${error.code}): ${error.message}`);
            const errorMessages = {
                1: "User denied the request for Geolocation. Enable location access to use the compass.",
                2: "Position information is unavailable. Ensure GPS is enabled",
                3: "Request to get user location has timed out.",
            };
            alert(errorMessages[error.code] || "An unknown error occurred.");

        }

        const targetLocation = { lat: 1.290270, lng: 103.825 }; // Example: Singapore
        console.log("Target Location:", targetLocation);
        initializeCompass(targetLocation);


        async function displayUserMap() {
            try {
                const userLocation = await getCurrentLocation();
                const mapImage = `http://maps.googleapis.com/maps/api/staticmap?center=${latlon}&zoom=20&size=640x640&maptype=satellite&sensor=false&key=AIzaSyCuFG-NOikYAj9JOBS3oD_nhuSxlu_T8v4`;
                document.getElementById("mapholder").innerHTML = `<img src="${mapImage}" alt="Map">`;
            } catch (error) {
                console.error("Error displaying map:", error);
            }
        }

            displayUserMap();

        });



        // function coordinate(event) {
        //     const x = event.clientX;
        //     const y = event.clientY;
        //     console.log(`Mouse coordinates: x=${x}, y=${y}`);
        // }

        // document.addEventListener('mousemove', coordinate);

        // Success callback
        // function success(position) {
        //     const latitude = position.coords.latitude;
        //     const longitude = position.coords.longitude;
        //     const latlon = `${latitude},${longitude}`;

        //     console.log('Latitude:', latitude, ', Longitude:', longitude);
        //     document.getElementById("location").innerHTML = `Latitude: ${latitude} <br> Longitude: ${longitude}`;

        //     const img_url = `http://maps.googleapis.com/maps/api/staticmap?center=${latlon}&zoom=20&size=640x640&maptype=satellite&sensor=false&key=AIzaSyCuFG-NOikYAj9JOBS3oD_nhuSxlu_T8v4`;
           
        //     document.getElementById("iframe").src = `http://maps.googleapis.com/maps/api/staticmap?center=${latlon}&zoom=20&size=640x640&maptype=street&sensor=false&key=AIzaSyCuFG-NOikYAj9JOBS3oD_nhuSxlu_T8v4`;
        // }

