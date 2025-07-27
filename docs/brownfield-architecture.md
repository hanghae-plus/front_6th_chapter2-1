# 브라운필드 아키텍처 - 쇼핑카트 리팩터링 프로젝트

## 📋 프로젝트 개요

### 현재 상황

- **레거시 코드**: `src/main.original.js` (787줄의 거대한 단일 파일)
- **리팩터링 대상**: `src/basic/main.basic.js` (763줄, original과 거의 동일)
- **테스트 기준**: `src/basic/__tests__/basic.test.js` (674개 테스트 케이스)
- **1차 목표**: **모든 테스트 통과하면서 main.basic.js 리팩터링**
- **최종 목표**: React 전환 가능한 구조 설계
- **도구**: ESLint + Prettier + TypeScript 도입

### 스프린트 핵심 목표 🎯

1. **`main.basic.js` → 사용 가능한 리팩터링된 코드로 변경**
2. **`basic.test.js` 674개 테스트 케이스 100% 통과 유지**
3. **기존 기능 완전 보존하면서 클린 코드 구조로 전환**
4. **테스트 기반 안전한 리팩터링 수행**

### 문제점 분석

1. **거대한 단일 파일**: 787줄의 main() 함수
2. **전역 변수 남용**: prodList, bonusPts, stockInfo, totalAmt 등
3. **기능 분리 미흡**: DOM 조작과 비즈니스 로직 혼재
4. **네이밍 불일치**: PRODUCT_ONE, p2, product_3, p4, PRODUCT_5
5. **테스트 불가능**: 강결합된 구조
6. **유지보수 어려움**: 콜백 헬과 복잡한 의존성

## 🏗️ 아키텍처 설계

### 디렉토리 구조

```
src/basic/
├── components/           # UI 컴포넌트 (React-ready)
│   ├── ProductSelector/
│   ├── CartDisplay/
│   ├── OrderSummary/
│   ├── StockInfo/
│   └── ManualGuide/
├── state/               # 상태 관리
│   ├── CartState.js
│   ├── ProductState.js
│   └── UIState.js
├── calculations/        # 비즈니스 로직
│   ├── PriceCalculator.js
│   ├── DiscountEngine.js
│   └── PointsCalculator.js
├── constants/           # 상수 정의
│   ├── Products.js
│   ├── DiscountRates.js
│   └── Events.js
├── utils/               # 유틸리티
│   ├── DOMUtils.js
│   ├── DateUtils.js
│   └── FormatUtils.js
├── templates/           # HTML 템플릿
│   └── CartTemplates.js
└── __tests__/           # 테스트
    ├── calculations/
    ├── components/
    └── integration/
```

### 핵심 아키텍처 원칙

#### 1. 관심사 분리 (Separation of Concerns)

- **UI 레이어**: 컴포넌트 기반 구조
- **비즈니스 로직**: 순수 함수로 분리
- **상태 관리**: 중앙집중식 상태 관리
- **데이터 계층**: 상수와 초기 데이터 분리

#### 2. React-Ready 구조

```javascript
// 현재: DOM 직접 조작
function updateCart() {
  cartDisp.innerHTML = '...';
}

// 목표: 컴포넌트 기반
class CartDisplay {
  constructor(element, state) {
    this.element = element;
    this.state = state;
  }

  render() {
    // React 컴포넌트로 쉽게 전환 가능
  }
}
```

#### 3. 테스트 가능한 구조

```javascript
// 순수 함수로 분리
export function calculateDiscount(items, rules) {
  // 테스트 가능한 순수 함수
  return discount;
}

// 의존성 주입
export class CartCalculator {
  constructor(discountEngine, pointsCalculator) {
    this.discountEngine = discountEngine;
    this.pointsCalculator = pointsCalculator;
  }
}
```

## 🔧 기술 스택 & 도구

### 정적 코드 관리

```json
// package.json 추가 의존성
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^9.0.0",
    "eslint-config-prettier": "^9.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.5.0"
  }
}
```

### ESLint 설정

```javascript
// eslint.config.js
export default [
  {
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-global-assign': 'error',
    },
  },
];
```

