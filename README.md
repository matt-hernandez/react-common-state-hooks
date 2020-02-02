# React Common State Hooks

A set of wrappers around React's useState hook for many common scenarios.
Written with TypeScript and equipped with typings, but available for use
in any JS project.

## useToggle

For when you need to switch things back and forth from `true` to `false`.
The first array item is the current value, the second is a toggle function
that always flips the value, the third value is a function that explicitly
sets the value to `true`, and the last value is a function that explicitly
sets the value to `false`.

```javascript
const [ currentValue, toggle, setToTrue, setToFalse ] = useToggle(true);

// the same order of return values applies regardless of whether initially `true` or `false`
const [ currentValue, toggle, setToTrue, setToFalse ] = useToggle(false);
```
