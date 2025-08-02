import React from 'react';
import { 
  Product, 
  CartData, 
  PointsData, 
  isTuesday,
  type Cart
} from './entities';

/**
 * 세일 상태에 따른 상품명 접두사
 * 요구사항: 번개세일(⚡), 추천할인(💝) 표시
 */
export const getProductNamePrefix = (product: Product): string =>
  product.onSale && product.suggestSale ? '⚡💝' :
    product.onSale ? '⚡' :
      product.suggestSale ? '💝' : '';

/**
 * 헤더 컴포넌트
 * 요구사항: 상단 타이틀 및 장바구니 아이템 개수 표시
 */
export function Header({ itemCount }: { itemCount: number }) {
  return (
    <div className="mb-8">
      <h1 className="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div className="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" className="text-sm text-gray-500 font-normal mt-3">🛍️ {itemCount || 0} items in cart</p>
    </div>
  );
}

/**
 * 상품 옵션 컴포넌트
 * 요구사항: 할인 상태 표시, 품절 시 비활성화
 */
export function ProductOption({ item }: { item: Product }) {
  let discountText = '';
  let text = '';
  let className = '';
  let disabled = false;

  if (item.onSale) discountText += ' ⚡SALE';
  if (item.suggestSale) discountText += ' 💝추천';
  
  if (item.quantity === 0) {
    text = `${item.name} - ${item.val}원 (품절)${discountText}`;
    className = 'text-gray-400';
    disabled = true;
  } else if (item.onSale && item.suggestSale) {
    text = `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)`;
    className = 'text-purple-600 font-bold';
  } else if (item.onSale) {
    text = `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`;
    className = 'text-red-500 font-bold';
  } else if (item.suggestSale) {
    text = `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`;
    className = 'text-blue-500 font-bold';
  } else {
    text = `${item.name} - ${item.val}원`;
  }
  
  return (
    <option value={item.id} className={className} disabled={disabled}>
      {text}
    </option>
  );
}

/**
 * 상품 선택 드롭다운
 * 요구사항: 재고 50개 미만 시 테두리 주황색 표시
 */
interface ProductSelectorProps {
  products: Product[];
  hasLowStock: boolean;
  selectedId: string;
  onChange: (productId: string) => void;
  onAddToCart: () => void;
  stockMessages: string[];
}

export function ProductSelector({ 
  products, 
  hasLowStock, 
  selectedId, 
  onChange, 
  onAddToCart,
  stockMessages
}: ProductSelectorProps) {
  const borderColor = hasLowStock ? 'orange' : '';
  
  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select 
        key="product-select"
        id="product-select"
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        style={{ borderColor }}
      >
        <option value="">상품을 선택하세요</option>
        {products.map(item => (
          <ProductOption key={item.id} item={item} />
        ))}
      </select>
      <button 
        onClick={onAddToCart}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
      >
        Add to Cart
      </button>
      {stockMessages.length > 0 && (
        <div className="text-xs text-red-500 mt-3 whitespace-pre-line">
          {stockMessages.join('\n')}
        </div>
      )}
    </div>
  );
}

/**
 * 상품 가격 표시
 * 요구사항: 원가, 할인가, 할인율 표시
 */
export function ProductPrice({ product }: { product: Product }) {
  if (product.onSale || product.suggestSale) {
    const colorClass = product.onSale && product.suggestSale ? 'text-purple-600' :
                      product.onSale ? 'text-red-500' : 'text-blue-500';
    
    return (
      <>
        <span className="line-through text-gray-400">₩{product.originalVal.toLocaleString()}</span>{' '}
        <span className={colorClass}>₩{product.val.toLocaleString()}</span>
      </>
    );
  }
  
  return <>₩{product.val.toLocaleString()}</>;
}

/**
 * 수량 조절 버튼
 * 요구사항: + - 버튼으로 수량 조절
 */
interface QuantityControlsProps {
  productId: string;
  quantity: number;
  onQuantityChange: (productId: string, change: number) => void;
}

export function QuantityControls({ productId, quantity, onQuantityChange }: QuantityControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={() => onQuantityChange(productId, -1)}
        className="w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
      >
        −
      </button>
      <span className="text-sm font-normal min-w-[20px] text-center tabular-nums">
        {quantity}
      </span>
      <button 
        onClick={() => onQuantityChange(productId, 1)}
        className="w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
      >
        +
      </button>
    </div>
  );
}

/**
 * 장바구니 아이템 컴포넌트
 * 요구사항: 상품 정보, 수량 조절, 삭제 기능
 */
