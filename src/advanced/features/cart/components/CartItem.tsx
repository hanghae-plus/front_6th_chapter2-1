import { BUSINESS_CONSTANTS } from '@/advanced/shared/constants/business.ts';

interface CartItemProps {
  id: string;
  name: string;
  val: number;
  originalVal: number;
  quantity: number;
  onSale?: boolean;
  suggestSale?: boolean;
  onQuantityChange?: (id: string, change: number) => void;
  onRemove?: (id: string) => void;
}

const CartItem = ({
  id,
  name,
  val,
  originalVal,
  quantity,
  onSale = false,
  suggestSale = false,
  onQuantityChange,
  onRemove,
}: CartItemProps) => {
  // 할인 아이콘 표시
  const getDiscountIcon = () => {
    if (onSale && suggestSale) return '⚡💝';
    if (onSale) return '⚡';
    if (suggestSale) return '💝';
    return '';
  };

  // 가격 스타일 클래스
  const getPriceColorClass = () => {
    if (onSale && suggestSale) return 'text-purple-600';
    if (onSale) return 'text-red-500';
    if (suggestSale) return 'text-blue-500';
    return '';
  };

  // 할인 대상 수량인지 확인
  const isDiscountableQuantity =
    quantity >= BUSINESS_CONSTANTS.DISCOUNT.ITEM_DISCOUNT_MIN_QUANTITY;

  // 수량 변경 핸들러
  const handleQuantityChange = (change: number) => {
    if (onQuantityChange) {
      onQuantityChange(id, change);
    }
  };

  // 제거 핸들러
  const handleRemove = () => {
    if (onRemove) {
      onRemove(id);
    }
  };

  // 가격 렌더링
  const renderPrice = (price: number, quantity: number = 1) => {
    const totalPrice = price * quantity;
    const originalTotalPrice = originalVal * quantity;
    const priceClass = `${getPriceColorClass()}${isDiscountableQuantity && quantity > 1 ? ' font-bold' : ''}`;

    if (onSale || suggestSale) {
      return (
        <>
          <span className='line-through text-gray-400'>
            ₩{originalTotalPrice.toLocaleString()}
          </span>
          <span className={priceClass}>₩{totalPrice.toLocaleString()}</span>
        </>
      );
    }

    return (
      <span
        className={isDiscountableQuantity && quantity > 1 ? 'font-bold' : ''}
      >
        ₩{totalPrice.toLocaleString()}
      </span>
    );
  };

  return (
    <article
      id={id}
      className='grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0'
    >
      <div className='w-20 h-20 bg-gradient-black relative overflow-hidden'>
        <div className='absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45'></div>
      </div>

      <div>
        <h3 className='text-base font-normal mb-1 tracking-tight'>
          {getDiscountIcon()}
          {name}
        </h3>
        <p className='text-xs text-gray-500 mb-0.5 tracking-wide'>PRODUCT</p>
        <p
          className={`text-xs text-black mb-3${isDiscountableQuantity ? ' font-bold' : ''}`}
        >
          {renderPrice(val)}
        </p>
        <div className='flex items-center gap-4'>
          <button
            className='quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white'
            onClick={() => handleQuantityChange(-1)}
          >
            −
          </button>
          <span className='quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums'>
            {quantity}
          </span>
          <button
            className='quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white'
            onClick={() => handleQuantityChange(1)}
          >
            +
          </button>
        </div>
      </div>

      <div className='text-right'>
        <div
          className={`text-lg mb-2 tracking-tight tabular-nums${isDiscountableQuantity ? ' font-bold' : ''}`}
        >
          {renderPrice(val, quantity)}
        </div>
        <button
          className='remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black'
          onClick={handleRemove}
        >
          Remove
        </button>
      </div>
    </article>
  );
};

export default CartItem;
