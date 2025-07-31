# Basic 모듈 아키텍처 가이드

## 1. 개요

`/src/basic` 디렉토리는 쇼핑 카트 애플리케이션의 모듈화된 버전입니다. 이 문서는 다른 개발자들이 코드 구조를 이해하고 유지보수할 수 있도록 작성되었습니다.

## 2. 디렉토리 구조

```
src/basic/
├── services/          # 🎯 비즈니스 로직
│   ├── cartService.js     # 장바구니 계산, 포인트 계산
│   └── productService.js  # 상품 관리, 상품 검색
├── ui/               # 🎨 모든 UI 관련 코드
│   ├── cartUI.js     # 장바구니 UI (통합됨)
│   ├── productUI.js  # 상품 UI
│   ├── eventUI.js    # 이벤트 UI
│   └── uiHelpers.js  # UI 헬퍼 함수들
├── utils/            # 🔧 유틸리티 함수들
├── constants/        # 📋 상수들
├── app/             # 🚀 앱 초기화 및 이벤트 핸들러
├── types/           # 📝 타입 정의
├── __tests__/       # 🧪 테스트 파일들
└── main.basic.js    # 🎬 애플리케이션 진입점
```

## 3. 아키텍처 원칙

### 3.1 관심사 분리 (Separation of Concerns)

- **서비스 로직**: 순수한 비즈니스 로직만 포함
- **UI 로직**: 사용자 인터페이스 관련 코드만 포함
- **유틸리티**: 재사용 가능한 헬퍼 함수들
- **상수**: 설정값과 템플릿 정의

### 3.2 모듈화

- 각 기능이 독립적인 모듈로 분리
- 명확한 인터페이스 정의
- 의존성 최소화

### 3.3 테스트 가능성

- 서비스 로직은 UI와 독립적으로 테스트 가능
- 모든 기능에 대한 단위 테스트 제공

## 4. 핵심 모듈 상세 설명

### 4.1 Services (비즈니스 로직)

#### `cartService.js`

장바구니 관련 비즈니스 로직을 담당합니다.

**주요 함수:**

- `calculateCartTotal()`: 장바구니 총액 계산
- `calculateBonusPoints()`: 포인트 적립 계산
- `getStockTotal()`: 전체 재고 계산

**특징:**

- UI 의존성 없음
- 순수 함수로 구현
- 테스트 용이성 보장

#### `productService.js`

상품 관리 관련 비즈니스 로직을 담당합니다.

**주요 함수:**

- `initializeProductList()`: 상품 목록 초기화
- `findProductById()`: 상품 ID로 상품 검색
- `updateProductStock()`: 상품 재고 업데이트

### 4.2 UI (사용자 인터페이스)

#### `productUI.js`

상품 관련 UI 생성과 업데이트를 담당합니다.

**주요 함수:**

- `createUserInterface()`: 전체 UI 생성
- `updateSelectOptions()`: 상품 선택 옵션 업데이트
- `createProductDisplayText()`: 상품 표시 텍스트 생성

**특징:**

- 템플릿 기반 UI 생성
- `uiHelpers.js` 활용
- 반응형 디자인 지원

#### `cartUI.js`

장바구니 관련 UI 기능을 담당합니다.

**주요 함수:**

- `createCartItemElement()`: 장바구니 아이템 생성
- `updateStockInfo()`: 재고 정보 업데이트
- `updatePricesInCart()`: 장바구니 내 가격 업데이트

**특징:**

- 할인 정보 자동 계산
- 실시간 재고 반영
- 템플릿 기반 렌더링

#### `eventUI.js`

이벤트 관련 UI 업데이트를 담당합니다.

**주요 함수:**

- `updateTuesdaySpecialDisplay()`: 화요일 특별 할인 표시
- `updateOrderSummary()`: 주문 요약 업데이트
- `updateBonusPoints()`: 포인트 정보 업데이트

#### `uiHelpers.js`

UI 생성에 필요한 공통 헬퍼 함수들을 제공합니다.

**주요 함수:**

- `createUIElement()`: HTML 템플릿에서 DOM 요소 생성
- `bindTemplate()`: 템플릿에 데이터 바인딩
- `setElementAttributes()`: 요소 속성 설정

### 4.3 Utils (유틸리티)

#### `businessLogic.js`

핵심 비즈니스 로직을 담당합니다.

**주요 함수:**

- `calculateCartTotals()`: 장바구니 총액 및 할인 계산
- `extractCartItemInfo()`: 장바구니 아이템 정보 추출

#### `validation.js`

입력 검증 로직을 담당합니다.

**주요 함수:**

- `validateQuantity()`: 수량 유효성 검사
- `validateProductAvailability()`: 상품 가용성 검사

#### `errorHandler.js`

에러 처리 로직을 담당합니다.

**주요 클래스:**

- `CartError`: 장바구니 관련 에러 클래스
- `ERROR_CODES`: 에러 코드 상수

### 4.4 App (애플리케이션 로직)

#### `appInit.js`

애플리케이션 초기화를 담당합니다.

**주요 함수:**

- `initializeShoppingCart()`: 쇼핑 카트 초기화
- 상품 목록 초기화
- 이벤트 리스너 설정

#### `eventHandlers.js`

사용자 상호작용 이벤트를 처리합니다.

