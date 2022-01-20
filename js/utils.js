/* 
- Summary ----------------------------------------------------------------------
--------------------------------------------------------------------------------

================================================================================

    This file contains general utility functions and variables.

================================================================================

Libraries used:
    lodash.js

--------------------------------------------------------------------------------
--------------------------------------------------------------- End of Summary -
*/

'use strict';

//- Classes --------------------------------------------------------------------
//------------------------------------------------------------------------------

class Graph {
    /* 
        Represents a labeled undirected multigraph.

        NOTE: THIS IS A VERY BASIC IMPLEMENTATION LIMITED TO THIS PROBLEM, PLEASE
        DO NOT USE THIS CLASS OUTSIDE OF THIS PROJECT.

        Color assignment must be done as follows:

                    color4
            color3  color2  color5
                    color1
                    color0

        - Attributes -----------------------------------------------------------
            edges: A dictionary containing the relationship between vertices.
                 
                Example:
                {
                    "red": [["blue", 0], ["yellow", 1]],
                    "blue": [["red", 0]],
                    "yellow": [["red", 1]],
                    "green": []
                }
        ------------------------------------------------------------------------
    */
    constructor(edges) {
        this.edges = edges;
    }

    addEdge(edge) {
        this.edges[edge[0]].push([edge[1], edge[2]]);
        this.edges[edge[1]].push([edge[0], edge[2]]);
    }

    containsEdge(edge){
        if(this.edges[edge[0]]){
            if(isArrayInArray(this.edges[edge[0]], [edge[1], edge[2]])){
                return true;
            }
        }

        if(this.edges[edge[1]]){
            if(isArrayInArray(this.edges[edge[1]], [edge[0], edge[2]])){
                return true;
            }
        }

        return false;
    }

    removeEdge(edge) {
        removeArrayFromArray(this.edges[edge[0]], [edge[1], edge[2]]);
        removeArrayFromArray(this.edges[edge[1]], [edge[0], edge[2]]);
    }

    removeEdges(edges) {
        for (let i = 0; i < edges.length; i++) {
            this.removeEdge(edges[i]);
        }
    }

    getEdges() {
        let graphCopy = _.cloneDeep(this);
        let edgesCopy = graphCopy.edges;

        let edgesArray = [];

        for (var v in edgesCopy) {
            while (edgesCopy[v].length > 0) {
                let edge = _.cloneDeep(edgesCopy[v][0]);
                edge.unshift(v);

                edgesArray.push(edge);
                graphCopy.removeEdge(edge);
            }
        }

        return edgesArray;
    }

    order() {
        return Object.keys(this.edges).length;
    }

    degrees() {
        let ds = [];
        for (var v in this.edges) {
            ds.push(this.edges[v].length);
        }
        return ds;
    }
}

//------------------------------------------------------------------------------
//------------------------------------------------------------- End of Classes -





//- Functions ------------------------------------------------------------------
//------------------------------------------------------------------------------

/* 
Given an array, returns all the combinations.
If length is specified, only returns the combinations of that length. */
function combinations(array, length=null) {
    function _combinations(array, length, i, comb, combs) {
        if (comb.length == length) {
            combs.push(comb);
        } else {
            for (; i <= array.length - length + comb.length; i++) {
                let _comb = _.cloneDeep(comb);
                _comb.push(array[i]);
                _combinations(array, length, i + 1, _comb, combs);
            }
        }
    }

    let combs = [];
    if (length == null) {
        for (let l = 1; l <= array.length; l++) {
            _combinations(array, l, 0, [], combs);
        }
    } else {
        _combinations(array, length, 0, [], combs);
    }

    return combs;
}

/* Removes the first occurrence of array2 in array1. */
function removeArrayFromArray(array1, array2) {
    for (let i = 0; i < array1.length; i++) {
        if (arraysEqual(array1[i], array2)) {
            array1.splice(i, 1);
            return true;
        }
    }
    return false;
}

/* Check if array2 is in array1 */
function isArrayInArray(array1, array2){
    for (let i = 0; i < array1.length; i++) {
        if (arraysEqual(array1[i], array2)) {
            return true;
        }
    }
    return false;
}

/* 
Check if array 'a' is equal to array 'b'
From: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript#16436975
*/
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

/* 
Injects HTML code in the document elements given by the ids.

Code injected must be marked in 'htmlFilePath' with:

<div class='startOfInject'></div>
    // Code to inject
<div class='endOfInject'></div>

Since I can't use php in github pages, this is an alternative.
*/
async function injectHTML(htmlFilePath, ...ids){
    return fetch(htmlFilePath)
            .then(response => response.text())
            .then(data => {
                let re = /<div.*class=['"].*startOfInject.*['"].*>((.|\n|\r)*)<div.*class=['"].*endOfInject.*['"]>/;
                ids.map(id => document.getElementById(id).innerHTML = data.match(re)[1]);
            });
}

//------------------------------------------------------------------------------
//----------------------------------------------------------- End of Functions -