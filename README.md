# Chapter 2-1. 클린코드와 리팩토링

## 🚀 배포 정보

- **Live Demo**: [https://jangrubin2.github.io/front_6th_chapter2-1/](https://jangrubin2.github.io/front_6th_chapter2-1/)
- **Basic Version**: [https://jangrubin2.github.io/front_6th_chapter2-1/index.basic.html](https://jangrubin2.github.io/front_6th_chapter2-1/index.basic.html)
- **Advanced Version**: [https://jangrubin2.github.io/front_6th_chapter2-1/index.advanced.html](https://jangrubin2.github.io/front_6th_chapter2-1/index.advanced.html)

## 📋 프로젝트 개요

이번 과제는 더티코드를 클린코드의 형태로 개선을 하는 과제입니다. 주어진 테스트를 통과하면서 원래 기능과 동일한 동작을 하는 코드를 만들어주세요. basic과제는 제공되는 더티코드를 클린코드와 리팩토링 원칙에 입각해서 더 나은 코드로 만들어보세요. 주어진 테스트를 참고삼아 좋은 이름, 좋은 모양, 좋은 구조를 가지는 코드로 만들어 보세요.

[목표]

- /basic 디렉토리에 있는 더티코드를 클린코드로 리팩토링
- 바닐라스크립트를 사용해서 작성된 코드를 클린코드와 리팩토링 원칙에 입각해서 더 나은 코드로 개선
- 추후 React + Typescript로 고도화 리팩토링을 할 예정이니 이를 꼭 염두에 두고 React로 바꿔도 코드가 많이 변경되지 않도록 리팩토링

[필수조건]

- Prettier와 ESLint를 설치해서 적용할 것
- 테스트 코드 모두 통과할 것
- = 기존 기능과 동일하게 동작할 것
- = 어플리케이션 요구사항을 모두 만족할 것 (/docs/PRD.md 참고)

[과제의 취지]

- 나쁜 코드를 몸으로 충분히 느껴보고, 왜 나쁜 코드를 쓰는 것이 나쁜지 이해하기
- 나쁘지 않은 코드만으로 충분하지 않다는 것을 이해하기
- 더 좋은 코드란 무엇인지를 고민하며 나의 코드 취향과 코드 감각 이해하기

## 심확과제: 유지보수 하기 좋은 코드만들기

심화과제는 **기본과제에서 작성한 코드를 기술고도화를 하는 것입니다.** 바닐라 자바스크립트로 되어 있는 코드를 유지보수하기에 유리한 기술스택(React + Typescript)으로 고도화 리팩토링을 진행해주세요.
우리의 목표는 앞으로 유지보수를 더 잘할 수 있도록 하기 위함입니다. 최소 React와 Typescript를 이용한 코드로 개선해주세요. 그 밖의 기술선택과 폴더/파일 구조, 테스트 코드등은 자유입니다.

[목표]

- /advanced 디렉토리에 있는 기본과제 코드를 React + Typescript로 고도화 리팩토링
- /basic 기본과제에서 작성한 코드를 복사해서 /advanced 디렉토리에서 고도화 리팩토링 진행
- 기본과제에서 작성한 코드를 React + Typescript로 고도화 리팩토링

[과제의 취지]

- React가 어떻게 유지보수하기 좋은 코드로 만들어주는지 이해하기
- Typescript가 어떻게 유지보수하기 좋은 코드로 만들어주는지 이해하기
- 내가 추구하는 좋은 코드와 React가 추구하는 코드와 어떻게 다른지 이해하기

## 요청사항

과제를 진행할 떄 AI를 쓰는 것은 자유입니다. 오히려 AI를 활용하는 연습을 해야하는게 시대의 흐름이겠지요.
다만 AI를 쓰더라도 최대한 조금씩 조금씩 이전 코드와 지금 코드를 그대로 유지하면서 리팩토링하는 감각을 기르기 위함이나,
AI에게 최대한 조금씩 그러나 구체적으로 요청하며 한번에 많은 코드를 바꾸지 않도록 하는 연습을 해보세요.

# 주요내용

현재 코드의 문제점

1. 전역 변수 남용
   prodList, bonusPts, itemCnt, lastSel, totalAmt 등이 전역 변수로 선언되어 있음
   함수 간 의존성이 높고 상태 관리가 복잡함
   코드의 가독성과 유지보수성이 떨어짐
2. 함수의 책임 분산
   handleCalculateCartStuff() 함수가 너무 많은 책임을 가짐
   장바구니 계산
   UI 업데이트
   할인 계산
   포인트 계산
   재고 정보 업데이트
3. 중복 코드
   onUpdateSelectOptions()와 doUpdatePricesInCart()에서 유사한 로직 반복
   할인 계산 로직이 여러 곳에 분산되어 있음
4. 하드코딩된 값들
   상품 ID, 할인율, 포인트 계산 로직 등이 하드코딩되어 있음
   설정 변경 시 여러 곳을 수정해야 함
5. 이벤트 핸들러 복잡성
   addBtn.addEventListener와 cartDisp.addEventListener에서 너무 많은 로직 처리
   비즈니스 로직과 UI 로직이 혼재
   작업 순서
   Phase 1: 상태 관리 개선
   전역 변수를 state 객체로 통합
   prodList, bonusPts, itemCnt, lastSel, totalAmt를 하나의 state 객체로 관리
   localStorage 연동으로 상태 지속성 확보
   상태 업데이트 함수 분리
   updateState() 함수로 상태 변경을 중앙화
   상태 변경 시 자동으로 localStorage에 저장
   Phase 2: 함수 분리 및 책임 명확화
   계산 로직 분리
   calculateDiscount() - 할인 계산 전용 함수
   calculatePoints() - 포인트 계산 전용 함수
   calculateTotal() - 총액 계산 전용 함수
   UI 업데이트 로직 분리
   updateCartDisplay() - 장바구니 UI 업데이트
   updateSummaryDisplay() - 요약 정보 UI 업데이트
   updateStockInfo() - 재고 정보 UI 업데이트
   Phase 3: 이벤트 핸들러 개선
   이벤트 핸들러 단순화
   addToCart() - 상품 추가 로직
   removeFromCart() - 상품 제거 로직
   updateQuantity() - 수량 변경 로직
   비즈니스 로직과 UI 로직 분리
   이벤트 핸들러는 상태 변경만 담당
   UI 업데이트는 별도 함수로 분리
   Phase 4: 설정 관리 개선
   설정 객체 분리
   상품 정보, 할인 정책, 포인트 정책을 설정 객체로 분리
   하드코딩된 값들을 설정으로 관리
   Phase 5: 테스트 보장
   기존 테스트 통과 확인
   각 단계별로 테스트 실행하여 기능 정상 동작 확인
   리팩토링 후에도 동일한 결과 보장
   Phase 6: 코드 정리
   불필요한 코드 제거
   사용하지 않는 변수나 함수 정리
   주석 개선 및 코드 문서화
   이 순서대로 진행하면 기존 기능을 유지하면서도 코드의 가독성과 유지보수성을 크게 향상시킬 수 있습니다. 각 단계별로 테스트를 실행하여 기능이 정상 동작하는지 확인하면서 진행하는 것이 중요합니다.