### TypeScript 설정

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "allowJs": true,
    "checkJs": true
  },
  "include": ["src/basic/**/*"],
  "exclude": ["node_modules", "src/main.original.js"]
}
```

## 📦 컴포넌트 설계

### 1. ProductSelector 컴포넌트

**책임**: 상품 선택 UI 관리

```javascript
export class ProductSelector {
  constructor(element, products, onProductSelect) {
    this.element = element;
    this.products = products;
    this.onProductSelect = onProductSelect;
  }

  render() {
    // React 스타일 렌더링 로직
  }

  updateOptions(products) {
    // 상품 목록 업데이트
  }
}
```

### 2. CartDisplay 컴포넌트

**책임**: 장바구니 아이템 표시 및 수량 조절

```javascript
export class CartDisplay {
  constructor(element, cartState, onQuantityChange) {
    this.element = element;
    this.cartState = cartState;
    this.onQuantityChange = onQuantityChange;
  }

  render() {
    // 장바구니 아이템 렌더링
  }

  handleQuantityChange(productId, change) {
    // 수량 변경 처리
  }
}
```

### 3. OrderSummary 컴포넌트

**책임**: 주문 요약 정보 표시

```javascript
export class OrderSummary {
  constructor(element, calculationResult) {
    this.element = element;
    this.calculationResult = calculationResult;
  }

  render() {
    // 요약 정보 렌더링
  }
}
```

## 🧮 비즈니스 로직 분리

### 1. PriceCalculator

```javascript
export class PriceCalculator {
  calculateSubtotal(cartItems) {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  calculateTotal(subtotal, discounts) {
    return subtotal - discounts.total;
  }
}
```

### 2. DiscountEngine

```javascript
export class DiscountEngine {
  constructor(discountRules) {
    this.rules = discountRules;
  }

  calculateDiscounts(cartItems, context) {
    // 할인 규칙 적용
    return {
      itemDiscounts: this.calculateItemDiscounts(cartItems),
      bulkDiscounts: this.calculateBulkDiscounts(cartItems),
      specialDiscounts: this.calculateSpecialDiscounts(context),
    };
  }
}
```

### 3. PointsCalculator

```javascript
export class PointsCalculator {
  calculatePoints(total, cartItems, bonusRules) {
    let points = Math.floor(total / 1000); // 기본 포인트

    // 보너스 포인트 계산
    points += this.calculateBonusPoints(cartItems, bonusRules);

    return points;
  }
}
```

## 🗃️ 상태 관리

### 중앙집중식 상태 관리

```javascript
export class AppState {
  constructor() {
    this.products = [...INITIAL_PRODUCTS];
    this.cart = [];
    this.ui = {
      selectedProduct: null,
      showManual: false,
    };
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener(this));
  }

  addToCart(productId) {
    // 장바구니 추가 로직
    this.notify();
  }

  updateQuantity(productId, newQuantity) {
    // 수량 업데이트 로직
    this.notify();
  }
}
```

## 🧪 테스트 전략

### 1. 단위 테스트 (Vitest)

```javascript
// calculations/PriceCalculator.test.js
import { describe, it, expect } from 'vitest';
import { PriceCalculator } from '../PriceCalculator.js';

