//Build your base url USGS GeoJSON Feed
var base_url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'


function createMagnitude(mag) {
  return mag *20000;
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
      return "#8B0000"
  };
};

// Perform a GET request to the query URL
d3.json(base_url, function(data) {

  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

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

  // Send earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  var streetlayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  // Define map layers
  var satelitelayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 525,
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

//Assign baseMaps layer to hold Satellite Map layer & Dark Map Layer
  var baseMaps = {
    "Street Map": streetlayer,
    "Satellite Map": satelitelayer,
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
    zoom: 3.5,
    layers: [streetlayer, earthquakes]
  });

//Create a layer control and pass in the different layers
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
    
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [0, 1, 2, 3, 4, 5];
    var colors=["#FFFF00", "#7CFC00", "#ADFF2F", "#FF4500", "#FF0000", "#8B0000"]

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + colors[i] + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
  };
  
  legend.addTo(myMap);

}

