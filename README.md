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
publishedAt: "2026-10-20T12:57:33-04:00"
# updatedAt: "2026-10-21T09:30:00-04:00"
tags:
  - python
series: "ENAI607 Python Programming"
seriesOrder: 3
---
```

`seriesOrder`는 선택 사항입니다. 지정하지 않으면 시리즈는 날짜 오름차순,
날짜가 없는 글은 제목 순서로 정렬됩니다. 홈은 최신 날짜순, 날짜 없는 글은 마지막입니다.

### 게시 시각과 수정 시각

`publishedAt`은 최초 게시 시각이며 이후 수정해도 바꾸지 않습니다. `updatedAt`은 본문 수정 시각입니다.
시간대가 포함된 ISO 8601 값(`-04:00`, `-05:00` 또는 `Z`)을 사용합니다.
화면은 `America/New_York` 기준의 날짜·시:분과 EDT/EST를 표시하며 서머타임을 자동 처리합니다.
글 목록 정렬과 RSS도 `publishedAt`을 우선 사용하고, 수정 시각으로 게시 순서를 바꾸지 않습니다.
정확한 시각을 모르는 기존 글은 `date`만 유지합니다. 자정으로 시간을 만들어 넣지 않습니다.

```powershell
node scripts/set-publication-time.mjs enai601-convex-functions updated "2026-10-21T03:15:00-04:00"
```

최초 배포 뒤 GitHub Pages의 성공한 실행 완료 시각을 확인해 `published`로 기록하고 다시 배포합니다.
이 기록용 배포나 공통 UI 수정은 본문의 `updatedAt`을 바꾸지 않습니다.
ENAI601의 복원 기준은 배포 실행 #14(01·02 최초), #16(02 수정), #17(03 최초), #19(03 그림 수정), #20(04 최초)입니다.
기록은 [배포 실행 목록](https://github.com/alex-roh/alex-roh.github.io/actions/workflows/deploy-astro.yml)에서 확인할 수 있습니다.

### 본문 수식

인라인 수식은 `$f(x)=x^2$`, 독립된 수식은 줄을 나누어 `$$`로 감쌉니다.
`\( ... \)`는 현재 작성 문법에 포함되지 않습니다. 백틱 안의 수식은 코드로 보존됩니다.
금액처럼 달러 기호 자체가 필요하면 `\$5`처럼 이스케이프하거나 코드로 씁니다.
표 안의 수식에서 세로줄이 필요하면 `\lvert x\rvert` 또는 `\lVert x\rVert`를 써서 표 구분자와 충돌하지 않게 합니다.

글 상단 시리즈 목록은 모든 글을 포함하며 높이가 216px를 넘으면 내부 스크롤을 사용합니다.
현재 글은 자동으로 보이는 위치에 놓입니다. 데스크톱 목차도 현재 절을 내부 스크롤로 따라갑니다.

## 보관된 옛 글

이전 글 9개는 `archive/posts/`에 이미지·첨부 파일과 함께 보관합니다.
이 폴더는 블로그, 검색, 태그, 시리즈, RSS와 사이트맵에 포함되지 않습니다.
다시 게시하려면 해당 글 폴더를 `contents/posts/`로 옮기세요.

## 제공 기능

- 시리즈 보관함과 시리즈별 글 목록
- 글 상단 같은 시리즈 글 목록, 현재 글 표시
- 제목 기반 우측 고정 목차·현재 위치 표시, 좁은 화면의 접이식 목차
- 태그 보관함과 태그별 글 목록 (`/tags/?q=python` 기존 링크도 지원)
- 제목·본문·코드 문자열 검색, 제목 일치 우선
- 코드 복사, 수식, 이미지, RSS, 사이트맵

검색 데이터는 빌드 시 생성되며 별도 API 서버나 유료 검색 서비스가 필요하지 않습니다.
검색은 대소문자를 구분하지 않는 문자열 검색이며 형태소·오타 교정은 제공하지 않습니다.

## 실제 사이트 배포

소스 저장소: `alex-roh/alex-roh-blog`
실제 주소: https://alex-roh.github.io/

사용자 사이트 주소를 유지하기 위해 `alex-roh/alex-roh.github.io` 저장소의
`Deploy Astro to alex-roh.github.io` Actions가 이 저장소의 소스를 가져와
검사·빌드한 뒤 GitHub Pages에 배포합니다. 별도의 개인 액세스 토큰은 필요하지 않습니다.

글을 수정한 뒤:

1. 이 저장소의 `main`에 Push합니다.
2. https://github.com/alex-roh/alex-roh.github.io/actions/workflows/deploy-astro.yml
   에서 Run workflow를 누릅니다. `source_ref`는 기본 `main`으로 둡니다.
3. 배포가 성공하면 실제 사이트를 확인합니다.

소스 저장소 Push만으로 실제 사이트가 자동 배포되지는 않습니다.
배포를 실행할 때 최신 main을 가져오며, 필요하면 source_ref에 특정 커밋을 지정할 수 있습니다.

기존 Gatsby 소스와 gh-pages 브랜치는 복구용으로 유지합니다.
복구가 필요하면 사용자 사이트 저장소 Settings → Pages의 Source를
Deploy from a branch / gh-pages / (root)로 되돌립니다.

## 선택: 별도 미리보기 배포

이 저장소 Settings → Pages → Source를 GitHub Actions로 설정하고,
Actions → Deploy preview to GitHub Pages → Run workflow를 실행합니다.
주소: https://alex-roh.github.io/alex-roh-blog/
미리보기는 중복 검색 노출을 막기 위해 noindex이며 수동 배포입니다.

## 이후 확장

프로필·이력서 페이지는 아직 만들지 않았습니다. `src/pages/about.astro`,
`src/pages/resume.astro` 및 `public/resume.pdf` 등으로 추가할 수 있습니다.

## 저작권

글·이미지의 권리는 원저작자에게 있습니다. 기존 Gatsby 테마의 MIT 고지는 LICENSE에 보존했습니다.
