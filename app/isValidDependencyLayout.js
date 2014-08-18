'use strict';

var permute = require('./permute.js');
var compareArraysWithProp = require('./compareArraysWithProp.js');

module.exports = function (prop, depsLayout) {
  
  depsLayout = depsLayout.slice(0); // Create copy of array since it will be manipulated
  var resolvedDeps = [];
  var maxLoops = permute(depsLayout.length); // Get possible combinations of layout
  var loops = 0;

  // Optimize layout so that less dependency objects
  // are handled first
  depsLayout.sort(function (a, b) {
    return a.deps.length < b.deps.length;
  });

  while (depsLayout.length) {
    if (loops > maxLoops) {
      return false; 
    }
    loops++;
    var depLayout= depsLayout[0];
    var dependenciesLoaded = compareArraysWithProp(null, depLayout.deps, prop, resolvedDeps);
    if (!dependenciesLoaded) {
      depsLayout = depsLayout.concat(depsLayout.splice(0, 1)); // Move first item to end of array
      continue;
    }
    resolvedDeps.push(depLayout);
    depsLayout.splice(0, 1);
  }
  return resolvedDeps;
};