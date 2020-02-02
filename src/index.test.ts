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
  const { result } = renderHook(() => useToggle(true))

  expect(result.current[0]).toBe(true);

  act(() => {
    result.current[1]();
  });

  expect(result.current[0]).toBe(false);
});
