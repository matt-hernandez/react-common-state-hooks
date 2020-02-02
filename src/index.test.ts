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
