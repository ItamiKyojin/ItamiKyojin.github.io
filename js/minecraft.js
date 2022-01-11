"use strict"


/*
* TODO
*  -make Piston class and addPiston function
*  .  (GitHub update)
*  -Piston state-changes
*  -animate Pistons and following Blocks
*  -Piston logic
*  .  (GitHub update)
*  -textures for missing Redstone Components
*  .  (GitHub update)
*  -Redstone Component classes and functions
*  .  (GitHub update)
*  -Redstone logic
*  .  (GitHub update)
*  -AI Redstone construction
*  .  (GitHub update)
* */


// ---------- define global constants ----------
// enums
const DIRECTION = {
    TOP : 0,
    LEFT : 1,
    RIGHT : 2,
    FRONT : 3,
    BACK : 4,
    BOTTOM : 5
}
const REDSTONE_DIRECTION = {
    TOP : 0,
    LEFT_TOP : 1,
    LEFT : 2,
    LEFT_BOTTOM : 3,
    RIGHT_TOP : 4,
    RIGHT : 5,
    RIGHT_BOTTOM : 6,
    FRONT_TOP : 7,
    FRONT : 8,
    FRONT_BOTTOM : 9,
    BACK_TOP : 10,
    BACK : 11,
    BACK_BOTTOM : 12,
    BOTTOM : 13
}
// math
const DEG_TO_RAD = Math.PI/180;


// ---------- define classes ----------
class Array3d {
    constructor(lengthX, lengthY, lengthZ) {
        this.lengthX = lengthX;
        this.lengthY = lengthY;
        this.lengthZ = lengthZ;

        this.array = new Array(lengthX * lengthY * lengthZ);
    }

    get(x, y, z) {
        if(x >= this.lengthX || y >= this.lengthY || z >= this.lengthZ) {
            return undefined;
        }

        return this.array[x  +  y * this.lengthX  +  z * this.lengthX * this.lengthY]
    }

    set(x, y, z, value) {
        // maybe increase size
        if(x >= this.lengthX || y >= this.lengthY || z >= this.lengthZ) {
            let increaseBy = 5; // solid number to increase by
            while(x >= this.lengthX+increaseBy) {
                increaseBy += 5;
            }
            while(y >= this.lengthY+increaseBy) {
                increaseBy += 5;
            }
            while(z >= this.lengthZ+increaseBy) {
                increaseBy += 5;
            }

            let newArray3d = new Array3d(this.lengthX+increaseBy, this.lengthY+increaseBy, this.lengthZ+increaseBy);
            let newX = -1;
            let newY = -1;
            let newZ = -1;
            this.array.forEach((value, index) => {
                newX = index % (this.lengthY * this.lengthX) % this.lengthX;
                newY = ( (index - newX) % (this.lengthY * this.lengthX) ) / this.lengthX;
                newZ = ( index - newX - newY*this.lengthX ) / this.lengthY / this.lengthX;

                newArray3d.set(newX, newY, newZ, value);
            })
            this.lengthX = newArray3d.lengthX;
            this.lengthY = newArray3d.lengthY;
            this.lengthZ = newArray3d.lengthZ;
            this.array = newArray3d.array;
        }

        // set value
        this.array[x  +  y * this.lengthX  +  z * this.lengthX * this.lengthY] = value;
    }
}

// indices can be negative
class Array3dPlus {
    constructor() {
        this.array = new Array(8);
        this.array[0] = new Array3d(6, 6, 6);
        this.array[1] = new Array3d(5, 6, 6);
        this.array[2] = new Array3d(6, 5, 6);
        this.array[3] = new Array3d(5, 5, 6);
        this.array[4] = new Array3d(6, 6, 5);
        this.array[5] = new Array3d(5, 6, 5);
        this.array[6] = new Array3d(6, 5, 5);
        this.array[7] = new Array3d(5, 5, 5);
    }