**주요 함수:**

- `handleAddToCart()`: 장바구니 추가 처리
- `handleQuantityChange()`: 수량 변경 처리
- `setupEventListeners()`: 이벤트 리스너 설정

#### `promotions.js`

프로모션 기능을 관리합니다.

**주요 함수:**

- `startLightningSale()`: 번개세일 시작
- `startSuggestSale()`: 추천할인 시작

### 4.5 Constants (상수)

#### `productConstants.js`

상품 관련 상수를 정의합니다.

**주요 상수:**

- `LOW_STOCK_THRESHOLD`: 재고 부족 임계값
- `LIGHTNING_SALE_RATE`: 번개세일 할인율
- `SUGGEST_SALE_RATE`: 추천할인 할인율

#### `uiTemplates.js`

UI 템플릿을 정의합니다.

**주요 템플릿:**

- `CART_ITEM_TEMPLATE`: 장바구니 아이템 템플릿
- `PRODUCT_OPTION_TEMPLATE`: 상품 옵션 템플릿
- `HEADER_TEMPLATE`: 헤더 템플릿

## 5. 데이터 흐름

### 5.1 장바구니 추가 플로우

```
사용자 클릭 → eventHandlers.js → validation.js → cartService.js → cartUI.js → DOM 업데이트
```

### 5.2 할인 계산 플로우

```
상품 선택 → businessLogic.js → cartService.js → eventUI.js → DOM 업데이트
```

### 5.3 포인트 계산 플로우

```
장바구니 변경 → cartService.js → eventUI.js → DOM 업데이트
```

## 6. 상태 관리

### 6.1 전역 상태 (appState)

```javascript
const appState = {
  productList: [], // 상품 목록
  cartDisplay: null, // 장바구니 표시 요소
  productSelector: null, // 상품 선택 요소
  addToCartButton: null, // 장바구니 추가 버튼
  stockInfo: null, // 재고 정보 요소
  sumElement: null, // 총액 표시 요소
  totalAmount: 0, // 총액
  itemCount: 0, // 상품 개수
  lastSelectedProduct: null, // 마지막 선택된 상품
  isTuesday: false, // 화요일 여부
};
```

### 6.2 상태 업데이트 패턴

- 상태 변경은 서비스 레이어에서 처리
- UI 업데이트는 이벤트 핸들러에서 트리거
- 실시간 반영을 위한 이벤트 기반 구조

## 7. 테스트 전략

### 7.1 테스트 구조

- **단위 테스트**: 각 모듈별 독립 테스트
- **통합 테스트**: 모듈 간 상호작용 테스트
- **E2E 테스트**: 전체 사용자 시나리오 테스트

### 7.2 테스트 커버리지

- 모든 서비스 함수에 대한 단위 테스트
- 모든 UI 컴포넌트에 대한 렌더링 테스트
- 모든 비즈니스 로직에 대한 검증 테스트

## 8. 확장성 고려사항

### 8.1 새로운 기능 추가

1. **서비스 레이어**: 새로운 비즈니스 로직 추가
2. **UI 레이어**: 새로운 UI 컴포넌트 추가
3. **상수 정의**: 새로운 설정값 추가
4. **테스트 작성**: 새로운 기능에 대한 테스트 추가

### 8.2 모듈 분리 기준

- **기능별 분리**: 장바구니, 상품, 프로모션 등
- **책임별 분리**: 비즈니스 로직, UI, 유틸리티 등
- **의존성 최소화**: 모듈 간 결합도 최소화

## 9. 성능 최적화

### 9.1 렌더링 최적화

- 템플릿 기반 UI 생성으로 DOM 조작 최소화
- 이벤트 위임을 통한 메모리 사용량 최적화
- 불필요한 리렌더링 방지

### 9.2 계산 최적화

- 캐싱을 통한 중복 계산 방지
- 지연 계산을 통한 초기 로딩 시간 단축
- 메모이제이션을 통한 성능 향상

## 10. 디버깅 가이드

### 10.1 로그 레벨

- **ERROR**: 에러 상황
- **WARN**: 경고 상황
- **INFO**: 일반 정보
- **DEBUG**: 디버깅 정보

### 10.2 디버깅 도구

- 브라우저 개발자 도구 활용
- 콘솔 로그를 통한 상태 추적
- 네트워크 탭을 통한 API 호출 확인

## 11. 배포 고려사항

### 11.1 빌드 최적화

- 모듈 번들링을 통한 파일 크기 최적화
- 코드 분할을 통한 로딩 시간 단축
- 압축을 통한 전송 크기 최소화

### 11.2 환경 설정

- 개발/스테이징/프로덕션 환경 분리
- 환경별 설정 파일 관리
- 환경 변수를 통한 설정 주입

## 12. 결론

이 아키텍처는 다음과 같은 장점을 제공합니다:

- **유지보수성**: 명확한 모듈 분리로 코드 이해도 향상
- **확장성**: 새로운 기능 추가가 용이
- **테스트 가능성**: 각 모듈을 독립적으로 테스트 가능
- **성능**: 최적화된 렌더링과 계산 로직
- **협업성**: 명확한 책임 분리로 팀 협업 효율성 증대

이 문서를 참고하여 코드를 이해하고 새로운 기능을 추가할 때 활용하시기 바랍니다.
