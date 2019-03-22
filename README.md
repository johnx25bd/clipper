# Visualizing the Clipper Race

## Access

Access the visualization [here](https://robisoniv.github.io/clipper/public/index.html) or with the following commands (assuming you have `node` and `npm` installed):

```
$ git clone git@github.com:robisoniv/clipper.git
$ cd clipper/app
$ npm install
$ npm start
```

then navigate to http://localhost:8000/ in your browser.

## Summary

The Clipper Round the World Yacht Race is a biennial sailing race in which a fleet of Clipper 70 ocean racing sloops circumnavigates the earth, crewed by trained amateurs. The race is composed of eight legs, with stopovers in port cities along the route (clipperroundtheworld.com, 2019).

Following the race - a close friend skippered one of the Clipper yachts in the 2017-2018 campaign - we wrote a web scraper in mid April 2018 to begin recording fleet positions and other metadata on an hourly interval. Some four months and five races later, we had a near-continuous data set of fleet positions as they traversed the oceans. Further, a wealth of content created by Clipper employees and crew. We wrote a few scrapers written using the selenium and BeautifulSoup python packages to collect the blogs each skipper wrote each day. Much more content exists for possible integration into a visualization.

We created an interactive geographic visualization of Race 11, from Panama to New York. Our goal was to create the structure for a multi-media time series visualization with 11 primary units of observation - Clipper yachts - each with numerous dimensions, plus each moment's associated text content.

D3.js (D3.js, 2019) served as our primary library, though we also used Turf.js (Turf.js, 2019) for some spatial calculations and jQuery, brought in with the Bootstrap framework, for some aspects of DOM management and manipulation. It should be noted that this application was heavily inspired by my first D3 visualization, stableseas.org. I did not look at the code I wrote, however, in creating this iteration. Updating linestrings to reflect a fleet's tracks and positions at any given moment required creation of copies of point arrays (i.e. linestrings) up to the target moment. We expect this may not render smoothly in slower browsers.

This visualization offered us the opportunity to practice D3.js, along with displaying data with spatial, temporal and string dimensions. We'd like to implement this in a web-delivered VR experience; as a first step we visualized race linestrings in a THREE.js scene based on Mike Bostock's [GeoJSON in THREE.js observable notebook](https://observablehq.com/@mbostock/geojson-in-three-js) (mbostock, 2018).

## References

BlackrockDigital. A bare Bootstrap HTML starter template for rapid development, 2019. Viewed 18 February 2019. https://github.com/BlackrockDigital/startbootstrap-bare

Boostrap. Bootstrap, 2019. Viewed 18 February 2019. https://getbootstrap.com/

Bostock, Mike. GeoJSON in THREE.js, 2018. Viewed 8 March 2019. https://observablehq.com/@mbostock/geojson-in-three-js

Clipper Ventures. Clipper Round The World Race, 2019. Viewed from 18 July 2017. https://www.clipperroundtheworld.com/

D3.js. D3 - Data Driven Documents, 2019. Viewed 18 February 2019. https://d3js.org/

jQuery. jQuery, 2019. Viewed 18 February 2019. https://jquery.com/

Natural Earth. Natural Earth, 2019. Viewed 18 February 2019. https://www.naturalearthdata.com

three.js. three.js - Javascript 3D library, 2019. Viewed 8 March 2019. https://threejs.org/

Turf.js. Turf -  A modular geospatial engine written in JavaScript, 2019. Viewed 18 February 2019. https://github.com/Turfjs/turf
