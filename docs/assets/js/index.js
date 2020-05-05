(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Navigation = function () {
    function Navigation(element) {
        _classCallCheck(this, Navigation);

        this.root = element;

        this.bindEvents();
    }

    _createClass(Navigation, [{
        key: 'toggleNav',
        value: function toggleNav(e) {
            var icon = e.currentTarget;
            var mobileMenu = e.currentTarget.parentNode.parentNode;

            mobileMenu.classList.contains('active') ? this.closeNav(icon, mobileMenu) : this.openNav(icon, mobileMenu);
        }
    }, {
        key: 'openNav',
        value: function openNav(icon, mobileMenu) {
            mobileMenu.classList.add('active');
            icon.classList.add('active');
            document.querySelector('body').classList.add('menu-active');

            // mobileMenu.querySelector('.navlink:first-child').focus();
        }
    }, {
        key: 'closeNav',
        value: function closeNav(icon, mobileMenu) {
            mobileMenu.classList.remove('active');
            icon.classList.remove('active');
            document.querySelector('body').classList.remove('menu-active');
        }
    }, {
        key: 'bindEvents',
        value: function bindEvents() {
            this.root.addEventListener('click', this.toggleNav.bind(this));
        }
    }]);

    return Navigation;
}();

exports.default = Navigation;

},{}],2:[function(require,module,exports){
"use strict";

var map;

exports.initMap = function initMap() {

    var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };

    map = L.map('map').setView([0.0, 0.0], 2);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="https://carto.com/">Carto</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0.</a> Data by <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, under ODbL.',
        subdomains: ['a', 'b', 'c']
    }).addTo(map);
    console.log('added map');
    var projectCentroidsUrl = 'https://apps.mapswipe.org/api/projects/projects_centroid.geojson';
    setTimeout(function () {
        map.invalidateSize();
    }, 400);
    addGeojsonLayer(projectCentroidsUrl);

    // add legend
    addLegend();
};