describe('PriceCalculator', () => {
  it('should calculate subtotal correctly', () => {
    // Given
    const calculator = new PriceCalculator();
    const items = [
      { price: 1000, quantity: 2 },
      { price: 2000, quantity: 1 },
    ];

    // When
    const result = calculator.calculateSubtotal(items);

    // Then
    expect(result).toBe(4000);
  });
});
```

### 2. 통합 테스트

```javascript
// __tests__/integration/cart.test.js
describe('Cart Integration', () => {
  it('should update total when adding items', () => {
    // Given-When-Then 구조로 통합 테스트
  });
});
```

## 🧪 테스트 기반 리팩터링 전략

### Phase 0: 현재 상태 분석 및 검증 ✅

#### 현황

- 테스트 현황: 86 passed | 16 skipped (102 total)
- 코드 복잡도: main.basic.js 763라인
- 주요 문제점: 하드코딩된 상품 변수, 전역 변수 남용, 복잡한 중첩 로직

#### 새로 발견된 이슈: 하드코딩 의존성 웹 문제 🚨

**문제**: main.basic.js에서 9개 위치에 하드코딩된 상품 변수 사용

- 할인 계산 로직: 5개 위치 (라인 354-366)
- 포인트 계산 로직: 3개 위치 (라인 555-559)
- 변수 선언: 1개 위치 (라인 313)

**해결 전략**: 안전한 단계적 교체 (Safe Step-by-Step Replacement)

### Phase 1: 상수 추출 (Constants Extraction) 🔄 **진행중**

#### 1-A: 하드코딩 의존성 해결 전략 📋 **NEW**

**원칙**: "한 번에 하나씩, 즉시 검증" (One at a Time, Immediate Verification)

**단계별 접근**:

1. **Import 완성**: PRODUCT_IDS 추가
2. **할인 로직 블록 교체**: 354-366라인 일괄 교체
3. **포인트 로직 블록 교체**: 555-559라인 일괄 교체
4. **변수 선언 정리**: hasP2 등 불필요한 변수 제거
5. **각 단계마다 테스트 실행으로 즉시 검증**

**안전 장치**:

- 각 교체 후 즉시 `pnpm run test:basic` 실행
- 실패 시 해당 단계만 롤백
- git commit을 단계별로 수행하여 안전한 복구 지점 확보

#### 1-B: 정규식 기반 일괄 교체 패턴 🔧

```bash
# 안전한 일괄 교체를 위한 sed 명령어들
sed -i 's/PRODUCT_ONE/PRODUCT_IDS.KEYBOARD/g' src/basic/main.basic.js
sed -i 's/\bp2\b/PRODUCT_IDS.MOUSE/g' src/basic/main.basic.js
sed -i 's/product_3/PRODUCT_IDS.MONITOR_ARM/g' src/basic/main.basic.js
sed -i 's/\bp4\b/PRODUCT_IDS.LAPTOP_POUCH/g' src/basic/main.basic.js
sed -i 's/PRODUCT_5/PRODUCT_IDS.LOFI_SPEAKER/g' src/basic/main.basic.js
```

**주의사항**:

- `\b`는 단어 경계를 의미하여 `p2`, `p4` 같은 짧은 변수명의 오교체 방지
- 각 교체 후 즉시 테스트 실행

### Phase 2: 비즈니스 로직 분리 (Business Logic Separation)

### Phase 3: UI 컴포넌트화 (UI Componentization)

### Phase 4: 상태 관리 구조화 (State Management Structuring)

### Phase 5: 최종 통합 및 검증 (Final Integration & Verification)

### 단계별 리팩터링 로드맵

#### Phase 0: 테스트 환경 구축 (1일)

```bash
# 목표: 안정적인 테스트 실행 환경
1. 현재 테스트 상태 분석
2. SKIP된 테스트 원인 파악
3. 우선순위별 테스트 그룹 분류
4. 기준 테스트 스위트 확정
```

#### Phase 1: 상수 및 설정 분리 (1-2일)

```javascript
// src/basic/constants/Products.js
export const PRODUCTS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_POUCH: 'p4',
  SPEAKER: 'p5',
};

// src/basic/constants/DiscountRates.js
export const DISCOUNT_RATES = {
  KEYBOARD_BULK: 0.1,
  MOUSE_BULK: 0.15,
  // ...
};

// 테스트: 기본 상품 정보 테스트 그룹 통과 확인
```

#### Phase 2: 계산 로직 분리 (2-3일)

```javascript
// src/basic/calculations/PriceCalculator.js
export class PriceCalculator {
  calculateSubtotal(cartItems) {
    // 기존 계산 로직을 순수 함수로 변환
  }
}

// 테스트: 할인 정책, 포인트 적립 테스트 그룹 통과 확인
```

#### Phase 3: DOM 유틸리티 분리 (2일)

```javascript
// src/basic/utils/DOMUtils.js
export class DOMUtils {
  static createElement(tag, className, innerHTML) {
    // DOM 조작 로직 분리
  }
}

