Prepare a short 400 word document summarising what the visualisation is aiming to show, outline the design and technical approach taken, and describe where the data came from. Includethis report and thevisualisation files together as a single zip file in the submission.

## Access

Access the visualization [here](./docs/public/) or with the following commands (assuming you have `node` and `npm` installed):

```
$ git clone git@github.com:robisoniv/clipper.git
$ cd clipper/app
$ npm install
$ npm start
```

then navigate to http://localhost:8000/ in your browser.

## Summary

The Clipper Round the World Yacht Race is a biennial sailing race in which a fleet of Clipper 70 ocean racing sloops circumnavigates the earth, crewed by trained amateurs. The race is composed of eight legs, with stopovers in port cities along the route.

Following the race - a close friend skippered one of the Clipper yachts in the 2017-2018 campaign - we wrote a web scraper in mid April 2018 to begin recording fleet positions and other metadata on an hourly interval. Some four months and five races later, we had a near-continuous data set of fleet positions as they traversed the oceans. Further, a wealth of content created by Clipper employees and crew, freely available on the Clipper Race website (clipperroundtheworld.com). We wrote a few scrapers written using the selenium and BeautifulSoup python packages, to collect the blogs each skipper wrote each day. Much more content exists for possible integration into a visualization.

We created an interactive geographic visualization of Race 11, from Panama to New York. Our goal was to create the structure for a multi-media time series visualization with 11 primary units of observation - Clipper yachts - each with numerous dimensions and associated content at any moment.

D3.js served as our primary library, though we also used Turf.js for some spatial calculations and jQuery, brought in with the Bootstrap framework, for some aspects of DOM management and manipulation. It should be noted that this application was heavily inspired by my first D3 visualization, stableseas.org. I did not look at the code I wrote, however, in creating this iteration. Creating the SVG map was not difficult, nor was drawing linestrings. However, updating linestrings to reflect a fleet's tracks and positions at any given moment was a bit trickier, requiring creation of copies of point arrays (i.e. linestrings) up to the target moment. We expect this may not render smoothly in slower browsers.

We also created a pane on the right side of the window to display that day's blog posts, submitted via satphone connection by each race skipper. While we hope to implement more sophisticated animations in the future, for now the race progresses by the user clicking on the date labels overlaid on the map.

This visualization offered us the opportunity to practice D3.js, along with displaying data with spatial, temporal and string dimensions. We have many ideas for how to extend it, and hope to implement those shortly.

## Shortcomings

Several shortcomings exist in the app and visualization, which we would like to address and improve upon over time. In the visualization, gaps in the data exist, where the linestrings are straight for a segment. Clicking dates calls `updateFleet()` with the index of that date in the `fleetData.dates` array. This appears to be updating the position of the `polygon.fleet-positions` elements appended to `fleetMap` in the `loadFleetData()` function in `client.js`. Somehow the polygons are not placed at the end of their respective linestrings, but a distance away. We aren't sure why this is happening, and would like to interpolate points to have a more complete time indexed dataset - because gaps in the fleet data also means certain blog posts aren't
