// Bring D3 geo into A-FRAME ...

var radius = 228;

AFRAME.registerComponent('world', {

  schema: {
    // coordinates: []
    color: {
      type: 'color',
      default: '#AAA'
    }
  },

  init: function() {
    var data = this.data;
    var el = this.el;

    d3.json("https://unpkg.com/world-atlas@1/world/50m.json", function(error, topology) {

      if (error) throw error;

      var land = topojson.mesh(topology, topology.objects.land);

      this.material = new THREE.LineBasicMaterial({
        color: data.color
      });

      this.geometry = new THREE.Geometry();

      this.line = wireframe(land, this.material);

      el.setObject3D('mesh', this.line);
      el.object3D.rotation.set(
        THREE.Math.degToRad(90),
        THREE.Math.degToRad(0),
        THREE.Math.degToRad(0)
      );

    });
  }
});

function vertex(point) {
  var lambda = point[0] * Math.PI / 180,
    phi = point[1] * Math.PI / -180,
    cosPhi = Math.cos(phi);
  return new THREE.Vector3(
    radius * cosPhi * Math.cos(lambda),
    radius * cosPhi * Math.sin(lambda),
    radius * Math.sin(phi)
  );
}


function wireframe(multilinestring, material) {
  var geometry = new THREE.Geometry;
  multilinestring.coordinates.forEach(function(line) {
    d3.pairs(line.map(vertex), function(a, b) {
      geometry.vertices.push(a, b);
    });
  });
  return new THREE.LineSegments(geometry, material);
}

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
