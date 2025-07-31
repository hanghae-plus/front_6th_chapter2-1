# Basic 모듈 API 참조 문서

## 1. 개요

이 문서는 `/src/basic` 모듈의 주요 함수들과 API를 정리한 참조 문서입니다. 개발자들이 코드를 이해하고 새로운 기능을 추가할 때 빠르게 참고할 수 있도록 작성되었습니다.

## 2. Services API

### 2.1 CartService

#### `calculateCartTotal(cartItems, productList, appState)`

장바구니 총액을 계산합니다.

**Parameters:**

- `cartItems` (Array): 장바구니 아이템들
- `productList` (Array): 상품 목록
- `appState` (Object): 앱 상태

**Returns:**

- `Object`: 계산 결과 객체

**Example:**

```javascript
import { calculateCartTotal } from "../services/cartService.js";

const result = calculateCartTotal(cartItems, productList, appState);
console.log(result.totalAmount); // 총액
console.log(result.discountAmount); // 할인액
```

#### `calculateBonusPoints(cartItems, productList, appState, totalAmount)`

보너스 포인트를 계산합니다.

**Parameters:**

- `cartItems` (Array): 장바구니 아이템들
- `productList` (Array): 상품 목록
- `appState` (Object): 앱 상태
- `totalAmount` (number): 총액

**Returns:**

- `Object`: `{ finalPoints, pointsDetail }`

**Example:**

```javascript
import { calculateBonusPoints } from "../services/cartService.js";

const pointsResult = calculateBonusPoints(cartItems, productList, appState, totalAmount);
console.log(pointsResult.finalPoints); // 최종 포인트
console.log(pointsResult.pointsDetail); // 포인트 상세 내역
```

#### `getStockTotal(productList)`

전체 재고를 계산합니다.

**Parameters:**

- `productList` (Array): 상품 목록

**Returns:**

- `number`: 전체 재고 수량

### 2.2 ProductService

#### `initializeProductList()`

상품 목록을 초기화합니다.

**Returns:**

- `Array`: 초기화된 상품 목록

**Example:**

```javascript
import { initializeProductList } from "../services/productService.js";

const productList = initializeProductList();
```

#### `findProductById(productList, productId)`

상품 ID로 상품을 찾습니다.

**Parameters:**

- `productList` (Array): 상품 목록
- `productId` (string): 상품 ID

**Returns:**

- `Object|null`: 찾은 상품 또는 null

## 3. UI API

### 3.1 ProductUI

#### `createUserInterface()`

전체 사용자 인터페이스를 생성합니다.

**Returns:**

- `Object`: UI 요소들의 참조

**Example:**

```javascript
import { createUserInterface } from "../ui/productUI.js";

const uiElements = createUserInterface();
// uiElements.cartDisplay, uiElements.productSelector 등
```

#### `updateSelectOptions(selector, productList)`

상품 선택 옵션을 업데이트합니다.

**Parameters:**

- `selector` (HTMLElement): 상품 선택 요소
- `productList` (Array): 상품 목록

### 3.2 CartUI

#### `createCartItemElement(product)`

새로운 장바구니 아이템을 생성합니다.

**Parameters:**

- `product` (Object): 상품 객체

**Returns:**

- `Element`: 생성된 장바구니 아이템 DOM 요소

#### `updateStockInfo(productList)`

재고 정보를 업데이트합니다.

**Parameters:**

- `productList` (Array): 상품 목록

#### `updatePricesInCart(cartItems, productList)`

장바구니 내 가격을 업데이트합니다.

**Parameters:**

- `cartItems` (Array): 장바구니 아이템들
- `productList` (Array): 상품 목록

### 3.3 EventUI

#### `updateTuesdaySpecialDisplay(isTuesday)`

화요일 특별 할인 표시를 업데이트합니다.

**Parameters:**

- `isTuesday` (boolean): 화요일 여부

#### `updateOrderSummary(calculationResult, appState)`

주문 요약을 업데이트합니다.

**Parameters:**

- `calculationResult` (Object): 계산 결과
- `appState` (Object): 앱 상태

#### `updateBonusPoints(pointsResult)`

