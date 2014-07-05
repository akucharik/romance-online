requirejs.config({
    baseUrl: 'js',
    paths: {
        backbone: 'libraries/backbone-1.1.2',
        'class': 'libraries/class',
        jquery: 'libraries/jquery-2.1.1',
        underscore: 'libraries/underscore-1.6.0'
    },
    urlArgs: 'bust='+ (new Date().getTime())
});