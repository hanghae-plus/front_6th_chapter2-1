# Epic 1: 리팩터링 준비 및 기반 설정

## Epic Goal
레거시 main.basic.js 리팩터링을 위한 안전한 개발 환경 구축 및 기반 인프라 설정

## Epic Description

### 현재 상황
- 787줄의 거대한 레거시 파일 (main.basic.js)
- 674개 테스트 케이스가 기존 기능을 검증
- 전역 변수 남용, 기능 분리 미흡, 강결합 구조

### 목표
- 테스트 기반 안전한 리팩터링 환경 구축
- 코드 품질 도구 설정 (ESLint, Prettier, TypeScript)
- 디렉토리 구조 설계 및 모듈 시스템 준비

### 비즈니스 가치
- 안전한 리팩터링으로 기존 기능 보존
- 개발자 생산성 향상
- 코드 품질 향상으로 유지보수성 개선

## User Stories

### Story 1.1: 개발 환경 설정
**As a** 개발자  
**I want** TypeScript, ESLint, Prettier가 설정된 개발 환경  
**So that** 코드 품질을 자동으로 관리하고 타입 안정성을 확보할 수 있다

**Acceptance Criteria:**
- [ ] TypeScript 설정으로 기존 JS 파일 타입 체크
- [ ] ESLint 규칙으로 코드 품질 검사
- [ ] Prettier로 코드 포맷팅 자동화
- [ ] VSCode 설정으로 저장 시 자동 포맷팅
- [ ] 모든 설정이 674개 테스트 통과에 영향 없음

### Story 1.2: 프로젝트 구조 설계
**As a** 개발자  
**I want** React-ready 모듈 구조가 설계된 디렉토리  
**So that** 체계적으로 기능을 분리하고 향후 React 전환이 용이하다

**Acceptance Criteria:**
- [ ] components/, state/, calculations/, constants/, utils/ 디렉토리 생성
- [ ] 각 디렉토리의 역할과 규칙 정의
- [ ] 모듈 import/export 구조 설계
- [ ] 기존 main.basic.js와 병행 개발 가능한 구조

### Story 1.3: 테스트 기반 리팩터링 전략 수립
**As a** 개발자  
**I want** 674개 테스트를 활용한 안전한 리팩터링 전략  
**So that** 기존 기능을 손상시키지 않고 점진적으로 개선할 수 있다

**Acceptance Criteria:**
- [ ] Phase 0-5 리팩터링 로드맵 수립
- [ ] 각 단계별 테스트 검증 프로세스 정의
- [ ] 롤백 계획 및 체크포인트 설정
- [ ] 고위험/저위험 영역 식별 및 우선순위 결정

## Definition of Done
- [ ] 개발 도구 설정 완료 및 정상 작동
- [ ] 프로젝트 구조 생성 및 문서화
- [ ] 리팩터링 전략 수립 및 승인
- [ ] 674개 테스트 모두 통과 유지
- [ ] 팀 개발 가이드라인 문서화

## Dependencies
- PRD 문서 (01-PRD.md)
- 브라운필드 아키텍처 문서
- 기존 테스트 케이스 (basic.test.js)

## Risks & Mitigation
- **위험**: 도구 설정이 기존 테스트에 영향
- **완화**: 각 도구 설정 후 즉시 테스트 실행으로 검증

## Success Metrics
- 674개 테스트 100% 통과 유지
- ESLint 0 에러 (경고는 허용)
- 코드 포맷팅 일관성 100%
- 리팩터링 준비 완료 시간: 1-2일
