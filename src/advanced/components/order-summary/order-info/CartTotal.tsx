import { LoyaltyPoints } from './LoyaltyPoints';

export const CartTotal = () => (
  <div id='cart-total' className='pt-5 border-t border-white/10'>
    <div className='flex justify-between items-baseline'>
      <span className='text-sm uppercase tracking-wider'>Total</span>
      <div className='text-2xl tracking-tight'>₩0</div>
    </div>
    <LoyaltyPoints bonusPts={undefined} pointsDetail={undefined} />
  </div>
);
