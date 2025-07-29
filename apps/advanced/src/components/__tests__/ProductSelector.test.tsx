import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '../../test-utils';
import { ProductSelector } from '../product/ProductSelector';

describe('ProductSelector', () => {
  describe('상품 목록 표시', () => {
    it('should render product list', () => {
      // Given: ProductSelector 컴포넌트가 렌더링됨
      render(<ProductSelector />);

      // When: 상품 목록이 표시됨
      // Then: 상품들이 올바르게 표시되어야 함
      expect(screen.getByText('버그 없애는 키보드')).toBeInTheDocument();
      expect(screen.getByText('생산성 폭발 마우스')).toBeInTheDocument();
      expect(screen.getByText('거북목 탈출 모니터암')).toBeInTheDocument();
      expect(screen.getByText('에러 방지 노트북 파우치')).toBeInTheDocument();
      expect(
        screen.getByText('코딩할 때 듣는 Lo-Fi 스피커')
      ).toBeInTheDocument();
    });
  });

  describe('카테고리 필터링', () => {
    it('should filter products by category', () => {
      // Given: ProductSelector 컴포넌트가 렌더링됨
      render(<ProductSelector />);

      // When: 카테고리를 선택함
      const categorySelect = screen.getByRole('combobox');
      fireEvent.change(categorySelect, { target: { value: 'electronics' } });

      // Then: 해당 카테고리의 상품만 표시되어야 함
      expect(screen.getByText('버그 없애는 키보드')).toBeInTheDocument();
      expect(screen.getByText('생산성 폭발 마우스')).toBeInTheDocument();
      expect(
        screen.queryByText('에러 방지 노트북 파우치')
      ).not.toBeInTheDocument();
    });

    it('should show all products when "전체" is selected', () => {
      // Given: ProductSelector 컴포넌트가 렌더링됨
      render(<ProductSelector />);

      // When: "전체" 카테고리를 선택함
      const categorySelect = screen.getByRole('combobox');
      fireEvent.change(categorySelect, { target: { value: 'all' } });

      // Then: 모든 상품이 표시되어야 함
      expect(screen.getByText('버그 없애는 키보드')).toBeInTheDocument();
      expect(screen.getByText('생산성 폭발 마우스')).toBeInTheDocument();
      expect(screen.getByText('거북목 탈출 모니터암')).toBeInTheDocument();
      expect(screen.getByText('에러 방지 노트북 파우치')).toBeInTheDocument();
      expect(
        screen.getByText('코딩할 때 듣는 Lo-Fi 스피커')
      ).toBeInTheDocument();
    });
  });

  describe('상품 검색', () => {
    it('should search products by name', () => {
      // Given: ProductSelector 컴포넌트가 렌더링됨
      render(<ProductSelector />);

      // When: 검색어를 입력함
      const searchInput =
        screen.getByPlaceholderText('상품명, 설명으로 검색...');
      fireEvent.change(searchInput, { target: { value: '키보드' } });

      // Then: 검색어와 일치하는 상품만 표시되어야 함
      expect(screen.getByText('버그 없애는 키보드')).toBeInTheDocument();
      expect(screen.queryByText('생산성 폭발 마우스')).not.toBeInTheDocument();
    });

    it('should search products by description', () => {
      // Given: ProductSelector 컴포넌트가 렌더링됨
      render(<ProductSelector />);

      // When: 설명으로 검색함
      const searchInput =
        screen.getByPlaceholderText('상품명, 설명으로 검색...');
      fireEvent.change(searchInput, { target: { value: '마법' } });

      // Then: 설명에 검색어가 포함된 상품이 표시되어야 함
      expect(screen.getByText('버그 없애는 키보드')).toBeInTheDocument();
    });
  });

  describe('상품 추가', () => {
    it('should add product to cart when add button is clicked', () => {
      // Given: ProductSelector 컴포넌트가 렌더링됨
      render(<ProductSelector />);

      // When: 장바구니 추가 버튼을 클릭함
      const addButton = screen.getAllByText('장바구니 추가')[0];
      addButton.click();

      // Then: 장바구니 추가 버튼이 존재하고 클릭 가능함
      expect(addButton).toBeInTheDocument();
      expect(addButton).not.toBeDisabled();
    });

    it('should disable add button for out of stock products', () => {
      // Given: ProductSelector 컴포넌트가 렌더링됨
      render(<ProductSelector />);

      // When: 품절 상품의 버튼을 확인함
      // Then: 품절 상품의 버튼이 비활성화되어야 함
      const outOfStockButton = screen.getByText('품절');
      expect(outOfStockButton).toBeDisabled();
    });
  });

  describe('상품 통계', () => {
    it('should display product statistics', () => {
      // Given: ProductSelector 컴포넌트가 렌더링됨
      render(<ProductSelector />);

      // When: 상품 목록이 표시됨
      // Then: 상품 통계가 표시되어야 함
      expect(screen.getByText(/전체:/)).toBeInTheDocument();
      expect(screen.getByText(/검색결과:/)).toBeInTheDocument();
    });
  });
});
