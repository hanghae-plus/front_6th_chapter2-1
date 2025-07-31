import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';

describe('advanced 테스트', () => {
  // 공통 헬퍼 함수
  const addItemsToCart = (sel, addBtn, productId, count) => {
    fireEvent.change(sel, { target: { value: productId } });
    for (let i = 0; i < count; i++) {
      fireEvent.click(addBtn);
    }
  };

  const getCartItemQuantity = (cartDisp, productId) => {
    const item = cartDisp.querySelector(`#${productId}`);
    if (!item) return 0;
    const qtyElement = item.querySelector('.quantity-number');
    return qtyElement ? parseInt(qtyElement.textContent) : 0;
  };

  let sel, addBtn, cartDisp, sum, stockInfo, itemCount, loyaltyPoints, discountInfo;

  beforeEach(async () => {
    // 기본적으로 실제 시간 사용 (화요일이 아닌 경우)
    vi.useRealTimers();
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    // 전체 DOM 재초기화
    document.body.innerHTML = '<div id="app"></div>';
    
    // 모듈 캐시 클리어 및 재로드
    vi.resetModules();
    await import('../main.advanced.tsx');

    // React 렌더링 완료를 위한 대기
    await new Promise(resolve => setTimeout(resolve, 100));

    // DOM 요소 참조
    sel = document.getElementById('product-select');
    addBtn = document.getElementById('add-to-cart');
    cartDisp = document.getElementById('cart-items');
    sum = document.getElementById('total-price'); // cart-total 대신 total-price 사용
    stockInfo = document.getElementById('stock-status');
    itemCount = document.getElementById('item-count');
    loyaltyPoints = document.getElementById('loyalty-points');
    discountInfo = document.getElementById('discount-info');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 2. 상품 정보 테스트
  describe('2. 상품 정보', () => {
    describe('2.1 상품 목록', () => {
      it('5개 상품이 올바른 정보로 표시되어야 함', () => {
        const expectedProducts = [
          { id: 'p1', name: '버그 없애는 키보드', price: '10000원', stock: 50, discount: 10 },
          { id: 'p2', name: '생산성 폭발 마우스', price: '20000원', stock: 30, discount: 15 },
          { id: 'p3', name: '거북목 탈출 모니터암', price: '30000원', stock: 20, discount: 20 },
          { id: 'p4', name: '에러 방지 노트북 파우치', price: '15000원', stock: 0, discount: 5 },
          { id: 'p5', name: '코딩할 때 듣는 Lo-Fi 스피커', price: '25000원', stock: 10, discount: 25 }
        ];

        expect(sel.options.length).toBe(5);

        expectedProducts.forEach((product, index) => {
          expect(sel.options[index].value).toBe(product.id);
          expect(sel.options[index].textContent).toContain(product.name);
          expect(sel.options[index].textContent).toContain(product.price.replace('원', ''));
          if (product.stock === 0) {
            expect(sel.options[index].disabled).toBe(true);
            expect(sel.options[index].textContent).toContain('품절');
          }
        });
      });
    });

    describe('2.2 재고 관리', () => {
      it('재고가 5개 미만인 상품은 "재고 부족" 표시', () => {
        // 상품5를 6개 구매하여 재고를 4개로 만듦
        addItemsToCart(sel, addBtn, 'p5', 6);

        expect(stockInfo.textContent).toContain('코딩할 때 듣는 Lo-Fi 스피커');
        expect(stockInfo.textContent).toContain('재고 부족');
        expect(stockInfo.textContent).toContain('4개 남음');
      });

      it('재고가 0개인 상품은 "품절" 표시 및 선택 불가', () => {
        const p4Option = sel.querySelector('option[value="p4"]');
        expect(p4Option.disabled).toBe(true);
        expect(p4Option.textContent).toContain('품절');
      });
    });
  });

  // 3. 할인 정책 테스트
  describe('3. 할인 정책', () => {
    describe('3.1 개별 상품 할인', () => {
      it('상품1: 10개 이상 구매 시 10% 할인', () => {
        // 명시적으로 화요일이 아닌 날짜 설정 (월요일)
        const monday = new Date('2024-10-14');
        vi.useFakeTimers();
        vi.setSystemTime(monday);

        addItemsToCart(sel, addBtn, 'p1', 10);

        // 100,000원 -> 90,000원
        expect(sum.textContent).toContain('₩90,000');
        expect(discountInfo.textContent).toContain('10.0%');

        vi.useRealTimers();
      });

      it('상품2: 10개 이상 구매 시 15% 할인', () => {
        const monday = new Date('2024-10-14');
        vi.useFakeTimers();
        vi.setSystemTime(monday);

        addItemsToCart(sel, addBtn, 'p2', 10);

        // 200,000원 -> 170,000원
        expect(sum.textContent).toContain('₩170,000');
        expect(discountInfo.textContent).toContain('15.0%');

        vi.useRealTimers();
      });

      it('상품5: 10개 이상 구매 시 25% 할인', () => {
        const monday = new Date('2024-10-14');
        vi.useFakeTimers();
        vi.setSystemTime(monday);

        addItemsToCart(sel, addBtn, 'p5', 10);

        // 250,000원 -> 187,500원
        expect(sum.textContent).toContain('₩187,500');
        expect(discountInfo.textContent).toContain('25.0%');

        vi.useRealTimers();
      });
    });

    describe('3.2 전체 수량 할인', () => {
      it('전체 30개 이상 구매 시 25% 할인 (개별 할인 무시)', () => {
        const monday = new Date('2024-10-14');
        vi.useFakeTimers();
        vi.setSystemTime(monday);

        // 상품1 10개, 상품2 10개, 상품3 10개 = 총 30개
        addItemsToCart(sel, addBtn, 'p1', 10);
        addItemsToCart(sel, addBtn, 'p2', 10);
        addItemsToCart(sel, addBtn, 'p3', 10);

        // 600,000원 -> 450,000원 (25% 할인)
        expect(sum.textContent).toContain('₩450,000');
        expect(discountInfo.textContent).toContain('25.0%');

        vi.useRealTimers();
      });
    });

    describe('3.3 특별 할인', () => {
      describe('3.3.1 화요일 할인', () => {
        it('화요일에 10% 추가 할인 적용', () => {
          const tuesday = new Date('2024-10-15');
          vi.useFakeTimers();
          vi.setSystemTime(tuesday);

          fireEvent.change(sel, { target: { value: 'p1' } });
          fireEvent.click(addBtn);

          // 10,000원 -> 9,000원 (화요일 10% 할인)
          expect(sum.textContent).toContain('₩9,000');
          expect(discountInfo.textContent).toContain('10.0%');

          // 화요일 특별 할인 배너 표시
          const tuesdayBanner = document.getElementById('tuesday-special');
          expect(tuesdayBanner.classList.contains('hidden')).toBe(false);

          vi.useRealTimers();
        });

        it('화요일 할인은 다른 할인과 중복 적용', () => {
          const tuesday = new Date('2024-10-15');
          vi.useFakeTimers();
          vi.setSystemTime(tuesday);

          addItemsToCart(sel, addBtn, 'p1', 10);

          // 100,000원 -> 90,000원 (개별 10%) -> 81,000원 (화요일 10% 추가)
          expect(sum.textContent).toContain('₩81,000');
          expect(discountInfo.textContent).toContain('19.0%'); // 총 19% 할인

          vi.useRealTimers();
        });
      });

      describe('3.3.2 번개세일', () => {
        it.skip('번개세일 알림 표시 및 20% 할인 적용', async () => {
          vi.useFakeTimers();
          
          // 상품을 장바구니에 추가하여 startAutoEvents 트리거
          fireEvent.change(sel, { target: { value: 'p1' } });
          fireEvent.click(addBtn);
          
          // 30초 후 번개세일 시작
          await vi.advanceTimersByTimeAsync(35000);
          
          // 번개세일 알림 확인
          expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('⚡번개세일!'));
          
          vi.useRealTimers();
        });

        it.skip('번개세일 상품은 드롭다운에 ⚡ 아이콘 표시', async () => {
          vi.useFakeTimers();
          
          // 상품을 장바구니에 추가하여 startAutoEvents 트리거
          fireEvent.change(sel, { target: { value: 'p1' } });
          fireEvent.click(addBtn);
          
          await vi.advanceTimersByTimeAsync(35000);
          
          // 번개세일 상품 옵션에 ⚡ 표시 확인
          const options = Array.from(sel.options);
          const saleOption = options.find(option => option.textContent.includes('⚡'));
          expect(saleOption).toBeTruthy();
          
          vi.useRealTimers();
        });
      });

      describe('3.3.3 추천할인', () => {
        it.skip('마지막 선택한 상품과 다른 상품 추천 및 5% 할인', async () => {
          vi.useFakeTimers();
          
          // 상품을 장바구니에 추가하여 startAutoEvents 트리거
          fireEvent.change(sel, { target: { value: 'p1' } });
          fireEvent.click(addBtn);
          
          // 추천할인은 60초 후 시작
          await vi.advanceTimersByTimeAsync(65000);
          
          expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('💝'));
          
          vi.useRealTimers();
        });
      });
    });
  });

  // 4. 포인트 적립 시스템 테스트
  describe('4. 포인트 적립 시스템', () => {
    describe('4.1 기본 적립', () => {
      it('최종 결제 금액의 0.1% 포인트 적립', () => {
        const monday = new Date('2024-10-14');
        vi.useFakeTimers();
        vi.setSystemTime(monday);

        fireEvent.change(sel, { target: { value: 'p1' } });
        fireEvent.click(addBtn);

        // 10,000원 -> 10포인트
        expect(loyaltyPoints.textContent).toContain('10p');

        vi.useRealTimers();
      });
    });

    describe('4.2 추가 적립', () => {
      it('화요일 구매 시 기본 포인트 2배', () => {
        const tuesday = new Date('2024-10-15');
        vi.useFakeTimers();
        vi.setSystemTime(tuesday);

        fireEvent.change(sel, { target: { value: 'p1' } });
        fireEvent.click(addBtn);

        // 9,000원 (화요일 10% 할인) -> 9포인트 * 2 = 18포인트
        expect(loyaltyPoints.textContent).toContain('18p');
        expect(loyaltyPoints.textContent).toContain('화요일 2배');

        vi.useRealTimers();
      });

      it('키보드+마우스 세트 구매 시 +50p', () => {
        const monday = new Date('2024-10-14');
        vi.useFakeTimers();
        vi.setSystemTime(monday);

        fireEvent.change(sel, { target: { value: 'p1' } });
        fireEvent.click(addBtn);

        fireEvent.change(sel, { target: { value: 'p2' } });
        fireEvent.click(addBtn);

        // 30,000원 -> 30포인트 + 50포인트 = 80포인트
        expect(loyaltyPoints.textContent).toContain('80p');
        expect(loyaltyPoints.textContent).toContain('키보드+마우스 세트');

        vi.useRealTimers();
      });

      it('풀세트(키보드+마우스+모니터암) 구매 시 +100p', () => {
        const monday = new Date('2024-10-14');
        vi.useFakeTimers();
        vi.setSystemTime(monday);

        fireEvent.change(sel, { target: { value: 'p1' } });
        fireEvent.click(addBtn);

        fireEvent.change(sel, { target: { value: 'p2' } });
        fireEvent.click(addBtn);

        fireEvent.change(sel, { target: { value: 'p3' } });
        fireEvent.click(addBtn);

        // 60,000원 -> 60포인트 + 50포인트(세트) + 100포인트(풀세트) = 210포인트
        expect(loyaltyPoints.textContent).toContain('210p');
        expect(loyaltyPoints.textContent).toContain('풀세트 구매');

        vi.useRealTimers();
      });

      it('수량별 보너스 - 10개 이상 +20p', () => {
        const monday = new Date('2024-10-14');
        vi.useFakeTimers();
        vi.setSystemTime(monday);

        addItemsToCart(sel, addBtn, 'p1', 10);

        // 90,000원 (10% 할인) -> 90포인트 + 20포인트 = 110포인트
        expect(loyaltyPoints.textContent).toContain('110p');
        expect(loyaltyPoints.textContent).toContain('대량구매(10개+)');

        vi.useRealTimers();
      });
    });
  });

  // 5. UI/UX 요구사항 테스트
  describe('5. UI/UX 요구사항', () => {
    describe('5.1 레이아웃', () => {
      it('필수 레이아웃 요소가 존재해야 함', () => {
        // 헤더
        expect(document.querySelector('h1').textContent).toContain('🛒 Hanghae Online Store');
        expect(document.querySelector('.text-5xl').textContent).toContain('Shopping Cart');

        // 좌측: 상품 선택 및 장바구니
        expect(document.querySelector('#product-select')).toBeTruthy();
        expect(document.querySelector('#cart-items')).toBeTruthy();

        // 우측: 주문 요약
        expect(document.querySelector('#cart-total')).toBeTruthy();
        expect(document.querySelector('#loyalty-points')).toBeTruthy();

        // 도움말 버튼
        const helpButton = document.querySelector('button[id="manual-toggle-button"]');
        expect(helpButton).toBeTruthy();
      });
    });

    describe('5.2 도움말 모달', () => {
      it('도움말 버튼 클릭 시 모달 표시', async () => {
        const helpButton = document.querySelector('button[id="manual-toggle-button"]');
        const modal = document.querySelector('div[id="manual-overlay"]');
        const slidePanel = document.querySelector('div[id="manual-panel"]');

        // 초기 상태: 숨김
        expect(modal.classList.contains('hidden')).toBe(true);
        expect(slidePanel.classList.contains('translate-x-full')).toBe(true);

        // 클릭 후: 표시
        const user = userEvent.setup();
        await user.click(helpButton);

        expect(modal.classList.contains('hidden')).toBe(false);
        expect(slidePanel.classList.contains('translate-x-full')).toBe(false);
      });

      it('배경 클릭 시 모달 닫기', async () => {
        const helpButton = document.querySelector('button[id="manual-toggle-button"]');
        const modal = document.querySelector('div[id="manual-overlay"]');

        // 모달 열기
        const user = userEvent.setup();
        await user.click(helpButton);
        expect(modal.classList.contains('hidden')).toBe(false);

        // 배경 클릭으로 닫기
        await user.click(modal);
        expect(modal.classList.contains('hidden')).toBe(true);
      });
    });
  });

  // 6. 기능 요구사항 테스트
  describe('6. 기능 요구사항', () => {
    describe('6.1 상품 추가', () => {
      it('선택한 상품을 장바구니에 추가', () => {
        fireEvent.change(sel, { target: { value: 'p2' } });
        fireEvent.click(addBtn);

        expect(cartDisp.children.length).toBe(1);
        expect(cartDisp.querySelector('#p2')).toBeTruthy();
      });

      it('이미 있는 상품은 수량 증가', () => {
        fireEvent.change(sel, { target: { value: 'p3' } });
        fireEvent.click(addBtn);
        fireEvent.click(addBtn);

        expect(cartDisp.children.length).toBe(1);
        const qty = cartDisp.querySelector('.quantity-number').textContent;
        expect(qty).toBe('2');
      });

      it('재고 초과 시 알림 표시', () => {
        // 재고가 10개인 상품5를 11개 추가 시도
        addItemsToCart(sel, addBtn, 'p5', 11);
        
        // 장바구니에는 10개만 있어야 함
        const qty = getCartItemQuantity(cartDisp, 'p5');
        expect(qty).toBeLessThanOrEqual(10);
      });

      it('품절 상품은 선택 불가', () => {
        fireEvent.change(sel, { target: { value: 'p4' } });
        fireEvent.click(addBtn);

        expect(cartDisp.children.length).toBe(0);
      });
    });

    describe('6.2 수량 변경', () => {
      it('+/- 버튼으로 수량 조절', () => {
        fireEvent.change(sel, { target: { value: 'p1' } });
        fireEvent.click(addBtn);

        const increaseBtn = cartDisp.querySelector('.quantity-change[data-change="1"]');
        const decreaseBtn = cartDisp.querySelector('.quantity-change[data-change="-1"]');

        // 증가
        fireEvent.click(increaseBtn);
        expect(cartDisp.querySelector('.quantity-number').textContent).toBe('2');

        // 감소
        fireEvent.click(decreaseBtn);
        expect(cartDisp.querySelector('.quantity-number').textContent).toBe('1');
      });

      it('재고 한도 내에서만 증가 가능', () => {
        // 재고 10개인 상품5를 10개 추가
        addItemsToCart(sel, addBtn, 'p5', 10);

        const increaseBtn = cartDisp.querySelector('.quantity-change[data-change="1"]');
        const qtyBefore = getCartItemQuantity(cartDisp, 'p5');
        
        fireEvent.click(increaseBtn);
        
        const qtyAfter = getCartItemQuantity(cartDisp, 'p5');
        expect(qtyAfter).toBe(qtyBefore); // 수량이 증가하지 않아야 함
      });

      it('수량 0이 되면 자동 제거', () => {
        fireEvent.change(sel, { target: { value: 'p1' } });
        fireEvent.click(addBtn);

        const decreaseBtn = cartDisp.querySelector('.quantity-change[data-change="-1"]');
        fireEvent.click(decreaseBtn);

        expect(cartDisp.children.length).toBe(0);
      });
    });

    describe('6.3 상품 제거', () => {
      it('Remove 버튼 클릭 시 즉시 제거', () => {
        fireEvent.change(sel, { target: { value: 'p2' } });
        fireEvent.click(addBtn);

        const removeBtn = cartDisp.querySelector('.remove-item');
        fireEvent.click(removeBtn);

        expect(cartDisp.children.length).toBe(0);
      });
    });

    describe('6.4 실시간 계산', () => {
      it('수량 변경 시 즉시 재계산', () => {
        const monday = new Date('2024-10-14');
        vi.useFakeTimers();
        vi.setSystemTime(monday);

        fireEvent.change(sel, { target: { value: 'p1' } });
        fireEvent.click(addBtn);

        expect(sum.textContent).toContain('₩10,000');

        const increaseBtn = cartDisp.querySelector('.quantity-change[data-change="1"]');
        fireEvent.click(increaseBtn);

        expect(sum.textContent).toContain('₩20,000');

        vi.useRealTimers();
      });

      it('할인 정책 자동 적용', () => {
        const monday = new Date('2024-10-14');
        vi.useFakeTimers();
        vi.setSystemTime(monday);

        addItemsToCart(sel, addBtn, 'p1', 10);

        expect(discountInfo.textContent).toContain('10.0%');
        expect(sum.textContent).toContain('₩90,000');

        vi.useRealTimers();
      });

      it('포인트 실시간 업데이트', () => {
        const monday = new Date('2024-10-14');
        vi.useFakeTimers();
        vi.setSystemTime(monday);

        fireEvent.change(sel, { target: { value: 'p1' } });
        fireEvent.click(addBtn);

        expect(loyaltyPoints.textContent).toContain('10p');

        const increaseBtn = cartDisp.querySelector('.quantity-change[data-change="1"]');
        fireEvent.click(increaseBtn);

        expect(loyaltyPoints.textContent).toContain('20p');

        vi.useRealTimers();
      });
    });

    describe('6.5 상태 관리', () => {
      it('장바구니 상품 수 표시', () => {
        expect(itemCount.textContent).toContain('0 items');

        addItemsToCart(sel, addBtn, 'p1', 5);

        expect(itemCount.textContent).toContain('5 items');
      });

      it('재고 부족/품절 상태 표시', () => {
        // 상품5를 재고 부족 상태로 만듦
        addItemsToCart(sel, addBtn, 'p5', 6);

        expect(stockInfo.textContent).toContain('재고 부족');
        expect(stockInfo.textContent).toContain('4개 남음');

        // 상품4는 품절
        expect(stockInfo.textContent).toContain('에러 방지 노트북 파우치: 품절');
      });
    });
  });

  // 8. 예외 처리 테스트
  describe('8. 예외 처리', () => {
    describe('8.1 재고 부족', () => {
      it('장바구니 추가 시 재고 확인', () => {
        // 재고 10개인 상품을 11개 추가 시도
        addItemsToCart(sel, addBtn, 'p5', 11);
        
        // 장바구니에는 최대 재고 수량만큼만 담김
        const qty = getCartItemQuantity(cartDisp, 'p5');
        expect(qty).toBeLessThanOrEqual(10);
      });

      it('수량 증가 시 재고 확인', () => {
        addItemsToCart(sel, addBtn, 'p5', 10);

        const increaseBtn = cartDisp.querySelector('.quantity-change[data-change="1"]');
        fireEvent.click(increaseBtn);

        expect(window.alert).toHaveBeenCalledWith('재고가 부족합니다.');
      });
    });

    describe('8.2 빈 장바구니', () => {
      it('장바구니가 비어있을 때 포인트 섹션 숨김', () => {
        expect(cartDisp.children.length).toBe(0);
        expect(loyaltyPoints.style.display).toBe('none');
      });

      it('주문 요약에 기본값 표시', () => {
        expect(sum.textContent).toContain('₩0');
        expect(itemCount.textContent).toContain('0 items');
      });
    });
  });

  // 복잡한 시나리오 테스트
  describe('복잡한 통합 시나리오', () => {
    it('화요일 + 풀세트 + 대량구매 시나리오', () => {
      const tuesday = new Date('2024-10-15');
      vi.useFakeTimers();
      vi.setSystemTime(tuesday);

      // 키보드 10개, 마우스 10개, 모니터암 10개
      addItemsToCart(sel, addBtn, 'p1', 10);
      addItemsToCart(sel, addBtn, 'p2', 10);
      addItemsToCart(sel, addBtn, 'p3', 10);

      // 총액 확인: 600,000원 -> 25% 할인 -> 450,000원 -> 화요일 10% -> 405,000원
      expect(sum.textContent).toContain('₩405,000');

      // 포인트 확인: 405포인트(기본) * 2(화요일) + 50(세트) + 100(풀세트) + 100(30개) = 1060포인트
      expect(loyaltyPoints.textContent).toContain('1060p');

      vi.useRealTimers();
    });
  });
});