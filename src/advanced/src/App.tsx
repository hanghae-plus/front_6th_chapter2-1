import Header from './components/Header';
import CartLayout from './components/CartLayout';
import type { appState, CartProduct, Product } from './type';
import { PRODUCT_ID } from './constants';
import ManualButton from './components/Button/ManualButton';

function App() {
  const productList: Product[] = [
    {
      id: PRODUCT_ID[1],
      name: '버그 없애는 키보드',
      changedPrice: 10000, // 변동된 가격
      originalPrice: 10000, // 원래 가격
      quantity: 50, // 재고 수
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_ID[2],
      name: '생산성 폭발 마우스',
      changedPrice: 20000,
      originalPrice: 20000,
      quantity: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_ID[3],
      name: '거북목 탈출 모니터암',
      changedPrice: 30000,
      originalPrice: 30000,
      quantity: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_ID[4],
      name: '에러 방지 노트북 파우치',
      changedPrice: 15000,
      originalPrice: 15000,
      quantity: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_ID[5],
      name: '코딩할 때 듣는 Lo-Fi 스피커',
      changedPrice: 25000,
      originalPrice: 25000,
      quantity: 10,
      onSale: false,
      suggestSale: false,
    },
  ];

  const cartList: CartProduct[] = [];

  const appState: appState = {
    totalPoints: 0, // 최종 적립 포인트
    pointsDetail: [], // 포인트 상세 문자열

    totalProductCount: 0, // 장바구니 내 총 상품 수 (헤더)
    totalBeforeDiscount: 0, // 할인 전 장바구니 내 총 상품 가격
    totalAfterDiscount: 0, // 장바구니 내 총 상품 가격

    totalDiscountedRate: 0, // 총 할인율
    discountedProductList: [], // 할인 적용된 상품 목록
    lastSelectedProductId: null, // 제일 최근에 장바구니에 담은 상품의 id
  };

  return (
    <div>
      <Header appState={appState} />
      <CartLayout productList={productList} cartList={cartList} appState={appState} />
      <ManualButton />
    </div>
  );
}

export default App;
