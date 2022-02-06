/** 
* @file module.exports of the whole set of capabilities, plus a few useful functions to convert between {lat,lng}, {latitude,longitude}, LatLng()
* @author devbab
*/

/*global google */

function geo2Short(coord) {
    if (typeof coord !== "object") throw new Error(`Not an object`);

    if (Object.prototype.hasOwnProperty.call(coord, "latitude") && Object.prototype.hasOwnProperty.call(coord, "longitude")) return { lat: coord.latitude, lng: coord.longitude };

    // before test of lat lng, as it has also these 2 fields
    if (typeof google !== "undefined" && coord instanceof google.maps.LatLng) return { lat: coord.lat(), lng: coord.lng() };

    if (Object.prototype.hasOwnProperty.call(coord, "lat") && Object.prototype.hasOwnProperty.call(coord, "lng")) return coord;


    throw new Error(`unknown format for object`);
}


function geo2Long(coord) {
    if (typeof coord !== "object") throw `Can't convert ${coord}`;

    // before test of lat lng, as it has also these 2 fields
    if (typeof google !== "undefined" && coord instanceof google.maps.LatLng) return { latitude: coord.lat(), longitude: coord.lng() };

    if (Object.prototype.hasOwnProperty.call(coord, "lat") && Object.prototype.hasOwnProperty.call(coord, "lng")) return { latitude: coord.lat, longitude: coord.lng };

    if (Object.prototype.hasOwnProperty.call(coord, "latitude") && Object.prototype.hasOwnProperty.call(coord, "longitude")) return coord;

    throw new Error(`unknown format for object`);
}


function geo2LatLng(coord) {
    if (typeof google === "undefined") throw new Error(`google.maps.LatLng is not defined`);

    if (typeof coord !== "object") throw `Can't convert ${coord}`;

    if (Object.prototype.hasOwnProperty.call(coord, "lat") && Object.prototype.hasOwnProperty.call(coord, "lng")) return new google.maps.LatLng(coord.lat, coord.lng);

    if (Object.prototype.hasOwnProperty.call(coord, "latitude") && Object.prototype.hasOwnProperty.call(coord, "longitude")) return new google.maps.LatLng(coord.latitude, coord.longitude);

    throw new Error(`unknown format for object`);
}


module.exports = {
    ml: require("./map-layer.js"),
    sm: require("./smart-marker.js"),
    zc: require("./zoom-center.js"),
    geo2Short, geo2Long, geo2LatLng
};