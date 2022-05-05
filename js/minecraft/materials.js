import {textures} from './textures.js';

// ---------- create materials ----------
// create object to store materials globally
const materials = {};
// create basic materials
materials.smoothStone = new THREE.MeshStandardMaterial( {map : textures.smoothStone} );
materials.redstoneTorch = new THREE.MeshStandardMaterial( {map : textures.redstoneTorch, transparent : true} );
materials.redstoneTorchOff = new THREE.MeshStandardMaterial( {map : textures.redstoneTorchOff} );
// create multi faced materials
materials.piston = create6FacedMaterial(textures.pistonTop, textures.pistonSide, textures.pistonSide, textures.pistonSide, textures.pistonSide, textures.pistonBottom);
materials.pistonBase = create6FacedMaterial(textures.pistonInner, textures.pistonSide, textures.pistonSide, textures.pistonSide, textures.pistonSide, textures.pistonBottom);
materials.pistonHead = create6FacedMaterial(textures.pistonTop, textures.pistonSide, textures.pistonSide, textures.pistonSide, textures.pistonSide, textures.pistonTop);
materials.repeater = create6FacedMaterial(textures.repeater, textures.smoothStone, textures.smoothStone, textures.smoothStone, textures.smoothStone, textures.smoothStone);
materials.repeaterOn = create6FacedMaterial(textures.repeaterOn, textures.smoothStone, textures.smoothStone, textures.smoothStone, textures.smoothStone, textures.smoothStone);
materials.comparator = create6FacedMaterial(textures.comparator, textures.smoothStone, textures.smoothStone, textures.smoothStone, textures.smoothStone, textures.smoothStone);
materials.comparatorOn = create6FacedMaterial(textures.comparatorOn, textures.smoothStone, textures.smoothStone, textures.smoothStone, textures.smoothStone, textures.smoothStone);
// create multi colored material arrays
materials.redstoneDustLine0Array = [];
for(let i = 0; i < 16; i++) {
    materials.redstoneDustLine0Array.push( new THREE.MeshStandardMaterial( {map : textures.redstoneDustLine0, transparent : true, color : getRedstoneColor(i)} ) )
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

    return  materialArray;
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

export {materials};
