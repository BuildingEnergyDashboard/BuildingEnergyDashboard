/**
 * Building energy Dashboard
 * v 1.3
 */

/**
 * checkboxStates is a 2D array that holds the status of checkboxes on the page
 */
 let checkboxStates
 /**
 * marker_colors is an array of 5 color values that represent energy star status. The first
 * four represents the color value for 1 through 100 in increments of 25, and the last value holds
 * the color for null values.
  */
 let marker_colors = ["#1a9641", "#a6d96a", "#ffffbf", "#fdae61", "#d7191c"]
 /**
 * L.map setview centers the map to a longitude and latitude and sets the level of zoom
 */
 const map = L.map('map').setView([28.5411, -81.37299], 12);
 /**
 * L.titleLayer Used to load and display tile layers on the map.
 * There are many options to choose from.
 */
 L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 }).addTo(map);
 /*
 *  Gets the data from the city and puts in The variable orlandoBuildingEnergyData
  */
 let orlandoBuildingEnergyData = getJson("https://data.cityoforlando.net/resource/f63n-kp6t.geojson");
 /*
 * Create a template layer to add data to filter and format
  */
 var geojsonLayer = L.geoJSON(null, {
     //Filter compares items that are checked with data features items.
     filter: (feature,layer) => {
       const isPrimary_useChecked = checkboxStates.primary_us.includes(feature.properties.primary_us)
       const isEnergyStarRatingChecked = checkboxStates.energyStarRating.includes(getEnergyStarRange(feature.properties.energy_sta))
       if(isPrimary_useChecked && isEnergyStarRatingChecked){ console.log("Count")};
       return isPrimary_useChecked && isEnergyStarRatingChecked //only true if both are true
     },
     // OnEachFeature adds popups with data.
     onEachFeature: function (feature, layer) {
     // OnEachFeature adds popups with data.
     layer.bindPopup
       (
                    feature.properties.property_n
                     + '<p><b> Address:    ' + feature.properties.property_a + '</b></p>'
                     + '<p><b> Energy_sta: ' + feature.properties.energy_sta + '</b></p>'
                     + '<p><b> Site_energ: ' + feature.properties.site_energ + '</b></p>'
                     + '<p><b> Year:       ' + feature.properties.year + '</b></p>'
                     + '<button onclick="myCompareBld(\''
                     + feature.properties.property_n + '\',\''
                     + feature.properties.property_a + '\', \''
                     + feature.properties.energy_sta + '\', \''
                     + feature.properties.site_energ + '\')">Compare Property</button>'
                     + '<button onclick="resetCompare(\'' + '\')">Reset Compare</button>'

       );
     },
     // PointToLayer adds circles and getMarkerColor adds the appropriate color based on energy star ratings.
     pointToLayer: function (feature, latlng) {
       return L.circleMarker(latlng, {
         radius: getEnergyStarRangesize(feature.properties.energy_sta),
         opacity: 1.8,
         color: getMarkerColor(feature.properties.energy_sta),
         fillOpacity: .61
     });
   }
 }
 )
 // geojsonLayer.addTo(map) Adds a layer to the map.
 geojsonLayer.addTo(map)
 // Defines the legend for the map and adds the marker colors
 var legend = L.control({ position: 'bottomleft' });
 legend.onAdd = function (map) {
   var div = L.DomUtil.create("div", "legend");
   div.innerHTML = '<div><b>Energy Star Rating<b></div>';
   div.innerHTML += '<i style="background: ' + marker_colors[0] + '"></i><span>76-100</span><br>';
   div.innerHTML += '<i style="background: ' + marker_colors[1] + '"></i><span>51-75</span><br>';
   div.innerHTML += '<i style="background: ' + marker_colors[2] + '"></i><span>26-50</span><br>';
   div.innerHTML += '<i style="background: ' + marker_colors[3] + '"></i><span>0-25</span><br>';
   div.innerHTML += '<i style="background: ' + marker_colors[4] + '"></i><span>Not Rated</span><br>';
   return div;
 };
 // Adds legend to map.
 legend.addTo(map);
 /**
 * Function that updates the array used to track whether a check box is checked or not by
 * looping though the (DOM) Document Object Model.
 */
 function updateCheckboxStates() {
   checkboxStates = {
     primary_us: [],
     energyStarRating: []
   }
 //console.log("update checkbox state")
   for (let input of document.querySelectorAll('input')) {
     if(!input.checked&&input.className=='primary_us'){document.getElementById('selectAllCat').checked =false; }
     if (input.checked) {
       switch (input.className) {
         case 'primary_us': checkboxStates.primary_us.push(input.value); break
         case 'energyStarRating': checkboxStates.energyStarRating.push(input.value); break
       }
     }
   }
 }
 /**
 * Function that set all primary_use check boxes to check or un checked.
 * @param    {object}      selectAllCat checkbox
 */
