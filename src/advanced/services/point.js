export const getCalculatePoints = ({
  totalItemCount,
  totalDiscountedPrice,
  cartItems,
}) => {
  const basePoints = Math.floor(totalDiscountedPrice / 1000);
  const hasKeyboard = cartItems.some((item) => item.id === PRODUCT_ONE);
  const hasMouse = cartItems.some((item) => item.id === PRODUCT_TWO);
  const hasMonitorArm = cartItems.some((item) => item.id === PRODUCT_THREE);

  const saleEvents = [
    {
      condition: () => basePoints > 0,
      calcSalePoint: () => basePoints,
      message: `기본: ${basePoints}p`,
    },
    {
      condition: () => new Date().getDay() === 2 && basePoints > 0,
      calcSalePoint: () => basePoints * 2,
      message: "화요일 2배",
    },
    {
      condition: () => hasKeyboard && hasMouse,
      calcSalePoint: (points) => points + 50,
      message: "키보드+마우스 세트 +50p",
    },
    {
      condition: () => hasKeyboard && hasMouse && hasMonitorArm,
      calcSalePoint: (points) => points + 100,
      message: "풀세트 구매 +100p",
    },
    {
      condition: () => totalItemCount >= 30,
      calcSalePoint: (points) => points + 100,
      message: "대량구매(30개+) +100p",
    },
    {
      condition: () => totalItemCount >= 20 && totalItemCount < 30,
      calcSalePoint: (points) => points + 50,
      message: "대량구매(20개+) +50p",
    },
    {
      condition: () => totalItemCount >= 10 && totalItemCount < 20,
      calcSalePoint: (points) => points + 20,
      message: "대량구매(10개+) +20p",
    },
  ];

  let bonusPoints = 0;
  const pointsDetail = [];
  saleEvents.forEach(({ calcSalePoint, condition, message }) => {
    if (condition()) {
      bonusPoints = calcSalePoint(bonusPoints);
      pointsDetail.push(message);
    }
  });

  return {
    bonusPoints,
    pointsDetail,
  };
};
