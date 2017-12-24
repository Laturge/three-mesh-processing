# Three.js mesh processing

## Using

```js
var data = {
    attributes:{
        POSITION: [-1,0,0,  -1,1,0, 1,0,0],
    },
    indices: [0,1,2]
};

var geometry = MP.Geometry.fromData(data);

MP.Octree.slice(geometry, 500, (geometry, position, level, id, isFinal)=>{
 ///...
});
``