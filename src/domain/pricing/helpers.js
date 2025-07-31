export function isTuesday(date = new Date()) {
  return date.getDay() === 2; // 0=Sun ... 6=Sat
}
