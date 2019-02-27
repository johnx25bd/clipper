// The main js file to be executed in the client's browser

var dims = {
  width: 400,
  height: $(window).height(),
  margins: {
    top: 10,
    bottom: 10,
      left: 10,
    right: 10
  }
}

var worldJson = 'data/ne_110m_land.json';

// D3 geo - let's make maps
// Mike Bostock is a 👑


var proj = d3.geoWagner4();

var graticule = d3.geoGraticule();
var path = d3.geoPath(proj);

var map = d3.select('#lens')
  .attr('viewbox', function () {
    return '0 0 ' + dims.width + ' ' + dims.height
  });

var worldg = map.append('g');

d3.json(worldJson, (data) => {

  // Draw geometries, assigning each element appropriate attributes
  // based on metadata contained in geojson
  worldg.selectAll('path')
      .data(data.features)
      .enter()
    .append('path')
      .attr('d', path)
      .classed('geography', true);

      worldg.append('path')
        .datum(graticule)
        .attr('class','graticule')
        .attr('d', path);
});

var raceByDate;

// d3.csv('./data/clipper-west-north-america.csv', (data) => {
//   // console.log(data[0].lat);
//
//   data.forEach((d) => {
//     d.lat = +d.lat;
//     d.lon = +d.lon;
//     d.dtf = +d.dtf;
//     d.dif = +d.dif;
//     d.dist_mg = +d.dist_mg;
//     d.position = +d.position;
//     d.datetime = d3.timeParse('%m/%d/%y %H:%M %Z')(d.datetime + ' -00');
//   })
//
//   console.log(data[0]);
//
//   raceByDate = d3.nest()
//     .key(function (d) { return d.datetime})
//     .entries(data);
//
//   console.log(raceByDate);
//
//   // Now we have the race data loaded and can start using our tick function?
//
// })
//
//
// function tick (datetime) {
//   // Update the state of the map to reflect the race at the datetime passed in ...
//   // using raceByDate ...
//
//   // Too heavy for a browser?
//
//   return raceByDate.filter((d) => {
//     // return either race up to that point or just the points on that datetime ...
//   })
// }


d3.json('data/clipper-clean-rhumb.json', (fleet) => {
  console.log(fleet);
})






// from https://stackoverflow.com/questions/47917730/d3-line-and-points-on-map-from-csv-data
// var track = map.append('g')
//   .classed('track', true);
//
// track.selectAll('circle')
//   .data(data)
//   .enter()
//   .append('circle')
// //  .transition().duration(function (d, i) {return i; })
//   .attr('cx', function (d) {
//     return proj([d.lon, d.lat])[0]; })
//   .attr('cy', function (d) { return proj([d.lon, d.lat])[1]; })
//   .attr('r', 1)
//   .attr('class', function (d) {
//     var teamClass = d.team.replace('.', 'dot').toLowerCase().split(' ').join('-')
//     return teamClass;
//   });
    // .transition();
    // .attr('fill', 'green');

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
