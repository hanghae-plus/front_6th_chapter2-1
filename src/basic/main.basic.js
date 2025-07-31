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
import { DiscountService } from "./services/discountService.js";
import { ServiceManager } from "./core/serviceManager.js";

// events
import { uiEventBus } from "./core/eventBus.js";
import { CartEventListeners } from "./events/listeners/cartListeners.js";
import { ProductEventListeners } from "./events/listeners/productListeners.js";
import { OrderEventListeners } from "./events/listeners/orderListeners.js";

// Event Bus 이벤트 리스너 초기화
function initEventBusListeners(serviceManager) {
  const { productService, cartService, orderService, discountService } = serviceManager.getAllServices();

  // 각 컴포넌트별 이벤트 리스너 초기화
  new CartEventListeners(uiEventBus, cartService, discountService, productService);
  new ProductEventListeners(uiEventBus, productService, discountService);
  new OrderEventListeners(uiEventBus, orderService);
}

function main() {
  const root = document.getElementById("app");

  // Service Manager 초기화
  const serviceManager = new ServiceManager();

  const discountService = new DiscountService();
  // Service 등록 (의존성 순서 고려)
  serviceManager.register("product", new ProductService(discountService));
  serviceManager.register("cart", new CartService());
  serviceManager.register("discount", discountService);

  // OrderService 생성 시 discountService 주입
  serviceManager.register("order", new OrderService(discountService));

  const { productService } = serviceManager.getAllServices();

  const header = createHeader({ itemCount: 0 });

  // Layout 시스템 생성
  const layout = createLayoutSystem();
  const { gridContainer, leftColumn, rightColumn } = layout;

  // ProductSelector 컴포넌트 생성
  const productsWithDiscounts = discountService.getProductsWithCurrentDiscounts(productService.getProducts());
  const selectorContainer = createProductSelector({
    products: productsWithDiscounts,
    discountInfos: calculateProductDiscountInfos(productsWithDiscounts, discountService),
    onAddToCart: () => {
      uiEventBus.emit("cart:add:requested");
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

  // 타이머 서비스 초기화 및 시작
  const timerService = new TimerService(productService, discountService);
  timerService.startLightningSaleTimer();
  timerService.startSuggestSaleTimer();
}

function calculateProductDiscountInfos(products, discountService) {
  return products.map(product => ({
    productId: product.id,
    rate: product.discountRate || discountService.calculateProductDiscountRate(product),
    status: product.discountStatus || discountService.getProductDiscountStatus(product),
  }));
}

main();
