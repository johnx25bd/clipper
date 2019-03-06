# Visualizing the Clipper Race

# Data

## Collection

We wrote a data scraper to collect positions and other publicly available data as the race progressed ([clipper.py](./data/collection/)). This shell script (which simply called the python script - not sure why we didn't just call execute `clipper.py` with the cron process ...) was executed each hour on a Google Cloud instance from 9 April to 27 July 2018, with very few breaks in continuity. In this way we collected data about the position and state of the fleet through almost half of the round the world effort.

## Processing

Some work with the raw CSVs created by `clipper.py` in a jupyter notebook yielded a cleaned dataset; some further analysis in QGIS allowed us to discern when one race ended and the next started, allowing us to add a dimension to the dataset.

In order to minimize the computational load on the client, we performed a number of geospatial queries and analysis during the processing phase of the project. By including a few extra dimensions for each record - fleet centroid, bearing to finish, and the bounding box containing fleet - we avoided these queries being executed at time of rendering. In our judgment, the additional data load was worth reducing the processing required.

We decided to learn Turf.js for this project, so we could do sophisticated geospatial analysis with NodeJS. This is partly because we found geopandas difficult to install, partly because we didn't want to do our spatial analysis in the browser's console and partly because we thought it'd be cool. Mostly that last one, in fact. And it is - a very powerful library with great documentation.


# The Final Challenge

https://gist.github.com/mbostock/2b85250396c17a79155302f91ec21224
https://github.com/aframevr/aframe-boilerplate
