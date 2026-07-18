# EPUB 스타일러

웹소설 EPUB을 열어 문장/문단을 선택하고, 장르별 시각 효과(상태창·말풍선·공포 효과 등)를
실시간 미리보기로 적용한 뒤 **효과가 심어진 새 EPUB 파일로 내보내는** 순수 클라이언트 사이드 웹앱입니다.

- 서버 없음 — 책 파일은 브라우저 밖으로 전송되지 않습니다.
- 원본 비파괴 — 항상 `원본파일명_styled.epub` 새 파일로 저장됩니다.
- 저장된 파일은 이 도구 없이 일반 EPUB 뷰어에서 열어도 효과가 그대로 보입니다 (순수 CSS/HTML).
- 이 도구로 저장한 파일을 다시 열면 적용 내역이 복원되어 수정/삭제할 수 있습니다.

## 실행 방법

정적 파일이므로 아무 웹서버로 열면 됩니다 (ES 모듈 사용으로 `file://` 직접 열기는 불가).

```bash
# 저장소 루트에서
python3 -m http.server 8000
# 또는
npx serve .
```

브라우저에서 `http://localhost:8000` 접속.

## 아키텍처 요약

```
[열기]   JSZip 압축 해제 → container.xml → OPF(spine/manifest) → 챕터 XHTML을 DOMParser로 파싱해 메모리 보관
[렌더링] 현재 챕터의 DOM 노드를 iframe으로 이동 → 화면에 보이는 DOM = 저장될 DOM (동일 객체)
[적용]   Selection API로 Range 획득 → <span class="es-…" data-es="…">로 감싸기
         (카톡·상태창 등 구조형 위젯은 선택 영역을 정적 HTML 구조로 치환, 원문은 data-es-original에 보관)
[저장]   챕터 DOM 직렬화 → styles/es-styler.css·fonts/* 추가 → OPF manifest 등록 →
         <head>에 <link> 삽입 → mimetype 무압축 첫 엔트리로 재압축 → 다운로드
```

- `js/epub.js` — EPUB 열기/저장 파이프라인 (JSZip + DOMParser, epub.js 미사용)
- `js/presets.js` — 효과 프리셋 카탈로그 + 저장/미리보기 공용 기본 CSS (`es-` 접두사)
- `js/widgets.js` — 구조형 위젯(카톡, 상태창, 학생증, 영수증 등) 줄 단위 파서·렌더러
- `js/fonts.js` — 폰트 카탈로그와 다운로드/임베드
- `js/app.js` — UI, 선택, 적용/수정/제거, 적용 내역, 저장 흐름

## 폰트

내장 카탈로그는 **학교안심 글꼴 전체 63종**(교육부·KERIS 배포, SIL Open Font License)입니다.
woff2 파일은 [fonts-archive](https://github.com/fonts-archive)의 jsDelivr CDN에서 내려받아
EPUB의 `fonts/` 폴더에 임베드하고 `@font-face`로 연결합니다 — 폰트가 설치되지 않은 기기에서도 표시됩니다.
ttf/otf/woff/woff2 파일 업로드로 다른 폰트도 담을 수 있습니다 (임베드 허용 라이선스인지 확인 필요).

## 옵션 저장 방식

효과별 미세 조정값은 요소 인라인 스타일의 CSS 변수(`--es-*`)로 기록되고,
재편집용 메타데이터는 `data-es` 속성(JSON)과 zip 루트의 `es-manifest.json`에 담깁니다.
`data-es` 속성만으로도 복원이 가능하도록 설계되어 있습니다.

## 애니메이션 호환 정책

- 모든 애니메이션은 CSS만 사용 (EPUB 뷰어 다수가 JS 미실행)
- 모든 키프레임은 정지 상태(0%)가 완성된 디자인이 되도록 설계
- `prefers-reduced-motion: reduce`에서 애니메이션 비활성화
- 효과 카드에 호환 뱃지 표시: "어디서나 보임" / "움직임은 일부 뷰어에서만"
