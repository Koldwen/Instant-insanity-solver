/* 
- Summary ----------------------------------------------------------------------
--------------------------------------------------------------------------------

================================================================================

    This file contains all the functions, variables, classes, etc, needed to
solve any instance of the "Instant insanity" problem.

================================================================================

Libraries used:
    lodash.js

File dependencies:
    js/utils.js

--------------------------------------------------------------------------------
--------------------------------------------------------------- End of Summary -
*/

'use strict';

//- Classes --------------------------------------------------------------------
//------------------------------------------------------------------------------

class Cube {
    /* 
        Represents a cube, where each face is assigned a color.

        Color assignment must be done as follows:

                    color4
            color3  color2  color5
                    color1
                    color0

        - Attributes -----------------------------------------------------------
            colors: A dictionary containing the relationship between colors and
                opposing faces.
                 
                For example, the following dict {'red': ['red'], 'yellow': ['blue', 'green']}
                represents a cube that have one red face which opposite is also 
                red, and two yellow faces, which opposite faces are blue and 
                green, respectively.
        ------------------------------------------------------------------------
    */
    constructor(colors) {
        /*
            Given a list of colors, construct a Cube based on the relationship
            between colors and opposing faces.

            - Parameters -------------------------------------------------------
                colors: A list of colors that represents a cube, as described above.
            --------------------------------------------------------------------
        */
        this.colors = {}

        this.colors[colors[0]] = [];
        this.colors[colors[1]] = [];
        this.colors[colors[3]] = [];

        this.colors[colors[0]].push(colors[2]);
        this.colors[colors[1]].push(colors[4]);
        this.colors[colors[3]].push(colors[5]);
    }
}

//------------------------------------------------------------------------------
//------------------------------------------------------------- End of Classes -




//- Functions ------------------------------------------------------------------
//------------------------------------------------------------------------------

/* Given a list of Cubes, returns the Graph formed by the connections of each cube */ 
function cubesToGraph(cubes) {
    let graph = new Graph({ 'red': [], 'blue': [], 'yellow': [], 'green': [] });

    for (let i = 0; i < cubes.length; i++) {
        let cube = cubes[i];
        for (var color1 in cube.colors) {
            for (let j = 0; j < cube.colors[color1].length; j++) {
                let color2 = cube.colors[color1][j];
                graph.addEdge([color1, color2, i]);
            }
        }
    }

    return graph;
}

/* 
Given the output of getEdges() of a Graph, returns the same edges formatted so
that they can be used in the constructor of another Graph.
*/
function formatEdges(edges) {
    let formattedEdges = {};

    for (let i = 0; i < edges.length; i++) {
        let v1 = edges[i][0];
        let v2 = edges[i][1];
        let label = edges[i][2];

        if (!(v1 in formattedEdges)) { formattedEdges[v1] = []; }
        formattedEdges[v1].push([v2, label]);

        if (!(v2 in formattedEdges)) { formattedEdges[v2] = []; }
        formattedEdges[v2].push([v1, label]);
    }

    return formattedEdges;
}

/* Given a Graph, solves the problem, returning a list of how each cube's face 
must be arranged.

Example:
[
    [["red", "green", 0], ["blue", "yellow", 3], ...], <- Front and back faces.
    [...],                                           <- Right and left faces.
    [...]                                            <- Ceil and floor faces (we can't arrange them).
]

Front faces    Back faces
    "blue"       "yellow"
    "..."         "..."
    "..."         "..."
    "red"        "green"

*/
function solve(graph) {
    let solution = getSolution(graph);

    if (solution != null) {
        solution = arrangeSolution(solution, graph);
    }

    return solution;
}

/* This is the real algorithm that solves the problem. Take a look to this
wikipedia article to know how it works: 

https://en.wikipedia.org/wiki/Instant_Insanity#Solution
*/
function getSolution(graph) {
    function is_valid_subgraph(subgraph) {
        if (subgraph.order() != 4) { return false; }

        let degrees = subgraph.degrees();
        for (let i = 0; i < degrees.length; i++) {
            if (degrees[i] != 2) { return false; }
        }

        let edges = subgraph.getEdges();
        let labels = [];
        for (let i = 0; i < edges.length; i++) { labels.push(edges[i][2]); }
        for (let i = 0; i < 4; i++) {
            if (!labels.includes(i)) { return false; }
        }

        return true;
    }

    function is_valid_solution(graph, solution) {
        let _graph = _.cloneDeep(graph);

        _graph.removeEdges(solution[0].getEdges());

        let edges2 = solution[1].getEdges();
        for (let i = 0; i < edges2.length; i++) {
            if (!_graph.containsEdge(edges2[i])) { return false; }
        }

        return true;
    }

    let valid_subgraphs = [];
    let edge_combs = combinations(graph.getEdges(), 4);

    for (let i = 0; i < edge_combs.length; i++) {
        let subgraph = new Graph(formatEdges(edge_combs[i]));
        if (is_valid_subgraph(subgraph)) {
            valid_subgraphs.push(subgraph);
        }
    }

    let subgraph_combs = combinations(valid_subgraphs, 2);

    for (let i = 0; i < subgraph_combs.length; i++) {
        if (is_valid_solution(graph, subgraph_combs[i])) {
            return subgraph_combs[i];
        }
    }

    return null;
}


/* 
Given a solution, returns the arranged solution so that we can see the
4 colors on each side.
*/
function arrangeSolution(solution, graph) {
    function arrangedEdges(edges) {
        let result = [];

        result.push(edges[0]);

        for (let i = 1; i < edges.length; i++) {
            let newFace = edges[i][0];
            let switchFaces = false;
            for (let j = 0; j < i; j++) {
                let frontFace = result[j][0];

                if (newFace == frontFace) {
                    switchFaces = true;
                    break;
                }
            }
            if (switchFaces) {
                result.push([edges[i][1], edges[i][0], edges[i][2]]);
            } else {
                result.push(edges[i]);
            }
        }

        return result;
    }

    graph = _.cloneDeep(graph);

    let edges1 = solution[0].getEdges(); // Front and Back
    let edges2 = solution[1].getEdges(); // Left and Right

    graph.removeEdges(edges1);
    graph.removeEdges(edges2);

    let edges3 = graph.getEdges(); // Top and Bottom

    let arrange1 = arrangedEdges(edges1);
    let arrange2 = arrangedEdges(edges2);

    return [arrange1, arrange2, edges3];
}

//------------------------------------------------------------------------------
//----------------------------------------------------------- End of Functions -