function selectAllCat(source){
  var clist=document.getElementsByClassName("primary_us");
  for (var i = 0; i < clist.length; ++i) {
    clist[i].checked = source.checked;
  }
  mapUpdate();
}
 /**
 * Function that returns a color based on Energy Star Ratings
 * @param    {int}      x   Energy Star Rating
 * @return   {String}       Color from arker_colors array
 */
 function getMarkerColor(x) {
   if (x > 0 && x <= 25)
     return marker_colors[3];
   else if (x > 25 && x <= 50)
     return marker_colors[2];
   else if (x > 50 && x <= 75)
     return marker_colors[1];
   else if (x > 75 && x <= 100)
     return marker_colors[0];
   else
     return marker_colors[4];
 }
 /**
 * Function that returns a color based on Energy Star Ratings
 * @param    {int}      x   Energy Star Rating
 * @return   {String}       Code used in the check boxes for the energy star rating range.
 */
  function getEnergyStarRange(x) {
   if (x > 0 && x <= 25)
     return "esr0_25";
   else if (x > 25 && x <= 50)
     return "esr26_50";
   else if (x > 50 && x <= 75)
     return "esr51_75";
   else if (x > 75 && x <= 100)
     return "esr76_100";
   else
     return "null";
 }
  /**
 * Function that returns a number for circle marker size based on Energy Star Ratings
 * @param    {int}      x   Energy Star Rating
 * @return   {String}       Returns a number between 6 and 12.
 */
 function getEnergyStarRangesize(x) {
   if (x > 0 && x <= 25)
     return "6";
   else if (x > 25 && x <= 50)
     return "10";
   else if (x > 50 && x <= 75)
     return "11";
   else if (x > 75 && x <= 100)
     return "12";
   else
     return 5;
 }

 /**
 * Function takes a URL and returns a JSON file.
 * @param    {url}      x   Url of the data.
 * @return   {json}         JSON file.
 */
 async function getJson(url) {
   try {
     let response = await fetch(url);
     let data = await response.json();
     return data;
   }
   catch (error) {
     console.log(error);
   }
 }
 /*
 * Function creates a list of category checkboxes derived from the city data set.
 * Using SoQL to query the data.
 */
 async function renderPrimaryUseCat() {
   let urlcat = 'https://data.cityoforlando.net/resource/f63n-kp6t.json?$select=primary_us,count(primary_us)%20AS%20cnt&$group=primary_us&$order=cnt%20DESC'
   let primaryUseCat = await getJson(urlcat);
   let html = '';

   primaryUseCat.forEach(primaryUseCat => {
     html += '<div class= "primary_use_line_div">'
     html += '   <div class="primary_use_checkbox_div">'
     html += '      <input type="checkbox"	class="primary_us" name="' + primaryUseCat.primary_us + '" value="' + primaryUseCat.primary_us + '" onclick="mapUpdate()" checked="true";>'
     html += '   </div>'
     html += '   <div class="primary_use_label_div">'
     html += '      <label>' + primaryUseCat.primary_us + '</label>'
     html += '   </div>'
     html += '   <div class="primary_use_div_cnt">' + primaryUseCat.cnt + '</div>'
     html += '</div>'
   });
   let container_primary_use = document.querySelector('#container_primary_use');
   container_primary_use.innerHTML = html
   console.log("Primary use cat COMPLETE")
   mapUpdate();
 }
 /*
 * Function updates map and check boxes data.
 */
 function mapUpdate() {
   orlandoBuildingEnergyData.then(data => {
   geojsonLayer.clearLayers()
   updateCheckboxStates()
   console.log("Map Update")
   console.log(checkboxStates)
   geojsonLayer.addData(data)
   })
 }

var properties_to_compare = [];

function myCompareBld(name, address, e_star, s_energ) {
    var temp_property_attribute_list = [name, address, e_star, s_energ]
    properties_to_compare.push(temp_property_attribute_list);
    if (properties_to_compare.length  === 1){
        displayBuilding0();
    } else if (properties_to_compare.length  === 2){
        displayBuilding0();
        displayBuilding1();
    } else {properties_to_compare.pop();}
}

function displayBuilding0(){
    document.getElementById('compare_div0').innerHTML =
            "<br/>" +
            "<b>" + " Name: " + "</b>" + properties_to_compare[0][0] +
            "<br/>" + "<b>"+" Address: "+"</b>" +  properties_to_compare[0][1] +
            "<br/>" + "<b>"+" Energy Start Rating: "+"</b>" + properties_to_compare[0][2] +
            "<br/>" + "<b>"+" Site Energy Rating: "+"</b>" + properties_to_compare[0][3];
    document.getElementById("wrapper").style.display = "block";
}

function displayBuilding1(){
            document.getElementById('compare_div1').innerHTML =
            "<br/>" +
            "<b>" + " Name: " + "</b>" + properties_to_compare[1][0] +
            "<br/>" + "<b>"+" Address: "+"</b>" +  properties_to_compare[1][1] +
            "<br/>" + "<b>"+" Energy Start Rating: "+"</b>" + properties_to_compare[1][2] +
            "<br/>" + "<b>"+" Site Energy Rating: "+"</b>" + properties_to_compare[1][3];
}

function resetCompare(){
    properties_to_compare = [];
    document.getElementById('compare_div0').innerHTML = "";
    document.getElementById('compare_div1').innerHTML = "";
    document.getElementById("wrapper").style.display = "none";
}

 /****** INIT ******/
 renderPrimaryUseCat();
