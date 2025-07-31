# ✅ 구현 체크리스트

## 📋 개요

이 문서는 리팩토링 작업을 단계별로 체계적으로 수행하기 위한 상세한 체크리스트입니다.

## 🚀 Phase 1: 긴급 수술 (1-2일)

### 1.1 전역 변수 제거

#### 1.1.1 전역 변수 식별

- [ ] `prodList` → `products`
- [ ] `sel` → `productSelector`
- [ ] `addBtn` → `addButton`
- [ ] `cartDisp` → `cartDisplay`
- [ ] `sum` → `summaryElement`
- [ ] `stockInfo` → `stockInformation`
- [ ] `lastSel` → `lastSelected`
- [ ] `bonusPts` → `bonusPoints`
- [ ] `totalAmt` → `totalAmount`
- [ ] `itemCnt` → `itemCount`

#### 1.1.2 모듈 패턴 설계

- [ ] IIFE (Immediately Invoked Function Expression) 구조 설계
- [ ] 상태 객체 정의
- [ ] Public API 설계
- [ ] Private 함수 정의

#### 1.1.3 모듈 패턴 구현

```javascript
// 구현해야 할 구조
const ShoppingCart = (() => {
  // Private state
  let state = {
    products: [],
    cart: [],
    totalAmount: 0,
    itemCount: 0,
    lastSelected: null,
    bonusPoints: 0,
  };

  // Private functions
  function calculateSubtotal() {}
  function applyDiscounts() {}
  function updateUI() {}

  // Public API
  return {
    init,
    addToCart,
    removeFromCart,
    calculateTotal,
    updateDisplay,
  };
})();
```

### 1.2 거대 함수 분할

#### 1.2.1 handleCalculateCartStuff 함수 분석

- [ ] 함수의 8가지 책임 식별
- [ ] 각 책임별 독립 함수 설계
- [ ] 함수 간 의존성 분석
- [ ] 데이터 흐름 설계

#### 1.2.2 함수 분할 구현

- [ ] `calculateSubtotal(cartItems)` - 소계 계산
- [ ] `applyDiscounts(subtotal, cartItems)` - 할인 적용
- [ ] `calculatePoints(totalAmount)` - 포인트 계산
- [ ] `updateUI(total, points)` - UI 업데이트
- [ ] `checkLowStock()` - 재고 부족 체크
- [ ] `updateStockInfo()` - 재고 정보 업데이트
- [ ] `updateItemCount()` - 아이템 수 업데이트
- [ ] `updateSummaryDetails()` - 요약 정보 업데이트

#### 1.2.3 함수 분할 검증

- [ ] 각 함수가 단일 책임을 가지는지 확인
- [ ] 함수 간 의존성이 명확한지 확인
- [ ] 데이터 흐름이 올바른지 확인
- [ ] 기존 기능이 정상 동작하는지 확인

### 1.3 중복 코드 통합

#### 1.3.1 중복 코드 식별

- [ ] 포인트 계산 중복 (5곳)
- [ ] 재고 체크 중복 (3곳)
- [ ] DOM 조작 중복 (8곳)
- [ ] 화요일 체크 중복 (4곳)

#### 1.3.2 공통 함수 추출

- [ ] `calculateLoyaltyPoints(totalAmount, isTuesday)`
- [ ] `getTotalStock()`
- [ ] `updateElementText(elementId, text)`
- [ ] `isTuesday()`

#### 1.3.3 중복 코드 제거

- [ ] 기존 중복 코드를 공통 함수 호출로 교체
- [ ] 각 교체 후 기능 테스트
- [ ] 중복 코드 80% 이상 제거 확인

### 1.4 Phase 1 완료 검증

- [ ] 전역 변수 100% 제거 확인
- [ ] 288줄 함수를 10개 이하 함수로 분할 확인
- [ ] 중복 코드 80% 이상 제거 확인
- [ ] 기본 기능 테스트 통과
- [ ] 브라우저에서 정상 동작 확인

## 🎨 Phase 2: 코드 품질 개선 (2-3일)

### 2.1 매직 넘버 상수화

#### 2.1.1 매직 넘버 식별

