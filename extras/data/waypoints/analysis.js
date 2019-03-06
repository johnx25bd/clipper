var turf = require('@turf/turf');
var fleet = require('./clipper-clean-.json');
var fs = require('fs');

var finish_lines = {
  "british-isles": turf.point([-2.993433, 53.400376]),
  "pacific": turf.point([-124.777068, 48.427022]),
  "west-north-america": turf.point([-79.48637, 10.17007]),
  "north-atlantic": turf.point([-7.265575, 55.493403]),
  "east-north-america": turf.point([-73.941392, 40.503855])
}



for ( race of fleet ) {

  race.positions.forEach( (pos) => {
    pos.rhumb_bearing = turf.rhumbBearing(turf.point(pos.fleet_centroid), finish_lines[race.race]);
  });
}


fs.writeFile('clipper-clean-rhumb.json', JSON.stringify(fleet));