// 테스트: UI/UX 테스트 그룹 통과 확인
```

#### Phase 4: 컴포넌트화 (3-4일)

```javascript
// src/basic/components/ProductSelector.js
export class ProductSelector {
  constructor(element, products, onProductSelect) {
    // 기존 상품 선택 로직을 컴포넌트로 캡슐화
  }
}

// 테스트: 기능 요구사항 테스트 그룹 통과 확인
```

#### Phase 5: 상태 관리 중앙화 (2-3일)

```javascript
// src/basic/state/AppState.js
export class AppState {
  // 전역 변수들을 중앙 상태로 관리
}

// 테스트: 전체 통합 테스트 통과 확인
```

### 위험 관리 전략

#### 🔒 안전장치

```javascript
// 1. 각 Phase마다 체크포인트
function runTestCheckpoint(phaseName) {
  console.log(`=== ${phaseName} 테스트 체크포인트 ===`);
  // npm run test:basic 실행
  // 결과 분석 및 리포트
}

// 2. 롤백 전략
// Git 브랜치별 Phase 관리
// 문제 발생시 이전 Phase로 즉시 복구
```

#### ⚠️ 고위험 영역 식별

```javascript
// 변경 시 주의 필요한 코드들:
1. 타이머 관련 로직 (번개세일, 추천할인)
2. 이벤트 핸들러 바인딩
3. DOM 구조 변경
4. 전역 변수 참조 관계
```

### 테스트 매핑 전략

#### 기능별 테스트 그룹

```
Group A (Low Risk): 상품 정보, 기본 계산
Group B (Medium Risk): 할인 정책, 포인트 계산
Group C (High Risk): UI 인터랙션, 이벤트 처리
Group D (Skip 예정): 타이머 기반 기능 (번개세일 등)
```

#### 테스트 우선순위 매트릭스

```
High Impact, Low Risk → 최우선 (Group A)
High Impact, High Risk → 신중하게 (Group C)
Low Impact, Low Risk → 나중에 (Group B)
Low Impact, High Risk → 스킵 고려 (Group D)
```

### AI 에이전트 구현 가이드

#### 단계별 AI 지원 전략

```javascript
// Phase 1-2: 자동 상수 추출
// AI가 하드코딩된 값들을 자동으로 식별하고 상수로 분리

// Phase 3-4: 함수 분리 지원
// AI가 순수 함수로 분리 가능한 로직 식별

