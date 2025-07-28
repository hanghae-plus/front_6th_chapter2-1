/**
 * @fileoverview CartItem 컴포넌트 단위 테스트
 * Vitest 및 Given-When-Then 구조를 사용한 테스트
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { CartItem } from '../CartItem.js';

describe('CartItem 컴포넌트', () => {
  let mockProduct;
  let mockItem;

  beforeEach(() => {
    // Given: 기본 상품 데이터 설정
    mockProduct = {
      id: 'p1',
      name: '무선 키보드',
      val: 90000,
      originalVal: 100000,
      q: 15,
      onSale: false,
      suggestSale: false,
    };

    mockItem = {
      product: mockProduct,
      quantity: 2,
      discounts: {},
      subtotal: 180000,
      stock: 15,
    };
  });

  describe('render() 메서드', () => {
    it('기본 아이템 데이터로 HTML을 정상 렌더링해야 한다', () => {
      // Given: 기본 아이템 데이터

      // When: render 메서드 호출
      const result = CartItem.render(mockItem);

      // Then: 올바른 HTML 구조가 생성되어야 함
      expect(result).toContain('id="p1"');
      expect(result).toContain('무선 키보드');
      expect(result).toContain('grid-cols-[80px_1fr_auto]');
      expect(result).toContain('data-product-id="p1"');
    });

    it('item 또는 product가 없으면 에러를 발생시켜야 한다', () => {
      // Given: 잘못된 데이터

      // When & Then: 에러 발생 확인
      expect(() => CartItem.render(null)).toThrow(
        'CartItem.render: item과 item.product는 필수입니다.'
      );
      expect(() => CartItem.render({})).toThrow(
        'CartItem.render: item과 item.product는 필수입니다.'
      );
    });

    it('커스텀 className 옵션을 적용해야 한다', () => {
      // Given: 커스텀 className 옵션
      const options = { className: 'custom-class' };

      // When: 옵션과 함께 render 호출
      const result = CartItem.render(mockItem, options);

      // Then: 커스텀 클래스가 포함되어야 함
      expect(result).toContain('custom-class');
    });
  });

  describe('generateDiscountIcons() 메서드', () => {
    it('번개세일과 추천할인이 모두 있으면 ⚡💝을 반환해야 한다', () => {
      // Given: 번개세일 + 추천할인 상품
      const product = { ...mockProduct, onSale: true, suggestSale: true };

      // When: 할인 아이콘 생성
      const result = CartItem.generateDiscountIcons(product);

      // Then: 두 아이콘 모두 포함
      expect(result).toBe('⚡💝');
    });

    it('번개세일만 있으면 ⚡을 반환해야 한다', () => {
      // Given: 번개세일만 있는 상품
      const product = { ...mockProduct, onSale: true, suggestSale: false };

      // When: 할인 아이콘 생성
      const result = CartItem.generateDiscountIcons(product);

      // Then: 번개세일 아이콘만 포함
      expect(result).toBe('⚡');
    });

    it('추천할인만 있으면 💝을 반환해야 한다', () => {
      // Given: 추천할인만 있는 상품
      const product = { ...mockProduct, onSale: false, suggestSale: true };

      // When: 할인 아이콘 생성
      const result = CartItem.generateDiscountIcons(product);

      // Then: 추천할인 아이콘만 포함
      expect(result).toBe('💝');
    });

    it('할인이 없으면 빈 문자열을 반환해야 한다', () => {
      // Given: 할인이 없는 상품
      const product = { ...mockProduct, onSale: false, suggestSale: false };

      // When: 할인 아이콘 생성
      const result = CartItem.generateDiscountIcons(product);

      // Then: 빈 문자열 반환
      expect(result).toBe('');
    });
  });

  describe('generateInlinePriceDisplay() 메서드', () => {
    it('할인이 있으면 취소선 원가와 할인가를 표시해야 한다', () => {
      // Given: 할인 상품
      const product = { ...mockProduct, onSale: true, val: 90000, originalVal: 100000 };

      // When: 인라인 가격 표시 생성
      const result = CartItem.generateInlinePriceDisplay(product);

      // Then: 취소선 원가와 할인가 포함
      expect(result).toContain('line-through');
      expect(result).toContain('₩100,000');
      expect(result).toContain('₩90,000');
      expect(result).toContain('text-red-500');
    });

    it('할인이 없으면 일반 가격만 표시해야 한다', () => {
      // Given: 일반 상품
      const product = { ...mockProduct, onSale: false, suggestSale: false };

      // When: 인라인 가격 표시 생성
      const result = CartItem.generateInlinePriceDisplay(product);

      // Then: 일반 가격만 포함
      expect(result).toBe('₩90,000');
      expect(result).not.toContain('line-through');
    });

    it('showDiscounts가 false면 일반 가격만 표시해야 한다', () => {
      // Given: 할인 상품이지만 showDiscounts false
      const product = { ...mockProduct, onSale: true };
      const options = { showDiscounts: false };

      // When: showDiscounts false로 가격 표시 생성
      const result = CartItem.generateInlinePriceDisplay(product, options);

      // Then: 할인 표시 없이 현재 가격만 표시
      expect(result).toBe('₩90,000');
      expect(result).not.toContain('line-through');
    });
  });

  describe('getDiscountColor() 메서드', () => {
    it('번개세일과 추천할인이 모두 있으면 text-purple-600을 반환해야 한다', () => {
      // Given: 번개세일 + 추천할인 상품
      const product = { ...mockProduct, onSale: true, suggestSale: true };

      // When: 할인 색상 클래스 조회
      const result = CartItem.getDiscountColor(product);

      // Then: 보라색 클래스 반환
      expect(result).toBe('text-purple-600');
    });

    it('번개세일만 있으면 text-red-500을 반환해야 한다', () => {
      // Given: 번개세일만 있는 상품
      const product = { ...mockProduct, onSale: true, suggestSale: false };

      // When: 할인 색상 클래스 조회
      const result = CartItem.getDiscountColor(product);

      // Then: 빨간색 클래스 반환
      expect(result).toBe('text-red-500');
    });

    it('추천할인만 있으면 text-blue-500을 반환해야 한다', () => {
      // Given: 추천할인만 있는 상품
      const product = { ...mockProduct, onSale: false, suggestSale: true };

      // When: 할인 색상 클래스 조회
      const result = CartItem.getDiscountColor(product);

      // Then: 파란색 클래스 반환
      expect(result).toBe('text-blue-500');
    });

    it('할인이 없으면 빈 문자열을 반환해야 한다', () => {
      // Given: 할인이 없는 상품
      const product = { ...mockProduct, onSale: false, suggestSale: false };

      // When: 할인 색상 클래스 조회
      const result = CartItem.getDiscountColor(product);

      // Then: 빈 문자열 반환
      expect(result).toBe('');
    });
  });

  describe('generateQuantityControls() 메서드', () => {
    it('수량 변경이 허용되면 +/- 버튼과 수량을 표시해야 한다', () => {
      // Given: 수량 변경 허용 설정
      const options = { allowQuantityChange: true };

      // When: 수량 컨트롤 생성
      const result = CartItem.generateQuantityControls(mockProduct, 2, options);

      // Then: 버튼과 수량 표시 포함
      expect(result).toContain('quantity-change');
      expect(result).toContain('data-product-id="p1"');
      expect(result).toContain('data-change="-1"');
      expect(result).toContain('data-change="1"');
      expect(result).toContain('<span class="quantity-number');
      expect(result).toContain('>2<');
    });

    it('수량 변경이 비허용되면 수량만 표시해야 한다', () => {
      // Given: 수량 변경 비허용 설정
      const options = { allowQuantityChange: false };

      // When: 수량 컨트롤 생성
      const result = CartItem.generateQuantityControls(mockProduct, 2, options);

      // Then: 수량만 표시, 버튼 없음
      expect(result).toContain('수량: 2');
      expect(result).not.toContain('quantity-change');
      expect(result).not.toContain('button');
    });
  });

  describe('generateRemoveButton() 메서드', () => {
    it('올바른 제거 버튼 HTML을 생성해야 한다', () => {
      // Given: 상품 정보

      // When: 제거 버튼 생성
      const result = CartItem.generateRemoveButton(mockProduct);

      // Then: 제거 버튼 HTML 포함
      expect(result).toContain('remove-item');
      expect(result).toContain('data-product-id="p1"');
      expect(result).toContain('Remove');
      expect(result).toContain('hover:text-black');
    });
  });

  describe('generateImageSection() 메서드', () => {
    it('올바른 이미지 섹션 HTML을 생성해야 한다', () => {
      // Given: 상품 정보

      // When: 이미지 섹션 생성
      const result = CartItem.generateImageSection(mockProduct);

      // Then: 이미지 섹션 HTML 포함
      expect(result).toContain('w-20 h-20');
      expect(result).toContain('bg-gradient-black');
      expect(result).toContain('bg-white/10');
      expect(result).toContain('rotate-45');
    });
  });

  describe('generateTotalPriceDisplay() 메서드', () => {
    it('할인이 있으면 총 가격도 할인 표시를 해야 한다', () => {
      // Given: 할인 상품과 수량
      const product = { ...mockProduct, onSale: true, val: 90000, originalVal: 100000 };
      const totalPrice = 180000; // 90000 * 2

      // When: 총 가격 표시 생성
      const result = CartItem.generateTotalPriceDisplay(product, totalPrice);

      // Then: 할인된 총 가격 표시
      expect(result).toContain('line-through');
      expect(result).toContain('₩200,000'); // 100000 * 2
      expect(result).toContain('₩180,000'); // 90000 * 2
      expect(result).toContain('text-red-500');
    });

    it('할인이 없으면 총 가격만 표시해야 한다', () => {
      // Given: 일반 상품과 수량
      const product = { ...mockProduct, onSale: false, suggestSale: false };
      const totalPrice = 180000;

      // When: 총 가격 표시 생성
      const result = CartItem.generateTotalPriceDisplay(product, totalPrice);

      // Then: 일반 총 가격만 표시
      expect(result).toBe('₩180,000');
      expect(result).not.toContain('line-through');
    });
  });

  describe('통합 렌더링 테스트', () => {
    it('할인 상품의 완전한 HTML을 올바르게 렌더링해야 한다', () => {
      // Given: 할인 상품 데이터
      const discountProduct = {
        ...mockProduct,
        onSale: true,
        suggestSale: true,
        val: 80000,
        originalVal: 100000,
      };
      const discountItem = {
        ...mockItem,
        product: discountProduct,
        quantity: 3,
      };

      // When: 전체 아이템 렌더링
      const result = CartItem.render(discountItem);

      // Then: 모든 할인 요소가 포함되어야 함
      expect(result).toContain('⚡💝'); // 할인 아이콘
      expect(result).toContain('line-through'); // 취소선 가격
      expect(result).toContain('text-purple-600'); // 할인 색상
      expect(result).toContain('₩100,000'); // 원가
      expect(result).toContain('₩80,000'); // 할인가
      expect(result).toContain('tabular-nums">3</span>'); // 수량
      expect(result).toContain('data-product-id="p1"'); // 상품 ID
    });

    it('일반 상품의 완전한 HTML을 올바르게 렌더링해야 한다', () => {
      // Given: 일반 상품 데이터

      // When: 전체 아이템 렌더링
      const result = CartItem.render(mockItem);

      // Then: 기본 요소들이 포함되어야 함
      expect(result).toContain('무선 키보드'); // 상품명
      expect(result).toContain('₩90,000'); // 가격 (할인 표시 없음)
      expect(result).toContain('tabular-nums">2</span>'); // 수량
      expect(result).toContain('remove-item'); // 제거 버튼
      expect(result).not.toContain('⚡'); // 할인 아이콘 없음
      expect(result).not.toContain('💝'); // 할인 아이콘 없음
      expect(result).not.toContain('line-through'); // 취소선 없음
    });
  });
});
