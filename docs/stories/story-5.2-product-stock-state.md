# Story 5.2: 상품 및 재고 상태 관리

## Story Overview

**As a** 시스템  
**I want** 상품과 재고 정보가 일관되게 관리되는 구조  
**So that** 재고 변경 시 모든 화면이 정확한 정보를 표시한다

## Story Points: 7

## Epic: Epic 5 - 상태 관리 구조화

## Problem Statement

### 현재 문제

`main.basic.js`에서 상품과 재고 정보가 여러 전역 변수에 분산:

```javascript
// 현재: 분산된 상품/재고 관리
let prodList = [
  { id: 'p1', name: '무선 키보드', val: 100000, q: 5 },
  { id: 'p2', name: '무선 마우스', val: 50000, q: 3 },
  // ...
];

let stockInfo = {
  p1: { low: true, message: '재고가 부족합니다' },
  p2: { low: false, message: '' },
};

// 재고 업데이트가 여러 곳에서 발생
function updateStockDisplay() {
  // DOM 직접 조작으로 재고 정보 업데이트
}

// 상품 정보 변경 시 일관성 문제
function applyDiscount(productId) {
  // prodList와 DOM 따로 업데이트
}
```

### 문제점 분석

1. **데이터 불일치**: 상품 정보와 재고 정보가 별도 관리되어 동기화 문제
2. **재고 추적 어려움**: 재고 변경 이력과 원인 파악 불가
3. **상태 분산**: DOM, 전역변수, 로컬 계산에 상품 정보 중복
4. **확장성 부족**: 새 상품 속성 추가 시 여러 곳 수정 필요

## Solution

### 새로운 구조: `src/basic/state/ProductState.js`

```javascript
export class ProductState {
  // 상품 상태 관리
  static getState()
  static updateStock(productId, change)
  static setProductList(products)
  static updateProduct(productId, updates)

  // 선택자 (Selectors)
  static getProducts()
  static getProduct(productId)
  static getAvailableProducts()
  static getStockInfo(productId)
  static getLowStockProducts()

  // 이벤트 및 구독
  static subscribe(listener)
  static unsubscribe(listener)
}
```

## Detailed Acceptance Criteria

### Task 1: ProductState 기본 구조 생성

- [ ] `src/basic/state/ProductState.js` 파일 생성
- [ ] 내부 상태 객체 정의 (products, stockLevels)
- [ ] Observer 패턴 기본 구조 구현
- [ ] 초기 상품 데이터 로딩 메서드

### Task 2: 상품 관리 액션

- [ ] `setProductList(products)` 메서드 구현
  - 초기 상품 목록 설정
  - 상품 ID 유효성 검증
  - 기본 재고 정보 초기화
- [ ] `updateProduct(productId, updates)` 메서드 구현
  - 상품 정보 부분 업데이트
  - 가격, 할인 상태 변경 지원
  - 변경 이력 기록

### Task 3: 재고 관리 액션

- [ ] `updateStock(productId, change)` 메서드 구현
  - 재고 수량 증감 처리
  - 음수 재고 방지
  - 재고 변경 이벤트 발생
- [ ] 재고 임계값 자동 계산
  - 품절 상태 (quantity = 0)
  - 재고 부족 상태 (quantity <= 2)
  - 정상 재고 상태

### Task 4: 상품 선택자 구현

- [ ] `getProducts()` 선택자 구현
  - 전체 상품 목록 반환
  - 최신 재고 정보 포함
- [ ] `getProduct(productId)` 선택자 구현
  - 특정 상품 정보 반환
  - 존재하지 않는 상품 처리
- [ ] `getAvailableProducts()` 선택자 구현
  - 재고가 있는 상품만 필터링
  - 품절 상품 제외

### Task 5: 재고 선택자 구현

- [ ] `getStockInfo(productId)` 선택자 구현
  - 재고 수준 상태 반환
  - 알림 메시지 포함
- [ ] `getLowStockProducts()` 선택자 구현
  - 재고 부족 상품 목록
  - 알림용 데이터 제공

### Task 6: 이벤트 시스템 구현

- [ ] `subscribe(listener)` 메서드 구현
  - 상품/재고 변경 리스너 등록
- [ ] `unsubscribe(listener)` 메서드 구현
  - 리스너 등록 해제
- [ ] `notify(action, payload)` 내부 메서드
  - 상품 변경 알림
  - 재고 변경 알림

### Task 7: main.basic.js 통합

- [ ] ProductState import 추가
- [ ] 기존 prodList 전역 변수 제거
- [ ] 기존 stockInfo 전역 변수 제거
- [ ] 상품 관련 함수들 ProductState 사용으로 변경

### Task 8: UI 컴포넌트 구독 설정

- [ ] ProductSelector에서 ProductState 구독
- [ ] StockInfo에서 ProductState 구독
- [ ] NotificationBar에서 재고 알림 구독

### Task 9: 단위 테스트 작성

