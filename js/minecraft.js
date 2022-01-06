"use strict"

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

let vertexShaderText = [
    'precision mediump float;',
    '',
    'attribute vec3 vertPosition;',
    'attribute vec2 vertTexCoord;',
    'varying vec2 fragTexCoord;',
    'uniform mat4 mWorld;',
    'uniform mat4 mView;',
    'uniform mat4 mProj;',
    '',
    'void main() {',
    '   fragTexCoord = vertTexCoord;',
    '   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
    '}'
].join('\n');

let fragmentShaderText = [
    'precision mediump float;',
    '',
    'varying vec2 fragTexCoord;',
    'uniform sampler2D sampler;',
    '',
    'void main() {',
    '   gl_FragColor = texture2D(sampler, fragTexCoord);',
    '}'
].join('\n');

window.onload = (() => {
    let canvas = document.getElementById('minecraft-surface');
    let gl = canvas.getContext('webgl');

    if (!gl) {
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support WebGL');
    }

    // (next block) maybe not necessary, but makes it look WAY less pixelated
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);


    // create shaders
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }
    // Leave next block uncommented only during testing!
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }



    /// create buffer
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
    // TODO blocks = shapeRedstoneDust(blocks);


    // !WARNING! Requires ECMAScript 6, may not work in Internet Explorer
    let [allBlockVertices, allBlockIndices] = getBlockData(blocks, lengthX, lengthY, lengthZ);

    setBuffers(gl, allBlockVertices, allBlockIndices);


    // look up where the vertex data needs to go
    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    let texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');

    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        false, // Data is normalized
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
        texCoordAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        false, // Data is normalized
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    // tell WebGL we want to supply data from a buffer
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(texCoordAttribLocation);


    // create texture
    let blockAtlasTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, blockAtlasTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('block_atlas'));
    gl.bindTexture(gl.TEXTURE_2D, null);

    // Tell OpenGL state machine which program should be active
    gl.useProgram(program);

    let matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    let matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    let matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    let worldMatrix = new Float32Array(16);
    let viewMatrix = new Float32Array(16);
    let projMatrix = new Float32Array(16);
    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 6, -15], [0, -4, 0], [0, 1, 0])
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

    /*let xRotationMatrix = new Float32Array(16);
    let yRotationMatrix = new Float32Array(16);*/


    // main render loop ((~?) 60FPS default)
    let identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    let angle = 0;
    let curFrame = 0;
    let defaultFrameRate = 60;
    let exampleCount = 0;
    let loop = () => {
        /*
        * 20 Ticks per Second
        * 10 Redstone Ticks per Second
        * */
        curFrame %= defaultFrameRate;

        if(curFrame%3 === 0) {
            // do gameLoop
            // TODO
            exampleCount++;
        }

        if(exampleCount === 100) {

            /// DOESN'T QUIET WORK... :(

            // blocks[index3dArray(2, 2, 2, lengthX, lengthY)] = {'name' : 'smooth_stone'};
            // !WARNING! Requires ECMAScript 6, may not work in Internet Explorer
            // [allBlockVertices, allBlockIndices] = getBlockData(blocks, lengthX, lengthY, lengthZ);

            // setBuffers(gl, allBlockVertices, allBlockIndices);

            /*boxVertexBufferObject = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allBlockVertices), gl.STATIC_DRAW);

            boxIndexBufferObject = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(allBlockIndices), gl.STATIC_DRAW);*/

            // console.log('Updated!')
            exampleCount++;
        }

        angle = performance.now() / 1000 / 6 * 2 * Math.PI; // 1 rotation every 6 seconds
        glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle / 4, [0, 1, 0]);

        /*glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle / 2, [0, 1, 0]);
        glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 8, [1, 0, 0]);
        glMatrix.mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);*/

        gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        gl.bindTexture(gl.TEXTURE_2D, blockAtlasTexture);
        gl.activeTexture(gl.TEXTURE0);

        gl.drawElements(gl.TRIANGLES, allBlockIndices.length, gl.UNSIGNED_SHORT, 0);

        gl.bindTexture(gl.TEXTURE_2D, null);

        curFrame++;
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
})