    get(x, y, z) {
        let arrayIndex;
        [arrayIndex, x, y, z] = this.getPosNegArray(x, y, z);

        return this.array[arrayIndex].get(x, y, z);
    }

    set(x, y, z, value) {
        let arrayIndex;
        [arrayIndex, x, y, z] = this.getPosNegArray(x, y, z);

        this.array[arrayIndex].set(x, y, z, value);
    }

    getPosNegArray(x, y, z) {
        let arrayIndex = 0;
        if(x < 0) {
            arrayIndex += 1;
            x = -x - 1;
        }
        if(y < 0) {
            arrayIndex += 2;
            y = -y - 1;
        }
        if(z < 0) {
            arrayIndex += 4;
            z = -z - 1;
        }

        return [arrayIndex, x, y, z]
    }
}

class Block {
    constructor(name, meshes = [], transparent = false, powered = new Array(6), immovable = false) {
        this.name = name;
        this.meshes = meshes;
        this.transparent = transparent;
        this.powered = powered;
        this.immovable = immovable;
    }

    power(direction) {
        if(!this.transparent) {
            this.powered[direction] = true;
        }
    }

    depower(direction) {
        if(!this.transparent) {
            this.powered[direction] = false;
        }
    }
}

class RedstoneDust {
    constructor(meshes = [], powered = new Array(14), maxPower = 0) {
        this.meshes = meshes;
        this.powered = powered;
        this.maxPower = maxPower;
    }

    power(redstoneDirection, power) {
        this.powered[redstoneDirection] = power;
        this.updateMaxPower();
    }

    depower(redstoneDirection, power) {
        this.powered[redstoneDirection] = power;
        this.updateMaxPower();
    }

    updateMaxPower() {
        let maxPower = 0;
        this.powered.forEach(power => {
            if(power > maxPower) {
                maxPower = power;
            }
        })
        this.maxPower = maxPower;
    }
}

class Piston {
    constructor(meshes = [], facing = DIRECTION.TOP, powered = false, extended = false) {
        this.meshes = meshes;
        this.facing = facing;
        this.powered = powered;
        this.extended = extended;
    }
}


