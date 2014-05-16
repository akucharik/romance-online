define([
    'class',
    'modules/grid-m',
    'modules/tile'
], function(Class, grid, Tile) {

//    var Node = Class.extend({
//        init: function (distanceValue, movementValue, parent) {
//            this.distanceValue = distanceValue;
//            this.movementValue = movementValue;
//            this.totalValue = this.distanceValue + this.movementValue;
//            this.parent = parent;
//        }
//    });
    
    var Pathfinder = Class.extend({
        init: function () {
            this.path = [];
            this.tiles = grid.get('tiles');
            //this.evaluated = [];
            //this.unevaluated = [];
        },

        clearPath: function () {
            if(this.path.length > 0) {
                this.path = [];
            }
        },
        
        findPath: function (endTile, character) {
            // Used in the calculatePath function to store route costs, etc.
            var Node = Class.extend({
                init: function (parent, point) {
                    // pointer to another Node object
                    this.parent = parent,
                    this.evaluated = false,
                    // array index of this Node in the world linear array
                    this.id = grid.buildTileId(point.x, point.y),
                    // the location coordinates of this Node
                    this.x = point.x,
                    this.y = point.y,
                    this.dValue = 1,
                    // the distanceFunction cost to get to this Node from the START
                    this.f = 0,
                    // the distanceFunction cost to get from this Node to the GOAL
                    this.g = 0
                }
            });
            
            var nodes = [];
            var tilesLength = grid.get('tiles').length;
            for (var i = 0; i < tilesLength; i++) {
                nodes.push(new Node(null, {x: grid.get('tiles')[i].gridPosition.x, y: grid.get('tiles')[i].gridPosition.y}));
            }
            //console.log('nodes: ', nodes);
            var startTile = character.get('currentTile');
            
            // distance functions
            // linear movement - no diagonals - just cardinal directions (NSEW)
            var manhattanDistance = function (point, endNode) {
                return Math.abs(point.x - endNode.x) + Math.abs(point.y - endNode.y);
            };
            
            var distanceFunction = manhattanDistance;
            
            var worldSize = grid.get('tilesX') * grid.get('tilesY');
            
            var getNeighbors = function (x, y) {
                var north = y - 1,
                    south = y + 1,
                    east = x + 1,
                    west = x - 1;
                var neighbors = [];

                // north
                if (north >= 0){
                    if (grid.get('tiles')[grid.buildTileId(x, north)].isMoveable()) {
                        neighbors.push(nodes[grid.buildTileId(x, north)]);
                    }
                }
                // south
                if (south < grid.get('tilesY')) {
                    if (grid.get('tiles')[grid.buildTileId(x, south)].isMoveable()) {
                        neighbors.push(nodes[grid.buildTileId(x, south)]);
                    }
                }
                // east
                if (east < grid.get('tilesX')) {
                    if (grid.get('tiles')[grid.buildTileId(east, y)].isMoveable()) {
                        neighbors.push(nodes[grid.buildTileId(east, y)]);
                    }
                }
                // west
                if (west >= 0) {
                    if (grid.get('tiles')[grid.buildTileId(west, y)].isMoveable()) {
                        neighbors.push(nodes[grid.buildTileId(west, y)]);
                    }
                }
                
                return neighbors;
            };
            
//            var canWalkHere function (x, y) {
//                return ((world[x] != null) &&
//                    (world[x][y] != null) &&
//                    (world[x][y] <= maxWalkableTileNum));
//            };
//            
//            // Used in the calculatePath function to store route costs, etc.
//            var node = function (parent, point)
//            {
//                var newNode = {
//                    // pointer to another Node object
//                    parent: parent,
//                    // array index of this Node in the world linear array
//                    value: grid.buildTileId(point.x, point.y),
//                    // the location coordinates of this Node
//                    x: point.x,
//                    y: point.y,
//                    // the distanceFunction cost to get to this Node from the START
//                    f: 0,
//                    // the distanceFunction cost to get from this Node to the GOAL
//                    g: 0
//                };
//
//                return newNode;
//            };
            
            
            
            var calculatePath = function () {
                // create Nodes from the Start and End x,y coordinates
                var	mypathStart = new Node(null, {x: startTile.gridPosition.x, y: startTile.gridPosition.y});
                var mypathEnd = new Node(null, {x: endTile.gridPosition.x, y: endTile.gridPosition.y});
                // create an array that will contain all world cells
                var AStar = new Array(worldSize);
                // list of currently open Nodes
                var Open = [mypathStart];
                // list of closed Nodes
                var Closed = [];
                // list of the final output array
                var result = [];
                // reference to a Node (that is nearby)
                var myNeighbours;
                // reference to a Node (that we are considering now)
                var myNode;
                // reference to a Node (that starts a path in question)
                var myPath;
                // temp integer variables used in the calculations
                var length, max, min, i, j;
                // iterate through the open list until none are left
                while(length = Open.length) {
                    max = worldSize;
                    min = -1;
                    for(i = 0; i < length; i++) {
                        if(Open[i].f < max) {
                            max = Open[i].f;
                            min = i;
                        }
                    }
                    // grab the next node and remove it from Open array
                    myNode = Open.splice(min, 1)[0];
                    // is it the destination node?
                    if(myNode.value === mypathEnd.value) {
                        myPath = Closed[Closed.push(myNode) - 1];
                        do {
                            result.push([myPath.x, myPath.y]);
                        }
                        while (myPath = myPath.Parent);
                        // clear the working arrays
                        AStar = Closed = Open = [];
                        // we want to return start to finish
                        result.reverse();
                    }
                    else { // not the destination
                        // find which nearby nodes are walkable
                        myNeighbours = getNeighbors(myNode.x, myNode.y);
                        // test each one that hasn't been tried already
                        for(i = 0, j = myNeighbours.length; i < j; i++) {
                            myPath = new Node(myNode, myNeighbours[i]);
                            if (!AStar[myPath.value]) {
                                // estimated cost of this particular route so far
                                myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
                                // estimated cost of entire guessed route to the destination
                                myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
                                // remember this new path for testing above
                                Open.push(myPath);
                                // mark this node in the world graph as visited
                                AStar[myPath.value] = true;
                            }
                        }
                        // remember this route as having no more untested options
                        Closed.push(myNode);
                    }
                } // keep iterating until until the Open list is empty
                return result;
            };
            
            var newCalculatePath = function () {
                
                
                var startNode = nodes[grid.buildTileId(startTile.gridPosition.x, startTile.gridPosition.y)];
                var endNode = nodes[grid.buildTileId(endTile.gridPosition.x, endTile.gridPosition.y)];
                var startPath = {
                    nodes: [],
                    value: 0,
                    underestimate: 0
                };
                var evaluated = [];
                var unevaluated = [];
                var possiblePaths = [];
                var cameFrom = 0;
                var bestNodeList = [];
                var bestPath = null;
                var count = 0;
                var minPathValue = grid.get('tilesX') * grid.get('tilesY');
                
                console.log('startNode id: ', startNode.id);
                console.log('endNode id: ', endNode.id);
                startPath.nodes.push(startNode);
                unevaluated.push(startPath);
                
                var translateToTiles = function (nodes) {
                    var nodesLength = nodes.length;
                    var tiles = [];
                    for (var i = 0; i < nodesLength; i++) {
                        tiles.push(grid.get('tiles')[grid.buildTileId(nodes[i].x, nodes[i].y)]);
                    }
                    return tiles;
                };
                
                var sortByKey = function (array, key) {
                    return array.sort(function(a, b) {
                        var x = a[key];
                        var y = b[key];
                        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                    });
                }
                
                var nodeAlreadyTraversed = function (node, path) {
                    return path.nodes.some(function (element, index, array) {
                        return (node.id === element.id);
                    });
                };
//                var nodeAlreadyTraversed = function (node, path) {
//                    var pathLength = path.nodes.length;
//                    for (var i = 0; i < pathLength; i++) {
//                        if (node.id === path.nodes[i].id) {
//                            return true;
//                        }
//                    }
//                    return false;
//                };
                
                while (count < 30001 && unevaluated.length > 0) {
                    var currentPath = unevaluated.shift();
                    //console.log('start path: ', startPath);
                    //console.log('paths in queue: ', unevaluated);
                    //console.log('currentPath: ', currentPath);
                    if(currentPath.value >= minPathValue) {
                        evaluated.push(currentPath);
                    }
                    else {
                        var currentPathEndNode = currentPath.nodes[currentPath.nodes.length - 1];
                        // if end node of a path is the destination, this is a possible path
                        if(currentPathEndNode.id === endNode.id) {
                            if(currentPath.value < minPathValue) {
                                minPathValue = currentPath.value;
                                bestPath = {
                                    nodes: currentPath.nodes.slice(),
                                    value: currentPath.value
                                }
                            }
                        }
                        // look at the path's last node's neighbors
                        else {
                            var neighbors = getNeighbors(currentPathEndNode.x, currentPathEndNode.y);
                            var neighborsLength = neighbors.length;
                            for (var i = 0; i < neighborsLength; i++) {
                                var newPath = {
                                    nodes: currentPath.nodes.slice(),
                                    value: currentPath.value,
                                    underestimate: currentPath.underestimate
                                };
                                // if the neighbor is a previous node in the path, stop    
                                if (nodeAlreadyTraversed(neighbors[i], currentPath)) {
                                    //console.log('already traversed');
                                    evaluated.push(newPath);
                                }
                                // for paths with the same end node, only keep the shortest path
//                                if (unevaluated.length > 0) {
//                                    unevaluated.forEach(function (element, index, array) {
//                                        if (neighbors[i].id === element[element.length - 1].id) {
//                                            neighbors[i].value < element[element.length - 1].value ? unevaluated.splice(index, 1) : neighbors.splice(i, 1);
//                                        }
//                                    });
//                                }
                                // if the neighbor is a new node, keep evaluating the path
                                else {
                                    newPath.nodes.push(neighbors[i]);
                                    newPath.value += neighbors[i].dValue;
                                    newPath.underestimate = newPath.value + Math.abs(neighbors[i].x - endNode.x) + Math.abs(neighbors[i].y - endNode.y) 
                                    unevaluated.unshift(newPath);
                                    sortByKey(unevaluated, 'underestimate');
                                }
                            }
                        }
                    }
                    count++;
                }
                console.log('iterations: ', count);
                return bestPath;
            };
            
            //console.log(getNeighbors(startTile.gridPosition.x, startTile.gridPosition.y));
            console.log('best path: ', newCalculatePath());
            
            // only set the path if the focused tile is in the path
            //if (endTile.isEqual(newPath[newPath.length - 1])) {
            //    this.path = calculatePath();
            //}
            //else { 
            //    this.path = [];
            //}
            
//            var currentTile = character.get('currentTile');
//            var newPath = [];
//
//            for (var i = 0; i < character.get('movementRange'); i++) {
//                var deltaTileCol = currentTile.gridPosition.x - endTile.gridPosition.x;
//                var deltaTileRow = currentTile.gridPosition.y - endTile.gridPosition.y;
//
//                // default the next position to the current position
//                var nextTileX = currentTile.gridPosition.x;
//                var nextTileY = currentTile.gridPosition.y;
//
//                // determine next tile to step to
//                if (Math.abs(deltaTileRow) >= Math.abs(deltaTileCol)) {
//                    if (deltaTileRow < 0) {
//                        nextTileY++;
//                    }
//                    if (deltaTileRow > 0) {
//                        nextTileY--;
//                    }
//                }
//                if (Math.abs(deltaTileCol) > Math.abs(deltaTileRow)) {
//                    if (deltaTileCol < 0) {
//                        nextTileX++;
//                    }
//                    if (deltaTileCol > 0) {
//                        nextTileX--;
//                    }
//                }
//                currentTile = grid.get('tiles')[grid.buildTileId(nextTileX, nextTileY)];
//                newPath.push(currentTile);
//
//                // end path
//                if (currentTile.isEqual(endTile)) {
//                    break;
//                }
//            }
//
//            // only set the path if the focused tile is in the path
//            if (endTile.isEqual(newPath[newPath.length - 1])) {
//                this.path = newPath;
//            }
//            else { 
//                this.path = [];
//            }
        },

        isTileInPath: function (tile) {
            for (var i = 0; i < this.path.length; i++) {
                if (this.path[i].isEqual(tile)) {
                    return true;
                }
            };
            return false;
        },

        selectPath: function (character) {
            character.set('path', this.path.slice());
            this.path = [];
        }
    });
    
	return new Pathfinder();
});