function addLegend() {
    var legend = L.control({ position: 'topright' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += '<i style="background:orange"></i>active<br>';
        div.innerHTML += '<i style="background:blue"></i>finished<br>';
        div.innerHTML += '<i style="background:grey"></i>inactive<br>';
        return div;
    };
    legend.addTo(map);
}

function addGeojsonLayer(url) {
    var geojsonData = $.ajax({
        url: url,
        dataType: "json",
        success: console.log("mapswipe project centroids data successfully loaded."),
        error: function error(xhr) {
            alert(xhr.statusText);
        }
    });
    // Specify that this code should run once the county data request is complete
    $.when(geojsonData).done(function () {

        // define default point style
        var geojsonMarkerGreen = {
            radius: 6,
            fillColor: "grey",
            color: "white",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        // create geojson layer
        var layer = L.geoJSON(geojsonData.responseJSON, {
            pointToLayer: function pointToLayer(feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerGreen);
            }
        });

        // set style based on feature properties
        layer.setStyle(function (feature) {
            if (feature.properties.status == 'active') {
                return { fillColor: 'orange', color: 'black', radius: 9 };
            } else if (feature.properties.status == 'finished') {
                return { fillColor: 'blue' };
            } else if (feature.properties.status == 'inactive') {
                return { fillColor: 'grey' };
            }
        }).addTo(map);

        // add a popup
        layer.bindPopup(function (layer) {
            // popup with a link to the project page with detailed information
            popup = '<a href="project.html?projectId=' + layer.feature.properties.project_id + '">' + layer.feature.properties.name + '</a>';
            return popup;
        });

        // fit to layer extent
        map.fitBounds(layer.getBounds());

        // add data to projects table
        populateProjectsTable(geojsonData.responseJSON);

        // add overview stats
        var finishedProjects = geojsonData.responseJSON.features.filter(function (item) {
            return item['properties']['status'] == 'finished' | item['properties']['status'] == 'archived';
        });

        var mappedArea = 0.0;
        for (var i = 0; i < finishedProjects.length; i++) {
            var projectArea = parseFloat(finishedProjects[i]['properties']['area_sqkm']);
            if (projectArea > 0) {
                mappedArea += projectArea;
            }
        }

        document.getElementById('stats-finished-projects').innerHTML = finishedProjects.length;
        // convert to broken up numbers
        document.getElementById('stats-mapped-area').innerHTML = (parseInt(mappedArea / 1000) * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    });
}

function populateProjectsTable(geojsonData) {
    console.log('added projects');

    var tableRef = document.getElementById('projectsTable').getElementsByTagName('tbody')[0];

    geojsonData.features.forEach(function (element) {

        var tr = tableRef.insertRow();

        var td = document.createElement('td');
        td.innerHTML = '<a href="project.html?projectId=' + element.properties.project_id + '">' + element.properties.name + '</a>';
        tr.appendChild(td);

        td = document.createElement('td');
        td.innerHTML = element.properties.status;
        tr.appendChild(td);

        td = document.createElement('td');
        if (element.properties.progress > 0) {
            td.innerHTML = Math.round(100 * element.properties.progress) + '%';
        } else {
            td.innerHTML = 'not available';
        }
        tr.appendChild(td);

        td = document.createElement('td');
        if (parseInt(element.properties.number_of_users) > 0) {
            td.innerHTML = element.properties.number_of_users;
        } else {
            td.innerHTML = 'not available';
        }

        tr.appendChild(td);
    });

    $('#projectsTable').DataTable();
    $('.dataTables_length').addClass('bs-select');
}

},{}],3:[function(require,module,exports){
'use strict';

var map;

exports.initAnalyticsProject = function initAnalyticsProject() {
  // load project id from query variable
  var projectId = getQueryVariable('projectId').toString();
  console.log(projectId);

  // init basic map with all projects as polygon, zoom to selected project
  initProjectMap();
  var url = 'https://apps.mapswipe.org/api/projects/projects_geom.geojson';
  addProject(url, projectId);

  // make plot for selected project
  url = 'https://apps.mapswipe.org/api/history/history_' + projectId + '.csv';
  makePlot(url, projectId, 'cum_progress');

  // add items and links to download table
  populateProjectDataTable(projectId);
};

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  console.log(query);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

function initProjectMap() {
  map = L.map('map').setView([0.0, 0.0], 2);
  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="https://carto.com/">Carto</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0.</a> Data by <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, under ODbL.',
    subdomains: ['a', 'b', 'c']
  }).addTo(map);
  console.log('added map');

  setTimeout(function () {
    map.invalidateSize();
  }, 400);

  var legend = L.control({ position: 'bottomleft' });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<i style="background:orange"></i>active<br>';
    div.innerHTML += '<i style="background:blue"></i>finished<br>';
    div.innerHTML += '<i style="background:grey"></i>inactive<br>';
    return div;
  };
  legend.addTo(map);
}

function addProject(url, projectId) {
  var geojsonData = $.ajax({
    url: url,
    dataType: "json",
    success: console.log("mapswipe project centroids data successfully loaded."),
    error: function error(xhr) {
      alert(xhr.statusText);
    }
  });
  // Specify that this code should run once the county data request is complete
  $.when(geojsonData).done(function () {

    // define default point style
    var geojsonPolygonStyle = {
      fillColor: "grey",
      color: "white",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.4
    };

    // create geojson layer
    var layer = L.geoJSON(geojsonData.responseJSON, {
      style: geojsonPolygonStyle
    });

    // set style based on feature properties
    layer.setStyle(function (feature) {
      if (feature.properties.status == 'active') {
        var style = { fillColor: 'orange', color: 'black' };
      } else if (feature.properties.status == 'finished') {
        style = { fillColor: 'blue' };
      } else if (feature.properties.status == 'inactive') {
        style = { fillColor: 'grey' };
      }
      if (feature.properties.project_id == projectId) {
        style.color = 'black', style.weight = 3;
      }
      return style;
    }).addTo(map);

    // add a popup
    layer.bindPopup(function (layer) {
      // popup with a link to the project page with detailed information
      popup = '<a href="project.html?projectId=' + layer.feature.properties.project_id + '">' + layer.feature.properties.name + '</a>';
      return popup;
    });

    // zoom to selected project
    zoomToFeature(layer, projectId);

    // get info for our project
    var projectInfo = geojsonData.responseJSON.features.filter(function (item) {
      return item['properties']['project_id'] == projectId;
    })[0]['properties'];

    // add other project info to html
    document.getElementById('project-info-name').innerHTML = projectInfo['name'];
    document.getElementById('project-info-status').innerHTML = projectInfo['status'];
    document.getElementById('project-info-description').innerHTML = projectInfo['project_details'];
    document.getElementById('project-info-progress').innerHTML = parseInt(Math.round(100 * projectInfo['progress']));
    document.getElementById('project-info-contributors').innerHTML = projectInfo['number_of_users'];
    document.getElementById('project-info-area').innerHTML = parseInt(projectInfo['area_sqkm']).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  });
}

