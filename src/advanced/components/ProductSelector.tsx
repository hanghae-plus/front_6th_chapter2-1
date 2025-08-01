import {
  PRODUCT_KEYBOARD,
  PRODUCT_MOUSE,
  PRODUCT_MONITOR_ARM,
  PRODUCT_LAPTOP_POUCH,
  PRODUCT_SPEAKER,
} from '../constants/constants';

export const ProductSelector = () => {
  const productList = [
    {
      id: PRODUCT_KEYBOARD,
      name: '버그 없애는 키보드',
      val: 10000,
      originalVal: 10000,
      availableStock: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_MOUSE,
      name: '생산성 폭발 마우스',
      val: 20000,
      originalVal: 20000,
      availableStock: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_MONITOR_ARM,
      name: '거북목 탈출 모니터암',
      val: 30000,
      originalVal: 30000,
      availableStock: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_LAPTOP_POUCH,
      name: '에러 방지 노트북 파우치',
      val: 15000,
      originalVal: 15000,
      availableStock: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_SPEAKER,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      availableStock: 10,
      onSale: false,
      suggestSale: false,
    },
  ];

  // 옵션 텍스트 생성 함수
  const getOptionText = (product: (typeof productList)[0]) => {
    let discountText = '';

    // 할인 상태 표시
    if (product.onSale) discountText += ' ⚡SALE';
    if (product.suggestSale) discountText += ' 💝추천';

    // 품절 상품 처리
    if (product.availableStock === 0) {
      return `${product.name} - ${product.val}원 (품절)${discountText}`;
    }

    // 할인 조합별 표시
    if (product.onSale && product.suggestSale) {
      return `⚡💝${product.name} - ${product.originalVal}원 → ${product.val}원 (25% SUPER SALE!)`;
    }
    if (product.onSale) {
      return `⚡${product.name} - ${product.originalVal}원 → ${product.val}원 (20% SALE!)`;
    }
    if (product.suggestSale) {
      return `💝${product.name} - ${product.originalVal}원 → ${product.val}원 (5% 추천할인!)`;
    }
    return `${product.name} - ${product.val}원${discountText}`;
  };

  // 옵션 스타일 클래스 생성 함수
  const getOptionClassName = (product: (typeof productList)[0]) => {
    if (product.availableStock === 0) {
      return 'text-gray-400';
    }

    if (product.onSale && product.suggestSale) {
      return 'text-purple-600 font-bold';
    }
    if (product.onSale) {
      return 'text-red-500 font-bold';
    }
    if (product.suggestSale) {
      return 'text-blue-500 font-bold';
    }

    return '';
  };

  return (
    <div className='mb-6 pb-6 border-b border-gray-200'>
      <select
        id='product-select'
        className='w-full p-3 border border-gray-300 rounded-lg text-base mb-3'
      >
        {productList.map((product) => (
          <option
            key={product.id}
            value={product.id}
            disabled={product.availableStock === 0}
            className={getOptionClassName(product)}
          >
            {getOptionText(product)}
          </option>
        ))}
      </select>
      <button
        id='add-to-cart'
        className='w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all'
      >
        Add to Cart
      </button>
      <div
        id='stock-status'
        className='text-xs text-red-500 mt-3 whitespace-pre-line'
      ></div>
    </div>
  );
};
