export const getIsTuesday = (): boolean => {
  const today = new Date();
  return today.getDay() === 2;
};
