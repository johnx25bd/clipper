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

// // Socket.io
// var socket = io.connect("/");
//
// socket.on("connect", function(){
//     console.log("Browser connected!")
// });
//
// socket.on('dem-success',(refToDEMonServer) => {
//   promptDEMdownload(refToDEMonServer);
// });

// D3 geo - let's make maps
// Mike Bostock is a 👑
var proj = d3.geoOrthographic()
  .center([-10,31]);

var graticule = d3.geoGraticule();
var path = d3.geoPath(proj);

var map = d3.select('#map')
  .attr('viewbox', function () {
    return '0 0 ' + dims.width + ' ' + dims.height
  });

var g = map.append('g');

d3.json(worldJson, (data) => {



  // Draw geometries, assigning each element appropriate attributes
  // based on metadata contained in geojson
  g.selectAll('path')
      .data(data.features)
      .enter()
    .append('path')
      .attr('d', path)
      .attr('class', (d) => {
        // if country, return country
        // if state, return state
        if (d.properties.sov_a3 == 'CAN') {
          if (!d.properties.gn_name) {
            return 'country CAN';
          } else {
            return 'province ' + d.properties.gn_name.toLowerCase().replace(' ', '-');
          }
        } else if (d.properties.gn_name) {
          if (d.properties.gn_name == 'Colorado') {
            return 'serviced state hidden ' + d.properties.gn_name.toLowerCase().replace(' ', '-')
          } else {
            return 'state ' + d.properties.gn_name.toLowerCase().replace(' ', '-');
          }
        } else if (d.properties.COUNTY) {
          return 'county serviced ' + d.properties.COUNTY.toLowerCase().replace(' ', '-');
        } else if (d.properties.ISO_A3 == 'USA'){
          return 'country USA hidden';
        } else {
          return 'country ' + d.properties.ISO_A3;
        }
      })
      .classed('geography', true)
      .attr('data-iso', (d) => {
        // If county:
        if (d.properties.COUNTY) {
          return d.properties.COUNTY.toLowerCase().replace(' ', '-'); }
        // If state:
        else if (d.properties.gn_name) {
          return d.properties.gn_name.toLowerCase().replace(' ', '-');
        } else if (d.properties.ISO_A3) {
          return d.properties.ISO_A3;
        }
      });

      g.append('path')
        .datum(graticule)
        .attr('class','graticule')
        .attr('d', path);
});

d3.csv('./data/clipper.csv', (data) => {
  // console.log(data[0].lat);

  data.forEach((d) => {
    d.lat = +d.lat;
    d.lon = +d.lon;
    d.dtf = +d.dtf;
    d.dif = +d.dif;
    d.dist_mg = +d.dist_mg;
    d.position = +d.position;
  })

  console.log(data[0]);

  // var line = d3.line()
  //   .x(function(d) { console.log(d);
  //     return proj(d.lon, d.lat)[0]; })
  //   .y(function (d) { return proj(d.lon, d.lat)[1]; })
  //   .curve(d3.curveBasis);

  // from https://stackoverflow.com/questions/47917730/d3-line-and-points-on-map-from-csv-data
  var track = map.append('g')
    .classed('track', true);

  track.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .transition().duration(function (d, i) {return i; })
    .attr('cx', function (d) {
      return proj([d.lon, d.lat])[0]; })
    .attr('cy', function (d) { return proj([d.lon, d.lat])[1]; })
    .attr('r', 1)
    .attr('class', function (d) {
      var teamClass = d.team.replace('.', 'dot').toLowerCase().split(' ').join('-')
      return teamClass;
    });
    // .transition();
    // .attr('fill', 'green');

})

// EVENT LISTENERS:

// A snazzy little helper function for smooth jQuery scrolling from
// https://stackoverflow.com/questions/2346011/how-do-i-scroll-to-an-element-within-an-overflowed-div
// - thanks @lepe!!!!
jQuery.fn.scrollTo = function(elem, speed) {
    $(this).animate({
        scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top
    }, speed == undefined ? 1000 : speed);
    return this;
};
