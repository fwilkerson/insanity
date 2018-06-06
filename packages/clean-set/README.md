# clean-set

> Quickly update a value in a deeply nested object and clone each node touched for simple change tracking `===`.

```javascript
import cleanSet from 'clean-set';

let current = {
	a: {
		b: [],
		c: true,
	},
	d: [],
	e: {
		f: {
			g: 'hello',
		},
		h: {
			i: 0,
		},
	},
};

let next = cleanSet(current, 'e.h.i', 1);

/**
 * Alternatively you can provide a function for the final parameter to
 * receive the current value of that node.
 *
 * let next = cleanSet(current, 'e.h.i', i => i + 1);
 */

// The value is assigned
console.log(next.e.h.i === current.e.h.i); // false

// Each parent node touched is a new reference
console.log(next.e.h === current.e.h); // false
console.log(next.e === current.e); // false
console.log(next === current); // false

// Untouched references remain the same
console.log(next.e.f === current.e.f); // true
console.log(next.a === current.a); // true
console.log(next.a.b === current.a.b); // true
console.log(next.d === current.d); // true
```

Here's what an object spread equivalent would look like.

```javascript
let next = {
	...current,
	e: {
		...current.e,
		h: {
			...current.h,
			i: 1,
		},
	},
};
```

## Benchmarks

Check out the [es bench link](https://esbench.com/bench/5b16f1cbf2949800a0f61cf2) to run the benchmarks yourself.

Chrome 67

<img src="./benchmarks/chrome_67.png">
