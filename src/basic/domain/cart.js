import productManager from './product';

export const cartManager = (() => {
  let instance = {}; // { productId: quantity }

  const getItems = () => ({ ...instance });

  const addItem = (productId, quantity = 1) => {
    if (!instance[productId]) instance[productId] = 0;
    instance[productId] += quantity;
  };

  const removeItem = (productId) => {
    delete instance[productId];
  };

  const changeQuantity = (productId, delta) => {
    if (!instance[productId]) return;
    const newQty = instance[productId] + delta;
    if (newQty <= 0) removeItem(productId);
    else instance[productId] = newQty;
  };

  const clear = () => {
    instance = {};
  };

  // ====== 파생 정보 ======

  const getTotalItem = () => {
    return Object.values(instance).reduce((sum, q) => sum + q, 0);
  };

  /** @todo usecase로 추출 */
  //   const getProductsInCart = () => {
  //     return Object.keys(instance).map((id) => {
  //       const product = productManager.getProductById(id); // 메서드 만들면 좋음
  //       return {
  //         ...product,
  //         quantity: instance[id],
  //         totalPrice: product.discountValue * instance[id],
  //       };
  //     });
  //   };

  //   const getSubtotal = () => {
  //     return getProductsInCart().reduce((sum, item) => sum + item.totalPrice, 0);
  //   };

  //   const getTotal = () => {
  //     // 할인이 적용된 최종 금액
  //     // 할인률, 대량구매, 화요일 할인 등 여기에 포함 가능
  //   };

  //   const getBonusPoints = () => {
  //     // 현재 cart 상태로 적립 포인트 계산
  //   };

  //   const getLowStockItems = () => {
  //     return getProductsInCart().filter((p) => p.quantity > 0 && p.quantity < 5);
  //   };

  return {
    getItems,
    addItem,
    removeItem,
    changeQuantity,
    clear,

    getItemCount: getTotalItem,
    getProductsInCart,
    getSubtotal,
    getTotal,
    getBonusPoints,
    getLowStockItems,
  };
})();