interface CartItemProps {
  item: Product;
  quantity: number;
  onQuantityChange: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, quantity, onQuantityChange, onRemove }: CartItemProps) {
  const namePrefix = getProductNamePrefix(item);
  
  return (
    <div className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {namePrefix}{item.name}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">
          <ProductPrice product={item} />
        </p>
        <QuantityControls 
          productId={item.id}
          quantity={quantity}
          onQuantityChange={onQuantityChange}
        />
      </div>
      <div className="text-right">
        <div className="text-lg mb-2 tracking-tight tabular-nums">
          <ProductPrice product={item} />
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

/**
 * 장바구니 아이템 목록
 */
interface CartItemsProps {
  cart: Cart;
  products: Product[];
  onQuantityChange: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItems({ cart, products, onQuantityChange, onRemove }: CartItemsProps) {
  return (
    <div id="cart-items">
      {Object.entries(cart).map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        if (!product || quantity <= 0) return null;
        
        return (
          <CartItem
            key={productId}
            item={product}
            quantity={quantity}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        );
      })}
    </div>
  );
}

/**
 * 주문 요약 상세
 * 요구사항: 상품별 금액, 할인, 배송비 표시
 */
export function SummaryDetails({ cartData }: { cartData: CartData }) {
  if (cartData.subtotal <= 0) return null;
  
  return (
    <>
      {/* 상품별 소계 */}
      {cartData.summaryItems.map((item, idx) => (
        <div key={idx} className="flex justify-between text-xs tracking-wide text-gray-400">
          <span>{item.name} x {item.quantity}</span>
          <span>₩{item.total.toLocaleString()}</span>
        </div>
      ))}
      
      <div className="border-t border-white/10 my-3"></div>
      
      {/* 소계 */}
      <div className="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩{cartData.subtotal.toLocaleString()}</span>
      </div>
      
      {/* 할인 내역 */}
      {cartData.itemCount >= 30 ? (
        <div className="flex justify-between text-sm tracking-wide text-green-400">
          <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span className="text-xs">-25%</span>
        </div>
      ) : (
        cartData.itemDiscounts.map((discount, idx) => (
          <div key={idx} className="flex justify-between text-sm tracking-wide text-green-400">
            <span className="text-xs">{discount.name} (10개↑)</span>
            <span className="text-xs">-{discount.discount}%</span>
          </div>
        ))
      )}
      
      {cartData.isTuesday && (
        <div className="flex justify-between text-sm tracking-wide text-purple-400">
          <span className="text-xs">🌟 화요일 추가 할인</span>
          <span className="text-xs">-10%</span>
        </div>
      )}
      
      {/* 배송비 */}
      <div className="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    </>
  );
}

/**
 * 할인 정보 표시
 * 요구사항: 할인율 및 절약 금액 표시
 */
export function DiscountInfo({ cartData }: { cartData: CartData }) {
  if (cartData.discountRate <= 0 || !cartData.savedAmount) return null;
  
  return (
    <div className="bg-green-500/20 rounded-lg p-3 mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
        <span className="text-sm font-medium text-green-400">
          {(cartData.discountRate * 100).toFixed(1)}%
        </span>
      </div>
      <div className="text-2xs text-gray-300">
        ₩{Math.round(cartData.savedAmount).toLocaleString()} 할인되었습니다
      </div>
    </div>
  );
}

/**
 * 총액 표시
 * 요구사항: 최종 결제 금액 및 포인트
 */
interface CartTotalProps {
  cartData: CartData;
  pointsData: PointsData;
}

export function CartTotal({ cartData, pointsData }: CartTotalProps) {
  return (
    <div className="pt-5 border-t border-white/10">
      <div className="flex justify-between items-baseline">
        <span className="text-sm uppercase tracking-wider">Total</span>
        <div className="text-2xl tracking-tight">
          ₩{Math.round(cartData.totalAmount).toLocaleString()}
        </div>
      </div>
      {(pointsData.finalPoints > 0 || cartData.itemCount > 0) && (
        <div className="text-xs text-blue-400 mt-2 text-right">
          <div>적립 포인트: <span className="font-bold">{pointsData.finalPoints}p</span></div>
          {pointsData.details.length > 0 && (
            <div className="text-2xs opacity-70 mt-1">{pointsData.details.join(', ')}</div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 화요일 특별 할인 배너
 * 요구사항: 화요일에만 표시
 */
export function TuesdaySpecialBanner({ show }: { show: boolean }) {
  if (!show) return null;
  
  return (
    <div className="mt-4 p-3 bg-white/10 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-2xs">🎉</span>
        <span className="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
      </div>
    </div>
  );
}

/**
 * 도움말 모달
 */
interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-xl font-bold mb-4">📖 이용 안내</h2>
        
        {/* 할인 정책 */}
        <div className="mb-6">
          <h3 className="text-base font-bold mb-3">💰 할인 정책</h3>
          <div className="space-y-3">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="font-semibold text-sm mb-1">개별 상품</p>
              <p className="text-gray-700 text-xs pl-2">
                • 키보드 10개↑: 10%<br />
                • 마우스 10개↑: 15%<br />
                • 모니터암 10개↑: 20%<br />
                • 스피커 10개↑: 25%
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="font-semibold text-sm mb-1">전체 수량</p>
              <p className="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="font-semibold text-sm mb-1">특별 할인</p>
              <p className="text-gray-700 text-xs pl-2">
                • 화요일: +10%<br />
                • ⚡번개세일: 20%<br />
                • 💝추천할인: 5%
              </p>
            </div>
          </div>
        </div>
        
        {/* 포인트 적립 */}
        <div className="mb-6">
          <h3 className="text-base font-bold mb-3">🎁 포인트 적립</h3>
          <div className="space-y-3">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="font-semibold text-sm mb-1">기본</p>
              <p className="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="font-semibold text-sm mb-1">추가</p>
              <p className="text-gray-700 text-xs pl-2">
                • 화요일: 2배<br />
                • 키보드+마우스: +50p<br />
                • 풀세트: +100p<br />
                • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
              </p>
            </div>
          </div>
        </div>
        
        {/* 팁 */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <p className="text-xs font-bold mb-1">💡 TIP</p>
          <p className="text-2xs text-gray-600 leading-relaxed">
            • 화요일 대량구매 = MAX 혜택<br />
            • ⚡+💝 중복 가능<br />
            • 상품4 = 품절
          </p>
        </div>
      </div>
    </div>
  );
}