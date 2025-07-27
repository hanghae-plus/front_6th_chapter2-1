# Story 1.1: 개발 환경 설정

## Story Overview
**Epic**: 1 - 리팩터링 준비 및 기반 설정  
**Story ID**: 1.1  
**Story Name**: 개발 환경 설정  
**Priority**: High  
**Estimation**: 3 Story Points  

## User Story
**As a** 개발자  
**I want** TypeScript, ESLint, Prettier가 설정된 개발 환경  
**So that** 코드 품질을 자동으로 관리하고 타입 안정성을 확보할 수 있다

## Acceptance Criteria

### ✅ TypeScript 설정
- [ ] `tsconfig.json` 파일 생성 및 설정
- [ ] `checkJs: false` (기존 JS 파일 타입 체크 비활성화)
- [ ] 새로운 TS 파일에 대한 strict 타입 체크 활성화
- [ ] `include` 및 `exclude` 경로 적절히 설정
- [ ] `pnpm run type-check` 스크립트 정상 작동

### ✅ ESLint 설정
- [ ] `eslint.config.js` 파일 생성 (Flat Config 형식)
- [ ] JavaScript 파일용 설정 (기본 파서 사용)
- [ ] TypeScript 파일용 설정 (@typescript-eslint 파서 사용)
- [ ] 다음 규칙 적용:
  - `no-var`: 에러 (var 사용 금지)
  - `prefer-const`: 에러 (const 사용 권장)
  - `no-unused-vars`: 에러 (사용하지 않는 변수 금지)
  - `complexity`: 경고 (복잡도 10 이상)
  - `max-lines-per-function`: 경고 (함수당 50줄 이상)
- [ ] `pnpm run lint` 스크립트 정상 작동
- [ ] `pnpm run lint:fix` 자동 수정 기능 작동

### ✅ Prettier 설정
- [ ] `.prettierrc` 파일 생성
- [ ] 다음 설정 적용:
  - `semi: true` (세미콜론 사용)
  - `singleQuote: true` (단일 따옴표 사용)
  - `printWidth: 100` (한 줄 최대 100자)
  - `tabWidth: 2` (탭 크기 2)
  - `trailingComma: 'es5'` (ES5 호환 후행 쉼표)
- [ ] `.prettierignore` 파일 생성
- [ ] 다음 파일/디렉토리 무시:
  - `node_modules/`, `dist/`, `build/`
  - `src/main.original.js` (레거시 파일)
  - 설정 파일들 및 로그 파일들
- [ ] `pnpm run format` 스크립트 정상 작동
- [ ] `pnpm run format:check` 검증 스크립트 정상 작동

### ✅ VSCode 워크스페이스 설정
- [ ] `.vscode/settings.json` 파일 생성
- [ ] Format on Save 활성화:
  - `"editor.formatOnSave": true`
  - `"editor.defaultFormatter": "esbenp.prettier-vscode"`
- [ ] 파일별 포맷터 설정 (JS, TS, JSON)
- [ ] ESLint 자동 수정 저장 시 실행
- [ ] `.vscode/extensions.json` 권장 확장 프로그램 목록
- [ ] `.vscode/tasks.json` 개발 작업 단축키 설정

### ✅ 패키지 및 스크립트 설정
- [ ] `package.json`에 devDependencies 추가:
  - `typescript`
  - `eslint`, `@eslint/js`, `globals`
  - `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`
  - `prettier`, `eslint-config-prettier`
- [ ] 다음 npm scripts 추가:
  - `"lint": "eslint src/basic --ext .js,.ts"`
  - `"lint:fix": "eslint src/basic --ext .js,.ts --fix"`
  - `"format": "prettier --write \"src/basic/**/*.{js,ts,json}\""`
  - `"format:check": "prettier --check \"src/basic/**/*.{js,ts,json}\""`
  - `"type-check": "tsc --noEmit"`
  - `"dev:setup": "npm run lint && npm run format && npm run type-check"`

## Technical Implementation

### 도구 설치 순서
1. **pnpm으로 의존성 설치**
2. **TypeScript 설정 생성 및 테스트**
3. **ESLint 설정 생성 및 기본 규칙 적용**
4. **Prettier 설정 생성 및 포맷팅 테스트**
5. **VSCode 워크스페이스 설정 구성**
6. **모든 도구 통합 테스트**

### 검증 방법
```bash
# 1. TypeScript 컴파일 체크
pnpm run type-check

# 2. ESLint 체크 (JS 파일에서 에러 확인)
pnpm run lint

# 3. Prettier 포맷팅 체크
pnpm run format:check

# 4. 통합 개발 환경 체크
pnpm run dev:setup

# 5. 기존 테스트 영향 확인
pnpm run test:basic
```

## Definition of Done
- [ ] 모든 개발 도구가 정상 설치 및 설정
- [ ] VSCode에서 저장 시 자동 포맷팅 작동
- [ ] ESLint가 main.basic.js에서 예상된 문제들 탐지
- [ ] TypeScript 설정이 기존 JS 파일에 영향 없음
- [ ] **674개 테스트 모두 통과 유지** (중요!)
- [ ] 팀 개발 가이드 문서 작성

## 의존성
- 기존 `pnpm-lock.yaml` 및 `package.json`
- 기존 `src/basic/main.basic.js` 파일
- 기존 `src/basic/__tests__/basic.test.js` 테스트

## 위험 요소 및 완화 방안
- **위험**: 도구 설정이 기존 테스트 실행에 영향
- **완화**: 각 도구 설정 후 즉시 `pnpm run test:basic` 실행하여 검증
- **위험**: TypeScript 설정이 기존 JS 코드에 컴파일 에러 발생
- **완화**: `checkJs: false` 설정으로 기존 코드 영향 최소화

## 후속 작업
- Story 1.2: 프로젝트 구조 설계
- Story 1.3: 테스트 기반 리팩터링 전략 수립
