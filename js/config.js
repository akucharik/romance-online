requirejs.config({
    baseUrl: 'js/game',
    paths: {
        backbone: '../libraries/backbone-1.1.2',
        'class': '../libraries/class',
        jquery: '../libraries/jquery-2.1.1',
        libraries: '../libraries',
        underscore: '../libraries/underscore-1.6.0'
    },
    urlArgs: 'bust='+ (new Date().getTime())
});