export function range([min, max]: number[]) {
  const array = [];
  for (let i = min; i < max; i++) {
    array.push(i);
  }
  return array;
}