// Phase 5: 리팩터링 검증
// AI가 변경 전후 동작 동일성 검증
```

## 🚀 마이그레이션 전략

### Phase 0: 테스트 환경 분석 ✅

1. **현재 테스트 실행**: `npm run test:basic` 상태 확인
2. **SKIP 테스트 분석**: 번개세일, 추천할인 등 타이머 기반 기능
3. **통과 가능 테스트 식별**: 상품 정보, 기본 할인, UI 등
4. **기준 스위트 확정**: 리팩터링 성공 기준 정의

### Phase 1: 상수 및 설정 분리 (테스트 Group A)

1. **상수 추출**: PRODUCT_ONE → PRODUCTS.KEYBOARD 등 통일
2. **설정 분리**: 할인율, 포인트 규칙 등 constants로 이동
3. **도구 설정**: TypeScript, ESLint, Prettier 기본 설정
4. **테스트 확인**: 상품 정보 테스트 그룹 100% 통과

### Phase 2: 계산 로직 분리 (테스트 Group B)

1. **순수 함수 추출**: 할인 계산, 포인트 계산 로직 분리
2. **PriceCalculator**: 가격 계산 클래스 생성
3. **DiscountEngine**: 할인 정책 엔진 분리
4. **테스트 확인**: 할인 정책, 포인트 적립 테스트 통과

### Phase 3: DOM 유틸리티 분리 (테스트 Group C 준비)

1. **DOM 조작 분리**: createElement, updateElement 등 유틸리티화
2. **템플릿 분리**: HTML 문자열을 별도 파일로 분리
3. **이벤트 유틸리티**: 이벤트 바인딩 로직 정리
4. **테스트 확인**: UI/UX 테스트 안정성 확보

### Phase 4: 컴포넌트화 (테스트 Group C)

1. **ProductSelector**: 상품 선택 UI 컴포넌트 분리
2. **CartDisplay**: 장바구니 표시 컴포넌트 분리
3. **OrderSummary**: 주문 요약 컴포넌트 분리
4. **테스트 확인**: 기능 요구사항 테스트 통과

### Phase 5: 상태 관리 중앙화 (전체 통합)

1. **AppState 클래스**: 전역 변수들을 중앙 관리
2. **Observer 패턴**: 상태 변경 알림 시스템 구현
3. **이벤트 시스템**: 컴포넌트 간 통신 체계 구축
4. **테스트 확인**: 674개 테스트 케이스 종합 검증

## 🎯 성공 지표

### 1차 목표: 테스트 기반 성공 지표 🚨

- [ ] **`basic.test.js` 674개 테스트 케이스 100% 통과**
- [ ] **기존 기능 완전 동일성 보장** (PRD 요구사항 기준)
- [ ] **main.basic.js 리팩터링 완료** (단일 파일 → 모듈 구조)
- [ ] **Phase별 테스트 체크포인트 통과** (0-5단계)

### 코드 품질 지표

- [ ] 함수당 최대 20줄 (현재: 100줄+ 함수들 존재)
- [ ] 파일당 최대 200줄 (현재: main.basic.js 763줄)
- [ ] 순환 복잡도 10 이하 (현재: 중첩 if문 과다)
- [ ] 전역 변수 제거 (현재: 15개+ 전역 변수)

### 아키텍처 목표

- [ ] 컴포넌트 기반 구조 완성 (ProductSelector, CartDisplay 등)
- [ ] React 전환 준비 완료 (클래스 → 함수형 컴포넌트 변환 가능)
- [ ] 순수 함수 기반 비즈니스 로직 (PriceCalculator, DiscountEngine)
- [ ] 중앙집중식 상태 관리 (AppState 클래스)

### 개발자 경험

- [ ] TypeScript 타입 안정성 (기본 설정)
- [ ] ESLint 규칙 준수 (no-var, prefer-const 등)
- [ ] Prettier 자동 포맷팅 설정
- [ ] Vitest 테스트 자동화 (기존 테스트 유지)

### 테스트 그룹별 성공 기준

```
Group A (상품 정보): 100% 통과 (Phase 1 완료 기준)
Group B (할인 정책): 100% 통과 (Phase 2 완료 기준)
Group C (UI/UX): 100% 통과 (Phase 4 완료 기준)
Group D (타이머): Skip 유지 (원본 코드 문제로 인해)
```

## 💡 React 전환 로드맵

### 전환 용이성을 위한 설계

```javascript
// 현재 설계
class CartDisplay {
  render() {
    this.element.innerHTML = template;
  }
}

// React 전환시
function CartDisplay({ cartItems, onQuantityChange }) {
  return (
    <div>
      {cartItems.map(item => (
        <CartItem key={item.id} item={item} onQuantityChange={onQuantityChange} />
      ))}
    </div>
  );
}
```

### 상태 관리 전환

```javascript
// 현재: 클래스 기반 상태
class AppState { ... }

// React 전환시: Context + Hooks
const CartContext = createContext();
function useCart() {
  return useContext(CartContext);
}
```

## 🤖 AI 에이전트 테스트 기반 구현 가이드

### Phase별 AI 구현 전략

#### Phase 0-1: 상수 추출 (AI 자동화 레벨: 높음)

```javascript
// AI 작업: 하드코딩된 값들을 자동으로 식별하고 상수로 분리
// 테스트 안정성: 높음 (기능 변경 없음)

// Before (main.basic.js)
var PRODUCT_ONE = 'p1';
var p2 = 'p2';
var product_3 = 'p3';

// After (AI 변환)
// src/basic/constants/Products.js
export const PRODUCTS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_POUCH: 'p4',
  SPEAKER: 'p5',
};
```

#### Phase 2: 계산 로직 분리 (AI 자동화 레벨: 중간)

```javascript
// AI 작업: 순수 함수로 분리 가능한 로직 식별 및 추출
// 테스트 안정성: 중간 (로직 변경 없이 구조만 변경)