function getBlockData(blocks, lengthX, lengthY, lengthZ) {
    let allBlockVertices = [];
    let allBlockIndices = [];

    let ox = 0;
    let oy = 0;
    let oz = 0;

    /* row:r, column:c; r/cTop, r/cLeft, r/cRight, r/cFront, r/cBack, r/cBottom */
    let texCoords = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    let count = 0;

    // get blockVertices and blockIndices
    blocks.forEach((block, index) => {
        if(block.name === 'air') {
            return;
        }

        ox = index % (lengthY * lengthX) % lengthX; // block.coords[0] * 2;
        oy = ( (index - ox) % (lengthY * lengthX) ) / lengthX; // block.coords[1] * 2;
        oz = ( index - ox - oy*lengthX ) / lengthY / lengthX; // block.coords[2] * 2;

        ox *= 2;
        oy *= 2;
        oz *= 2;

        // sets center of all (3, 3, 3) blocks at 0, 0, 0
        ox -= lengthX - 1;
        oy -= lengthY - 1;
        oz -= lengthZ - 1;

        texCoords.forEach((_, index) => {
            texCoords[index] = -1;
        })

        // acacia planks: row 5, column 11
        switch (block.name) {
            case 'smooth_stone':
                texCoords[0] = 20;
                texCoords[1] = 14;
                break;
            case 'redstone_block':
                texCoords[0] = 18;
                texCoords[1] = 30;
                break;
            case 'redstone_dust_dot':
                texCoords[0] = 18;
                texCoords[1] = 31;
                break;
            case 'redstone_dust_line0':
                texCoords[0] = 19;
                texCoords[1] = 0;
                break;
            case 'redstone_dust_line1':
                texCoords[0] = 19;
                texCoords[1] = 1;
                break;
            case 'piston':
                texCoords[0] = 17;
                texCoords[1] = 4;

                texCoords[2] = 17;
                texCoords[3] = 3;
                texCoords[4] = 17;
                texCoords[5] = 3;
                texCoords[6] = 17;
                texCoords[7] = 3;
                texCoords[8] = 17;
                texCoords[9] = 3;

                texCoords[10] = 17;
                texCoords[11] = 1;
                break;
        }

        texCoords = rotateTexCoords(texCoords, block.facing);

        allBlockVertices = allBlockVertices.concat(singleBlockVertices(ox, oy, oz, texCoords, block.facing))

        allBlockIndices = allBlockIndices.concat([
            // Top
            24 * count, 1 + 24 * count, 2 + 24 * count,
            24 * count, 2 + 24 * count, 3 + 24 * count,

            // Left
            5 + 24 * count, 4 + 24 * count, 6 + 24 * count,
            6 + 24 * count, 4 + 24 * count, 7 + 24 * count,

            // Right
            8 + 24 * count, 9 + 24 * count, 10 + 24 * count,
            8 + 24 * count, 10 + 24 * count, 11 + 24 * count,

            // Front
            13 + 24 * count, 12 + 24 * count, 14 + 24 * count,
            15 + 24 * count, 14 + 24 * count, 12 + 24 * count,

            // Back
            16 + 24 * count, 17 + 24 * count, 18 + 24 * count,
            16 + 24 * count, 18 + 24 * count, 19 + 24 * count,

            // Bottom
            21 + 24 * count, 20 + 24 * count, 22 + 24 * count,
            22 + 24 * count, 20 + 24 * count, 23 + 24 * count
        ])
        count++;
    })

    return [allBlockVertices, allBlockIndices];
}

function setBuffers(gl, allBlockVertices, allBlockIndices) {
    let boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allBlockVertices), gl.STATIC_DRAW);

    let boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(allBlockIndices), gl.STATIC_DRAW);
}

