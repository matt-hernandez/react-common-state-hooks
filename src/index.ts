import { useState, useCallback } from 'react';

function range([min, max]: [number, number]) {
  const array = [];
  for (let i = min; i < max; i++) {
    array.push(i);
  }
  return array;
}

type NoArgReturnVoid = () => void;
type AnySetter<T> = (value: T) => void;
type Resolver<T> = (...args: any[]) => T
type ToggleReturn = [boolean, NoArgReturnVoid, NoArgReturnVoid, NoArgReturnVoid];
type ToggleValuesReturn<T> = [T, NoArgReturnVoid, NoArgReturnVoid, NoArgReturnVoid];
type RangeReturn = [number, ...Array<(value: number) => void> ];
type ResolverReturn<T> = [T, AnySetter<T>];
type PromiseReturn<T> = [T, (...args: any[]) => void];

export function useToggle(initial: boolean): ToggleReturn {
  const [ value, setter ] = useState(initial);
  return [
    value,
    () => setter(!value),
    () => setter(true),
    () => setter(false)
  ];
}

export function useToggleOnce(initial: boolean): [ boolean, NoArgReturnVoid ] {
  let [ value, toggle ] = useToggle(initial);
  let hasRun = false;
  const cb = useCallback(() => {
    if (hasRun) {
      return;
    }
    hasRun = true; // eslint-disable-line
    toggle();
  }, []);
  return [
    value,
    cb
  ]
}

export function useToggleValues<T>(initial: T, values: [T, T]): ToggleValuesReturn<T> {
  const [ value, setter ] = useState(initial);
  const [ a, b ] = values;
  return [
    value,
    () => setter(value === a ? b : a),
    () => setter(a),
    () => setter(b)
  ];
}

export function useValues<T>(initial: T, values: T[]): [ T, ...Array<AnySetter<T>> ] {
  const [ value, setter ] = useState(initial);
  return [
    value,
    ...values.map(value => () => setter(value))
  ];
}

export function useRange(initial: number, minAndMax: [number, number]): RangeReturn {
  const [ value, setter ] = useState(initial);
  const numbers = range(minAndMax);
  return [
    value,
    ...numbers.map(value => () => setter(value))
  ];
}

export function useResolver<T>(initial: T, resolver: Resolver<T>): ResolverReturn<T> {
  const [ value, setter ] = useState(initial);
  return [
    value,
    () => setter(resolver())
  ];
}

export function usePromiseResolver<T>(initial: T, resolver: (...args: any[]) => Promise<T>): PromiseReturn<T> {
  const [ value, setter ] = useState(initial);
  return [
    value,
    (...args: any[]) => {
      resolver(...args)
        .then(value => setter(value));
    }
  ];
}
