AFRAME.registerComponent('hello-world', {
  init: function() {
    console.log("Hello world.")
  }
})

AFRAME.registerComponent('log', {
  schema: {
    event: {
      type: 'string',
      default: ''
    },
    message: {
      type: 'string',
      default: 'Hello world from log schema!'
    }
  },

  init: function() {
    var self = this;
    this.eventHandlerFn = function() {
      console.log(self.data.message);
    }
  },

  update: function(oldData) {
    var data = this.data;
    var el = this.el;

    if (oldData.event && data.event !== oldData.event) {
      el.removeEventListener(oldData.event, this.eventHandlerFn);
    }
    if (data.event) {
      el.addEventListener(data.event, this.eventHandlerFn);
    } else {
      console.log(data.message);
    }
  },

  remove: function() {
    var data = this.data;
    var el = this.el;

    // Remove event listener.
    if (data.event) {
      console.log('Removing ' + data.event);
      el.removeEventListener(data.event, this.eventHandlerFn);
    }
  }
});


AFRAME.registerComponent('box', {
  schema: {
    width: {
      type: 'number',
      default: 1
    },
    height: {
      type: 'number',
      default: 1
    },
    depth: {
      type: 'number',
      default: 1
    },
    color: {
      type: 'color',
      default: '#AAA'
    }
  },


  init: function() {
    var data = this.data;
    var el = this.el;

    // Create geometry.
    this.geometry = new THREE.BoxBufferGeometry(data.width, data.height, data.depth);

    // Create material.
    this.material = new THREE.MeshStandardMaterial({
      color: data.color
    });

    // Create mesh.
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // Set mesh on entity.
    el.setObject3D('mesh', this.mesh);
  },

  update: function(oldData) {
    var data = this.data;
    var el = this.el;

    // If `oldData` is empty, then this means we're in the initialization process.
    // No need to update.
    if (Object.keys(oldData).length === 0) {
      return;
    }

    // Geometry-related properties changed. Update the geometry.
    if (data.width !== oldData.width ||
      data.height !== oldData.height ||
      data.depth !== oldData.depth) {
      el.getObject3D('mesh').geometry = new THREE.BoxBufferGeometry(data.width, data.height,
        data.depth);
    }

    // Material-related properties changed. Update the material.
    if (data.color !== oldData.color) {
      el.getObject3D('mesh').material.color = new THREE.Color(data.color);
    }
  }
});
