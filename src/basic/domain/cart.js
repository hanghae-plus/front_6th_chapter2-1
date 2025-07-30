export const cartManager = (() => {
  const instance = {}; // { productId: quantity }
  let lastAddedItem; // 마지막에 추가된 아이템

  const getItems = () => ({ ...instance });

  const addItem = (productId, quantity = 1) => {
    if (!instance[productId]) instance[productId] = 0;
    instance[productId] += quantity;

    lastAddedItem = productId;
  };

  const removeItem = (productId) => {
    delete instance[productId];
  };

  /* productId에 해당하는 값을 delta(delta는 양수 혹은 음수 모두 가능)만큼 증가시킴 */
  const changeQuantity = (productId, delta) => {
    if (!instance[productId]) throw Error('기존에 카트에 담겨있지 않은 상품입니다.');

    const newQuantity = instance[productId] + delta;
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      instance[productId] = newQuantity;
    }
  };

  const clear = () => {
    // instance 내부 내용 다 삭제
    Object.keys(this.state).forEach((key) => delete this.state[key]);

    lastAddedItem = null;
  };

  // ====== 파생 정보 ======

  const getTotalItem = () => {
    return Object.values(instance).reduce((sum, q) => sum + q, 0);
  };

  const getLastAddedItem = () => lastAddedItem;

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
    getLastAddedItem,
    // getProductsInCart,
    // getSubtotal,
    // getTotal,
    // getBonusPoints,
    // getLowStockItems,
  };
})();
