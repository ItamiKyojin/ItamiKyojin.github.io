"use strict"


import {DIRECTION, DEG_TO_RAD} from './minecraft/globals.js';
import {geometries} from './minecraft/geometries.js';
import {materials} from './minecraft/materials.js';


/*
* TODO
*  -textures for missing Redstone Components
*  .  (GitHub update)
*  -Redstone Component classes and functions
*  .  (GitHub update)
*  -Redstone logic
*  .  (GitHub update)
*  -AI Redstone construction
*  .  (GitHub update)
*  -fix Piston Shaft Animation
*  -add Piston Push Limit
*  .  (GitHub update)
* */


// ---------- define global constants ----------
// enums
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
const ANIMATE_TASK_TYPE = {
    MOVE : 0,
    ADD_TO_SCENE : 1,
    REMOVE_FROM_SCENE : 2
}

// math
const DEFAULT_FRAME_RATE = 60;
const GAME_TICKS_PER_SECOND = 20;
const REDSTONE_TICKS_PER_SECOND = 10;
const FRAMES_PER_GAME_TICK = DEFAULT_FRAME_RATE / GAME_TICKS_PER_SECOND;


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
    constructor(name, meshes = [], transparent = false, powered = new Array(6), pushable = true, immovable = false) {
        this.name = name;
        this.meshes = meshes;
        this.transparent = transparent;
        this.powered = powered;
        this.pushable = pushable;
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
    constructor(meshes = [], powered = new Array(14), maxPower = 0, pushable = false, immovable = false) {
        this.meshes = meshes;
        this.powered = powered;
        this.maxPower = maxPower;
        this.pushable = pushable;
        this.immovable = immovable;
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
    constructor(meshes = [], facing = DIRECTION.TOP, powered = false, extended = false, immovable = false) {
        this.meshes = meshes;
        this.facing = facing;
        this.powered = powered;
        this.extended = extended;
        this.pushable = true;
        this.immovable = immovable;
    }

    update() {
        if(this.powered && !this.extended) {
            // attempt to extend
        }

        if(!this.powered && this.extended) {
            // retract
        }

        // update surrounding blocks
        // !WARNING! don't update the Block you got updated by OR updating Blocks can't be updated OR who knows
    }
}

class Repeater {
    constructor(meshes = [], facing = DIRECTION.FRONT, powered = false) {
        this.meshes = meshes;
        this.facing = facing;
        this.powered = powered;
        this.pushable = false;
        this.immovable = false;
    }
}

class PistonHead {
    constructor(meshes = [], facing = DIRECTION.TOP, pushable = true, immovable = false) {
        this.meshes = meshes;
        this.facing = facing;
        this.pushable = pushable;
        this.immovable = immovable;
    }
}

class AnimateMoveTask {
    constructor(meshes, disX, disY, disZ, frames) {
        this.type = ANIMATE_TASK_TYPE.MOVE;
        this.meshes = meshes;
        this.disX = disX;
        this.disY = disY;
        this.disZ = disZ;
        this.frames = frames;
        this.framesPassed = 0;
    }
}

class AddToSceneTask {
    constructor(meshes, scene, frames) {
        this.type = ANIMATE_TASK_TYPE.ADD_TO_SCENE;
        this.meshes = meshes;
        this.scene = scene;
        this.frames = frames;
        this.framesPassed = 0;
    }
}

class RemoveFromSceneTask {
    constructor(meshes, scene, frames) {
        this.type = ANIMATE_TASK_TYPE.REMOVE_FROM_SCENE;
        this.meshes = meshes;
        this.scene = scene;
        this.frames = frames;
        this.framesPassed = 0;
    }
}


// do main
window.onload = (() => main())

function main() {
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
    // Already done in minecraft/textures.js.


    // ---------- create materials ----------
    // Already done in minecraft/materials.js.


    // ---------- create geometry ----------
    // Already done in minecraft/geometries.js.


    // ---------- initiate great array ----------
    const blocks = new Array3dPlus();
    const animations = [];


    // ---------- define functions requiring specific textures, materials, geometry and/or blocks ----------
    // TODO ALLES auslagern


    // should NOT be able to enter maxPower without powered[]
    function addRedstoneDust(x, y, z, maxPower) {
        blocks.set(
            x, Math.round(y), z,
            new RedstoneDust([addMeshToScene(scene, geometries.topPlane, materials.redstoneDustLine0Array[maxPower], x, y, z)])
        );
    }

    function addPiston(x, y, z, facing = DIRECTION.TOP) {
        // as blocks are being created, they are being created in the center of the grid
        // BUT, as e.g. a piston isn't made up of simply a whole block, but multiple parts
        // they have to be pushed to their respective positions
        const PISTON_HEAD_OFFSET = 3/8;
        const PISTON_SHAFT_OFFSET = -1/4;
        const PISTON_BASE_OFFSET = -1/8;

        let xOffset = (offset) => {
            if(facing === DIRECTION.RIGHT) return offset;
            if(facing === DIRECTION.LEFT) return -offset;
            return 0;
        }

        let yOffset = (offset) => {
            if(facing === DIRECTION.TOP) return offset;
            if(facing === DIRECTION.BOTTOM) return -offset;
            return 0;
        }

        let zOffset = (offset) => {
            if(facing === DIRECTION.FRONT) return offset;
            if(facing === DIRECTION.BACK) return -offset;
            return 0;
        }

        blocks.set(
            x, y, z,
            new Piston([
                addMeshToScene(scene, geometries.box, materials.piston, x, y, z, facing),
                createMesh(geometries.pistonBase, materials.pistonBase,
                    x + xOffset(PISTON_BASE_OFFSET),
                    y + yOffset(PISTON_BASE_OFFSET),
                    z + zOffset(PISTON_BASE_OFFSET), facing),
                createMesh(geometries.shaft, materials.piston,
                    x + xOffset(PISTON_SHAFT_OFFSET),
                    y + yOffset(PISTON_SHAFT_OFFSET),
                    z + zOffset(PISTON_SHAFT_OFFSET), facing),
                createMesh(geometries.pistonHead, materials.pistonHead,
                    x + xOffset(PISTON_HEAD_OFFSET),
                    y + yOffset(PISTON_HEAD_OFFSET),
                    z + zOffset(PISTON_HEAD_OFFSET), facing)
            ], facing)
        );
    }

    function addRepeater(x, y, z, facing = DIRECTION.FRONT) {
        let [dirX, dirY, dirZ] = directionToArrayXYZ(facing);

        // add diodeBase to scene
        const diodeBase = addMeshToScene(scene, geometries.diodeBase, materials.repeater, x, y - 7/16, z, facing);

        // correct rotation to be flat/horizontal on blocks
        switch(facing) {
            case DIRECTION.LEFT: diodeBase.rotateZ(-90 * DEG_TO_RAD); diodeBase.rotateY(90 * DEG_TO_RAD); break;
            case DIRECTION.RIGHT: diodeBase.rotateZ(90 * DEG_TO_RAD); diodeBase.rotateY(270 * DEG_TO_RAD); break;
            case DIRECTION.FRONT: diodeBase.rotateX(-90 * DEG_TO_RAD); diodeBase.rotateY(180 * DEG_TO_RAD); break;
            case DIRECTION.BACK: diodeBase.rotateX(90 * DEG_TO_RAD); break;
        }

        // add both halfTorches to scene
        const movableTorch = addMeshToScene(scene, geometries.halfTorch, materials.redstoneTorchOff, x + (dirX * 1/16), y - 3/16 - 1/32, z + (dirZ * 1/16), DIRECTION.TOP);
        const immovableTorch = addMeshToScene(scene, geometries.halfTorch, materials.redstoneTorchOff, x + (dirX * 5/16), y - 3/16 - 1/32, z + (dirZ * 5/16), DIRECTION.TOP);

        // add repeater to blocks array
        blocks.set(x, y, z, new Repeater([diodeBase, immovableTorch, movableTorch], facing))
    }


    // add 5x5 piston floor to scene
    for(let x = -2; x < 3; x++) {
        for(let z = -2; z < 3; z++) {
            //addSmoothStoneBlock(blocks, scene, x, 0, z);
            addPiston(x, 0, z, DIRECTION.TOP);
        }
    }

    addPiston(-1, 1, 2, DIRECTION.BOTTOM);


    // add some torches
    /*addMeshToScene(scene, geometries.torch, materials.redstoneTorch, x, y, z, DIRECTION.TOP);
    addMeshToScene(scene, geometries.halfTorch, materials.redstoneTorch, x, y, z, DIRECTION.TOP);
    addMeshToScene(scene, geometries.torchHead, materials.redstoneTorch, x, y, z, DIRECTION.TOP);

    addMeshToScene(scene, geometries.torch, materials.redstoneTorchOff, x, y, z, DIRECTION.TOP);
    addMeshToScene(scene, geometries.halfTorch, materials.redstoneTorchOff, x, y, z, DIRECTION.TOP);
    addMeshToScene(scene, geometries.torchHead, materials.redstoneTorchOff, x, y, z, DIRECTION.TOP);*/


    // add some diodes
    addRepeater(0, 1, 0, DIRECTION.BACK);


    // add lighting to scene
    addLight(scene);


    // add helper
    /*
    //const lightHelper = new THREE.PointLightHelper(pointLight);
    //const gridHelper = new THREE.GridHelper(200, 50);

    //scene.add(lightHelper, gridHelper);
    */


    // orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);


    // add mode buttons
    const deleteModeBtn = document.querySelector('#delete-mode');
    const deleteModeEventListener = (event) => {
        removeSelectedClass()
        event.currentTarget.classList.add("selected")
        // update event listener
        removeMouseEventListener(deleteBlock)
        removeMouseEventListener(placeBlock)
        removeMouseEventListener(doNothing)
        addMouseEventListener(deleteBlock)
    }
    deleteModeBtn.addEventListener('click', deleteModeEventListener);

    const createModeBtn = document.querySelector('#create-mode');
    const createModeEventListener = (event) => {
        removeSelectedClass()
        event.currentTarget.classList.add("selected")
        // update event listener
        removeMouseEventListener(deleteBlock)
        removeMouseEventListener(placeBlock)
        removeMouseEventListener(doNothing)
        addMouseEventListener(placeBlock)
    }
    createModeBtn.addEventListener('click', createModeEventListener);

    const interactModeBtn = document.querySelector('#interact-mode');
    const interactModeEventListener = (event) => {
        removeSelectedClass()
        event.currentTarget.classList.add("selected")
        // update event listener
        removeMouseEventListener(deleteBlock)
        removeMouseEventListener(placeBlock)
        removeMouseEventListener(doNothing)
        addMouseEventListener(doNothing)
    }
    interactModeBtn.addEventListener('click', interactModeEventListener);

    function removeSelectedClass() {
        [deleteModeBtn, createModeBtn, interactModeBtn].forEach(button => {
            button.classList.remove("selected")
        })
    }

    function doNothing() {
        console.log("Nothing")
    }

    const numSlots = 9
    createHotbar(numSlots)
    createSelectSlot(0, numSlots)

    // add stuff on click
    /* const addStuffBtn = document.querySelector('#add-stuff');
    const addStuffEventListener = () => {
        // add 5 smooth stone blocks before and after floor
        let block = {'name' : 'smooth_stone', 'mesh' : undefined};
        for(let z = -7; z < -2; z++) {
            addSmoothStoneBlock(blocks, scene, 0, 0, z);
        }
        for(let z = 3; z < 8; z++) {
            addSmoothStoneBlock(blocks, scene, 0, 0, z);
        }

        // add redstone line powered 1 to 15
        block.name = 'redstone_dust';
        for(let z = -7; z < 8; z++) {
            addRedstoneDust(0, 0.5 + 1/64, z, z+8);
        }
    }
    addStuffBtn.addEventListener('click', addStuffEventListener); */


    // remove all meshes from scene on click
    /*const removeMeshesBtn = document.querySelector('#remove-meshes');
    const removeMeshesEventListener = () => {
        removeAllMeshesFromScene(blocks, scene);
    }
    removeMeshesBtn.addEventListener('click', removeMeshesEventListener);*/


    // add all meshes to scene on click
    /*const addMeshesBtn = document.querySelector('#add-meshes');
    const addMeshesEventListener = () => {
        addAllMeshesToScene(blocks, scene);
    }
    addMeshesBtn.addEventListener('click', addMeshesEventListener);*/


    // remove all meshes from scene on click
    // const actPistonBtn = document.querySelector('#extend-retract-piston');
    const actPistonEventListener = () => {
        // get piston @002
        /*let x, y, z;
        [x, y, z] = [0, 0, 2];*/
        const x = parseInt(document.querySelector('#x').value);
        const y = parseInt(document.querySelector('#y').value);
        const z = parseInt(document.querySelector('#z').value);
        const piston = blocks.get(x, y, z);

        // get directional x y z (basically two 0s and one 1 or -1)
        let dirX, dirY, dirZ;
        [dirX, dirY, dirZ] = directionToArrayXYZ(piston.facing);

        // either extend or retract
        if(!piston.extended) {
            // ---------- extend ----------
            // power piston
            piston.powered = true;

            // piston logic
            let extendable;
            let moveBlocks = [];
            [extendable,  moveBlocks] = pistonLogic(blocks, scene, x, y, z, dirX, dirY, dirZ);

            // extend piston
            if(extendable) {
                // update piston state
                piston.extended = true;
                piston.immovable = true;

                // move other blocks
                moveBlocks.reverse();
                moveBlocks.forEach((block, index) => {
                    let offsetMultiplier = (moveBlocks.length+1-index);
                    blocks.set(x + dirX * offsetMultiplier, y + dirY * offsetMultiplier, z + dirZ * offsetMultiplier, block);
                    animations.push(new AnimateMoveTask(block.meshes, dirX, dirY, dirZ, 2 * FRAMES_PER_GAME_TICK));
                });

                // remove base piston mesh
                scene.remove(piston.meshes[0]);

                // add extended piston meshes
                scene.add(piston.meshes[1]);
                scene.add(piston.meshes[2]);
                scene.add(piston.meshes[3]);

                // move meshes from piston to pistonHead
                const pistonHeadMeshes = [];
                pistonHeadMeshes.push(piston.meshes.pop());
                pistonHeadMeshes.push(piston.meshes.pop());
                blocks.set(x + dirX, y + dirY, z + dirZ, new PistonHead(pistonHeadMeshes, piston.facing));

                // move pistonHeadMeshes up
                animations.push(new AnimateMoveTask(pistonHeadMeshes, dirX, dirY, dirZ, 2 * FRAMES_PER_GAME_TICK));
            }
        } else {
            // ---------- retract ----------
            // get directional x y z
            let dirX, dirY, dirZ;
            [dirX, dirY, dirZ] = directionToArrayXYZ(piston.facing);

            // get pistonHead
            const pistonHead = blocks.get(x+dirX, y+dirY, z+dirZ);

            // depower piston
            piston.powered = false;
            piston.extended = false;
            piston.immovable = false;

            // add base piston mesh
            animations.push(new AddToSceneTask([piston.meshes[0]], scene, 2 * FRAMES_PER_GAME_TICK))

            // remove extended piston meshes
            animations.push(new RemoveFromSceneTask(
                [piston.meshes[1], pistonHead.meshes[0], pistonHead.meshes[1]],
                scene,
                2 * FRAMES_PER_GAME_TICK)
            )

            // move meshes from pistonHead to piston
            piston.meshes.push(pistonHead.meshes.pop());
            piston.meshes.push(pistonHead.meshes.pop());

            // remove pistonHead from blocks
            blocks.set(x+dirX, y+dirY, z+dirZ, undefined);

            // move pistonHeadMeshes (now again pistonMeshes) down
            animations.push(new AnimateMoveTask([piston.meshes[2], piston.meshes[3]], -dirX, -dirY, -dirZ, 2 * FRAMES_PER_GAME_TICK));
        }
    }
    // actPistonBtn.addEventListener('click', actPistonEventListener);

    // add blocks on double click
    const raycaster = new THREE.Raycaster()

    addMouseEventListener(placeBlock)

    function addMouseEventListener(eventListener) {
        if ('ontouchstart' in window) {
            // console.log('mobile')
            canvas.addEventListener('click', eventListener)
        } else {
            // console.log('pc')
            canvas.addEventListener('dblclick', eventListener)
        }
    }

    function removeMouseEventListener(eventListener) {
        if ('ontouchstart' in window) {
            // console.log('mobile')
            canvas.removeEventListener('click', eventListener)
        } else {
            // console.log('pc')
            canvas.removeEventListener('dblclick', eventListener)
        }
    }

    function placeBlock(event) {
        let sceneMeshes = getAllMeshes(blocks)

        const mouse = {
            x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
            y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
        }
        raycaster.setFromCamera(mouse, camera)

        const intersects = raycaster.intersectObjects(sceneMeshes, false)

        if (intersects.length > 0) {
            const position = new THREE.Vector3()
            position.copy(intersects[0].object.position)
            const clickPosition = intersects[0].point
            const measures = intersects[0].object.geometry.parameters

            if((clickPosition.x - measures.width/2) === position.x) {
                position.setX(position.x + 1)
            } else if((clickPosition.y - measures.height/2) === position.y) {
                position.setY(position.y + 1)
            } else if((clickPosition.z - measures.depth/2) === position.z) {
                position.setZ(position.z + 1)
            } else if((clickPosition.x + measures.width/2) === position.x) {
                position.setX(position.x - 1)
            } else if((clickPosition.y + measures.height/2) === position.y) {
                position.setY(position.y - 1)
            } else if((clickPosition.z + measures.depth/2) === position.z) {
                position.setZ(position.z - 1)
            }

            for (const [key, value] of Object.entries(position)) {
                position[key] = Math.round(value)
            }

            addSmoothStoneBlock(blocks, scene, position.x, position.y, position.z)
        }
    }

    function deleteBlock(event) {
        let sceneMeshes = getAllMeshes(blocks)

        const mouse = {
            x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
            y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
        }
        raycaster.setFromCamera(mouse, camera)

        const intersects = raycaster.intersectObjects(sceneMeshes, false)

        if (intersects.length > 0) {
            const position = new THREE.Vector3()
            position.copy(intersects[0].object.position)
            for (const [key, value] of Object.entries(position)) {
                position[key] = Math.round(value)
            }
            destroyBlock(blocks, scene, position.x, position.y, position.z)
        }
    }


    // animate
    let curFrame = 0;
    function animate() {
        // loop
        requestAnimationFrame(animate);


        // logic
        curFrame %= DEFAULT_FRAME_RATE;

        // act once every game tick
        if(curFrame % FRAMES_PER_GAME_TICK === 0) {
            // do gameLoop
            // TODO
        }

        // animate (act every frame)
        animations.forEach((animateTask, index) => {
            // do animation and check, whether it has been completed
            if(doAnimation(animateTask)) {
                animations.splice(index, 1);
            }
        })

        curFrame++;


        // update controls
        controls.update();

        // render scene
        renderer.render(scene, camera);
    }

    animate();
}



function createHotbar(numSlots) {
    const itemSection = document.querySelector('#items');

    for(let i = 0; i < numSlots; i++){
        const offset = (-25 * (numSlots - 1)) + (50 * i)
        const borderImg = document.createElement("img");
        borderImg.src = "assets/minecraft/1.18.1/minecraft/textures/gui/slot_border.png"
        borderImg.classList.add("border", "item")
        borderImg.style.cssText = `margin-left:${offset-2.5}px;`
        itemSection.appendChild(borderImg)
    }
    for(let i = 0; i < numSlots; i++){
        const offset = (-25 * (numSlots - 1)) + (50 * i)
        const slotImg = document.createElement("img");
        slotImg.src = `assets/minecraft/1.18.1/minecraft/textures/gui/slot_${i}.png`
        slotImg.classList.add("item")
        slotImg.style.cssText = `margin-left:${offset}px;`
        slotImg.addEventListener("click", () => {selectSlot(i, numSlots)})
        itemSection.appendChild(slotImg)
    }
}

function createSelectSlot(selectedSlot, numSlots) {
    const offset = (-25 * (numSlots - 1)) + (50 * selectedSlot)
    const itemSection = document.querySelector('#items');

    const selectImg = document.createElement("img");
    selectImg.src = "assets/minecraft/1.18.1/minecraft/textures/gui/slot_selected.png"
    selectImg.classList.add("item")
    selectImg.id = "selected-item"
    selectImg.style.cssText = `margin-left:${offset-5}px;`
    itemSection.appendChild(selectImg)
}

function selectSlot(selectedSlot, numSlots) {
    const offset = (-25 * (numSlots - 1)) + (50 * selectedSlot)
    const selectedItem = document.querySelector('#selected-item');

    selectedItem.style.cssText = `margin-left:${offset-5}px;`
}

function addSmoothStoneBlock(blocks, scene, x, y, z) {
    blocks.set(
        x, y, z,
        new Block('smooth_stone', [addMeshToScene(scene, geometries.box, materials.smoothStone, x, y, z)])
    );
}



function addLight(scene) {
    // add lighting to scene
    const pointLight = new THREE.PointLight(0x000000);
    pointLight.position.set(2, 2.5, 1.8);

    // somewhat minecraft light : 0xccc8cf
    const ambientLight = new THREE.AmbientLight(0xffffff);

    scene.add(pointLight, ambientLight);
}

function addMeshToScene(scene, geometry, material, x, y, z, facing = DIRECTION.TOP) {
    const mesh = createMesh(geometry, material, x, y, z, facing);

    scene.add(mesh);

    return mesh;
}

function createMesh(geometry, material, x, y, z, facing = DIRECTION.TOP) {
    const mesh = new THREE.Mesh(geometry, material);

    switch(facing) {
        case DIRECTION.LEFT: mesh.rotateZ(90 * DEG_TO_RAD); break;
        case DIRECTION.RIGHT: mesh.rotateZ(-90 * DEG_TO_RAD); break;
        case DIRECTION.FRONT: mesh.rotateX(90 * DEG_TO_RAD); break;
        case DIRECTION.BACK: mesh.rotateX(-90 * DEG_TO_RAD); break;
        case DIRECTION.BOTTOM: mesh.rotateX(180 * DEG_TO_RAD); break;
    }

    mesh.position.set(x, y, z)

    return mesh;
}

function destroyBlock(blocks, scene, x, y, z) {
    const block = blocks.get(x, y, z);
    block.meshes.forEach(mesh => {
        scene.remove(mesh);
    })
    blocks.set(x, y, z, undefined);
}

function getAllMeshes(blocks) {
    let res = []

    for(let i = 0; i < 8; i++) {
        blocks.array[i].array.forEach(block => {
            if(block) {
                block.meshes.forEach(mesh => {
                    res.push(mesh)
                })
            }
        })
    }

    return res
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

function pistonLogic(blocks, scene, x, y, z, dirX, dirY, dirZ) {
    let extendable;
    let moveBlocks = [];
    let counter = 1;

    while(true) {
        // look at first block in direction
        let curBlock = blocks.get(x + dirX*counter, y + dirY*counter, z + dirZ*counter);
        // air? => extendable = true
        if (curBlock === undefined) {
            extendable = true;
            break;
        }
        // immovable? => extendable = false
        if (curBlock.immovable) {
            extendable = false;
            break;
        }
        // pushable? => destroy + extendable true
        if (!curBlock.pushable) {
            destroyBlock(blocks, scene, x + dirX*counter, y + dirY*counter, z + dirZ*counter);
            extendable = true;
            break;
        } else {
            // normal block? => add to moveBlocks[] + look at next block in direction
            moveBlocks.push(curBlock);
        }
        counter++;
    }

    return [extendable,  moveBlocks];
}

function directionToArrayXYZ(facing) {
    switch(facing) {
        case DIRECTION.TOP: return [0, 1, 0];
        case DIRECTION.LEFT: return [-1, 0, 0];
        case DIRECTION.RIGHT: return [1, 0, 0];
        case DIRECTION.FRONT: return [0, 0, 1];
        case DIRECTION.BACK: return [0, 0, -1];
        case DIRECTION.BOTTOM: return [0, -1, 0];
    }
}


// functions in animate loop
function doAnimation(animateTask) {
    // get frames from animationTask
    let framesPassed = animateTask.framesPassed;
    let frames = animateTask.frames;

    // failsafe
    if(framesPassed >= frames) {
        console.log('Failsafe reached!')
        return;
    }

    // do animation
    let lastFrameReached;
    switch(animateTask.type) {
        case ANIMATE_TASK_TYPE.MOVE:
            let curX, curY, curZ, disX, disY, disZ, toX, toY, toZ;
            [disX, disY, disZ] = [animateTask.disX, animateTask.disY, animateTask.disZ]
            animateTask.meshes.forEach(mesh => {
                // get mesh and coordinates
                [curX, curY, curZ] = [mesh.position.x, mesh.position.y, mesh.position.z]

                // calculate target coordinates
                toX = curX + disX/frames;
                toY = curY + disY/frames;
                toZ = curZ + disZ/frames;

                // update position
                mesh.position.set(toX, toY, toZ);
            })

            // update framesPassed
            animateTask.framesPassed += 1;

            // return, whether task has been completely executed
            return framesPassed+1 >= frames;
            break;
        case ANIMATE_TASK_TYPE.ADD_TO_SCENE:
            // update framesPassed
            animateTask.framesPassed += 1;

            // animate, once frames have passed
            lastFrameReached = framesPassed+1 >= frames;
            if(lastFrameReached) {
                animateTask.meshes.forEach(mesh => {
                    animateTask.scene.add(mesh)
                })
            }

            // return, whether task has been completely executed
            return lastFrameReached;
            break;
        case ANIMATE_TASK_TYPE.REMOVE_FROM_SCENE:
            // update framesPassed
            animateTask.framesPassed += 1;

            // animate, once frames have passed
            lastFrameReached = framesPassed+1 >= frames;
            if(lastFrameReached) {
                animateTask.meshes.forEach(mesh => {
                    animateTask.scene.remove(mesh)
                })
            }

            // return, whether task has been completely executed
            return lastFrameReached;
            break;
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
