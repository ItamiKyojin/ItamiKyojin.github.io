import {DIRECTION, DEG_TO_RAD} from './globals.js';

// ---------- create geometry ----------
// create object to store geometries globally
const geometries = {};

geometries.box = new THREE.BoxGeometry();

geometries.shaft = new THREE.BoxGeometry(0.25, 1, 0.25);
// change uv mapping of shaft, so that the sides use the top 25% of the given texture rotated counterclockwise
let shaftTDS = [];
shaftTDS[DIRECTION.LEFT] = [0, 0, 0, 0.75];
uvMap(geometries.shaft, shaftTDS, true, true);

// reminder to shift in one direction by 1/8, as it is not a full block
// generic name: box3_4BottomGeometry
geometries.pistonBase = new THREE.BoxGeometry(1, 0.75, 1);
// change uv mapping of pistonBase, so that the sides use the bottom 75% of the given texture
let pistonBaseTDS = [];
pistonBaseTDS[DIRECTION.LEFT] = [0.25, 0, 0, 0]; // top, left, right, bottom
uvMap(geometries.pistonBase, pistonBaseTDS);

// reminder to shift in one direction by 3/8, as it is not a full block
// generic name: box1_4TopGeometry
geometries.pistonHead = new THREE.BoxGeometry(1, 0.25, 1);
// change uv mapping of pistonHead, so that the sides use the top 25% of the given texture
let pistonHeadTDS = [];
pistonHeadTDS[DIRECTION.LEFT] = [0, 0, 0, 0.75];
uvMap(geometries.pistonHead, pistonHeadTDS);

// diode = repeater/comparator
geometries.diodeBase = new THREE.BoxGeometry(1, 0.125, 1);
let diodeBaseTDS = [];
diodeBaseTDS[DIRECTION.LEFT] = [0.875, 0, 0, 0];
uvMap(geometries.diodeBase, diodeBaseTDS);

geometries.torch = new THREE.BoxGeometry(2/16, 10/16, 2/16);
let torchTDS = [];
torchTDS[DIRECTION.TOP] = [6/16, 7/16, 7/16, 8/16];
torchTDS[DIRECTION.LEFT] = [6/16, 7/16, 7/16, 0];
torchTDS[DIRECTION.BOTTOM] = [14/16, 7/16, 7/16, 0];
uvMap(geometries.torch, torchTDS);


/// Geometry for redstoneTorch
// BoxGeometry isn't QUIET the right one, as the sides need to move 1pxl towards the center
//    AND the top and bottom faces need to be smaller AND the top face needs to move 1pxl down
//console.log(new THREE.BoxGeometry());

// initiate custGeometry
/*geometries.cust = new THREE.BufferGeometry();

// set normalVertices of custGeometry
const normalVertices = new Float32Array([
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,

    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,

    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1
]);
custGeometry.setAttribute('normal', new THREE.BufferAttribute(normalVertices, 3));

// set  posVertices of custGeometry
const posVertices = new Float32Array([
    0.0625, 0.34375, 0.125,
    0.0625, 0.34375, -0.125,
    0.0625, -0.34375, 0.125,
    0.0625, -0.34375, -0.125,

    -0.0625, 0.34375, -0.125,
    -0.0625, 0.34375, 0.125,
    -0.0625, -0.34375, -0.125,
    -0.0625, -0.34375, 0.125,

    -0.0625, 0.2864583432674408, -0.0625,
    0.0625, 0.2864583432674408, -0.0625,
    -0.0625, 0.2864583432674408, 0.0625,
    0.0625, 0.2864583432674408, 0.0625,

    -0.0625, -0.34375, 0.0625,
    0.0625, -0.34375, 0.0625,
    -0.0625, -0.34375, -0.0625,
    0.0625, -0.34375, -0.0625,

    -0.125, 0.34375, 0.0625,
    0.125, 0.34375, 0.0625,
    -0.125, -0.34375, 0.0625,
    0.125, -0.34375, 0.0625,

    0.125, 0.34375, -0.0625,
    -0.125, 0.34375, -0.0625,
    0.125, -0.34375, -0.0625,
    -0.125, -0.34375, -0.0625
])
custGeometry.setAttribute('position', new THREE.BufferAttribute(posVertices, 3));

// set uvVertices of custGeometry
const uvVertices = new Float32Array([
    0, 1,
    1, 1,
    0, 0,
    1, 0,

    0, 1,
    1, 1,
    0, 0,
    1, 0,

    0, 1,
    1, 1,
    0, 0,
    1, 0,

    0, 1,
    1, 1,
    0, 0,
    1, 0,

    0, 1,
    1, 1,
    0, 0,
    1, 0,

    0, 1,
    1, 1,
    0, 0,
    1, 0
]);
custGeometry.setAttribute('uv', new THREE.BufferAttribute(uvVertices, 2));

// set indices of custGeometry
const indices = [0, 2, 1, 2, 3, 1, 4, 6, 5, 6, 7, 5, 8, 10, 9, 10, 11, 9, 12, 14, 13, 14, 15, 13, 16, 18, 17, 18, 19, 17, 20, 22, 21, 22, 23, 21]
custGeometry.setIndex(indices);
custGeometry.addGroup(0, 6, 0);
custGeometry.addGroup(6, 6, 1);
custGeometry.addGroup(12, 6, 2);
custGeometry.addGroup(18, 6, 3);
custGeometry.addGroup(24, 6, 4);
custGeometry.addGroup(30, 6, 5);
console.log(custGeometry);*/

