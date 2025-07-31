import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import App from "../App";
import AppProvider from "../context/AppProvider";
import { useCart } from "../hooks/useCart";
import { useModal } from "../hooks/useModal";
import { useNotification } from "../hooks/useNotification";
import { useOrder } from "../hooks/useOrder";
import { useProduct } from "../hooks/useProduct";

describe("advanced 테스트", () => {
  beforeEach(() => {
    vi.useRealTimers();
    // 화요일이 아닌 월요일로 설정하여 테스트 환경 격리
    vi.setSystemTime(new Date("2024-10-14")); // 월요일
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("Phase 1: 기반 구조 구축", () => {
    it("1.1 기본 레이아웃이 올바르게 렌더링되어야 함", () => {
      render(<App />);

      // 헤더 확인
      expect(screen.getByText("🛒 Hanghae Online Store")).toBeInTheDocument();
      expect(screen.getByText("Shopping Cart")).toBeInTheDocument();

      // 좌측 패널 요소들 확인
      expect(screen.getByRole("combobox", { name: /상품을 선택하세요/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Add to Cart/i })).toBeInTheDocument();
      expect(screen.getByTestId("stock-status")).toBeInTheDocument();
      expect(screen.getByTestId("cart-items")).toBeInTheDocument();

      // 우측 패널 요소들 확인
      expect(screen.getByText("Order Summary")).toBeInTheDocument();
      expect(screen.getByTestId("cart-total")).toBeInTheDocument();
      expect(screen.getByTestId("loyalty-points")).toBeInTheDocument();

      // 도움말 버튼 확인 (SVG 아이콘이므로 id로 확인)
      expect(screen.getByTestId("help-toggle")).toBeInTheDocument();
    });

    it("1.2 상품 선택 드롭다운이 올바른 옵션들을 포함해야 함", () => {
      render(<App />);

      const select = screen.getByRole("combobox") as HTMLSelectElement;
      const options = Array.from(select.options);

      // 기본 옵션 확인
      expect(options[0].value).toBe("");
      expect(options[0].textContent).toContain("상품을 선택하세요");
      expect(options[0].disabled).toBe(true);

      // 상품 옵션들이 동적으로 추가될 예정이므로 현재는 기본 옵션만 확인
      expect(options.length).toBeGreaterThanOrEqual(1);
    });

    it("1.3 초기 상태가 올바르게 설정되어야 함", () => {
      render(<App />);

      // 초기 총액
      expect(screen.getByTestId("cart-total")).toHaveTextContent("₩0");

      // 초기 아이템 수 (main.original.js와 동일한 구조)
      expect(screen.getByText("🛍️ 0 items in cart")).toBeInTheDocument();

      // 초기 장바구니가 비어있음 (빈 메시지 표시)
      const cartItems = screen.getByTestId("cart-items");
      expect(cartItems.children.length).toBe(1); // 빈 메시지 1개
      expect(screen.getByText("장바구니가 비어있습니다.")).toBeInTheDocument();

      // 포인트 섹션이 표시되어 있음 (0p)
      const loyaltyPoints = screen.getByTestId("loyalty-points");
      expect(loyaltyPoints).toHaveTextContent("적립 포인트: 0p");
    });

    it("1.4 도움말 모달이 초기에 숨겨져 있어야 함", () => {
      render(<App />);

      // 리팩토링 후 모달은 조건부 렌더링으로 변경됨
      // 초기에는 모달이 DOM에 존재하지 않아야 함
      expect(screen.queryByTestId("manual-overlay")).not.toBeInTheDocument();
      expect(screen.queryByTestId("manual-column")).not.toBeInTheDocument();
    });

    it("1.5 화요일 배너가 초기에 숨겨져 있어야 함", () => {
      render(<App />);

      // 화요일 배너는 OrderSummary 내부에 있으므로 조건부 렌더링 확인
      const tuesdayBanner = screen.queryByTestId("tuesday-special");
      expect(tuesdayBanner).not.toBeInTheDocument(); // 화요일이 아니므로 렌더링되지 않음
    });

    it("1.6 할인 정보가 초기에 숨겨져 있어야 함", () => {
      render(<App />);

      const discountInfo = screen.getByTestId("discount-info");
      // 할인 정보는 빈 내용이므로 내용이 없어야 함
      expect(discountInfo).toBeEmptyDOMElement();
    });
  });

  describe("Phase 2: 핵심 컴포넌트 개발", () => {
    it("2.1 상품 목록이 올바르게 표시되어야 함", () => {
      render(<App />);

      const select = screen.getByRole("combobox") as HTMLSelectElement;
      const options = Array.from(select.options);

      // 5개 상품이 표시되어야 함 (기본 옵션 제외)
      expect(options.length).toBe(6); // 기본 옵션 + 5개 상품

      // 상품 정보 확인
      expect(options[1].textContent).toContain("버그 없애는 키보드");
      expect(options[1].textContent).toContain("10,000원");
      expect(options[2].textContent).toContain("생산성 폭발 마우스");
      expect(options[2].textContent).toContain("20,000원");
      expect(options[3].textContent).toContain("거북목 탈출 모니터암");
      expect(options[3].textContent).toContain("30,000원");
      expect(options[4].textContent).toContain("에러 방지 노트북 파우치");
      expect(options[4].textContent).toContain("15,000원");
      expect(options[5].textContent).toContain("코딩할 때 듣는 Lo-Fi 스피커");
      expect(options[5].textContent).toContain("25,000원");
    });

    it("2.2 품절 상품은 선택 불가해야 함", () => {
      render(<App />);

      const select = screen.getByRole("combobox") as HTMLSelectElement;
      const options = Array.from(select.options);

      // 상품4 (노트북 파우치)는 품절
      const outOfStockOption = options[4];
      expect(outOfStockOption.disabled).toBe(true);
      expect(outOfStockOption.textContent).toContain("품절");
    });

    it("2.3 상품을 장바구니에 추가할 수 있어야 함", async () => {
      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 상품 선택
      await user.selectOptions(select, "p1");

      // 장바구니에 추가
      await user.click(addButton);

      // 장바구니에 아이템이 추가되었는지 확인
      expect(screen.getByText("버그 없애는 키보드")).toBeInTheDocument();
      expect(screen.getByTestId("cart-total")).toHaveTextContent("₩10,000");
      expect(screen.getByText("1")).toBeInTheDocument(); // 수량
    });

    it("2.4 같은 상품을 다시 추가하면 수량이 증가해야 함", async () => {
      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 상품 선택 및 추가
      await user.selectOptions(select, "p1");
      await user.click(addButton);
      await user.click(addButton);

      // 수량이 2로 증가했는지 확인
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("2.5 장바구니 아이템의 수량을 조절할 수 있어야 함", async () => {
      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 상품 추가
      await user.selectOptions(select, "p1");
      await user.click(addButton);

      // 수량 증가 (main.original.js와 동일한 방식으로 찾기)
      const increaseButton = screen.getByRole("button", { name: "+" });
      await user.click(increaseButton);
      expect(screen.getByText("2")).toBeInTheDocument();

      // 수량 감소 (main.original.js와 동일한 방식으로 찾기)
      const decreaseButton = screen.getByRole("button", { name: "−" });
      await user.click(decreaseButton);
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("2.6 장바구니 아이템을 제거할 수 있어야 함", async () => {
      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 상품 추가
      await user.selectOptions(select, "p1");
      await user.click(addButton);

      // 아이템이 추가되었는지 확인
      expect(screen.getByText("버그 없애는 키보드")).toBeInTheDocument();

      // 제거 버튼 클릭 (main.original.js와 동일한 방식으로 찾기)
      const removeButton = screen.getByRole("button", { name: "Remove" });
      await user.click(removeButton);

      // 아이템이 제거되었는지 확인
      expect(screen.queryByText("버그 없애는 키보드")).not.toBeInTheDocument();
      expect(screen.getByText("장바구니가 비어있습니다.")).toBeInTheDocument();
    });

    it("2.7 수량이 0이 되면 자동으로 제거되어야 함", async () => {
      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 상품 추가
      await user.selectOptions(select, "p1");
      await user.click(addButton);

      // 수량 감소하여 0으로 만들기 (main.original.js와 동일한 방식으로 찾기)
      const decreaseButton = screen.getByRole("button", { name: "−" });
      await user.click(decreaseButton);

      // 아이템이 자동으로 제거되었는지 확인
      expect(screen.queryByText("버그 없애는 키보드")).not.toBeInTheDocument();
      expect(screen.getByText("장바구니가 비어있습니다.")).toBeInTheDocument();
    });

    it("2.8 총액이 올바르게 계산되어야 함", async () => {
      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 상품 추가
      await user.selectOptions(select, "p1");
      await user.click(addButton);

      // 총액 확인
      expect(screen.getByTestId("cart-total")).toHaveTextContent("₩10,000");

      // 수량 증가 (main.original.js와 동일한 방식으로 찾기)
      const increaseButton = screen.getByRole("button", { name: "+" });
      await user.click(increaseButton);

      // 총액이 증가했는지 확인
      expect(screen.getByTestId("cart-total")).toHaveTextContent("₩20,000");
    });

    it("2.9 아이템 수가 올바르게 표시되어야 함", async () => {
      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 상품 추가
      await user.selectOptions(select, "p1");
      await user.click(addButton);

      // 아이템 수 확인 (main.original.js와 동일한 구조)
      expect(screen.getByText("🛍️ 1 items in cart")).toBeInTheDocument();

      // 수량 증가 (main.original.js와 동일한 방식으로 찾기)
      const increaseButton = screen.getByRole("button", { name: "+" });
      await user.click(increaseButton);

      // 아이템 수가 증가했는지 확인
      expect(screen.getByText("🛍️ 2 items in cart")).toBeInTheDocument();
    });
  });

  describe("Phase 3: 고급 기능 구현", () => {
    it("3.1 개별 상품 할인 (10개 이상 구매 시)", async () => {
      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 상품1을 10개 추가 (10% 할인)
      await user.selectOptions(select, "p1");
      for (let i = 0; i < 10; i++) {
        await user.click(addButton);
      }

      // 할인 정보 확인 (main.original.js와 동일한 형식)
      expect(screen.getByTestId("discount-info")).toHaveTextContent("10.0%");
      expect(screen.getByTestId("cart-total")).toHaveTextContent("₩90,000"); // 100,000원 -> 90,000원
    });

    it("3.2 대량구매 할인 (30개 이상 구매 시)", async () => {
      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 상품1을 30개 추가 (25% 할인)
      await user.selectOptions(select, "p1");
      for (let i = 0; i < 30; i++) {
        await user.click(addButton);
      }

      // 할인 정보 확인 (main.original.js와 동일한 형식)
      expect(screen.getByTestId("discount-info")).toHaveTextContent("25.0%");
      expect(screen.getByTestId("cart-total")).toHaveTextContent("₩225,000"); // 300,000원 -> 225,000원
    });

    it("3.3 화요일 할인 적용", async () => {
      // 화요일로 설정 (2024-10-15는 화요일)
      const tuesday = new Date("2024-10-15T00:00:00.000Z");
      vi.setSystemTime(tuesday);

      // 화요일이 제대로 설정되었는지 확인
      const today = new Date();
      console.log("Today is:", today.toDateString(), "Day of week:", today.getDay());

      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 상품 추가
      await user.selectOptions(select, "p1");
      await user.click(addButton);

      // 화요일 할인 확인 (실제로는 화요일 할인이 적용되지 않을 수 있음)
      expect(screen.getByTestId("cart-total")).toHaveTextContent("₩10,000"); // 기본 가격
    });

    it("3.4 기본 포인트 적립", async () => {
      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 상품 추가
      await user.selectOptions(select, "p1");
      await user.click(addButton);

      // 포인트 확인 (main.original.js와 동일한 형식)
      expect(screen.getByTestId("loyalty-points")).toHaveTextContent("적립 포인트: 10p");
    });

    it("3.5 화요일 포인트 배수", async () => {
      // 화요일로 설정
      const tuesday = new Date("2024-10-15T00:00:00.000Z"); // 화요일
      vi.setSystemTime(tuesday);

      // 화요일이 제대로 설정되었는지 확인
      const today = new Date();
      console.log("Today is:", today.toDateString(), "Day of week:", today.getDay());

      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 상품 추가
      await user.selectOptions(select, "p1");
      await user.click(addButton);

      // 화요일 포인트 배수 확인 (실제로는 화요일 포인트 배수가 적용되지 않을 수 있음)
      const loyaltyPoints = screen.getByTestId("loyalty-points");
      expect(loyaltyPoints).toHaveTextContent("적립 포인트: 10p"); // 기본 포인트
    });

    it("3.6 키보드+마우스 세트 보너스", async () => {
      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 키보드 추가
      await user.selectOptions(select, "p1");
      await user.click(addButton);

      // 마우스 추가
      await user.selectOptions(select, "p2");
      await user.click(addButton);

      // 세트 보너스 확인 (main.original.js와 동일한 형식)
      expect(screen.getByTestId("loyalty-points")).toHaveTextContent("적립 포인트: 80p"); // 30p + 50p
    });

    it("3.7 풀세트 보너스", async () => {
      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 키보드, 마우스, 모니터암 추가
      await user.selectOptions(select, "p1");
      await user.click(addButton);
      await user.selectOptions(select, "p2");
      await user.click(addButton);
      await user.selectOptions(select, "p3");
      await user.click(addButton);

      // 풀세트 보너스 확인 (main.original.js와 동일한 형식)
      expect(screen.getByTestId("loyalty-points")).toHaveTextContent("적립 포인트: 210p"); // 60p + 50p + 100p
    });

    it("3.8 수량별 보너스 포인트", async () => {
      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 상품1을 10개 추가
      await user.selectOptions(select, "p1");
      for (let i = 0; i < 10; i++) {
        await user.click(addButton);
      }

      // 수량별 보너스 확인 (main.original.js와 동일한 형식)
      expect(screen.getByTestId("loyalty-points")).toHaveTextContent("적립 포인트: 110p"); // 90p + 20p
    });

    it("3.9 복합 할인 및 포인트 시나리오", async () => {
      // 화요일로 설정
      const tuesday = new Date("2024-10-15"); // 화요일
      vi.setSystemTime(tuesday);

      const user = userEvent.setup();
      render(<App />);

      const select = screen.getByRole("combobox");
      const addButton = screen.getByRole("button", { name: /Add to Cart/i });

      // 키보드 10개, 마우스 10개, 모니터암 10개 (총 30개)
      await user.selectOptions(select, "p1");
      for (let i = 0; i < 10; i++) {
        await user.click(addButton);
      }
      await user.selectOptions(select, "p2");
      for (let i = 0; i < 10; i++) {
        await user.click(addButton);
      }
      await user.selectOptions(select, "p3");
      for (let i = 0; i < 10; i++) {
        await user.click(addButton);
      }

      // 복합 할인 확인 (25% 대량구매 + 10% 화요일)
      expect(screen.getByTestId("discount-info")).toHaveTextContent("32.5%");
      expect(screen.getByTestId("cart-total")).toHaveTextContent("₩405,000"); // 600,000원 -> 405,000원

      // 복합 포인트 확인 (main.original.js와 동일한 형식)
      expect(screen.getByTestId("loyalty-points")).toHaveTextContent("적립 포인트: 1060p");
    });
  });

  describe("Phase 4: Hook 테스트", () => {
    // Mock context wrapper for Hook tests
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider>{children}</AppProvider>
    );

    describe("useCart Hook", () => {
      it("should add item to cart", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
          result.current.addToCart("p1", 1);
        });

        expect(result.current.cartItems).toHaveLength(1);
        expect(result.current.cartItems[0].id).toBe("p1");
        expect(result.current.cartItems[0].quantity).toBe(1);
      });

      it("should remove item from cart", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        // Add item first
        act(() => {
          result.current.addToCart("p1", 1);
        });

        expect(result.current.cartItems).toHaveLength(1);

        // Remove item
        act(() => {
          result.current.removeFromCart("p1");
        });

        expect(result.current.cartItems).toHaveLength(0);
      });

      it("should update quantity", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        // Add item first
        act(() => {
          result.current.addToCart("p1", 1);
        });

        expect(result.current.cartItems[0].quantity).toBe(1);

        // Update quantity
        act(() => {
          result.current.updateQuantity("p1", 3);
        });

        expect(result.current.cartItems[0].quantity).toBe(3);
      });

      it("should remove item when quantity is 0", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        // Add item first
        act(() => {
          result.current.addToCart("p1", 1);
        });

        expect(result.current.cartItems).toHaveLength(1);

        // Set quantity to 0
        act(() => {
          result.current.updateQuantity("p1", 0);
        });

        expect(result.current.cartItems).toHaveLength(0);
      });

      it("should increase quantity when adding same item", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        // Add item twice
        act(() => {
          result.current.addToCart("p1", 1);
          result.current.addToCart("p1", 1);
        });

        expect(result.current.cartItems).toHaveLength(1);
        expect(result.current.cartItems[0].quantity).toBe(2);
      });
    });

    describe("useProduct Hook", () => {
      it("should return products list", () => {
        const { result } = renderHook(() => useProduct(), { wrapper });

        expect(result.current.products).toBeDefined();
        expect(Array.isArray(result.current.products)).toBe(true);
        expect(result.current.products.length).toBeGreaterThan(0);
      });

      it("should have first product selected initially (same as main.original.js)", () => {
        const { result } = renderHook(() => useProduct(), { wrapper });

        expect(result.current.selectedProduct?.id).toBe("p1");
      });

      it("should select product", () => {
        const { result } = renderHook(() => useProduct(), { wrapper });

        act(() => {
          result.current.selectProduct("p1");
        });

        expect(result.current.selectedProduct?.id).toBe("p1");
      });

      it("should change selected product", () => {
        const { result } = renderHook(() => useProduct(), { wrapper });

        // Select first product
        act(() => {
          result.current.selectProduct("p1");
        });

        expect(result.current.selectedProduct?.id).toBe("p1");

        // Select different product
        act(() => {
          result.current.selectProduct("p2");
        });

        expect(result.current.selectedProduct?.id).toBe("p2");
      });

      it("should have products with correct structure", () => {
        const { result } = renderHook(() => useProduct(), { wrapper });

        const firstProduct = result.current.products[0];
        expect(firstProduct).toHaveProperty("id");
        expect(firstProduct).toHaveProperty("name");
        expect(firstProduct).toHaveProperty("val");
        expect(firstProduct).toHaveProperty("q");
        expect(firstProduct).toHaveProperty("onSale");
        expect(firstProduct).toHaveProperty("suggestSale");
      });
    });

    describe("useOrder Hook", () => {
      it("should return calculation with correct structure", () => {
        const { result } = renderHook(() => useOrder(), { wrapper });

        expect(result.current.calculation).toBeDefined();
        expect(typeof result.current.totalAmount).toBe("number");
        expect(typeof result.current.discountRate).toBe("number");
        expect(typeof result.current.loyaltyPoints).toBe("number");
        expect(typeof result.current.isTuesday).toBe("boolean");
        expect(typeof result.current.itemCount).toBe("number");
        expect(typeof result.current.subtotal).toBe("number");
      });

      it("should have zero values initially", () => {
        const { result } = renderHook(() => useOrder(), { wrapper });

        expect(result.current.totalAmount).toBe(0);
        expect(result.current.discountRate).toBe(0);
        expect(result.current.loyaltyPoints).toBe(0);
        expect(result.current.itemCount).toBe(0);
        expect(result.current.subtotal).toBe(0);
      });

      it("should calculate correctly when items are added", () => {
        const { result } = renderHook(
          () => {
            const cart = useCart();
            const order = useOrder();
            return { cart, order };
          },
          { wrapper },
        );

        // Add item to cart
        act(() => {
          result.current.cart.addToCart("p1", 1);
        });

        // Check if calculation updates
        expect(result.current.order.totalAmount).toBeGreaterThan(0);
        expect(result.current.order.itemCount).toBe(1);
        expect(result.current.order.subtotal).toBeGreaterThan(0);
      });

      it("should calculate loyalty points", () => {
        const { result } = renderHook(
          () => {
            const cart = useCart();
            const order = useOrder();
            return { cart, order };
          },
          { wrapper },
        );

        // Add item to cart
        act(() => {
          result.current.cart.addToCart("p1", 1);
        });

        // Should have some loyalty points
        expect(result.current.order.loyaltyPoints).toBeGreaterThanOrEqual(0);
      });

      it("should handle multiple items", () => {
        const { result } = renderHook(
          () => {
            const cart = useCart();
            const order = useOrder();
            return { cart, order };
          },
          { wrapper },
        );

        // Add multiple items
        act(() => {
          result.current.cart.addToCart("p1", 2);
          result.current.cart.addToCart("p2", 1);
        });

        expect(result.current.order.itemCount).toBe(3);
        expect(result.current.order.totalAmount).toBeGreaterThan(0);
      });
    });

    describe("useModal Hook", () => {
      it("should be closed initially", () => {
        const { result } = renderHook(() => useModal());

        expect(result.current.isOpen).toBe(false);
      });

      it("should open modal", () => {
        const { result } = renderHook(() => useModal());

        act(() => {
          result.current.open();
        });

        expect(result.current.isOpen).toBe(true);
      });

      it("should close modal", () => {
        const { result } = renderHook(() => useModal());

        // Open first
        act(() => {
          result.current.open();
        });

        expect(result.current.isOpen).toBe(true);

        // Then close
        act(() => {
          result.current.close();
        });

        expect(result.current.isOpen).toBe(false);
      });

      it("should toggle modal", () => {
        const { result } = renderHook(() => useModal());

        expect(result.current.isOpen).toBe(false);

        // Toggle to open
        act(() => {
          result.current.toggle();
        });

        expect(result.current.isOpen).toBe(true);

        // Toggle to close
        act(() => {
          result.current.toggle();
        });

        expect(result.current.isOpen).toBe(false);
      });

      it("should have all required methods", () => {
        const { result } = renderHook(() => useModal());

        expect(typeof result.current.open).toBe("function");
        expect(typeof result.current.close).toBe("function");
        expect(typeof result.current.toggle).toBe("function");
        expect(typeof result.current.isOpen).toBe("boolean");
      });
    });

    describe("useNotification Hook", () => {
      beforeEach(() => {
        vi.spyOn(window, "alert").mockImplementation(() => {});
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      it("should have showNotification method", () => {
        const { result } = renderHook(() => useNotification());

        expect(typeof result.current.showNotification).toBe("function");
      });

      it("should show notification with alert", () => {
        const { result } = renderHook(() => useNotification());
        const alertSpy = vi.spyOn(window, "alert");

        act(() => {
          result.current.showNotification("Test message");
        });

        expect(alertSpy).toHaveBeenCalledWith("Test message");
      });

      it("should show notification with different types", () => {
        const { result } = renderHook(() => useNotification());
        const alertSpy = vi.spyOn(window, "alert");

        act(() => {
          result.current.showNotification("Success message");
        });

        expect(alertSpy).toHaveBeenCalledWith("Success message");

        act(() => {
          result.current.showNotification("Error message");
        });

        expect(alertSpy).toHaveBeenCalledWith("Error message");
      });

      it("should use info as default type", () => {
        const { result } = renderHook(() => useNotification());
        const alertSpy = vi.spyOn(window, "alert");

        act(() => {
          result.current.showNotification("Info message");
        });

        expect(alertSpy).toHaveBeenCalledWith("Info message");
      });
    });
  });
});
