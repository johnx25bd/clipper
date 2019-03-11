// The main js file to be executed in the client's browser

var dims = {
  width: $(window).width(),
  height: $(window).height(),
  margins: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10
  }
}

var worldJson = 'data/ne_110m_land.json';

// Some helper variables:
var months = [ // from https://gist.github.com/Shivabeach/3966545
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

var skipperNames = {'dare-to-lead': 'Dale Smyth',
 'hotelplanner-com': 'Conall Morrison',
 'liverpool-2018': 'Lance Shepherd',
 'garmin': 'Gaëtan Thomas',
 'visit-seattle': 'Nikki Henderson',
 'qingdao': 'Chris Kobusch',
 'great-britain': 'David Hartshorn',
 'nasdaq': 'Rob Graham',
 'unicef': 'Bob Beggs',
 'sanya-serenity-coast': 'Wendy Tuck',
 'psp-logistics': 'Matt Mitchell',
 'greenings': 'Andy Woodruff'}

var fleetData,
  raceBBox,
  raceFinish,
  raceScale,
  raceTranslate,
  fleetTracks,
  fleetPositions,
  mapContent,
  currentDay;

var blogsJsonPath = 'data/race-11-blogs.json',
  blogs = [];
var fleetJsonPath = 'data/eastNA-metadata.json';
var raceContent = d3.select('#race-content');
var proj = d3.geoOrthographic();
var graticule = d3.geoGraticule();
var path = d3.geoPath(proj);

var worldmap = d3.select('#world')
  .attr('viewbox', function() {
    return '0 0 ' + dims.width + ' ' + dims.height
  });

var worldg = worldmap.append('g').classed('worldg', true);

var fleetMap = worldmap.append('g')
  .classed('fleet', true);

// thanks to https://macwright.org/2016/12/09/a-d3-queue-mental-model.html
// for helping me understand this, especially the callback pattern
d3.queue() // from https://github.com/d3/d3-queue
  .defer(loadWorld, worldJson)
  .defer(loadBlogs, blogsJsonPath)
  .defer(loadFleetData, fleetJsonPath)
  .await(function(error, worldFromJson, blogsFromJson, fleetFromJson) {
    // This should execute once it is all loaded.
    // zoom to fleet at race start
    if (error) throw error;
    ready(blogsFromJson);
    updateFleet(0);
    updateContent(8);
  });

function ready(_blogData) {

  d3.selectAll('svg')
    .classed('invisible', false);
  blogs = _blogData;
  setUpContentPane();

}

// D3 geo - let's make maps
// Mike Bostock is a 👑
function loadWorld(jsonPath, callback) {
  d3.json(jsonPath, (data) => {

    // Draw geometries, assigning each element appropriate attributes
    // based on metadata contained in geojson
    worldg.selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'geography');

    // then draw graticules over geography
    worldg.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path);

    callback(null, data);
  });
}



function loadBlogs(jsonPath, callback) {
  d3.json(jsonPath, (blogData) => {
    for (key in blogData) {
      blogs.push(blogData[key]);
    }
    callback(null, blogs);
  });
}

function loadFleetData(jsonPath, callback) {
  d3.json(jsonPath, (fleet) => {
    fleetData = fleet,
      raceBBox = d3.geoBounds(fleetData),
      raceFinish = fleet.metadata.finish;

    var timestampList = fleetData.features[0].properties.timestamps;
    fleetData.dates = timestampList.map((ts) => {
      return new Date(ts * 1000)
    });

    fleetMap.append('g').classed('fleet-routes', true)
      .selectAll('path')
      .data(fleetData.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', function(d) {
        return d.properties['team-id'] + " route";
      });

    fleetTracks = fleetMap.append('g').classed('fleet-tracks', true)
      .selectAll('path')
      .data(fleetData.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', function(d) {
        return d.properties['team-id'] + " track";
      });

    fleetPositions = fleetMap.append('g').classed('fleet-positions', true)
      .selectAll('polygon')
      .data(fleetData.features)
      .enter()
      .append('polygon')
      .attr('class', function(d) {
        return d.properties['team-id'];
      })
      .attr('points', '0,15 -5,-5 5,-5');

    mapContent = fleetMap.append('g').classed('map-content', true)
      .selectAll('text')
      .data(fleetData.metadata.newDays)
      .enter();

    mapContent
      .append('text')
      .text((d) => {
        return fleetData.dates[d].toDateString();
      })
      .attr('x', (d) => {
        return proj(fleetData.metadata.fleetCentroids[d])[0] + 310;
      })
      .attr('y', (d) => {
        return proj(fleetData.metadata.fleetCentroids[d])[1] + 3;
      })
      .attr('data-index', (d) => {
        return d;
      });

    mapContent
      .append('line')
      .attr('x1', (d) => {
        return proj(fleetData.metadata.fleetCentroids[d])[0] + 50;
      })
      .attr('y1', (d) => {
        return proj(fleetData.metadata.fleetCentroids[d])[1];
      })
      .attr('x2', (d) => {
        return proj(fleetData.metadata.fleetCentroids[d])[0] + 300;
      })
      .attr('y2', (d) => {
        return proj(fleetData.metadata.fleetCentroids[d])[1];
      })
      .attr('stroke', 'black')
    callback(null, fleetData);
  });

}