// do main
window.onload = (() => {
    // ---------- initiate some thee.js scene basics ----------
    // get canvas from html
    const canvas = document.querySelector('#minecraft-surface');
    // create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.75, 0.85, 0.8);
    // create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // create renderer
    const renderer = new THREE.WebGLRenderer({
        canvas : canvas
    })
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // set initial camera
    camera.position.set(0, .75, 5);


    // render scene for the first time (probably unnecessary?)
    renderer.render(scene, camera);


    // ---------- load textures ----------
    // create texture loader
    const loader = new THREE.TextureLoader();
    // create constant base path to assets
    const BLOCK_ASSET_PART_URL = 'assets/minecraft/1.18.1/minecraft/textures/block/';
    // load basic block textures
    const smoothStoneTexture = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'smooth_stone.png');
    // load block face textures
    const pistonTopTexture = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'piston_top.png');
    const pistonTopStickyTexture = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'piston_top_sticky.png');
    const pistonSideTexture = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'piston_side.png');
    const pistonInnerTexture = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'piston_inner.png');
    const pistonBottomTexture = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'piston_bottom.png');
    // load plane textures
    const redstoneDustDotTexture = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'redstone_dust_dot.png');
    const redstoneDustLine0Texture = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'redstone_dust_line0.png');


    // ---------- create materials ----------
    // create basic materials
    const smoothStoneMaterial = new THREE.MeshStandardMaterial( {map : smoothStoneTexture} );
    // create multi faced materials
    const pistonMaterials = create6FacedMaterial(pistonTopTexture, pistonSideTexture, pistonSideTexture, pistonSideTexture, pistonSideTexture, pistonBottomTexture);
    const pistonBaseMaterials = create6FacedMaterial(pistonInnerTexture, pistonSideTexture, pistonSideTexture, pistonSideTexture, pistonSideTexture, pistonBottomTexture);
    const pistonHeadMaterials = create6FacedMaterial(pistonTopTexture, pistonSideTexture, pistonSideTexture, pistonSideTexture, pistonSideTexture, pistonTopTexture);
    // create multi colored material arrays
    const redstoneDustLine0MaterialArray = [];
    for(let i = 0; i < 16; i++) {
        redstoneDustLine0MaterialArray.push( new THREE.MeshStandardMaterial( {map : redstoneDustLine0Texture, transparent : true, color : getRedstoneColor(i)} ) )
    }


    // ---------- create geometry ----------
    const boxGeometry = new THREE.BoxGeometry();

    const shaftGeometry = new THREE.BoxGeometry(0.25, 1, 0.25);
    // change uv mapping of shaft, so that the sides use the top 25% of the given texture rotated counterclockwise
    uvMap(shaftGeometry, 0.25, true, false, true);

    // reminder to shift in one direction by 1/8, as it is not a full block
    // generic name: box3_4BottomGeometry
    const pistonBaseGeometry = new THREE.BoxGeometry(1, 0.75, 1);
    // change uv mapping of pistonBase, so that the sides use the bottom 75% of the given texture
    uvMap(pistonBaseGeometry, 0.75);

    // reminder to shift in one direction by 3/8, as it is not a full block
    // generic name: box1_4TopGeometry
    const pistonHeadGeometry = new THREE.BoxGeometry(1, 0.25, 1);
    // change uv mapping of pistonHead, so that the sides use the top 25% of the given texture
    uvMap(pistonHeadGeometry, 0.25, true);

    // only visible from atop
    const topPlaneGeometry = new THREE.PlaneGeometry();
    topPlaneGeometry.rotateX(-90 * DEG_TO_RAD);


    // initiate blocks array
    const blocks = new Array3dPlus();


    // ---------- define functions requiring specific textures, materials, geometry and/or blocks ----------
    function addSmoothStoneBlock(x, y, z) {
        blocks.set(
            x, y, z,
            new Block('smooth_stone', [addMeshToScene(scene, boxGeometry, smoothStoneMaterial, x, y, z)])
        );
    }

    // should NOT be able to enter maxPower without powered[]
    function addRedstoneDust(x, y, z, maxPower) {
        blocks.set(
            x, Math.round(y), z,
            new RedstoneDust([addMeshToScene(scene, topPlaneGeometry, redstoneDustLine0MaterialArray[maxPower], x, y, z)])
        );
    }

    function addPiston(x, y, z, facing = DIRECTION.TOP) {
        blocks.set(
            x, y, z,
            new Piston([addMeshToScene(scene, boxGeometry, pistonMaterials, x, y, z, facing)], facing)
        )
    }


    // add 5x5 piston floor to scene
    for(let x = -2; x < 3; x++) {
        for(let z = -2; z < 3; z++) {
            //addSmoothStoneBlock(x, 0, z);
            addPiston(x, 0, z);
            /*addMeshToScene(scene, pistonHeadGeometry, pistonHeadMaterials, x, 1+3/8, z, DIRECTION.TOP);
            addMeshToScene(scene, shaftGeometry, pistonMaterials, x, 3/4, z, DIRECTION.TOP);
            addMeshToScene(scene, pistonBaseGeometry, pistonBaseMaterials, x, -1/8, z, DIRECTION.TOP);*/
        }
    }


    // add lighting to scene
    const pointLight = new THREE.PointLight(0x000000);
    pointLight.position.set(2, 2.5, 1.8);

    // somewhat minecraft light : 0xccc8cf
    const ambientLight = new THREE.AmbientLight(0xffffff);

    scene.add(pointLight, ambientLight);


    // add helper
    //const lightHelper = new THREE.PointLightHelper(pointLight);
    //const gridHelper = new THREE.GridHelper(200, 50);

    //scene.add(lightHelper, gridHelper);


    // orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);


    // add block at given position on click
    const addSmoothStoneBlockBtn = document.querySelector('#add-smooth-stone-block');
    const addSmoothStoneBlockEventListener = () => {
        const x = document.querySelector('#x').value;
        const y = document.querySelector('#y').value;
        const z = document.querySelector('#z').value;
        addSmoothStoneBlock(x, y, z);
    }
    addSmoothStoneBlockBtn.addEventListener('click', addSmoothStoneBlockEventListener)


    // add stuff on click
    const addStuffBtn = document.querySelector('#add-stuff');
    const addStuffEventListener = () => {
        // add 5 smooth stone blocks before and after floor
        let block = {'name' : 'smooth_stone', 'mesh' : undefined};
        for(let z = -7; z < -2; z++) {
            addSmoothStoneBlock(0, 0, z);
        }
        for(let z = 3; z < 8; z++) {
            addSmoothStoneBlock(0, 0, z);
        }

        // add redstone line powered 1 to 15
        block.name = 'redstone_dust';
        for(let z = -7; z < 8; z++) {
            addRedstoneDust(0, 0.5 + 1/64, z, z+8);
        }
    }
    addStuffBtn.addEventListener('click', addStuffEventListener);


    // remove all meshes from scene on click
    const removeMeshesBtn = document.querySelector('#remove-meshes');
    const removeMeshesEventListener = () => {
        removeAllMeshesFromScene(blocks, scene);
    }
    removeMeshesBtn.addEventListener('click', removeMeshesEventListener);


    // add all meshes to scene on click
    const addMeshesBtn = document.querySelector('#add-meshes');
    const addMeshesEventListener = () => {
        addAllMeshesToScene(blocks, scene);
    }
    addMeshesBtn.addEventListener('click', addMeshesEventListener);


    // animate
    function animate() {
        requestAnimationFrame(animate);

        controls.update();

        renderer.render(scene, camera);
    }

    animate();
})

