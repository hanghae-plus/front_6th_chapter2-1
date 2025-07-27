/**
 * @fileoverview CartDisplay 컴포넌트 단위 테스트
 * Vitest 및 Given-When-Then 구조를 사용한 테스트
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CartDisplay } from '../components/CartDisplay.js';

describe('CartDisplay 컴포넌트', () => {
  let mockProduct1;
  let mockProduct2;
  let mockCartItems;

  beforeEach(() => {
    // Given: 기본 테스트 데이터 설정
    mockProduct1 = {
      id: 'p1',
      name: '무선 키보드',
      val: 90000,
      originalVal: 100000,
      q: 15,
      onSale: false,
      suggestSale: false,
    };

    mockProduct2 = {
      id: 'p2',
      name: '무선 마우스',
      val: 45000,
      originalVal: 50000,
      q: 20,
      onSale: true,
      suggestSale: false,
    };

    mockCartItems = [
      {
        product: mockProduct1,
        quantity: 2,
        discounts: {},
        subtotal: 180000,
        stock: 15,
      },
      {
        product: mockProduct2,
        quantity: 1,
        discounts: {},
        subtotal: 45000,
        stock: 20,
      },
    ];
  });

  describe('render() 메서드', () => {
    it('정상적인 장바구니 아이템들을 렌더링해야 한다', () => {
      // Given: 장바구니 아이템 배열
      
      // When: render 메서드 호출
      const result = CartDisplay.render(mockCartItems);
      
      // Then: 올바른 HTML 구조가 생성되어야 함
      expect(result).toContain('cart-display-container');
      expect(result).toContain('무선 키보드');
      expect(result).toContain('무선 마우스');
      expect(result).toContain('id="p1"');
      expect(result).toContain('id="p2"');
    });

    it('빈 장바구니일 때 빈 상태 메시지를 표시해야 한다', () => {
      // Given: 빈 장바구니 배열
      const emptyCartItems = [];
      
      // When: 빈 배열로 render 호출
      const result = CartDisplay.render(emptyCartItems);
      
      // Then: 빈 상태 메시지가 표시되어야 함
      expect(result).toContain('장바구니가 비어있습니다');
      expect(result).toContain('상품을 선택하여 장바구니에 추가해보세요');
      expect(result).toContain('flex-col items-center justify-center');
    });

    it('커스텀 빈 메시지 옵션을 적용해야 한다', () => {
      // Given: 빈 장바구니와 커스텀 메시지
      const emptyCartItems = [];
      const options = { emptyMessage: '아직 상품이 없어요!' };
      
      // When: 커스텀 옵션으로 render 호출
      const result = CartDisplay.render(emptyCartItems, options);
      
      // Then: 커스텀 메시지가 포함되어야 함
      expect(result).toContain('아직 상품이 없어요!');
    });

    it('cartItems가 배열이 아니면 에러를 발생시켜야 한다', () => {
      // Given: 잘못된 데이터 타입
      
      // When & Then: 에러 발생 확인
      expect(() => CartDisplay.render(null)).toThrow('CartDisplay.render: cartItems는 배열이어야 합니다.');
      expect(() => CartDisplay.render('invalid')).toThrow('CartDisplay.render: cartItems는 배열이어야 합니다.');
      expect(() => CartDisplay.render({})).toThrow('CartDisplay.render: cartItems는 배열이어야 합니다.');
    });

    it('커스텀 className 옵션을 적용해야 한다', () => {
      // Given: 커스텀 className 옵션
      const options = { className: 'custom-cart-class' };
      
      // When: 옵션과 함께 render 호출
      const result = CartDisplay.render(mockCartItems, options);
      
      // Then: 커스텀 클래스가 포함되어야 함
      expect(result).toContain('custom-cart-class');
    });
  });

  describe('generateEmptyState() 메서드', () => {
    it('기본 빈 상태 HTML을 생성해야 한다', () => {
      // Given: 기본 매개변수
      
      // When: 빈 상태 생성
      const result = CartDisplay.generateEmptyState();
      
      // Then: 기본 빈 상태 메시지 포함
      expect(result).toContain('장바구니가 비어있습니다');
      expect(result).toContain('상품을 선택하여 장바구니에 추가해보세요');
      expect(result).toContain('svg');
      expect(result).toContain('flex flex-col items-center justify-center');
    });

    it('커스텀 메시지로 빈 상태를 생성해야 한다', () => {
      // Given: 커스텀 메시지
      const customMessage = '쇼핑을 시작해보세요!';
      
      // When: 커스텀 메시지로 빈 상태 생성
      const result = CartDisplay.generateEmptyState(customMessage);
      
      // Then: 커스텀 메시지가 포함되어야 함
      expect(result).toContain('쇼핑을 시작해보세요!');
    });

    it('커스텀 className을 적용해야 한다', () => {
      // Given: 커스텀 클래스
      const customClass = 'empty-custom-class';
      
      // When: 커스텀 클래스로 빈 상태 생성
      const result = CartDisplay.generateEmptyState('메시지', customClass);
      
      // Then: 커스텀 클래스가 포함되어야 함
      expect(result).toContain('empty-custom-class');
    });
  });

  describe('generateContainer() 메서드', () => {
    it('아이템 HTML을 컨테이너로 감싸야 한다', () => {
      // Given: 테스트 HTML 내용
      const testHTML = '<div>Test Item</div>';
      
      // When: 컨테이너 생성
      const result = CartDisplay.generateContainer(testHTML);
      
      // Then: 컨테이너로 감싸진 HTML 반환
      expect(result).toContain('cart-display-container');
      expect(result).toContain('<div>Test Item</div>');
    });

    it('커스텀 className을 적용해야 한다', () => {
      // Given: 테스트 HTML과 커스텀 클래스
      const testHTML = '<div>Test</div>';
      const customClass = 'custom-container';
      
      // When: 커스텀 클래스로 컨테이너 생성
      const result = CartDisplay.generateContainer(testHTML, customClass);
      
      // Then: 커스텀 클래스가 포함되어야 함
      expect(result).toContain('custom-container');
    });
  });

  describe('calculateCartSummary() 메서드', () => {
    it('정상적인 장바구니의 요약 정보를 계산해야 한다', () => {
      // Given: 장바구니 아이템 배열
      
      // When: 요약 정보 계산
      const result = CartDisplay.calculateCartSummary(mockCartItems);
      
      // Then: 올바른 요약 정보 반환
      expect(result).toEqual({
        itemCount: 2,
        totalQuantity: 3, // 2 + 1
      });
    });

    it('빈 장바구니의 요약 정보를 계산해야 한다', () => {
      // Given: 빈 장바구니 배열
      const emptyItems = [];
      
      // When: 요약 정보 계산
      const result = CartDisplay.calculateCartSummary(emptyItems);
      
      // Then: 0으로 초기화된 요약 정보 반환
      expect(result).toEqual({
        itemCount: 0,
        totalQuantity: 0,
      });
    });

    it('잘못된 입력에 대해 기본값을 반환해야 한다', () => {
      // Given: 잘못된 입력
      
      // When: 잘못된 입력으로 요약 정보 계산
      const result1 = CartDisplay.calculateCartSummary(null);
      const result2 = CartDisplay.calculateCartSummary('invalid');
      
      // Then: 기본값 반환
      expect(result1).toEqual({ itemCount: 0, totalQuantity: 0 });
      expect(result2).toEqual({ itemCount: 0, totalQuantity: 0 });
    });
  });

  describe('findItemByProductId() 메서드', () => {
    it('존재하는 상품 ID로 아이템을 찾아야 한다', () => {
      // Given: 장바구니와 찾을 상품 ID
      const productId = 'p1';
      
      // When: 상품 ID로 아이템 찾기
      const result = CartDisplay.findItemByProductId(mockCartItems, productId);
      
      // Then: 해당 아이템이 반환되어야 함
      expect(result).toBeTruthy();
      expect(result.product.id).toBe('p1');
      expect(result.product.name).toBe('무선 키보드');
    });

    it('존재하지 않는 상품 ID로 null을 반환해야 한다', () => {
      // Given: 존재하지 않는 상품 ID
      const productId = 'nonexistent';
      
      // When: 존재하지 않는 상품 ID로 아이템 찾기
      const result = CartDisplay.findItemByProductId(mockCartItems, productId);
      
      // Then: null이 반환되어야 함
      expect(result).toBeNull();
    });

    it('잘못된 입력에 대해 null을 반환해야 한다', () => {
      // Given: 잘못된 입력
      
      // When: 잘못된 입력으로 아이템 찾기
      const result = CartDisplay.findItemByProductId(null, 'p1');
      
      // Then: null 반환
      expect(result).toBeNull();
    });
  });

  describe('removeItemByProductId() 메서드', () => {
    it('존재하는 상품을 제거해야 한다', () => {
      // Given: 장바구니와 제거할 상품 ID
      const productId = 'p1';
      
      // When: 상품 제거
      const result = CartDisplay.removeItemByProductId(mockCartItems, productId);
      
      // Then: 해당 상품이 제거된 배열 반환
      expect(result).toHaveLength(1);
      expect(result[0].product.id).toBe('p2');
      expect(result.find(item => item.product.id === 'p1')).toBeUndefined();
    });

    it('존재하지 않는 상품 ID에 대해 원본 배열을 반환해야 한다', () => {
      // Given: 존재하지 않는 상품 ID
      const productId = 'nonexistent';
      
      // When: 존재하지 않는 상품 제거 시도
      const result = CartDisplay.removeItemByProductId(mockCartItems, productId);
      
      // Then: 원본 배열과 동일한 길이
      expect(result).toHaveLength(2);
    });

    it('잘못된 입력에 대해 빈 배열을 반환해야 한다', () => {
      // Given: 잘못된 입력
      
      // When: 잘못된 입력으로 제거 시도
      const result = CartDisplay.removeItemByProductId(null, 'p1');
      
      // Then: 빈 배열 반환
      expect(result).toEqual([]);
    });
  });

  describe('updateItemQuantity() 메서드', () => {
    it('존재하는 상품의 수량을 업데이트해야 한다', () => {
      // Given: 장바구니와 업데이트할 상품 ID, 새 수량
      const productId = 'p1';
      const newQuantity = 5;
      
      // When: 수량 업데이트
      const result = CartDisplay.updateItemQuantity(mockCartItems, productId, newQuantity);
      
      // Then: 수량이 업데이트된 배열 반환
      const updatedItem = result.find(item => item.product.id === 'p1');
      expect(updatedItem.quantity).toBe(5);
      expect(updatedItem.subtotal).toBe(450000); // 90000 * 5
    });

    it('수량이 0 이하일 때 아이템을 제거해야 한다', () => {
      // Given: 0 이하의 수량
      const productId = 'p1';
      const newQuantity = 0;
      
      // When: 0 수량으로 업데이트
      const result = CartDisplay.updateItemQuantity(mockCartItems, productId, newQuantity);
      
      // Then: 해당 아이템이 제거되어야 함
      expect(result).toHaveLength(1);
      expect(result.find(item => item.product.id === 'p1')).toBeUndefined();
    });

    it('존재하지 않는 상품 ID에 대해 원본 배열을 반환해야 한다', () => {
      // Given: 존재하지 않는 상품 ID
      const productId = 'nonexistent';
      const newQuantity = 3;
      
      // When: 존재하지 않는 상품 수량 업데이트
      const result = CartDisplay.updateItemQuantity(mockCartItems, productId, newQuantity);
      
      // Then: 원본 배열과 동일
      expect(result).toHaveLength(2);
      expect(result[0].quantity).toBe(2); // 원본 유지
    });

    it('잘못된 입력에 대해 빈 배열을 반환해야 한다', () => {
      // Given: 잘못된 입력
      
      // When: 잘못된 입력으로 수량 업데이트
      const result = CartDisplay.updateItemQuantity(null, 'p1', 3);
      
      // Then: 빈 배열 반환
      expect(result).toEqual([]);
    });
  });

  describe('groupItemsByProductId() 메서드', () => {
    it('아이템들을 상품 ID별로 그룹화해야 한다', () => {
      // Given: 장바구니 아이템 배열
      
      // When: 상품 ID별 그룹화
      const result = CartDisplay.groupItemsByProductId(mockCartItems);
      
      // Then: 상품 ID별로 그룹화된 객체 반환
      expect(result).toHaveProperty('p1');
      expect(result).toHaveProperty('p2');
      expect(result.p1).toHaveLength(1);
      expect(result.p2).toHaveLength(1);
      expect(result.p1[0].product.name).toBe('무선 키보드');
    });

    it('빈 배열에 대해 빈 객체를 반환해야 한다', () => {
      // Given: 빈 배열
      const emptyItems = [];
      
      // When: 빈 배열 그룹화
      const result = CartDisplay.groupItemsByProductId(emptyItems);
      
      // Then: 빈 객체 반환
      expect(result).toEqual({});
    });

    it('잘못된 입력에 대해 빈 객체를 반환해야 한다', () => {
      // Given: 잘못된 입력
      
      // When: 잘못된 입력으로 그룹화
      const result = CartDisplay.groupItemsByProductId(null);
      
      // Then: 빈 객체 반환
      expect(result).toEqual({});
    });
  });

  describe('통합 테스트', () => {
    it('복잡한 장바구니 시나리오를 완전히 처리해야 한다', () => {
      // Given: 다양한 할인이 적용된 복잡한 장바구니
      const complexCartItems = [
        {
          product: { ...mockProduct1, onSale: true, suggestSale: true },
          quantity: 3,
          discounts: { lightning: true, recommend: true },
          subtotal: 270000,
          stock: 12,
        },
        {
          product: mockProduct2,
          quantity: 2,
          discounts: {},
          subtotal: 90000,
          stock: 18,
        },
      ];
      
      // When: 복잡한 장바구니 렌더링
      const result = CartDisplay.render(complexCartItems, {
        showDiscounts: true,
        allowQuantityChange: true,
        className: 'complex-cart',
      });
      
      // Then: 모든 요소가 올바르게 렌더링되어야 함
      expect(result).toContain('complex-cart');
      expect(result).toContain('⚡💝'); // 할인 아이콘
      expect(result).toContain('무선 키보드');
      expect(result).toContain('무선 마우스');
      expect(result).toContain('tabular-nums">3</span>'); // 수량
      expect(result).toContain('tabular-nums">2</span>'); // 수량
    });

    it('빈 장바구니에서 아이템 추가 시나리오를 처리해야 한다', () => {
      // Given: 빈 장바구니에서 시작
      let cartItems = [];
      
      // When: 아이템 추가 시뮬레이션 (수량 업데이트로 처리)
      cartItems = CartDisplay.updateItemQuantity(cartItems, 'p1', 0); // 빈 상태 유지
      let emptyResult = CartDisplay.render(cartItems);
      
      // Then: 빈 상태가 표시되어야 함
      expect(emptyResult).toContain('장바구니가 비어있습니다');
      
      // When: 실제 아이템 추가 (실제로는 외부에서 처리)
      cartItems = [mockCartItems[0]];
      let filledResult = CartDisplay.render(cartItems);
      
      // Then: 아이템이 표시되어야 함
      expect(filledResult).toContain('무선 키보드');
      expect(filledResult).not.toContain('장바구니가 비어있습니다');
    });
  });
}); 