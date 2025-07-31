interface ManualOverlayProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function ManualOverlay({ isOpen = false, onClose }: ManualOverlayProps) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 ${isOpen ? '' : 'hidden'}`}
        onClick={onClose}
      >
        <div
          className={`fixed right-0 top-0 h-full w-96 bg-white transform transition-transform duration-300 ease-in-out overflow-y-auto ${
            isOpen ? '' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">도움말</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">🛒 상품 선택</h3>
                <p className="text-sm text-gray-600">
                  드롭다운에서 상품을 선택하고 "Add to Cart" 버튼을 클릭하세요.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">📊 할인 혜택</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 10개 이상 구매시 개별 할인</li>
                  <li>• 30개 이상 구매시 25% 할인</li>
                  <li>• 화요일 10% 추가 할인</li>
                  <li>• 번개세일 20% 할인 (랜덤)</li>
                  <li>• 추천상품 5% 할인</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">🎁 포인트 적립</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 기본 0.1% 적립</li>
                  <li>• 화요일 2배 적립</li>
                  <li>• 키보드+마우스 세트 +50p</li>
                  <li>• 풀세트 구매 +100p</li>
                  <li>• 대량구매 보너스</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