포인트 정보를 업데이트합니다.

**Parameters:**

- `pointsResult` (Object): 포인트 계산 결과

### 3.4 UIHelpers

#### `createUIElement(template)`

HTML 템플릿에서 DOM 요소를 생성합니다.

**Parameters:**

- `template` (string): HTML 템플릿

**Returns:**

- `HTMLElement`: 생성된 DOM 요소

#### `bindTemplate(template, data)`

템플릿에 데이터를 바인딩합니다.

**Parameters:**

- `template` (string): 템플릿 문자열
- `data` (Object): 바인딩할 데이터

**Returns:**

- `string`: 바인딩된 템플릿

#### `setElementAttributes(element, attributes)`

요소의 속성을 설정합니다.

**Parameters:**

- `element` (HTMLElement): 대상 요소
- `attributes` (Object): 설정할 속성들

## 4. Utils API

### 4.1 BusinessLogic

#### `calculateCartTotals(cartItemInfo, productList, options)`

장바구니 총액 및 할인을 계산합니다.

**Parameters:**

- `cartItemInfo` (Array): 장바구니 아이템 정보
- `productList` (Array): 상품 목록
- `options` (Object): 계산 옵션

**Returns:**

- `Object`: 계산 결과

#### `extractCartItemInfo(cartItems)`

장바구니 아이템 정보를 추출합니다.

**Parameters:**

- `cartItems` (Array): 장바구니 아이템들

**Returns:**

- `Array`: 추출된 아이템 정보

### 4.2 Validation

#### `validateQuantity(newQuantity, currentQuantity, maxQuantity)`

수량 유효성을 검사합니다.

**Parameters:**

- `newQuantity` (number): 새로운 수량
- `currentQuantity` (number): 현재 수량
- `maxQuantity` (number): 최대 수량

**Returns:**

- `Object`: 검증 결과

#### `validateProductAvailability(product, requestedQuantity)`

상품 가용성을 검사합니다.

**Parameters:**

- `product` (Object): 상품 객체
- `requestedQuantity` (number): 요청 수량

**Returns:**

- `Object`: 검증 결과

### 4.3 ErrorHandler

#### `CartError`

장바구니 관련 에러 클래스입니다.

**Properties:**

- `code` (string): 에러 코드
- `message` (string): 에러 메시지
- `type` (string): 에러 타입

**Example:**

```javascript
import { CartError, ERROR_CODES } from "../utils/errorHandler.js";

throw new CartError(ERROR_CODES.INSUFFICIENT_STOCK, "재고가 부족합니다.");
```

## 5. App API

### 5.1 AppInit

#### `initializeShoppingCart(appState)`

쇼핑 카트를 초기화합니다.

**Parameters:**

- `appState` (Object): 앱 상태

### 5.2 EventHandlers

#### `handleAddToCart(event, appState)`

장바구니 추가를 처리합니다.

**Parameters:**

- `event` (Event): 클릭 이벤트
- `appState` (Object): 앱 상태

#### `handleQuantityChange(event, appState)`

수량 변경을 처리합니다.

**Parameters:**

- `event` (Event): 클릭 이벤트
- `appState` (Object): 앱 상태

#### `setupEventListeners(appState)`

이벤트 리스너를 설정합니다.

**Parameters:**

- `appState` (Object): 앱 상태

### 5.3 Promotions

#### `startPromotions(productList, appState)`

프로모션을 시작합니다.

**Parameters:**

- `productList` (Array): 상품 목록
- `appState` (Object): 앱 상태

#### `startLightningSale(productList, appState)`

번개세일을 시작합니다.

**Parameters:**

- `productList` (Array): 상품 목록
- `appState` (Object): 앱 상태

#### `startSuggestSale(productList, appState)`

추천할인을 시작합니다.

**Parameters:**

- `productList` (Array): 상품 목록
- `appState` (Object): 앱 상태

## 6. Constants

### 6.1 ProductConstants

```javascript
// 재고 관련
LOW_STOCK_THRESHOLD: 5;
TOTAL_STOCK_WARNING: 10;

// 할인율
LIGHTNING_SALE_RATE: 0.2;
SUGGEST_SALE_RATE: 0.05;

// 프로모션 간격
LIGHTNING_SALE_INTERVAL: 30000;
SUGGEST_SALE_INTERVAL: 60000;
```

