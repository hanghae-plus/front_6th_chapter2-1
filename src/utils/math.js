export const sumMap = (arr, selector = (item) => item) =>
  arr.reduce((acc, item) => acc + selector(item), 0);
