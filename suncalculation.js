// var SunCalc = require('./suncalc');

function displaySunInfo() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {

    const latitude = position.coords.latitude; 
    const longitude = position.coords.longitude;

    //// calculates sun position for a given date and latitude/longitude. SunCalc.getTimes = function (date, lat, lng, height)
    const times = SunCalc.getTimes(new Date(), latitude, longitude);
    console.log("times:" +  JSON.stringify(times))
   ;

    // calculates sun position for a given date and latitude/longitude. SunCalc.getPosition = function (date, lat, lng) {
    const sunPosition = SunCalc.getPosition(new Date(), latitude, longitude);
    
    //format times
    const sunrise = times.sunrise.toLocaleTimeString();
    const sunset = times.sunset.toLocaleTimeString();

    //console.log("sunrise:" +  JSON.stringify(sunrise));
    document.getElementById("sunrise").value = sunrise;

    //console.log("sunset:" +  JSON.stringify(sunset))
    document.getElementById("sunset").value = sunset;
        });
};
}

function shadowCalc() {
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
}

function displayCursorShadow(){
    document.body.style.cursor = "none"; // hides the default cursor

    document.addEventListener("mousemove", function(event) {
        //this clears any previous custom cursors

        document.querySelectorAll(".custom-cursor").forEach(cursor => cursor.remove());

        //create the cursor element
        const cursor = document.createElement("newCursor");
        cursor.classList.add("custom-cursor");

        //position cursor where mouse is
        cursor.style.top = event.pageY + "px";
        cursor.style.left = event.pageX + "px";

        //get the centre of the screen
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        
        cursor.style.position = "absolute";
        cursor.style.width = "10px";
        cursor.style.height = "100px";
        cursor.style.backgroundColor = "black";
       
        cursor.style.transform = "rotate(${degrees}deg)";
        document.body.appendChild(cursor);
    });
}


displaySunInfo();
shadowCalc();
displayCursorShadow();

//calculate moon position