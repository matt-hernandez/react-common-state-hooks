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

test('useToggle should toggle between `true` and `false`', () => {
  const { result } = renderHook(() => useToggle(true));
  expect(result.current[0]).toBe(true);
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
