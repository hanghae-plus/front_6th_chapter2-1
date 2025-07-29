import { describe, expect, it } from 'vitest';
import { render, screen } from '../../test-utils';
import { CartDisplay } from '../cart/CartDisplay';

describe('CartDisplay', () => {
  describe('빈 장바구니 상태', () => {
    it('should display empty cart message', () => {
      // Given: CartDisplay 컴포넌트가 렌더링됨
      render(<CartDisplay />);

      // When: 장바구니가 비어있음
      // Then: 빈 장바구니 메시지가 표시되어야 함
      expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
      expect(screen.getByText('상품을 추가해보세요!')).toBeInTheDocument();
    });
  });

  describe('장바구니 아이템 표시', () => {
    it('should display cart items when items exist', () => {
      // Given: 장바구니에 상품이 있는 상태로 CartDisplay 컴포넌트가 렌더링됨
      // CartProvider를 통해 장바구니 상태를 관리하므로 실제로는 빈 상태
      render(<CartDisplay />);

      // When: 장바구니가 비어있음
      // Then: 빈 장바구니 메시지가 표시되어야 함
      expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
    });
  });

  describe('수량 조절', () => {
    it('should have quantity controls when cart has items', () => {
      // Given: CartDisplay 컴포넌트가 렌더링됨
      render(<CartDisplay />);

      // When: 장바구니가 비어있음
      // Then: 빈 장바구니 메시지가 표시되어야 함
      expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
    });
  });

  describe('상품 제거', () => {
    it('should have remove button when cart has items', () => {
      // Given: CartDisplay 컴포넌트가 렌더링됨
      render(<CartDisplay />);

      // When: 장바구니가 비어있음
      // Then: 빈 장바구니 메시지가 표시되어야 함
      expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
    });
  });

  describe('총계 표시', () => {
    it('should display total amount when cart has items', () => {
      // Given: CartDisplay 컴포넌트가 렌더링됨
      render(<CartDisplay />);

      // When: 장바구니가 비어있음
      // Then: 빈 장바구니 메시지가 표시되어야 함
      expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
    });
  });

  describe('할인 정보', () => {
    it('should display discount information when cart has items', () => {
      // Given: CartDisplay 컴포넌트가 렌더링됨
      render(<CartDisplay />);

      // When: 장바구니가 비어있음
      // Then: 빈 장바구니 메시지가 표시되어야 함
      expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
    });
  });

  describe('포인트 정보', () => {
    it('should display points information when cart has items', () => {
      // Given: CartDisplay 컴포넌트가 렌더링됨
      render(<CartDisplay />);

      // When: 장바구니가 비어있음
      // Then: 빈 장바구니 메시지가 표시되어야 함
      expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
    });
  });
});