### 6.2 UITemplates

주요 템플릿 상수들:

```javascript
// 장바구니 관련
CART_ITEM_TEMPLATE;
CART_ITEM_CONTAINER_TEMPLATE;

// 상품 관련
PRODUCT_OPTION_NORMAL_TEMPLATE;
PRODUCT_OPTION_SOLD_OUT_TEMPLATE;
PRODUCT_OPTION_LOW_STOCK_TEMPLATE;

// UI 컴포넌트
HEADER_IMPROVED_TEMPLATE;
PRODUCT_SELECTOR_IMPROVED_TEMPLATE;
ADD_TO_CART_BUTTON_IMPROVED_TEMPLATE;
```

## 7. 데이터 구조

### 7.1 Product Object

```javascript
{
  id: string,           // 상품 ID
  name: string,         // 상품명
  val: number,          // 현재 가격
  originalVal: number,  // 원래 가격
  q: number,           // 재고 수량
  onSale: boolean,     // 번개세일 여부
  suggestSale: boolean // 추천할인 여부
}
```

### 7.2 CartItem Object

```javascript
{
  id: string,          // 상품 ID
  quantity: number,    // 수량
  price: number        // 가격
}
```

### 7.3 AppState Object

```javascript
{
  productList: Array,           // 상품 목록
  cartDisplay: HTMLElement,     // 장바구니 표시 요소
  productSelector: HTMLElement, // 상품 선택 요소
  addToCartButton: HTMLElement, // 장바구니 추가 버튼
  stockInfo: HTMLElement,       // 재고 정보 요소
  sumElement: HTMLElement,      // 총액 표시 요소
  totalAmount: number,          // 총액
  itemCount: number,            // 상품 개수
  lastSelectedProduct: string,  // 마지막 선택된 상품
  isTuesday: boolean           // 화요일 여부
}
```

## 8. 에러 코드

### 8.1 ERROR_CODES

```javascript
INVALID_QUANTITY: "INVALID_QUANTITY";
INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK";
PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND";
CART_FULL: "CART_FULL";
```

### 8.2 ERROR_TYPES

```javascript
VALIDATION: "VALIDATION";
BUSINESS: "BUSINESS";
SYSTEM: "SYSTEM";
```

## 9. 사용 예제

### 9.1 새로운 상품 추가

```javascript
import { initializeProductList } from "../services/productService.js";
import { updateSelectOptions } from "../ui/productUI.js";

const productList = initializeProductList();
const newProduct = {
  id: "p6",
  name: "새로운 상품",
  val: 15000,
  originalVal: 15000,
  q: 20,
  onSale: false,
  suggestSale: false,
};

productList.push(newProduct);
updateSelectOptions(selector, productList);
```

### 9.2 장바구니 아이템 추가

```javascript
import { calculateCartTotal } from "../services/cartService.js";
import { createCartItemElement } from "../ui/cartUI.js";

const cartItem = createCartItemElement(product);
cartDisplay.appendChild(cartItem);

const result = calculateCartTotal(cartItems, productList, appState);
updateOrderSummary(result, appState);
```

### 9.3 포인트 계산

```javascript
import { calculateBonusPoints } from "../services/cartService.js";
import { updateBonusPoints } from "../ui/eventUI.js";

const pointsResult = calculateBonusPoints(cartItems, productList, appState, totalAmount);
updateBonusPoints(pointsResult);
```

## 10. 모범 사례

### 10.1 함수 작성 시

- 명확한 함수명 사용
- JSDoc 주석 작성
- 에러 처리 포함
- 타입 검증 추가

### 10.2 모듈 사용 시

- 필요한 함수만 import
- 순환 의존성 방지
- 에러 처리 포함

### 10.3 테스트 작성 시

- 각 함수별 단위 테스트
- 경계값 테스트
- 에러 케이스 테스트

이 API 참조 문서를 활용하여 코드를 이해하고 새로운 기능을 개발할 때 참고하시기 바랍니다.
