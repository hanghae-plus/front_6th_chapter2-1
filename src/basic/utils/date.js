/**
 * @description 화요일인지 아닌지 검증
 * @returns {boolean}
 */
export const isTuesday = () => {
  return new Date().getDay() === 2;
};
