define([
    'class',
    'modules/constants',
    'modules/grid-m',
    'modules/tile'
], function(Class, constants, grid, Tile) {

    var Pathfinder = Class.extend({
        init: function () {
            this.path = [],
            this.tiles = grid.get('tiles');
        },

        clearPath: function () {
            if(this.path.length > 0) {
                this.path = [];
            }
        },
        
        findRange: function (character) {
            var nodes = {};
            var startTile = character.get('currentTile');
            var maxDistance = character.get('movementRange');
            var tiles = grid.get('tiles');
            
            var Node = Class.extend({
                init: function (tile) {
                    this.evaluated = false,
                    this.id = tile.id,
                    this.x = tile.gridX,
                    this.y = tile.gridY,
                    this.movementValue = tile.movementValue,
                    this.travelledValue = 0
                },
                
                buildKey: function (x, y) {
                    return x + '_' + y;
                }
            });
            
            var Path = Class.extend({
                init: function (nodes, value) {
                    this.nodes = nodes || [],
                    this.value = value || 0
                }
            });
                
            var getNeighbors = function (node) {
                var north = node.y - 1,
                    south = node.y + 1,
                    east = node.x + 1,
                    west = node.x - 1;
                var neighbors = [];

                // north
                if (north >= 0){
                    if (tiles[Tile.prototype.buildKey(node.x, north)].isMoveable()) {
                        neighbors.push(nodes[Node.prototype.buildKey(node.x, north)]);
                    }
                }
                // south
                if (south < grid.get('tilesY')) {
                    if (tiles[Tile.prototype.buildKey(node.x, south)].isMoveable()) {
                        neighbors.push(nodes[Node.prototype.buildKey(node.x, south)]);
                    }
                }
                // east
                if (east < grid.get('tilesX')) {
                    if (tiles[Tile.prototype.buildKey(east, node.y)].isMoveable()) {
                        neighbors.push(nodes[Node.prototype.buildKey(east, node.y)]);
                    }
                }
                // west
                if (west >= 0) {
                    if (tiles[Tile.prototype.buildKey(west, node.y)].isMoveable()) {
                        neighbors.push(nodes[Node.prototype.buildKey(west, node.y)]);
                    }
                }
                
                return neighbors;
            };
            
            for (var i in tiles) {
                nodes[i] = new Node(tiles[i]);
            }
            
            var getTiles = function (rangeNodes) {
                var rangeTiles = {};
                for (var i in rangeNodes) {
                    rangeTiles[rangeNodes[i].id] = grid.get('tiles')[Tile.prototype.buildKey(rangeNodes[i].x, rangeNodes[i].y)];
                }
                return rangeTiles;
            }
            
            var nodeAlreadyTraversed = function (node, path) {
                return path.nodes.some(function (element, index, array) {
                    return (node.id === element.id);
                });
            };
            
            var sortByKey = function (array, key) {
                return array.sort(function (a, b) {
                    var x = a[key];
                    var y = b[key];
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });
            };
            
            var filterByKey = function (array, key, value) {
                return array.filter(function (element, index, array) {
                    return (element[key] === value);
                });
            };
            
            var removeSameEndNodePaths = function (array, node) {
                var newArray = [];
                array.forEach(function (element, index, array) {
                    if (node.id === element.nodes[element.nodes.length - 1].id) {
                        newArray.push(array.splice(index, 1)[0]);
                    }
                });
                return newArray;
            };
                
            
            var calculateRange = function () {
                var	startNode = nodes[Node.prototype.buildKey(startTile.gridX, startTile.gridY)];
                var startPath = new Path([startNode]);
                
                var open = [];
                open.push(startPath);
                var closed = [];
                var paths = [];
                var neighbors = [];
                var currentPath = {};
                var count = 0;
                var resultNodes = {};

                // iterate through the open list until none are left
                while (count < 9001 && open.length > 0) {
                    
                    // pick the first path in the list
                    // this is important to the way the algorithm eliminates duplicate paths
                    var currentPath = open.shift();
                    
                    // handle paths that shouldn't be expanded
                    if(currentPath.value >= maxDistance) {
                        closed.push(currentPath);
                        if (currentPath.value === maxDistance) {
                            paths.push(currentPath);
                        }
                    }
                    
                    // look at the neighbors of path's that need to be expanded
                    else {
                        var currentPathEndNode = currentPath.nodes[currentPath.nodes.length - 1];
                        var neighbors = getNeighbors(currentPathEndNode);
                        for (var i = 0; i < neighbors.length; i++) {
                            var currentNeighbor = neighbors[i];
                            var newPath = new Path(currentPath.nodes.slice(), currentPath.value);
                            
                            // if the neighbor is a previous node in the path, stop    
                            if (nodeAlreadyTraversed(currentNeighbor, currentPath)) {
                                closed.push(newPath);
                            }
                            
                            // if the neighbor is a new node, keep evaluating the path
                            else {
                                newPath.nodes.push(currentNeighbor);
                                newPath.value += currentNeighbor.movementValue;
                                
                                // eliminate duplicate paths
                                if (open.length > 0) {
                                    
                                    // remove paths with the same end node from the queue
                                    var sameEndNodePaths = removeSameEndNodePaths(open, currentNeighbor);
                                    sameEndNodePaths.push(newPath);
                                    
                                    // get the path with the smallest value
                                    sameEndNodePaths = sortByKey(sameEndNodePaths, 'value');
                                    var smallestValuePaths = filterByKey(sameEndNodePaths, 'value', sameEndNodePaths[0].value);
                                    newPath = smallestValuePaths.splice(0, 1)[0];
                                    
                                    // stop evaluating duplicate paths
                                    smallestValuePaths.forEach(function (element, index, array){
                                        paths.push(element);
                                    });
                                }
                                open.push(newPath);
                            }
                        }
                    }
                    count++;
                }
                
                // get nodes from paths
                for (var i = 0; i < paths.length; i++) {
                    paths[i].nodes.forEach(function (element, index, array) {
                        resultNodes[element.id] = element;
                    });
                }
                
//                return {
//                    iterations: count,
//                    open: open,
//                    closed: closed,
//                    result: resultNodes
//                };
                return getTiles(resultNodes);
            };
            
            console.log('range paths: ', calculateRange());
            return calculateRange();                      
        },
        
        findPath: function (endTile, character) {
            var currentTile = character.get('currentTile');
            var newPath = [];

            for (var i = 0; i < character.get('movementRange'); i++) {
                var deltaTileCol = currentTile.gridX - endTile.gridX;
                var deltaTileRow = currentTile.gridY - endTile.gridY;

                // default the next position to the current position
                var nextTile = new Tile(currentTile.gridX, currentTile.gridY);

                // determine next tile to step to
                if (Math.abs(deltaTileRow) >= Math.abs(deltaTileCol)) {
                    if (deltaTileRow < 0) {
                        nextTile.gridY++;
                    }
                    if (deltaTileRow > 0) {
                        nextTile.gridY--;
                    }
                }
                if (Math.abs(deltaTileCol) > Math.abs(deltaTileRow)) {
                    if (deltaTileCol < 0) {
                        nextTile.gridX++;
                    }
                    if (deltaTileCol > 0) {
                        nextTile.gridX--;
                    }
                }
                currentTile = grid.getTile(nextTile.gridX, nextTile.gridY);
                newPath.push(currentTile);

                // end path
                if (currentTile.isEqual(endTile)) {
                    break;
                }
            }

            // only set the path if the focused tile is in the path
            if (endTile.isEqual(newPath[newPath.length - 1])) {
                this.path = newPath;
            }
            else {
                this.path = [];
            }
        },
        
        newFindPath: function (endTile, character) {
        
            // distance functions
            // linear movement - no diagonals - just cardinal directions (NSEW)
            var manhattanDistance = function (point, endNode) {
                return (Math.abs(point.x - endNode.x) + Math.abs(point.y - endNode.y)) * constants.tile.movementValue.base;
            };
            
            var distanceFunction = manhattanDistance;
            var nodes = {};
            var startTile = character.get('currentTile');
            var tiles = grid.get('tiles');
            
            var Node = Class.extend({
                init: function (tile, parent) {
                    this.estimatedCompletionValue = 0,
                    this.evaluated = false,
                    this.id = tile.id,
                        this.parent = parent || null,
                    this.x = tile.gridX,
                    this.y = tile.gridY,
                    this.movementValue = tile.movementValue,
                    this.travelledValue = 0
                },
                
                buildKey: function (x, y) {
                    return x + '_' + y;
                }
            });
            
            
            
            var getNeighbors = function (node) {
                var north = node.y - 1,
                    south = node.y + 1,
                    east = node.x + 1,
                    west = node.x - 1;
                var neighbors = [];

                // north
                if (north >= 0){
                    if (tiles[Tile.prototype.buildKey(node.x, north)].isMoveable()) {
                        neighbors.push(nodes[Node.prototype.buildKey(node.x, north)]);
                    }
                }
                // south
                if (south < grid.get('tilesY')) {
                    if (tiles[Tile.prototype.buildKey(node.x, south)].isMoveable()) {
                        neighbors.push(nodes[Node.prototype.buildKey(node.x, south)]);
                    }
                }
                // east
                if (east < grid.get('tilesX')) {
                    if (tiles[Tile.prototype.buildKey(east, node.y)].isMoveable()) {
                        neighbors.push(nodes[Node.prototype.buildKey(east, node.y)]);
                    }
                }
                // west
                if (west >= 0) {
                    if (tiles[Tile.prototype.buildKey(west, node.y)].isMoveable()) {
                        neighbors.push(nodes[Node.prototype.buildKey(west, node.y)]);
                    }
                }
                
                return neighbors;
            };
            
            for (var i in tiles) {
                nodes[i] = new Node(tiles[i]);
            }
            
            //console.log('tiles: ', tiles);
            //console.log('nodes: ', nodes);
            //console.log('neighbors: ', getNeighbors(nodes['0_0']));
            
            var calculatePath = function () {
                var	startNode = nodes[Node.prototype.buildKey(startTile.gridX, startTile.gridY)];
                startNode.evaluated = true;
                var endNode = nodes[Node.prototype.buildKey(endTile.gridX, endTile.gridY)];
                var startPath = {
                    nodes: [],
                    value: 0,
                    underestimate: 0
                };

                var unevaluated = [];
                var evaluated = [];
                var bestPath = [];
                var neighbors;
                var currentNode;
                // reference to a Node (that starts a path in question)
                var count = 0;
                var minPathValue = grid.get('tilesX') * grid.get('tilesY') * constants.tile.movementValue.tree;
                
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
                
                var sortByLength = function (array) {
                    return array.sort(function(a, b) {
                        var x = a.length;
                        var y = b.length;
                        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                    });
                }
                
                var nodeAlreadyTraversed = function (node, path) {
                    return path.nodes.some(function (element, index, array) {
                        return (node.id === element.id);
                    });
                };
                
                // iterate through the open list until none are left
                while (count < 9001 && unevaluated.length > 0) {
                    var currentPath = unevaluated.shift();
                    //console.log('start path: ', startPath);
                    //console.log('paths in queue: ', unevaluated);
                    //console.log('currentPath: ', currentPath);
                    if(currentPath.value > minPathValue) {
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
                            var neighbors = getNeighbors(currentPathEndNode);
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
                                
                                // if the neighbor is a new node, keep evaluating the path
                                else {
                                    // for paths with the same end node, only keep the shortest path
                                    newPath.nodes.push(neighbors[i]);
                                    newPath.value += neighbors[i].movementValue;
                                    newPath.underestimate = newPath.value + distanceFunction(neighbors[i], endNode);
                                    newPath.length = newPath.nodes.length;
//                                    if (unevaluated.length > 0) {
//                                        // TODO: look into JavaScript filter
//                                        // get all paths with the same end node
//                                        var sameEndNodePaths = [];
//                                        unevaluated.forEach(function (element, index, array) {
//                                            if (neighbors[i].id === element.nodes[element.nodes.length - 1].id) {
//                                                sameEndNodePaths.push(unevaluated.splice(index, 1)[0]);
//                                            }
//                                        });
//                                        // add the path to the new array
//                                        //console.log('same end node paths without current: ', sameEndNodePaths);
//                                        sameEndNodePaths.push(newPath);
//                                        //console.log('same end node paths with current: ', sameEndNodePaths);
//                                        
//                                        // sort the paths by their values, smallest first
//                                        sortByKey(sameEndNodePaths, 'underestimate');
//                                        //console.log('same end node paths with current, sorted: ', sameEndNodePaths);
//                                        // look at all paths with the same smallest value and take the shortest one
//                                        var smallestUnderestimate = sameEndNodePaths[0].underestimate;
//                                        var sameUnderestimatePaths = [];
//                                        sameEndNodePaths.forEach(function (element, index, array) {
//                                            if (element.underestimate === smallestUnderestimate) {
//                                                sameUnderestimatePaths.push(element); 
//                                            }
//                                        });
//                                        // set as new path
//                                        newPath = sortByLength(sameUnderestimatePaths)[0];
//                                        //console.log('path with shortest length: ', newPath)
//                                    }     
                                    unevaluated.unshift(newPath);
                                    sortByKey(unevaluated, 'underestimate');
                                }
                            }
                        }
                    }
                    count++;
                }
                return {
                    iterations: count,
                    bestPath: bestPath
                };
            };
            console.log(calculatePath());
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