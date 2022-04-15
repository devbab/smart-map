/** 
* @file example of how to use the various capabilities
* @author devbab
*/

// Choice of Google icons at https://fonts.google.com/icons?icon.category=maps

/* global google, document, $ */

const { ml, sm, zc, geo2Short, geo2Long, geo2LatLng } = require("./smart-map.js");

let mapgoogle;

// set default zoom center
zc.init({
    name: "test",
    zoom: 13,
    center: { lat: 48.86, lng: 2.34 },
    geolocation: true
});

/*
 *  initialise Google Map, manages the click to create the pickup/dropoff points
 */
function _initMap() {
    console.log("_initMap");


    const center = zc.center();
    const zoom = zc.zoom();
    console.log(center, zoom);
    mapgoogle = new google.maps.Map(document.getElementById("map"), {
        center,
        zoom
    });
    zc.track(mapgoogle);

    sm.add({
        map: mapgoogle,
        label: "1",
        position: { latitude: 48.85, longitude: 2.3 }
    });

    let name = "red";
    console.log(`list for ${name}  should be empty`, ml.list(name));
    name = /red/;
    console.log(`list for ${name}  should be empty`, ml.list(name));

    console.log(`adding a marker in regexp layer`);
    sm.add({
        layer: /red/,
        title: `Title`,
        position: { lat: 48.8, lng: 2.3 },

    });



    let count = 0;

    // Configure the click listener, for sake of getting click's coordinates displayed
    mapgoogle.addListener("click", (mapsMouseEvent) => {
        const coord = mapsMouseEvent.latLng.toJSON();
        console.log(coord);
        console.log("geo2Short", geo2Short(coord));
        console.log("geo2Long", geo2Long(coord));
        console.log("geo2LatLng", geo2LatLng(coord));

        sm.add({
            map: mapgoogle, // to be displayed immediately
            layer: "blue",
            title: `Title ${count}`,
            label: `${count}`,
            position: coord,
            url: "icons/place_blue_36dp.svg",
            drag: {
                callback: (pos, payload) => { console.log(`dragged to ${pos.toString()} with payload ${payload} `) },
                payload: count++
            },
            infowindow: {
                //map: mapgoogle, not needed
                unique: true,
                payload: `This is infowindow ${count} `
            }
        });



        coord.lng += 0.03;
        sm.add({
            map: mapgoogle, // to be displayed immediately
            layer: "red",
            title: `Title ${count} `,
            position: coord,
            url: "icons/place_red_36dp.svg",
        });
        const list = ml.list("red");
        console.log(`list of red`, list)

        if (list)
            list.forEach(layerList => {
                const titles = layerList.map(elt => elt.getTitle());
                console.log("red", titles);

            })


    });



    $("#hideRed").click("red", hideMarkers);
    $("#showRed").click("red", showMarkers);
    $("#hideBlue").click("blue", hideMarkers);
    $("#showBlue").click("blue", showMarkers);


    $("#showE").click(/(e)/, showMarkers);
    $("#hideE").click(/(e)/, hideMarkers);
    $("#emptyE").click(/(e)/, emptyMarkers);

    $("#showCluster").click(showCluster);
    $("#emptyCluster").click(emptyCluster);

    $("#emptyMarkers").click(emptyMarkers);

}



function showMarkers(e) {
    console.log("show", e.data);

    ml.show(mapgoogle, e.data);
}
function hideMarkers(e) {
    console.log("hide", e.data);

    ml.hide(e.data);
}

function showCluster() {
    ml.showCluster(mapgoogle, "red");
}

function emptyCluster() {
    ml.emptyCluster(mapgoogle, "red");
}

function emptyMarkers(e) {
    console.log("empty", e.data);
    ml.empty(e.data);
}

_initMap();

