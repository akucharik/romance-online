define([
    'models/tile'
], function(
    Tile
) {
    
    var Pathfinder = Class.extend({
        init: function (grid) {
            this.grid = grid,
            this.nodesInRange = {}
        },
        
        getNeighborNodes: function (node) {
            var north = node.get('gridY') - 1,
                south = node.get('gridY') + 1,
                east = node.get('gridX') + 1,
                west = node.get('gridX') - 1,
                neighbors = [];

            // north
            if (north >= 0) {
                neighbors.push(this.grid.get('tiles')[Tile.prototype.buildKey(node.get('gridX'), north)]);
            }
            // south
            if (south < this.grid.get('height')) {
                neighbors.push(this.grid.get('tiles')[Tile.prototype.buildKey(node.get('gridX'), south)]);
            }
            // east
            if (east < this.grid.get('width')) {
                neighbors.push(this.grid.get('tiles')[Tile.prototype.buildKey(east, node.get('gridY'))]);
            }
            // west
            if (west >= 0) {
                neighbors.push(this.grid.get('tiles')[Tile.prototype.buildKey(west, node.get('gridY'))]);
            }

            return neighbors;
        },
        
        visitNode: function (node, data) {
            var neighbors = this.getNeighborNodes(node);
            
            for (var i = 0; i < neighbors.length; i++) {
                var currentNeighbor = neighbors[i];

                // TODO: consider creating a function like "shouldBeVisited"
                if (currentNeighbor.get('id') !== data.startNode.get('id') && this.grid.get('tiles')[currentNeighbor.get('id')].isMoveable()) {
                    // visit a new node
                    if (!data.nodes[currentNeighbor.get('id')]) {
                        var newNode = _.clone(currentNeighbor);

                        // TODO: consider refactoring this to have a single function call for this and lines 68-70
                        newNode.path = node.path.slice();
                        newNode.path.push(currentNeighbor);
                        newNode.pathCost = node.pathCost + currentNeighbor.get('cost');

                        if (newNode.pathCost <= data.maxPathCost) {
                            data.nodes[newNode.get('id')] = newNode;
                        }
                        if (newNode.pathCost < data.maxPathCost) {
                            this.visitNode(newNode, data);
                        }
                    }
                    // visit an already visited node and assess
                    else {
                        // TODO: consider creating a function like "isAlreadyVisitedAndShouldBeRevisited"
                        if (node.pathCost + currentNeighbor.get('cost') <= data.nodes[currentNeighbor.get('id')].pathCost &&
                            node.path.length < data.nodes[currentNeighbor.get('id')].path.length) {

                            data.nodes[currentNeighbor.get('id')].pathCost = node.pathCost + currentNeighbor.get('cost');
                            data.nodes[currentNeighbor.get('id')].path = node.path.slice();
                            data.nodes[currentNeighbor.get('id')].path.push(currentNeighbor);
                            this.visitNode(data.nodes[currentNeighbor.get('id')], data);
                        }
                    }
                }
            }
            return data.nodes;
        },
        
        findPaths: function (character) {
            var startNode = _.clone(character.get('currentTile')),
                data = {},
                result = {};
            
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
            
            // TODO: temporarily convert nodes to exact tile objects
            var tiles = {};
            for (node in result) {
                tiles[node] = this.grid.getTile(result[node].get('id'));;
            }
            
            return tiles;
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