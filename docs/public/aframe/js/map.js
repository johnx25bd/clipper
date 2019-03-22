var mapMesh, graticuleMesh;
var width = 960,
  height = 960,
  radius = 228,
  mesh,
  graticule,
  scene = new THREE.Scene,
  camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000),
  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
d3.json("https://unpkg.com/world-atlas@1/world/50m.json", function(error, topology) {
  if (error) throw error;
  d3.json('../data/clipper-multilinestring.json', (errorC, clipper) => {
    if (errorC) throw error;

    var mls = topojson.mesh(topology, topology.objects.land);
    mls.coordinates = mls.coordinates.concat(clipper.coordinates);
    graticuleMesh = wireframe(graticule10(), new THREE.LineBasicMaterial({
      color: 0xaaaaaa
    }));

    mapMesh = wireframe(mls, new THREE.LineBasicMaterial({
      color: 0xff0000
    }));

    // AFRAME.registerGeometry('world-map', {
    //   init: function(data) {
    //     this.geometry = mapMesh;
    //   }
    // })

    AFRAME.registerComponent('world-map', {
      init: function() {
        var el = this.el;
        el.setObject3D('world-map', mapMesh);
        el.getObject3D('world-map'); // Returns THREE.Mesh that was just created.
      }
    });
    // this.el.setObject3D(this.attrName, this.line);

    AFRAME.registerComponent('map-line', {
      schema: {
        start: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
        end: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
        color: {type: 'color', default: '#74BEC1'},
        opacity: {type: 'number', default: 1},
        visible: {default: true}
      },

      multiple: true,

      init: function () {
        var data = this.data;
        var geometry;
        var material;
        this.rendererSystem = this.el.sceneEl.systems.renderer;
        material = this.material = new THREE.LineBasicMaterial({
          color: data.color,
          opacity: data.opacity,
          transparent: data.opacity < 1,
          visible: data.visible
        });
        geometry = this.geometry = new THREE.Geometry;
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(2 * 3), 3));

        this.rendererSystem.applyColorCorrection(material.color);
        this.line = wireframe(mls, material);
        this.el.setObject3D(this.attrName, this.line);
      },

      update: function (oldData) {
        var data = this.data;
        var geometry = this.geometry;
        var geoNeedsUpdate = false;
        var material = this.material;
        var positionArray = geometry.attributes.position.array;

        // Update geometry.
        if (!isEqualVec3(data.start, oldData.start)) {
          positionArray[0] = data.start.x;
          positionArray[1] = data.start.y;
          positionArray[2] = data.start.z;
          geoNeedsUpdate = true;
        }

        if (!isEqualVec3(data.end, oldData.end)) {
          positionArray[3] = data.end.x;
          positionArray[4] = data.end.y;
          positionArray[5] = data.end.z;
          geoNeedsUpdate = true;
        }

        if (geoNeedsUpdate) {
          geometry.attributes.position.needsUpdate = true;
          geometry.computeBoundingSphere();
        }

        material.color.setStyle(data.color);
        this.rendererSystem.applyColorCorrection(material.color);
        material.opacity = data.opacity;
        material.transparent = data.opacity < 1;
        material.visible = data.visible;
      },

      remove: function () {
        this.el.removeObject3D('line', this.line);
      }
    });

    function isEqualVec3 (a, b) {
      if (!a || !b) { return false; }
      return (a.x === b.x && a.y === b.y && a.z === b.z);
    }


  });
});





// Converts a point [longitude, latitude] in degrees to a THREE.Vector3.
function vertex(point) {
  var lambda = point[0] * Math.PI / 180,
    phi = point[1] * Math.PI / 180,
    cosPhi = Math.cos(phi);
  return new THREE.Vector3(
    radius * cosPhi * Math.cos(lambda),
    radius * cosPhi * Math.sin(lambda),
    radius * Math.sin(phi)
  );
}
// Converts a GeoJSON MultiLineString in spherical coordinates to a THREE.LineSegments.
function wireframe(multilinestring, material) {
  var geometry = new THREE.Geometry;
  multilinestring.coordinates.forEach(function(line) {
    d3.pairs(line.map(vertex), function(a, b) {
      geometry.vertices.push(a, b);
    });
  });
  return new THREE.LineSegments(geometry, material);
}
// See https://github.com/d3/d3-geo/issues/95
function graticule10() {
  var epsilon = 1e-6,
    x1 = 180,
    x0 = -x1,
    y1 = 80,
    y0 = -y1,
    dx = 10,
    dy = 10,
    X1 = 180,
    X0 = -X1,
    Y1 = 90,
    Y0 = -Y1,
    DX = 90,
    DY = 360,
    x = graticuleX(y0, y1, 2.5),
    y = graticuleY(x0, x1, 2.5),
    X = graticuleX(Y0, Y1, 2.5),
    Y = graticuleY(X0, X1, 2.5);

  function graticuleX(y0, y1, dy) {
    var y = d3.range(y0, y1 - epsilon, dy).concat(y1);
    return function(x) {
      return y.map(function(y) {
        return [x, y];
      });
    };
  }

  function graticuleY(x0, x1, dx) {
    var x = d3.range(x0, x1 - epsilon, dx).concat(x1);
    return function(y) {
      return x.map(function(x) {
        return [x, y];
      });
    };
  }
  return {
    type: "MultiLineString",
    coordinates: d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X)
      .concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y))
      .concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) {
        return Math.abs(x % DX) > epsilon;
      }).map(x))
      .concat(d3.range(Math.ceil(y0 / dy) * dy, y1 + epsilon, dy).filter(function(y) {
        return Math.abs(y % DY) > epsilon;
      }).map(y))
  };
}
