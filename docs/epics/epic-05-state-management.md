# Epic 5: 상태 관리 구조화

## Epic Goal
전역 변수로 분산된 애플리케이션 상태를 중앙집중식으로 관리하여 데이터 일관성과 예측 가능성 확보

## Epic Description

### 현재 문제점
- 전역 변수 남용 (prodList, bonusPts, stockInfo, totalAmt 등)
- 상태 변경의 추적 어려움
- 컴포넌트 간 상태 동기화 문제
- 상태 변경 시 부작용 예측 불가

### 목표
- state/ 디렉토리에 중앙집중식 상태 관리
- Observer 패턴 적용으로 반응형 업데이트
- 상태 변경의 추적 가능성 확보
- React Redux와 유사한 구조로 설계

### 비즈니스 가치
- 데이터 일관성 보장
- 디버깅 및 문제 해결 효율성 향상
- 상태 기반 비즈니스 로직 최적화
- 실시간 UI 업데이트 정확성

## User Stories

### Story 5.1: 장바구니 상태 관리
**As a** 개발자  
**I want** 장바구니 상태가 중앙에서 관리되는 시스템  
**So that** 장바구니 변경 시 모든 관련 UI가 자동으로 업데이트된다

**Acceptance Criteria:**
- [ ] CartState.js 생성
- [ ] addItem(product, quantity) 액션
- [ ] updateQuantity(productId, quantity) 액션
- [ ] removeItem(productId) 액션
- [ ] getCartItems() 선택자
- [ ] getTotalQuantity() 선택자
- [ ] 상태 변경 시 이벤트 발생

### Story 5.2: 상품 및 재고 상태 관리
**As a** 시스템  
**I want** 상품과 재고 정보가 일관되게 관리되는 구조  
**So that** 재고 변경 시 모든 화면이 정확한 정보를 표시한다

**Acceptance Criteria:**
- [ ] ProductState.js 생성
- [ ] 상품 목록 상태 관리
- [ ] 재고 정보 실시간 업데이트
- [ ] updateStock(productId, change) 액션
- [ ] getAvailableProducts() 선택자
- [ ] getStockInfo(productId) 선택자
- [ ] 재고 부족/품절 상태 자동 계산

### Story 5.3: UI 상태 관리 (모달, 알림 등)
**As a** 사용자  
**I want** 모달과 알림이 일관되게 동작하는 UI  
**So that** 혼란 없이 애플리케이션을 사용할 수 있다

**Acceptance Criteria:**
- [ ] UIState.js 생성
- [ ] 모달 상태 관리 (열림/닫힘)
- [ ] 알림 상태 관리 (메시지, 타입, 지속시간)
- [ ] 로딩 상태 관리
- [ ] showModal(type, content) 액션
- [ ] showNotification(message, type) 액션
- [ ] 알림 자동 닫기 기능

### Story 5.4: 할인 및 이벤트 상태 관리
**As a** 비즈니스 관리자  
**I want** 할인 이벤트 상태가 정확히 관리되는 시스템  
**So that** 번개세일과 추천할인이 정확한 타이밍에 작동한다

**Acceptance Criteria:**
- [ ] DiscountState.js 생성
- [ ] 번개세일 상태 관리 (활성 상품, 남은 시간)
- [ ] 추천할인 상태 관리 (추천 상품, 남은 시간)
- [ ] 화요일 할인 상태 확인
- [ ] startFlashSale(productId) 액션
- [ ] startRecommendDiscount(productId) 액션
- [ ] 이벤트 타이머 관리

### Story 5.5: 상태 통합 및 옵저버 패턴
**As a** 개발자  
**I want** 모든 상태 변경을 감지하고 반응하는 시스템  
**So that** 상태 변경 시 필요한 컴포넌트만 업데이트할 수 있다

**Acceptance Criteria:**
- [ ] StateManager.js 메인 상태 관리자 생성
- [ ] Observer 패턴 구현
- [ ] subscribe(listener) 구독 기능
- [ ] unsubscribe(listener) 구독 해제
- [ ] notify(state, action) 알림 기능
- [ ] getState() 전체 상태 접근자
- [ ] 상태 변경 로그 기능

## Definition of Done
- [ ] 모든 전역 변수가 상태 관리로 이전
- [ ] state/ 디렉토리 구조 완성
- [ ] Observer 패턴 정상 작동
- [ ] 674개 기존 테스트 모두 통과
- [ ] 상태 변경 추적 가능

## Dependencies
- Epic 4 완료 (UI 컴포넌트 분리)
- Epic 3 완료 (비즈니스 로직 분리)

## Risks & Mitigation
- **위험**: 상태 관리 전환 시 데이터 동기화 문제
- **완화**: 단계별 전환 및 상태 검증 도구 사용

## Success Metrics
- 전역 변수 제거율: 100%
- 상태 동기화 정확도: 100%
- 상태 변경 추적률: 100%
- UI 업데이트 반응 시간: <100ms
