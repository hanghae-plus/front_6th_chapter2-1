// components
import { createHeader } from "./components/Header.js";
import { createProductSelector } from "./components/ProductSelector.js";
import { createOrderSummary } from "./components/OrderSummary.js";
import { createManualSystem } from "./components/Manual.js";
import { createLayoutSystem } from "./components/Layout.js";
import { createCartDisplay } from "./components/CartDisplay.js";

// services
import { CartService } from "./services/cartService.js";
import { TimerService } from "./services/timerService.js";
import { ProductService } from "./services/productService.js";
import { OrderService } from "./services/orderService.js";
import { discountService } from "./services/discountService.js";
import { ServiceManager } from "./services/serviceManager.js";

// events
import { uiEventBus } from "./core/eventBus.js";
import { CartEventListeners } from "./events/listeners/cartListeners.js";
import { ProductEventListeners } from "./events/listeners/productListeners.js";
import { OrderEventListeners } from "./events/listeners/orderListeners.js";

// Event Bus 이벤트 리스너 초기화
function initEventBusListeners(serviceManager) {
  const { productService, cartService, orderService } = serviceManager.getAllServices();

  // 각 컴포넌트별 이벤트 리스너 초기화
  new CartEventListeners(uiEventBus, cartService, discountService);
  new ProductEventListeners(uiEventBus, productService);
  new OrderEventListeners(uiEventBus, orderService);
}

async function main() {
  const root = document.getElementById("app");

  // Service Manager 초기화
  const serviceManager = new ServiceManager();

  // Service 등록
  serviceManager.register("product", new ProductService());
  serviceManager.register("cart", new CartService());
  serviceManager.register("order", new OrderService());
  serviceManager.register("discount", discountService);

  const { productService, cartService } = serviceManager.getAllServices();

  const header = createHeader({ itemCount: 0 });

  // Layout 시스템 생성
  const layout = createLayoutSystem();
  const { gridContainer, leftColumn, rightColumn } = layout;

  // ProductSelector 컴포넌트 생성
  const selectorContainer = createProductSelector({
    products: productService.getProducts(),
    discountInfos: calculateProductDiscountInfos(productService.getProducts()),
    onAddToCart: () => {
      // CartService를 통해 장바구니 추가 요청
      cartService.addToCart();
    },
  });

  const cartDisplay = createCartDisplay();

  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisplay);

  // OrderSummary 컴포넌트 생성
  const orderSummary = createOrderSummary();

  rightColumn.appendChild(orderSummary);

  // Manual 시스템 생성
  const manualSystem = createManualSystem();
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualSystem.toggle);
  root.appendChild(manualSystem.overlay);

  // Event Bus 이벤트 리스너 등록
  initEventBusListeners(serviceManager);

  // Service 초기화
  await serviceManager.initializeAll();

  // 타이머 서비스 초기화 및 시작
  const timerService = new TimerService(productService, cartDisplay);
  timerService.startLightningSaleTimer();
  timerService.startSuggestSaleTimer();
}

// 헬퍼 함수
function calculateProductDiscountInfos(products) {
  return products.map(product => ({
    productId: product.id,
    rate: discountService.calculateProductDiscountRate(product),
    status: discountService.getProductDiscountStatus(product),
  }));
}

main();
