define([
    'class',
    'modules/tile'
], function(
    Class,
    Tile
) {
    
    var Pathfinder = Class.extend({
        init: function (grid) {
            this.grid = grid,
            this.nodesInRange = {}
        },
        
        addNeighborNode: function (x, y, neighbors) {
            if (this.grid.get('tiles')[Tile.prototype.buildKey(x, y)].isMoveable()) {
                neighbors.push(this.grid.get('tiles')[Tile.prototype.buildKey(x, y)]);
            }
        },
        
        getNeighborNodes: function (node) {
            var north = node.gridY - 1,
                south = node.gridY + 1,
                east = node.gridX + 1,
                west = node.gridX - 1,
                neighbors = [];

            // north
            if (north >= 0) {
                this.addNeighborNode(node.gridX, north, neighbors);
            }
            // south
            if (south < this.grid.get('height')) {
                this.addNeighborNode(node.gridX, south, neighbors);
            }
            // east
            if (east < this.grid.get('width')) {
                this.addNeighborNode(east, node.gridY, neighbors);
            }
            // west
            if (west >= 0) {
                this.addNeighborNode(west, node.gridY, neighbors);
            }

            return neighbors;
        },
        
        visitNode: function (node, data) {
            var neighbors = this.getNeighborNodes(node);
            
            for (var i = 0; i < neighbors.length; i++) {
                var currentNeighbor = neighbors[i];

                if (currentNeighbor.id !== data.startNode.id) {
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
                        if (node.pathCost + currentNeighbor.cost <= data.nodes[currentNeighbor.id].pathCost &&
                            node.path.length < data.nodes[currentNeighbor.id].path.length) {

                            data.nodes[currentNeighbor.id].pathCost = node.pathCost + currentNeighbor.cost;
                            data.nodes[currentNeighbor.id].path = node.path.slice();
                            data.nodes[currentNeighbor.id].path.push(currentNeighbor);
                            this.visitNode(data.nodes[currentNeighbor.id], data);
                        }
                    }
                }
            }
            return data.nodes;
        },
        
        findPaths: function (character) {
            var startNode = _.clone(character.get('currentTile')),
                data = {},
                result = {}
            
            this.nodesInRange = {};
            startNode.path = [];
            startNode.pathCost = 0;
            data = { 
                maxPathCost: character.get('movementRange'), 
                nodes: {},
                startNode: startNode
            };
            
            this.nodesInRange = this.visitNode(startNode, data);
            
            return this.nodesInRange;
        },
        
        isTileInRange: function (tile) {
            for (var i in this.nodesInRange) {
                if (i === tile.id) {
                    return true;
                }
            };
            return false;
        },
        
        visitNodeAttack: function (node, data) {
            var neighbors = this.getNeighborNodes(node);
            
            for (var i = 0; i < neighbors.length; i++) {
                var currentNeighbor = neighbors[i];

                if (currentNeighbor.id !== data.startNode.id) {
                    // visit a new node
                    if (!data.nodes[currentNeighbor.id]) {
                        var newNode = _.clone(currentNeighbor);

                        newNode.path = node.path.slice();
                        newNode.path.push(currentNeighbor);
                        newNode.pathCost = node.pathCost;
                        newNode.pathCost++;

                        if (newNode.pathCost <= data.maxPathCost) {
                            data.nodes[newNode.id] = newNode;
                        }
                        if (newNode.pathCost < data.maxPathCost) {
                            this.visitNode(newNode, data);
                        }
                    }
                }
            }
            return data.nodes;
        },
        
        findEnemies: function (character) {
            var startNode = _.clone(character.get('currentTile')),
                data = {},
                result = {}
            
            this.nodesInRange = {};
            startNode.path = [];
            startNode.pathCost = 0;
            data = { 
                maxPathCost: character.get('attackRange'), 
                nodes: {},
                startNode: startNode
            };
            
            this.nodesInRange = this.visitNodeAttack(startNode, data);
            
            return this.nodesInRange;
        }

    });
    
	return Pathfinder;
});