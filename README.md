# Hanghae Shopping Cart Project

이 프로젝트는 쇼핑몰 장바구니 기능을 구현한 웹 애플리케이션입니다.

## 프로젝트 구조

### 📁 src/basic
- **Vanilla JavaScript** 버전
- 클린 코드 원칙을 적용하여 리팩토링된 버전
- DOM 조작 기반의 명령형 프로그래밍

### 📁 src/advanced  
- **TypeScript + React** 버전
- 함수형 컴포넌트와 Hooks 기반
- 상태 관리와 선언적 프로그래밍

## 🚀 실행 방법

### Basic 버전 (Vanilla JavaScript)
```bash
npm run start:basic
```

### Advanced 버전 (TypeScript + React)
```bash
npm run start:advanced
```

### 테스트 실행
```bash
npm test
```

## 🛠️ 기술 스택

### Basic 버전
- **Vanilla JavaScript**
- **Tailwind CSS** (CDN)
- **Vite** (빌드 도구)

### Advanced 버전
- **TypeScript**
- **React 19**
- **Tailwind CSS** (CDN)
- **Vite** (빌드 도구)

## 📋 주요 기능

### 🛒 장바구니 기능
- 상품 추가/제거
- 수량 조절
- 실시간 가격 계산

### 💰 할인 시스템
- **개별 상품 할인**: 10개 이상 구매 시 할인
  - 키보드: 10%
  - 마우스: 15%
  - 모니터암: 20%
  - 스피커: 25%
- **전체 수량 할인**: 30개 이상 구매 시 25% 할인
- **화요일 특별 할인**: 10% 추가 할인
- **번개세일**: 랜덤 상품 20% 할인
- **추천할인**: 5% 추가 할인

### 🎁 포인트 적립 시스템
- 기본: 구매액의 0.1%
- 화요일: 2배 적립
- 세트 구매 보너스
  - 키보드+마우스: +50p
  - 풀세트: +100p
- 수량별 보너스
  - 10개 이상: +20p
  - 20개 이상: +50p
  - 30개 이상: +100p

## 🏗️ 아키텍처

### Basic 버전 구조
```
src/basic/
├── constants/
│   └── product.ts          # 상품 상수
├── utils/
│   ├── cart.ts             # 장바구니 로직
│   ├── date.ts             # 날짜 유틸리티
│   ├── intervalEvent.ts    # 타이머 이벤트
│   ├── price.ts            # 가격 포맷팅
│   ├── product.ts          # 상품 관련 함수
│   └── ui/
│       └── cart.ts         # UI 업데이트
├── main.basic.js           # 메인 진입점
└── render.js               # 렌더링 함수
```

### Advanced 버전 구조
```
src/advanced/
├── components/
│   ├── App.tsx             # 메인 앱 컴포넌트
│   ├── Header.tsx          # 헤더 컴포넌트
│   ├── ProductSelector.tsx # 상품 선택 컴포넌트
│   ├── CartItems.tsx       # 장바구니 아이템 컴포넌트
│   ├── OrderSummary.tsx    # 주문 요약 컴포넌트
│   └── HelpModal.tsx       # 도움말 모달 컴포넌트
├── constants/
│   └── product.ts          # 상품 상수
├── types/
│   └── index.ts            # TypeScript 타입 정의
├── utils/
│   ├── cart.ts             # 장바구니 로직
│   ├── date.ts             # 날짜 유틸리티
│   ├── intervalEvent.ts    # 타이머 이벤트
│   ├── price.ts            # 가격 포맷팅
│   ├── product.ts          # 상품 관련 함수
│   └── ui/
│       └── cart.ts         # UI 업데이트 (레거시)
├── main.advanced.tsx       # React 앱 진입점
└── render.ts               # 렌더링 함수 (레거시)
```

## 🔄 변환 과정

### 1. 파일 구조 복사
- `src/basic` → `src/advanced` 복사
- `__tests__` 폴더 제외

### 2. TypeScript 변환
- 모든 `.js` 파일을 `.ts`로 변환
- 타입 정의 추가 (`src/advanced/types/index.ts`)
- 함수 시그니처에 타입 추가

### 3. React 컴포넌트 생성
- DOM 조작 코드를 React 상태 관리로 변환
- 함수형 컴포넌트로 분리
- Props 인터페이스 정의

### 4. 상태 관리
- `useState` 훅으로 상태 관리
- `useEffect` 훅으로 사이드 이펙트 처리
- 이벤트 핸들러를 React 방식으로 변환

## 🧪 테스트

### 테스트 실행
```bash
# 전체 테스트
npm test

# Basic 버전만
npm run test:basic

# Advanced 버전만  
npm run test:advanced
```

### 테스트 커버리지
- 장바구니 기능
- 할인 정책
- 포인트 적립
- UI/UX 요구사항
- 예외 처리

## 📝 주요 개선사항

### Basic → Advanced 변환 시 개선점
1. **타입 안정성**: TypeScript로 컴파일 타임 에러 방지
2. **컴포넌트 분리**: 재사용 가능한 컴포넌트로 분리
3. **상태 관리**: React Hooks로 선언적 상태 관리
4. **성능 최적화**: React의 가상 DOM 활용
5. **개발자 경험**: HMR, 타입 힌트 등 개선

## 🚀 배포

### 빌드
```bash
npm run build
```

### 미리보기
```bash
npm run preview
```

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.
