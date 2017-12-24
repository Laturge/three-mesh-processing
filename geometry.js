var sliceGeometry = require('threejs-slice-geometry')(THREE);

function fromData(data) {
    var pos = data.attributes.POSITION;
    var geometry = new THREE.Geometry();

    for (var i = 0; i < data.indices.length; i += 3) {
        var face = new THREE.Face3(...data.indices.slice(i, i + 3));

        geometry.faces.push(face);
    }    
        
    for (var i = 0; i < pos.length; i += 3) {
        var vertex = new THREE.Vector3(...pos.slice(i, i + 3));

        geometry.vertices.push(vertex);
    }

    return geometry;
}
    
function toData(geometry) {
    var indices = new Int32Array(geometry.faces.length * 3);
    var attributes = { POSITION: new Float32Array(geometry.vertices.length * 3) };

    for (let i = 0; i < geometry.faces.length; i++) {
        var face = geometry.faces[i];

        indices[i * 3] = face.a;
        indices[i * 3 + 1] = face.b;
        indices[i * 3 + 2] = face.c;
    }
        
    for (let i = 0; i < geometry.vertices.length; i++) {
        var vertex = geometry.vertices[i];
            
        attributes.POSITION[i * 3] = vertex.x;
        attributes.POSITION[i * 3 + 1] = vertex.y;
        attributes.POSITION[i * 3 + 2] = vertex.z;
    }
        
    return { indices, attributes };
}

function slice(geometry, planes, closeHoles) {

    var geom = geometry.clone();

    planes.forEach(([x, y, z, w]) => {
        let plane = new THREE.Plane(new THREE.Vector3(x, y, z), w);
        
        geom = sliceGeometry(geom, plane, closeHoles);
    });    

    return geom;
}

function translate(geometry, vector) {
    geometry.vertices.forEach(v => {
        v.add(vector);
    });
}

module.exports = {
    fromData,
    toData,
    slice,
    translate
}