- [ ] 할인율 관련: `0.1`, `0.15`, `0.2`, `0.25`
- [ ] 수량 기준: `10`, `30`
- [ ] 재고 기준: `5`
- [ ] 시간 관련: `30000`, `60000`
- [ ] 포인트 관련: `1000`, `50`, `100`

#### 2.1.2 상수 정의

```javascript
// 구현해야 할 상수들
const DISCOUNT_RATES = {
  KEYBOARD: 0.1, // 10%
  MOUSE: 0.15, // 15%
  MONITOR_ARM: 0.2, // 20%
  LAPTOP_CASE: 0.05, // 5%
  SPEAKER: 0.25, // 25%
  TUESDAY: 0.1, // 10%
  LIGHTNING: 0.2, // 20%
  RECOMMENDATION: 0.05, // 5%
};

const THRESHOLDS = {
  BULK_PURCHASE: 10,
  MASS_PURCHASE: 30,
  LOW_STOCK: 5,
};

const POINTS = {
  BASE_RATE: 1000, // 1000원당 1포인트
  KEYBOARD_MOUSE: 50, // 키보드+마우스 세트
  FULL_SET: 100, // 풀세트
  BULK_10: 20, // 10개 이상
  BULK_20: 50, // 20개 이상
  BULK_30: 100, // 30개 이상
};

const TIMERS = {
  LIGHTNING_SALE: 30000, // 30초
  RECOMMENDATION: 60000, // 60초
};
```

#### 2.1.3 매직 넘버 교체

- [ ] 할인율 계산 부분 교체
- [ ] 수량 체크 부분 교체
- [ ] 재고 체크 부분 교체
- [ ] 타이머 설정 부분 교체
- [ ] 포인트 계산 부분 교체

### 2.2 변수명 개선

#### 2.2.1 변수명 매핑 정의

```javascript
// 개선해야 할 변수명들
const VARIABLE_MAPPING = {
  // 단일 문자 변수
  p: 'product',
  q: 'quantity',
  amt: 'amount',
  sel: 'selector',
  tgt: 'target',

  // 축약어 변수
  curItem: 'currentItem',
  qtyElem: 'quantityElement',
  itemTot: 'itemTotal',
  disc: 'discount',
  subTot: 'subtotal',
  totalAmt: 'totalAmount',
  itemCnt: 'itemCount',
  bonusPts: 'bonusPoints',
  lastSel: 'lastSelected',

  // 의미 불명한 변수
  _p: 'product',
  idx: 'index',
  j: 'index',
  k: 'index',
};
```

#### 2.2.2 변수명 교체

- [ ] 단일 문자 변수 교체
- [ ] 축약어 변수 교체
- [ ] 의미 불명한 변수 교체
- [ ] 각 교체 후 기능 테스트

### 2.3 일관된 코딩 스타일 적용

#### 2.3.1 선언 방식 통일

- [ ] `var` → `const`/`let` 변경
- [ ] 일관된 선언 방식 적용
- [ ] 변수 그룹화 및 정리

#### 2.3.2 문자열 표현 통일

- [ ] 템플릿 리터럴 사용 통일
- [ ] 따옴표 사용 통일
- [ ] 문자열 연결 방식 통일

#### 2.3.3 반복문 패턴 통일

- [ ] `for...of` 사용 통일
- [ ] `forEach` 사용 통일
- [ ] 배열 메서드 사용 통일

### 2.4 에러 처리 추가

#### 2.4.1 null 체크 추가

- [ ] DOM 요소 접근 시 null 체크
- [ ] 배열 접근 시 경계 체크
- [ ] 객체 속성 접근 시 존재 체크

#### 2.4.2 예외 상황 처리

- [ ] 재고 부족 시 처리
- [ ] 잘못된 상품 ID 처리
- [ ] 네트워크 오류 처리

### 2.5 Phase 2 완료 검증

- [ ] 매직 넘버 100% 상수화 확인
- [ ] 변수명 90% 이상 개선 확인
- [ ] 일관된 코딩 스타일 100% 적용 확인
- [ ] 에러 처리 80% 이상 추가 확인

## 🏗️ Phase 3: 구조 개선 (3-4일)

### 3.1 비즈니스 로직과 UI 분리