// another attempt at easyer custGeometry
// mild issues with transparent faces hiding other faces
/*geometries.redstoneTorch = new THREE.BoxGeometry(4/16, 11/16, 4/16);
let redstoneTorchPos = redstoneTorchGeometry.getAttribute('position');
redstoneTorchPos.array.forEach((value, index) => {
    if(index < 12) {
        // right face
        if(index%3 === 0) {
            redstoneTorchPos.array[index] = value/2;
        }
    } else if(index < 24) {
        // left face
        if(index%3 === 0) {
            redstoneTorchPos.array[index] = value/2;
        }
    } else if(index < 36) {
        // top face
        if(index%3 === 0 || index%3 === 2) {
            redstoneTorchPos.array[index] = value/2;
        }
        if(index%3 === 1) {
            redstoneTorchPos.array[index] = 5*value/6;
        }
    } else if(index < 48) {
        // bottom face
        if(index%3 === 0 || index%3 === 2) {
            redstoneTorchPos.array[index] = value/2;
        }
    } else if(index < 60) {
        // front face
        if(index%3 === 2) {
            redstoneTorchPos.array[index] = value/2;
        }
    } else if(index < 72) {
        // back face
        if(index%3 === 2) {
            redstoneTorchPos.array[index] = value/2;
        }
    }
})*/

/*let redstoneTorchTDS = [];
redstoneTorchTDS[DIRECTION.TOP] = [6/16, 7/16, 7/16, 8/16];
redstoneTorchTDS[DIRECTION.LEFT] = [5/16, 6/16, 6/16, 0];
redstoneTorchTDS[DIRECTION.BOTTOM] = [14/16, 7/16, 7/16, 0];
uvMap(custGeometry, redstoneTorchTDS);*/

//console.log(redstoneTorchGeometry);


geometries.halfTorch = new THREE.BoxGeometry(2/16, 5/16, 2/16);
let halfTorchTDS = [];
halfTorchTDS[DIRECTION.TOP] = [6/16, 7/16, 7/16, 8/16];
halfTorchTDS[DIRECTION.LEFT] = [6/16, 7/16, 7/16, 5/16];
halfTorchTDS[DIRECTION.BOTTOM] = [14/16, 7/16, 7/16, 0];
uvMap(geometries.halfTorch, halfTorchTDS);

geometries.torchHead = new THREE.BoxGeometry(2/16, 2/16, 2/16);
let torchHeadTDS = [];
torchHeadTDS[DIRECTION.TOP] = [6/16, 7/16, 7/16, 8/16];
torchHeadTDS[DIRECTION.LEFT] = [6/16, 7/16, 7/16, 8/16];
torchHeadTDS[DIRECTION.BOTTOM] = [14/16, 7/16, 7/16, 0];
uvMap(geometries.torchHead, torchHeadTDS);

