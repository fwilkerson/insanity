import test from 'tape';

import {createStore} from '../store';

function createSpy() {
	let count = 0;
	return {
		execute: () => {
			count += 1;
		},
		numberOfExecutions: () => count,
	};
}

test('createStore', tap => {
	let store = createStore();

	tap.assert(typeof store.getState === 'function');
	tap.assert(typeof store.setState === 'function');
	tap.assert(typeof store.subscribe === 'function');
	tap.deepEqual(store.getState(), {});

	let init = {count: 0};
	store = createStore(init);

	tap.equal(store.getState(), init);

	let next = {count: 1};
	let spy = createSpy();
	let otherSpy = createSpy();
	let remove = store.subscribe(spy.execute);
	store.subscribe(otherSpy.execute);
	store.setState(next);

	tap.equal(store.getState(), next);
	tap.assert(spy.numberOfExecutions() === 1);
	tap.assert(otherSpy.numberOfExecutions() === 1);

	store.setState(next);

	tap.equal(store.getState(), next);
	tap.assert(spy.numberOfExecutions() === 1);
	tap.assert(otherSpy.numberOfExecutions() === 1);

	remove();
	store.setState({count: 2});

	tap.assert(spy.numberOfExecutions() === 1);
	tap.assert(otherSpy.numberOfExecutions() === 2);

	tap.end();
});
