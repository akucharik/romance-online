define([
    'modules/tile'
], function(
    Tile
) {
    
    var Pathfinder = Class.extend({
        init: function (grid) {
            this.grid = grid,
            this.nodesInRange = {}
        },
        
        getNeighborNodes: function (node) {
            var north = node.gridY - 1,
                south = node.gridY + 1,
                east = node.gridX + 1,
                west = node.gridX - 1,
                neighbors = [];

            // north
            if (north >= 0) {
                neighbors.push(this.grid.get('tiles')[Tile.prototype.buildKey(node.gridX, north)]);
            }
            // south
            if (south < this.grid.get('height')) {
                neighbors.push(this.grid.get('tiles')[Tile.prototype.buildKey(node.gridX, south)]);
            }
            // east
            if (east < this.grid.get('width')) {
                neighbors.push(this.grid.get('tiles')[Tile.prototype.buildKey(east, node.gridY)]);
            }
            // west
            if (west >= 0) {
                neighbors.push(this.grid.get('tiles')[Tile.prototype.buildKey(west, node.gridY)]);
            }

            return neighbors;
        },
        
        visitNode: function (node, data) {
            var neighbors = this.getNeighborNodes(node);
            
            for (var i = 0; i < neighbors.length; i++) {
                var currentNeighbor = neighbors[i];

                if (currentNeighbor.id !== data.startNode.id && this.grid.get('tiles')[currentNeighbor.id].isMoveable()) {
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
            
            result = this.visitNode(startNode, data);
            this.nodesInRange = result;
            
            return result;
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
                            this.visitNodeAttack(newNode, data);
                        }
                    }
                }
            }
            return data.nodes;
        },
        
        findEnemies: function (character) {
            var startNode = _.clone(character.get('currentTile')),
                data = {},
                nodesInRange = {},
                result = {}
            
            startNode.path = [];
            startNode.pathCost = 0;
            data = { 
                maxPathCost: character.get('attackRange'), 
                nodes: {},
                startNode: startNode
            };
            
            nodesInRange = this.visitNodeAttack(startNode, data);
            
            for (var i in nodesInRange) {
                if (nodesInRange[i].occupied) {
                    result[i] = nodesInRange[i];
                }
            }

            return result;
        }

    });
    
	return Pathfinder;
});