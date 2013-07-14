var require = {
    baseUrl: '',
	urlArgs: 'bust='+ (new Date().getTime()),
    paths: {
        backbone: 'libs/backbone',
        jquery: 'libs/jquery',
		jquery_colorbox: 'libs/jquery.colorbox',
        underscore: 'libs/underscore'
    },
	shim: {
		backbone: {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
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