import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import { TimerState, timerService } from '../services/timerService';
import { productList } from '../data/productData';
import { useToast } from './ToastContext';

// Context 타입 정의
interface TimerContextType {
  timerState: TimerState;
  updateLastSelectedProduct: (productId: string) => void;
}

// Context 생성
const TimerContext = createContext<TimerContextType | undefined>(undefined);

// Provider Props 타입
interface TimerProviderProps {
  children: ReactNode;
}

// Provider 컴포넌트
export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [timerState, setTimerState] = useState<TimerState>({
    isFlashSaleActive: false,
    isRecommendationActive: false,
    flashSaleProductId: null,
    recommendationProductId: null,
    lastSelectedProductId: null,
  });

  const { showToast } = useToast();

  // 타이머 서비스 초기화
  useEffect(() => {
    const handleFlashSaleChange = (productId: string) => {
      if (productId) {
        // 번개세일 시작 Toast 알림
        const product = productList.find((p) => p.id === productId);
        showToast(
          `⚡ 번개세일! ${product?.name} 상품이 20% 할인됩니다!`,
          'warning',
          3000
        );
      }
    };

    const handleRecommendationChange = (productId: string) => {
      if (productId) {
        // 추천할인 시작 Toast 알림
        const product = productList.find((p) => p.id === productId);
        showToast(
          `💝 추천할인! ${product?.name} 상품이 5% 할인됩니다!`,
          'info',
          3000
        );
      }
    };

    const handleStateChange = (newState: TimerState) => {
      setTimerState(newState);
    };

    // 타이머 서비스 초기화
    timerService.initialize(
      productList,
      handleFlashSaleChange,
      handleRecommendationChange,
      handleStateChange
    );

    // 컴포넌트 언마운트 시 정리
    return () => {
      timerService.cleanup();
    };
  }, [showToast]);

  // 마지막 선택 상품 업데이트
  const updateLastSelectedProduct = useCallback((productId: string) => {
    timerService.updateLastSelectedProduct(productId);
  }, []);

  const value: TimerContextType = useMemo(
    () => ({
      timerState,
      updateLastSelectedProduct,
    }),
    [timerState, updateLastSelectedProduct]
  );

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};

// Custom Hook
export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
