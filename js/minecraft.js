"use strict"


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
// math
const DEG_TO_RAD = Math.PI/180;


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
    // create multi colored material arrays
    const redstoneDustLine0MaterialArray = [];
    for(let i = 0; i < 16; i++) {
        redstoneDustLine0MaterialArray.push( new THREE.MeshStandardMaterial( {map : redstoneDustLine0Texture, transparent : true, color : getRedstoneColor(i)} ) )
    }


    // create geometry
    const boxGeometry = new THREE.BoxGeometry();
    const topPlaneGeometry = new THREE.PlaneGeometry();   // only visible from atop
    topPlaneGeometry.rotateX(-90 * DEG_TO_RAD);


    // add 5x5 piston floor to scene
    for(let x = -2; x < 3; x++) {
        for(let z = -2; z < 3; z++) {
            addMeshToScene(scene, boxGeometry, pistonMaterials, x, 0, z, DIRECTION.TOP);
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
        addMeshToScene(scene, boxGeometry, smoothStoneMaterial, x, y, z);
    }
    addSmoothStoneBlockBtn.addEventListener('click', addSmoothStoneBlockEventListener)


    // add stuff on click
    const addStuffBtn = document.querySelector('#add-stuff');
    const addStuffEventListener = () => {
        // add 5 smooth stone blocks before and after floor
        for(let z = -7; z < -2; z++) {
            addMeshToScene(scene, boxGeometry, smoothStoneMaterial, 0, 0, z);
        }
        for(let z = 3; z < 8; z++) {
            addMeshToScene(scene, boxGeometry, smoothStoneMaterial, 0, 0, z);
        }

        // add redstone line powered 1 to 15
        for(let z = -7; z < 8; z++) {
            addMeshToScene(scene, topPlaneGeometry, redstoneDustLine0MaterialArray[z+8], 0, 0.5 + 1/128, z);
        }
    }
    addStuffBtn.addEventListener('click', addStuffEventListener);


    // animate
    function animate() {
        requestAnimationFrame(animate);

        controls.update();

        renderer.render(scene, camera);
    }

    animate();
})

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
    const BASE_REDSTONE_RED = 45;
    const MULT_REDSTONE_RED = 14;
    const MULT_REDSTONE_GREEN = 3;
    const MULT_REDSTONE_BLUE = 3;


    // mix redstone color
    // rgb have to be multiplied by 256*256, 256 and 1 respectfully, so that they can be added together afterwards (rgb is hex and stuff, you know?)
    return ((power*MULT_REDSTONE_RED+BASE_REDSTONE_RED)*256*256 + (power*MULT_REDSTONE_GREEN)*256 + (power*MULT_REDSTONE_BLUE));
}

// adds plane with redstone dust texture to scene
// TODO proper, different textures
function addRedstoneDustDotPlane(scene, power) {
    // get texture and keep pixelated
    const redstoneDustDotTexture = new THREE.TextureLoader().load('assets/minecraft/1.18.1/minecraft/textures/block/redstone_dust_line0.png');
    redstoneDustDotTexture.magFilter = THREE.NearestFilter;
    redstoneDustDotTexture.minFilter = THREE.NearestFilter;

    // create plane geometry
    const geometry = new THREE.PlaneGeometry();
    geometry.rotateX(-90 * DEG_TO_RAD)

    // set mesh parameters
    const color = new THREE.Color((power*14+45)/255, (power*3)/255, (power*3)/255);
    const material = new THREE.MeshStandardMaterial( {map : redstoneDustDotTexture, transparent : true, color : color.getHex()} )

    // add mesh to scene
    addMeshToScene(scene, geometry, material, 0, 0.5 + 1/128, 0);
}

function addMeshToScene(scene, geometry, material, x, y, z, facing = DIRECTION.TOP) {
    const object = new THREE.Mesh(geometry, material);

    switch(facing) {
        case DIRECTION.LEFT:
            object.rotateZ(90 * DEG_TO_RAD)
            break;
        case DIRECTION.RIGHT:
            object.rotateZ(-90 * DEG_TO_RAD)
            break;
        case DIRECTION.FRONT:
            object.rotateX(90 * DEG_TO_RAD);
            break;
        case DIRECTION.BACK:
            object.rotateX(-90 * DEG_TO_RAD);
            break;
        case DIRECTION.BOTTOM:
            object.rotateX(180 * DEG_TO_RAD);
            break;
    }

    object.position.set(x, y, z)
    scene.add(object);
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
