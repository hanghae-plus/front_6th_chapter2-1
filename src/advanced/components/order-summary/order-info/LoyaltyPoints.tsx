export const LoyaltyPoints = ({ bonusPts, pointsDetail }) => (
  <div id='loyalty-points' className='text-xs text-blue-400 mt-2 text-right'>
    <div>
      적립 포인트: <span className='font-bold'>{bonusPts}p</span>
    </div>
    <div className='text-2xs opacity-70 mt-1'>${pointsDetail.join(', ')}</div>`
  </div>
);
