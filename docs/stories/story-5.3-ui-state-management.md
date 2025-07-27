# Story 5.3: UI 상태 관리 (모달, 알림 등)

## Story Overview

**As a** 사용자  
**I want** 모달과 알림이 일관되게 동작하는 UI  
**So that** 혼란 없이 애플리케이션을 사용할 수 있다

## Story Points: 5

## Epic: Epic 5 - 상태 관리 구조화

## Problem Statement

### 현재 문제

`main.basic.js`에서 UI 상태가 DOM 조작과 혼재되어 관리:

```javascript
// 현재: 분산된 UI 상태 관리
function showModal(message) {
  // DOM 직접 조작
  document.getElementById('help-modal').style.display = 'block';
  // 전역 상태 없음 - 모달 상태 추적 불가
}

function showNotification(message, type) {
  // 즉석 DOM 조작
  let notification = document.createElement('div');
  // 알림 상태 관리 없음
  // 중복 알림 방지 로직 없음
}

// 로딩 상태가 여러 곳에 분산
let isLoading = false; // 특정 기능용
let cartLoading = false; // 장바구니용
```

### 문제점 분석

1. **상태 추적 불가**: UI 상태가 DOM에만 있어 현재 상태 파악 어려움
2. **중복 처리 부족**: 동일 알림이나 모달이 중복으로 표시될 수 있음
3. **일관성 부족**: 각 UI 요소마다 다른 스타일과 동작 방식
4. **테스트 어려움**: DOM 의존성으로 UI 상태 테스트 불가

## Solution

### 새로운 구조: `src/basic/state/UIState.js`

```javascript
export class UIState {
  // UI 상태 관리
  static getState()
  static showModal(type, content, options)
  static hideModal()
  static showNotification(message, type, duration)
  static clearNotifications()
  static setLoading(feature, isLoading)

  // 선택자 (Selectors)
  static getModalState()
  static getNotifications()
  static getLoadingStates()
  static isLoading(feature)

  // 이벤트 및 구독
  static subscribe(listener)
  static unsubscribe(listener)
}
```

## Detailed Acceptance Criteria

### Task 1: UIState 기본 구조 생성

- [ ] `src/basic/state/UIState.js` 파일 생성
- [ ] 내부 상태 객체 정의 (modal, notifications, loading)
- [ ] Observer 패턴 기본 구조 구현
- [ ] 초기 UI 상태 설정

### Task 2: 모달 상태 관리

- [ ] `showModal(type, content, options)` 메서드 구현
  - 모달 타입 (help, confirm, alert)
  - 콘텐츠 및 옵션 설정
  - 기존 모달 닫기 처리
- [ ] `hideModal()` 메서드 구현
  - 모달 상태 초기화
  - 모달 닫기 이벤트 발생
- [ ] 모달 중복 방지 로직
- [ ] ESC 키 및 백드롭 클릭 처리

### Task 3: 알림 상태 관리

- [ ] `showNotification(message, type, duration)` 메서드 구현
  - 알림 타입 (success, error, warning, info)
  - 자동 닫기 타이머 설정
  - 중복 알림 방지
- [ ] `clearNotifications()` 메서드 구현
  - 모든 알림 제거
  - 타이머 정리
- [ ] 알림 큐 관리 (최대 3개)
- [ ] 알림 자동 만료 처리

### Task 4: 로딩 상태 관리

- [ ] `setLoading(feature, isLoading)` 메서드 구현
  - 기능별 로딩 상태 관리
  - 전역 로딩 상태 계산
- [ ] 로딩 상태 자동 타임아웃
- [ ] 로딩 인디케이터 표시 로직

### Task 5: 상태 선택자 구현

- [ ] `getModalState()` 선택자 구현
  - 현재 모달 정보 반환
- [ ] `getNotifications()` 선택자 구현
  - 활성 알림 목록 반환
- [ ] `getLoadingStates()` 선택자 구현
  - 모든 로딩 상태 반환
- [ ] `isLoading(feature)` 선택자 구현
  - 특정 기능 로딩 상태 확인

### Task 6: 이벤트 시스템 구현

- [ ] `subscribe(listener)` 메서드 구현
  - UI 상태 변경 리스너 등록
- [ ] `unsubscribe(listener)` 메서드 구현
  - 리스너 등록 해제
- [ ] `notify(action, payload)` 내부 메서드
  - 모달 상태 변경 알림
  - 알림 상태 변경 알림

### Task 7: main.basic.js 통합

- [ ] UIState import 추가
- [ ] 기존 모달 함수들 UIState 사용으로 변경
- [ ] 기존 알림 함수들 UIState 사용으로 변경
- [ ] 로딩 상태 관련 전역 변수 제거

### Task 8: UI 컴포넌트 구독 설정

- [ ] HelpModal에서 UIState 구독
- [ ] NotificationBar에서 UIState 구독
- [ ] 로딩 인디케이터 자동 표시

### Task 9: 단위 테스트 작성

- [ ] `src/basic/__tests__/UIState.test.js` 생성
- [ ] 모달 상태 관리 테스트
- [ ] 알림 상태 관리 테스트
- [ ] 로딩 상태 관리 테스트

