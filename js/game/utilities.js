define(function() {

    var Utilities = {

        Math: {
            average: function (array) {
                var total = 0;
                for (var i = 0; i < array.length; i++) {
                    total += array[i];
                }
                return total / array.length;
            }
        },

        Array: {
            filterByKey: function (array, key, value) {
                return array.filter(function (element, index, array) {
                    return (element[key] === value);
                });
            },

            sortByKey: function (array, key) {
                return array.sort(function (a, b) {
                    var x = a[key];
                    var y = b[key];
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });
            }
        }
    };
    
	return Utilities;
});