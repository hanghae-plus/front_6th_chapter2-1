import { LoyaltyPoints } from './LoyaltyPoints';
import { useCartState } from '../../../contexts/CartContext';
import { getBonusPoints, getDiscountResult } from '../../../contexts/getters';

export const CartTotal = () => {
  const state = useCartState();
  const { bonusPoints, pointsDetail } = getBonusPoints(state);
  const { finalTotal } = getDiscountResult(state);

  return (
    <div id='cart-total' className='pt-5 border-t border-white/10'>
      <div className='flex justify-between items-baseline'>
        <span className='text-sm uppercase tracking-wider'>Total</span>
        <div className='text-2xl tracking-tight'>₩{finalTotal}</div>
      </div>
      <LoyaltyPoints bonusPts={bonusPoints} pointsDetail={pointsDetail} />
    </div>
  );
};
