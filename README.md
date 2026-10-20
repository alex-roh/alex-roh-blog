# Cave · Alex's blog

Astro 정적 블로그. 기존 Gatsby 블로그의 Markdown 글과 URL을 유지합니다.

## 로컬 실행

Node.js 24 LTS를 사용하세요 (`.nvmrc` 참고).

```powershell
npm ci
npm run dev
```

브라우저: http://localhost:4321/

```powershell
npm run check
npm test
npm run build
npm run preview
```

## 글 작성

`contents/posts/<분류>/<고유한-글-주소>/index.md`에 작성합니다.
이미지와 첨부 파일은 해당 글과 같은 폴더에 둡니다. 실행·빌드 시 public/media로 복사됩니다.
글 폴더 이름은 전체 글에서 고유해야 합니다. 기존 파일 형식을 유지했습니다.

```yaml
---
title: "글 제목"
description: "요약"
date: 2026-10-20
tags:
  - python
series: "ENAI607 Python"
seriesOrder: 3
---
```

`seriesOrder`는 선택 사항입니다. 지정하지 않으면 시리즈는 날짜 오름차순,
날짜가 없는 글은 제목 순서로 정렬됩니다. 홈은 최신 날짜순, 날짜 없는 글은 마지막입니다.

## 제공 기능

- 시리즈 보관함과 시리즈별 글 목록
- 글 상단 같은 시리즈 글 목록, 현재 글 표시
- 제목 기반 우측 고정 목차·현재 위치 표시, 좁은 화면의 접이식 목차
- 태그 보관함과 태그별 글 목록 (`/tags/?q=python` 기존 링크도 지원)
- 제목·본문·코드 문자열 검색, 제목 일치 우선
- 코드 복사, 수식, 이미지, RSS, 사이트맵

검색 데이터는 빌드 시 생성되며 별도 API 서버나 유료 검색 서비스가 필요하지 않습니다.
검색은 대소문자를 구분하지 않는 문자열 검색이며 형태소·오타 교정은 제공하지 않습니다.

## 배포와 기존 블로그

기존 `alex-roh.github.io` 저장소는 변경하지 않습니다.
이 저장소는 개발·검토용이며 기존 사이트 교체는 별도 전환 작업입니다.

GitHub Pages 미리보기:

1. 이 저장소 Settings → Pages → Source를 GitHub Actions로 설정합니다.
2. Actions → Deploy preview to GitHub Pages → Run workflow.
3. 미리보기 주소: https://alex-roh.github.io/alex-roh-blog/

미리보기는 검색 엔진 중복 노출을 막기 위해 noindex입니다.
GitHub Pages 배포는 수동 실행으로 한정했고, 일반 push에서는 검사만 실행합니다.

최종 전환 때는 기존 사용자 사이트 저장소에서 이 소스를 빌드·배포하도록 구성하거나,
명시적인 배포 권한을 설정해 이 저장소에서 기존 사용자 사이트로 결과물을 보냅니다.
`SITE_BASE`를 지정하지 않은 기본 빌드는 기존 루트 주소와 동일한 경로를 생성합니다.
토큰·비밀번호는 이 저장소에 저장하지 마세요.

## 이후 확장

프로필·이력서 페이지는 아직 만들지 않았습니다. `src/pages/about.astro`,
`src/pages/resume.astro` 및 `public/resume.pdf` 등으로 추가할 수 있습니다.

## 저작권

글·이미지의 권리는 원저작자에게 있습니다. 기존 Gatsby 테마의 MIT 고지는 LICENSE에 보존했습니다.