## Technical Requirements

### 상태 구조 설계

```javascript
// UIState 내부 상태 구조
const state = {
  modal: {
    isOpen: false,
    type: null, // 'help', 'confirm', 'alert'
    content: '',
    options: {},
    openedAt: null,
  },
  notifications: [
    {
      id: 'notif-1',
      message: '장바구니에 상품이 추가되었습니다',
      type: 'success',
      duration: 3000,
      createdAt: '2024-01-01T00:00:00Z',
      expiresAt: '2024-01-01T00:00:03Z',
    },
  ],
  loading: {
    cart: false,
    checkout: false,
    stockUpdate: true,
    global: false, // computed
  },
  preferences: {
    notificationPosition: 'top-right',
    maxNotifications: 3,
    defaultDuration: 3000,
  },
};
```

### API 설계

```javascript
// 사용 예시
import { UIState } from './state/UIState.js';

// 모달 표시
UIState.showModal('help', '도움말 내용');

// 알림 표시
UIState.showNotification('성공적으로 저장되었습니다', 'success');

// 로딩 상태 설정
UIState.setLoading('cart', true);

// 상태 조회
const isModalOpen = UIState.getModalState().isOpen;
const notifications = UIState.getNotifications();
```

### Dependencies

- Epic 4 완료 (HelpModal, NotificationBar 컴포넌트)
- UIConstants (스타일 및 설정)

### Performance

- 알림 자동 정리로 메모리 관리
- 불필요한 DOM 업데이트 방지
- 타이머 효율적 관리

## Definition of Done

- [ ] UIState 클래스 완성
- [ ] 모든 UI 상태 액션 구현
- [ ] 선택자 메서드 모두 구현
- [ ] main.basic.js UI 관련 전역 변수 제거
- [ ] 674개 기존 테스트 모두 통과
- [ ] UIState 단위 테스트 작성
- [ ] UI 상태 추적 가능

## Edge Cases & Special Handling

### 모달 관리 시나리오

1. **중첩 모달**: 모달이 열린 상태에서 새 모달 요청
2. **빠른 연속 호출**: 짧은 시간 내 여러 모달 요청
3. **모달 외부 클릭**: 백드롭 클릭 시 닫기 동작
4. **키보드 접근성**: ESC 키로 모달 닫기

### 알림 관리 시나리오

1. **중복 알림**: 동일한 메시지의 중복 표시 방지
2. **알림 큐 초과**: 최대 개수 초과 시 오래된 알림 제거
3. **타이머 충돌**: 여러 알림의 타이머 관리
4. **페이지 이탈**: 페이지 벗어날 때 타이머 정리

### 로딩 상태 관리

- 여러 기능의 동시 로딩 상태
- 로딩 타임아웃 처리
- 에러 발생 시 로딩 상태 복원

## Implementation Notes

- 모든 UI 상태는 불변 객체로 관리
- 타이머 ID는 상태에 포함하여 정리 가능
- 접근성 고려한 ARIA 속성 지원
- 브라우저 포커스 관리 포함

## Test Scenarios

### 단위 테스트 시나리오

1. **모달 라이프사이클**: 열기/닫기 상태 관리
2. **알림 큐 관리**: 추가/제거/만료 처리
3. **로딩 상태**: 기능별 상태 설정 및 조회
4. **중복 방지**: 동일 모달/알림 중복 요청 처리
5. **타이머 관리**: 알림 자동 만료 및 정리

### 통합 테스트 시나리오

1. **컴포넌트 연동**: HelpModal과 UIState 동기화
2. **자동 UI 업데이트**: 상태 변경 시 NotificationBar 반영
3. **사용자 인터랙션**: 키보드/마우스 이벤트와 상태 연동

## Integration Points

### 기존 코드와의 연동

```javascript
// Before: 직접 DOM 조작
document.getElementById('help-modal').style.display = 'block';

// After: UIState 액션 사용
UIState.showModal('help', modalContent);
```

### 컴포넌트 구독 패턴

```javascript
// HelpModal.js
export class HelpModal {
  static init() {
    UIState.subscribe((action, state) => {
      if (action.type === 'MODAL_CHANGED') {
        this.updateDisplay(state.modal);
      }
    });
  }
}
```

## Risks & Mitigation

- **위험**: UI 응답성 저하 (과도한 상태 변경)
- **완화**: 디바운싱 및 배치 업데이트 적용

- **위험**: 메모리 누수 (타이머 정리 누락)
- **완화**: 자동 정리 메커니즘 및 가비지 컬렉션

## Related Stories

- Story 4.4: 도움말 모달 컴포넌트
- Story 4.5: 재고 알림 컴포넌트
- Story 5.5: 상태 통합 및 옵저버 패턴

---

## Dev Agent Record

### Status: Ready for Development ⏳

### Dependencies

- Epic 4 HelpModal, NotificationBar
- UIConstants 설정
- Observer 패턴 구현

### Success Criteria

- UI 상태 중앙 관리 구현
- 일관된 모달/알림 동작
- 674개 테스트 통과 유지
