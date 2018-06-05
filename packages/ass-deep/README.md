# ass-deep

> Update a value in a deeply nested object and clone each node touched for simple change tracking `===`.


```javascript
let current = {
    a: {
        b: [],
        c: true
    },
    d: [],
    e: {
        f: {
            g: 'hello'
        },
        h: {
            i: 0
        }
    }
};

let next = assign(current, 'e.h.i', 1);

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

A common way to solve this problem would be through the use of the Object spread operator.

```javascript
let current = {
    a: {
        b: [],
        c: true
    },
    d: [],
    e: {
        f: {
            g: 'hello'
        },
        h: {
            i: 0
        }
    }
};

let next = {
    ...current,
    e: {
        ...current.e,
        h: {
            ...current.h,
            i: 1
        }
    }
}

```

## Benchmarks