# Epic 4: UI 컴포넌트화 및 DOM 분리 - 스토리 인덱스

## 📊 Epic 4 전체 개요

### 🎯 목표

레거시 코드의 복잡한 DOM 조작을 React-ready 컴포넌트 구조로 변환하여 유지보수성과 재사용성 향상

### 📈 총 Story Points: 30 (예상)

- Story 4.1: 6 SP ⏳ 준비됨 - 상품 선택 컴포넌트
- Story 4.2: 8 SP ⏳ 준비됨 - 장바구니 디스플레이 컴포넌트
- Story 4.3: 6 SP ⏳ 준비됨 - 주문 요약 컴포넌트
- Story 4.4: 5 SP ⏳ 준비됨 - 도움말 모달 컴포넌트
- Story 4.5: 5 SP ⏳ 준비됨 - 재고 정보 및 알림 컴포넌트

---

## 📋 상세 스토리 목록

### [Story 4.1: 상품 선택 컴포넌트](./story-4.1-product-selector.md)

**Story Points: 6** | **Status: 준비됨**

**목표**: 상품 드롭다운을 독립적인 컴포넌트로 분리

**핵심 작업**:

- ProductSelector 컴포넌트 생성
- 할인 아이콘 표시 (⚡, 💝)
- 재고 상태별 스타일링
- 이벤트 핸들러 분리

**산출물**: `src/basic/components/ProductSelector.js`

---

### [Story 4.2: 장바구니 디스플레이 컴포넌트](./story-4.2-cart-display.md)

**Story Points: 8** | **Status: 준비됨**

**목표**: 장바구니 영역을 재사용 가능한 컴포넌트로 분리

**핵심 작업**:

- CartDisplay 및 CartItem 컴포넌트 생성
- 수량 변경 버튼 (+/-) 기능
- 할인 표시 및 스타일링
- 제거 버튼 기능

**산출물**: `src/basic/components/CartDisplay.js`, `src/basic/components/CartItem.js`

---

### [Story 4.3: 주문 요약 컴포넌트](./story-4.3-order-summary.md)

**Story Points: 6** | **Status: 준비됨**

**목표**: 주문 요약 영역을 독립적인 컴포넌트로 분리

**핵심 작업**:

- OrderSummary 컴포넌트 생성
- 소계, 할인, 최종 금액 표시
- 포인트 적립 예정 내역
- 화요일 특별 할인 배너

**산출물**: `src/basic/components/OrderSummary.js`

---

### [Story 4.4: 도움말 모달 컴포넌트](./story-4.4-help-modal.md)

**Story Points: 5** | **Status: 준비됨**

**목표**: 도움말 모달을 독립적인 컴포넌트로 분리

**핵심 작업**:

- HelpModal 컴포넌트 생성
- 슬라이드 애니메이션 구현
- 할인 정책 및 포인트 안내 콘텐츠
- 접근성 고려

**산출물**: `src/basic/components/HelpModal.js`

---

### [Story 4.5: 재고 정보 및 알림 컴포넌트](./story-4.5-stock-notifications.md)

**Story Points: 5** | **Status: 준비됨**

**목표**: 재고 정보와 알림을 관리하는 컴포넌트 분리

**핵심 작업**:

- StockInfo 컴포넌트 생성
- NotificationBar 컴포넌트 생성
- 재고 부족/품절 상태 표시
- 번개세일/추천할인 알림

**산출물**: `src/basic/components/StockInfo.js`, `src/basic/components/NotificationBar.js`

---

## 🏗️ 아키텍처 비전

### 🎯 컴포넌트 구조

```
src/basic/components/
├── ProductSelector.js      // 상품 선택 드롭다운
├── CartDisplay.js          // 장바구니 전체 영역
├── CartItem.js            // 장바구니 개별 아이템
├── OrderSummary.js        // 주문 요약 (가격, 할인, 포인트)
├── HelpModal.js           // 도움말 모달
├── StockInfo.js           // 재고 정보 표시
└── NotificationBar.js     // 알림 및 메시지 표시
```

### 🔄 Legacy → Component 변환 전략

| **기존 DOM 조작**   | **새로운 컴포넌트** | **변환 목표** |
| ------------------- | ------------------- | ------------- |
| innerHTML 직접 조작 | render() 메서드     | 템플릿 기반   |
| 이벤트 리스너 중복  | 이벤트 핸들러 props | 분리된 로직   |
| 하드코딩된 HTML     | 컴포넌트 API        | 재사용성      |
| 전역 변수 의존      | 데이터 props        | 명시적 의존성 |

### 🎯 핵심 원칙

1. **기존 UI 동작 100% 보존**
2. **비즈니스 로직과 UI 로직 완전 분리**
3. **React 전환 시 최소 변경**
4. **컴포넌트 독립성 및 재사용성**
5. **674개 기존 테스트 통과 유지**

## 🚀 Epic 4 완료 후 기대 효과

- **UI 변경 시 비즈니스 로직 영향 없음**
- **컴포넌트 재사용으로 개발 효율성 향상**
- **A/B 테스트 등 UI 실험 용이성**
- **React 마이그레이션 준비 완료**
- **디자인 시스템 구축 기반 마련**

---

## 📝 다음 단계

Epic 4 완료 후 **main.basic.js가 컴포넌트 오케스트레이션만 담당**하게 되어 React 컴포넌트 전환이 매우 용이해집니다.
