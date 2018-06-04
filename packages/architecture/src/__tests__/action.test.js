import test from 'tape';

import {createActions} from '../action';

let store = createStore({
	a: 1,
	b: {
		a: {a: false},
	},
	c: {a: [], b: {a: []}},
});

let actions = createActions(store.getState, {changeA, changeBAA, appendCA});

test('handleAction : simple', tap => {
	let state = store.getState();
	store.setState(actions.changeA(2));
	let next = store.getState();

	tap.notEqual(state, next);
	tap.equal(state.b, next.b);
	tap.equal(state.b.a, next.b.a);
	tap.equal(state.c, next.c);
	tap.equal(state.c.a, next.c.a);
	tap.equal(state.c.b, next.c.b);
	tap.equal(state.c.b.a, next.c.b.a);

	tap.equal(next.a, 2);

	tap.end();
});

test('handleAction : deep', tap => {
	let state = store.getState();
	store.setState(actions.changeBAA(true));
	let next = store.getState();

	tap.notEqual(state, next);
	tap.notEqual(state.b, next.b);
	tap.notEqual(state.b.a, next.b.a);
	tap.equal(state.c, next.c);
	tap.equal(state.c.a, next.c.a);
	tap.equal(state.c.b, next.c.b);
	tap.equal(state.c.b.a, next.c.b.a);

	tap.equal(next.b.a.a, true);

	tap.end();
});

test('handleAction : complex', tap => {
	let state = store.getState();
	store.setState(actions.appendCA('test'));
	let next = store.getState();

	tap.notEqual(state, next);
	tap.notEqual(state.c, next.c);
	tap.notEqual(state.c.a, next.c.a);
	tap.equal(state.c.b, next.c.b);
	tap.equal(state.c.b.a, next.c.b.a);

	tap.equal(next.c.a[0], 'test');

	tap.end();
});

function createStore(init) {
	let state = init;

	return {
		getState() {
			return state;
		},
		setState(next) {
			state = next;
		},
	};
}

function changeA(a) {
	return {a};
}

function changeBAA(a) {
	return {a};
}
changeBAA.slice = `b.a`;

function appendCA(item, state) {
	return {a: state.a.concat(item)};
}
appendCA.slice = `c`;