#### 3.1.1 비즈니스 로직 클래스 설계

```javascript
// 구현해야 할 클래스들
class CartCalculator {
  calculateSubtotal(cartItems) {}
  applyDiscounts(subtotal, cartItems) {}
  calculatePoints(totalAmount) {}
  isEligibleForDiscount(quantity) {}
}

class DiscountManager {
  applyBulkDiscount(productId, quantity) {}
  applyTuesdayDiscount(total) {}
  applyLightningDiscount(product) {}
  applyRecommendationDiscount(product) {}
}

class PointsCalculator {
  calculateBasePoints(totalAmount) {}
  calculateBonusPoints(cartItems, totalAmount) {}
  isTuesday() {}
}
```

#### 3.1.2 UI 클래스 설계

```javascript
// 구현해야 할 UI 클래스들
class CartUI {
  updateDisplay(total, points) {}
  updateItemCount(count) {}
  updateStockInfo() {}
  updateSummaryDetails(cartItems) {}
}

class ProductUI {
  updateSelectOptions() {}
  updatePricesInCart() {}
  createCartItemElement(product) {}
}
```

#### 3.1.3 비즈니스 로직과 UI 분리 구현

- [ ] 계산 로직을 순수 함수로 분리
- [ ] DOM 조작을 UI 클래스로 분리
- [ ] 이벤트 핸들링 정리
- [ ] 의존성 주입 패턴 적용

### 3.2 성능 최적화

#### 3.2.1 DOM 조작 최적화

- [ ] `innerHTML` 반복 사용 제거
- [ ] DocumentFragment 사용
- [ ] 이벤트 위임 적용
- [ ] 불필요한 DOM 조회 최소화

#### 3.2.2 계산 최적화

- [ ] 불필요한 재계산 제거
- [ ] 캐싱 전략 적용
- [ ] 메모이제이션 적용
- [ ] 비동기 처리 적용

### 3.3 모듈화 및 재사용성 향상

#### 3.3.1 모듈 분리

- [ ] `cart.js` - 장바구니 로직
- [ ] `discount.js` - 할인 계산
- [ ] `points.js` - 포인트 시스템
- [ ] `ui.js` - UI 렌더링
- [ ] `constants.js` - 상수 정의
- [ ] `utils.js` - 유틸리티 함수

#### 3.3.2 의존성 관리

- [ ] 모듈 간 의존성 최소화
- [ ] 인터페이스 정의
- [ ] 의존성 주입 패턴 적용

### 3.4 Phase 3 완료 검증

- [ ] 비즈니스 로직과 UI 100% 분리 확인
- [ ] 성능 50% 이상 향상 확인
- [ ] 모듈화 80% 이상 완료 확인

## 🧪 최종 검증

### 최종 테스트

- [ ] 모든 기능 정상 동작 확인
- [ ] 브라우저 호환성 테스트
- [ ] 성능 테스트
- [ ] 메모리 누수 테스트

### 코드 품질 검증

- [ ] ESLint 통과
- [ ] Prettier 포맷팅 적용
- [ ] 코드 복잡도 검사
- [ ] 테스트 커버리지 확인

### 문서화

- [ ] README 업데이트
- [ ] API 문서 작성
- [ ] 변경사항 문서화
- [ ] 사용법 가이드 작성

## 📊 성공 지표 확인

### 정량적 지표

- [ ] 코드 라인 수: 903줄 → 500줄 이하
- [ ] 함수 개수: 8개 → 25개
- [ ] 전역 변수: 10개 → 0개
- [ ] 중복 코드: 90% 이상 제거
- [ ] 매직 넘버: 100% 상수화

### 정성적 지표

- [ ] 코드 가독성: 15/100 → 80/100
- [ ] 유지보수성: 10/100 → 85/100
- [ ] 테스트 가능성: 5/100 → 90/100
- [ ] 확장성: 10/100 → 80/100

## 🎉 리팩토링 완료

모든 체크리스트 항목이 완료되면 성공적인 리팩토링이 완료된 것입니다!

### 다음 단계

1. 코드 리뷰 진행
2. 팀 공유 및 교육
3. 지속적인 모니터링
4. 추가 개선 계획 수립
