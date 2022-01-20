/* 
- Summary ----------------------------------------------------------------------
--------------------------------------------------------------------------------

================================================================================

    This file contains the main functionality of the website.

    It also contains functionality to get the user input from the 2D cubes, and 
update the 3D cubes with the solution.

================================================================================

Libraries used:
    lodash.js

File dependencies:
    js/3d-cubes.js
    js/algorithm.js
    js/utils.js

--------------------------------------------------------------------------------
--------------------------------------------------------------- End of Summary -
*/

'use strict';

//- Initial Setup --------------------------------------------------------------
//------------------------------------------------------------------------------

window.onload = initialSetup;

//------------------------------------------------------------------------------
//------------------------------------------------------- End of Initial Setup -





//- Variables ------------------------------------------------------------------
//------------------------------------------------------------------------------

/* An auxiliar dictionary that dictates how the cubes' input will change its colors */
let COLOR_MAP = { 'red': 'blue', 'blue': 'yellow', 'yellow': 'green', 'green': 'red' };
/* An auxiliar dictionary that returns an RGB value based on its name */
let RGB = { 'red': [255, 0, 0],
            'blue': [0, 0, 255],
            'green': [0, 255, 0],
            'yellow': [255, 255, 0],
            'grey': [125, 125, 125] 
        };

let ANIMATION_DURATION = 5; // Seconds. Must be the same as fade-out (css).

let animation_timer;
//------------------------------------------------------------------------------
//----------------------------------------------------------- End of Variables -





//- Functions ------------------------------------------------------------------
//------------------------------------------------------------------------------

/* Configure cube inputs and solve the example problem */
async function initialSetup(){
    let colors = [
        ['red', 'blue', 'blue', 'yellow', 'blue', 'green'],
        ['blue', 'green', 'yellow', 'green', 'blue', 'red'],
        ['red', 'yellow', 'red', 'yellow', 'blue', 'green'],
        ['yellow', 'red', 'green', 'green', 'blue', 'red'],
    ];

    injectHTML('html/cube-input.html', 'cube1', 'cube2', 'cube3', 'cube4').then(() => {
        for (let i = 1; i < 5; i++) {
            configureCubeInput(document.getElementById('cube'+i.toString()), colors[i - 1]);
        }
        onClickSolve();
    });
}

function onClickToggleMouseControl(btn) {
    orbitControlEnable = !(btn.value == 'true');
    btn.value = orbitControlEnable.toString();
    console.log(btn.value);

    if (orbitControlEnable) {
        push();
        btn.innerHTML = 'Disable mouse control';
    } else {
        pop();
        btn.innerHTML = 'Enable mouse control';
    }
}

function configureCubeInput(cube, colors) {
    for (let i = 0; i < 6; i++) {
        let face = cube.querySelector('#face'+i.toString());
        face.style.backgroundColor = colors[i];
        face.value = colors[i];
        face.onclick = function () { onClickChangeColor(face); };
    }
}

function onClickChangeColor(face) {
    let new_color = COLOR_MAP[face.value];
    face.style.backgroundColor = new_color;
    face.value = new_color
}


function onClickSolve() {
    let colors1 = getColors(document.getElementById('cube1'));
    let colors2 = getColors(document.getElementById('cube2'));
    let colors3 = getColors(document.getElementById('cube3'));
    let colors4 = getColors(document.getElementById('cube4'));

    let cube1 = new Cube(colors1);
    let cube2 = new Cube(colors2);
    let cube3 = new Cube(colors3);
    let cube4 = new Cube(colors4);

    let graph = cubesToGraph([cube1, cube2, cube3, cube4]);
    let solution = solve(graph);

    let solvable = document.getElementById('solvable');
    let unsolvable = document.getElementById('unsolvable');

    solvable.classList.remove('fade-out', 'd-none');
    unsolvable.classList.remove('fade-out', 'd-none');
    clearTimeout(animation_timer);

    showSolution(solution);
    if (solution != null) {
        unsolvable.classList.add('d-none');
        window.requestAnimationFrame(function() {
            solvable.classList.add('fade-out');
            animation_timer = setTimeout(function(){
                solvable.classList.add('d-none');
            }, ANIMATION_DURATION*1000);
        });
    } else {
        solvable.classList.add('d-none');
        window.requestAnimationFrame(function() {
            unsolvable.classList.add('fade-out');
            animation_timer = setTimeout(function(){
                unsolvable.classList.add('d-none');
            }, ANIMATION_DURATION*1000);
        });
    }
}

function onClickHideElement(element) {
    element.classList.add('d-none');
}

function showSolution(solution) {
    if(solution == null){ // If there is no solution, draw all cubes grey.
        let g = 'grey';
        let empty = [[g, g, 0], [g, g, 1], [g, g, 2], [g, g, 3]];
        solution = [empty, empty, empty];
    }

    let edges1 = solution[0];
    let edges2 = solution[1];
    let edges3 = solution[2];

    for (let i = 0; i < 4; i++) {
        cubes[edges1[i][2]][1] = RGB[edges1[i][0]]; // Front
        cubes[edges1[i][2]][4] = RGB[edges1[i][1]]; // Back

        cubes[edges2[i][2]][3] = RGB[edges2[i][0]]; // Left
        cubes[edges2[i][2]][5] = RGB[edges2[i][1]]; // Right

        cubes[edges3[i][2]][0] = RGB['grey']; // Top
        cubes[edges3[i][2]][2] = RGB['grey']; // Bottom
    }
}

function getColors(cube) {
    let colors = [];

    for(let i = 0; i < 6; i++){
        colors.push(cube.querySelector('#face'+i.toString()).value);
    }

    return colors;
}

//------------------------------------------------------------------------------
//----------------------------------------------------------- End of Functions -