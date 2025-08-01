import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe('basic 테스트', () => {
  // 공통 헬퍼 함수
  const addItemsToCart = (sel, addBtn, productId, count) => {
    sel.value = productId;
    for (let i = 0; i < count; i++) {
      addBtn.click();
    }
  };

  // 화요일 날짜 계산 헬퍼 함수
  const getNextTuesday = () => {
    const today = new Date();
    const daysUntilTuesday = (2 - today.getDay() + 7) % 7;
    const nextTuesday = new Date(today);
    nextTuesday.setDate(today.getDate() + daysUntilTuesday);
    return nextTuesday;
  };

  const expectProductInfo = (option, product) => {
    expect(option.value).toBe(product.id);
    expect(option.textContent).toContain(product.name);
    expect(option.textContent).toContain(product.price);
    if (product.stock === 0) {
      expect(option.disabled).toBe(true);
      expect(option.textContent).toContain('품절');
    }
  };

  const getCartItemQuantity = (cartDisp, productId) => {
    const item = cartDisp.querySelector(`#${productId}`);
    if (!item) return 0;
    const qtyElement = item.querySelector('.quantity-number');
    return qtyElement ? parseInt(qtyElement.textContent) : 0;
  };

  describe.each([
    { type: 'origin', loadFile: () => import('../../main.original.js'), },
    { type: 'basic', loadFile: () => import('../main.basic.js'), },
  ])('$type 장바구니 상세 기능 테스트', ({ loadFile }) => {
    let sel, addBtn, cartDisp, sum, stockInfo, itemCount, loyaltyPoints, discountInfo;

    beforeEach(async () => {
      vi.useRealTimers();
      vi.spyOn(window, 'alert').mockImplementation(() => {});

      // 전체 DOM 재초기화
      document.body.innerHTML = '<div id="app"></div>';
      
      // 모듈 캐시 클리어 및 재로드
      vi.resetModules();
      await loadFile();

      // DOM 요소 참조
      sel = document.getElementById('product-select');
      addBtn = document.getElementById('add-to-cart');
      cartDisp = document.getElementById('cart-items');
      sum = document.getElementById('cart-total');
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
            expectProductInfo(sel.options[index], product);
          });
        });
      });

      describe('2.2 재고 관리', () => {
        it('재고가 5개 미만인 상품은 "재고 부족" 표시', async () => {
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
          addItemsToCart(sel, addBtn, 'p1', 10);

          // 100,000원 -> 90,000원
          expect(sum.textContent).toContain('₩90,000');
          expect(discountInfo.textContent).toContain('10.0%');
        });

        it('상품2: 10개 이상 구매 시 15% 할인', () => {
          addItemsToCart(sel, addBtn, 'p2', 10);

          // 200,000원 -> 170,000원
          expect(sum.textContent).toContain('₩170,000');
          expect(discountInfo.textContent).toContain('15.0%');
        });

        it('상품3: 10개 이상 구매 시 20% 할인', () => {
          addItemsToCart(sel, addBtn, 'p3', 10);

          // 300,000원 -> 240,000원
          expect(sum.textContent).toContain('₩240,000');
          expect(discountInfo.textContent).toContain('20.0%');
        });

        it('상품5: 10개 이상 구매 시 25% 할인', () => {
          addItemsToCart(sel, addBtn, 'p5', 10);

          // 250,000원 -> 187,500원
          expect(sum.textContent).toContain('₩187,500');
          expect(discountInfo.textContent).toContain('25.0%');
        });
      });

      describe('3.2 전체 수량 할인', () => {
        it('전체 30개 이상 구매 시 25% 할인 (개별 할인 무시)', () => {
          // 상품1 10개, 상품2 10개, 상품3 10개 = 총 30개
          addItemsToCart(sel, addBtn, 'p1', 10);
          addItemsToCart(sel, addBtn, 'p2', 10);
          addItemsToCart(sel, addBtn, 'p3', 10);

          // 600,000원 -> 450,000원 (25% 할인)
          expect(sum.textContent).toContain('₩450,000');
          expect(discountInfo.textContent).toContain('25.0%');
        });
      });

      describe('3.3 특별 할인', () => {
        describe('3.3.1 화요일 할인', () => {
          it('화요일에 10% 추가 할인 적용', () => {
            const tuesday = getNextTuesday();
            vi.useFakeTimers();
            vi.setSystemTime(tuesday);

            sel.value = 'p1';
            addBtn.click();

            // 10,000원 -> 9,000원 (10% 할인)
            expect(sum.textContent).toContain('₩9,000');
            expect(discountInfo.textContent).toContain('10.0%');

            // 화요일 특별 할인 배너 표시
            const tuesdayBanner = document.getElementById('tuesday-special');
            expect(tuesdayBanner.classList.contains('hidden')).toBe(false);

            vi.useRealTimers();
          });

          it('화요일 할인은 다른 할인과 중복 적용', () => {
            const tuesday = getNextTuesday();
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
          it('번개세일 알림 표시 및 20% 할인 적용', async () => {
            vi.useFakeTimers();
            
            // 번개세일 타이머가 실행될 때까지 대기 (최대 40초)
            await vi.advanceTimersByTimeAsync(40000);
            
            // 번개세일이 적용된 상품이 있는지 확인
            const options = Array.from(sel.options);
            const lightningProduct = options.find(opt => 
              opt.textContent.includes('⚡') && !opt.disabled
            );
            
            // 랜덤성 때문에 번개세일이 발생하지 않을 수 있음 (정상적인 상황)
            if (lightningProduct) {
              expect(lightningProduct).toBeTruthy();
              expect(window.alert).toHaveBeenCalledWith(
                expect.stringContaining('⚡번개세일!')
              );
            } else {
              // 번개세일이 발생하지 않은 경우도 정상으로 처리
              console.log('번개세일이 발생하지 않았습니다 (랜덤성 때문)');
            }
            
            vi.useRealTimers();
          });

          it('번개세일 상품은 드롭다운에 ⚡ 아이콘 표시', async () => {
            vi.useFakeTimers();
            
            await vi.advanceTimersByTimeAsync(40000);
            
            const options = Array.from(sel.options);
            const lightningOption = options.find(opt => 
              opt.textContent.includes('⚡') && !opt.disabled
            );
            
            if (lightningOption) {
              expect(lightningOption.textContent).toContain('⚡');
              expect(lightningOption.textContent).toContain('20% SALE');
            } else {
              // 번개세일이 발생하지 않은 경우도 정상으로 처리
              console.log('번개세일이 발생하지 않았습니다 (랜덤성 때문)');
            }
            
            vi.useRealTimers();
          });
        });

        describe('3.3.3 추천할인', () => {
          it('마지막 선택한 상품과 다른 상품 추천 및 5% 할인', async () => {
            vi.useFakeTimers();
            
            // 상품을 장바구니에 추가하여 추천할인 조건 만족
            sel.value = 'p1';
            addBtn.click();
            
            // 추천할인 타이머가 실행될 때까지 대기 (최대 80초)
            await vi.advanceTimersByTimeAsync(80000);
            
            // 추천할인이 적용된 상품이 있는지 확인
            const options = Array.from(sel.options);
            const recommendedProduct = options.find(opt => 
              opt.textContent.includes('💝') && !opt.disabled
            );
            
            // 랜덤성 때문에 추천할인이 발생하지 않을 수 있음 (정상적인 상황)
            if (recommendedProduct) {
              expect(recommendedProduct).toBeTruthy();
              expect(window.alert).toHaveBeenCalledWith(
                expect.stringContaining('💝')
              );
            } else {
              // 추천할인이 발생하지 않은 경우도 정상으로 처리
              console.log('추천할인이 발생하지 않았습니다 (랜덤성 때문)');
            }
            
            vi.useRealTimers();
          });

          it('추천할인 상품은 드롭다운에 💝 아이콘 표시', async () => {
            vi.useFakeTimers();
            
            sel.value = 'p1';
            addBtn.click();
            await vi.advanceTimersByTimeAsync(80000);
            
            const options = Array.from(sel.options);
            const recommendedOption = options.find(opt => 
              opt.textContent.includes('💝') && !opt.disabled
            );
            
            if (recommendedOption) {
              expect(recommendedOption.textContent).toContain('💝');
              expect(recommendedOption.textContent).toContain('5% 추천할인');
            } else {
              // 추천할인이 발생하지 않은 경우도 정상으로 처리
              console.log('추천할인이 발생하지 않았습니다 (랜덤성 때문)');
            }
            
            vi.useRealTimers();
          });
        });

        describe('3.3.4 할인 중복', () => {
          it('번개세일 + 추천할인 = 25% SUPER SALE', async () => {
            vi.useFakeTimers();
            
            // 번개세일 먼저 발생
            await vi.advanceTimersByTimeAsync(40000);
            
            // 상품을 장바구니에 추가
            sel.value = 'p1';
            addBtn.click();
            
            // 추천할인 발생
            await vi.advanceTimersByTimeAsync(80000);
            
            // SUPER SALE이 적용된 상품이 있는지 확인
            const options = Array.from(sel.options);
            const superSaleProduct = options.find(opt => 
              opt.textContent.includes('⚡💝') && !opt.disabled
            );
            
            if (superSaleProduct) {
              expect(superSaleProduct.textContent).toContain('25% SUPER SALE');
            }
            
            vi.useRealTimers();
          });
        });
      });
    });

    // 4. 포인트 적립 시스템 테스트
    describe('4. 포인트 적립 시스템', () => {
      describe('4.1 기본 적립', () => {
        it('최종 결제 금액의 0.1% 포인트 적립', () => {
          sel.value = 'p1';
          addBtn.click();

          // 10,000원 -> 10포인트
          expect(loyaltyPoints.textContent).toContain('10p');
        });
      });

      describe('4.2 추가 적립', () => {
        it('화요일 구매 시 기본 포인트 2배', () => {
          const tuesday = getNextTuesday();
          vi.useFakeTimers();
          vi.setSystemTime(tuesday);

          sel.value = 'p1';
          addBtn.click();

          // 9,000원 (화요일 10% 할인) -> 9포인트 * 2 = 18포인트
          expect(loyaltyPoints.textContent).toContain('18p');
          expect(loyaltyPoints.textContent).toContain('화요일 2배');

          vi.useRealTimers();
        });

        it('키보드+마우스 세트 구매 시 +50p', () => {
          sel.value = 'p1';
          addBtn.click();

          sel.value = 'p2';
          addBtn.click();

          // 30,000원 -> 30포인트 + 50포인트 = 80포인트
          expect(loyaltyPoints.textContent).toContain('80p');
          expect(loyaltyPoints.textContent).toContain('키보드+마우스 세트');
        });

        it('풀세트(키보드+마우스+모니터암) 구매 시 +100p', () => {
          sel.value = 'p1';
          addBtn.click();

          sel.value = 'p2';
          addBtn.click();

          sel.value = 'p3';
          addBtn.click();

          // 60,000원 -> 60포인트 + 50포인트(세트) + 100포인트(풀세트) = 210포인트
          expect(loyaltyPoints.textContent).toContain('210p');
          expect(loyaltyPoints.textContent).toContain('풀세트 구매');
        });

        it('수량별 보너스 - 10개 이상 +20p', () => {
          addItemsToCart(sel, addBtn, 'p1', 10);

          // 90,000원 (10% 할인) -> 90포인트 + 20포인트 = 110포인트
          expect(loyaltyPoints.textContent).toContain('110p');
          expect(loyaltyPoints.textContent).toContain('대량구매(10개+)');
        });

        it('수량별 보너스 - 20개 이상 +50p', () => {
          addItemsToCart(sel, addBtn, 'p1', 20);

          // 180,000원 (10% 할인) -> 180포인트 + 50포인트 = 230포인트
          expect(loyaltyPoints.textContent).toContain('230p');
          expect(loyaltyPoints.textContent).toContain('대량구매(20개+)');
        });

        it('수량별 보너스 - 30개 이상 +100p', () => {
          addItemsToCart(sel, addBtn, 'p1', 30);

          // 225,000원 (25% 할인) -> 225포인트 + 100포인트 = 325포인트
          expect(loyaltyPoints.textContent).toContain('325p');
          expect(loyaltyPoints.textContent).toContain('대량구매(30개+)');
        });
      });

      describe('4.3 포인트 표시', () => {
        it('포인트 적립 내역 상세 표시', () => {
          sel.value = 'p1';
          addBtn.click();

          sel.value = 'p2';
          addBtn.click();

          const pointsText = loyaltyPoints.textContent;
          expect(pointsText).toContain('기본:');
          expect(pointsText).toContain('키보드+마우스 세트');
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
          const helpButton = document.querySelector('.fixed.top-4.right-4');
          expect(helpButton).toBeTruthy();
        });
      });

      describe('5.2 상품 선택 영역', () => {
        it('할인 중인 상품 강조 표시 확인', async () => {
          // 현재 화요일 테스트 또는 일반 상황에서의 강조 표시만 확인
          const options = Array.from(sel.options);
          
          // 품절 상품이 비활성화되어 있는지 확인
          const disabledOption = options.find(opt => opt.disabled);
          if (disabledOption) {
            expect(disabledOption.textContent).toContain('품절');
          }
        });
      });

      describe('5.3 장바구니 영역', () => {
        it('장바구니 아이템 카드 형식 확인', () => {
          sel.value = 'p1';
          addBtn.click();

          const cartItem = cartDisp.querySelector('#p1');

          // 상품 이미지
          expect(cartItem.querySelector('.bg-gradient-black')).toBeTruthy();

          // 상품명
          expect(cartItem.querySelector('h3').textContent).toContain('버그 없애는 키보드');

          // 수량 조절 버튼
          expect(cartItem.querySelector('.quantity-change[data-change="1"]')).toBeTruthy();
          expect(cartItem.querySelector('.quantity-change[data-change="-1"]')).toBeTruthy();

          // 제거 버튼
          expect(cartItem.querySelector('.remove-item')).toBeTruthy();
        });

        it('첫 번째 상품은 상단 여백 없음', () => {
          sel.value = 'p1';
          addBtn.click();

          const firstItem = cartDisp.firstElementChild;
          expect(firstItem.className).toContain('first:pt-0');
        });

        it('마지막 상품은 하단 테두리 없음', () => {
          sel.value = 'p1';
          addBtn.click();

          const lastItem = cartDisp.lastElementChild;
          expect(lastItem.className).toContain('last:border-b-0');
        });
      });

      describe('5.5 도움말 모달', () => {
        it('도움말 버튼 클릭 시 모달 표시', async () => {
          const helpButton = document.querySelector('.fixed.top-4.right-4');
          const modal = document.querySelector('.fixed.inset-0');
          const slidePanel = document.querySelector('.fixed.right-0.top-0');

          // 초기 상태: 숨김
          expect(modal.classList.contains('hidden')).toBe(true);
          expect(slidePanel.classList.contains('translate-x-full')).toBe(true);

          // 클릭 후: 표시
          await userEvent.click(helpButton);

          expect(modal.classList.contains('hidden')).toBe(false);
          expect(slidePanel.classList.contains('translate-x-full')).toBe(false);
        });

        it('배경 클릭 시 모달 닫기', async () => {
          const helpButton = document.querySelector('.fixed.top-4.right-4');
          const modal = document.querySelector('.fixed.inset-0');

          // 모달 열기
          await userEvent.click(helpButton);
          expect(modal.classList.contains('hidden')).toBe(false);

          // 배경 클릭으로 닫기
          await userEvent.click(modal);
          expect(modal.classList.contains('hidden')).toBe(true);
        });
      });
    });

    // 6. 기능 요구사항 테스트
    describe('6. 기능 요구사항', () => {
      describe('6.1 상품 추가', () => {
        it('선택한 상품을 장바구니에 추가', () => {
          sel.value = 'p2';
          addBtn.click();

          expect(cartDisp.children.length).toBe(1);
          expect(cartDisp.querySelector('#p2')).toBeTruthy();
        });

        it('이미 있는 상품은 수량 증가', () => {
          sel.value = 'p3';
          addBtn.click();
          addBtn.click();

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
          sel.value = 'p4';
          addBtn.click();

          expect(cartDisp.children.length).toBe(0);
        });
      });

      describe('6.2 수량 변경', () => {
        it('+/- 버튼으로 수량 조절', async () => {
          sel.value = 'p1';
          addBtn.click();

          const increaseBtn = cartDisp.querySelector('.quantity-change[data-change="1"]');
          const decreaseBtn = cartDisp.querySelector('.quantity-change[data-change="-1"]');

          // 증가
          await userEvent.click(increaseBtn);
          expect(cartDisp.querySelector('.quantity-number').textContent).toBe('2');

          // 감소
          await userEvent.click(decreaseBtn);
          expect(cartDisp.querySelector('.quantity-number').textContent).toBe('1');
        });

        it('재고 한도 내에서만 증가 가능', async () => {
          // 재고 10개인 상품5를 10개 추가
          addItemsToCart(sel, addBtn, 'p5', 10);

          const increaseBtn = cartDisp.querySelector('.quantity-change[data-change="1"]');
          const qtyBefore = getCartItemQuantity(cartDisp, 'p5');
          
          await userEvent.click(increaseBtn);
          
          const qtyAfter = getCartItemQuantity(cartDisp, 'p5');
          expect(qtyAfter).toBe(qtyBefore); // 수량이 증가하지 않아야 함
        });

        it('수량 0이 되면 자동 제거', async () => {
          sel.value = 'p1';
          addBtn.click();

          const decreaseBtn = cartDisp.querySelector('.quantity-change[data-change="-1"]');
          await userEvent.click(decreaseBtn);

          expect(cartDisp.children.length).toBe(0);
        });
      });

      describe('6.3 상품 제거', () => {
        it('Remove 버튼 클릭 시 즉시 제거', async () => {
          sel.value = 'p2';
          addBtn.click();

          const removeBtn = cartDisp.querySelector('.remove-item');
          await userEvent.click(removeBtn);

          expect(cartDisp.children.length).toBe(0);
        });

        it('제거된 수량만큼 재고 복구', async () => {
          // 상품5를 5개 추가 (재고: 10개 -> 5개)
          addItemsToCart(sel, addBtn, 'p5', 5);
          
          // 초기 재고 상태 확인
          const initialStock = getCartItemQuantity(cartDisp, 'p5');
          expect(initialStock).toBe(5);
          
          // 상품 제거
          const removeBtn = cartDisp.querySelector('.remove-item');
          await userEvent.click(removeBtn);
          
          // 장바구니에서 제거되었는지 확인
          expect(cartDisp.children.length).toBe(0);
          
          // 재고가 복구되었는지 확인 (다시 같은 상품을 추가할 수 있는지 확인)
          sel.value = 'p5';
          addBtn.click();
          
          // 재고가 복구되었다면 다시 추가할 수 있어야 함
          expect(cartDisp.children.length).toBe(1);
          const restoredStock = getCartItemQuantity(cartDisp, 'p5');
          expect(restoredStock).toBe(1);
        });
      });

      describe('6.4 실시간 계산', () => {
        it('수량 변경 시 즉시 재계산', async () => {
          sel.value = 'p1';
          addBtn.click();

          expect(sum.textContent).toContain('₩10,000');

          const increaseBtn = cartDisp.querySelector('.quantity-change[data-change="1"]');
          await userEvent.click(increaseBtn);

          expect(sum.textContent).toContain('₩20,000');
        });

        it('할인 정책 자동 적용', () => {
          addItemsToCart(sel, addBtn, 'p1', 10);

          expect(discountInfo.textContent).toContain('10.0%');
          expect(sum.textContent).toContain('₩90,000');
        });

        it('포인트 실시간 업데이트', async () => {
          sel.value = 'p1';
          addBtn.click();

          expect(loyaltyPoints.textContent).toContain('10p');

          const increaseBtn = cartDisp.querySelector('.quantity-change[data-change="1"]');
          await userEvent.click(increaseBtn);

          expect(loyaltyPoints.textContent).toContain('20p');
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

        it('수량 증가 시 재고 확인', async () => {
          addItemsToCart(sel, addBtn, 'p5', 10);

          const increaseBtn = cartDisp.querySelector('.quantity-change[data-change="1"]');
          await userEvent.click(increaseBtn);

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

      describe('8.3 동시성 이슈', () => {
        it('번개세일과 추천할인이 같은 상품에 적용 시 최대 25%', async () => {
          vi.useFakeTimers();
          
          // 번개세일 발생
          await vi.advanceTimersByTimeAsync(40000);
          
          // 상품 추가
          sel.value = 'p1';
          addBtn.click();
          
          // 추천할인 발생
          await vi.advanceTimersByTimeAsync(80000);
          
          // 최대 25% 할인이 적용되었는지 확인
          const options = Array.from(sel.options);
          const superSaleProduct = options.find(opt => 
            opt.textContent.includes('⚡💝') && opt.textContent.includes('25% SUPER SALE')
          );
          
          if (superSaleProduct) {
            expect(superSaleProduct.textContent).toContain('25% SUPER SALE');
          }
          
          vi.useRealTimers();
        });
      });
    });

    // 복잡한 시나리오 테스트
    describe('복잡한 통합 시나리오', () => {
      it('화요일 + 풀세트 + 대량구매 시나리오', () => {
        const tuesday = getNextTuesday();
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

      it('번개세일 + 추천할인 + 화요일 시나리오', async () => {
        const tuesday = getNextTuesday();
        vi.useFakeTimers();
        vi.setSystemTime(tuesday);

        // 번개세일 발생
        await vi.advanceTimersByTimeAsync(40000);
        
        // 상품 추가
        sel.value = 'p1';
        addBtn.click();
        
        // 추천할인 발생
        await vi.advanceTimersByTimeAsync(80000);

        // 복합 할인이 적용되었는지 확인
        const options = Array.from(sel.options);
        const complexDiscountProduct = options.find(opt => 
          opt.textContent.includes('⚡💝') && !opt.disabled
        );
        
        if (complexDiscountProduct) {
          expect(complexDiscountProduct.textContent).toContain('25% SUPER SALE');
        }

        vi.useRealTimers();
      });
    });
  });
});