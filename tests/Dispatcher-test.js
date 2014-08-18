/** @jsx React.DOM */
var expect = require('chai').expect;

describe('Dispatcher', function() {
  it('should be able to permute', function() {
    var permute = require('../app/permute.js');
    expect(permute(3)).to.equal(6);
    expect(permute(4, 4)).to.equal(24);
    expect(permute(2, 4)).to.equal(12);
  });
  it('should be able to find existance of objects in flat against none-flat array', function () {
  	var compareArraysWithProp = require('../app/compareArraysWithProp.js');
  	expect(compareArraysWithProp(
  		null, ['bar'], 'foo', [{foo: 'bar'}]
  	)).to.equal(true);
  	expect(compareArraysWithProp(
  		null, [], 'foo', [{foo: 'bar'}]
  	)).to.equal(true);
  	expect(compareArraysWithProp(
  		null, ['fiz'], 'foo', [{foo: 'bar'}]
  	)).to.equal(false);
  	expect(compareArraysWithProp(
  		null, ['bar', 'abc'], 'foo', [{foo: 'bar'}]
  	)).to.equal(false);
  	expect(compareArraysWithProp(
  		null, ['bar', 'abc'], 'foo', [{foo: 'bar'}, {foo: 'abc'}]
  	)).to.equal(true);
  });
  it('should be able to validate dependency layouts', function () {
  	var isValidDependencyLayout = require('../app/isValidDependencyLayout.js');
  	expect(isValidDependencyLayout('foo', [{
  		foo: 'a',
  		deps: ['b']
  	}, {
  		foo: 'b',
  		deps: []
  	}])).to.eql([{
  		foo: 'b',
  		deps: []
  	}, {
  		foo: 'a',
  		deps: ['b']
  	}]);
  	/* ---- */
  	expect(isValidDependencyLayout('foo', [{
  		foo: 'a',
  		deps: ['b']
  	}, {
  		foo: 'b',
  		deps: ['a']
  	}])).to.eql(false);
  	/* ---- */
  	expect(isValidDependencyLayout('foo', [{
  		foo: 'a',
  		deps: []
  	}, {
  		foo: 'b',
  		deps: ['c']
  	}, {
  		foo: 'c',
  		deps: ['a', 'd']
  	}, {
  		foo: 'd',
  		deps: []
  	}])).to.eql([{
  		foo: 'a',
  		deps: []
  	}, {
  		foo: 'd',
  		deps: []
  	}, {
  		foo: 'c',
  		deps: ['a', 'd']
  	}, {
  		foo: 'b',
  		deps: ['c']
  	}]);
  });
  it('should be able to dispatch to a registered callback with a payload', function () {
  	var ReactDispatcher = require('../app/main.js');
  	var Dispatcher = new ReactDispatcher();
  	var fakeStore = {};
  	var fakePayload = {};
  	Dispatcher.register(fakeStore, function (payload) {
  		expect(payload).to.equal(fakePayload);
  	});
  	Dispatcher.dispatch(fakePayload);
  });
  it('should be able to wait for an other registered callback', function (done) {
  	var Promise = require('es6-promise').Promise;
  	var ReactDispatcher = require('../app/main.js');
  	var Dispatcher = new ReactDispatcher();
  	var fakeStoreA = {};
  	var fakeStoreB = {};
  	var fakeStoreBCalled = false;
  	Dispatcher.register(fakeStoreA, function () {
  		return this.waitFor(fakeStoreB, function () {
  			expect(fakeStoreBCalled).to.equal(true);
  			done();
  		});
  	});
  	Dispatcher.register(fakeStoreB, function () {
  		fakeStoreBCalled = true;
  	});
  	Dispatcher.dispatch();
  });
  it('should give error if stores are waiting for each other', function () {
  	var Promise = require('es6-promise').Promise;
  	var ReactDispatcher = require('../app/main.js');
  	var Dispatcher = new ReactDispatcher();
  	var fakeStoreA = {};
  	var fakeStoreB = {};
  	Dispatcher.register(fakeStoreA, function () {
  		return this.waitFor(fakeStoreB, function () {});
  	});
  	Dispatcher.register(fakeStoreB, function () {
  		var context = this;
  		var throwFunc = function () {
  			context.waitFor(fakeStoreA, function () {});
  		};
  		expect(throwFunc).to.throw(Error);
  	});
  	Dispatcher.dispatch();

  });
});
