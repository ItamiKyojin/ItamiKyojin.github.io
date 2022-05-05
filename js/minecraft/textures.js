// ---------- load textures ----------
// create texture loader
const loader = new THREE.TextureLoader();
// create constant base path to assets
const BLOCK_ASSET_PART_URL = 'assets/minecraft/1.18.1/minecraft/textures/block/';
// create object to store textures globally
const textures = {};
// load basic block textures
textures.smoothStone = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'smooth_stone.png');
// load block face textures
textures.pistonTop = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'piston_top.png');
textures.pistonTopSticky = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'piston_top_sticky.png');
textures.pistonSide = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'piston_side.png');
textures.pistonInner = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'piston_inner.png');
textures.pistonBottom = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'piston_bottom.png');
textures.repeater = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'repeater.png');
textures.repeaterOn = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'repeater_on.png');
textures.comparator = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'comparator.png');
textures.comparatorOn = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'comparator_on.png');
textures.redstoneTorch = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'redstone_torch.png');
textures.redstoneTorchOff = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'redstone_torch_off.png');
// load plane textures
textures.redstoneDustDot = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'redstone_dust_dot.png');
textures.redstoneDustLine0 = loadTextureWithNearestFilter(loader, BLOCK_ASSET_PART_URL + 'redstone_dust_line0.png');


function loadTextureWithNearestFilter(loader, url) {
    const texture = loader.load(url);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
}

export {textures};