// only visible from atop
geometries.topPlane = new THREE.PlaneGeometry();
geometries.topPlane.rotateX(-90 * DEG_TO_RAD);


function uvMap(geometry, texDisSet = [], allSidesEqual = true, rotateSidesCounterClockwise = false) {
    // set every side to the one given side
    if(allSidesEqual) {
        if(texDisSet[DIRECTION.LEFT] !== undefined) {
            texDisSet[DIRECTION.RIGHT] = texDisSet[DIRECTION.FRONT] = texDisSet[DIRECTION.BACK] = texDisSet[DIRECTION.LEFT];
        } else if(texDisSet[DIRECTION.RIGHT] !== undefined) {
            texDisSet[DIRECTION.LEFT] = texDisSet[DIRECTION.FRONT] = texDisSet[DIRECTION.BACK] = texDisSet[DIRECTION.RIGHT];
        } else if(texDisSet[DIRECTION.FRONT] !== undefined) {
            texDisSet[DIRECTION.LEFT] = texDisSet[DIRECTION.RIGHT] = texDisSet[DIRECTION.BACK] = texDisSet[DIRECTION.FRONT];
        } else if(texDisSet[DIRECTION.BACK] !== undefined) {
            texDisSet[DIRECTION.LEFT] = texDisSet[DIRECTION.RIGHT] = texDisSet[DIRECTION.FRONT] = texDisSet[DIRECTION.BACK];
        }
    }

    // for every missing face in texDisSet set default values
    texDisSet[DIRECTION.TOP] = texDisSet[DIRECTION.TOP] || [0, 0, 0, 0];
    texDisSet[DIRECTION.LEFT] = texDisSet[DIRECTION.LEFT] || [0, 0, 0, 0];
    texDisSet[DIRECTION.RIGHT] = texDisSet[DIRECTION.RIGHT] || [0, 0, 0, 0];
    texDisSet[DIRECTION.FRONT] = texDisSet[DIRECTION.FRONT] || [0, 0, 0, 0];
    texDisSet[DIRECTION.BACK] = texDisSet[DIRECTION.BACK] || [0, 0, 0, 0];
    texDisSet[DIRECTION.BOTTOM] = texDisSet[DIRECTION.BOTTOM] || [0, 0, 0, 0];

    // get uvCoordinates
    // 0-7 side1, 8-15 side2, 16-23 topOrBottom1, 24-31 topOrBottom2, 32-39 side3, 40-47 side4
    // x/y - topLeft, topRight, bottomLeft, bottomRight
    let uvGeometry = geometry.getAttribute('uv');

    // update uvCoordinates
    let baseArray = [];
    baseArray.push(...getRectUVCoordsArray(...texDisSet[DIRECTION.RIGHT], rotateSidesCounterClockwise)); // right
    baseArray.push(...getRectUVCoordsArray(...texDisSet[DIRECTION.LEFT], rotateSidesCounterClockwise)); // left
    baseArray.push(...getRectUVCoordsArray(...texDisSet[DIRECTION.TOP])); // top
    baseArray.push(...getRectUVCoordsArray(...texDisSet[DIRECTION.BOTTOM])); // bottom
    baseArray.push(...getRectUVCoordsArray(...texDisSet[DIRECTION.FRONT], rotateSidesCounterClockwise)); // front
    baseArray.push(...getRectUVCoordsArray(...texDisSet[DIRECTION.BACK], rotateSidesCounterClockwise)); // back

    uvGeometry.array = new Float32Array(baseArray);

    // set uvCoordinates
    geometry.setAttribute('uv', uvGeometry);
}

function getRectUVCoordsArray(disTop, disLeft, disRight, disBottom, rotateCounterClockwise) {
    if(rotateCounterClockwise) {
        return [1-disRight, 1-disTop,
            1-disRight, disBottom,
            disLeft, 1-disTop,
            disLeft, disBottom]
    }

    // topLeft, topRight, bottomLeft, bottomRight
    return [disLeft, 1-disTop,
        1-disRight, 1-disTop,
        disLeft, disBottom,
        1-disRight, disBottom]
}

export {geometries};
