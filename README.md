[![Build Status](https://travis-ci.org/christianalfoni/react-flux-dispatcher.svg?branch=master)](https://travis-ci.org/christianalfoni/react-flux-dispatcher)

## React Dispatcher

Part of [react-flux](https://github.com/christianalfoni/react-flux), the dispatcher will let stores register to it with
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
	dispatch: function () {}
};

var StoreB = {
	data: {},
	handleData: function (payload) {
		this.data = payload.data;
	},
	dispatch: function (payload, waitFor) {
		switch (payload.type) {
			case 'update':
				waitFor(StoreA, this.handleData);
				break;
		}
	}

};
Dispatcher.register(StoreA, StoreA.dispatch); // Binds the callback to the store
Dispatcher.register(StoreB, StoreB.dispatch);
Dispatcher.dispatch({});
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
