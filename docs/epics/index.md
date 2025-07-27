# 브라운필드 리팩터링 프로젝트 - 에픽 개요

## 🎯 프로젝트 목표
787줄의 레거시 main.basic.js를 React-ready 모듈 구조로 리팩터링하면서 674개 테스트 케이스 100% 통과 유지

## 📋 에픽 로드맵

### Phase 1: 기반 설정
- **[Epic 1: 리팩터링 준비 및 기반 설정](./epic-01-foundation.md)**
  - 개발 환경 설정 (TypeScript, ESLint, Prettier, VSCode)
  - 프로젝트 구조 설계 (React-ready 디렉토리)
  - 테스트 기반 리팩터링 전략 수립

### Phase 2: 데이터 구조화
- **[Epic 2: 상수 및 데이터 구조 정리](./epic-02-constants.md)**
  - 상품 정보 상수화 (Products.js)
  - 할인 정책 상수화 (DiscountRates.js)
  - 포인트 정책 및 UI 상수화

### Phase 3: 로직 분리
- **[Epic 3: 비즈니스 로직 분리 및 순수 함수화](./epic-03-business-logic.md)**
  - 가격 및 할인 계산 엔진 (PriceCalculator.js)
  - 할인 엔진 및 정책 적용 (DiscountEngine.js)
  - 포인트 계산 시스템 (PointsCalculator.js)
  - 재고 관리 및 상태 계산 (StockCalculator.js)

### Phase 4: UI 모듈화
- **[Epic 4: UI 컴포넌트화 및 DOM 분리](./epic-04-ui-components.md)**
  - 상품 선택 컴포넌트 (ProductSelector)
  - 장바구니 디스플레이 컴포넌트 (CartDisplay)
  - 주문 요약 컴포넌트 (OrderSummary)
  - 도움말 모달 컴포넌트 (HelpModal)
  - 재고 정보 및 알림 컴포넌트 (StockInfo, NotificationBar)

### Phase 5: 상태 통합
- **[Epic 5: 상태 관리 구조화](./epic-05-state-management.md)**
  - 장바구니 상태 관리 (CartState.js)
  - 상품 및 재고 상태 관리 (ProductState.js)
  - UI 상태 관리 (UIState.js)
  - 할인 및 이벤트 상태 관리 (DiscountState.js)
  - 상태 통합 및 옵저버 패턴 (StateManager.js)

### Phase 6: 검증 및 완성
- **[Epic 6: 통합 테스트 및 최종 검증](./epic-06-testing-validation.md)**
  - 기능 완정성 검증 (674개 테스트 100% 통과)
  - 성능 및 품질 검증
  - React 전환 준비도 검증
  - 문서화 및 가이드라인 완성
  - 배포 및 롤백 준비

## 🎯 성공 지표

### 기술적 지표
- **테스트 통과율**: 674개 테스트 100% 통과 유지
- **코드 품질**: ESLint 0 에러, TypeScript 0 컴파일 에러
- **성능**: 페이지 로딩 속도 유지 또는 개선
- **커버리지**: 새로운 모듈 90% 이상 테스트 커버리지

### 아키텍처 지표
- **모듈화**: 787줄 → 20개 이상 독립 모듈로 분리
- **결합도**: 컴포넌트 간 의존성 최소화
- **재사용성**: 컴포넌트 재사용률 80% 이상
- **React 준비도**: 최소 변경으로 React 전환 가능

### 비즈니스 지표
- **유지보수성**: 새로운 기능 추가 시간 50% 단축
- **안정성**: 버그 발생률 감소
- **개발 효율성**: 코드 리뷰 시간 단축
- **팀 만족도**: 8/10 이상

## 📅 예상 일정
- **Total**: 8-10 주 (각 에픽 1-2주)
- **Epic 1**: 1주 (기반 설정)
- **Epic 2**: 1주 (상수화)
- **Epic 3**: 2주 (비즈니스 로직)
- **Epic 4**: 2주 (UI 컴포넌트)
- **Epic 5**: 1.5주 (상태 관리)
- **Epic 6**: 1.5주 (테스트 및 검증)

## 🔗 관련 문서
- [PRD 문서](../01-PRD.md)
- [브라운필드 아키텍처](../brownfield-architecture.md)
- [스토리 디렉토리](../stories/)
