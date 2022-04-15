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
    if (typeof layerName !== "string") throw (`layer name should be a string`)

    let _layer = TheList.get(layerName);
    if (!_layer)
        TheList.set(layerName, [object]);
    else
        _layer.push(object);
}


/**
 * get array of names matching the name which is string or RegExp
 * @param {*} name 
 * @returns 
 */
function _getLayersName(name) {

    // name is not a regexp, return simply the name if found in TheList
    if (typeof name == "string")
        if (TheList.has(name)) return [name];
        else return null;


    let layersName = Array.from(TheList.keys())
        .filter(layerName => {
            return layerName.match(name);
        });

    return layersName;
}


/**
 * return array of layers entries
 * @param {string | regexp} name name/regex of the layer
 * @return array of layer name
 */
function _getLayersContentFromName(name) {

    let listNames = _getLayersName(name);
    if (!listNames) return null;

    const list = listNames.map(name => TheList.get(name));
    return list;

}

/**
 * Show all items in the layer
 * @param {map.google} map - google.map element on which to show the layer
 * @param {String} layer - layer name
 */
function show(map, layerName) {

    const layers = _getLayersContentFromName(layerName); //return list of Map entries that match layer name
    if (!layers) return;

    layers.forEach(layer => {
        if (!layer) return;
        layer.forEach(e => { e.setMap(map) })
    })

}

/**
 * Show the layer as a clustered layer
 * @param {google.map} map  map on which to show the layer
 * @param {String} layer layer name
 */
function showCluster(map, layerName = null) {
    if (typeof name !== "string") throw (`layername is not a string`)

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
 * Empty the layer(s)
 * @param {String} layer - name of layer ot empty
 */
function empty(name) {

    let listNames = _getLayersName(name);

    listNames.forEach(name => {
        const layerContent = TheList.get(name);
        layerContent.forEach(e => { e.setMap(null) }); // hide each element

        TheList.delete(name); // delete the entry
    });

}

/**
 *  returns an array of list of elements
 * @param {string | regexp} layer - layer name
 * @returns list of list of elements
 */
function list(layerName) {
    return _getLayersContentFromName(layerName); //return list of Map entries that match layer name

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