// !WARNING! doRotate90DegreesCounterClockwise = true (currently) REQUIRES doCheckSidesOnly = false
function uvMap(geometry, percentOfTexture, doTopPartOfTexture = false, doCheckSidesOnly = true, doRotate90DegreesCounterClockwise = false) {
    let uv = geometry.getAttribute('uv');

    // only take top 25% (4px) of piston_side.png
    let checkSidesOnly = (index) => {
        if(doCheckSidesOnly) return index < 16 || index >= 32;
        return true;
    }
    let a = 1;
    let b = 1;
    if(doRotate90DegreesCounterClockwise) {
        b = 0;
    }
    if(doTopPartOfTexture) {
        a = 0;
        percentOfTexture = 1 - percentOfTexture;
    }
    uv.array.forEach((value, index) => {
        if(value === a && index%2 === b && checkSidesOnly(index)) {
            uv.array[index] = percentOfTexture;
        }
    })

    // rotate 90 degrees counterclockwise
    if(doRotate90DegreesCounterClockwise) {
        for (let i = 0; i < 1; i++) {
            let temp = uv.array[0];
            uv.array.forEach((value, index) => {
                if (index !== 0) {
                    uv.array[index - 1] = value;
                }
            })
            uv.array[uv.array.length - 1] = temp;
        }
    }

    geometry.setAttribute('uv', uv)
}

function loadTextureWithNearestFilter(loader, url) {
    const texture = loader.load(url);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
}

