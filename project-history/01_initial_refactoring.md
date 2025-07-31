# 1단계: 초기 리팩토링 - 파일 분리 및 구조 설정

## 1. 목표

거대하고 모든 기능이 얽혀있는 `main.basic.js` 파일을 기능적 책임에 따라 여러 개의 독립적인 모듈로 분리한다. 이 단계는 본격적인 클린 코드 적용에 앞서, 안전하고 점진적인 리팩토링을 위한 기반을 마련하는 것을 목표로 한다.

## 2. 논의 및 설계 과정

### 초기 아이디어

- **MVC (Model-View-Controller) 유사 패턴 도입:** 상태(Model), UI(View), 사용자 입력(Controller)을 분리하여 코드의 관심사를 명확히 나눈다.
- **Observer 패턴 활용:** 상태가 변경될 때 UI가 자동으로 업데이트되도록 `subscribe` 모델을 구현한다.
- **React와 유사한 구조:** 향후 React로의 마이그레이션을 고려하여, 컴포넌트 기반 렌더링과 단방향 데이터 흐름을 지향한다.

### 최종 실행 계획

논의 결과, 한 번에 이상적인 구조로 변경하는 것은 위험 부담이 크다고 판단. 다음과 같이 **기존 코드를 그대로 기능 단위로 분리**하는 것을 우선 목표로 설정했다.

1.  **ES 모듈 전환:** `index.basic.html`이 `<script type="module">`을 사용하도록 설정하고, `main.basic.js`를 `app.js`로 변경하여 모듈 시스템의 진입점으로 삼는다.
2.  **임시 레거시 파일 생성:** 기존 `main.basic.js`의 모든 코드를 `legacy.js`로 옮겨 백업한다.
3.  **점진적 분리:** `legacy.js`에서 각 기능별로 코드를 새로운 모듈 파일로 점진적으로 옮긴다.

## 3. 실행된 작업 내역

### 3.1. 초기 파일 구조 설정 (커밋: `bfa2d57`)

- `main.basic.js` -> `app.js`로 이름 변경.
- `legacy.js` 파일을 생성하고 기존 코드를 모두 이동.
- `index.basic.html`이 `app.js`를 로드하도록 수정.

### 3.2. 상수 분리 (커밋: `34614fd`)

- `src/basic/constants.js` 파일 생성.
- `legacy.js`에 하드코딩되어 있던 모든 매직 넘버와 문자열(상품 ID, 할인율, 임계값 등)을 의미 있는 상수로 추출하여 이전.
- `legacy.js`가 `constants.js`를 `import`하여 사용하도록 수정.

### 3.3. 상태 중앙화 (커밋: `77c0025`)

- `src/basic/state.js` 파일 생성.
- 전역 변수로 흩어져 있던 모든 상태(`prodList`, `totalAmt` 등)를 중앙 `state` 객체로 통합하여 이전.
- `legacy.js`가 `state.js`를 `import`하여 상태를 참조하도록 수정.

### 3.4. DOM 생성 로직 분리 (커밋: `8e309e0`)

- `src/basic/view.js` 파일 생성.
- 초기 UI 구조를 생성하는 `createInitialDOM` 함수를 정의하고, 관련 코드를 `legacy.js`에서 이전.
- `legacy.js`가 `view.js`를 `import`하여 UI 생성을 위임.

### 3.5. 이벤트 리스너 분리 (커밋: `2c94e16`)

- `src/basic/events.js` 파일 생성.
- 사용자의 클릭 입력을 처리하는 `setupEventListeners` 함수를 정의하고, 관련 코드를 `legacy.js`에서 이전.
- `legacy.js`가 `events.js`를 `import`하여 이벤트 처리를 위임.

### 3.6. 비동기 서비스 분리 (커밋: `8882b46`)

- `src/basic/services.js` 파일 생성.
- 번개 세일, 추천 할인 등 `setTimeout`/`setInterval`을 사용하는 비동기 로직을 `startTimers` 함수로 분리하여 이전.
- `legacy.js`가 `services.js`를 `import`하여 비동기 작업 시작을 위임.

## 4. 1단계 완료 후 상태

- `legacy.js`는 각 모듈을 가져와 조립하고 실행하는 역할만 남게 되었다.
- 모든 기능이 각자의 책임에 따라 독립적인 파일로 분리되었다.
- 코드의 구조가 명확해지고, 본격적인 클린 코드 리팩토링을 시작할 준비가 완료되었다.
