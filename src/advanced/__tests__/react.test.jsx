import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('React 장바구니 앱 테스트', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    vi.useRealTimers();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. 기본 UI 렌더링', () => {
    it('앱이 올바르게 렌더링되어야 함', () => {
      render(<App />);
      
      // 헤더 확인
      expect(screen.getByText('🛒 Hanghae Online Store')).toBeInTheDocument();
      expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
      expect(screen.getByText('🛍️ 0 items in cart')).toBeInTheDocument();
      
      // 상품 선택 영역 확인
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
      
      // 주문 요약 영역 확인
      expect(screen.getByText('Order Summary')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('₩0')).toBeInTheDocument();
    });

    it('5개 상품이 올바른 정보로 표시되어야 함', () => {
      render(<App />);
      
      const select = screen.getByRole('combobox');
      const options = select.querySelectorAll('option');
      
      // 첫 번째 옵션은 "상품을 선택하세요"이므로 제외
      expect(options.length).toBe(6); // 5개 상품 + 1개 기본 옵션
      
      // 상품 옵션들 확인
      expect(select).toHaveTextContent('버그 없애는 키보드');
      expect(select).toHaveTextContent('생산성 폭발 마우스');
      expect(select).toHaveTextContent('거북목 탈출 모니터암');
      expect(select).toHaveTextContent('에러 방지 노트북 파우치');
      expect(select).toHaveTextContent('코딩할 때 듣는 Lo-Fi 스피커');
    });
  });

  describe('2. 상품 추가 기능', () => {
    it('상품을 선택하고 장바구니에 추가할 수 있어야 함', async () => {
      render(<App />);
      
      const select = screen.getByRole('combobox');
      const addButton = screen.getByText('Add to Cart');
      
      // 상품 선택
      await user.selectOptions(select, 'p1');
      await user.click(addButton);
      
      // 장바구니에 상품이 추가되었는지 확인
      expect(screen.getByText('버그 없애는 키보드')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // 수량
      expect(screen.getByText('₩10,000')).toBeInTheDocument(); // 가격
    });

    it('같은 상품을 다시 추가하면 수량이 증가해야 함', async () => {
      render(<App />);
      
      const select = screen.getByRole('combobox');
      const addButton = screen.getByText('Add to Cart');
      
      // 상품 2번 추가
      await user.selectOptions(select, 'p1');
      await user.click(addButton);
      await user.click(addButton);
      
      // 수량이 2가 되었는지 확인
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('품절 상품은 선택할 수 없어야 함', () => {
      render(<App />);
      
      const select = screen.getByRole('combobox');
      const p4Option = select.querySelector('option[value="p4"]');
      
      expect(p4Option).toBeDisabled();
      expect(p4Option).toHaveTextContent('품절');
    });
  });

  describe('3. 수량 변경 기능', () => {
    it('+/- 버튼으로 수량을 조절할 수 있어야 함', async () => {
      render(<App />);
      
      // 상품 추가
      const select = screen.getByRole('combobox');
      const addButton = screen.getByText('Add to Cart');
      await user.selectOptions(select, 'p1');
      await user.click(addButton);
      
      // 수량 증가
      const increaseButton = screen.getByText('+');
      await user.click(increaseButton);
      expect(screen.getByText('2')).toBeInTheDocument();
      
      // 수량 감소
      const decreaseButton = screen.getByText('−');
      await user.click(decreaseButton);
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('수량이 0이 되면 상품이 자동으로 제거되어야 함', async () => {
      render(<App />);
      
      // 상품 추가
      const select = screen.getByRole('combobox');
      const addButton = screen.getByText('Add to Cart');
      await user.selectOptions(select, 'p1');
      await user.click(addButton);
      
      // 수량을 0으로 만들기
      const decreaseButton = screen.getByText('−');
      await user.click(decreaseButton);
      
      // 상품이 제거되었는지 확인
      expect(screen.queryByText('버그 없애는 키보드')).not.toBeInTheDocument();
    });
  });

  describe('4. 상품 제거 기능', () => {
    it('Remove 버튼으로 상품을 제거할 수 있어야 함', async () => {
      render(<App />);
      
      // 상품 추가
      const select = screen.getByRole('combobox');
      const addButton = screen.getByText('Add to Cart');
      await user.selectOptions(select, 'p1');
      await user.click(addButton);
      
      // Remove 버튼 클릭
      const removeButton = screen.getByText('Remove');
      await user.click(removeButton);
      
      // 상품이 제거되었는지 확인
      expect(screen.queryByText('버그 없애는 키보드')).not.toBeInTheDocument();
    });
  });

  describe('5. 할인 정책', () => {
    it('10개 이상 구매 시 개별 상품 할인이 적용되어야 함', async () => {
      render(<App />);
      
      const select = screen.getByRole('combobox');
      const addButton = screen.getByText('Add to Cart');
      
      // 키보드 10개 추가 (10% 할인)
      await user.selectOptions(select, 'p1');
      for (let i = 0; i < 10; i++) {
        await user.click(addButton);
      }
      
      // 할인된 가격 확인 (10,000원 * 10개 * 0.9 = 90,000원)
      expect(screen.getByText('₩90,000')).toBeInTheDocument();
    });

    it('30개 이상 구매 시 전체 할인이 적용되어야 함', async () => {
      render(<App />);
      
      const select = screen.getByRole('combobox');
      const addButton = screen.getByText('Add to Cart');
      
      // 키보드 30개 추가 (25% 할인)
      await user.selectOptions(select, 'p1');
      for (let i = 0; i < 30; i++) {
        await user.click(addButton);
      }
      
      // 할인된 가격 확인 (10,000원 * 30개 * 0.75 = 225,000원)
      expect(screen.getByText('₩225,000')).toBeInTheDocument();
    });
  });

  describe('6. 포인트 적립', () => {
    it('구매 시 포인트가 적립되어야 함', async () => {
      render(<App />);
      
      const select = screen.getByRole('combobox');
      const addButton = screen.getByText('Add to Cart');
      
      // 상품 추가
      await user.selectOptions(select, 'p1');
      await user.click(addButton);
      
      // 포인트 적립 확인 (10,000원 * 0.001 = 10p)
      expect(screen.getByText('적립 포인트: 10p')).toBeInTheDocument();
    });

    it('키보드+마우스 세트 구매 시 추가 포인트가 적립되어야 함', async () => {
      render(<App />);
      
      const select = screen.getByRole('combobox');
      const addButton = screen.getByText('Add to Cart');
      
      // 키보드 추가
      await user.selectOptions(select, 'p1');
      await user.click(addButton);
      
      // 마우스 추가
      await user.selectOptions(select, 'p2');
      await user.click(addButton);
      
      // 추가 포인트 확인 (기본 30p + 세트 보너스 50p = 80p)
      expect(screen.getByText('적립 포인트: 80p')).toBeInTheDocument();
    });
  });

  describe('7. 실시간 계산', () => {
    it('수량 변경 시 즉시 총액이 재계산되어야 함', async () => {
      render(<App />);
      
      const select = screen.getByRole('combobox');
      const addButton = screen.getByText('Add to Cart');
      
      // 상품 추가
      await user.selectOptions(select, 'p1');
      await user.click(addButton);
      
      // 초기 총액 확인
      expect(screen.getByText('₩10,000')).toBeInTheDocument();
      
      // 수량 증가
      const increaseButton = screen.getByText('+');
      await user.click(increaseButton);
      
      // 총액이 업데이트되었는지 확인
      expect(screen.getByText('₩20,000')).toBeInTheDocument();
    });
  });

  describe('8. 도움말 모달', () => {
    it('도움말 버튼 클릭 시 모달이 표시되어야 함', async () => {
      render(<App />);
      
      // 도움말 버튼 찾기 (SVG 아이콘을 포함한 버튼)
      const helpButton = screen.getByRole('button', { name: /help/i });
      await user.click(helpButton);
      
      // 모달 내용 확인
      expect(screen.getByText('📖 이용 안내')).toBeInTheDocument();
      expect(screen.getByText('💰 할인 정책')).toBeInTheDocument();
      expect(screen.getByText('🎁 포인트 적립')).toBeInTheDocument();
    });
  });

  describe('9. 재고 관리', () => {
    it('재고가 부족한 상품은 경고가 표시되어야 함', async () => {
      render(<App />);
      
      const select = screen.getByRole('combobox');
      const addButton = screen.getByText('Add to Cart');
      
      // 스피커(재고 10개)를 6개 추가하여 재고를 4개로 만듦
      await user.selectOptions(select, 'p5');
      for (let i = 0; i < 6; i++) {
        await user.click(addButton);
      }
      
      // 재고 부족 경고 확인
      expect(screen.getByText(/재고 부족/)).toBeInTheDocument();
      expect(screen.getByText(/4개 남음/)).toBeInTheDocument();
    });
  });

  describe('10. 복잡한 시나리오', () => {
    it('여러 상품을 조합해서 구매할 수 있어야 함', async () => {
      render(<App />);
      
      const select = screen.getByRole('combobox');
      const addButton = screen.getByText('Add to Cart');
      
      // 키보드 5개
      await user.selectOptions(select, 'p1');
      for (let i = 0; i < 5; i++) {
        await user.click(addButton);
      }
      
      // 마우스 3개
      await user.selectOptions(select, 'p2');
      for (let i = 0; i < 3; i++) {
        await user.click(addButton);
      }
      
      // 모니터암 2개
      await user.selectOptions(select, 'p3');
      for (let i = 0; i < 2; i++) {
        await user.click(addButton);
      }
      
      // 총 10개 상품이 장바구니에 있는지 확인
      expect(screen.getByText('🛍️ 10 items in cart')).toBeInTheDocument();
      
      // 각 상품이 올바르게 표시되는지 확인
      expect(screen.getByText('버그 없애는 키보드')).toBeInTheDocument();
      expect(screen.getByText('생산성 폭발 마우스')).toBeInTheDocument();
      expect(screen.getByText('거북목 탈출 모니터암')).toBeInTheDocument();
    });
  });
}); 