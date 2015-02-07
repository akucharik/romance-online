define([
	'backbone',
    'constants',
    'eventLog'
], function(
    Backbone,
    constants,
    eventLog
) {

	var CharacterView = Backbone.View.extend({
		
		initialize: function (options) {
            this.parent = options.parent;
			this.elCtx = this.el.getContext('2d');
            this.listenTo(this.model, 'change:currentTile', this.onCurrentTileChange);
            this.listenTo(this.model, 'change:target', this.attack);
            this.listenTo(this.model, 'change:health', this.onHealthChange);
            this.stepTo = this.stepTo.bind(this);
            this.switchCharacters = this.switchCharacters.bind(this);
		},
        
        render: function () {
            var healthDelta = 0;
            
            this.el.width = constants.grid.TILE_SIZE;
            this.el.height = constants.grid.TILE_SIZE;
            this.elCtx.drawImage(
                this.model.get('spritesheet'), 
                this.model.get('spriteX'), 
                this.model.get('spriteY'), 
                this.model.get('spriteWidth'),
                this.model.get('spriteHeight'),
                constants.grid.TILE_SIZE / 2 - this.model.get('spriteWidth'), 
                constants.grid.TILE_SIZE / 2 - this.model.get('spriteHeight'), 
                this.model.get('spriteWidth') * 2, 
                this.model.get('spriteHeight') * 2);
            
            // health number
            this.elCtx.font = "15px Courier";
            this.elCtx.textAlign = "right";

            this.elCtx.strokeStyle = 'rgb(0, 0, 0)';
            this.elCtx.lineWidth = 4;
            this.elCtx.strokeText(this.model.get('health'), constants.grid.TILE_SIZE - 4, constants.grid.TILE_SIZE - 15);

            this.elCtx.fillStyle = 'rgb(255, 255, 255)';
            this.elCtx.fillText(this.model.get('health'), constants.grid.TILE_SIZE - 4, constants.grid.TILE_SIZE - 15);

            // health bar
            this.elCtx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
            this.elCtx.lineWidth = 1;
            this.elCtx.beginPath();
            this.elCtx.rect(3.5, constants.grid.TILE_SIZE - 11.5, constants.grid.TILE_SIZE - 7, 7);
            this.elCtx.stroke();

            this.elCtx.fillStyle = 'rgb(0, 0, 0)';
            this.elCtx.beginPath();
            this.elCtx.rect(4.5, constants.grid.TILE_SIZE - 10.5, constants.grid.TILE_SIZE - 9, 5);
            this.elCtx.fill();

            this.elCtx.fillStyle = 'rgb(0, 255, 0)';
            this.elCtx.beginPath();
            this.elCtx.rect(4.5, constants.grid.TILE_SIZE - 10.5, (constants.grid.TILE_SIZE -9) * this.model.get('health') / this.model.get('maxHealth'), 5);
            this.elCtx.fill();

            this.elCtx.strokeStyle = 'rgb(0, 255, 0)';
            this.elCtx.lineWidth = 1;
            this.elCtx.beginPath();
            this.elCtx.rect(4.5, constants.grid.TILE_SIZE - 10.5, constants.grid.TILE_SIZE - 9, 5);
            this.elCtx.stroke();
            
            if (this.model.get('isTakingDamage') === true) {
                healthDelta = this.model.previous('health') - this.model.get('health');
                
                this.elCtx.font = "15px Courier";
                this.elCtx.textAlign = "right";

                this.elCtx.strokeStyle = 'rgb(0, 0, 0)';
                this.elCtx.lineWidth = 4;
                this.elCtx.strokeText(healthDelta, constants.grid.TILE_SIZE - 4, constants.grid.TILE_SIZE - 45);

                this.elCtx.fillStyle = 'rgb(255, 150, 150)';
                this.elCtx.fillText(healthDelta, constants.grid.TILE_SIZE - 4, constants.grid.TILE_SIZE - 45);
            }
            
            return this;
        },
        
        onHealthChange: function () {
            if (this.model.get('health') < this.model.previous('health')) {
                this.model.set('isTakingDamage', true);
                
                // this needs refactored to NOT use "setTimeout" and instead user a timer and overall game time
                var that = this;
                setTimeout(function () {
                    that.model.set('isTakingDamage', false);
                }, 2000);
            }
            else {
                
            }
        },
                
        moveTo: function (path, callback) {
            console.log('move to');
            //var endTile = node.path.slice(node.length - 1);
            //var path = _.clone(node.path);
            this.followPath(path, callback);
        },
        
        followPath: function (path, callback) {
            if (path.length > 0) {
                //console.log('stepTo: ', this.get('path')[0]);
                this.stepTimer = window.setInterval(this.stepTo, 16, path, callback);
            }
            else {
                //this.model.set('currentTile', path[path.length - 1]);
                callback();
            }
        },
        
        stepTo: function (path, node, callback) {
            var tile = path[0];
            var targetX = tile.x;
            var targetY = tile.y;
            var increment = 6;
            var x = this.model.get('x');
            var y = this.model.get('y');

            // move left
            if (x > targetX) {
                increment = Math.abs(increment) * -1;
                this.model.set('x', x + increment);
                if (x <= targetX) {
                    this.model.set('x', targetX);
                }
            }

            // move right
            if (x < targetX) {
                increment = Math.abs(increment);
                this.model.set('x', x + increment);
                if (x >= targetX) {
                    this.model.set('x', targetX);
                }
            }

            // move up
            if (y > targetY) {
                increment = Math.abs(increment) * -1;
                this.model.set('y', y + increment);
                if (y <= targetY) {
                    this.model.set('y', targetY);
                }
            }

            // move down
            if (y < targetY) {
                increment = Math.abs(increment);
                this.model.set('y', y + increment);
                if (y >= targetY) {
                    this.model.set('y', targetY);
                }
            }

            if (x === targetX && y === targetY) {
                clearInterval(this.stepTimer);
                this.model.set('movementRange', this.model.get('movementRange') - tile.get('cost'));
                path.shift();
                this.followPath(path, callback);
            }
        },
        
        attack: function () {
            if (this.model.get('target') !== null) {
                var damage = Math.round(Math.random() * 1500);

                if (this.model.get('target').get('health') - damage < 0) {
                    this.model.get('target').set('health', 0);
                }
                else {
                    this.model.get('target').set('health', this.model.get('target').get('health') - damage);
                }

                eventLog.add({ message: this.model.get('target').get('name') + ' took ' + damage + ' damage!' });
                this.model.set('target', null);
            }
        },
        
        reset: function () {
            this.model.set('movementRange', this.model.get('maxMovementRange'));
        },
        
        switchCharacters: function (model) {
            this.stopListening(this.model, 'change:currentTile');
            this.model = model;
            this.listenTo(this.model, 'change:currentTile', this.onCurrentTileChange);
        },
        
        tactic: function () {
            
        },
        
        wait: function () {
            
        },
        
        onCurrentTileChange: function () {
            if (this.model.previous('currentTile') !== null) {
                this.model.previous('currentTile').set('occupied', null);
            }
            this.model.get('currentTile').set('occupied', this.model);

            return this.model.get('currentTile');
        },
        
        setStartPosition: function (tile) {
            this.model.set('currentTile', tile);
            this.model.set('x', this.model.get('currentTile').get('x'));
            this.model.set('y', this.model.get('currentTile').get('y'));
            this.parent.grid.get('tiles')[tile.get('id')].set('occupied', this.model);
        },
        
        updateAttribute: function(attribute, change) {
			var currentAttribute = this.model.get(attribute)
            var currentAvailable = this.model.get('availableAttributePoints');
            
            if (currentAttribute < constants.character.ATTRIBUTE_MAX && currentAttribute > 0 && currentAvailable > 0) {
                this.model.set(attribute, currentAttribute + change);
                this.model.set('availableAttributePoints', currentAvailable + (change * -1));
            }
            
            return this.model.get(attribute);
		}
        
	});
	
	return CharacterView;
});