function create6FacedMaterial(topTexture, leftTexture, rightTexture, frontTexture, backTexture, bottomTexture) {
    // Create an array of materials to be used in a cube, one for each side
    let materialArray = [];

    // order to add materials: x+,x-,y+,y-,z+,z-
    materialArray.push( new THREE.MeshStandardMaterial( {map : leftTexture} ) );
    materialArray.push( new THREE.MeshStandardMaterial( {map : rightTexture} ) );
    materialArray.push( new THREE.MeshStandardMaterial( {map : topTexture} ) );
    materialArray.push( new THREE.MeshStandardMaterial( {map : bottomTexture} ) );
    materialArray.push( new THREE.MeshStandardMaterial( {map : frontTexture} ) );
    materialArray.push( new THREE.MeshStandardMaterial( {map : backTexture} ) );

    return new THREE.MeshFaceMaterial( materialArray );
}

function getRedstoneColor(power) {
    // create redstone color constants
    const BASE_REDSTONE_RED = 90;
    const BASE_REDSTONE_GREEN = 15;
    const BASE_REDSTONE_BLUE = 15;

    const MULT_REDSTONE_RED = 11;
    const MULT_REDSTONE_GREEN = 4;
    const MULT_REDSTONE_BLUE = 4;


    // mix redstone color
    // rgb have to be multiplied by 256*256, 256 and 1 respectfully, so that they can be added together afterwards (rgb is hex and stuff, you know?)
    return ((power*MULT_REDSTONE_RED+BASE_REDSTONE_RED)*256*256
        + (power*MULT_REDSTONE_GREEN+BASE_REDSTONE_GREEN)*256
        + (power*MULT_REDSTONE_BLUE+BASE_REDSTONE_BLUE));
}

function addMeshToScene(scene, geometry, material, x, y, z, facing = DIRECTION.TOP) {
    const mesh = new THREE.Mesh(geometry, material);

    switch(facing) {
        case DIRECTION.LEFT: mesh.rotateZ(90 * DEG_TO_RAD); break;
        case DIRECTION.RIGHT: mesh.rotateZ(-90 * DEG_TO_RAD); break;
        case DIRECTION.FRONT: mesh.rotateX(90 * DEG_TO_RAD); break;
        case DIRECTION.BACK: mesh.rotateX(-90 * DEG_TO_RAD); break;
        case DIRECTION.BOTTOM: mesh.rotateX(180 * DEG_TO_RAD); break;
    }

    mesh.position.set(x, y, z)
    scene.add(mesh);

    return mesh;
}

function addAllMeshesToScene(blocks, scene) {
    for(let i = 0; i < 8; i++) {
        blocks.array[i].array.forEach(block => {
            block.meshes.forEach(mesh => {
                scene.add(mesh)
            })
        })
    }
}

function removeAllMeshesFromScene(blocks, scene) {
    for(let i = 0; i < 8; i++) {
        blocks.array[i].array.forEach(block => {
            block.meshes.forEach(mesh => {
                scene.remove(mesh)
            })
        })
    }
}

/*
class powerTask{
    constructor(worldTicks, priority, power, strength, level, x, y, z) {
        // EVERY!!! task has these
        this.worldTicks = worldTicks;   // worldTicks until execution (1 worldTick = 0.5 redstoneTicks)
        this.priority = priority;   // defines order of execution, the smaller, the earlier the execution
        // this specific task has these
        this.action = 'power';      // identifies generic task as power task
        this.power = power;         // true means to power, false means to depower
        this.strength = strength;   // weak means can power anything that requires redstone, strong can also power blocks and similar
        this.level = level;         // redstone signal strength, reduces by 1 every block
        // every??? task has these
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
 */