function rotateTexCoords(texCoords, facing = 'top') {
    /* row:r, column:c; r/cTop, r/cLeft, r/cRight, r/cFront, r/cBack, r/cBottom */

    const TOP = 0;
    const LEFT = 1;
    const RIGHT = 2;
    const FRONT = 3;
    const BACK = 4;
    const BOTTOM = 5;

    switch(facing) {
        case 'left':
            // top -> left -> bottom -> right -> top
            texCoords = shift4Faces(texCoords, [TOP, LEFT, BOTTOM, RIGHT]);
            break;
        case 'right':
            // top -> right -> bottom -> left -> top
            texCoords = shift4Faces(texCoords, [TOP, RIGHT, BOTTOM, LEFT]);
            break;
        case 'front':
            // top -> front -> bottom -> back -> top
            texCoords = shift4Faces(texCoords, [TOP, FRONT, BOTTOM, BACK]);
            break;
        case 'back':
            // top -> front -> bottom -> back -> top
            texCoords = shift4Faces(texCoords, [TOP, BACK, BOTTOM, FRONT]);
            break;
        case 'bottom':
            // top -> front -> bottom -> back -> top
            texCoords = shift4Faces(texCoords, [TOP, BOTTOM]);
            break;
    }

    return texCoords;
}

function shift4Faces(texCoords, faces) {
    let temp = [-1, -1];
    let result;

    if(faces[0] !== undefined &&
        faces[1] !== undefined &&
        faces[2] !== undefined &&
        faces[3] !== undefined) {
        // top -> temp
        result = shiftFace(texCoords, faces[0], -1, temp, 'toTemp');
        texCoords = result[0];
        temp = result[1]
        // right -> top
        texCoords = shiftFace(texCoords, faces[3], faces[0])[0];
        // bottom -> right
        texCoords = shiftFace(texCoords, faces[2], faces[3])[0];
        // left -> bottom
        texCoords = shiftFace(texCoords, faces[1], faces[2])[0];
        // temp -> left
        texCoords = shiftFace(texCoords, -1, faces[1], temp, 'fromTemp')[0];
    } else if(faces[0] !== undefined &&
        faces[1] !== undefined) {
        // top -> temp
        result = shiftFace(texCoords, faces[0], -1, temp, 'toTemp');
        texCoords = result[0];
        temp = result[1]
        // bottom -> top
        texCoords = shiftFace(texCoords, faces[1], faces[0])[0];
        // temp -> bottom
        texCoords = shiftFace(texCoords, -1, faces[1], temp, 'fromTemp')[0];
    }

    return texCoords;
}

function shiftFace(texCoords, fromDir, toDir, temp, tempDir) {
    // default case
    if(temp === undefined) {
        // fromDir -> toDir
        texCoords[toDir * 2] = texCoords[fromDir * 2];
        texCoords[toDir * 2 + 1] = texCoords[fromDir * 2 + 1];
    } else if(tempDir === 'fromTemp') {
        // temp -> toDir
        texCoords[toDir*2] = temp[0];
        texCoords[toDir*2+1] = temp[1];
    } else {
        // fromDir -> temp
        temp[0] = texCoords[fromDir*2];
        temp[1] = texCoords[fromDir*2+1];
    }

    return [texCoords, temp];
}

