'use strict';
module.exports = function (subset, total) {
		if (!total) {
			total = subset;
		}
    var perm = [];
    for (var x = total; x > total-subset; x--) {
     perm.push(x);   
    }
    return perm.reduce(function(previousValue, currentValue){
      return previousValue * currentValue;
    });
};