/*
// 3dBlocksArray
// initiate array that contains all blocks filled with air 5x5x5
let lengthX = 5;
let lengthY = 5;
let lengthZ = 5;
let blocks = new Array(lengthX * lengthY * lengthZ);
for (let i = 0; i < lengthX*lengthY*lengthZ; i++) {
    blocks[i] = {'name' : 'air'};
}

// set floor to smooth_stone
for (let x = 0; x < lengthX; x++) {
    for (let z = 0; z < lengthZ; z++) {
        blocks[index3dArray(x, 0, z, lengthX, lengthY)] = {'name' : 'smooth_stone'};
    }
}

// set some other example blocks
// blocks[index3dArray(3, 1, 1, lengthX, lengthY)] = {'name' : 'redstone_dust', 'lines' : [], 'powered' : []};
blocks[index3dArray(1, 1, 2, lengthX, lengthY)] = {'name' : 'piston', 'facing' : 'left'};
blocks[index3dArray(2, 1, 1, lengthX, lengthY)] = {'name' : 'piston', 'facing' : 'back'};
blocks[index3dArray(3, 1, 2, lengthX, lengthY)] = {'name' : 'piston', 'facing' : 'right'};
blocks[index3dArray(2, 1, 3, lengthX, lengthY)] = {'name' : 'piston', 'facing' : 'front'};
 */

/*
// main render loop ((~?) 60FPS default)
let curFrame = 0;
let defaultFrameRate = 60;
let loop = () => {
    // 20 Ticks per Second
    // 10 Redstone Ticks per Second

    curFrame %= defaultFrameRate;

    if(curFrame%3 === 0) {
        // do gameLoop
        // TODO
    }

    curFrame++;
    requestAnimationFrame(loop);
};
requestAnimationFrame(loop);
 */

/*
// reverse engineer 3dTo1dArrayIndices
ox = index % (lengthY * lengthX) % lengthX; // block.coords[0] * 2;
oy = ( (index - ox) % (lengthY * lengthX) ) / lengthX; // block.coords[1] * 2;
oz = ( index - ox - oy*lengthX ) / lengthY / lengthX; // block.coords[2] * 2;
 */

/*
function updateMinecraftWorld() {
    /// initialize some stuff (that should probably be passed in and returned later on)
    // directional constants
    const TOP = 0;
    const LEFT = 1;
    const RIGHT = 2;
    const FRONT = 3;
    const BACK = 4;
    const BOTTOM = 5;

    // some temporary variable to dissect result arrays
    let results;

    // array that contains all blocks
    let lengthX = 5;
    let lengthY = 5;
    let lengthZ = 5;
    let blocks = new Array(lengthX * lengthY * lengthZ);
    blocks.forEach((_, index) => {
        blocks[index] = {'name' : 'air'};
    })
    blocks[index3dArray(2, 0, 1, lengthX, lengthY)] = {'name' : 'smooth_stone'};
    blocks[index3dArray(3, 0, 1, lengthX, lengthY)] = {'name' : 'smooth_stone'};
    blocks[index3dArray(2, 1, 1, lengthX, lengthY)] = {'name' : 'lever', 'facing' : 'bottom', 'state' : 'off'};
    blocks[index3dArray(3, 1, 1, lengthX, lengthY)] = {'name' : 'redstone_dust', 'facing' : [], 'powered' : []};
    blocks = shapeRedstoneDust(blocks);

    // array that contains all scheduled tasks
    let scheduledTasks = [{'worldTicks' : 20, 'priority' : 0, 'action' : 'click', 'x' : 2, 'y' : 1, 'z' : 1, 'facing' : BOTTOM}];



    // while (in scheduledTasks at least 1 task with 0 worldTicks)
    while(isWorldTicksZero(scheduledTasks)) {
        // go through scheduledTasks
        scheduledTasks.forEach((task, index) => {
            // execute every task with worldTicks = 0
            if(task.worldTicks === 0) {
                results = executeTask(task, blocks, lengthX, lengthY, scheduledTasks);
                blocks = results[0];
                scheduledTasks = results[1];
            }
        })
    }


    // go through scheduledTasks
    scheduledTasks.forEach((_, index) => {
        // reduce each worldTicks until execution by 1
        scheduledTasks[index].worldTicks = scheduledTasks[index].worldTicks - 1;
    })
}
 */

/*
function index3dArray(x, y, z, lengthX, lengthY) {
    return x + y * lengthX + z * lengthX * lengthY;
}
 */