function singleBlockVertices(ox, oy, oz, texCoords, facing = 'top') {
    // for every not specified texture, take the previous one
    texCoords.forEach((coord, index) => {
        if(coord === -1) {
            texCoords[index] = texCoords[index - 2]
        }
    })

    /*
    * Invert U (big to small and small to big) => mirror
    * Invert V => mirror
    * Go 1 down => rotate left in front / right in back
    * */

    const TOP = 0;
    const LEFT = 1;
    const RIGHT = 2;
    const FRONT = 3;
    const BACK = 4;
    const BOTTOM = 5;

    const TOP_COORDS_SCHEMA = [-1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1];
    const LEFT_COORDS_SCHEMA = [-1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1];
    const RIGHT_COORDS_SCHEMA = [1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1];
    const FRONT_COORDS_SCHEMA = [1, 1, 1, 1, -1, 1, -1, -1, 1, -1, 1, 1];
    const BACK_COORDS_SCHEMA = [1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1];
    const BOTTOM_COORDS_SCHEMA = [-1, -1, -1, -1, -1, 1, 1, -1, 1, 1, -1, -1];

    const A_TEX_SCHEMA = [0, 0, 0, 1, 1, 1, 1, 0];
    const B_TEX_SCHEMA = [1, 0, 0, 0, 0, 1, 1, 1];
    const C_TEX_SCHEMA = [0, 1, 1, 1, 1, 0, 0, 0];
    const D_TEX_SCHEMA = [1, 1, 1, 0, 0, 0, 0, 1];

    let topVertices = [];
    let leftVertices = [];
    let rightVertices = [];
    let frontVertices = [];
    let backVertices = [];
    let bottomVertices = [];

    // Top
    switch (facing) {
        case 'top':
        case 'back':
        case 'bottom':   topVertices = faceVertices(texCoords, TOP, ox, oy, oz, TOP_COORDS_SCHEMA, A_TEX_SCHEMA);   break;
        case 'left':     topVertices = faceVertices(texCoords, TOP, ox, oy, oz, TOP_COORDS_SCHEMA, B_TEX_SCHEMA);   break;
        case 'right':    topVertices = faceVertices(texCoords, TOP, ox, oy, oz, TOP_COORDS_SCHEMA, C_TEX_SCHEMA);   break;
        case 'front':    topVertices = faceVertices(texCoords, TOP, ox, oy, oz, TOP_COORDS_SCHEMA, D_TEX_SCHEMA);
    }

    // Left
    switch (facing) {
        case 'top':
        case 'left':
        case 'right':    leftVertices = faceVertices(texCoords, LEFT, ox, oy, oz, LEFT_COORDS_SCHEMA, A_TEX_SCHEMA);   break;
        case 'front':    leftVertices = faceVertices(texCoords, LEFT, ox, oy, oz, LEFT_COORDS_SCHEMA, B_TEX_SCHEMA);   break;
        case 'back':     leftVertices = faceVertices(texCoords, LEFT, ox, oy, oz, LEFT_COORDS_SCHEMA, C_TEX_SCHEMA);   break;
        case 'bottom':   leftVertices = faceVertices(texCoords, LEFT, ox, oy, oz, LEFT_COORDS_SCHEMA, D_TEX_SCHEMA);   break;
    }

    // Right
    switch (facing) {
        case 'top':
        case 'left':
        case 'right':    rightVertices = faceVertices(texCoords, RIGHT, ox, oy, oz, RIGHT_COORDS_SCHEMA, A_TEX_SCHEMA);   break;
        case 'front':    rightVertices = faceVertices(texCoords, RIGHT, ox, oy, oz, RIGHT_COORDS_SCHEMA, B_TEX_SCHEMA);   break;
        case 'back':     rightVertices = faceVertices(texCoords, RIGHT, ox, oy, oz, RIGHT_COORDS_SCHEMA, C_TEX_SCHEMA);   break;
        case 'bottom':   rightVertices = faceVertices(texCoords, RIGHT, ox, oy, oz, RIGHT_COORDS_SCHEMA, D_TEX_SCHEMA);
    }

    // Front
    switch (facing) {
        case 'top':
        case 'front':
        case 'back':     frontVertices = faceVertices(texCoords, FRONT, ox, oy, oz, FRONT_COORDS_SCHEMA, A_TEX_SCHEMA);   break;
        case 'left':     frontVertices = faceVertices(texCoords, FRONT, ox, oy, oz, FRONT_COORDS_SCHEMA, C_TEX_SCHEMA);   break;
        case 'right':    frontVertices = faceVertices(texCoords, FRONT, ox, oy, oz, FRONT_COORDS_SCHEMA, B_TEX_SCHEMA);   break;
        case 'bottom':   frontVertices = faceVertices(texCoords, FRONT, ox, oy, oz, FRONT_COORDS_SCHEMA, D_TEX_SCHEMA);
    }

    // Back
    switch (facing) {
        case 'top':
        case 'front':
        case 'back':     backVertices = faceVertices(texCoords, BACK, ox, oy, oz, BACK_COORDS_SCHEMA, A_TEX_SCHEMA);   break;
        case 'left':     backVertices = faceVertices(texCoords, BACK, ox, oy, oz, BACK_COORDS_SCHEMA, C_TEX_SCHEMA);   break;
        case 'right':    backVertices = faceVertices(texCoords, BACK, ox, oy, oz, BACK_COORDS_SCHEMA, B_TEX_SCHEMA);   break;
        case 'bottom':   backVertices = faceVertices(texCoords, BACK, ox, oy, oz, BACK_COORDS_SCHEMA, D_TEX_SCHEMA);
    }

    //Bottom
    switch (facing) {
        case 'top':
        case 'back':
        case 'bottom':   bottomVertices = faceVertices(texCoords, BOTTOM, ox, oy, oz, BOTTOM_COORDS_SCHEMA, A_TEX_SCHEMA);   break;
        case 'left':     bottomVertices = faceVertices(texCoords, BOTTOM, ox, oy, oz, BOTTOM_COORDS_SCHEMA, B_TEX_SCHEMA);   break;
        case 'right':    bottomVertices = faceVertices(texCoords, BOTTOM, ox, oy, oz, BOTTOM_COORDS_SCHEMA, C_TEX_SCHEMA);   break;
        case 'front':    bottomVertices = faceVertices(texCoords, BOTTOM, ox, oy, oz, BOTTOM_COORDS_SCHEMA, D_TEX_SCHEMA);
    }

    return topVertices.concat(
            leftVertices.concat(
                rightVertices.concat(
                    frontVertices.concat(
                        backVertices.concat(
                            bottomVertices
                        )
                    )
                )
            )
        )
}

