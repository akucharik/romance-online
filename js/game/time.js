// @author      Adam Kucharik <akucharik@gmail.com>
// @copyright   2015 Adam Kucharik
// @license     

define([
    'models/time',
    'controllers/time'
], function (
    TimeModel,
    TimeController
) {
    
    'use strict';
    
    var time = new TimeModel();
    
    var timeController = new TimeController({ 
        model: time
    });
    
    return time;
});