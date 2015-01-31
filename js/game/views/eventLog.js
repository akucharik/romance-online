define([
	'backbone',
    'jquery',
    'views/eventLogItem'
], function(
    Backbone,
    $,
    EventLogItemView
) {

	var EventLogView = Backbone.View.extend({
		
		initialize: function () {
            this.listenTo(this.collection, 'add', this.render);
            this.listenTo(this.collection, 'reset', this.clear);
		},
        
        render: function () {
            var eventLogItemView = new EventLogItemView({
                model: this.collection.at(this.collection.length - 1),
                tagName: 'p',
                template: '#eventLogItemTemplate'
            })
            
            eventLogItemView.$el.fadeTo(0, 0);
            
            this.el.appendChild(eventLogItemView.el);
            
            if (this.el.scrollHeight > this.el.clientHeight) {
                this.$el.animate({
                    scrollTop: this.el.scrollHeight - this.el.clientHeight
                }, {
                    duration: 200,
                    easing: 'swing',
                    complete: function () { 
                        eventLogItemView.$el.fadeTo(300, 1); 
                    }
                });
            }
            else {
                eventLogItemView.$el.fadeTo(300, 1);
            }
            
            return this;
        },
        
        clear: function () {
            this.el.innerHTML = '';
        }
        
	});
	
	return EventLogView;
});