# React Common State Hooks

A set of wrappers around React's useState hook for many common scenarios.
Written with TypeScript and equipped with typings, but available for use
in any JS project.

### useToggle

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

### useToggleOnce

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

### useToggleValues

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

### useValues

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
const options = [
  'Zero',
  'One',
  'Two',
  'Three'
]
const initial = 0;
const values = options.map((_, i) => i);
const [ currentValue, ...changeStateListeners ] = useValues(initial, values);

return (
  <div>
    {options.map((option, i) => (
      <button onClick={changeStateListeners[i]}>{option}</button>
    ))}
  </div>
);
```
