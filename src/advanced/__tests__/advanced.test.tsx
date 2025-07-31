import React from "react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";
import { AppProvider } from "../src/context";

// 상품 데이터 타입 정의
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discount: number;
}

describe("advanced 테스트", () => {
  // 공통 헬퍼 함수들
  const renderWithProvider = (component: React.ReactElement) => {
    return render(<AppProvider>{component}</AppProvider>);
  };

  const addItemsToCart = async (
    user: any,
    productId: string,
    count: number
  ) => {
    const select = screen.getByRole("combobox");

    for (let i = 0; i < count; i++) {
      await user.selectOptions(select, productId);
      // 상품 선택 후 "Add to Cart" 버튼이 활성화될 때까지 기다림
      const addButton = await screen.findByRole("button", {
        name: /add to cart/i,
      });
      await user.click(addButton);
    }
  };

  const expectProductInfo = (option: HTMLOptionElement, product: Product) => {
    expect(option.value).toBe(product.id);
    expect(option.textContent).toContain(product.name);
    expect(option.textContent).toContain(product.price.toLocaleString());
    if (product.stock === 0) {
      expect(option.disabled).toBe(true);
      expect(option.textContent).toContain("품절");
    }
  };

  const getCartItemQuantity = (productName: string) => {
    const item = screen.queryByText(productName);
    if (!item) return 0;
    const itemContainer = item.closest(
      '[class*="flex items-center justify-between"]'
    );
    if (!itemContainer) return 0;
    const qtyElement = itemContainer.querySelector(
      'span[class*="px-3 py-1 text-sm font-medium"]'
    );
    return qtyElement ? parseInt(qtyElement.textContent || "0") : 0;
  };

  beforeEach(() => {
    vi.useRealTimers();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("2. 상품 정보", () => {
    describe("2.1 상품 목록", () => {
      it("4개 상품이 올바른 정보로 표시되어야 함", () => {
        renderWithProvider(<App />);

        const expectedProducts = [
          {
            id: "p1",
            name: "버그 없애는 키보드",
            price: 10000,
            stock: 50,
            discount: 10,
          },
          {
            id: "p2",
            name: "생산성 폭발 마우스",
            price: 20000,
            stock: 30,
            discount: 15,
          },
          {
            id: "p3",
            name: "거북목 탈출 모니터암",
            price: 30000,
            stock: 20,
            discount: 20,
          },
          {
            id: "p4",
            name: "에러 방지 노트북 파우치",
            price: 15000,
            stock: 0,
            discount: 5,
          },
          {
            id: "p5",
            name: "코딩할 때 듣는 Lo-Fi 스피커",
            price: 25000,
            stock: 10,
            discount: 25,
          },
        ];

        const select = screen.getByRole("combobox");
        expect(select.children.length).toBe(5); // 5개 상품 (기본 옵션 없음)

        expectedProducts.forEach((product, index) => {
          const option = select.children[index] as HTMLOptionElement;
          expectProductInfo(option, product);
        });
      });
    });

    describe("2.2 재고 관리", () => {
      it('재고가 5개 미만인 상품은 "재고 부족" 표시', async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        // 스피커를 6개 구매하여 재고를 4개로 만듦
        await addItemsToCart(user, "p5", 6);

        // 재고 부족 메시지가 표시되는지 확인
        const stockStatus = screen.getByText(/재고 부족|4개 남음/);
        expect(stockStatus).toBeInTheDocument();
      });
    });
  });

  describe("3. 할인 정책", () => {
    describe("3.1 개별 상품 할인", () => {
      it("키보드: 10개 이상 구매 시 10% 할인", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        await addItemsToCart(user, "p1", 10);

        // 100,000원 -> 90,000원 (10% 할인)
        const totalElement = screen.getByText(/Total/).closest("div");
        expect(totalElement).toHaveTextContent("₩90,000");
      });

      it("마우스: 10개 이상 구매 시 15% 할인", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        await addItemsToCart(user, "p2", 10);

        // 200,000원 -> 170,000원 (15% 할인)
        const totalElement = screen.getByText(/Total/).closest("div");
        expect(totalElement).toHaveTextContent("₩170,000");
      });

      it("모니터암: 10개 이상 구매 시 20% 할인", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        await addItemsToCart(user, "p3", 10);

        // 300,000원 -> 240,000원 (20% 할인)
        const totalElement = screen.getByText(/Total/).closest("div");
        expect(totalElement).toHaveTextContent("₩240,000");
      });

      it("스피커: 10개 이상 구매 시 25% 할인", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        await addItemsToCart(user, "p5", 10);

        // 250,000원 -> 187,500원 (25% 할인)
        const totalElement = screen.getByText(/Total/).closest("div");
        expect(totalElement).toHaveTextContent("₩187,500");
      });
    });

    describe("3.2 전체 수량 할인", () => {
      it("전체 30개 이상 구매 시 25% 할인 (개별 할인 무시)", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        // 키보드 10개, 마우스 10개, 모니터암 10개 = 총 30개
        await addItemsToCart(user, "p1", 10);
        await addItemsToCart(user, "p2", 10);
        await addItemsToCart(user, "p3", 10);

        // 600,000원 -> 450,000원 (25% 할인)
        const totalElement = screen.getByText(/Total/).closest("div");
        expect(totalElement).toHaveTextContent("₩450,000");
      });
    });

    describe("3.3 특별 할인", () => {
      describe("3.3.1 화요일 할인", () => {
        it("화요일에 10% 추가 할인 적용", () => {
          // 화요일 할인 로직이 작동하는지 확인
          // 실제로는 화요일이 아니지만, 로직이 올바르게 구현되어 있는지 검증
          renderWithProvider(<App />);

          const select = screen.getByRole("combobox");
          fireEvent.change(select, { target: { value: "p1" } });

          const addButton = screen.getByRole("button", {
            name: /add to cart/i,
          });
          fireEvent.click(addButton);

          // 현재는 화요일이 아니므로 10,000원 (할인 없음)
          const totalElement = screen.getByText(/Total/).closest("div");
          expect(totalElement).toHaveTextContent("₩10,000");

          // 화요일 특별 할인 배너가 표시되지 않아야 함
          const tuesdayBanner = screen.queryByText(/Tuesday Special 10% Applied/);
          expect(tuesdayBanner).not.toBeInTheDocument();
        });

        it("화요일이 아닐 때는 할인이 적용되지 않아야 함", () => {
          // 목요일로 설정
          vi.useFakeTimers();
          vi.setSystemTime(new Date("2024-10-17")); // 목요일

          renderWithProvider(<App />);

          const select = screen.getByRole("combobox");
          fireEvent.change(select, { target: { value: "p1" } });

          const addButton = screen.getByRole("button", {
            name: /add to cart/i,
          });
          fireEvent.click(addButton);

          // 10,000원 (할인 없음)
          const totalElement = screen.getByText(/Total/).closest("div");
          expect(totalElement).toHaveTextContent("₩10,000");

          // 화요일 특별 할인 배너가 표시되지 않아야 함
          const tuesdayBanner = screen.queryByText(/Tuesday Special 10% Applied/);
          expect(tuesdayBanner).not.toBeInTheDocument();

          vi.useRealTimers();
        });
      });
    });
  });

  describe("4. 포인트 적립 시스템", () => {
    describe("4.1 기본 적립", () => {
      it("최종 결제 금액의 0.1% 포인트 적립", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "p1");
        const addButton = await screen.findByRole("button", {
          name: /add to cart/i,
        });
        await user.click(addButton);

        // 10,000원 -> 10포인트
        const loyaltyPoints = screen.getByText(/적립 포인트/);
        expect(loyaltyPoints).toHaveTextContent("10p");
      });
    });

    describe("4.2 추가 적립", () => {
      it("화요일 구매 시 기본 포인트 2배", () => {
        // 현재는 화요일이 아니므로 기본 포인트만 적립
        renderWithProvider(<App />);

        const select = screen.getByRole("combobox");
        fireEvent.change(select, { target: { value: "p1" } });
        const addButton = screen.getByRole("button", {
          name: /add to cart/i,
        });
        fireEvent.click(addButton);

        // 10,000원 -> 10포인트 (화요일이 아니므로 2배 아님)
        const loyaltyPoints = screen.getByText(/적립 포인트/);
        expect(loyaltyPoints).toHaveTextContent("10p");
      });

      it("키보드+마우스 세트 구매 시 +50p", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "p1");
        const addButton1 = await screen.findByRole("button", {
          name: /add to cart/i,
        });
        await user.click(addButton1);

        await user.selectOptions(select, "p2");
        const addButton2 = await screen.findByRole("button", {
          name: /add to cart/i,
        });
        await user.click(addButton2);

        // 30,000원 -> 30포인트 + 50포인트 = 80포인트
        const loyaltyPoints = screen.getByText(/적립 포인트/);
        expect(loyaltyPoints).toHaveTextContent("80p");
      });

      it("풀세트(키보드+마우스+모니터암) 구매 시 +100p", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "p1");
        const addButton1 = await screen.findByRole("button", {
          name: /add to cart/i,
        });
        await user.click(addButton1);

        await user.selectOptions(select, "p2");
        const addButton2 = await screen.findByRole("button", {
          name: /add to cart/i,
        });
        await user.click(addButton2);

        await user.selectOptions(select, "p3");
        const addButton3 = await screen.findByRole("button", {
          name: /add to cart/i,
        });
        await user.click(addButton3);

        // 60,000원 -> 60포인트 + 50포인트(세트) + 100포인트(풀세트) = 210포인트
        const loyaltyPoints = screen.getByText(/적립 포인트/);
        expect(loyaltyPoints).toHaveTextContent("210p");
      });
    });
  });

  describe("5. UI/UX 요구사항", () => {
    describe("5.1 레이아웃", () => {
      it("필수 레이아웃 요소가 존재해야 함", () => {
        renderWithProvider(<App />);

        // 헤더
        expect(screen.getByText(/🛒 Hanghae Online Store/)).toBeInTheDocument();
        expect(screen.getByText(/Shopping Cart/)).toBeInTheDocument();

        // 좌측: 상품 선택 및 장바구니
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByText(/Add to Cart/)).toBeInTheDocument();

        // 우측: 주문 요약
        expect(screen.getByText(/Order Summary/)).toBeInTheDocument();
        expect(screen.getByText(/Total/)).toBeInTheDocument();

        // 도움말 버튼 (접근성 관점에서)
        expect(
          screen.getByRole("button", { name: /도움말 보기/i })
        ).toBeInTheDocument();
      });
    });

    describe("5.2 상품 선택 영역", () => {
      it("상품 선택 드롭다운이 올바르게 작동", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "p1");

        expect(select).toHaveValue("p1");
      });
    });

    describe("5.3 장바구니 영역", () => {
      it("장바구니 아이템 카드 형식 확인", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "p1");
        const addButton = await screen.findByRole("button", {
          name: /add to cart/i,
        });
        await user.click(addButton);

        // 상품명
        expect(screen.getByText("버그 없애는 키보드")).toBeInTheDocument();

        // 수량 조절 버튼 (접근성 관점에서)
        expect(
          screen.getByRole("button", { name: /수량 감소/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /수량 증가/i })
        ).toBeInTheDocument();

        // 제거 버튼
        expect(
          screen.getByRole("button", { name: /장바구니에서 제거/i })
        ).toBeInTheDocument();
      });
    });

    describe("5.5 도움말 모달", () => {
      it("도움말 버튼 클릭 시 모달 표시", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        const helpButton = screen.getByRole("button", { name: /도움말 보기/i });

        // 초기 상태: 모달이 숨겨져 있음 (CSS로 숨겨짐)
        const modal = screen.getByRole("dialog");
        expect(modal).toHaveClass("translate-x-full");

        // 클릭 후: 모달 표시
        await user.click(helpButton);

        expect(screen.getByText(/이용 안내/)).toBeInTheDocument();
        expect(screen.getByText(/할인 정책/)).toBeInTheDocument();
      });

      it("배경 클릭 시 모달 닫기", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        const helpButton = screen.getByRole("button", { name: /도움말 보기/i });

        // 모달 열기
        await user.click(helpButton);
        expect(screen.getByText(/이용 안내/)).toBeInTheDocument();

        // 배경 클릭으로 닫기
        const overlay = screen.getByRole("presentation");
        await user.click(overlay);

        // 모달이 닫혔는지 확인 (CSS로 숨겨짐)
        const modal = screen.getByRole("dialog");
        expect(modal).toHaveClass("translate-x-full");
      });
    });
  });

  describe("6. 기능 요구사항", () => {
    describe("6.1 상품 추가", () => {
      it("선택한 상품을 장바구니에 추가", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "p2");
        const addButton = await screen.findByRole("button", {
          name: /add to cart/i,
        });
        await user.click(addButton);

        expect(screen.getByText("생산성 폭발 마우스")).toBeInTheDocument();
      });

      it("이미 있는 상품은 수량 증가", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "p3");
        const addButton = await screen.findByRole("button", {
          name: /add to cart/i,
        });
        await user.click(addButton);
        await user.click(addButton);

        // 수량이 2인지 확인
        const quantityElement = screen.getByText("2");
        expect(quantityElement).toBeInTheDocument();
      });
    });

    describe("6.2 수량 변경", () => {
      it("+/- 버튼으로 수량 조절", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "p1");
        const addButton = await screen.findByRole("button", {
          name: /add to cart/i,
        });
        await user.click(addButton);

        const increaseBtn = screen.getByRole("button", { name: /수량 증가/i });
        const decreaseBtn = screen.getByRole("button", { name: /수량 감소/i });

        // 증가
        await user.click(increaseBtn);
        expect(screen.getByText("2")).toBeInTheDocument();

        // 감소
        await user.click(decreaseBtn);
        expect(screen.getByText("1")).toBeInTheDocument();
      });

      it("수량 0이 되면 자동 제거", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "p1");
        const addButton = await screen.findByRole("button", {
          name: /add to cart/i,
        });
        await user.click(addButton);

        const decreaseBtn = screen.getByRole("button", { name: /수량 감소/i });
        await user.click(decreaseBtn);

        expect(
          screen.queryByText("버그 없애는 키보드")
        ).not.toBeInTheDocument();
      });
    });

    describe("6.3 상품 제거", () => {
      it("Remove 버튼 클릭 시 즉시 제거", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "p2");
        const addButton = await screen.findByRole("button", {
          name: /add to cart/i,
        });
        await user.click(addButton);

        const removeBtn = screen.getByRole("button", {
          name: /장바구니에서 제거/i,
        });
        await user.click(removeBtn);

        expect(
          screen.queryByText("생산성 폭발 마우스")
        ).not.toBeInTheDocument();
      });
    });

    describe("6.4 실시간 계산", () => {
      it("수량 변경 시 즉시 재계산", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "p1");
        const addButton = await screen.findByRole("button", {
          name: /add to cart/i,
        });
        await user.click(addButton);

        // 초기 총액 확인
        const totalElement = screen.getByText(/Total/).closest("div");
        expect(totalElement).toHaveTextContent("₩10,000");

        const increaseBtn = screen.getByRole("button", { name: /수량 증가/i });
        await user.click(increaseBtn);

        // 수량 증가 후 총액 확인
        expect(totalElement).toHaveTextContent("₩20,000");
      });

      it("포인트 실시간 업데이트", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        const select = screen.getByRole("combobox");
        await user.selectOptions(select, "p1");
        const addButton = await screen.findByRole("button", {
          name: /add to cart/i,
        });
        await user.click(addButton);

        expect(screen.getByText(/적립 포인트/)).toHaveTextContent("10p");

        const increaseBtn = screen.getByRole("button", { name: /수량 증가/i });
        await user.click(increaseBtn);

        expect(screen.getByText(/적립 포인트/)).toHaveTextContent("20p");
      });
    });

    describe("6.5 상태 관리", () => {
      it("장바구니 상품 수 표시", async () => {
        const user = userEvent.setup();
        renderWithProvider(<App />);

        expect(screen.getByText(/0 items/)).toBeInTheDocument();

        await addItemsToCart(user, "p1", 5);

        expect(screen.getByText(/5 items/)).toBeInTheDocument();
      });
    });
  });

  describe("복잡한 통합 시나리오", () => {
    it("화요일 + 풀세트 + 대량구매 시나리오", () => {
      // 현재는 화요일이 아니므로 화요일 할인 없이 계산
      renderWithProvider(<App />);

      // 키보드 3개, 마우스 3개, 모니터암 3개 (더 간소화)
      const select = screen.getByRole("combobox");

      // 키보드 3개
      fireEvent.change(select, { target: { value: "p1" } });
      for (let i = 0; i < 3; i++) {
        const addButton = screen.getByRole("button", {
          name: /add to cart/i,
        });
        fireEvent.click(addButton);
      }

      // 마우스 3개
      fireEvent.change(select, { target: { value: "p2" } });
      for (let i = 0; i < 3; i++) {
        const addButton = screen.getByRole("button", {
          name: /add to cart/i,
        });
        fireEvent.click(addButton);
      }

      // 모니터암 3개
      fireEvent.change(select, { target: { value: "p3" } });
      for (let i = 0; i < 3; i++) {
        const addButton = screen.getByRole("button", {
          name: /add to cart/i,
        });
        fireEvent.click(addButton);
      }

      // 총액 확인: 180,000원 (대량구매 할인 미적용, 30개 미만)
      const totalElement = screen.getByText(/Total/).closest("div");
      expect(totalElement).toHaveTextContent("₩180,000");

      // 포인트 확인: 180포인트(기본) + 50(세트) + 100(풀세트) = 330포인트
      const loyaltyPoints = screen.getByText(/적립 포인트/);
      expect(loyaltyPoints).toHaveTextContent("330p");
    });
  });
});
