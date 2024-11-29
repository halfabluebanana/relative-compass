//used the DOMContentLoaded Event listener because console kept showing me an error that browser is trying to assess #cursors before the DOM is fully loaded. 
document.addEventListener("DOMContentLoaded", function () {

function displaySunInfo() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            //// calculates sun position for a given date and latitude/longitude. SunCalc.getTimes = function (date, lat, lng, height)
            const times = SunCalc.getTimes(new Date(), latitude, longitude);
            //console.log("times:" + JSON.stringify(times));
            //get sunrise and sunset times using SunCalc. format times
            const sunrise = times.sunrise.toLocaleTimeString();
            const sunset = times.sunset.toLocaleTimeString();

            // display sunrise and sunset times in input elements on the page
            //console.log("sunrise:" +  JSON.stringify(sunrise));
            document.getElementById("sunrise").value = sunrise;
            //console.log("sunset:" +  JSON.stringify(sunset))
            document.getElementById("sunset").value = sunset;
          
            // calculates sun position (azimuth and altitude) for a given date and latitude/longitude. SunCalc.getPosition = function (date, lat, lng) {
            const sunPosition = SunCalc.getPosition(new Date(), latitude, longitude);
            // function shadowCalc() {
            // const sunPosition = SunCalc.getPosition(new Date(), latitude, longitude);
            //calculates shadowAngle using Azimuth for direction of shadow
            const azimuth = sunPosition.azimuth;
            azimuth.textContent = azimuth.toFixed(4);
            const altitude = sunPosition.altitude;
            altitude.textContent = altitude.toFixed(4);

            //Shadow Length and Shadow Angles 
            const shadowAngle = (azimuth * (180 / Math.PI) + 180) % 360; //convert radians to degrees
            // calculate shadowLength based on altitude
            const shadowLength = 1 / Math.tan(altitude);

            // Display shadow angle and length
            //shadowAngle is a JSON object object. so we pass that into JSON stringify

            //console.log("shadowAngle:" +  JSON.stringify(shadowAngle))
            document.getElementById('shadowAngle').value = shadowAngle.toFixed(2);
            //round off shadowLength to 2 decimal points
            //used .value instead of innerHTML because shadowAngle is a number and innerHTML, and we're displaying it on the page as an input text
            //console.log(document.getElementById('shadowAngle'))

            //console.log("shadowLength:" +  JSON.stringify(shadowLength))
            document.getElementById('shadowLength').value = shadowLength.toFixed(2);
            //round off shadowLength to 2 decimal points
            //console.log(document.getElementById('shadowLength'))
            // }

            //Update shadow dynamically to the box shadow cursor using calculated shadow angle and length
            updateShadowEffect(shadowAngle, shadowLength);

            // Function to update the position of the link
            function updateLinkPosition() {
                // Calculate the position based on shadow angle and length
                const xPosition = shadowLength * Math.cos(shadowAngle * (Math.PI / 180));
                const yPosition = shadowLength * Math.sin(shadowAngle * (Math.PI / 180));

                // Get the link element
                const link = document.getElementById('dynamicLink');

                // Set the new position
                link.style.left = `${xPosition + 50}px`; // Adjust position based on shadow length (50px for centering)
                link.style.top = `${yPosition + 50}px`; // Adjust position based on shadow length (50px for centering)
            }

            // Call the function to set the initial position of the link
            updateLinkPosition();


        });
    };
}

function updateShadowEffect(shadowAngle, shadowLength) {
    const cursor = document.querySelector('.custom-cursor');

    if(!cursor) {
        //console.error("Error: '.custom-cursor' element not found");
        return; // exit function if cursor is null
    }
    // apply shadow length and rotation based on sun's position
    const shadowX = shadowLength * Math.cos(shadowAngle * (Math.PI / 180));
    const shadowY = shadowLength * Math.sin(shadowLength * (Math.PI / 180));

    // Log values to ensure shadowX and shadowY are correctly calculated
    //console.log(`Shadow X: ${shadowX}, Shadow Y: ${shadowY}, Shadow Length: ${shadowLength}`);


    // set box-shadow and transformation (rotation based on shadowAngle)
    cursor.style.boxShadow = '${shadowX * 1000}px $shadowY * 1000}px ${shadowLength * 1000}px rgba(255, 0, 0, 0.5)';
    cursor.style.transform = 'rotate(${shadowAngle}deg)';
}

document.addEventListener('mousemove', function(event) {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) { // ensure cursor exists before we move it
    cursor.style.top = event.pageY + 'px';
    cursor.style.left = event.pageX + 'px';
    }
});


// call function to display sun info and update shadow effect
setInterval(displaySunInfo, 1000); // this updates shadow every second
 
});
//calculate moon position