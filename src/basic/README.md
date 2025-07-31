# 쇼핑카트 애플리케이션 - 클린코드 버전

## 개요

이 프로젝트는 기존의 더티코드를 클린코드 원칙에 따라 리팩토링한 쇼핑카트 애플리케이션입니다.

## 파일 구조

```
src/basic/
├── main.basic.js          # 원본 더티코드 (763줄)
├── main.clean.js          # 리팩토링된 메인 파일 (13줄)
├── App.js                 # 메인 애플리케이션 클래스
├── constants.js           # 상수 정의
├── models/                # 데이터 모델
│   ├── Product.js         # 상품 모델
│   └── CartItem.js        # 장바구니 아이템 모델
└── services/              # 비즈니스 로직 서비스
    ├── ProductService.js  # 상품 관리 서비스
    ├── CartService.js     # 장바구니 관리 서비스
    ├── DiscountService.js # 할인 계산 서비스
    ├── PointService.js    # 포인트 계산 서비스
    ├── UIService.js       # UI 렌더링 서비스
    └── EventService.js    # 이벤트 관리 서비스
```

## 주요 개선사항

### 1. 관심사 분리 (Separation of Concerns)

- **데이터**: `models/` 디렉토리에서 데이터 구조 정의
- **비즈니스 로직**: `services/` 디렉토리에서 각 기능별 서비스 분리
- **UI**: `UIService`에서 UI 렌더링 로직 분리
- **이벤트**: `EventService`에서 이벤트 처리 로직 분리

### 2. 단일 책임 원칙 (Single Responsibility Principle)

- 각 클래스가 하나의 명확한 책임을 가짐
- `ProductService`: 상품 관리만 담당
- `CartService`: 장바구니 관리만 담당
- `DiscountService`: 할인 계산만 담당

### 3. 의존성 주입 (Dependency Injection)

- 서비스 간 의존성을 생성자를 통해 주입
- 테스트와 유지보수가 용이

### 4. 상수 분리

- 매직 넘버와 하드코딩된 값들을 `constants.js`로 분리
- 설정 변경이 용이

### 5. 일관된 네이밍

- 변수명과 함수명을 일관되게 통일
- 의미있는 이름 사용

## 사용법

### 기본 사용

```javascript
import { ShoppingCartApp } from "./App.js";

const app = new ShoppingCartApp();
app.init();
```

### 서비스 접근

```javascript
// 상품 서비스
const productService = app.getProductService();
const products = productService.getProducts();

// 장바구니 서비스
const cartService = app.getCartService();
const cartItems = cartService.getItems();

// UI 서비스
const uiService = app.getUIService();
uiService.updateUI();
```

## React + TypeScript 마이그레이션 준비

이 리팩토링된 코드는 React + TypeScript로의 마이그레이션을 고려하여 설계되었습니다:

### 1. 모듈화된 구조

- 각 서비스가 독립적인 모듈로 분리되어 있어 React 컴포넌트로 쉽게 변환 가능
- `ProductService` → `useProducts` 훅
- `CartService` → `useCart` 훅
- `UIService` → React 컴포넌트

### 2. 타입 안전성 준비

- 클래스 기반 구조로 TypeScript 인터페이스 정의 용이
- 명확한 데이터 모델로 타입 정의 가능

### 3. 상태 관리 준비

- 서비스 클래스들이 상태 관리 로직을 포함
- Redux, Zustand 등으로 쉽게 변환 가능

## 코드 품질 개선

### Before (더티코드)

- 763줄의 단일 파일
- 전역 변수 남용
- 긴 함수들
- 중복 코드
- 하드코딩된 값들

### After (클린코드)

- 13개의 모듈로 분리
- 클래스 기반 구조
- 작은 단위의 함수들
- 재사용 가능한 코드
- 상수 분리

## 테스트 용이성

각 서비스가 독립적으로 분리되어 있어 단위 테스트 작성이 용이합니다:

```javascript
// ProductService 테스트 예시
describe("ProductService", () => {
  it("should apply lightning sale correctly", () => {
    const productService = new ProductService();
    const luckyProduct = productService.applyLightningSale();
    expect(luckyProduct.onSale).toBe(true);
  });
});
```

## 성능 개선

- 불필요한 DOM 조작 최소화
- 이벤트 위임 사용
- 메모리 누수 방지를 위한 이벤트 리스너 정리

## 확장성

새로운 기능 추가가 용이한 구조:

1. 새로운 할인 정책: `DiscountService`에 메서드 추가
2. 새로운 상품 타입: `Product` 모델 확장
3. 새로운 UI 컴포넌트: `UIService`에 메서드 추가
