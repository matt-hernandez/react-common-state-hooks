import { useState, useCallback } from 'react';

function range([min, max]: [number, number]) {
  const array = [];
  for (let i = min; i < max; i++) {
    array.push(i);
  }
  return array;
}

export type NoArgReturnVoid = () => void;
export type AcceptAllReturnVoid = (...args: any[]) => void;
export type Resolver<T> = (...args: any[]) => T
export type ToggleReturn = [boolean, NoArgReturnVoid, NoArgReturnVoid, NoArgReturnVoid];
export type ToggleValuesReturn<T> = [T, NoArgReturnVoid, NoArgReturnVoid, NoArgReturnVoid];
export type RangeReturn = [number, ...Array<(value: number) => void> ];
export type ResolverReturn<T> = [T, AcceptAllReturnVoid];
export type PromiseReturn<T> = [T, AcceptAllReturnVoid];

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

export function useToggleValues<T>(initial: T, values: T[]): ToggleValuesReturn<T> {
  const [ value, setter ] = useState(initial);
  const [ a, b ] = values;
  return [
    value,
    () => setter(value === a ? b : a),
    () => setter(a),
    () => setter(b)
  ];
}

export function useValues<T>(initial: T, values: T[]): [ T, ...Array<NoArgReturnVoid> ] {
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
    (...args: any[]) => setter(resolver(...args))
  ];
}

export function useAsyncResolver<T>(initial: T, resolver: (...args: any[]) => Promise<T>): PromiseReturn<T> {
  const [ value, setter ] = useState(initial);
  return [
    value,
    (...args: any[]) => {
      resolver(...args)
        .then(value => setter(value));
    }
  ];
}
