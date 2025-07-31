export function createPoints() {
  const section = document.createElement('div');
  section.className = 'mb-6';
  section.innerHTML = `
    <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
    <div class="space-y-3">
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">기본</p>
        <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
      </div>
     
      <div class="bg-gray-100 rounded-lg p-3">
        <p class="font-semibold text-sm mb-1">추가</p>
        <p class="text-gray-700 text-xs pl-2">
          • 화요일: 2배<br>
          • 키보드+마우스: +50p<br>
          • 풀세트: +100p<br>
          • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
        </p>
      </div>
    </div>
  `;
  return section;
}
