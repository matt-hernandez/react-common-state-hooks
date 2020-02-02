import { renderHook, act } from '@testing-library/react-hooks'
import {
  useToggle,
  useToggleOnce,
  useToggleValues,
  useValues,
  useRange,
  useResolver,
  useAsyncResolver
} from './index';
import { range } from './range';

describe('useToggle', () => {
  test('should toggle between `true` and `false` and change explicitly', () => {
    const initial = true;
    const { result } = renderHook(() => useToggle(initial));
    expect(result.current[0]).toBe(initial);
    function testToggle(whichFunc: 'toggle' | 'setToTrue' | 'setToFalse', startValue: boolean, endValue: boolean) {
      let [ value, toggle, setToTrue, setToFalse ] = result.current;
      expect(value).toBe(startValue);
      act(() => {
        if (whichFunc === 'toggle') {
          toggle();
        } else if (whichFunc === 'setToTrue') {
          setToTrue();
        } else if (whichFunc === 'setToFalse') {
          setToFalse();
        }
      });
      [ value ] = result.current;
      expect(value).toBe(endValue);
    }
    testToggle('toggle', true, false);
    testToggle('toggle', false, true);
    testToggle('setToFalse', true, false);
    testToggle('setToFalse', false, false);
    testToggle('setToTrue', false, true);
    testToggle('setToTrue', true, true);
  });
})

describe('useToggleOnce', () => {
  test('should go from `true` to `false` once and never go back regardless of how many times called', () => {
    const initial = true;
    const { result } = renderHook(() => useToggleOnce(initial));
    expect(result.current[0]).toBe(initial);
    function testToggleOnce(startValue: boolean, endValue: boolean) {
      let [ value, toggle ] = result.current;
      expect(value).toBe(startValue);
      act(() => {
        toggle();
      });
      [ value ] = result.current;
      expect(value).toBe(endValue);
    }
    testToggleOnce(true, false);
    testToggleOnce(false, false);
    testToggleOnce(false, false);
  });
  
  test('should go from `false` to `true` once and never go back regardless of how many times called', () => {
    const initial = false;
    const { result } = renderHook(() => useToggleOnce(initial));
    expect(result.current[0]).toBe(initial);
    function testToggleOnce(startValue: boolean, endValue: boolean) {
      let [ value, toggle ] = result.current;
      expect(value).toBe(startValue);
      act(() => {
        toggle();
      });
      [ value ] = result.current;
      expect(value).toBe(endValue);
    }
    testToggleOnce(false, true);
    testToggleOnce(true, true);
    testToggleOnce(true, true);
  });
});

describe('useToggleValues', () => {
  test('should toggle between two arbitrary values and change explicitly', () => {
    const values = ['a', 'b'];
    const initial = values[0];
    const { result } = renderHook(() => useToggleValues(initial, values));
    expect(result.current[0]).toBe(initial);
    function testToggleValues<T>(whichFunc: 'toggle' | 'setToFirst' | 'setToSecond', startValue: T, endValue: T) {
      let [ value, toggle, setToFirst, setToSecond ] = result.current;
      expect(value).toBe(startValue);
      act(() => {
        if (whichFunc === 'toggle') {
          toggle();
        } else if (whichFunc === 'setToFirst') {
          setToFirst();
        } else if (whichFunc === 'setToSecond') {
          setToSecond();
        }
      });
      [ value ] = result.current;
      expect(value).toBe(endValue);
    }
    testToggleValues('toggle', values[0], values[1]);
    testToggleValues('toggle', values[1], values[0]);
    testToggleValues('setToSecond', values[0], values[1]);
    testToggleValues('setToSecond', values[1], values[1]);
    testToggleValues('setToFirst', values[1], values[0]);
    testToggleValues('setToFirst', values[0], values[0]);
  });
});

describe('useValues', () => {
  test('should change state value corresponding to listener in array', () => {
    const values = ['a', 'b', 'c'];
    const initial = values[0];
    const { result } = renderHook(() => useValues(initial, values));
    expect(result.current[0]).toBe(initial);
    function testValues(startValueIndex: number, i: number) {
      let [ value, ...listeners ] = result.current;
      expect(value).toBe(values[startValueIndex]);
      act(() => {
        listeners[i]();
      });
      [ value ] = result.current;
      expect(value).toBe(values[i]);
    }
    testValues(0, 1);
    testValues(1, 2);
    testValues(2, 0);
    testValues(0, 2);
    testValues(2, 1);
    testValues(1, 0);
    testValues(0, 0);
    testValues(0, 1);
    testValues(1, 1);
    testValues(1, 2);
    testValues(2, 2);
  });
});

describe('useRange', () => {
  test('should have a working reliance on the `range` function', () => {
    const min = 0;
    const max = 5;
    const values = range([min, max]);
    expect(values.length).toBe(max);
    expect(values[0]).toBe(min);
    expect(values[1]).toBe(1);
    expect(values[4]).toBe(max - 1);
    expect(values[max]).toBeFalsy();
  });

  test('should return an array of state changers in a range from `min` and `max`', () => {
    const min = 0;
    const max = 5;
    const minAndMax = [min, max];
    const values = range(minAndMax);
    const initial = min;
    const { result } = renderHook(() => useRange(initial, minAndMax));
    function testRange(startValueIndex: number, i: number) {
      let [ value, ...listeners ] = result.current;
      expect(value).toBe(values[startValueIndex]);
      act(() => {
        listeners[i]();
      });
      [ value ] = result.current;
      expect(value).toBe(values[i]);
    }
    testRange(0, 1);
    testRange(1, 2);
    testRange(2, 3);
    testRange(3, 4);
    testRange(4, 4);
    testRange(4, 2);
    testRange(2, 0);
    testRange(0, 4);
    testRange(4, 1);
    testRange(1, 1);
  });
});
