// src/advanced/__tests__/advanced.test.js
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

describe('advanced 타이머/프로모션 심화 테스트', () => {
  let sel, addBtn, cartDisp, sum, discountInfo;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-07-28'));
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    document.body.innerHTML = '<div id="app"></div>';
    vi.resetModules();
    await import('../../advanced/main.advanced.js');

    sel = document.getElementById('product-select');
    addBtn = document.getElementById('add-to-cart');
    cartDisp = document.getElementById('cart-items');
    sum = document.getElementById('cart-total');
    discountInfo = document.getElementById('discount-info');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // 타이머 기반 번개세일 프로모션 테스트
  it('번개세일 타이머가 동작하면 상품에 20% 할인과 ⚡ 표시, 알림이 발생해야 한다', async () => {
    // 타이머 시작 전: 번개세일 없음
    expect(sel.textContent).not.toContain('⚡');
    // 40초 경과(번개세일 타이머 발동)
    await vi.advanceTimersByTimeAsync(40000);

    // 번개세일 알림 발생
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('번개세일')
    );
    // 드롭다운에 ⚡ 표시
    expect(sel.textContent).toContain('⚡');
    // 할인율 20% 적용
    const option = Array.from(sel.options).find((opt) =>
      opt.textContent.includes('⚡')
    );
    expect(option.textContent).toContain('20%');
  });

  // 추천할인 타이머 테스트
  it('추천할인 타이머가 동작하면 마지막 선택 상품 제외, 5% 할인과 💝 표시, 알림이 발생해야 한다', async () => {
    // 상품1을 먼저 장바구니에 추가
    sel.value = 'p1';
    addBtn.click();

    // 80초 경과(추천할인 타이머 발동)
    await vi.advanceTimersByTimeAsync(80000);

    // 추천할인 알림 발생
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('추가 할인')
    );
    // 드롭다운에 💝 표시
    expect(sel.textContent).toContain('💝');
    // 할인율 5% 적용
    const option = Array.from(sel.options).find((opt) =>
      opt.textContent.includes('💝')
    );
    expect(option.textContent).toContain('5%');
  });

  // 번개세일 + 추천할인 중첩 테스트
  it('동일 상품에 번개세일+추천할인 동시 적용 시 25% SUPER SALE 표시', async () => {
    // 40초 후 번개세일, 80초 후 추천할인
    await vi.advanceTimersByTimeAsync(40000);
    await vi.advanceTimersByTimeAsync(80000);

    // SUPER SALE 알림 또는 표시
    expect(sel.textContent).toMatch(/25%.*SUPER SALE/);
    // 할인 정보 UI에도 25% 표시
    expect(discountInfo.textContent).toContain('25.0%');
  });

  // 타이머 종료/정리 테스트
  it('페이지 언로드 시 타이머가 정리되어야 한다', () => {
    const cleanupSpy = vi.spyOn(window, 'removeEventListener');
    window.dispatchEvent(new Event('beforeunload'));
    expect(cleanupSpy).toHaveBeenCalled();
  });

  // 타이머 중복 실행 방지 테스트
  it('타이머가 중복 실행되지 않아야 한다', async () => {
    // 타이머 시작
    await vi.advanceTimersByTimeAsync(40000);
    // 다시 타이머 시작(중복 방지)
    await vi.advanceTimersByTimeAsync(40000);
    // 알림이 2번 이상 발생하지 않아야 함
    expect(window.alert.mock.calls.length).toBeLessThanOrEqual(2);
  });
});
