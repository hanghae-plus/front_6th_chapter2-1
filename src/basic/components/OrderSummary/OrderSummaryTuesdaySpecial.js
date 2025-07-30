export const OrderSummaryTuesdaySpecial = () => {
  const tuesdaySpecialDiv = document.createElement('div');
  tuesdaySpecialDiv.id = 'tuesday-special';
  tuesdaySpecialDiv.className = 'mt-4 p-3 bg-white/10 rounded-lg hidden'; // 기본은 숨김
  tuesdaySpecialDiv.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="text-2xs">🎉</span>
      <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
    </div>
  `;

  // 화요일 특별 할인 메시지의 가시성을 토글하는 함수
  const toggleVisibility = (isVisible) => {
    if (isVisible) {
      tuesdaySpecialDiv.classList.remove('hidden');
    } else {
      tuesdaySpecialDiv.classList.add('hidden');
    }
  };

  return { element: tuesdaySpecialDiv, toggleVisibility };
};
