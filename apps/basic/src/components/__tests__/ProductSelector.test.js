/**
 * ProductSelector 컴포넌트 단위 테스트
 * 상품 선택 드롭다운 렌더링 로직을 검증합니다.
 */

import { describe, expect, it } from 'vitest';
import { ProductSelector } from '../ProductSelector.js';

describe('ProductSelector', () => {
  // 테스트용 상품 데이터
  const mockProducts = [
    {
      id: 'p1',
      name: '무선 키보드',
      val: 100000,
      originalVal: 100000,
      q: 15,
      onSale: false,
      suggestSale: false,
    },
    {
      id: 'p2',
      name: '무선 마우스',
      val: 40000,
      originalVal: 50000,
      q: 8,
      onSale: true,
      suggestSale: false,
    },
    {
      id: 'p3',
      name: '모니터암',
      val: 0,
      originalVal: 80000,
      q: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: 'p4',
      name: '헤드폰',
      val: 150000,
      originalVal: 200000,
      q: 5,
      onSale: false,
      suggestSale: true,
    },
    {
      id: 'p5',
      name: '웹캠',
      val: 52500,
      originalVal: 70000,
      q: 3,
      onSale: true,
      suggestSale: true,
    },
  ];

  describe('getProductStatusIcon', () => {
    it('번개세일과 추천할인 모두 적용 시 ⚡💝 반환', () => {
      const product = { onSale: true, suggestSale: true };
      const result = ProductSelector.getProductStatusIcon(product);
      expect(result).toBe('⚡💝');
    });

    it('번개세일만 적용 시 ⚡ 반환', () => {
      const product = { onSale: true, suggestSale: false };
      const result = ProductSelector.getProductStatusIcon(product);
      expect(result).toBe('⚡');
    });

    it('추천할인만 적용 시 💝 반환', () => {
      const product = { onSale: false, suggestSale: true };
      const result = ProductSelector.getProductStatusIcon(product);
      expect(result).toBe('💝');
    });

    it('일반 상품은 빈 문자열 반환', () => {
      const product = { onSale: false, suggestSale: false };
      const result = ProductSelector.getProductStatusIcon(product);
      expect(result).toBe('');
    });

    it('null 상품은 빈 문자열 반환', () => {
      const result = ProductSelector.getProductStatusIcon(null);
      expect(result).toBe('');
    });
  });

  describe('getStockStatusMessage', () => {
    it('품절 상품은 " (품절)" 메시지 반환', () => {
      const product = { q: 0 };
      const result = ProductSelector.getStockStatusMessage(product);
      expect(result).toBe(' (품절)');
    });

    it('재고가 있는 상품은 빈 문자열 반환', () => {
      const product = { q: 5 };
      const result = ProductSelector.getStockStatusMessage(product);
      expect(result).toBe('');
    });

    it('재고 부족 상품도 빈 문자열 반환 (기존 로직)', () => {
      const product = { q: 3 };
      const result = ProductSelector.getStockStatusMessage(product);
      expect(result).toBe('');
    });

    it('유효하지 않은 상품은 빈 문자열 반환', () => {
      expect(ProductSelector.getStockStatusMessage(null)).toBe('');
      expect(ProductSelector.getStockStatusMessage({})).toBe('');
    });
  });

  describe('formatProductPrice', () => {
    it('번개세일+추천할인 상품은 25% SUPER SALE 표시', () => {
      const product = { val: 52500, originalVal: 70000, onSale: true, suggestSale: true };
      const result = ProductSelector.formatProductPrice(product);
      expect(result).toBe(' - 70000원 → 52500원 (25% SUPER SALE!)');
    });

    it('번개세일 상품은 20% SALE 표시', () => {
      const product = { val: 40000, originalVal: 50000, onSale: true, suggestSale: false };
      const result = ProductSelector.formatProductPrice(product);
      expect(result).toBe(' - 50000원 → 40000원 (20% SALE!)');
    });

    it('추천할인 상품은 5% 추천할인 표시', () => {
      const product = { val: 150000, originalVal: 200000, onSale: false, suggestSale: true };
      const result = ProductSelector.formatProductPrice(product);
      expect(result).toBe(' - 200000원 → 150000원 (5% 추천할인!)');
    });

    it('일반 상품은 현재 가격만 표시', () => {
      const product = { val: 100000, originalVal: 100000, onSale: false, suggestSale: false };
      const result = ProductSelector.formatProductPrice(product);
      expect(result).toBe(' - 100000원');
    });
  });

  describe('getProductCSSClass', () => {
    it('품절 상품은 text-gray-400 클래스 반환', () => {
      const product = { q: 0, onSale: false, suggestSale: false };
      const result = ProductSelector.getProductCSSClass(product);
      expect(result).toBe('text-gray-400');
    });

    it('번개세일+추천할인 상품은 text-purple-600 font-bold 클래스 반환', () => {
      const product = { q: 5, onSale: true, suggestSale: true };
      const result = ProductSelector.getProductCSSClass(product);
      expect(result).toBe('text-purple-600 font-bold');
    });

    it('번개세일 상품은 text-red-500 font-bold 클래스 반환', () => {
      const product = { q: 5, onSale: true, suggestSale: false };
      const result = ProductSelector.getProductCSSClass(product);
      expect(result).toBe('text-red-500 font-bold');
    });

    it('추천할인 상품은 text-blue-500 font-bold 클래스 반환', () => {
      const product = { q: 5, onSale: false, suggestSale: true };
      const result = ProductSelector.getProductCSSClass(product);
      expect(result).toBe('text-blue-500 font-bold');
    });

    it('일반 상품은 빈 문자열 반환', () => {
      const product = { q: 5, onSale: false, suggestSale: false };
      const result = ProductSelector.getProductCSSClass(product);
      expect(result).toBe('');
    });
  });

  describe('generateOption', () => {
    it('일반 상품 옵션 데이터 생성', () => {
      const product = mockProducts[0]; // 무선 키보드
      const result = ProductSelector.generateOption(product);

      expect(result.value).toBe('p1');
      expect(result.text).toBe('무선 키보드 - 100000원');
      expect(result.disabled).toBe(false);
      expect(result.className).toBe('');
    });

    it('번개세일 상품 옵션 데이터 생성', () => {
      const product = mockProducts[1]; // 무선 마우스
      const result = ProductSelector.generateOption(product);

      expect(result.value).toBe('p2');
      expect(result.text).toBe('⚡무선 마우스 - 50000원 → 40000원 (20% SALE!)');
      expect(result.disabled).toBe(false);
      expect(result.className).toBe('text-red-500 font-bold');
    });

    it('품절 상품 옵션 데이터 생성', () => {
      const product = mockProducts[2]; // 모니터암
      const result = ProductSelector.generateOption(product);

      expect(result.value).toBe('p3');
      expect(result.text).toBe('모니터암 - 0원 (품절)');
      expect(result.disabled).toBe(true);
      expect(result.className).toBe('text-gray-400');
    });

    it('추천할인 상품 옵션 데이터 생성', () => {
      const product = mockProducts[3]; // 헤드폰
      const result = ProductSelector.generateOption(product);

      expect(result.value).toBe('p4');
      expect(result.text).toBe('💝헤드폰 - 200000원 → 150000원 (5% 추천할인!)');
      expect(result.disabled).toBe(false);
      expect(result.className).toBe('text-blue-500 font-bold');
    });

    it('번개세일+추천할인 상품 옵션 데이터 생성', () => {
      const product = mockProducts[4]; // 웹캠
      const result = ProductSelector.generateOption(product);

      expect(result.value).toBe('p5');
      expect(result.text).toBe('⚡💝웹캠 - 70000원 → 52500원 (25% SUPER SALE!)');
      expect(result.disabled).toBe(false);
      expect(result.className).toBe('text-purple-600 font-bold');
    });
  });

  describe('render', () => {
    it('기본 옵션으로 드롭다운 렌더링', () => {
      const result = ProductSelector.render(mockProducts);

      expect(result).toContain('<select');
      expect(result).toContain(
        'class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"'
      );
      expect(result).toContain('<option value="">상품을 선택하세요</option>');
      expect(result).toContain('value="p1"');
      expect(result).toContain('무선 키보드');
    });

    it('ID와 클래스명 옵션 적용', () => {
      const result = ProductSelector.render(mockProducts, {
        id: 'product-select',
        className: 'custom-class',
      });

      expect(result).toContain('id="product-select"');
      expect(result).toContain('custom-class');
    });

    it('커스텀 placeholder 적용', () => {
      const result = ProductSelector.render(mockProducts, {
        placeholder: '원하는 상품을 선택하세요',
      });

      expect(result).toContain('<option value="">원하는 상품을 선택하세요</option>');
    });

    it('전체 재고 50개 미만 시 주황색 테두리 적용', () => {
      // 재고 총합: 15 + 8 + 0 + 5 + 3 = 31개 (50개 미만)
      const result = ProductSelector.render(mockProducts);

      expect(result).toContain('style="border-color: orange;"');
    });

    it('전체 재고 50개 이상 시 일반 테두리', () => {
      const highStockProducts = [
        {
          id: 'p1',
          name: '상품1',
          val: 10000,
          originalVal: 10000,
          q: 30,
          onSale: false,
          suggestSale: false,
        },
        {
          id: 'p2',
          name: '상품2',
          val: 20000,
          originalVal: 20000,
          q: 25,
          onSale: false,
          suggestSale: false,
        },
      ];

      const result = ProductSelector.render(highStockProducts);

      expect(result).not.toContain('style="border-color: orange;"');
    });

    it('빈 상품 배열로 렌더링', () => {
      const result = ProductSelector.render([]);

      expect(result).toContain('<select');
      expect(result).toContain('<option value="">상품을 선택하세요</option>');
      expect(result).not.toContain('value="p1"');
    });

    it('품절 상품은 disabled 속성 적용', () => {
      const result = ProductSelector.render(mockProducts);

      expect(result).toContain('value="p3" disabled class="text-gray-400"');
    });

    it('할인 상품은 적절한 스타일 클래스 적용', () => {
      const result = ProductSelector.render(mockProducts);

      expect(result).toContain('class="text-red-500 font-bold"'); // 번개세일
      expect(result).toContain('class="text-blue-500 font-bold"'); // 추천할인
      expect(result).toContain('class="text-purple-600 font-bold"'); // 둘 다
    });
  });
});
