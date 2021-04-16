//Build your base url USGS GeoJSON Feed
var base_url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'


function createMagnitude(mag) {
  return mag *3500;
}

function mapcolors(mag) {
  if (mag <= 1) {
    return "#FFFF00"}
    else if(mag <= 2) {
      return "#7CFC00"}
    else if(mag <= 3) {
      return "#ADFF2F"}
    else if(mag <= 4) {
      return "#FF4500"}
    else if(mag <= 5) {
      return "#FF0000"
  } else {
      return "FF0000"
  };
};

// Perform a GET request to the query URL
d3.json(base_url, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function (feature, layer){
      layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<p> Magnitude:" + feature.properties.mag + "</p>")},
            pointToLayer: function (feature, latlng) {
        return new L.circle(latlng,
          {radius: createMagnitude(feature.properties.mag),
          fillColor: mapcolors(feature.properties.mag),
          fillOpacity: 0.5,
          stroke: false
        })
      }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var satelitelayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  var darklayer = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": satelitelayer,
    "Dark Map": darklayer
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [satelitelayer, earthquakes]
  });


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}