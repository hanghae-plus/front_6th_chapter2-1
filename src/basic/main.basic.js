// components
import { createHeader } from "./components/Header.js";
import { createProductSelector } from "./components/ProductSelector.js";
import { createOrderSummary } from "./components/OrderSummary.js";
import { createManualSystem } from "./components/Manual.js";
import { createLayoutSystem } from "./components/Layout.js";
import { createCartList } from "./components/CartList.js";

// services
import { PointService } from "./services/pointService.js";
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

// data
import { PRODUCT_LIST } from "./data/product.js";

// 서비스를 초기화하고 등록합니다.
function initServices() {
  const serviceManager = new ServiceManager();

  const discountService = new DiscountService();
  const pointService = new PointService();
  const cartService = new CartService();
  const productService = new ProductService();
  const orderService = new OrderService(discountService, pointService);

  // Service 등록 (의존성 순서 고려)
  serviceManager.register("product", productService);
  serviceManager.register("cart", cartService);
  serviceManager.register("discount", discountService);
  serviceManager.register("point", pointService);
  serviceManager.register("order", orderService);

  return serviceManager;
}

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

  // 서비스 초기화 및 등록
  const serviceManager = initServices();
  const { productService, cartService, discountService } = serviceManager.getAllServices();

  const header = createHeader({ itemCount: 0 });

  // Layout 시스템 생성
  const layout = createLayoutSystem();
  const cartList = createCartList();
  const orderSummary = createOrderSummary();
  const manualSystem = createManualSystem();

  const { gridContainer, leftColumn, rightColumn } = layout;

  // ProductSelector 컴포넌트 생성
  const selectorContainer = createProductSelector({
    products: PRODUCT_LIST,
    discountInfos: [],
  });

  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartList);

  rightColumn.appendChild(orderSummary);

  // Manual 시스템 생성
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualSystem.toggle);
  root.appendChild(manualSystem.overlay);

  // Event Bus 이벤트 리스너 등록
  initEventBusListeners(serviceManager);

  // 타이머 서비스 초기화 및 시작 (CartService 의존성 주입)
  const timerService = new TimerService(productService, discountService, cartService);
  timerService.startLightningSaleTimer();
  timerService.startSuggestSaleTimer();
}

main();