// Before (inline 계산)
if (q >= 10) {
  if (curItem.id === PRODUCT_ONE) {
    disc = 10 / 100;
  } else if (curItem.id === p2) {
    disc = 15 / 100;
  }
  // ...
}

// After (AI 변환)
// src/basic/calculations/DiscountEngine.js
export function calculateItemDiscount(productId, quantity) {
  if (quantity < 10) return 0;

  const rates = {
    [PRODUCTS.KEYBOARD]: 0.1,
    [PRODUCTS.MOUSE]: 0.15,
    // ...
  };

  return rates[productId] || 0;
}
```

#### Phase 3-4: 컴포넌트화 (AI 자동화 레벨: 낮음)

```javascript
// AI 작업: 신중한 가이드 하에 컴포넌트로 캡슐화
// 테스트 안정성: 낮음 (DOM 구조 변경 위험)

// AI 구현 원칙:
// 1. 기존 HTML 구조 완전 보존
// 2. 이벤트 핸들러 바인딩 유지
// 3. CSS 클래스명 변경 금지
// 4. 각 변경 후 즉시 테스트 실행
```

### AI 안전장치 및 검증 체계

#### 🔒 테스트 기반 검증 파이프라인

```javascript
// AI 구현 시 필수 검증 단계
function aiImplementationPipeline(phase, changes) {
  // 1. 사전 테스트 실행
  const beforeTests = runTests('npm run test:basic');

  // 2. AI 코드 변경 적용
  applyAIChanges(changes);

  // 3. 사후 테스트 실행
  const afterTests = runTests('npm run test:basic');

  // 4. 결과 비교 및 검증
  if (!compareTestResults(beforeTests, afterTests)) {
    rollbackChanges();
    reportFailure(phase, changes);
  }

  return validateSuccess();
}
```

#### ⚠️ AI 구현 시 주의사항

```javascript
// 1. 전역 변수 참조 추적
const GLOBAL_VARS = [
  'prodList',
  'bonusPts',
  'stockInfo',
  'itemCnt',
  'lastSel',
  'sel',
  'addBtn',
  'totalAmt',
  'cartDisp',
];

// AI는 이 변수들의 모든 참조를 추적하고
// 안전하게 캡슐화해야 함

// 2. 타이머 코드 건드리지 않기
// setTimeout, setInterval 관련 코드는
// 테스트 SKIP 원인이므로 변경 금지

// 3. 이벤트 핸들러 보존
// addEventListener, onclick 등의
// 기존 바인딩 방식 완전 보존
```

### 단계별 성공 기준

#### Phase 0: 테스트 분석 완료 ✅

- [ ] SKIP 테스트 원인 파악 완료
- [ ] 통과 가능한 테스트 그룹 식별 완료
- [ ] 기준 테스트 스위트 확정

#### Phase 1: 상수 분리 완료

- [ ] 모든 하드코딩 값 constants로 이동
- [ ] 상품 정보 테스트 그룹 100% 통과
- [ ] 네이밍 일관성 확보

#### Phase 2: 계산 로직 분리 완료

- [ ] PriceCalculator, DiscountEngine 클래스 생성
- [ ] 할인 정책, 포인트 테스트 그룹 100% 통과
- [ ] 순수 함수로 비즈니스 로직 분리

#### Phase 3-4: 컴포넌트화 완료

- [ ] ProductSelector, CartDisplay, OrderSummary 분리
- [ ] UI/UX, 기능 요구사항 테스트 그룹 100% 통과
- [ ] React 전환 준비 완료

#### Phase 5: 상태 관리 중앙화 완료

- [ ] AppState 클래스로 전역 변수 통합
- [ ] 674개 테스트 케이스 100% 통과
- [ ] 리팩터링 목표 달성

이 테스트 기반 브라운필드 아키텍처를 통해 **main.basic.js 리팩터링**과 **674개 테스트 통과**라는 핵심 목표를 안전하고 체계적으로 달성할 수 있습니다.