function zoomToFeature(layer, projectId) {
  layer.eachLayer(function (layer) {
    if (layer.feature.properties.project_id == projectId) {
      console.log('zoom to feature');
      map.fitBounds(layer.getBounds());
    }
  });
}

function populateProjectDataTable(projectId) {

  var datasets = [{ 'name': 'Aggregated Results',
    'url': 'https://apps.mapswipe.org/api/agg_results/agg_results_' + projectId + '.csv',
    'description': 'aggregated results',
    'datatype': 'CSV'
  }, { 'name': 'Aggregated Results (with Geometry)',
    'url': 'https://apps.mapswipe.org/api/agg_results/agg_results_' + projectId + '_geom.geojson',
    'description': 'aggregated results',
    'datatype': 'GeoJSON'
  }, { 'name': 'HOT Tasking Manager Geometries',
    'url': 'https://apps.mapswipe.org/api/hot_tm/hot_tm_' + projectId + '.geojson',
    'description': 'This dataset contains shapes that are ready to use in the HOT Tasking Manager. Currently, the geometries consist of maximum 15 MapSwipe Tasks, where at least 35% of all users indicated the presence of a building by classifying as "yes" or "maybe"',
    'datatype': 'GeoJSON'
  }, { 'name': 'Moderate to High Agreement Yes Maybe Geometries',
    'url': 'https://apps.mapswipe.org/api/yes_maybe/yes_maybe_' + projectId + '.geojson',
    'description': 'This dataset contains all results where at least 35% of users submitted a "yes" or "maybe" classification. The output dataset depicts the union of all selected results.',
    'datatype': 'GeoJSON'
  }, { 'name': 'Groups',
    'url': 'https://apps.mapswipe.org/api/groups/groups_' + projectId + '.csv',
    'description': 'Groups',
    'datatype': 'CSV'
  }, { 'name': 'History',
    'url': 'https://apps.mapswipe.org/api/history/history_' + projectId + '.csv',
    'description': 'History',
    'datatype': 'CSV'
  }, { 'name': 'Results',
    'url': 'https://apps.mapswipe.org/api/results/results_' + projectId + '.csv',
    'description': 'Results',
    'datatype': 'CSV'
  }, { 'name': 'Tasks',
    'url': 'https://apps.mapswipe.org/api/tasks/tasks_' + projectId + '.csv',
    'description': 'Tasks',
    'datatype': 'CSV'
  }];

  var tableRef = document.getElementById('projectDataTable').getElementsByTagName('tbody')[0];
  datasets.forEach(function (element) {
    var tr = tableRef.insertRow();

    var td = document.createElement('td');
    td.innerHTML = projectId;
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = element.name;
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = element.datatype;
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = element.description;
    tr.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = '<a href="' + element.url + '" target="_blank">Download</a>';
    tr.appendChild(td);
  });
}