function setUpContentPane() {

  var raceCards = raceContent
    .selectAll('.team-card')
    .data(fleetData.features)
    .enter()
    .append('div')
    .classed('card', true)
    .append('div')
    .attr('class', (d) => {
      return d.properties['team-id'];
    })
    .classed('card-body', true)
    .html((d) => {
      // much of this is template bootstrap card html :
      // https://getbootstrap.com/docs/4.0/components/card/
      var teamId = d.properties['team-id'];

      return `<div class='row'>
        <div class='col-2'><img class='skipper' src="assets/imgs/` + teamId + `-skipper.jpg"></div>
        <div class='col-10'>
          <h5 class="card-title">` + d.properties['team'] + `</h5>
          <h6 class="card-subtitle mb-2 text-muted">` + skipperNames[teamId] + `</h6>
        </div>
      </div>
      <div class='p-holder'></div>`
    });

  var cards = d3.selectAll('.card')
    .append('h5');
}

// Helped / inspired by
// http://bl.ocks.org/jcdcodes/b08e43600afc20017b99
function updateFleet(_index) {

  if (_index < fleetData.metadata.newDays.length) {
    currentDay = _index;
    _index = fleetData.metadata.newDays[_index];
  } else {
    currentDay = fleetData.metadata.newDays.findIndex(function (n) {
      return n >= _index;
    }) ;
  }

  var fleetCentroid = fleetData.metadata.fleetCentroids[_index];

  // Positioning map as fleet progressed was tricky - this helped.
  var progress = (_index / fleetData.dates.length) / 2;

  proj
    .rotate([-1 * fleetCentroid[0], (-1.5 + progress) * fleetCentroid[1]]);

  // This will need to be dynamic with other races at other scales
  proj.scale(1500);

  d3.selectAll('path')
    .attr('d', path);

  fleetPositions
    .attr('transform', function(d) {
      var xy = proj(d.geometry.coordinates[_index])
      var bearing = turf.bearing(
        turf.point(d.geometry.coordinates[_index]),
        turf.point(d.geometry.coordinates[_index + 1])
      );
      return "rotate(" + String(bearing + 180) +
        ' ' + xy[0] + ' ' + xy[1] + ") translate(" +
        xy[0] + ',' + xy[1] + ') scale(0.8)';
    });

  fleetTracks
    .attr('d', function(d, i) {
      return path({
        type: "LineString",
        coordinates: d.geometry.coordinates.slice(0, _index)
      });
    });

  mapContent.selectAll('text')
    .attr('x', (d) => {
      return proj(fleetData.metadata.fleetCentroids[d])[0] + 310;
    })
    .attr('y', (d) => {
      return proj(fleetData.metadata.fleetCentroids[d])[1] + 3;
    })
    .on('click', (d) => {
      updateFleet(d);
    })

  mapContent.selectAll('line')
    .attr('x1', (d) => {
      return proj(fleetData.metadata.fleetCentroids[d])[0] + 50;
    })
    .attr('y1', (d) => {
      return proj(fleetData.metadata.fleetCentroids[d])[1];
    })
    .attr('x2', (d) => {
      return proj(fleetData.metadata.fleetCentroids[d])[0] + 300;
    })
    .attr('y2', (d) => {
      return proj(fleetData.metadata.fleetCentroids[d])[1];
    });
  updateContent(_index);
}

function updateContent(_dateIndex) {
  var raceDate = fleetData.dates[_dateIndex];
  var month = months[raceDate.getMonth()],
    date = raceDate.getDate().toString(),
    date = date.length == 1 ? '0' + date : date,
    day = days[raceDate.getDay()],
    year = raceDate.getFullYear();

  var daysBlogs = [];

  blogs.forEach((blog) => {
    daysBlogs.push(blog.filter(b => b.date == date + ' ' + month));
  });

  raceContent.select('#race-day')
    .text("Race " + fleetData.metadata.raceNum.toString()
      + " : " + fleetData.metadata.raceName);

  raceContent.select('#race-date')
    .text(day + ' ' + date + ' ' + month + ' ' + year)

  // This is a bit counter to the spirit of D3 but it'll work:
  d3.selectAll('.card-body .p-holder')
    .html("");

  daysBlogs.forEach((blog) => {
    if (blog.length > 0) {
      var t = blog[0].team;

      var pHolder = d3.select('.' + t + ' .p-holder')
        .selectAll('p')
        .data(blog[0].text)
        .enter();

      pHolder
        .append('p')
        .text((d) => {
          return d;
        })
    } else {
      console.log("Nope", blog)
    }
  })
}

$('#last-day').on('click', (e) => {
  e.preventDefault();
  if (currentDay == 0) {
    return;
  } else {
    updateFleet(currentDay - 1);
  }
});

$('#next-day').on('click', (e) => {
  e.preventDefault();
  if (currentDay == fleetData.metadata.newDays.length - 1) {
    return;
  } else {
    updateFleet(currentDay + 1);
  }
});
