[![Build Status](https://travis-ci.org/christianalfoni/react-flux-dispatcher.svg?branch=master)](https://travis-ci.org/christianalfoni/react-flux-dispatcher)

## React Dispatcher

Part of the FLUX architecture, the dispatcher will let stores register to it with
callbacks. Read more about FLUX and the dispatcher over at [Facebook Flux](http://facebook.github.io/flux/).

Download from **dist**: [ReactDispatcher.min.js](https://rawgithub.com/christianalfoni/react-flux-dispatcher/master/dist/ReactDispatcher.min.js) or install with `npm install react-flux-dispatcher`.

### Scope
- Has a **register** method for registering callbacks to stores
- Has a **dispatch** method for dispatching a payload to all stores
- The callback on **register** receives the payload and a **waitFor** function
- The **waitFor** function is used to wait for specific stores to finish their registered callback before continuing
- The **waitFor** method gives errors if circular dependencies occur
- The **waitFor** callback is bound to the store and receives the payload, for conveniance
- The **waitFor** method takes either a single store or an array of stores
- The dispatcher works with common module loaders

### Example
```javascript
var ReactDispatcher = require('ReactDispatcher');
var Dispatcher = new ReactDispatcher();

var StoreA = {
	data: {},
	handleData: function (payload) {
		this.data = payload.data;
	}
};
var StoreB = {};
Dispatcher.register(StoreA, function (payload, waitFor) {
	switch (payload.type) {
		case 'update':
			waitFor(StoreB, StoreA.handleData);
			break;
	}
});
```
You can combine the dispatcher with the [react-flux-store](https://github.com/christianalfoni/react-flux-store), giving you this syntax:

*Dispatcher.js*
```javascript
var ReactDispatcher = require('react-flux-dispatcher');
module.exports = new ReactDispatcher();
```
*StoreA.js*
```javascript
var Store = require('react-flux-store');
var Dispatcher = require('./Dispatcher.js');
var StoreB = require('./StoreB.js');

var StoreA = Store.create(Dispatcher, {
	data: {},
	dispatch: function (payload, waitFor) {
		waitFor(StoreB, this.replaceData);
	},
	replaceData: function (payload) {
		this.data = payload.data;
		this.emit('change');
	}
});

module.exports = StoreA;
```
*StoreB.js*
```javascript
var Store = require('react-flux-store');
var Dispatcher = require('./Dispatcher.js');

var StoreB = Store.create(Dispatcher, {
	data: {},
	dispatch: function (payload, waitFor) {
		this.manageData(payload.data);
	},
	manageData: function (data) {
		// Do something to the data object
	}
});

module.exports = StoreA;
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