function makePlot(url, projectId, attribute) {
  Plotly.d3.csv(url, function (data) {
    processData(data, projectId, attribute);
  });
};

function processData(allRows, projectId, attribute) {
  var x = [],
      y = [];
  for (var i = 0; i < allRows.length; i++) {
    var row = allRows[i];
    x.push(row['day']);
    y.push(100 * row[attribute]);
  }
  makePlotly(x, y, projectId, attribute);
}

function makePlotly(x, y, projectId, attribute) {
  var plotDiv = document.getElementById("plot");
  var traces = [{
    x: x,
    y: y
  }];

  if (attribute == 'cum_progress') {
    var layout = {
      autosize: 350,
      height: 350,
      margin: {
        l: 40,
        r: 40,
        b: 40,
        t: 60,
        pad: 4
      },
      yaxis: { range: [0, 101] },
      title: {
        text: 'Progress [%]'
      }
    };
  } else {
    var layout = {};
  }

  Plotly.newPlot(attribute, traces, layout, { displayModeBar: false });
};

},{}],4:[function(require,module,exports){
'use strict';

var _navigation = require('./components/navigation.js');

var _navigation2 = _interopRequireDefault(_navigation);

var _overviewStats = require('./components/overviewStats.js');

var _projectStats = require('./components/projectStats.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var html = document.querySelector('html');
var isMobile = false;
var resizeId = void 0;
// let menu = new Navigation(document.querySelector('.navigation'));

if (html.classList.contains('mobile')) {
    isMobile = true;
}

if (html.querySelector('#year')) {
    var theDate = new Date();
    html.querySelector('#year').innerHTML = theDate.getFullYear();
}

if (html.querySelector('.burger-menu')) {
    new _navigation2.default(html.querySelector('.burger-menu'));
}

// Basic classes to add relevant classes to html tag
function classRemove(element, classes) {
    classes.forEach(function (clas) {
        element.classList.remove(clas);
    });
}

function viewport() {
    var width = document.body.clientWidth,
        viewport = 'default';

    if (width >= 1344) {
        viewport = 'desktop-wide';
    }
    if (width < 1344) {
        viewport = 'desktop-compact';
    }
    if (width < 1024) {
        viewport = 'tablet-portrait';
    }
    if (width < 768) {
        viewport = 'mobile-landscape';
    }
    if (width < 481) {
        viewport = 'mobile-portrait';
    }

    classRemove(html, ['default', 'desktop-compact', 'tablet-portrait', 'mobile-landscape', 'mobile-portrait']);
    html.classList.add(viewport);

    return viewport;
}

function touchEnabled() {
    if ('ontouchstart' in window || 'onmsgesturechange' in window) {
        html.classList.add('touchenabled');
        return true;
    }
    html.classList.remove('touchenabled');
    return false;
}

function device() {
    var device = 'desktop';
    switch (viewport()) {
        case 'desktop-compact':
            device = 'desktop';
            if (touchEnabled()) {
                device = 'tablet';
            }
            break;
        case 'tablet-portrait':
            device = 'tablet';
            break;
        case 'mobile-landscape':
        case 'mobile-portrait':
            device = 'mobile';
            break;
    }
    classRemove(html, ['mobile', 'tablet', 'tablet-portrait', 'desktop']);
    html.classList.add(device);

    return device;
}

function doneResizing() {
    device();
    viewport();

    var wasMobile = isMobile;

    html.classList.contains('mobile') ? isMobile = true : isMobile = false;

    if (wasMobile != isMobile) {
        // isMobile ? menu.closeDesktopSearch() : menu.closeMobileMenu();
    }
}

// Basic functions to add relevant classes to html tag
viewport();
device();
touchEnabled();

window.addEventListener('resize', function () {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
});

window.initMap = _overviewStats.initMap;
window.initAnalyticsProject = _projectStats.initAnalyticsProject;

},{"./components/navigation.js":1,"./components/overviewStats.js":2,"./components/projectStats.js":3}]},{},[4,2,3])

//# sourceMappingURL=index.js.map
