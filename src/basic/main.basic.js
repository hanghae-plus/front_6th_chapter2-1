import { useAppInitialization } from './hooks/useAppInitialization.js';
import { useCreateAndMountApp } from './hooks/useCreateAndMountApp.js';
import { useServiceInitialization } from './hooks/useServiceInitialization.js';
import { useSetupUIAndEvents } from './hooks/useSetupUIAndEvents.js';

function initializeApp() {
  const { initializeAppState, subscribeToState } = useAppInitialization();
  const { initializeCoreServices, initializeServices } = useServiceInitialization();
  const { initializeRendering, attachEventHandlers } = useSetupUIAndEvents();

  /** 애플리케이션 상태 초기화 */
  initializeAppState();

  /** 핵심 서비스 초기화 (DOM 생성 전) */
  const { calculateTotalDiscount } = initializeCoreServices();

  /** 핵심 컴포넌트 생성 및 DOM 마운트 */
  const { productSelector, cartAddButton, cartDisplay } = useCreateAndMountApp();

  /** DOM 의존 서비스 초기화 */
  const { timerService, cartEventHandler, uiUpdater } = initializeServices(
    productSelector,
    cartDisplay,
    calculateTotalDiscount
  );

  /** 타이머 서비스 시작 */
  timerService.startTimers();

  /** 초기 렌더링 수행 */
  initializeRendering(productSelector, cartDisplay, calculateTotalDiscount, uiUpdater);

  /** 이벤트 핸들러 등록 */
  attachEventHandlers(cartEventHandler, cartAddButton);

  /** 상태 구독 설정 */
  subscribeToState();
}

initializeApp();
