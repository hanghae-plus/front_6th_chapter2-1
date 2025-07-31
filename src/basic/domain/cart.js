export const cartManager = (() => {
  let instance = {}; // { productId: quantity }
  let lastAddedItem; // 마지막에 추가된 아이템

  const getQuantityByProductId = (productId) => {
    const quantity = instance[productId];
    if (!quantity) throw Error('doesnt exist');
    return instance[productId];
  };

  const getItems = () =>
    Object.entries(instance).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));

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
    instance = {};

    lastAddedItem = null;
  };

  // ====== 파생 정보 ======

  const getTotalItem = () => {
    return Object.values(instance).reduce((total, quantity) => total + quantity, 0);
  };

  const getLastAddedItem = () => lastAddedItem;

  return {
    getQuantityByProductId,
    getItems,
    addItem,
    removeItem,
    changeQuantity,
    clear,
    getTotalItem,
    getLastAddedItem,
  };
})();
