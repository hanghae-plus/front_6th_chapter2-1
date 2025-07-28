export function createDiscountPolicy() {
  const section = document.createElement('div');
  section.className = 'mb-6';
  section.innerHTML = `
    <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
    <div class="space-y-3">
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">개별 상품</p>
        <p class="text-gray-700 text-xs pl-2">
          • 키보드 10개↑: 10%<br>
          • 마우스 10개↑: 15%<br>
          • 모니터암 10개↑: 20%<br>
          • 스피커 10개↑: 25%
        </p>
      </div>
     
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">전체 수량</p>
        <p class="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
      </div>
     
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">특별 할인</p>
        <p class="text-gray-700 text-xs pl-2">
          • 화요일: +10%<br>
          • ⚡번개세일: 20%<br>
          • 💝추천할인: 5%
        </p>
      </div>
    </div>
  `;
  return section;
}
