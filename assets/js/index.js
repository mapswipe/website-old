!function(){function e(t,o,r){function a(n,i){if(!o[n]){if(!t[n]){var p="function"==typeof require&&require;if(!i&&p)return p(n,!0);if(s)return s(n,!0);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}var l=o[n]={exports:{}};t[n][0].call(l.exports,function(e){return a(t[n][1][e]||e)},l,l.exports,e,t,o,r)}return o[n].exports}for(var s="function"==typeof require&&require,n=0;n<r.length;n++)a(r[n]);return a}return e}()({1:[function(e,t,o){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(o,"__esModule",{value:!0});var a=function(){function e(e,t){for(var o=0;o<t.length;o++){var r=t[o];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,o,r){return o&&e(t.prototype,o),r&&e(t,r),t}}(),s=function(){function e(t){r(this,e),this.root=t,this.bindEvents()}return a(e,[{key:"toggleNav",value:function(e){var t=e.currentTarget,o=e.currentTarget.parentNode.parentNode;o.classList.contains("active")?this.closeNav(t,o):this.openNav(t,o)}},{key:"openNav",value:function(e,t){t.classList.add("active"),e.classList.add("active"),document.querySelector("body").classList.add("menu-active")}},{key:"closeNav",value:function(e,t){t.classList.remove("active"),e.classList.remove("active"),document.querySelector("body").classList.remove("menu-active")}},{key:"bindEvents",value:function(){this.root.addEventListener("click",this.toggleNav.bind(this))}}]),e}();o.default=s},{}],2:[function(e,t,o){"use strict";function r(){var e=L.control({position:"topright"});e.onAdd=function(e){var t=L.DomUtil.create("div","info legend");return t.innerHTML+='<i style="background:orange"></i>active<br>',t.innerHTML+='<i style="background:blue"></i>finished<br>',t.innerHTML+='<i style="background:grey"></i>inactive<br>',t},e.addTo(n)}function a(e){var t=$.ajax({url:e,dataType:"json",success:console.log("mapswipe project centroids data successfully loaded."),error:function(e){alert(e.statusText)}});$.when(t).done(function(){var e={radius:6,fillColor:"grey",color:"white",weight:1,opacity:1,fillOpacity:.8},o=L.geoJSON(t.responseJSON,{pointToLayer:function(t,o){return L.circleMarker(o,e)}});o.setStyle(function(e){return"active"==e.properties.status?{fillColor:"orange",color:"black",radius:9}:"finished"==e.properties.status?{fillColor:"blue"}:"inactive"==e.properties.status?{fillColor:"grey"}:void 0}).addTo(n),o.bindPopup(function(e){return'<a href="project.html?projectId='+e.feature.properties.project_id+'">'+e.feature.properties.name+"</a>"}),n.fitBounds(o.getBounds()),s(t.responseJSON);for(var r=t.responseJSON.features.filter(function(e){return"finished"==e.properties.status|"archived"==e.properties.status}),a=0,i=0;i<r.length;i++){var p=parseFloat(r[i].properties.area_sqkm);p>0&&(a+=p)}document.getElementById("stats-finished-projects").innerHTML=r.length,document.getElementById("stats-mapped-area").innerHTML=(1e3*parseInt(a/1e3)).toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")})}function s(e){console.log("added projects");var t=document.getElementById("projectsTable").getElementsByTagName("tbody")[0];e.features.forEach(function(e){var o=t.insertRow(),r=document.createElement("td");r.innerHTML='<a href="project.html?projectId='+e.properties.project_id+'">'+e.properties.name+"</a>",o.appendChild(r),r=document.createElement("td"),r.innerHTML=e.properties.status,o.appendChild(r),r=document.createElement("td"),e.properties.progress>0?r.innerHTML=Math.round(100*e.properties.progress)+"%":r.innerHTML="not available",o.appendChild(r),r=document.createElement("td"),parseInt(e.properties.number_of_users)>0?r.innerHTML=e.properties.number_of_users:r.innerHTML="not available",o.appendChild(r)}),$("#projectsTable").DataTable(),$(".dataTables_length").addClass("bs-select")}var n;o.initMap=function(){n=L.map("map").setView([0,0],2),L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",{attribution:'Map tiles by <a href="https://carto.com/">Carto</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0.</a> Data by <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, under ODbL.',subdomains:["a","b","c"]}).addTo(n),console.log("added map");setTimeout(function(){n.invalidateSize()},400),a("https://apps.mapswipe.org/api/projects/projects_centroid.geojson"),r()}},{}],3:[function(e,t,o){"use strict";function r(e){var t=window.location.search.substring(1);console.log(t);for(var o=t.split("&"),r=0;r<o.length;r++){var a=o[r].split("=");if(a[0]==e)return a[1]}return!1}function a(){u=L.map("map").setView([0,0],2),L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",{attribution:'Map tiles by <a href="https://carto.com/">Carto</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0.</a> Data by <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, under ODbL.',subdomains:["a","b","c"]}).addTo(u),console.log("added map"),setTimeout(function(){u.invalidateSize()},400);var e=L.control({position:"bottomleft"});e.onAdd=function(e){var t=L.DomUtil.create("div","info legend");return t.innerHTML+='<i style="background:orange"></i>active<br>',t.innerHTML+='<i style="background:blue"></i>finished<br>',t.innerHTML+='<i style="background:grey"></i>inactive<br>',t},e.addTo(u)}function s(e,t){var o=$.ajax({url:e,dataType:"json",success:console.log("mapswipe project centroids data successfully loaded."),error:function(e){alert(e.statusText)}});$.when(o).done(function(){var e={radius:6,fillColor:"grey",color:"white",weight:1,opacity:1,fillOpacity:.8},r=L.geoJSON(o.responseJSON,{pointToLayer:function(t,o){return L.circleMarker(o,e)}});r.setStyle(function(e){return"active"==e.properties.status?{fillColor:"orange",color:"black",radius:9}:"finished"==e.properties.status?{fillColor:"blue"}:"inactive"==e.properties.status?{fillColor:"grey"}:void 0}).addTo(u),r.bindPopup(function(e){return'<a href="project.html?projectId='+e.feature.properties.project_id+'">'+e.feature.properties.name+"</a>"});var a=o.responseJSON.features.filter(function(e){return e.properties.project_id==t})[0].properties;document.getElementById("project-info-name").innerHTML=a.name,document.getElementById("project-info-status").innerHTML=a.status,document.getElementById("project-info-description").innerHTML=a.project_details,document.getElementById("project-info-progress").innerHTML=parseInt(Math.round(100*a.progress)),document.getElementById("project-info-contributors").innerHTML=a.number_of_users,document.getElementById("project-info-area").innerHTML=parseInt(a.area_sqkm).toString().replace(/\B(?=(\d{3})+(?!\d))/g," "),n("https://apps.mapswipe.org/api/project_geometries/project_geom_"+t+".geojson",t,a)})}function n(e,t,o){var r=$.ajax({url:e,dataType:"json",success:console.log("mapswipe project centroids data successfully loaded."),error:function(e){alert(e.statusText)}});$.when(r).done(function(){var e={fillColor:"grey",color:"white",weight:1,opacity:1,fillOpacity:.4},a=L.geoJSON(r.responseJSON,{style:e});a.setStyle(function(e){var r;switch(o.status){case"active":r={fillColor:"orange",color:"black"};break;case"finished":r={fillColor:"blue"};break;case"archived":case"inactive":r={fillColor:"grey"}}return e.properties.project_id==t&&(r.color="black",r.weight=3),r}).addTo(u),u.fitBounds(a.getBounds()),console.log("zoomed to feature"),a.bindPopup(function(e){return'<a href="project.html?projectId='+t+'">'+o.name+"</a>"})})}function i(e){var t=[{name:"Aggregated Results",url:"https://apps.mapswipe.org/api/agg_results/agg_results_"+e+".csv.gz",description:'Aggregated Results. This gives you the unfiltered MapSwipe results aggregated on the task level. This is most suited if you want to apply some custom data processing with the MapSwipe data, e.g. select only specific tasks. Check our <a href="https://mapswipe-workers.readthedocs.io/en/master/data.html#aggregated-results">documentation</a> for more details. (Note that you need to unzip this .gz file before you can use it.)',datatype:"CSV"},{name:"Aggregated Results (with Geometry)",url:"https://apps.mapswipe.org/api/agg_results/agg_results_"+e+"_geom.geojson.gz",description:'Aggregated Results. This gives you the unfiltered MapSwipe results aggregated on the task level. This is most suited if you want to apply some custom data processing with the MapSwipe data, e.g. select only specific tasks. Check our <a href="https://mapswipe-workers.readthedocs.io/en/master/data.html#aggregated-results">documentation</a> for more details. (Note that you need to unzip this .gz file before you can use it.)',datatype:"GeoJSON"},{name:"HOT Tasking Manager Geometries",url:"https://apps.mapswipe.org/api/hot_tm/hot_tm_"+e+".geojson",description:'This dataset contains shapes that are ready to use in the HOT Tasking Manager. Currently, the geometries consist of maximum 15 MapSwipe Tasks, where at least 35% of all users indicated the presence of a building by classifying as "yes" or "maybe"',datatype:"GeoJSON"},{name:"Moderate to High Agreement Yes Maybe Geometries",url:"https://apps.mapswipe.org/api/yes_maybe/yes_maybe_"+e+".geojson",description:'This dataset contains all results where at least 35% of users submitted a "yes" or "maybe" classification. The output dataset depicts the union of all selected results.',datatype:"GeoJSON"},{name:"Groups",url:"https://apps.mapswipe.org/api/groups/groups_"+e+".csv.gz",description:"Groups. (Note that you need to unzip this .gz file before you can use it.)",datatype:"CSV"},{name:"History",url:"https://apps.mapswipe.org/api/history/history_"+e+".csv",description:"History",datatype:"CSV"},{name:"Results",url:"https://apps.mapswipe.org/api/results/results_"+e+".csv.gz",description:"This gives you the unfiltered MapSwipe results. (Note that you need to unzip this .gz file before you can use it.)",datatype:"CSV"},{name:"Tasks",url:"https://apps.mapswipe.org/api/tasks/tasks_"+e+".csv.gz",description:"Tasks. (Note that you need to unzip this .gz file before you can use it.)",datatype:"CSV"},{name:"Users",url:"https://apps.mapswipe.org/api/users/users_"+e+".csv.gz",description:"This dataset contains information on the individual contributions per user. This tells you for instance the most active users of this project. (Note that you need to unzip this .gz file before you can use it.)",datatype:"CSV"},{name:"Area of Interest",url:"https://apps.mapswipe.org/api/project_geometries/project_geom_"+e+".geojson",description:"This dataset contains information on the project region.",datatype:"GeoJSON"}],o=document.getElementById("projectDataTable").getElementsByTagName("tbody")[0];t.forEach(function(t){var r=o.insertRow(),a=document.createElement("td");a.innerHTML=e,r.appendChild(a),a=document.createElement("td"),a.innerHTML=t.name,r.appendChild(a),a=document.createElement("td"),a.innerHTML=t.datatype,r.appendChild(a),a=document.createElement("td"),a.innerHTML=t.description,r.appendChild(a),a=document.createElement("td"),a.innerHTML='<a href="'+t.url+'" target="_blank">Download</a>',r.appendChild(a)})}function p(e,t,o){Plotly.d3.csv(e,function(e){c(e,t,o)})}function c(e,t,o){for(var r=[],a=[],s=0;s<e.length;s++){var n=e[s];r.push(n.day),a.push(100*n[o])}l(r,a,t,o)}function l(e,t,o,r){var a=(document.getElementById("plot"),[{x:e,y:t}]);if("cum_progress"==r)var s={autosize:350,height:350,margin:{l:40,r:40,b:40,t:60,pad:4},yaxis:{range:[0,101]},title:{text:"Progress [%]"}};else var s={};Plotly.newPlot(r,a,s,{displayModeBar:!1})}var u;o.initAnalyticsProject=function(){var e=r("projectId").toString();console.log(e),a();var t="https://apps.mapswipe.org/api/projects/projects_centroid.geojson";s(t,e),t="https://apps.mapswipe.org/api/history/history_"+e+".csv",p(t,e,"cum_progress"),i(e)}},{}],4:[function(e,t,o){"use strict";function r(e,t){t.forEach(function(t){e.classList.remove(t)})}function a(){var e=document.body.clientWidth,t="default";return e>=1344&&(t="desktop-wide"),e<1344&&(t="desktop-compact"),e<1024&&(t="tablet-portrait"),e<768&&(t="mobile-landscape"),e<481&&(t="mobile-portrait"),r(d,["default","desktop-compact","tablet-portrait","mobile-landscape","mobile-portrait"]),d.classList.add(t),t}function s(){return"ontouchstart"in window||"onmsgesturechange"in window?(d.classList.add("touchenabled"),!0):(d.classList.remove("touchenabled"),!1)}function n(){var e="desktop";switch(a()){case"desktop-compact":e="desktop",s()&&(e="tablet");break;case"tablet-portrait":e="tablet";break;case"mobile-landscape":case"mobile-portrait":e="mobile"}return r(d,["mobile","tablet","tablet-portrait","desktop"]),d.classList.add(e),e}function i(){n(),a();g=!!d.classList.contains("mobile")}var p=e("./components/navigation.js"),c=function(e){return e&&e.__esModule?e:{default:e}}(p),l=e("./components/overviewStats.js"),u=e("./components/projectStats.js"),d=document.querySelector("html"),g=!1,m=void 0;if(d.classList.contains("mobile")&&(g=!0),d.querySelector("#year")){var f=new Date;d.querySelector("#year").innerHTML=f.getFullYear()}d.querySelector(".burger-menu")&&new c.default(d.querySelector(".burger-menu")),a(),n(),s(),window.addEventListener("resize",function(){clearTimeout(m),m=setTimeout(i,500)}),window.initMap=l.initMap,window.initAnalyticsProject=u.initAnalyticsProject},{"./components/navigation.js":1,"./components/overviewStats.js":2,"./components/projectStats.js":3}]},{},[4,2,3]);
//# sourceMappingURL=index.js.map
