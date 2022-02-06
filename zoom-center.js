/** 
* @file Keep track of Map center/zoom and store it in LocalStorage
* Handles GeoLocation too
* @author devbab
*/
/* global localStorage, navigator */

"use strict";
let _prefix, _center, _zoom, _map;

/**
 * will create default values if not existing opr oincorrect
 * 
 * @param {Object} options  default options
 * @param {string} options.name  default prefix to store localStorage variables 
 * @param {number} options.zoom  default zoom
 * @param {Object} options.center  default center {lat,lng}
 * @param {Boolean} options.geolocation  true if geolocation requested
 * 
 */
function init(options) {
    _prefix = options?.name ? options.name : "";

    _zoom = parseInt(localStorage.getItem(`${_prefix}zoom`));

    try { _center = JSON.parse(localStorage.getItem(`${_prefix}center`)); }
    catch (e) {    /* empty */ }

    // a bit of basic type/content checking
    if (!_center
        || typeof (_center) !== "object"
        || !Object.prototype.hasOwnProperty.call(_center, "lat")
        || !Object.prototype.hasOwnProperty.call(_center, "lng")
    )
        _center = options.center;
    if (!_zoom || _zoom <= 0 || typeof (_zoom) !== "number") _zoom = options.zoom;


    setLocalStorage(_zoom, _center);


    // if options.geolocation =true, get user locaziton and center map accordingly
    if (options?.geolocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            if (_map) _map.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        });
    }


}


function zoom() {
    return parseInt(localStorage.getItem(`${_prefix}zoom`));
}

function center() {
    return JSON.parse(localStorage.getItem(`${_prefix}center`))
}

function setLocalStorage(zoom, center) {
    localStorage.setItem(`${_prefix}zoom`, zoom);
    localStorage.setItem(`${_prefix}center`, JSON.stringify(center));
}

/**
 * track change of map boundary in the map and write in in localStorage
 * if geolocation available, pan to the location
 * 
 * @param {Object} map - map to track 
 */
function track(map) {
    _map = map;
    // map boundaries have changed, store the new center/zoom
    map.addListener("bounds_changed", () => {
        setLocalStorage(map.getZoom(), map.getCenter().toJSON())
    });
}


module.exports = {
    init,
    zoom,
    center,
    track
}