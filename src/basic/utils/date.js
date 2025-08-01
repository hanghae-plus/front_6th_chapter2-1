export const getIsTuesday = () => {
  const today = new Date();
  return today.getDay() === 2;
};
