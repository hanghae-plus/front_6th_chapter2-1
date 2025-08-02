function getCurrentDay() {
  return new Date().getDay();
}

export function isTuesday() {
  return getCurrentDay() === 2;
}