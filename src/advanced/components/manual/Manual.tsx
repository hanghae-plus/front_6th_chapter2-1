import { useState } from 'react';

export const Manual = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleManual = () => {
    setIsOpen(!isOpen);
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      toggleManual();
    }
  };

  return (
    <>
      <button
        id='manual-toggle'
        onClick={toggleManual}
        className='fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50'
      >
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          ></path>
        </svg>
      </button>
      <div
        id='manual-overlay'
        onClick={handleOverlayClick}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 
					${isOpen ? 'opacity-100' : 'hidden opacity-0 pointer-events-none'}`}
      >
        <div
          id='manual-column'
          className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300 
						${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <button
            id='manual-close-btn'
            onClick={toggleManual}
            className='absolute top-4 right-4 text-gray-500 hover:text-black'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              ></path>
            </svg>
          </button>
          <h2 className='text-xl font-bold mb-4'>📖 이용 안내</h2>
          <div className='mb-6'>
            <h3 className='text-base font-bold mb-3'>💰 할인 정책</h3>
            <div className='space-y-3'>
              <div className='bg-gray-100 rounded-lg p-3'>
                <p className='font-semibold text-sm mb-1'>개별 상품</p>
                <p className='text-gray-700 text-xs pl-2'>
                  • 키보드 10개↑: 10%
                  <br />
                  • 마우스 10개↑: 15%
                  <br />
                  • 모니터암 10개↑: 20%
                  <br />• 스피커 10개↑: 25%
                </p>
              </div>
              <div className='bg-gray-100 rounded-lg p-3'>
                <p className='font-semibold text-sm mb-1'>전체 수량</p>
                <p className='text-gray-700 text-xs pl-2'>• 30개 이상: 25%</p>
              </div>
              <div className='bg-gray-100 rounded-lg p-3'>
                <p className='font-semibold text-sm mb-1'>특별 할인</p>
                <p className='text-gray-700 text-xs pl-2'>
                  • 화요일: +10%
                  <br />
                  • ⚡번개세일: 20%
                  <br />• 💝추천할인: 5%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
