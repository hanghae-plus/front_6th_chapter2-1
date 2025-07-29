export const addToCart = (cartList, itemToAddId) => {
  const idx = cartList.findIndex((item) => item.id === itemToAddId);

  if (idx !== -1) {
    cartList[idx].count += 1;
  } else {
    cartList.push({
      id: itemToAddId,
      count: 1,
    });
  }
};

export const deleteFromCart = (cartList, itemToDeleteId) => {
  const idx = cartList.findIndex((item) => item.id === itemToDeleteId);

  if (idx !== -1) {
    if (cartList[idx].count > 1) {
      cartList[idx].count -= 1;
    } else {
      cartList.splice(idx, 1);
    }
  }
};

export const removeFromCart = (cartList, itemToRemoveId) => {
  const idx = cartList.findIndex((item) => item.id === itemToRemoveId);

  if (idx !== -1) {
    cartList.splice(idx, 1);
  }
};