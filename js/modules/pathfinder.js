define([
    'class',
    'modules/constants',
    'modules/tile',
    'modules/utilities/jsUtilities'
], function(
    Class, 
    constants,
    Tile, 
    JsUtilities
) {

    var jsUtilities = new JsUtilities();
    
    var Node = Class.extend({
        init: function (options) {
            options = options || {};
            
            this.cost = options.movementValue,
            this.id = options.id,
            this.path = [],
            this.pathCost = 0,
            this.x = options.gridX,
            this.y = options.gridY
        }
    });
    
    var Pathfinder = Class.extend({
        init: function (grid) {
            this.path = [],
            this.grid = grid,
            this.tiles = grid.get('tiles'),
            this.tilesInRange = {},
            this.nodes = this.getNodesFromTiles(grid.get('tiles')),
            this.nodesInRange = {};
        },
        
        reset: function () {
            this.nodesInRange = {};
            this.tilesInRange = {};
        },
        
        clearPath: function () {
            if(this.path.length > 0) {
                this.path = [];
            }
        },
        
        getNodesFromTiles: function (tiles) {
            var nodes = {};
            for (var i in tiles) {
                var node = new Node(tiles[i]);
                nodes[node.id] = node;
            }
            return nodes;
        },
        
        nodesToTiles: function (nodes) {
            var tiles = {};
            for (var i in nodes) {
                tiles[i] = this.grid.get('tiles')[i];
            }
            return tiles;
        },
        
        nodePathToTilePath: function (nodePath) {
            var tilePath = [];
            for (var i = 0; i < nodePath.length; i++) {
                tilePath.push(this.grid.get('tiles')[nodePath[i].id]);
            }
            return tilePath;
        },
        
        isMoveable: function (x, y) {
            return this.tiles[Tile.prototype.buildKey(x, y)].isMoveable()
        },
        
        addNeighborNode: function (x, y, neighbors) {
            //if (this.isMoveable(x, y)) {
                neighbors.push(this.nodes[Tile.prototype.buildKey(x, y)]);
            //}
        },
        
        getNeighborNodes: function (node) {
            var north = node.y - 1,
                south = node.y + 1,
                east = node.x + 1,
                west = node.x - 1,
                neighbors = [];

            // north
            if (north >= 0) {
                this.addNeighborNode(node.x, north, neighbors);
            }
            // south
            if (south < this.grid.get('height')) {
                this.addNeighborNode(node.x, south, neighbors);
            }
            // east
            if (east < this.grid.get('width')) {
                this.addNeighborNode(east, node.y, neighbors);
            }
            // west
            if (west >= 0) {
                this.addNeighborNode(west, node.y, neighbors);
            }

            return neighbors;
        },
        
        visitNode: function (node, data) {
            //console.log('node: ', node);
            var neighbors = this.getNeighborNodes(node);
            
            for (var i = 0; i < neighbors.length; i++) {
                var currentNeighbor = neighbors[i];
                //console.log('current neighbor: ', currentNeighbor);
                // visit a new node
                if (!data.nodes[currentNeighbor.id]) {
                    var newNode = _.clone(currentNeighbor);

                    newNode.path = node.path.slice();
                    newNode.path.push(currentNeighbor);
                    newNode.pathCost = node.pathCost;
                    newNode.pathCost += currentNeighbor.cost;
                    
                    if (newNode.pathCost <= data.maxPathCost) {
                        data.nodes[newNode.id] = newNode;
                    }
                    if (newNode.pathCost < data.maxPathCost) {
                        this.visitNode(newNode, data);
                    }
                }
                // visit an already visited node and assess
                else {
                    if ((node.pathCost + currentNeighbor.cost) < data.nodes[currentNeighbor.id].pathCost) {
                        data.nodes[currentNeighbor.id].pathCost = node.pathCost + currentNeighbor.cost;
                        data.nodes[currentNeighbor.id].path = node.path.slice();
                        data.nodes[currentNeighbor.id].path.push(currentNeighbor);
                        this.visitNode(data.nodes[currentNeighbor.id], data);
                    }
                }
            }
            return data.nodes;
        },
        
        findPaths2: function (character) {
            var startNode = _.clone(this.nodes[character.get('currentTile').id]),
                data = {},
                result = {}
            
            this.reset();
            console.log('nodes: ', this.nodes);
            console.log('start node: ', startNode);
            data = { 
                maxPathCost: character.get('movementRange'), 
                nodes: {}
            };
            data.nodes[startNode.id] = startNode;
            
            this.nodesInRange = this.visitNode(startNode, data);
            this.tilesInRange = this.nodesToTiles(this.nodesInRange);
            
            return this.tilesInRange;
        },
        
        isTileInRange: function (tile) {
            for (var i in this.tilesInRange) {
                if (i === tile.id) {
                    return true;
                }
            };
            return false;
        },
        
        setPath: function (tile, character) {
            character.set('path', this.nodePathToTilePath(this.nodesInRange[tile.id].path).slice());
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
                currentTile = this.grid.getTile(nextTile.gridX, nextTile.gridY);
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
    
	return Pathfinder;
});