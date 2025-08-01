import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import App from '../src/App';
import * as useProductStateModule from '../src/hooks/useProductState';
import * as useCartStateModule from '../src/hooks/useCartState';
import * as useLightningSaleModule from '../src/hooks/useLightningSale';
import * as useCartActionsModule from '../src/hooks/useCartActions';

// 목업 데이터 정의
const mockProducts = [
  {
    id: '1',
    name: 'Product A',
    val: 10000,
    originalVal: 10000,
    stock: 5,
    onSale: false,
    suggestSale: false,
  },
  {
    id: '2',
    name: 'Product B',
    val: 20000,
    originalVal: 20000,
    stock: 3,
    onSale: false,
    suggestSale: false,
  },
  {
    id: '3',
    name: 'Product C (On Sale)',
    val: 7500,
    originalVal: 10000,
    stock: 2,
    onSale: true,
    suggestSale: false,
  },
  {
    id: '4',
    name: 'Product D (Suggest Sale)',
    val: 9500,
    originalVal: 10000,
    stock: 1,
    onSale: false,
    suggestSale: true,
  },
  {
    id: '5',
    name: 'Product E (Sold Out)',
    val: 5000,
    originalVal: 5000,
    stock: 0,
    onSale: false,
    suggestSale: false,
  },
];

const mockCartState = {
  cartItems: [],
  totalPrice: 0,
  lastSelectedProduct: null,
};

// 훅들을 목업합니다.
vi.mock('../src/hooks/useProductState', () => ({
  useProductState: vi.fn(),
}));

vi.mock('../src/hooks/useCartState', () => ({
  useCartState: vi.fn(),
}));

vi.mock('../src/hooks/useLightningSale', () => ({
  useLightningSale: vi.fn(),
}));

vi.mock('../src/hooks/useCartActions', () => ({
  useCartActions: vi.fn(),
}));

describe('App Component', () => {
  // 각 테스트가 실행되기 전에 훅의 목업 구현을 초기화합니다.
  beforeEach(() => {
    // useProductState 훅의 기본 목업 구현
    (useProductStateModule.useProductState as Mock).mockReturnValue({
      productList: mockProducts,
      setProductList: vi.fn(),
    });

    // useCartState 훅의 기본 목업 구현
    (useCartStateModule.useCartState as Mock).mockReturnValue({
      cartState: mockCartState,
      setCartState: vi.fn(),
    });

    // useLightningSale 훅은 호출만 되도록 목업합니다.
    (useLightningSaleModule.useLightningSale as Mock).mockImplementation(
      () => {}
    );

    // useCartActions 훅의 기본 목업 구현
    (useCartActionsModule.useCartActions as Mock).mockReturnValue({
      handleAdd: vi.fn(),
      handleCartClick: vi.fn(),
    });
  });

  // 각 테스트 후에 DOM을 정리합니다.
  afterEach(() => {
    cleanup();
  });

  // App 컴포넌트가 성공적으로 렌더링되는지 테스트합니다.
  it('App 컴포넌트가 정상적으로 렌더링되어야 합니다.', () => {
    render(<App />);
    // Header 컴포넌트의 텍스트가 있는지 확인하여 App이 렌더링되었는지 검증
    expect(screen.getByText(/Shopping Cart/i)).toBeInTheDocument();
  });

  // Header에 초기 장바구니 아이템 개수가 0으로 표시되어야 합니다.
  it('Header에 초기 장바구니 아이템 개수가 0으로 표시되어야 합니다.', () => {
    render(<App />);
    // `item-count` id를 가진 요소에서 텍스트를 확인
    expect(screen.getByText(/0 items in cart/i)).toBeInTheDocument();
  });

  // Header에 장바구니 아이템 개수가 올바르게 표시되는지 테스트합니다.
  it('Header에 장바구니 아이템 개수가 올바르게 표시되어야 합니다.', () => {
    // 장바구니에 아이템이 있는 상태를 목업
    (useCartStateModule.useCartState as Mock).mockReturnValue({
      cartState: { ...mockCartState, cartItems: [{ id: '1', quantity: 1 }] },
      setCartState: vi.fn(),
    });

    render(<App />);
    // `item-count` id를 가진 요소에서 텍스트를 확인
    expect(screen.getByText(/1 items in cart/i)).toBeInTheDocument();
  });

  // 상품 추가 버튼 클릭 시 handleAdd 함수가 호출되어야 합니다.
  it('상품 추가 버튼 클릭 시 handleAdd 함수가 호출되어야 합니다.', async () => {
    const mockHandleAdd = vi.fn();
    (useCartActionsModule.useCartActions as Mock).mockReturnValue({
      handleAdd: mockHandleAdd,
      handleCartClick: vi.fn(),
    });

    render(<App />);
    // `add-to-cart` id를 가진 버튼을 찾아 클릭 (여러 개일 경우 첫 번째)
    const addButton = screen.getAllByRole('button', {
      name: /Add to Cart/i,
    })[0];
    fireEvent.click(addButton);

    // handleAdd 함수가 호출되었는지 확인
    expect(mockHandleAdd).toHaveBeenCalledTimes(1);
  });

  // 장바구니 아이콘 클릭 시 handleCartClick 함수가 호출되어야 합니다.
  it('장바구니 아이콘 클릭 시 handleCartClick 함수가 호출되어야 합니다.', async () => {
    const mockHandleCartClick = vi.fn();
    (useCartActionsModule.useCartActions as Mock).mockReturnValue({
      handleAdd: vi.fn(),
      handleCartClick: mockHandleCartClick,
    });

    render(<App />);
    // `cart-items` id를 가진 요소를 찾아 클릭
    const cartItemsDiv = screen.getByRole('group', { name: /Cart Items/i });
    fireEvent.click(cartItemsDiv);

    // handleCartClick 함수가 호출되었는지 확인
    expect(mockHandleCartClick).toHaveBeenCalledTimes(1);
  });

  // useLightningSale 훅이 App 컴포넌트 렌더링 시 호출되는지 테스트합니다.
  it('useLightningSale 훅이 App 컴포넌트 렌더링 시 호출되어야 합니다.', () => {
    render(<App />);
    // 호출 횟수에 대한 엄격한 검증 대신 호출 여부만 확인
    expect(useLightningSaleModule.useLightningSale as Mock).toHaveBeenCalled();
  });
});
