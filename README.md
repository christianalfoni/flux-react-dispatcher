[![Build Status](https://travis-ci.org/christianalfoni/react-flux-dispatcher.svg?branch=master)](https://travis-ci.org/christianalfoni/react-flux-dispatcher)

## React Dispatcher

Part of the FLUX architecture, the dispatcher will let stores register to it with
callbacks. Read more about FLUX and the dispatcher over at [Facebook Flux](http://facebook.github.io/flux/).

Download from **dist**: [ReactDispatcher.min.js](https://rawgithub.com/christianalfoni/react-flux-dispatcher/master/dist/ReactDispatcher.min.js) or install with `npm install react-flux-dispatcher`.

### Scope
- Has a **register** method for registering callbacks to stores
- Has a **dispatch** method for dispatching a payload to all stores
- Has a **waitFor** method available on the registered callback context to wait for
specific stores to finish their registered callback
- The **waitFor** method gives errors if circular dependencies occur
- The **waitFor** callback is bound to the store for conveniance
- The **waitFor** method takes either a single store or an array of stores
- Works with the common module loaders

### Example
*Dispatcher.js*
```javascript
var ReactDispatcher = require('ReactDispatcher');
var Dispatcher = new ReactDispatcher();
module.exports = Dispatcher;
```
*StoreA.js*
```javascript
var Dispatcher = require('./Dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var StoreA = merge(EventEmitter, {
	data: []
});

Dispatcher.register(StoreA, function (payload) {
	switch (payload.type) {
		case 'updateData':
			return new Promise(function (resolve) {
				StoreA.data = payload.data;
				payload.storeAWasHere = true;
				setTimeout(function () {
					resolve(); // Delay resolvement of StoreA by 500 ms
				}, 500);
			});
			break;
	}
});

module.exports = StoreA;
```
*StoreB.js*
```javascript
var Dispatcher = require('./Dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var StoreA = require('./StoreA.js');

var StoreB = merge(EventEmitter, {

});

Dispatcher.register(StoreB, function (payload) {
	switch (payload.type) {
		case 'updateData':
			this.waitFor(StoreA, function () { // Runs after 500 ms
				console.log(payload.storeAWasHere); // true
				this.emit('update'); // callback of waitFor is bound to the store
			});
			break;
	}
});

module.exports = StoreB;
```

## Contribute

### Develop
* Run `npm install`
* Run `gulp`
* Any changes to files in `app/` will be compiled to `dev/`

### Test
* Run `gulp test -'./tests/ReactDispatcher-test.js'
* Open the `test.html` file in your browser
* Any changes to files in `app/` and the test file will autoreload the browser

### Run test in terminal
* Run `npm test`
* Currently uses phantomJS, though you can use chrome
