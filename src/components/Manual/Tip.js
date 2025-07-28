export function createTip() {
  const section = document.createElement('div');
  section.className = 'border-t border-gray-200 pt-4 mt-4';
  section.innerHTML = `
    <p class="text-xs font-bold mb-1">💡 TIP</p>
    <p class="text-2xs text-gray-600 leading-relaxed">
      • 화요일 대량구매 = MAX 혜택<br>
      • ⚡+💝 중복 가능<br>
      • 상품4 = 품절
    </p>
  `;
  return section;
}
