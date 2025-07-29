import { DISCOUNT_RATE } from "../constants";
import { prodList } from "../data";

const getQuantity = (item) =>
  Number(item.querySelector(".quantity-number").textContent);
const sumFn = (acc, cur) => acc + cur;

const setPriceFontWeight = (cartItems) => {
  cartItems.forEach((item) => {
    const priceTexts = item.querySelectorAll(".text-lg");
    priceTexts.forEach((text) => {
      text.style.fontWeight = getQuantity(item) >= 10 ? "bold" : "normal";
    });
  });
};

export const getOrderSummary = ({ cartItems }) => {
  const prodListMap = new Map(prodList.map((item) => [item.id, item]));

  const totalItemCount = cartItems
    .map((item) => getQuantity(item))
    .reduce(sumFn, 0);
  let totalDiscountedPrice = cartItems
    .map(
      (item) =>
        prodListMap.get(item.id).price *
        getQuantity(item) *
        (1 - (getQuantity(item) >= 10 ? DISCOUNT_RATE[item.id] || 0 : 0))
    )
    .reduce(sumFn, 0);

  const totalOriginalPrice = cartItems
    .map((item) => prodListMap.get(item.id).price * getQuantity(item))
    .reduce(sumFn, 0);

  const itemDiscounts = cartItems
    .filter(
      (item) => (getQuantity(item) >= 10 && DISCOUNT_RATE[item.id]) || 0 > 0
    )
    .map((item) => ({
      name: prodListMap.get(item.id).name,
      discount:
        (getQuantity(item) >= 10 ? DISCOUNT_RATE[item.id] || 0 : 0) * 100,
    }));

  setPriceFontWeight(cartItems);

  let totalDiscountRate =
    totalItemCount >= 30
      ? 25 / 100
      : (totalOriginalPrice - totalDiscountedPrice) / totalOriginalPrice;

  totalDiscountedPrice =
    totalItemCount >= 30
      ? (totalOriginalPrice * 75) / 100
      : totalDiscountedPrice;

  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const tuesdaySpecial = document.getElementById("tuesday-special");
  if (isTuesday) {
    if (totalDiscountedPrice > 0) {
      totalDiscountedPrice = (totalDiscountedPrice * 90) / 100;
      totalDiscountRate = 1 - totalDiscountedPrice / totalOriginalPrice;
      tuesdaySpecial.classList.remove("hidden");
    } else {
      tuesdaySpecial.classList.add("hidden");
    }
  } else {
    tuesdaySpecial.classList.add("hidden");
  }

  document.getElementById("item-count").textContent =
    `🛍️ ${totalItemCount} items in cart`;

  return {
    totalOriginalPrice,
    prodList,
    totalItemCount,
    itemDiscounts,
    isTuesday,
    totalDiscountedPrice,
    totalDiscountRate,
  };
};
