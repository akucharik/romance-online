var require = {
    baseUrl: '',
	urlArgs: 'bust='+ (new Date().getTime()),
    paths: {
        backbone: 'lib/backbone-1.1.2',
        'class': 'lib/class',
        jquery: 'lib/jquery-2.1.1',
        underscore: 'lib/underscore-1.6.0'
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