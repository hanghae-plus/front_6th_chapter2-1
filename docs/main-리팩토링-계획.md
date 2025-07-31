# main 함수 리팩토링 계획

## 현재 main 함수 분석

### 현재 main 함수의 책임들:

1. **초기화**: 상태 변수 초기화
2. **DOM 요소 생성**: 컴포넌트 생성 및 조립
3. **이벤트 리스너 설정**: 번개세일, 추천할인 타이머
4. **초기 상태 설정**: 상품 옵션 업데이트, 장바구니 계산

### 문제점:

- **God Function**: 너무 많은 책임을 가짐
- **타이머 로직**: 복잡한 비즈니스 로직이 main에 포함
- **하드코딩된 값들**: 매직 넘버들이 산재
- **가독성**: 긴 함수로 인한 이해 어려움

## 리팩토링 계획 - 세부 태스크

### Phase 1: 타이머 로직 분리 (우선순위: 높음)

#### Task 1.1: LightningSaleTimer 컴포넌트 생성

- **파일**: `src/basic/components/LightningSaleTimer.js`
- **책임**: 번개세일 타이머 관리
- **함수**: `createLightningSaleTimer()`
- **반환값**: 타이머 시작/중지 메서드

#### Task 1.2: SuggestionSaleTimer 컴포넌트 생성

- **파일**: `src/basic/components/SuggestionSaleTimer.js`
- **책임**: 추천할인 타이머 관리
- **함수**: `createSuggestionSaleTimer()`
- **반환값**: 타이머 시작/중지 메서드

#### Task 1.3: TimerManager 컴포넌트 생성

- **파일**: `src/basic/components/TimerManager.js`
- **책임**: 모든 타이머 통합 관리
- **함수**: `createTimerManager()`
- **반환값**: 전체 타이머 시작/중지 메서드

### Phase 2: 초기화 로직 분리 (우선순위: 높음)

#### Task 2.1: AppInitializer 컴포넌트 생성

- **파일**: `src/basic/components/AppInitializer.js`
- **책임**: 앱 초기화 로직
- **함수**: `initializeApp()`
- **기능**:
  - 상태 변수 초기화
  - 초기 상품 옵션 설정
  - 초기 장바구니 계산

#### Task 2.2: DOMAssembler 컴포넌트 생성

- **파일**: `src/basic/components/DOMAssembler.js`
- **책임**: DOM 요소 조립
- **함수**: `assembleDOM()`
- **기능**: 모든 컴포넌트를 root에 조립

### Phase 3: 이벤트 리스너 분리 (우선순위: 중간)

#### Task 3.1: EventManager 컴포넌트 생성

- **파일**: `src/basic/components/EventManager.js`
- **책임**: 모든 이벤트 리스너 관리
- **함수**: `createEventManager()`
- **기능**:
  - Add to Cart 버튼 이벤트
  - 장바구니 아이템 이벤트
  - 수량 변경 이벤트

#### Task 3.2: CartEventHandler 분리

- **파일**: `src/basic/handlers/CartEventHandler.js`
- **책임**: 장바구니 관련 이벤트 처리
- **함수**:
  - `handleAddToCart()`
  - `handleQuantityChange()`
  - `handleRemoveItem()`

### Phase 4: 상수 및 설정 분리 (우선순위: 중간)

#### Task 4.1: AppConfig 생성

- **파일**: `src/basic/config/AppConfig.js`
- **책임**: 앱 전체 설정 관리
- **내용**:
  - 타이머 설정
  - UI 설정
  - 기능 플래그

#### Task 4.2: FeatureFlags 생성

- **파일**: `src/basic/config/FeatureFlags.js`
- **책임**: 기능 활성화/비활성화 관리
- **기능**:
  - 번개세일 활성화
  - 추천할인 활성화
  - 화요일 할인 활성화

### Phase 5: main 함수 간소화 (우선순위: 높음)

#### Task 5.1: main 함수 리팩토링

- **목표**: main 함수를 20줄 이하로 단축
- **새로운 구조**:

```javascript
function main() {
  // 1. 앱 초기화
  const appState = initializeApp();

  // 2. DOM 조립
  const domElements = assembleDOM();

  // 3. 이벤트 매니저 설정
  const eventManager = createEventManager(domElements, appState);

  // 4. 타이머 매니저 설정
  const timerManager = createTimerManager(domElements, appState);

  // 5. 앱 시작
  timerManager.startAll();
}
```

### Phase 6: 테스트 및 검증 (우선순위: 높음)

#### Task 6.1: 컴포넌트별 단위 테스트 작성

- **파일**: `src/basic/__tests__/components/`
- **테스트 대상**:
  - LightningSaleTimer.test.js
  - SuggestionSaleTimer.test.js
  - AppInitializer.test.js
  - EventManager.test.js

#### Task 6.2: 통합 테스트 작성

- **파일**: `src/basic/__tests__/integration/`
- **테스트 대상**:
  - main.test.js (main 함수 통합 테스트)
  - timer-integration.test.js (타이머 통합 테스트)

### Phase 7: 문서화 및 최적화 (우선순위: 낮음)

#### Task 7.1: 컴포넌트 문서화

- **파일**: `docs/components/`
- **문서**:
  - 컴포넌트 구조도
  - API 문서
  - 사용 예시

#### Task 7.2: 성능 최적화

- **목표**: 메모리 누수 방지
- **작업**:
  - 타이머 정리 로직 추가
  - 이벤트 리스너 정리 로직 추가

## 실행 순서

1. **Phase 1** → **Phase 2** → **Phase 5** (핵심 기능)
2. **Phase 6** (테스트)
3. **Phase 3** → **Phase 4** (추가 개선)
4. **Phase 7** (문서화)

## 현재 완료된 작업

### ✅ 완료된 컴포넌트들:

- **Header 컴포넌트**: `src/basic/components/Header.js`
- **ManualToggle 컴포넌트**: `src/basic/components/ManualToggle.js`
- **MainLayout 컴포넌트**: `src/basic/components/MainLayout.js`

### 🔄 진행 중인 작업:

- main 함수의 타이머 로직 분리

### 📋 다음 작업:

- Phase 1: 타이머 로직 분리 시작

## 성공 기준

1. **main 함수 길이**: 20줄 이하
2. **단일 책임 원칙**: 각 컴포넌트가 하나의 명확한 책임
3. **테스트 커버리지**: 90% 이상
4. **기능 동일성**: 기존 기능과 완전히 동일한 동작
5. **가독성**: 코드 이해가 쉬워짐
