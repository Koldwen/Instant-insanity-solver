/* 
- Summary ----------------------------------------------------------------------
--------------------------------------------------------------------------------

================================================================================

    This file contains the functionality of the 3D cubes. It only shows
the 3D cubes and allows the user to rotate or move the camera (if the option is
selected).

================================================================================

Libraries used:
    p5.js

--------------------------------------------------------------------------------
--------------------------------------------------------------- End of Summary -
*/

'use strict';

//- Variables ------------------------------------------------------------------
//------------------------------------------------------------------------------

let CANVAS_WIDTH = 480;
let CANVAS_HEIGHT = 520;

let LENGTH = 50;
let CAMERA_POS = [600, 0, 0];

let R = [255, 0, 0];
let G = [0, 255, 0];
let B = [0, 0, 255];
let Y = [255, 255, 0];
let W = [255, 255, 255];

let FONT_SIZE = 30;

let angle = 0
let orbitControlEnable = false;
let separateCubesEnable = false;

let cubes = [
    [W, W, W, W, W, W],
    [W, W, W, W, W, W],
    [W, W, W, W, W, W],
    [W, W, W, W, W, W]
];

let font;

//------------------------------------------------------------------------------
//----------------------------------------------------------- End of Variables -





//- Initial Setup --------------------------------------------------------------
//------------------------------------------------------------------------------

function preload() {
    font = loadFont('assets/UbuntuMono-Regular.ttf');
}

function setup() {
    let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL);
    canvas.parent('cubesCanvas');

    camera(CAMERA_POS[0], CAMERA_POS[1], CAMERA_POS[2]);

    textFont(font);
    textSize(FONT_SIZE);
}

//------------------------------------------------------------------------------
//------------------------------------------------------- End of Initial Setup -





//- Functions ------------------------------------------------------------------
//------------------------------------------------------------------------------

function cubeFromArray(l = LENGTH, c) {
    cube(l, c[0], c[1], c[2], c[3], c[4], c[5]);
}

function cube(l = LENGTH, color1 = W, color2 = W,
    color3 = W, color4 = W, color5 = W, color6 = W) {
    beginShape();
    face([l, -l, -l], [l, -l, l], [-l, -l, l], [-l, -l, -l], color1); //5 (back face)
    face([l, -l, l], [-l, -l, l], [-l, l, l], [l, l, l], color2); //1 (ceil)
    face([l, l, -l], [l, l, l], [-l, l, l], [-l, l, -l], color3); //2 (front face)
    face([-l, -l, l], [-l, l, l], [-l, l, -l], [-l, -l, -l], color4); //6 (right face)
    face([l, -l, -l], [-l, -l, -l], [-l, l, -l], [l, l, -l], color5); //3 (floor)
    face([l, -l, l], [l, l, l], [l, l, -l], [l, -l, -l], color6); //4 (left face)
    endShape(CLOSE);
}

function face(v1, v2, v3, v4, color = [255, 255, 255]) {
    beginShape();
    fill(color[0], color[1], color[2]);
    vertex(v1[0], v1[1], v1[2]);
    vertex(v2[0], v2[1], v2[2]);
    vertex(v3[0], v3[1], v3[2]);
    vertex(v4[0], v4[1], v4[2]);
    endShape(CLOSE);
}

function write(string, color, x, y) {
    fill(color);
    text(string, x, y);
}

//------------------------------------------------------------------------------
//----------------------------------------------------------- End of Functions -






//- Draw -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function draw() {
    angleMode(DEGREES);
    background(255);

    if (orbitControlEnable) {
        orbitControl(10, 10, 10);
    } else {
        rotateY(90);
        write('Cube 4', [0, 0, 0], LENGTH * 2.5, -3 * LENGTH);
        write('Cube 3', [0, 0, 0], LENGTH * 2.5, -1 * LENGTH);
        write('Cube 2', [0, 0, 0], LENGTH * 2.5, 1 * LENGTH);
        write('Cube 1', [0, 0, 0], LENGTH * 2.5, 3 * LENGTH);

        rotateY(angle);
        angle += 0.5;
    }

    translate(0, -3 * LENGTH, 0);
    cubeFromArray(LENGTH, cubes[3]);  // Cube 4
    translate(0, 2 * LENGTH, 0);
    cubeFromArray(LENGTH, cubes[2]);  // Cube 3
    translate(0, 2 * LENGTH, 0);
    cubeFromArray(LENGTH, cubes[1]);  // Cube 2
    translate(0, 2 * LENGTH, 0);
    cubeFromArray(LENGTH, cubes[0]);  // Cube 1

}

//------------------------------------------------------------------------------
//---------------------------------------------------------------- End of Draw -