function faceVertices(texCoords, facing, ox, oy, oz, COORDS_SCHEMA, TEX_SCHEMA) {
    return [
        //X, Y, Z,                                                               U, V
        COORDS_SCHEMA[0] + ox, COORDS_SCHEMA[1] + oy,  COORDS_SCHEMA[2] + oz,    (texCoords[facing*2+1] + TEX_SCHEMA[0]) / 64, (texCoords[facing*2] + TEX_SCHEMA[1]) / 32,
        COORDS_SCHEMA[3] + ox, COORDS_SCHEMA[4] + oy,  COORDS_SCHEMA[5] + oz,    (texCoords[facing*2+1] + TEX_SCHEMA[2]) / 64, (texCoords[facing*2] + TEX_SCHEMA[3]) / 32,
        COORDS_SCHEMA[6] + ox, COORDS_SCHEMA[7] + oy,  COORDS_SCHEMA[8] + oz,    (texCoords[facing*2+1] + TEX_SCHEMA[4]) / 64, (texCoords[facing*2] + TEX_SCHEMA[5]) / 32,
        COORDS_SCHEMA[9] + ox, COORDS_SCHEMA[10] + oy, COORDS_SCHEMA[11] + oz,   (texCoords[facing*2+1] + TEX_SCHEMA[6]) / 64, (texCoords[facing*2] + TEX_SCHEMA[7]) / 32
    ];
}

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

function index3dArray(x, y, z, lengthX, lengthY) {
    return x + y * lengthX + z * lengthX * lengthY;
}

function shapeRedstoneDust(blocks) {
    // TODO

    return blocks;
}

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
