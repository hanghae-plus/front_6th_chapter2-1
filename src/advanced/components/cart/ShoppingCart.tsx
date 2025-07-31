import ProductPicker from './ProductPicker';

const ShoppingCart = () => {
  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <ProductPicker />
      <div id="cart-items">{/* 장바구니 아이템들이 동적으로 추가될 영역 */}</div>
    </div>
  );
};

export default ShoppingCart;
