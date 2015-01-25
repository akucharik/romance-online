define([
    'backbone',
    'models/node',
    'models/tile'
], function(
    Backbone,
    Node,
    Tile
) {
    
    var Pathfinder = Class.extend({
        init: function (grid) {
            this.grid = grid,
            this.nodesInRange = {}
        },
        
        convertNodesToTiles: function (nodes) {
            var tiles = [];
            
            for (var node in nodes) {
                tiles.push(this.grid.get('tiles')[nodes[node].get('id')]);
            }
            
            return tiles;
        },
        
        convertHashTableToArray: function (hashTable) {
            var array = [];
            
            for (var item in hashTable) {
                array.push(hashTable[item]);
            }
            
            return array;
        },
        
        getNeighborNodes: function (node) {
            var north = node.get('gridY') - 1,
                south = node.get('gridY') + 1,
                east = node.get('gridX') + 1,
                west = node.get('gridX') - 1,
                gridX = null,
                gridY = null,
                neighbors = [];

            // north
            if (north >= 0) {
                gridX = node.get('gridX');
                gridY = north;
                neighbors.push(new Node({
                    gridX: gridX, 
                    gridY: gridY,
                    cost: this.grid.get('tiles')[Tile.prototype.buildKey(gridX, gridY)].get('cost')
                }));
            }
            // south
            if (south < this.grid.get('height')) {
                gridX = node.get('gridX');
                gridY = south;
                neighbors.push(new Node({
                    gridX: gridX, 
                    gridY: gridY,
                    cost: this.grid.get('tiles')[Tile.prototype.buildKey(gridX, gridY)].get('cost')
                }));
            }
            // east
            if (east < this.grid.get('width')) {
                gridX = east;
                gridY = node.get('gridY');
                neighbors.push(new Node({
                    gridX: gridX, 
                    gridY: gridY,
                    cost: this.grid.get('tiles')[Tile.prototype.buildKey(gridX, gridY)].get('cost')
                }));
            }
            // west
            if (west >= 0) {
                gridX = west;
                gridY = node.get('gridY');
                neighbors.push(new Node({
                    gridX: gridX, 
                    gridY: gridY,
                    cost: this.grid.get('tiles')[Tile.prototype.buildKey(gridX, gridY)].get('cost')
                }));
            }

            return neighbors;
        },
        
        nodeShouldBeVisited: function (neighbor, data) {
            return neighbor.get('id') !== data.startNode.get('id') && this.grid.get('tiles')[neighbor.get('id')].isMoveable();
        },
        
        nodeShouldBeRevisited: function (neighbor, node, data) {
            return node.get('pathCost') + neighbor.get('cost') <= data.nodes[neighbor.get('id')].get('pathCost') &&
                   node.get('path').length < data.nodes[neighbor.get('id')].get('path').length;
        },
        
        visitNode: function (node, data) {
            var neighbors = this.getNeighborNodes(node);
            var neighbor = null;
            var newNode = null;
            var existingNode = null;
            
            for (var i = 0; i < neighbors.length; i++) {
                neighbor = neighbors[i];
                
                if (this.nodeShouldBeVisited(neighbor, data)) {
                    // visit a new node
                    if (!data.nodes[neighbor.get('id')]) {
                        newNode = new Node({
                            gridX: neighbor.get('gridX'),
                            gridY: neighbor.get('gridY'),
                            cost: neighbor.get('cost'),
                            path: node.get('path').slice(),
                            pathCost: node.get('pathCost') + neighbor.get('cost')
                        });
                        
                        newNode.get('path').push(neighbor);

                        if (newNode.get('pathCost') <= data.maxPathCost) {
                            data.nodes[newNode.get('id')] = newNode;
                        }
                        if (newNode.get('pathCost') < data.maxPathCost) {
                            this.visitNode(newNode, data);
                        }
                    }
                    else {
                        if (this.nodeShouldBeRevisited(neighbor, node, data)) {
                            exisitingNode = data.nodes[neighbor.get('id')];
                            exisitingNode.set('path', node.get('path').slice());
                            exisitingNode.get('path').push(neighbor);
                            exisitingNode.set('pathCost', node.get('pathCost') + neighbor.get('cost'));
                            this.visitNode(exisitingNode, data);
                        }
                    }
                }
            }
            return data.nodes;
        },
        
        // Returns an array of nodes
        findPaths: function (character) {
            var data = { 
                maxPathCost: character.get('movementRange'), 
                nodes: {},
                startNode: new Node({
                    gridX: character.get('currentTile').get('gridX'), 
                    gridY: character.get('currentTile').get('gridY')
                })
            };
            var nodesInRange = this.visitNode(data.startNode, data);
            
            return this.convertHashTableToArray(nodesInRange);
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