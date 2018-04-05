// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map').setView([34.0522, -118.2437], 11);

// Add base layer
L.tileLayer('https://api.mapbox.com/styles/v1/lkelkar/cjdxtuyqj184b2spcn6und3ji/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGtlbGthciIsImEiOiJjajluZDh1N200dXplMnFwYXJyYmhncnJuIn0.DsDJNMlXoTYQXVP391utBA', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'apikey',
  username: 'lkelkar'
});

// Initialze source data
var source = new carto.source.SQL('SELECT * FROM la_redlines');

// Create style for the data
var style = new carto.style.CartoCSS(`
  #layer {
    polygon-fill: ramp([holcgrade], (#008000, #0000FF, #FFFF00, #FF0000), ("A", "B", "C", "D"), "=");
    polygon-opacity: 0.8;
  }
  #layer::outline {
    line-width: 1;
    line-color: #FFFFFF;
    line-opacity: 0.5;
  }
`);

// Add style to the data
var layer = new carto.layer.Layer(source, style);

// Add the data to the map as a layer
client.addLayer(layer);
client.getLeafletLayer().addTo(map);

// Step 1: Find the dropdown by class. If you are using a different class, change this.
var layerPicker = document.querySelector('.layer-picker');

// Step 2: Add an event listener to the dropdown. We will run some code whenever the dropdown changes.
layerPicker.addEventListener('change', function (e) {
  // The value of the dropdown is in e.target.value when it changes
  var holcgrade = e.target.value;
  
  // Step 3: Decide on the SQL query to use and set it on the datasource
  if (holcgrade === 'all') {
    // If the value is "all" then we show all of the features, unfiltered
    source.setQuery("SELECT * FROM la_redlines");
  }
  else {
    // Else the value must be set to a life stage. Use it in an SQL query that will filter to that life stage.
    source.setQuery("SELECT * FROM la_redlines WHERE holcgrade = '" + holcgrade + "'");
  }
  
  // Sometimes it helps to log messages, here we log the lifestage. You can see this if you open developer tools and look at the console.
  console.log('Dropdown changed to "' + holcgrade + '"');
});