var require = {
    baseUrl: '',
	urlArgs: 'bust='+ (new Date().getTime()),
    paths: {
        backbone: 'libs/backbone',
        'class': 'libs/class',
        jquery: 'libs/jquery',
		jquery_colorbox: 'libs/jquery.colorbox',
        underscore: 'libs/underscore'
    },
	shim: {
		backbone: {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		},
        'class': {
			exports: 'Class'
		},
		jquery_colorbox: {
			deps: ['jquery'],
			exports: '$'
		},
		underscore: {
			exports: '_'
		}
	}
};