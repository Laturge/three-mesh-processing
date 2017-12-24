const Geometry = require('./geometry');

require('three/examples/js/modifiers/SimplifyModifier.js');
var modifer = new THREE.SimplifyModifier();

var slicers = [];

[1, -1].forEach(x =>
    [1, -1].forEach(y =>
        [1, -1].forEach(z =>
            slicers.push({
                planes: [
                    [x, 0, 0, x*Number.EPSILON],
                    [0, y, 0, y*Number.EPSILON],
                    [0, 0, z, z*Number.EPSILON]
                ],
                index: slicers.length,
                x, y, z
            })
        )
    )
);

function getDistance(level) {
    return Math.pow(2, level)
}

function getLevel(distance) {
    return Math.ceil(Math.log2(Math.abs(distance)));
}

function getSuitableDistance(distance) {
    return getDistance(getLevel(distance));
}

function getMeshLevel(bbox) {
    
    var coords = [...bbox.min.toArray(), ...bbox.max.toArray()]
    var maxDistance = Math.max(...coords.map(c => Math.abs(c)));

    return getLevel(maxDistance);
}

function simplify(geometry, maxVertices) {
    var g = geometry.clone();
    
    while (g.vertices.length > maxVertices)
        g = modifer.modify(g, 1);
    
    return g;          
}

function slice(geometry, maxVertices, onchunk, oninfo = () => { }) {
    
    function align(geometry, level, x, y, z) {
        var size = getDistance(level);
        
        var halfSize = size / 2;
        var offset = new THREE.Vector3(
            -halfSize * x,
            -halfSize * y,
            -halfSize * z
        );

        Geometry.translate(geometry, offset);

        return offset;
    }

    function sliceLOD(geometry, position, level, id) {

        if (geometry.vertices.length <= maxVertices) {
            onchunk(geometry, position, level, id, true);
            return;
        }
            
        slicers.forEach(({ planes, index, x, y, z }) => {
                
            var newGeometry = Geometry.slice(geometry, planes, false);
            var newLevel = level - 1;
            var newId = [...id, index];

            if (newGeometry.vertices.length > maxVertices) {
                onchunk(simplify(newGeometry, maxVertices), position, newLevel, newId);  
            }

            if (newGeometry.vertices.length === 0) {
                oninfo({msg: 'chunk have no vertices', id: newId})
                return;
            } 

            let offset = align(newGeometry, level, x, y, z);
            let newPosition = position.clone().sub(offset);

            sliceLOD(newGeometry, newPosition, newLevel, newId);
        });
            
    }

    geometry.computeBoundingBox();
    var bbox = geometry.boundingBox;
    var lvl = getMeshLevel(bbox);
        
    sliceLOD(geometry, new THREE.Vector3(0, 0, 0), lvl, [0])
}

module.exports = {
    getDistance,
    getLevel,
    getSuitableDistance,
    getMeshLevel,
    simplify,
    slice
}