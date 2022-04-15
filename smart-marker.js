/** 
* @file extended marker capabilities
* @author devbab
*/
'use strict';

const ml = require("./map-layer.js");

/* global google */

// for marker using unique infowindow
let _uniqueInfoWindow = new google.maps.InfoWindow();


/**
 * 
 * @param {Object} settings        - settings to apply
 * @param {Object} settings.position    - Mandatory {lat,lng} or {latitude,longitude}
 * @param {google.map} settings.map     - Optional,instance of google.map where to display marker immediately
 * @param {URL} settings.url            - Optional. url of the icon.   
 * @param {String} settings.title       - Optional title of the marker. appears when cursor stays on marker
 * @param {Object} settings.drag        - {callback,payload}. if non null, marker is draggable and callback is called when drag ends: callback(coord,payload)
 * @param {Object} settings.click        - {callback,payload}. if non null, callback is called when clicks: callback(coord,payload)
 * @param {Object} settings.infowindow  - {unique,payload} optional. if defined, a click on marker shows an infowindow with payload. if unique = true, the same infowindow is used for all markers. 

 * @returns an instance of google.maps.Marker
 */

function add(settings) {

    if (!settings) return null;

    // both location and positions are identical
    if (settings.location) settings.position = settings.location;
    if (!settings.position) throw `no coordinates provided for smart-marker`;


    // convert form latitude,longitude if needs be
    if (settings.position.latitude)
        settings.position = { lat: settings.position.latitude, lng: settings.position.longitude, }

    let params = {
        map: settings.map,
        label: settings.label,
        title: settings.title,
        zIndex: settings.zIndex,
        position: settings.position,
        draggable: settings.drag ? true : false
    };

    // add optional icon
    if (settings.url) params.icon = { url: settings.url };

    const marker = new google.maps.Marker(params);
    marker._sm = {}; //store our own data

    if (settings.drag?.callback) {
        marker.addListener("dragend", () => { settings.drag.callback(marker.getPosition(), settings.drag.payload); });
    }

    // if content for infowindow, create click callback
    if (settings.infowindow) {
        marker._sm.iwContent = settings.infowindow.payload;
        marker.addListener("click", () => {
            //showing on same infowindow or separate ones ?
            const iw = settings.infowindow.unique ? _uniqueInfoWindow : new google.maps.InfoWindow();
            marker._sm.iw = iw;
            iw.setContent(marker._sm.iwContent);
            iw.open(marker.getMap(), marker);
        });
    }

    // if callback for click
    if (settings.click?.callback) {
        marker._sm.clickPayload = settings.click.payload;
        marker.addListener("click", () => { settings.click.callback(marker.getPosition(), marker._sm.clickPayload); });
    }

    // add to layer if present
    if (settings.layer)
        ml.add(marker, settings.layer);

    return marker;
}


/**
 * Update the marker with different values put into options
 * @param {Marker} marker 
 * @param {Object} options 
 */
function update(marker, options) {

    if (options.position) {
        let position = options.position;
        if (position.latitude) position = { lat: position.latitude, lng: position.longitude };
        marker.setPosition(position);
    }

    if (options.url) marker.setIcon(options.url);
    if (options.title) marker.setTitle(options.title);
    if (options.zIndex) marker.setZIndex(options.zIndex);

    if (options.infowindowContent) marker._sm.iwContent = options.infowindowContent;


}



module.exports = {
    add,
    update,
};