# Action

A pure update to the application's state. When an action updates a piece of state, any parent references are cloned for simplified change tracking. Consider the following;

```javascript
let prev = {a: {}, b: {d: []}, c: {}};
let next = appendItemToBD('some-item'); // {a: {}, b: {d: ['some-item']}, c: {}}
```

In this instance `next === prev`, `next.b === prev.b` and `next.b.d === prev.b.d` would all return `false`. However since neither `a` or `c` changed `next.a === prev.a` and `next.c === prev.c` would both return `true`.

Instead of requiring the developer to walk the state tree with every update or create reducer functions, actions can add a `slice` property to their prototype that defines what part of the state tree is being updated.

```javascript
function appendItemToBD(item, slice) {
	return state.concat(item);
}
appendItemToBD.slice = 'b.d';
```

> Note last parameter of your function will always be the previous slice of state. If a slice property is not provided you would get the entire state object and be expected to update everything properly.

# Command

An isomorphic action with side effects

# Event

The result of a command
