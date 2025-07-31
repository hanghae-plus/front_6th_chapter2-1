import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../test-utils';
import { CartItem as CartItemType } from '../../types/cart.types';
import { Product } from '../../types/product.types';
import { CartItem } from '../cart/CartItem';

describe('CartItem', () => {
  const mockProduct: Product = {
    id: '1',
    name: '테스트 상품',
    description: '테스트 상품 설명',
    price: 10000,
    stock: 5,
    category: '전자제품',
    image: 'test.jpg'
  };

  const mockCartItem: CartItemType = {
    product: mockProduct,
    quantity: 2,
    subtotal: 20000,
    discount: 0,
    points: 0
  };

  const mockOnRemove = vi.fn();
  const mockOnUpdateQuantity = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('재고 제한 기능', () => {
    it('재고보다 많은 수량으로 증가할 수 없어야 한다', () => {
      render(
        <CartItem
          item={mockCartItem}
          onRemove={mockOnRemove}
          onUpdateQuantity={mockOnUpdateQuantity}
        />
      );

      // 현재 수량이 2이고 재고가 5이므로 최대 7개까지 가능
      const quantityInput = screen.getByTestId('quantity-1');

      // 수량을 8로 직접 입력 (재고 초과)
      fireEvent.change(quantityInput, { target: { value: '8' } });

      // onUpdateQuantity가 호출되지 않아야 함 (재고 제한)
      expect(mockOnUpdateQuantity).not.toHaveBeenCalled();
    });

    it('재고 한계에 도달하면 증가 버튼이 비활성화되어야 한다', () => {
      const maxStockCartItem: CartItemType = {
        ...mockCartItem,
        quantity: 5 // 재고와 동일한 수량
      };

      render(
        <CartItem
          item={maxStockCartItem}
          onRemove={mockOnRemove}
          onUpdateQuantity={mockOnUpdateQuantity}
        />
      );

      const increaseButton = screen.getByTestId('increase-1');

      // 증가 버튼이 비활성화되어야 함
      expect(increaseButton).toBeDisabled();
    });

    it('재고 범위 내에서 수량 증가가 가능해야 한다', () => {
      render(
        <CartItem
          item={mockCartItem}
          onRemove={mockOnRemove}
          onUpdateQuantity={mockOnUpdateQuantity}
        />
      );

      const increaseButton = screen.getByTestId('increase-1');

      // 증가 버튼 클릭
      fireEvent.click(increaseButton);

      // onUpdateQuantity가 올바른 수량으로 호출되어야 함
      expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1', 3);
    });

    it('수량 입력 필드에 최대값 제한이 있어야 한다', () => {
      render(
        <CartItem
          item={mockCartItem}
          onRemove={mockOnRemove}
          onUpdateQuantity={mockOnUpdateQuantity}
        />
      );

      const quantityInput = screen.getByTestId('quantity-1');

      // input 필드에 max 속성이 있어야 함 (재고만큼)
      expect(quantityInput).toHaveAttribute('max', '5');
    });
  });

  describe('기본 기능', () => {
    it('상품 정보를 올바르게 표시해야 한다', () => {
      render(
        <CartItem
          item={mockCartItem}
          onRemove={mockOnRemove}
          onUpdateQuantity={mockOnUpdateQuantity}
        />
      );

      expect(screen.getByText('테스트 상품')).toBeInTheDocument();
      expect(screen.getByText('테스트 상품 설명')).toBeInTheDocument();
      expect(screen.getByText('단가: 10,000원')).toBeInTheDocument();
      expect(screen.getByText('수량:')).toBeInTheDocument();
      expect(screen.getByText('2개')).toBeInTheDocument();
    });

    it('수량 감소 버튼이 작동해야 한다', () => {
      render(
        <CartItem
          item={mockCartItem}
          onRemove={mockOnRemove}
          onUpdateQuantity={mockOnUpdateQuantity}
        />
      );

      const decreaseButton = screen.getByTestId('decrease-1');
      fireEvent.click(decreaseButton);

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1', 1);
    });

    it('삭제 버튼이 작동해야 한다', () => {
      render(
        <CartItem
          item={mockCartItem}
          onRemove={mockOnRemove}
          onUpdateQuantity={mockOnUpdateQuantity}
        />
      );

      const removeButton = screen.getByTestId('remove-1');
      fireEvent.click(removeButton);

      expect(mockOnRemove).toHaveBeenCalledWith('1');
    });
  });
});
