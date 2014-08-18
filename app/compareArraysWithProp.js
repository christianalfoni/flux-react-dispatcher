'use strict';
module.exports = function (propA, arrayA, propB, arrayB) {

  for (var x = 0; x < arrayA.length; x++) {
    var doesExist = false;
    for (var y = 0; y < arrayB.length; y++) {
      if ((propA ? arrayA[x][propA] : arrayA[x]) === (propB ? arrayB[y][propB] : arrayB[y])) {
        doesExist = true;
      }
    }
    if (!doesExist) {
      return false;
     }
  }
  return true;
};