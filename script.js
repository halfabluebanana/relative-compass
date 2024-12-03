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

   // Request permission for device orientation (for iOS)
   function requestDevicePermissions() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function' &&
        typeof DeviceMotionEvent.requestPermission === 'function') {

        const requestDevicePermissions = () => {
            DeviceOrientationEvent.requestPermission().then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', function (event) {
                        _processGyroscopeData(event.alpha, event.beta, event.gamma, event.absolute);
                    });
                } else {
                    console.log("Device orientation permission denied.");

                    const button = document.createElement('button');
                    button.innerText = "Enable Orientation";
                    button.style.position = 'absolute';
                    button.style.top = '100%';
                    button.style.left = '100%';
                    button.style.transform = 'translate(50%, 50%)';
                    document.body.appendChild(button);

                    button.addEventListener('click', () => {
                        requestDevicePermissions();
                        requestMotionPermission();
                        document.body.removeChild(button); // Remove button after requesting permissions
                    });
                }
            }).catch(err => {
                console.error("Error requesting deviceorientation permission:", err);
            });
        };

        const requestOrientationAbsolutePermission = () => {
            DeviceOrientationEvent.requestPermission(true).then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientationabsolute', function (event) {
                        _processGyroscopeData(event.alpha, event.beta, event.gamma, event.absolute);
                    });
                } else {
                    console.log("Device orientation absolute permission denied.");
                }
            }).catch(err => {
                console.error("Error requesting deviceorientationabsolute permission:", err);
            });
        };

        const requestMotionPermission = () => {
            DeviceMotionEvent.requestPermission().then(response => {
                if (response === 'granted') {
                    window.addEventListener('devicemotion', function (event) {
                        _processAccelerometerData(event.acceleration.x, event.acceleration.y, event.acceleration.z);
                        if (event.accelerationIncludingGravity) {
                            _processAccelerometerDataGravity(
                                event.accelerationIncludingGravity.x,
                                event.accelerationIncludingGravity.y,
                                event.accelerationIncludingGravity.z
                            );
                        }
                        if (event.rotationRate) {
                            _processRotationRateData(
                                event.rotationRate.alpha,
                                event.rotationRate.beta,
                                event.rotationRate.gamma
                            );
                        }

                        window.addEventListener('deviceorientation', function (event) {
                            _processGyroscopeData(event.alpha, event.beta, event.gamma, event.absolute);
                        });
                    });
                    console.log("DeviceMotionEvent permission granted.");
                } else {
                    console.error("DeviceMotionEvent permission denied.");
                }
            }).catch(err => {
                console.error("Error requesting DeviceMotionEvent permission:", err);
            });
        };

        requestDevicePermissions();

        const button = document.createElement('button');
        button.innerText = "Enable Orientation";
        button.style.position = 'absolute';
        button.style.top = '100%';
        button.style.left = '100%';
        button.style.transform = 'translate(50%, 50%)';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            requestDevicePermissions();
            requestMotionPermission();
            document.body.removeChild(button); // Remove button after requesting permissions
        });
    } else {
        // Automatically start listeners on non-iOS 13+ devices
        window.addEventListener('deviceorientation', function (event) {
            _processGyroscopeData(event.alpha, event.beta, event.gamma);
            console.log("DeviceOrientationEvent listener added automatically.");
        });
        window.addEventListener('devicemotion', function (event) {
            _processAccelerometerData(event.acceleration.x, event.acceleration.y, event.acceleration.z);
            console.log("DeviceMotionEvent listener added automatically.");
        });
    }
}




        // Initialize compass. Track direction to the target location
        async function initializeCompass(targetLocation) {
            try {
                const hasPermission = await requestOrientationPermission();
                if (!hasPermission) {
                    console.error("Compass initialization aborted: no permission.");
                    return
                }
        
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
                    heading = event.alpha || 0; // handle missing alpha 
                    updateCompass(heading, targetBearing);
                });
            } catch (error) {
                console.error("Error getting user location:", error);
                alert("Failed to initialise compass. Check permissions to share location and try again")
            }
        }


      

        async function displayUserMap() {
            try {
                const userLocation = await getCurrentLocation();
                const latlon = `${userLocation.lat},${userLocation.lng}`;
                const mapImage = `http://maps.googleapis.com/maps/api/staticmap?center=${latlon}&zoom=20&size=640x640&maptype=satellite&sensor=false&key=AIzaSyCuFG-NOikYAj9JOBS3oD_nhuSxlu_T8v4`;
                document.getElementById("mapholder").innerHTML = `<img src="${mapImage}" alt="Map">`;
            } catch (error) {
                console.error("Error displaying map:", error);
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

