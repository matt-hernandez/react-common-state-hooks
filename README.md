# React Common State Hooks

[![Build Status](https://travis-ci.com/matt-hernandez/react-common-state-hooks.svg?branch=master)](https://travis-ci.com/matt-hernandez/react-common-state-hooks)
[![Coverage Status](https://coveralls.io/repos/github/matt-hernandez/react-common-state-hooks/badge.svg?branch=master)](https://coveralls.io/github/matt-hernandez/react-common-state-hooks?branch=master)

A set of wrappers around React's useState hook for many common scenarios.
Written with TypeScript and equipped with typings, but available for use
in any React project.

## useToggle

For when you need to switch things back and forth from `true` to `false`.
The first item in the return array is the current value, the second is a
toggle function that always flips the value, the third value is a function
that explicitly sets the value to `true`, and the last value is a function
that explicitly sets the value to `false`.

```javascript
const [ currentValue, toggle, setToTrue, setToFalse ] = useToggle(true);
// the same order of return values applies regardless of whether initially `true` or `false`
const [ currentValue, toggle, setToTrue, setToFalse ] = useToggle(false);
```

## useToggleOnce

For when you need to flip the switch once, and never flip the value again
for as long as the component is mounted. The first item in the return array
is the current value, and the second item is the toggle function that will
only change the value once.

```javascript
const [ currentValue, toggleOnce ] = useToggleOnce(true);
console.log(currentValue); // true
toggleOnce();
console.log(currentValue); // false
toggleOnce();
console.log(currentValue); // false, now and FOREVER! (until component is unmounted)
```

## useToggleValues

For when you need to flip between back and forth between two values that
are not booleans. The first item in the return array is the current value,
the second is a toggle function that always flips the value, the third value
is a function that explicitly sets the value to the first value specified,
and the last value is a function that explicitly sets the value to the second
value specified.

```javascript
const [ currentValue, toggle, setToA, setToB ] = useToggleValues('a', ['a', 'b']);
console.log(currentValue); // 'a'
toggle();
console.log(currentValue); // 'b'
setToA();
console.log(currentValue); // 'a'
setToB();
console.log(currentValue); // 'b'
```

## useValues

For when you have an array of defined values and want functions that
corresponding to changing the state for each one.

```javascript
const [ currentValue, setToOne, setToTwo, setToThree, setToFour ] = useValues(1, [1, 2, 3, 4]);
console.log(currentValue); // 1
setToThree();
console.log(currentValue); // 3
setToTwo();
console.log(currentValue); // 2
setToFour();
console.log(currentValue); // 4
```

This becomes very useful when you have an array of elements mapped
into individual components.

```jsx
const values = [
  'User',
  'Admin',
  'Superadmin'
]
const initial = values[0];
const [ currentValue, ...listeners ] = useValues(initial, values);

return (
  <div>
    User is currently a {currentValue}
    {values.map((value, i) => (
      <button onClick={listeners[i]}>Change to {value}</button>
    ))}
  </div>
);
```

## useRange

For when you have a range of numerical integer values and want functions
to change state for each one. The range is specified as a two-item array
after the initial specified value. The first item is the `min` value
and the last value is the `max`. The range is exclusive for the `max` value.

```javascript
const [ currentValue, setToOne, setToTwo, setToThree, setToFour ] = useRange(1, [1, 5]);
console.log(currentValue); // 1
setToThree();
console.log(currentValue); // 3
setToTwo();
console.log(currentValue); // 2
setToFour();
console.log(currentValue); // 4

// You can always use the spread operator to reduce the number of variables.
const [ currentValue, ...listeners ] = useRange(1, [1, 5]);
```

## useResolver

For when you want a function to be called and have its return value be used
to set the state.

```javascript
const [ currentValue, resolver ] = useResolver(null, () => {
  const value = runComplicatedOperation();
  const transformedValue = runAnotherOperation(value);
  return transformedValue; // this will be the new current value
});
resolver();
```

The second item in the returned array also accepts arguments and will pass
those arguments to your resolver.

```javascript
const [ currentValue, resolver ] = useResolver(null, (...args) => {
  console.log(args); // ['a', 'b']
  const value = runComplicatedOperation();
  const transformedValue = runAnotherOperation(value);
  return transformedValue; // this will be the new current value
});
resolver('a', 'b');
```

This hook may seem a little redundant since all it really does is
reduce a single function call. But it can help clean up organization
of logic when dealing with imported utility functions that you would
like to separate from your React logic.

```jsx
import React from 'react';
import { useResolver } from 'react-common-state-hooks';
import { utilityFn, runHeavyCalculations, doMoreLogic } from './utilities';

function Comp() {
  const [ currentValue, resolver ] = useResolver(null, utilityFn);
  return (
    <select onChange={(event) => {
      const selectValue = event.target.value;
      const calculated = runHeavyCalculations();
      const contextSpecific = doMoreLogic(calculated, selectValue);
      resolver(contextSpecific);
    }}>
      <option value="DAY">Day</option>
      <option value="WEEK">Week</option>
      <option value="YEAR">Year</option>
    </select>
  );
}
```

## useAsyncResolver

For when you have an asynchronous operation and want the return value
of a promise to be used to change your state.

The function passed in as the second hook argument MUST return a Promise.
When the promise resolves successfully, the unwrapped value of the promise
will be used to change the state and trigger a re-render.

```javascript
const [ currentValue, resolver ] = useAsycnResolver(null, () => {
  return fetch('http://example.com/movies.json')
    .then(response => response.json()); // when this resolves, it will be the new value of the state
});
resolver();

// This is also valid
const [ currentValue, resolver ] = useAsycnResolver(null, async () => {
  const movies = await fetch('http://example.com/movies.json')
    .then(response => response.json());
  return movies;
});
resolver();
```

Just as with `useResolver`, arguments given to the second item in the
returned array pass through to the resolver.

```javascript
const [ currentValue, resolver ] = useAsycnResolver(null, async (...args) => {
  console.log(args); // ['a', 'b']
  const movies = await fetch('http://example.com/movies.json')
    .then(response => response.json());
  return movies;
});
resolver('a', 'b');
```

This function does not change the state or trigger a re-render if the
returned Promise fails. For the time being, this library will not try
to implement an API for that scenario. Given how every React app is
different, async failure is a situation that is best left up to you to
figure out.
