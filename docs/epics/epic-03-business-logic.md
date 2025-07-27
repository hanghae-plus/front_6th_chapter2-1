# Epic 3: 비즈니스 로직 분리 및 순수 함수화

## Epic Goal
main.basic.js의 복잡한 계산 로직을 테스트 가능한 순수 함수로 분리하여 유지보수성과 안정성 향상

## Epic Description

### 현재 문제점
- 계산 로직이 DOM 조작과 강결합
- 할인 계산, 포인트 계산이 하나의 거대한 함수에 혼재
- 테스트하기 어려운 구조
- 복잡한 조건문과 중첩된 계산

### 목표
- calculations/ 디렉토리에 순수 함수로 분리
- 단일 책임 원칙 적용
- 테스트 가능한 독립적인 모듈 구조
- 명확한 입력/출력 인터페이스

### 비즈니스 가치
- 할인 정책 변경 시 신속한 대응
- 계산 오류 최소화
- 새로운 할인 정책 추가 용이성
- 비즈니스 로직의 투명성 확보

## User Stories

### Story 3.1: 가격 및 할인 계산 엔진
**As a** 개발자  
**I want** 가격과 할인을 계산하는 독립적인 엔진  
**So that** 복잡한 할인 정책을 안정적으로 처리할 수 있다

**Acceptance Criteria:**
- [ ] PriceCalculator.js 생성
- [ ] calculateSubtotal(items) 순수 함수
- [ ] calculateItemDiscount(item, quantity) 함수
- [ ] calculateBulkDiscount(totalQuantity, subtotal) 함수
- [ ] calculateTuesdayDiscount(subtotal, isTuesday) 함수
- [ ] 모든 함수는 독립적으로 테스트 가능

### Story 3.2: 할인 엔진 및 정책 적용
**As a** 비즈니스 관리자  
**I want** 할인 정책이 명확하게 분리된 엔진  
**So that** 할인 규칙 변경 시 영향 범위를 최소화할 수 있다

**Acceptance Criteria:**
- [ ] DiscountEngine.js 생성
- [ ] applyDiscountPolicies(cart, rules) 메인 함수
- [ ] findBestDiscount(availableDiscounts) 함수
- [ ] isEligibleForDiscount(item, rule) 검증 함수
- [ ] 할인 중복 적용 로직 (번개세일 + 추천할인 = 25%)
- [ ] 화요일 할인과 다른 할인의 중첩 처리

### Story 3.3: 포인트 계산 시스템
**As a** 고객  
**I want** 투명하고 정확한 포인트 적립 계산  
**So that** 예상한 만큼의 포인트를 정확히 받을 수 있다

**Acceptance Criteria:**
- [ ] PointsCalculator.js 생성
- [ ] calculateBasePoints(finalAmount) 기본 포인트 함수
- [ ] calculateBonusPoints(cart, rules) 보너스 포인트 함수
- [ ] calculateSetBonus(items) 세트 구매 보너스
- [ ] calculateQuantityBonus(totalQuantity) 수량 보너스
- [ ] getTotalPoints(cart, finalAmount, isTuesday) 통합 함수

### Story 3.4: 재고 관리 및 상태 계산
**As a** 시스템  
**I want** 재고 상태를 정확히 계산하는 로직  
**So that** 재고 부족이나 품절 상황을 올바르게 처리할 수 있다

**Acceptance Criteria:**
- [ ] StockCalculator.js 생성
- [ ] checkStockAvailability(productId, quantity) 함수
- [ ] updateStock(productId, quantity) 함수
- [ ] getStockStatus(product) 상태 반환 함수
- [ ] isLowStock(quantity) 재고 부족 판단
- [ ] 재고 변경 이벤트 처리

## Definition of Done
- [ ] 모든 비즈니스 로직이 순수 함수로 분리
- [ ] calculations/ 디렉토리 구조 완성
- [ ] 각 함수별 단위 테스트 작성
- [ ] 674개 기존 테스트 모두 통과
- [ ] 함수 인터페이스 문서화

## Dependencies
- Epic 2 완료 (상수 구조 설정)
- 기존 계산 로직 분석

## Risks & Mitigation
- **위험**: 로직 분리 과정에서 계산 결과 변화
- **완화**: 기존 동작과 비교하는 통합 테스트 추가

## Success Metrics
- 순수 함수 분리율: 100%
- 함수별 단위 테스트 커버리지: 95% 이상
- 계산 정확도: 기존과 100% 일치
- 코드 복잡도 감소: 30% 이상
