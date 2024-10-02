// var SunCalc = require('./suncalc');

function displaySunInfo() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {

    const latitude = position.coords.latitude; 
    const longitude = position.coords.longitude;

    //// calculates sun position for a given date and latitude/longitude. SunCalc.getTimes = function (date, lat, lng, height)
    const times = SunCalc.getTimes(new Date(), latitude, longitude);

    // calculates sun position for a given date and latitude/longitude. SunCalc.getPosition = function (date, lat, lng) {
    const sunPosition = SunCalc.getPosition(new Date(), latitude, longitude);

    //calculates shadowAngle using Azimuth for direction of shadow
    const azimuth = sunPosition.azimuth;
    azimuth.textContent = azimuth.toFixed(4);

    const altitude = sunPosition.altitude;
    altitude.textContent = altitude.toFixed(4);

    const shadowAngle = (azimuth * (180 / Math.PI) + 180) % 360; //convert radians to degrees

    // calculate shadowLength based on altitude
    const shadowLength = 1 / Math.tan(altitude);

    // Display shadow angle and length
    document.getElementById('shadowAngle').textContent = shadowAngle.toFixed(2);
    document.getElementById('shadowLength').textContent = shadowLength.toFixed(2);

    //format times
    const sunrise = times.sunrise.toLocaleTimeString();
    const sunset = times.sunset.toLocaleTimeString();
    document.getElementById("sunrise").textContent = sunrise;
    document.getElementById("sunset").textContent = sunset;
        });
};
}


displaySunInfo();
//calculate moon position