- [ ] `src/basic/__tests__/ProductState.test.js` 생성
- [ ] 상품 관리 액션 테스트
- [ ] 재고 관리 액션 테스트
- [ ] 선택자 메서드 테스트

## Technical Requirements

### 상태 구조 설계

```javascript
// ProductState 내부 상태 구조
const state = {
  products: {
    p1: {
      id: 'p1',
      name: '무선 키보드',
      price: 100000,
      quantity: 5,
      onSale: false,
      suggestSale: false,
      category: 'electronics',
    },
  },
  stockLevels: {
    p1: {
      status: 'normal', // 'normal', 'low', 'out'
      threshold: 2,
      lastUpdated: '2024-01-01T00:00:00Z',
      message: '',
    },
  },
  metadata: {
    lastUpdated: '2024-01-01T00:00:00Z',
    totalProducts: 5,
  },
};
```

### API 설계

```javascript
// 사용 예시
import { ProductState } from './state/ProductState.js';

// 재고 업데이트
ProductState.updateStock('p1', -1); // 재고 1개 감소

// 상품 조회
const product = ProductState.getProduct('p1');
const availableProducts = ProductState.getAvailableProducts();

// 재고 상태 확인
const stockInfo = ProductState.getStockInfo('p1');
```

### Dependencies

- Epic 3 완료 (StockCalculator)
- Constants (Products.js 활용)

### Performance

- 상품 목록 캐싱
- 재고 계산 메모이제이션
- 불필요한 재계산 방지

## Definition of Done

- [ ] ProductState 클래스 완성
- [ ] 모든 상품/재고 액션 구현
- [ ] 선택자 메서드 모두 구현
- [ ] main.basic.js 전역 변수 제거
- [ ] 674개 기존 테스트 모두 통과
- [ ] ProductState 단위 테스트 작성
- [ ] 재고 변경 추적 가능

## Edge Cases & Special Handling

### 재고 관리 시나리오

1. **동시 재고 감소**: 여러 사용자가 동시에 구매할 때 재고 정확성
2. **재고 복원**: 주문 취소 시 재고 복원
3. **음수 방지**: 재고가 0 이하로 떨어지지 않도록 보장
4. **재고 알림**: 임계값 도달 시 자동 알림

### 상품 정보 관리

- 존재하지 않는 상품 ID 처리
- 잘못된 재고 수량 입력 검증
- 상품 정보 부분 업데이트 지원

### 성능 최적화

- 대량 상품 목록 처리
- 빈번한 재고 업데이트 최적화
- 메모리 사용량 관리

## Implementation Notes

- 재고 변경은 원자적 연산으로 처리
- 모든 상품 데이터는 불변 객체로 관리
- 재고 히스토리 로깅 기능 포함
- 에러 상황에 대한 기본값 제공

## Test Scenarios

### 단위 테스트 시나리오

1. **상품 목록 설정**: 초기 상품 데이터 로딩 및 검증
2. **재고 업데이트**: 정상 증감 및 경계값 테스트
3. **재고 상태 계산**: 품절/부족/정상 상태 정확성
4. **상품 필터링**: 재고별 상품 필터링 기능
5. **이벤트 발생**: 상품/재고 변경 시 알림 확인

### 통합 테스트 시나리오

1. **CartState 연동**: 장바구니 추가 시 재고 자동 감소
2. **UI 업데이트**: 재고 변경 시 ProductSelector 업데이트
3. **알림 시스템**: 재고 부족 시 NotificationBar 표시

## Integration Points

### 기존 코드와의 연동

```javascript
// Before: 전역 변수 직접 조작
prodList[0].q -= 1;
stockInfo['p1'] = { low: true, message: '재고 부족' };

// After: ProductState 액션 사용
ProductState.updateStock('p1', -1);
const stockInfo = ProductState.getStockInfo('p1');
```

### 컴포넌트 구독 패턴

```javascript
// ProductSelector.js
export class ProductSelector {
  static init() {
    ProductState.subscribe((action, state) => {
      if (action.type === 'STOCK_UPDATED') {
        this.updateOptions();
      }
    });
  }
}
```

## Risks & Mitigation

- **위험**: 재고 데이터 동기화 문제
- **완화**: 단일 진실 소스(Single Source of Truth) 원칙 적용

- **위험**: 성능 저하 (대량 상품 처리)
- **완화**: 지연 로딩 및 가상화 적용

## Related Stories

- Story 5.1: 장바구니 상태 관리 (재고 연동)
- Story 5.4: 할인 및 이벤트 상태 관리 (상품 정보 연동)
- Story 5.5: 상태 통합 및 옵저버 패턴

---

## Dev Agent Record

### Status: Ready for Development ⏳

### Dependencies

- Epic 3 StockCalculator
- Constants/Products.js
- Observer 패턴 구현

### Success Criteria

- 상품/재고 전역 변수 제거
- 실시간 재고 추적 구현
- 674개 테스트 통과 유지
