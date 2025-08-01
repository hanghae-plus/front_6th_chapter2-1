# Front 6th Chapter 2-1

이 프로젝트는 ESLint와 Prettier가 설정된 JavaScript 프로젝트입니다.

## 개발 환경 설정

### 필수 확장 프로그램

VS Code에서 다음 확장 프로그램을 설치하세요:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)

### 사용 가능한 스크립트

```bash
# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 테스트 실행
pnpm test

# ESLint 검사
pnpm lint

# ESLint 자동 수정
pnpm lint:fix

# Prettier 포맷팅
pnpm format

# Prettier 포맷팅 검사
pnpm format:check
```

## 코드 품질 도구

### ESLint

- JavaScript 코드 품질 검사
- 자동 수정 가능한 규칙들 적용
- 브라우저 환경 지원

### Prettier

- 코드 포맷팅 자동화
- 일관된 코드 스타일 유지
- 저장 시 자동 포맷팅

## 설정 파일

- `eslint.config.js`: ESLint 설정
- `.prettierrc`: Prettier 설정
- `.prettierignore`: Prettier 무시 파일 목록
- `.vscode/settings.json`: VS Code 설정
- `.vscode/extensions.json`: 추천 확장 프로그램

## 프로젝트 구조

```
front_6th_chapter2-1/
├── docs/                    # 문서
├── src/                     # 소스 코드
│   ├── advanced/           # 고급 버전
│   ├── basic/             # 기본 버전
│   └── main.original.js   # 원본 코드
├── index.html              # 메인 페이지
├── index.basic.html        # 기본 버전 페이지
├── index.advanced.html     # 고급 버전 페이지
└── package.json           # 프로젝트 설정
```
