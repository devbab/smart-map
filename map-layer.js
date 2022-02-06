/** 
* @file manages layers for Google Maps, including Clusters
* @author devbab
*/
'use strict';

const { MarkerClusterer } = require("@googlemaps/markerclusterer");

// https://developers.google.com/maps/documentation/javascript/marker-clustering?hl=es

let TheList = new Map();
let TheCluster = null;
let TheClusterLayerName = null; // name of layer used for cluser


// add an object in a list, with associated layer
function add(object, layerName = null) {
    let _layer = TheList.get(layerName);
    if (!_layer)
        TheList.set(layerName, [object]);
    else
        _layer.push(object);
}


/**
 * Show all items in the layer
 * @param {map.google} map - google.map element on which to show the layer
 * @param {String} layer - layer name
 */
function show(map, layerName = null) {

    const _layer = TheList.get(layerName);
    if (!_layer) return;
    _layer.forEach(e => { e.setMap(map) })
}

/**
 * Show the layer as a clustered layer
 * @param {google.map} map  map on which to show the layer
 * @param {String} layer layer name
 */
function showCluster(map, layerName = null) {
    const _layer = TheList.get(layerName);
    if (!_layer) return;

    // empty if existing
    if (TheCluster) TheCluster.clearMarkers();

    // Add a marker clusterer to manage the markers.
    TheCluster = new MarkerClusterer({
        markers: _layer,
        map
    });

    TheClusterLayerName = layerName;
}

function emptyCluster() {
    if (TheCluster) {
        //       console.log("empty Cluster");
        TheCluster.clearMarkers();
        empty(TheClusterLayerName); // delete also markers in the list
        TheClusterLayerName = null;
    }
}



/**
 * Hide the layer
 * @param {String} layer  name of the layer
 */
function hide(layer = null) {
    show(null, layer);
}

/**
 * Empty the layer
 * @param {String} layer - name of layer ot empty
 */
function empty(layerName = null) {
    hide(layerName); // not visible anymore
    TheList.set(layerName, []);
}

/**
 * 
 * @param {*} layer - layer name
 * @returns returns all elements in the layer
 */
function list(layerName) {
    return TheList.get(layerName);
}


module.exports = {
    show: show,
    hide: hide,
    empty: empty,
    add: add,
    list: list,
    showCluster: showCluster,
    emptyCluster: emptyCluster
};