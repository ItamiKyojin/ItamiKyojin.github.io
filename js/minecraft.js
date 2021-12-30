"use strict"

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


    // create buffer
    let blocks = [
        {'name' : 'redstone_block', 'coords' : [-1, -1, -1]},
        {'name' : 'smooth_stone',   'coords' : [-1, -1, 0]},
        {'name' : 'redstone_block', 'coords' : [-1, -1, 1]},
        {'name' : 'smooth_stone',   'coords' : [0, -1, -1]},
        {'name' : 'smooth_stone',   'coords' : [0, -1, 0]},
        {'name' : 'smooth_stone',   'coords' : [0, -1, 1]},
        {'name' : 'redstone_block', 'coords' : [1, -1, -1]},
        {'name' : 'smooth_stone',   'coords' : [1, -1, 0]},
        {'name' : 'redstone_block', 'coords' : [1, -1, 1]},
        {'name' : 'piston', 'coords' : [0, 0, 0], 'facing' : 'top'}
    ]

    let allBlockVertices = [];
    let allBlockIndices = [];

    let ox = 0;
    let oy = 0;
    let oz = 0;

    let texCoords = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    /* row:r, column:c; r/cTop, r/cLeft, r/cRight, r/cFront, r/cBack, r/cBottom */

    blocks.forEach((block, index) => {
        ox = block.coords[0] * 2;
        oy = block.coords[1] * 2;
        oz = block.coords[2] * 2;

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
            0 + 24 * index, 1 + 24 * index, 2 + 24 * index,
            0 + 24 * index, 2 + 24 * index, 3 + 24 * index,

            // Left
            5 + 24 * index, 4 + 24 * index, 6 + 24 * index,
            6 + 24 * index, 4 + 24 * index, 7 + 24 * index,

            // Right
            8 + 24 * index, 9 + 24 * index, 10 + 24 * index,
            8 + 24 * index, 10 + 24 * index, 11 + 24 * index,

            // Front
            13 + 24 * index, 12 + 24 * index, 14 + 24 * index,
            15 + 24 * index, 14 + 24 * index, 12 + 24 * index,

            // Back
            16 + 24 * index, 17 + 24 * index, 18 + 24 * index,
            16 + 24 * index, 18 + 24 * index, 19 + 24 * index,

            // Bottom
            21 + 24 * index, 20 + 24 * index, 22 + 24 * index,
            22 + 24 * index, 20 + 24 * index, 23 + 24 * index
        ])
    })

    let boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allBlockVertices), gl.STATIC_DRAW);

    let boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(allBlockIndices), gl.STATIC_DRAW);

    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    let texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE, // Data is normalized
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
        texCoordAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE, // Data is normalized
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );


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
    glMatrix.mat4.lookAt(viewMatrix, [0, 6, -12], [0, 0, 0], [0, 1, 0])
    // canvas.width / canvas.height causes mild issues / inconsistencies ... I think?
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


    // main render loop
    let identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    let angle = 0;
    let loop = () => {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI; // 1 rotation every 6 seconds
        glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle / 4, [0, 1, 0]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        gl.bindTexture(gl.TEXTURE_2D, blockAtlasTexture);
        gl.activeTexture(gl.TEXTURE0);

        gl.drawElements(gl.TRIANGLES, allBlockIndices.length, gl.UNSIGNED_SHORT, 0);

        gl.bindTexture(gl.TEXTURE_2D, null);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
})

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

    let topVertices = [
        //X, Y, Z,                         U, V
        // Top
        -1.0 + ox, 1.0 + oy, -1.0 + oz,    texCoords[1]/64,        texCoords[0]/32,
        -1.0 + ox, 1.0 + oy, 1.0 + oz,     texCoords[1]/64,       (texCoords[0] + 1)/32,
        1.0 + ox, 1.0 + oy, 1.0 + oz,      (texCoords[1] + 1)/64, (texCoords[0] + 1)/32,
        1.0 + ox, 1.0 + oy, -1.0 + oz,     (texCoords[1] + 1)/64,  texCoords[0]/32
    ]

    let sidesVirtices = [];

    // mirrored
    sidesVirtices = sidesVirtices.concat([
        //X, Y, Z,                         U, V
        // Left
        -1.0 + ox, 1.0 + oy, 1.0 + oz,     (texCoords[3] + 1)/64,  texCoords[2]/32,
        -1.0 + ox, -1.0 + oy, 1.0 + oz,    (texCoords[3] + 1)/64, (texCoords[2] + 1)/32,
        -1.0 + ox, -1.0 + oy, -1.0 + oz,   texCoords[3]/64,       (texCoords[2] + 1)/32,
        -1.0 + ox, 1.0 + oy, -1.0 + oz,    texCoords[3]/64,        texCoords[2]/32
    ])

    sidesVirtices = sidesVirtices.concat([
        //X, Y, Z,                         U, V
        // Right
        1.0 + ox, 1.0 + oy, 1.0 + oz,      texCoords[5]/64,        texCoords[4]/32,
        1.0 + ox, -1.0 + oy, 1.0 + oz,     texCoords[5]/64,       (texCoords[4] + 1)/32,
        1.0 + ox, -1.0 + oy, -1.0 + oz,    (texCoords[5] + 1)/64, (texCoords[4] + 1)/32,
        1.0 + ox, 1.0 + oy, -1.0 + oz,     (texCoords[5] + 1)/64,  texCoords[4]/32
    ])

    sidesVirtices = sidesVirtices.concat([
        //X, Y, Z,                         U, V
        // Front
        1.0 + ox, 1.0 + oy, 1.0 + oz,      (texCoords[7] + 1)/64,  texCoords[6]/32,
        1.0 + ox, -1.0 + oy, 1.0 + oz,     (texCoords[7] + 1)/64, (texCoords[6] + 1)/32,
        -1.0 + ox, -1.0 + oy, 1.0 + oz,    texCoords[7]/64,       (texCoords[6] + 1)/32,
        -1.0 + ox, 1.0 + oy, 1.0 + oz,     texCoords[7]/64,        texCoords[6]/32
    ])

    sidesVirtices = sidesVirtices.concat([
        //X, Y, Z,                         U, V
        // Back
        1.0 + ox, 1.0 + oy, -1.0 + oz,     texCoords[9]/64,        texCoords[8]/32,
        1.0 + ox, -1.0 + oy, -1.0 + oz,    texCoords[9]/64,       (texCoords[8] + 1)/32,
        -1.0 + ox, -1.0 + oy, -1.0 + oz,   (texCoords[9] + 1)/64, (texCoords[8] + 1)/32,
        -1.0 + ox, 1.0 + oy, -1.0 + oz,    (texCoords[9] + 1)/64,  texCoords[8]/32
    ]);

    let bottomVertices = [
        //X, Y, Z,                         U, V
        // Bottom
        -1.0 + ox, -1.0 + oy, -1.0 + oz,   (texCoords[11] + 1)/64,  texCoords[10]/32,
        -1.0 + ox, -1.0 + oy, 1.0 + oz,    (texCoords[11] + 1)/64, (texCoords[10] + 1)/32,
        1.0 + ox, -1.0 + oy, 1.0 + oz,     texCoords[11]/64,       (texCoords[10] + 1)/32,
        1.0 + ox, -1.0 + oy, -1.0 + oz,    texCoords[11]/64,        texCoords[10]/32
    ]

    return topVertices.concat(sidesVirtices.concat(bottomVertices));
}