/*
function shapeRedstoneDust(blocks) {
    // TODO

    return blocks;
}
 */

/*
function executeTask(task, blocks, lengthX, lengthY, scheduledTasks) {
    // {'worldTicks' : 20, 'priority' : 0, 'action' : 'click', 'x' : 2, 'y' : 1, 'z' : 1, 'facing' : 'bottom'}
    // strength : strong can power blocks and hence adjacent objects, while weak can't
    switch (task.action) {
        case 'click':
            let block = blocks[index3dArray(task.x, task.y, task.z, lengthX, lengthY)];
            switch (block.name) {
                case 'lever':
                    if(block.state === 'off') {
                        blocks[index3dArray(task.x, task.y, task.z, lengthX, lengthY)].state = 'on';
                        scheduledTasks = addTask(scheduledTasks, new powerTask(0, 0, true, 'weak', 15, task.x - 1, task.y, task.z));
                        scheduledTasks = addTask(scheduledTasks, new powerTask(0, 0, true, 'weak', 15, task.x + 1, task.y, task.z));
                        scheduledTasks = addTask(scheduledTasks, new powerTask(0, 0, true, 'weak', 15, task.x, task.y - 1, task.z));
                        scheduledTasks = addTask(scheduledTasks, new powerTask(0, 0, true, 'weak', 15, task.x, task.y, task.z - 1));
                        scheduledTasks = addTask(scheduledTasks, new powerTask(0, 0, true, 'weak', 15, task.x, task.y, task.z + 1));
                        scheduledTasks = addTask(scheduledTasks, new powerTask(0, 0, true, 'strong', 15,
                            task.x  -Math.pow(2, (block.facing+5)%6)%2  +Math.pow(2, (block.facing+4)%6)%2,
                            task.y  +Math.pow(2, (block.facing+6)%6)%2  -Math.pow(2, (block.facing+1)%6)%2,
                            task.z  -Math.pow(2, (block.facing+3)%6)%2  +Math.pow(2, (block.facing+2)%6)%2));
                    } else {
                        blocks[index3dArray(task.x, task.y, task.z, lengthX, lengthY)].state = 'on';
                        scheduledTasks = addTask(scheduledTasks, new powerTask(0, 0, false, 'weak', 15, task.x - 1, task.y, task.z));
                        scheduledTasks = addTask(scheduledTasks, new powerTask(0, 0, false, 'weak', 15, task.x + 1, task.y, task.z));
                        scheduledTasks = addTask(scheduledTasks, new powerTask(0, 0, false, 'weak', 15, task.x, task.y - 1, task.z));
                        scheduledTasks = addTask(scheduledTasks, new powerTask(0, 0, false, 'weak', 15, task.x, task.y, task.z - 1));
                        scheduledTasks = addTask(scheduledTasks, new powerTask(0, 0, false, 'weak', 15, task.x, task.y, task.z + 1));
                        scheduledTasks = addTask(scheduledTasks, new powerTask(0, 0, false, 'strong', 15,
                            task.x  -Math.pow(2, (block.facing+5)%6)%2  +Math.pow(2, (block.facing+4)%6)%2,
                            task.y  +Math.pow(2, (block.facing+6)%6)%2  -Math.pow(2, (block.facing+1)%6)%2,
                            task.z  -Math.pow(2, (block.facing+3)%6)%2  +Math.pow(2, (block.facing+2)%6)%2));
                    }
                    break;
                case 'redstone_dust':
                    break;
            }
            break;
    }
    // TODO

    return [blocks, scheduledTasks];
}
 */

/*
function addTask(scheduledTasks, task) {
    // add task at the end of corresponding priority
    // TODO

    return scheduledTasks;
}

function isWorldTicksZero(scheduledTasks) {
    scheduledTasks.forEach(task => {
        if(task.worldTicks === 0) {
            return true;
        }
    })

    return false;
}
 */
