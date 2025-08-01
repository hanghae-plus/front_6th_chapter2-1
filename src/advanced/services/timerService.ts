import { Product } from '../types';
import { TIMING_CONFIG } from '../constants';

// 타이머 상태 타입
export interface TimerState {
  isFlashSaleActive: boolean;
  isRecommendationActive: boolean;
  flashSaleProductId: string | null;
  recommendationProductId: string | null;
  lastSelectedProductId: string | null;
}

// 타이머 콜백 타입
export type TimerCallback = (productId: string) => void;

// 타이머 서비스 클래스
export class TimerService {
  private flashSaleTimer: number | null = null;

  private recommendationTimer: number | null = null;

  private flashSaleStartTimer: number | null = null;

  private recommendationStartTimer: number | null = null;

  private state: TimerState = {
    isFlashSaleActive: false,
    isRecommendationActive: false,
    flashSaleProductId: null,
    recommendationProductId: null,
    lastSelectedProductId: null,
  };

  private products: ReadonlyArray<Product> = [];

  private onFlashSaleChange: TimerCallback | null = null;

  private onRecommendationChange: TimerCallback | null = null;

  private onStateChange: ((state: TimerState) => void) | null = null;

  // 초기화
  initialize(
    products: ReadonlyArray<Product>,
    onFlashSaleChange: TimerCallback,
    onRecommendationChange: TimerCallback,
    onStateChange: (state: TimerState) => void
  ): void {
    this.products = products;
    this.onFlashSaleChange = onFlashSaleChange;
    this.onRecommendationChange = onRecommendationChange;
    this.onStateChange = onStateChange;

    this.startTimers();
  }

  // 타이머 시작
  private startTimers(): void {
    this.startFlashSaleTimer();
    this.startRecommendationTimer();
  }

  // 번개세일 타이머 시작
  private startFlashSaleTimer(): void {
    // 0-10초 랜덤 시작 시간
    const randomStartDelay =
      Math.random() * TIMING_CONFIG.FLASH_SALE_START_DELAY_MAX;

    this.flashSaleStartTimer = setTimeout(() => {
      this.activateFlashSale();

      // 30초 주기로 반복
      this.flashSaleTimer = setInterval(() => {
        this.activateFlashSale();
      }, TIMING_CONFIG.FLASH_SALE_INTERVAL);
    }, randomStartDelay);
  }

  // 추천할인 타이머 시작
  private startRecommendationTimer(): void {
    // 0-20초 랜덤 시작 시간
    const randomStartDelay =
      Math.random() * TIMING_CONFIG.RECOMMENDATION_START_DELAY_MAX;

    this.recommendationStartTimer = setTimeout(() => {
      this.activateRecommendation();

      // 60초 주기로 반복
      this.recommendationTimer = setInterval(() => {
        this.activateRecommendation();
      }, TIMING_CONFIG.RECOMMENDATION_INTERVAL);
    }, randomStartDelay);
  }

  // 번개세일 활성화
  private activateFlashSale(): void {
    // 재고가 있는 상품 중 랜덤 선택
    const availableProducts = this.products.filter((p) => p.stockQuantity > 0);
    if (availableProducts.length === 0) return;

    const randomProduct =
      availableProducts[Math.floor(Math.random() * availableProducts.length)];

    this.state.isFlashSaleActive = true;
    this.state.flashSaleProductId = randomProduct.id;

    // 콜백 호출
    if (this.onFlashSaleChange) {
      this.onFlashSaleChange(randomProduct.id);
    }

    // 상태 변경 알림
    this.notifyStateChange();

    // 10초 후 비활성화
    setTimeout(() => {
      this.deactivateFlashSale();
    }, TIMING_CONFIG.FLASH_SALE_DURATION);
  }

  // 번개세일 비활성화
  private deactivateFlashSale(): void {
    this.state.isFlashSaleActive = false;
    this.state.flashSaleProductId = null;

    // 콜백 호출
    if (this.onFlashSaleChange) {
      this.onFlashSaleChange('');
    }

    // 상태 변경 알림
    this.notifyStateChange();
  }

  // 추천할인 활성화
  private activateRecommendation(): void {
    // 마지막 선택한 상품과 다른 상품 선택
    const availableProducts = this.products.filter(
      (p) => p.stockQuantity > 0 && p.id !== this.state.lastSelectedProductId
    );

    if (availableProducts.length === 0) return;

    const randomProduct =
      availableProducts[Math.floor(Math.random() * availableProducts.length)];

    this.state.isRecommendationActive = true;
    this.state.recommendationProductId = randomProduct.id;

    // 콜백 호출
    if (this.onRecommendationChange) {
      this.onRecommendationChange(randomProduct.id);
    }

    // 상태 변경 알림
    this.notifyStateChange();

    // 8초 후 비활성화
    setTimeout(() => {
      this.deactivateRecommendation();
    }, TIMING_CONFIG.RECOMMENDATION_DURATION);
  }

  // 추천할인 비활성화
  private deactivateRecommendation(): void {
    this.state.isRecommendationActive = false;
    this.state.recommendationProductId = null;

    // 콜백 호출
    if (this.onRecommendationChange) {
      this.onRecommendationChange('');
    }

    // 상태 변경 알림
    this.notifyStateChange();
  }

  // 마지막 선택 상품 업데이트
  updateLastSelectedProduct(productId: string): void {
    this.state.lastSelectedProductId = productId;
    this.notifyStateChange();
  }

  // 현재 상태 반환
  getState(): TimerState {
    return { ...this.state };
  }

  // 상태 변경 알림
  private notifyStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange({ ...this.state });
    }
  }

  // 모든 타이머 정리
  cleanup(): void {
    if (this.flashSaleTimer) {
      clearInterval(this.flashSaleTimer);
      this.flashSaleTimer = null;
    }

    if (this.recommendationTimer) {
      clearInterval(this.recommendationTimer);
      this.recommendationTimer = null;
    }

    if (this.flashSaleStartTimer) {
      clearTimeout(this.flashSaleStartTimer);
      this.flashSaleStartTimer = null;
    }

    if (this.recommendationStartTimer) {
      clearTimeout(this.recommendationStartTimer);
      this.recommendationStartTimer = null;
    }
  }
}

// 싱글톤 인스턴스
export const timerService = new TimerService();
