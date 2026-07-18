// ── 효과 프리셋 카탈로그 ──
// 각 프리셋은 es- 접두사 클래스 하나에 대응한다.
// 옵션값은 요소 인라인 style의 CSS 변수(--es-*)로 실리므로
// 어떤 EPUB 뷰어에서도(JS 없이) 그대로 재현된다.

export const CATEGORIES = [
  { id: 'fantasy', name: '로판·판타지' },
  { id: 'game', name: '게임·SF' },
  { id: 'horror', name: '공포' },
  { id: 'mockup', name: '실물' },
  { id: 'sns', name: 'SNS·메신저' },
  { id: 'text', name: '텍스트' },
  { id: 'custom', name: '내 프리셋' },
];

// 옵션 정의 헬퍼 --------------------------------------------------------------
const color = (key, label, def) => ({ key, label, type: 'color', cssVar: `--es-${key}`, def });
const range = (key, label, def, min, max, step = 1, unit = 'px') =>
  ({ key, label, type: 'range', cssVar: `--es-${key}`, def, min, max, step, unit });
const select = (key, label, def, choices) => ({ key, label, type: 'select', cssVar: `--es-${key}`, def, choices });
const check = (key, label, def) => ({ key, label, type: 'check', def });
const text = (key, label, def, ph) => ({ key, label, type: 'text', cssVar: `--es-${key}`, quoted: true, def, placeholder: ph });
const fontOpt = () => ({ key: 'font', label: '폰트', type: 'font', cssVar: '--es-font', def: '' });

const boxCommon = (accentDef, bgDef, inkDef) => [
  color('accent', '주 색상', accentDef),
  color('bg', '배경색', bgDef),
  color('ink', '글자색', inkDef),
  range('bw', '테두리 굵기', 2, 0, 8, 1, 'px'),
  range('radius', '모서리 둥글기', 8, 0, 28, 1, 'px'),
  range('pad', '안쪽 여백', 16, 4, 40, 1, 'px'),
  range('fs', '글자 크기', 100, 70, 150, 5, '%'),
  fontOpt(),
];
const animOpts = () => [
  check('anim', '움직임 켜기', true),
  range('dur', '재생 속도(초)', 2, 0.3, 8, 0.1, 's'),
];

// 프리셋 카탈로그 -------------------------------------------------------------
export const PRESETS = [
  // ── 로판·판타지 ──
  { id: 'goldbox', cat: 'fantasy', kind: 'block', name: '금박 장식 박스', motion: false,
    sample: '「그대를 무도회에 초대합니다」',
    options: boxCommon('#b8912f', '#fdf9ee', '#4a3d1f') },
  { id: 'royaldoc', cat: 'fantasy', kind: 'block', name: '왕실 공문서', motion: false,
    sample: '왕명이다. 즉시 입궁하라.',
    options: [color('accent', '인장 색', '#8c2a1e'), color('bg', '양피지색', '#f3e9d2'), color('ink', '글자색', '#3d2f1a'),
      range('pad', '안쪽 여백', 22, 8, 44, 1, 'px'), range('fs', '글자 크기', 100, 70, 150, 5, '%'),
      text('seal', '인장 글자', '王'), fontOpt()] },
  { id: 'invite', cat: 'fantasy', kind: 'block', name: '초대장', motion: false,
    sample: 'Invitation — 황실 무도회',
    options: [color('accent', '테두리색', '#a08a5f'), color('bg', '배경색', '#fffdf6'), color('ink', '글자색', '#54452c'),
      range('pad', '안쪽 여백', 26, 8, 48, 1, 'px'), range('ls', '자간', 2, 0, 8, 0.5, 'px'),
      range('fs', '글자 크기', 100, 70, 150, 5, '%'), fontOpt()] },
  { id: 'magiccontract', cat: 'fantasy', kind: 'block', name: '마법 계약서', motion: false,
    sample: '계약은 성립되었다 — 대가는 그대의 기억',
    options: [color('accent', '문양색', '#9d6bff'), color('bg', '배경색', '#1c1030'), color('ink', '글자색', '#e7dcff'),
      range('bw', '테두리 굵기', 2, 1, 6, 1, 'px'), range('pad', '안쪽 여백', 20, 8, 40, 1, 'px'),
      range('fs', '글자 크기', 100, 70, 150, 5, '%'), fontOpt()] },
  { id: 'shinytitle', cat: 'fantasy', kind: 'inline', name: '반짝이는 제목', motion: true,
    sample: '황금빛 운명의 서약',
    options: [color('accent', '금색', '#d4a017'), color('accent2', '하이라이트', '#fff3c4'),
      range('fs', '글자 크기', 120, 80, 220, 5, '%'), ...animOpts(), fontOpt()] },
  { id: 'divider', cat: 'fantasy', kind: 'block', name: '장면 전환 장식선', motion: false,
    sample: '그날 밤',
    options: [color('accent', '장식 색', '#a08a5f'),
      { key: 'sym', label: '장식 문양', type: 'select', cssVar: '--es-sym', quoted: true, def: '❦',
        choices: [{ value: '❦', label: '❦ 잎사귀' }, { value: '✦', label: '✦ 별' }, { value: '❈', label: '❈ 눈꽃' }, { value: '⚜', label: '⚜ 백합' }, { value: '✧', label: '✧ 반짝임' }] },
      range('fs', '글자 크기', 100, 70, 160, 5, '%'), fontOpt()] },
  { id: 'scroll', cat: 'fantasy', kind: 'block', name: '두루마리 예언서', motion: false,
    sample: '선택받은 자가 어둠을 걷어내리라',
    options: [color('bg', '종이색', '#f5ecd4'), color('ink', '글자색', '#4a3b22'),
      range('pad', '안쪽 여백', 24, 10, 44, 1, 'px'), range('fs', '글자 크기', 100, 70, 150, 5, '%'), fontOpt()] },
  { id: 'oldbook', cat: 'fantasy', kind: 'block', name: '고서 페이지', motion: false,
    sample: '…금단의 주문은 다음과 같이 전해진다',
    options: [color('bg', '종이색', '#efe3c0'), color('ink', '글자색', '#4d3d20'),
      range('pad', '안쪽 여백', 22, 8, 44, 1, 'px'), range('fs', '글자 크기', 100, 70, 150, 5, '%'), fontOpt()] },
  { id: 'moonglow', cat: 'fantasy', kind: 'inline', name: '달빛 글로우', motion: false,
    sample: '달빛이 그녀의 이름을 불렀다',
    options: [color('ink', '글자색', '#4a6fb3'), color('accent', '글로우 색', '#9db8ff'),
      range('fs', '글자 크기', 100, 70, 180, 5, '%'), fontOpt()] },

  // ── 게임·SF ──
  { id: 'sysbox', cat: 'game', kind: 'block', name: '시스템 상태창', motion: false,
    sample: '[알림] 레벨이 올랐습니다!',
    options: [color('accent', '테두리·제목', '#4db8ff'), color('bg', '배경색', '#0d1b2ae6'), color('ink', '글자색', '#dbeeff'),
      text('title', '헤더 문구', 'SYSTEM'), range('bw', '테두리 굵기', 1, 0, 6, 1, 'px'),
      range('radius', '모서리 둥글기', 8, 0, 24, 1, 'px'), range('pad', '안쪽 여백', 14, 4, 36, 1, 'px'),
      range('fs', '글자 크기', 95, 70, 140, 5, '%'), fontOpt()] },
  { id: 'statwin', cat: 'game', kind: 'widget', name: '스탯 창', motion: false,
    sample: 'HP: 42/100', options: [] },
  { id: 'quest', cat: 'game', kind: 'widget', name: '퀘스트 창', motion: false,
    sample: '메인 퀘스트 — 잃어버린 검', options: [] },
  { id: 'levelup', cat: 'game', kind: 'block', name: '레벨업 팝업', motion: true,
    sample: 'LEVEL UP!',
    options: [color('accent', '광선색', '#ffd54d'), color('bg', '중심색', '#231a05'), color('ink', '글자색', '#ffe89a'),
      range('fs', '글자 크기', 120, 80, 200, 5, '%'), ...animOpts(), fontOpt()] },
  { id: 'hologram', cat: 'game', kind: 'block', name: '홀로그램', motion: true,
    sample: '분석 완료. 대상: 인간형',
    options: [color('accent', '홀로그램색', '#41e8ff'), range('pad', '안쪽 여백', 14, 4, 36, 1, 'px'),
      range('fs', '글자 크기', 95, 70, 140, 5, '%'), ...animOpts(), fontOpt()] },
  { id: 'terminal', cat: 'game', kind: 'block', name: '터미널', motion: true,
    sample: '> access granted_',
    options: [color('accent', '글자색', '#37e05d'), color('bg', '배경색', '#0a0f0a'),
      range('pad', '안쪽 여백', 14, 4, 36, 1, 'px'), range('fs', '글자 크기', 92, 70, 140, 5, '%'), ...animOpts()] },
  { id: 'glitch', cat: 'game', kind: 'inline', name: '글리치', motion: true,
    sample: '오̷류̷ 발생',
    options: [color('accent', '오프셋 색 1', '#ff2d55'), color('accent2', '오프셋 색 2', '#2da9ff'),
      range('off', '어긋남 정도', 2, 1, 6, 0.5, 'px'), ...animOpts(), fontOpt()] },
  { id: 'neon', cat: 'game', kind: 'inline', name: '네온 사인', motion: true,
    sample: 'MIDNIGHT',
    options: [color('accent', '네온색', '#ff4dd8'), range('fs', '글자 크기', 110, 80, 200, 5, '%'),
      ...animOpts(), fontOpt()] },
  { id: 'dmgpop', cat: 'game', kind: 'inline', name: '데미지 숫자', motion: true,
    sample: '-9,999',
    options: [color('accent', '숫자 색', '#ff2d1f'), range('fs', '글자 크기', 150, 90, 300, 10, '%'),
      ...animOpts(), fontOpt()] },
  { id: 'warnbox', cat: 'game', kind: 'block', name: '경고 박스', motion: false,
    sample: '위험 구역에 진입했습니다',
    options: [color('accent', '경고색', '#f7c600'), color('bg', '배경색', '#1b1b12'), color('ink', '글자색', '#ffe9a8'),
      text('title', '경고 문구', 'WARNING'), range('pad', '안쪽 여백', 16, 6, 36, 1, 'px'),
      range('fs', '글자 크기', 100, 70, 150, 5, '%'), fontOpt()] },
  { id: 'battlelog', cat: 'game', kind: 'block', name: '전투 로그', motion: false,
    sample: '치명타! 그림자 늑대에게 342의 피해',
    options: [color('accent', '포인트 색', '#5a7d9c'), range('fs', '글자 크기', 85, 65, 120, 5, '%'),
      range('pad', '안쪽 여백', 12, 4, 30, 1, 'px')] },
  { id: 'pixelbox', cat: 'game', kind: 'block', name: '도트 게임 대화창', motion: false,
    sample: '용사여, 마왕성으로 가라!',
    options: [color('bg', '배경색', '#10214b'), color('ink', '글자색', '#ffffff'),
      range('pad', '안쪽 여백', 16, 6, 36, 1, 'px'), range('fs', '글자 크기', 95, 70, 140, 5, '%')] },
  { id: 'loadingbar', cat: 'game', kind: 'block', name: '로딩 바', motion: false,
    sample: '각성 진행률…',
    options: [range('pct', '진행률', 62, 0, 100, 1, '%'), color('accent', '게이지 색', '#3fa9f5'),
      color('bg', '빈 칸 색', '#e6edf3'), color('ink', '글자색', ''), range('fs', '글자 크기', 95, 70, 130, 5, '%'), fontOpt()] },

  // ── 공포 ──
  { id: 'flicker', cat: 'horror', kind: 'inline', name: '깜빡이는 글자', motion: true,
    sample: '……거기 누구 있어요?',
    options: [color('ink', '글자색', '#8b0000'), ...animOpts(), fontOpt()] },
  { id: 'grow', cat: 'horror', kind: 'chars', name: '점점 커지는 글자', motion: false,
    sample: '점점 가까워진다',
    options: [range('from', '시작 크기', 100, 50, 200, 5, '%'), range('to', '끝 크기', 200, 50, 400, 5, '%'),
      color('ink', '글자색', ''), fontOpt()] },
  { id: 'shrink', cat: 'horror', kind: 'chars', name: '점점 작아지는 글자', motion: false,
    sample: '목소리가 멀어져간다……',
    options: [range('from', '시작 크기', 130, 50, 200, 5, '%'), range('to', '끝 크기', 55, 30, 150, 5, '%'),
      color('ink', '글자색', ''), fontOpt()] },
  { id: 'shake', cat: 'horror', kind: 'inline', name: '흔들리는 글자', motion: true,
    sample: '괘, 괜찮아. 아무것도 아니야.',
    options: [range('amp', '흔들림 세기', 1.5, 0.5, 5, 0.5, 'px'), ...animOpts(), fontOpt()] },
  { id: 'blurred', cat: 'horror', kind: 'inline', name: '번진 글자', motion: false,
    sample: '시야가 흐려진다',
    options: [range('blur', '번짐 정도', 1.6, 0.5, 5, 0.1, 'px'), color('ink', '글자색', ''), fontOpt()] },
  { id: 'bloodbox', cat: 'horror', kind: 'block', name: '핏빛 얼룩 박스', motion: false,
    sample: '『도망쳐』',
    options: [color('accent', '핏빛', '#7a0e0e'), color('ink', '글자색', '#ffdada'),
      range('pad', '안쪽 여백', 18, 6, 40, 1, 'px'), range('fs', '글자 크기', 100, 70, 160, 5, '%'), fontOpt()] },
  { id: 'vignette', cat: 'horror', kind: 'block', name: '조여오는 어둠', motion: false,
    sample: '사방이 어두워졌다. 숨소리만 남았다.',
    options: [range('depth', '어둠 깊이', 42, 10, 90, 2, 'px'), color('bg', '바탕색', '#111111'),
      color('ink', '글자색', '#cfcfcf'), range('pad', '안쪽 여백', 26, 8, 48, 1, 'px'), fontOpt()] },
  { id: 'warped', cat: 'horror', kind: 'chars', name: '뒤틀린 배치', motion: false,
    sample: '이게아니야이게아니야',
    options: [range('rot', '기울기 정도', 8, 2, 25, 1, '°'), range('jit', '어긋남 정도', 3, 0, 10, 1, 'px'),
      color('ink', '글자색', ''), fontOpt()] },
  { id: 'redacted', cat: 'horror', kind: 'inline', name: '검열된 텍스트', motion: false,
    sample: '그 이름은 ■■■',
    options: [color('accent', '마커 색', '#111111'),
      select('ink', '가림 정도', 'transparent', [
        { value: 'transparent', label: '완전히 가리기' }, { value: 'rgba(255,255,255,0.3)', label: '살짝 비치기' }])] },
  { id: 'blooddrip', cat: 'horror', kind: 'inline', name: '피 흘러내리는 글자', motion: false,
    sample: '나가지 마',
    options: [color('accent', '핏빛', '#8f1414'), range('fs', '글자 크기', 110, 80, 200, 5, '%'), fontOpt()] },
  { id: 'upsidedown', cat: 'horror', kind: 'inline', name: '거꾸로 뒤집힌 글자', motion: false,
    sample: '여기는 안전해요',
    options: [range('fs', '글자 크기', 100, 70, 160, 5, '%'), color('ink', '글자색', ''), fontOpt()] },
  { id: 'tvnoise', cat: 'horror', kind: 'block', name: 'TV 노이즈 화면', motion: true,
    sample: '…다음 소식입니다. 실종자는 아직…',
    options: [range('pad', '안쪽 여백', 18, 6, 40, 1, 'px'), range('fs', '글자 크기', 100, 70, 150, 5, '%'),
      ...animOpts(), fontOpt()] },
  { id: 'heartbeat', cat: 'horror', kind: 'inline', name: '심장박동 강조', motion: true,
    sample: '쿵, 쿵, 쿵',
    options: [color('accent', '글자색', '#b3122e'), range('fs', '글자 크기', 105, 80, 180, 5, '%'),
      ...animOpts(), fontOpt()] },

  // ── 실물 목업 (구조형 위젯) ──
  { id: 'idcard', cat: 'mockup', kind: 'widget', name: '학생증 / 신분증', motion: false,
    sample: '이름: 김하늘', options: [] },
  { id: 'newspaper', cat: 'mockup', kind: 'widget', name: '신문 기사', motion: false,
    sample: '왕세자, 어젯밤 실종', options: [] },
  { id: 'letter', cat: 'mockup', kind: 'widget', name: '손편지', motion: false,
    sample: '너에게 쓰는 마지막 편지야', options: [] },
  { id: 'postit', cat: 'mockup', kind: 'widget', name: '포스트잇', motion: false,
    sample: '냉장고에 밥 있음', options: [] },
  { id: 'receipt', cat: 'mockup', kind: 'widget', name: '영수증', motion: false,
    sample: '아메리카노 4500', options: [] },
  { id: 'contractdoc', cat: 'mockup', kind: 'widget', name: '계약서 + 도장', motion: false,
    sample: '제1조 갑은 을에게…', options: [] },
  { id: 'wanted', cat: 'mockup', kind: 'widget', name: '현상수배 포스터', motion: false,
    sample: 'WANTED — 검은 늑대', options: [] },
  { id: 'ticket', cat: 'mockup', kind: 'widget', name: '입장권 / 티켓', motion: false,
    sample: '황실 오페라 하우스', options: [] },
  { id: 'telegram', cat: 'mockup', kind: 'widget', name: '전보', motion: false,
    sample: '부친 위독 급히 상경 바람', options: [] },
  { id: 'diary', cat: 'mockup', kind: 'widget', name: '일기장', motion: false,
    sample: '오늘도 그 애를 봤다', options: [] },

  // ── SNS·메신저 (구조형 위젯) ──
  { id: 'kakao', cat: 'sns', kind: 'widget', name: '카톡 대화', motion: false,
    sample: '나: 어디야?', options: [] },
  { id: 'sms', cat: 'sns', kind: 'widget', name: '문자 메시지', motion: false,
    sample: '나: 지금 갈게', options: [] },
  { id: 'insta', cat: 'sns', kind: 'widget', name: '인스타 게시물', motion: false,
    sample: 'haneul_02', options: [] },
  { id: 'tweet', cat: 'sns', kind: 'widget', name: '트위터(X) 글', motion: false,
    sample: '익명 @anon', options: [] },
  { id: 'comments', cat: 'sns', kind: 'widget', name: '커뮤니티 댓글창', motion: false,
    sample: '익게이: ㄹㅇ (+128)', options: [] },
  { id: 'livechat', cat: 'sns', kind: 'widget', name: '라이브 채팅', motion: false,
    sample: '별사탕: 완전 소름', options: [] },
  { id: 'phonecall', cat: 'sns', kind: 'widget', name: '전화 수신 화면', motion: false,
    sample: '엄마', options: [] },
  { id: 'email', cat: 'sns', kind: 'widget', name: '이메일', motion: false,
    sample: '제목: 합격을 축하드립니다', options: [] },
  { id: 'searchbox', cat: 'sns', kind: 'widget', name: '검색창', motion: false,
    sample: '시청역 실종 사건', options: [] },
  { id: 'breaking', cat: 'sns', kind: 'block', name: '뉴스 속보 배너', motion: false,
    sample: '수도 전역에 비상계엄 선포',
    options: [text('label', '배너 문구', '속보'), color('accent', '띠 색', '#d5001c'),
      color('bg', '배경색', '#101010'), range('fs', '글자 크기', 100, 70, 150, 5, '%'), fontOpt()] },

  // ── 텍스트 강조 ──
  { id: 'highlight', cat: 'text', kind: 'inline', name: '형광펜', motion: false,
    sample: '이 문장이 복선이다',
    options: [color('accent', '형광펜 색', '#fff176'), range('fs', '글자 크기', 100, 70, 150, 5, '%'), fontOpt()] },
  { id: 'gradtext', cat: 'text', kind: 'inline', name: '그라데이션 글자', motion: false,
    sample: '노을빛으로 물들다',
    options: [color('accent', '시작 색', '#ff7b54'), color('accent2', '끝 색', '#8b5cf6'),
      range('fs', '글자 크기', 100, 70, 180, 5, '%'), fontOpt()] },
  { id: 'outlinetext', cat: 'text', kind: 'inline', name: '외곽선 글자', motion: false,
    sample: '텅 빈 목소리',
    options: [color('accent', '외곽선 색', '#333333'), range('fs', '글자 크기', 110, 70, 200, 5, '%'), fontOpt()] },
  { id: 'shadowtext', cat: 'text', kind: 'inline', name: '그림자 글자', motion: false,
    sample: '그림자가 길게 늘어졌다',
    options: [color('accent', '그림자 색', '#00000066'), range('sx', '그림자 거리', 3, 1, 10, 1, 'px'),
      range('fs', '글자 크기', 100, 70, 180, 5, '%'), fontOpt()] },
  { id: 'underline', cat: 'text', kind: 'inline', name: '밑줄 변형', motion: false,
    sample: '밑줄 쫙',
    options: [select('ustyle', '밑줄 모양', 'wavy', [
      { value: 'wavy', label: '물결' }, { value: 'double', label: '이중' },
      { value: 'dotted', label: '점선' }, { value: 'solid', label: '직선' }]),
      color('accent', '밑줄 색', '#e5484d'), range('bw', '밑줄 굵기', 2, 1, 6, 0.5, 'px'), fontOpt()] },
  { id: 'fontarea', cat: 'text', kind: 'inline', name: '이 부분만 다른 폰트', motion: false,
    sample: '손글씨처럼 보이게',
    options: [fontOpt(), range('fs', '글자 크기', 100, 70, 180, 5, '%'), color('ink', '글자색', '')] },
  { id: 'spacing', cat: 'text', kind: 'inline', name: '자간·행간 조정', motion: false,
    sample: '숨 이  멎 을  듯 이',
    options: [range('ls', '자간', 3, -2, 14, 0.5, 'px'), range('lh', '행간', 1.8, 1, 3, 0.1, ''), fontOpt()] },
  { id: 'dropcap', cat: 'text', kind: 'block', name: '첫 글자 드롭캡', motion: false,
    sample: '그날 밤, 모든 것이 시작되었다.',
    options: [range('fs', '첫 글자 크기', 300, 180, 500, 10, '%'), color('accent', '첫 글자 색', '#8c2a1e'), fontOpt()] },
  { id: 'typewriter', cat: 'text', kind: 'inline', name: '타자기 글씨', motion: false,
    sample: '보고서 제7호. 대외비.',
    options: [color('ink', '글자색', '#222222'), range('fs', '글자 크기', 100, 70, 150, 5, '%'),
      range('ls', '자간', 0.06, 0, 0.3, 0.02, 'em')] },
  { id: 'doodleline', cat: 'text', kind: 'inline', name: '손그림 밑줄', motion: false,
    sample: '여기가 제일 중요함',
    options: [color('accent', '밑줄 색', '#ff8b8b'), range('bw', '밑줄 두께', 7, 3, 14, 1, 'px'), fontOpt()] },
  { id: 'stampmark', cat: 'text', kind: 'inline', name: '도장 워터마크', motion: false,
    sample: '이 문서는 반드시 소각할 것',
    options: [text('stamp', '도장 글자', '極秘'), color('accent', '도장 색', '#cc2222'),
      range('fs', '글자 크기', 100, 70, 150, 5, '%'), fontOpt()] },
  { id: 'verticaltext', cat: 'text', kind: 'block', name: '세로쓰기 강조', motion: false,
    sample: '밤의 끝에서',
    options: [range('fs', '글자 크기', 110, 80, 200, 5, '%'), range('ls', '자간', 0.15, 0, 0.6, 0.05, 'em'),
      color('ink', '글자색', ''), fontOpt()] },
];

export const presetById = id => PRESETS.find(p => p.id === id);

export function compatBadge(preset) {
  return preset.motion ? '움직임은 일부 뷰어에서만' : '어디서나 보임';
}

// ── 저장/미리보기 공용 기본 CSS ──────────────────────────────────────────────
// 모든 규칙은 es- 접두사, 옵션은 CSS 변수. 0% 상태(정지)도 완성된 디자인이 되게 설계.
export const BASE_CSS = `/* EPUB 스타일러 (es-styler) — 이 파일은 도구가 생성했습니다 */
.es-block { display: block; margin: 1em 0; }
[class*="es-"] { -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.es-widget { display: block; margin: 1.2em auto; max-width: 34em; font-family: -apple-system, "Pretendard", "Noto Sans KR", "Malgun Gothic", sans-serif; line-height: 1.5; }
.es-widget * { margin: 0; padding: 0; box-sizing: border-box; }

/* ── 로판·판타지 ── */
.es-goldbox { display: block; margin: 1.2em 0; padding: calc(var(--es-pad, 16px) + 6px) var(--es-pad, 16px);
  background: var(--es-bg, #fdf9ee); color: var(--es-ink, #4a3d1f);
  border: var(--es-bw, 2px) solid var(--es-accent, #b8912f); border-radius: var(--es-radius, 8px);
  box-shadow: inset 0 0 0 3px var(--es-bg, #fdf9ee), inset 0 0 0 4px var(--es-accent, #b8912f);
  font-size: var(--es-fs, 100%); font-family: var(--es-font, inherit); text-align: center; position: relative; }
.es-goldbox::before, .es-goldbox::after { content: "❦"; color: var(--es-accent, #b8912f);
  display: block; font-size: 0.9em; line-height: 1; }
.es-goldbox::before { margin-bottom: 0.5em; } .es-goldbox::after { margin-top: 0.5em; }

.es-royaldoc { display: block; margin: 1.2em 0; padding: var(--es-pad, 22px);
  color: var(--es-ink, #3d2f1a); font-size: var(--es-fs, 100%);
  font-family: var(--es-font, Georgia, "Nanum Myeongjo", serif);
  background: linear-gradient(160deg, var(--es-bg, #f3e9d2) 0%, #fffdf4 45%, var(--es-bg, #f3e9d2) 100%);
  border: 1px solid #c9b78d; box-shadow: 0 2px 8px rgba(60,40,10,.18); position: relative; }
.es-royaldoc::after { content: var(--es-seal, "王"); position: absolute; right: 14px; bottom: 10px;
  width: 2.2em; height: 2.2em; line-height: 2.2em; text-align: center; border-radius: 50%;
  border: 2px solid var(--es-accent, #8c2a1e); color: var(--es-accent, #8c2a1e);
  font-weight: bold; transform: rotate(-12deg); opacity: .85; }

.es-invite { display: block; margin: 1.2em auto; max-width: 30em; padding: var(--es-pad, 26px);
  text-align: center; letter-spacing: var(--es-ls, 2px); color: var(--es-ink, #54452c);
  background: var(--es-bg, #fffdf6); font-size: var(--es-fs, 100%); font-family: var(--es-font, Georgia, serif);
  border: 1px solid var(--es-accent, #a08a5f); outline: 1px solid var(--es-accent, #a08a5f); outline-offset: 4px; }

.es-magiccontract { display: block; margin: 1.2em 0; padding: var(--es-pad, 20px);
  background: radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--es-accent, #9d6bff) 26%, transparent), transparent 60%), var(--es-bg, #1c1030);
  color: var(--es-ink, #e7dcff); border: var(--es-bw, 2px) solid var(--es-accent, #9d6bff);
  border-radius: 6px; font-size: var(--es-fs, 100%); font-family: var(--es-font, inherit);
  box-shadow: 0 0 14px color-mix(in srgb, var(--es-accent, #9d6bff) 45%, transparent); }
.es-magiccontract::before { content: "✦ ✦ ✦"; display: block; text-align: center;
  color: var(--es-accent, #9d6bff); margin-bottom: .6em; letter-spacing: .6em; }

.es-shinytitle { font-size: var(--es-fs, 120%); font-weight: bold; font-family: var(--es-font, inherit);
  background: linear-gradient(100deg, var(--es-accent, #d4a017) 20%, var(--es-accent2, #fff3c4) 50%, var(--es-accent, #d4a017) 80%);
  background-size: 200% 100%; -webkit-background-clip: text; background-clip: text;
  color: transparent; -webkit-text-fill-color: transparent; }
.es-shinytitle.es-on { animation: es-shine var(--es-dur, 2s) linear infinite; }
@keyframes es-shine { 0% { background-position: 0% 0; } 100% { background-position: 200% 0; } }

/* ── 게임·SF ── */
.es-sysbox { display: block; margin: 1.2em 0; color: var(--es-ink, #dbeeff);
  background: var(--es-bg, #0d1b2ae6); border: var(--es-bw, 1px) solid var(--es-accent, #4db8ff);
  border-radius: var(--es-radius, 8px); font-size: var(--es-fs, 95%); font-family: var(--es-font, inherit);
  box-shadow: 0 0 12px color-mix(in srgb, var(--es-accent, #4db8ff) 35%, transparent); overflow: hidden; }
.es-sysbox { padding: var(--es-pad, 14px); }
.es-sysbox::before { content: var(--es-title, "SYSTEM"); display: block;
  margin: calc(var(--es-pad, 14px) * -1) calc(var(--es-pad, 14px) * -1) var(--es-pad, 14px);
  padding: .35em .9em; font-size: .72em; letter-spacing: .22em; color: var(--es-accent, #4db8ff);
  border-bottom: 1px solid color-mix(in srgb, var(--es-accent, #4db8ff) 45%, transparent);
  background: color-mix(in srgb, var(--es-accent, #4db8ff) 12%, transparent); }

.es-levelup { display: block; margin: 1.4em auto; max-width: 26em; padding: 1.1em 1.4em; text-align: center;
  font-size: var(--es-fs, 120%); font-weight: bold; color: var(--es-ink, #ffe89a);
  font-family: var(--es-font, inherit); border-radius: 12px;
  background: radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--es-accent, #ffd54d) 42%, var(--es-bg, #231a05)) 0%, var(--es-bg, #231a05) 75%);
  border: 1px solid var(--es-accent, #ffd54d);
  box-shadow: 0 0 18px color-mix(in srgb, var(--es-accent, #ffd54d) 55%, transparent);
  text-shadow: 0 0 10px var(--es-accent, #ffd54d); }
.es-levelup.es-on { animation: es-pulse var(--es-dur, 2s) ease-in-out infinite; }
@keyframes es-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }

.es-hologram { display: block; margin: 1.2em 0; padding: var(--es-pad, 14px);
  color: var(--es-accent, #41e8ff); font-size: var(--es-fs, 95%); font-family: var(--es-font, inherit);
  background: repeating-linear-gradient(0deg, color-mix(in srgb, var(--es-accent, #41e8ff) 10%, transparent) 0 1px, transparent 1px 3px),
    color-mix(in srgb, var(--es-accent, #41e8ff) 7%, #061218);
  border: 1px solid color-mix(in srgb, var(--es-accent, #41e8ff) 60%, transparent); border-radius: 4px;
  text-shadow: 0 0 6px var(--es-accent, #41e8ff);
  box-shadow: 0 0 14px color-mix(in srgb, var(--es-accent, #41e8ff) 30%, transparent); }
.es-hologram.es-on { animation: es-holo-flicker calc(var(--es-dur, 2s) * 2) steps(1) infinite; }
@keyframes es-holo-flicker { 0%, 92%, 96%, 100% { opacity: 1; } 93%, 95% { opacity: .75; } }

.es-terminal { display: block; margin: 1.2em 0; padding: var(--es-pad, 14px);
  background: var(--es-bg, #0a0f0a); color: var(--es-accent, #37e05d);
  font-family: "SF Mono", Consolas, "Nanum Gothic Coding", monospace; font-size: var(--es-fs, 92%);
  border-radius: 6px; border: 1px solid #1d301d; white-space: pre-wrap; }
.es-terminal::after { content: "▌"; margin-left: 2px; }
.es-terminal.es-on::after { animation: es-blink calc(var(--es-dur, 2s) / 2) steps(1) infinite; }
@keyframes es-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

.es-glitch { position: relative; font-family: var(--es-font, inherit);
  text-shadow: calc(var(--es-off, 2px) * -1) 0 var(--es-accent, #ff2d55), var(--es-off, 2px) 0 var(--es-accent2, #2da9ff); }
.es-glitch.es-on { animation: es-glitch-jump calc(var(--es-dur, 2s)) steps(2) infinite; }
@keyframes es-glitch-jump { 0%, 88%, 100% { transform: translate(0); } 90% { transform: translate(calc(var(--es-off, 2px) * -1), 1px); } 94% { transform: translate(var(--es-off, 2px), -1px); } }

.es-neon { color: #fff; font-size: var(--es-fs, 110%); font-family: var(--es-font, inherit);
  text-shadow: 0 0 4px #fff, 0 0 8px var(--es-accent, #ff4dd8), 0 0 16px var(--es-accent, #ff4dd8), 0 0 28px var(--es-accent, #ff4dd8); }
.es-neon.es-on { animation: es-neon-pulse var(--es-dur, 2s) ease-in-out infinite; }
@keyframes es-neon-pulse { 0%, 100% { text-shadow: 0 0 4px #fff, 0 0 8px var(--es-accent, #ff4dd8), 0 0 16px var(--es-accent, #ff4dd8), 0 0 28px var(--es-accent, #ff4dd8); }
  50% { text-shadow: 0 0 2px #fff, 0 0 5px var(--es-accent, #ff4dd8), 0 0 10px var(--es-accent, #ff4dd8); } }

/* ── 공포 ── */
.es-flicker { color: var(--es-ink, #8b0000); }
.es-flicker.es-on { animation: es-flicker-k var(--es-dur, 2s) steps(1) infinite; }
@keyframes es-flicker-k { 0%, 100% { opacity: 1; } 7% { opacity: .2; } 9% { opacity: 1; } 41% { opacity: .35; } 44% { opacity: 1; } 78% { opacity: .1; } 80% { opacity: 1; } }

.es-grow, .es-shrink, .es-warped { font-family: var(--es-font, inherit); color: var(--es-ink, inherit); }
.es-ch { display: inline-block; }

.es-shake { display: inline-block; transform: rotate(-1deg); font-family: var(--es-font, inherit); }
.es-shake.es-on { animation: es-shake-k calc(var(--es-dur, 2s) / 6) linear infinite; }
@keyframes es-shake-k {
  0%, 100% { transform: translate(0, 0) rotate(-0.6deg); }
  25% { transform: translate(var(--es-amp, 1.5px), calc(var(--es-amp, 1.5px) * -0.6)) rotate(0.5deg); }
  50% { transform: translate(calc(var(--es-amp, 1.5px) * -0.8), var(--es-amp, 1.5px)) rotate(-0.4deg); }
  75% { transform: translate(calc(var(--es-amp, 1.5px) * 0.6), calc(var(--es-amp, 1.5px) * 0.4)) rotate(0.6deg); } }

.es-blurred { filter: blur(var(--es-blur, 1.6px)); color: var(--es-ink, inherit);
  text-shadow: 0 0 3px currentColor; font-family: var(--es-font, inherit); }

.es-bloodbox { display: block; margin: 1.2em 0; padding: var(--es-pad, 18px); text-align: center;
  color: var(--es-ink, #ffdada); font-size: var(--es-fs, 100%); font-family: var(--es-font, inherit);
  background: radial-gradient(ellipse at 20% 20%, color-mix(in srgb, var(--es-accent, #7a0e0e) 80%, #000) 0%, transparent 55%),
    radial-gradient(ellipse at 85% 70%, color-mix(in srgb, var(--es-accent, #7a0e0e) 70%, #000) 0%, transparent 50%),
    color-mix(in srgb, var(--es-accent, #7a0e0e) 55%, #140303);
  border-radius: 4px; box-shadow: 0 0 22px color-mix(in srgb, var(--es-accent, #7a0e0e) 65%, transparent),
    inset 0 0 30px rgba(0,0,0,.6); }

.es-vignette { display: block; margin: 1.2em 0; padding: var(--es-pad, 26px);
  background: var(--es-bg, #111); color: var(--es-ink, #cfcfcf); font-family: var(--es-font, inherit);
  box-shadow: inset 0 0 var(--es-depth, 42px) calc(var(--es-depth, 42px) / 3) #000; border-radius: 3px; }

/* ── 텍스트 강조 ── */
.es-highlight { background: linear-gradient(transparent 38%, var(--es-accent, #fff176) 38%, var(--es-accent, #fff176) 92%, transparent 92%);
  font-size: var(--es-fs, 100%); font-family: var(--es-font, inherit); padding: 0 .1em; }
.es-gradtext { background: linear-gradient(90deg, var(--es-accent, #ff7b54), var(--es-accent2, #8b5cf6));
  -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent;
  font-size: var(--es-fs, 100%); font-weight: bold; font-family: var(--es-font, inherit); }
.es-outlinetext { color: transparent; -webkit-text-stroke: 1px var(--es-accent, #333);
  text-shadow: none; font-size: var(--es-fs, 110%); font-weight: bold; font-family: var(--es-font, inherit); }
.es-shadowtext { text-shadow: var(--es-sx, 3px) var(--es-sx, 3px) 0 var(--es-accent, #00000066);
  font-size: var(--es-fs, 100%); font-family: var(--es-font, inherit); }
.es-underline { text-decoration-line: underline; text-decoration-style: var(--es-ustyle, wavy);
  text-decoration-color: var(--es-accent, #e5484d); text-decoration-thickness: var(--es-bw, 2px);
  text-underline-offset: 3px; font-family: var(--es-font, inherit); }
.es-fontarea { font-family: var(--es-font, inherit); font-size: var(--es-fs, 100%); color: var(--es-ink, inherit); }
.es-spacing { letter-spacing: var(--es-ls, 3px); line-height: var(--es-lh, 1.8); font-family: var(--es-font, inherit); }
.es-dropcap { display: block; margin: 1em 0; font-family: var(--es-font, inherit); }
.es-dropcap::first-letter { font-size: var(--es-fs, 300%); float: left; line-height: .85;
  padding: 0 .12em 0 0; color: var(--es-accent, #8c2a1e); font-weight: bold; }

/* ── 구조형 위젯 공통 ── */
.es-w-kakao { background: #a9bdce; border-radius: 12px; padding: 10px; }
.es-w-kakao .es-k-title { text-align: center; font-size: .8em; color: #45586a; padding: 2px 0 8px; font-weight: 700; }
.es-k-row { display: block; margin: 4px 0; overflow: hidden; }
.es-k-name { display: block; font-size: .72em; color: #3c4b59; margin: 0 0 2px 42px; }
.es-k-ava { float: left; width: 34px; height: 34px; border-radius: 42%; background: #7b8fa3;
  color: #fff; text-align: center; line-height: 34px; font-size: .8em; margin-right: 8px; }
.es-k-bubble { display: inline-block; max-width: 72%; padding: .45em .7em; border-radius: 12px;
  background: #fff; font-size: .88em; word-break: break-word; vertical-align: top; }
.es-k-row.me { text-align: right; }
.es-k-row.me .es-k-bubble { background: #ffe812; border-radius: 12px; text-align: left; }
.es-k-meta { display: inline-block; font-size: .62em; color: #55606b; margin: 0 .4em; vertical-align: bottom; }
.es-k-meta .unread { color: #f2c025; font-weight: 700; display: block; text-align: right; }
.es-k-row.me .es-k-meta { text-align: right; }
.es-k-sys { text-align: center; margin: 8px 0; }
.es-k-sys span { display: inline-block; background: rgba(0,0,0,.18); color: #fff; border-radius: 999px;
  font-size: .7em; padding: .25em .9em; }

.es-w-sms { background: #f6f6f8; border: 1px solid #e3e3e8; border-radius: 14px; padding: 12px; }
.es-w-sms .es-k-name { margin-left: 2px; color: #8a8a90; }
.es-w-sms .es-k-bubble { background: #e9e9eb; color: #111; border-radius: 16px; }
.es-w-sms .es-k-row.me .es-k-bubble { background: #1289fe; color: #fff; }
.es-w-sms.android .es-k-row.me .es-k-bubble { background: #27ae60; }

.es-w-insta { background: #fff; border: 1px solid #dbdbdb; border-radius: 8px; color: #111; overflow: hidden; }
.es-i-head { padding: 8px 10px; font-weight: 700; font-size: .85em; border-bottom: 1px solid #efefef; }
.es-i-head .es-i-ava { display: inline-block; width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(45deg, #f09433, #dc2743, #bc1888); color: #fff; text-align: center;
  line-height: 26px; font-size: .75em; margin-right: 8px; vertical-align: middle; }
.es-i-photo { background: linear-gradient(135deg, #e8e2d8, #cfd8e0); text-align: center;
  padding: 2.6em 1em; color: #8b8b83; font-size: .8em; }
.es-i-actions { padding: 8px 10px 0; font-size: 1em; }
.es-i-likes { padding: 4px 10px 0; font-weight: 700; font-size: .8em; }
.es-i-caption { padding: 4px 10px 10px; font-size: .85em; line-height: 1.5; }
.es-i-caption b { margin-right: .4em; }
.es-i-cmt { padding: 0 10px 8px; font-size: .8em; color: #333; }
.es-i-cmt b { margin-right: .4em; }

.es-w-tweet { background: #fff; border: 1px solid #e1e8ed; border-radius: 14px; padding: 12px 14px; color: #0f1419; }
.es-t-head { overflow: hidden; margin-bottom: 6px; }
.es-t-ava { float: left; width: 38px; height: 38px; border-radius: 50%; background: #1d9bf0;
  color: #fff; text-align: center; line-height: 38px; margin-right: 9px; }
.es-t-name { font-weight: 800; font-size: .9em; }
.es-t-handle { color: #536471; font-size: .8em; }
.es-t-body { font-size: .95em; line-height: 1.5; margin: 4px 0 8px; white-space: pre-wrap; }
.es-t-stats { color: #536471; font-size: .78em; border-top: 1px solid #eff3f4; padding-top: 8px; }
.es-t-stats b { color: #0f1419; }

.es-w-comments { background: #fafafa; border: 1px solid #e0e0e0; border-radius: 6px; font-size: .85em; color: #222; }
.es-c-head { padding: 8px 10px; font-weight: 700; border-bottom: 1px solid #e0e0e0; background: #f0f0f0; font-size: .9em; }
.es-c-item { padding: 8px 10px; border-bottom: 1px solid #ececec; }
.es-c-item:last-child { border-bottom: 0; }
.es-c-item.reply { padding-left: 26px; background: #f5f6f8; }
.es-c-item.reply::before { content: "ㄴ "; color: #999; }
.es-c-nick { font-weight: 700; margin-right: .5em; }
.es-c-best { display: inline-block; background: #d9331f; color: #fff; font-size: .7em; font-weight: 700;
  border-radius: 3px; padding: .1em .4em; margin-right: .4em; vertical-align: middle; }
.es-c-vote { float: right; color: #d9331f; font-size: .78em; font-weight: 700; }
.es-c-vote .down { color: #3862c4; margin-left: .5em; }

.es-w-livechat { background: rgba(16, 16, 20, .92); border-radius: 8px; padding: 10px 12px;
  font-size: .82em; color: #eee; }
.es-l-row { margin: 3px 0; line-height: 1.5; word-break: break-word; }
.es-l-nick { font-weight: 700; margin-right: .5em; }

.es-w-idcard { background: linear-gradient(135deg, #f8fafc, #e9eef5); border: 1px solid #c6d0dc;
  border-radius: 12px; padding: 14px; color: #22303c; box-shadow: 0 3px 10px rgba(30,50,80,.12); overflow: hidden; }
.es-id-org { font-size: .72em; letter-spacing: .18em; color: #44607e; font-weight: 700;
  border-bottom: 2px solid #44607e; padding-bottom: 6px; margin-bottom: 10px; }
.es-id-photo { float: left; width: 64px; height: 80px; background: #cfd8e2; border: 1px solid #aab7c4;
  border-radius: 4px; margin-right: 12px; text-align: center; line-height: 80px; color: #7d8b99; font-size: .7em; }
.es-id-rows { overflow: hidden; font-size: .85em; }
.es-id-row { margin: 3px 0; }
.es-id-key { display: inline-block; width: 5.4em; color: #6a7886; font-size: .85em; }
.es-id-name { font-size: 1.15em; font-weight: 800; margin-bottom: 4px; }
.es-id-barcode { clear: both; margin-top: 12px; height: 26px;
  background: repeating-linear-gradient(90deg, #22303c 0 2px, transparent 2px 4px, #22303c 4px 7px, transparent 7px 9px, #22303c 9px 10px, transparent 10px 13px); }

.es-w-newspaper { background: #f7f4ec; border: 1px solid #d8d2c2; padding: 16px; color: #21201c;
  font-family: "Nanum Myeongjo", "Noto Serif KR", Batang, serif; }
.es-n-paper { text-align: center; font-size: .78em; letter-spacing: .3em; border-bottom: 3px double #21201c;
  padding-bottom: 6px; margin-bottom: 4px; font-weight: 700; }
.es-n-date { text-align: right; font-size: .68em; color: #6b6759; margin-bottom: 10px; }
.es-n-headline { font-size: 1.5em; font-weight: 900; line-height: 1.25; margin-bottom: 10px; word-break: keep-all; }
.es-n-body { font-size: .85em; line-height: 1.65; column-count: 2; column-gap: 1.4em;
  column-rule: 1px solid #d8d2c2; text-align: justify; }
@media (max-width: 480px) { .es-n-body { column-count: 1; } }

.es-w-letter { background: repeating-linear-gradient(180deg, #fffdf5 0 1.9em, #d8e4f0 1.9em calc(1.9em + 1px));
  border: 1px solid #e4ddc9; padding: 1.9em 1.4em 1.4em; color: #3a3630;
  font-family: var(--es-font, "Nanum Pen Script", cursive, sans-serif); line-height: 1.9; font-size: 1.02em;
  box-shadow: 0 3px 10px rgba(80,70,40,.14); white-space: pre-wrap; }

.es-w-postit { background: #ffef7d; width: 15em; padding: 1.1em 1em 1.4em; margin: 1.2em auto;
  transform: rotate(-2.2deg); box-shadow: 2px 4px 10px rgba(0,0,0,.22);
  font-family: var(--es-font, "Nanum Pen Script", cursive, sans-serif); color: #4d431a;
  line-height: 1.6; white-space: pre-wrap; }
.es-w-postit::before { content: ""; display: block; height: 10px; margin: -1.1em -1em 0.8em;
  background: rgba(255,255,255,.4); }

.es-w-receipt { background: #fdfdfb; border: 1px solid #e2e2da; width: 17em; margin: 1.2em auto;
  padding: 14px 12px; font-family: "SF Mono", Consolas, monospace; font-size: .78em; color: #2c2c28; }
.es-r-head { text-align: center; font-weight: 700; border-bottom: 1px dashed #999; padding-bottom: 8px; margin-bottom: 8px; }
.es-r-row { overflow: hidden; margin: 3px 0; }
.es-r-item { float: left; max-width: 62%; }
.es-r-price { float: right; }
.es-r-total { border-top: 1px dashed #999; margin-top: 8px; padding-top: 8px; font-weight: 700; }
.es-r-foot { text-align: center; color: #8b8b83; margin-top: 10px; font-size: .9em; }

.es-w-contractdoc { background: #fffef8; border: 2px solid #3d3a30; padding: 18px; color: #2b2a24;
  font-family: "Nanum Myeongjo", Batang, serif; position: relative; }
.es-cd-title { text-align: center; font-size: 1.3em; font-weight: 800; letter-spacing: .4em; margin-bottom: 12px; }
.es-cd-clause { font-size: .88em; line-height: 1.7; margin: 6px 0; }
.es-cd-sign { margin-top: 16px; text-align: right; font-size: .88em; }
.es-cd-stamp { display: inline-block; width: 2.4em; height: 2.4em; line-height: 2.2em; text-align: center;
  border: 3px solid #c0392b; border-radius: 6px; color: #c0392b; font-weight: 800; transform: rotate(8deg);
  margin-left: .5em; vertical-align: middle; opacity: .88; }

.es-w-statwin { background: #10182ae8; border: 1px solid #57b6ff; border-radius: 10px; padding: 0;
  color: #dcecff; overflow: hidden; box-shadow: 0 0 14px rgba(87,182,255,.3); max-width: 24em; }
.es-s-head { padding: .4em .9em; font-size: .8em; letter-spacing: .15em; color: #8fd0ff;
  background: rgba(87,182,255,.14); border-bottom: 1px solid rgba(87,182,255,.4); font-weight: 700; }
.es-s-body { padding: 10px 12px; }
.es-s-row { overflow: hidden; margin: 5px 0; font-size: .85em; }
.es-s-key { float: left; color: #7fa8cc; }
.es-s-val { float: right; font-weight: 700; }
.es-s-gauge { clear: both; height: 10px; background: #0a1020; border-radius: 999px; overflow: hidden;
  border: 1px solid rgba(87,182,255,.35); margin-top: 3px; }
.es-s-gauge i { display: block; height: 100%; background: linear-gradient(90deg, #2e8fff, #6fd7ff); }
.es-s-gauge.hp i { background: linear-gradient(90deg, #d3382c, #ff7b54); }
.es-s-gauge.mp i { background: linear-gradient(90deg, #2e5fff, #7fd0ff); }

.es-w-quest { background: #1b1710f2; border: 1px solid #caa64c; border-radius: 10px; color: #efe3c2;
  overflow: hidden; max-width: 26em; }
.es-q-head { padding: .5em 1em; background: rgba(202,166,76,.16); border-bottom: 1px solid rgba(202,166,76,.5);
  font-weight: 800; letter-spacing: .1em; color: #ecd28a; font-size: .9em; }
.es-q-body { padding: 10px 14px; font-size: .85em; }
.es-q-obj { margin: 4px 0; }
.es-q-obj::before { content: "◇ "; color: #caa64c; }
.es-q-reward { margin-top: 10px; border-top: 1px dashed rgba(202,166,76,.4); padding-top: 8px; color: #ffdf8e; }
.es-q-reward::before { content: "보상  "; font-size: .8em; color: #b09b62; letter-spacing: .1em; }

/* ── 로판·판타지 추가 ── */
.es-divider { display: block; text-align: center; margin: 1.5em 0; color: var(--es-accent, #a08a5f);
  font-size: var(--es-fs, 100%); font-family: var(--es-font, inherit); letter-spacing: .12em; }
.es-divider::before { content: var(--es-sym, "❦") "  ─────  "; opacity: .85; }
.es-divider::after { content: "  ─────  " var(--es-sym, "❦"); opacity: .85; }

.es-scroll { display: block; margin: 1.6em auto; max-width: 32em; padding: 1.5em var(--es-pad, 24px);
  background: linear-gradient(180deg, #e4d5ab 0%, var(--es-bg, #f5ecd4) 10%, var(--es-bg, #f5ecd4) 90%, #e4d5ab 100%);
  color: var(--es-ink, #4a3b22); font-family: var(--es-font, Georgia, "Nanum Myeongjo", serif);
  font-size: var(--es-fs, 100%); border-radius: 8px / 16px; position: relative;
  box-shadow: 0 5px 14px rgba(80, 60, 20, .28); }
.es-scroll::before, .es-scroll::after { content: ""; display: block; height: 13px; border-radius: 999px;
  background: linear-gradient(180deg, #bfa771, #8a744a); box-shadow: inset 0 2px 3px rgba(255,255,255,.45), 0 2px 4px rgba(60,40,10,.3);
  margin: -1.5em calc(var(--es-pad, 24px) * -1 - 8px) 1.2em; }
.es-scroll::after { margin: 1.2em calc(var(--es-pad, 24px) * -1 - 8px) -1.5em; }

.es-oldbook { display: block; margin: 1.2em 0; padding: var(--es-pad, 22px);
  background: radial-gradient(ellipse at 12% 18%, rgba(160,120,50,.2), transparent 42%),
    radial-gradient(ellipse at 88% 82%, rgba(140,100,40,.24), transparent 46%),
    radial-gradient(ellipse at 55% 45%, rgba(150,110,45,.1), transparent 52%), var(--es-bg, #efe3c0);
  color: var(--es-ink, #4d3d20); font-family: var(--es-font, "Nanum Myeongjo", Batang, serif);
  font-size: var(--es-fs, 100%); border-radius: 2% 5% 3% 6% / 5% 3% 6% 2%;
  box-shadow: 0 3px 10px rgba(70,50,10,.3), inset 0 0 44px rgba(120,90,30,.2); }

.es-moonglow { color: var(--es-ink, #4a6fb3); font-size: var(--es-fs, 100%); font-family: var(--es-font, inherit);
  text-shadow: 0 0 7px var(--es-accent, #9db8ff), 0 0 16px var(--es-accent, #9db8ff); }

/* ── 게임·SF 추가 ── */
.es-dmgpop { display: inline-block; transform: rotate(-6deg); font-weight: 900;
  color: var(--es-accent, #ff2d1f); font-size: var(--es-fs, 150%); font-family: var(--es-font, inherit);
  text-shadow: -2px 0 #fff, 2px 0 #fff, 0 -2px #fff, 0 2px #fff, 3px 4px 0 rgba(0,0,0,.25); }
.es-dmgpop.es-on { animation: es-dmg var(--es-dur, 2s) ease-out infinite; }
@keyframes es-dmg { 0%, 20%, 100% { transform: rotate(-6deg) scale(1); } 6% { transform: rotate(-6deg) scale(1.28); } 12% { transform: rotate(-6deg) scale(.96); } }

.es-warnbox { display: block; margin: 1.2em 0; padding: var(--es-pad, 16px);
  background: var(--es-bg, #1b1b12); color: var(--es-ink, #ffe9a8); font-size: var(--es-fs, 100%);
  font-family: var(--es-font, inherit); border: 6px solid var(--es-accent, #f7c600);
  border-image: repeating-linear-gradient(45deg, var(--es-accent, #f7c600) 0 12px, #14140d 12px 24px) 6; }
.es-warnbox::before { content: "⚠ " var(--es-title, "WARNING"); display: block; color: var(--es-accent, #f7c600);
  font-weight: 800; letter-spacing: .22em; margin-bottom: .55em; font-size: .8em; }

.es-battlelog { display: block; margin: 1.2em 0; padding: var(--es-pad, 12px) calc(var(--es-pad, 12px) + 4px);
  background: #101418; color: #9fb4c8; font-family: "SF Mono", Consolas, monospace;
  font-size: var(--es-fs, 85%); border-left: 3px solid var(--es-accent, #5a7d9c); white-space: pre-wrap; }
.es-battlelog::before { content: "— COMBAT LOG —"; display: block; color: var(--es-accent, #5a7d9c);
  letter-spacing: .25em; font-size: .75em; margin-bottom: .6em; }

.es-pixelbox { display: block; margin: 1.4em 4px; padding: var(--es-pad, 16px);
  background: var(--es-bg, #10214b); color: var(--es-ink, #fff);
  font-family: "Galmuri11", "DungGeunMo", "SF Mono", monospace; font-size: var(--es-fs, 95%);
  border: 4px solid #fff; border-radius: 2px; line-height: 1.8;
  box-shadow: 0 0 0 4px var(--es-bg, #10214b), 4px 4px 0 4px rgba(0,0,0,.35); position: relative; }
.es-pixelbox::after { content: "▼"; position: absolute; right: 12px; bottom: 4px; font-size: .7em; opacity: .8; }

.es-loadingbar { display: block; margin: 1.2em 0; color: var(--es-ink, inherit);
  font-size: var(--es-fs, 95%); font-family: var(--es-font, inherit); }
.es-loadingbar::after { content: ""; display: block; height: 12px; margin-top: 7px; border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--es-accent, #3fa9f5) 55%, #999);
  background: linear-gradient(90deg, var(--es-accent, #3fa9f5) 0 var(--es-pct, 62%), var(--es-bg, #e6edf3) var(--es-pct, 62%)); }

/* ── 공포 추가 ── */
.es-redacted { background: var(--es-accent, #111); color: var(--es-ink, transparent);
  border-radius: 2px; padding: 0 .18em; text-shadow: none; }
.es-blooddrip { color: var(--es-accent, #8f1414); font-weight: bold; font-size: var(--es-fs, 110%);
  font-family: var(--es-font, inherit);
  text-shadow: 0 2px 2px color-mix(in srgb, var(--es-accent, #8f1414) 55%, transparent),
    0 9px 7px color-mix(in srgb, var(--es-accent, #8f1414) 38%, transparent),
    0 16px 12px color-mix(in srgb, var(--es-accent, #8f1414) 22%, transparent); }
.es-upsidedown { display: inline-block; transform: rotate(180deg); font-size: var(--es-fs, 100%);
  color: var(--es-ink, inherit); font-family: var(--es-font, inherit); }
.es-tvnoise { display: block; margin: 1.2em 0; padding: var(--es-pad, 18px); color: #e8e8e8;
  font-size: var(--es-fs, 100%); font-family: var(--es-font, inherit);
  text-shadow: 1px 0 rgba(255, 0, 60, .55), -1px 0 rgba(0, 200, 255, .55);
  background: repeating-linear-gradient(0deg, rgba(255,255,255,.07) 0 1px, transparent 1px 3px),
    repeating-linear-gradient(90deg, #23252a 0 2px, #2d3037 2px 4px);
  border-radius: 10px; box-shadow: inset 0 0 46px #000; }
.es-tvnoise.es-on { animation: es-holo-flicker calc(var(--es-dur, 2s) * 1.7) steps(1) infinite; }
.es-heartbeat { display: inline-block; color: var(--es-accent, #b3122e); font-weight: bold;
  font-size: var(--es-fs, 105%); font-family: var(--es-font, inherit); }
.es-heartbeat.es-on { animation: es-heart var(--es-dur, 2s) ease-in-out infinite; }
@keyframes es-heart { 0%, 28%, 100% { transform: scale(1); } 6% { transform: scale(1.15); } 12% { transform: scale(1); } 18% { transform: scale(1.1); } }

/* ── 뉴스 속보 배너 ── */
.es-breaking { display: block; margin: 1.2em 0; background: var(--es-bg, #101010); color: #fff;
  font-weight: 700; font-size: var(--es-fs, 100%); font-family: var(--es-font, inherit);
  padding: .55em .8em; border-left: 6px solid var(--es-accent, #d5001c); }
.es-breaking::before { content: var(--es-label, "속보"); display: inline-block;
  background: var(--es-accent, #d5001c); color: #fff; font-size: .72em; padding: .18em .6em;
  margin-right: .6em; border-radius: 3px; letter-spacing: .18em; vertical-align: middle; }

/* ── 텍스트 강조 추가 ── */
.es-typewriter { font-family: "Courier New", Courier, "Nanum Gothic Coding", monospace;
  letter-spacing: var(--es-ls, .06em); color: var(--es-ink, #222); font-size: var(--es-fs, 100%);
  text-shadow: .4px .3px 0 rgba(0, 0, 0, .38); }
.es-doodleline { padding-bottom: .12em;
  background-image: linear-gradient(97deg, transparent 1%, color-mix(in srgb, var(--es-accent, #ff8b8b) 75%, transparent) 3% 95%, transparent 97%),
    linear-gradient(94deg, transparent 3%, var(--es-accent, #ff8b8b) 6% 97%, transparent 99%);
  background-size: 100% calc(var(--es-bw, 7px) * .7), 100% var(--es-bw, 7px);
  background-position: 0 98%, 0 92%; background-repeat: no-repeat; font-family: var(--es-font, inherit); }
.es-stampmark { position: relative; display: inline-block; font-size: var(--es-fs, 100%); font-family: var(--es-font, inherit); }
.es-stampmark::after { content: var(--es-stamp, "極秘"); position: absolute; left: 50%; top: 50%;
  transform: translate(-50%, -50%) rotate(-14deg); border: 3px double var(--es-accent, #c22);
  color: var(--es-accent, #c22); border-radius: 8px; padding: .05em .35em; font-weight: 900;
  opacity: .4; font-size: 1.25em; white-space: nowrap; }
.es-verticaltext { display: block; width: max-content; max-width: 90%; margin: 1.4em auto;
  writing-mode: vertical-rl; text-orientation: mixed; min-height: 7em; max-height: 22em;
  font-size: var(--es-fs, 110%); letter-spacing: var(--es-ls, .15em);
  color: var(--es-ink, inherit); font-family: var(--es-font, inherit); }

/* ── 실물 위젯 추가 ── */
.es-w-wanted { background: #efe0b8; border: 3px double #5b4a26; padding: 18px 16px; text-align: center;
  color: #453718; font-family: "Nanum Myeongjo", Georgia, serif; max-width: 22em; margin: 1.2em auto;
  box-shadow: 0 4px 12px rgba(70,50,10,.25); }
.es-wa-head { font-size: 1.7em; font-weight: 900; letter-spacing: .3em; border-bottom: 2px solid #5b4a26;
  padding-bottom: 6px; margin-bottom: 10px; }
.es-wa-photo { width: 9em; height: 7em; margin: 0 auto 10px; background: #d9c795; border: 1px solid #a8935e;
  line-height: 7em; color: #8a7748; font-size: .8em; }
.es-wa-name { font-size: 1.15em; font-weight: 800; margin-bottom: 6px; }
.es-wa-desc { font-size: .82em; line-height: 1.6; }
.es-wa-reward { margin-top: 10px; border-top: 1px dashed #8a7748; padding-top: 8px; font-weight: 800;
  letter-spacing: .1em; font-size: .95em; }

.es-w-ticket { display: flex; max-width: 26em; margin: 1.2em auto; background: #fffdf4;
  border: 1px solid #d9cba0; border-radius: 10px; overflow: hidden; color: #4c421f;
  box-shadow: 0 3px 10px rgba(80,60,20,.18); }
.es-tk-main { flex: 1; padding: 14px 16px; }
.es-tk-title { font-weight: 800; font-size: 1.05em; margin-bottom: 6px; }
.es-tk-rows { font-size: .8em; line-height: 1.6; color: #6f6338; }
.es-tk-meta { margin-top: 8px; font-size: .75em; letter-spacing: .06em; color: #8a7b48;
  border-top: 1px solid #e7dcb8; padding-top: 6px; }
.es-tk-stub { flex: none; width: 3em; display: flex; align-items: center; justify-content: center;
  writing-mode: vertical-rl; letter-spacing: .35em; font-size: .7em; font-weight: 800; color: #8a7b48;
  border-left: 2px dashed #c9ba8c; background: #f7f0d8; }

.es-w-telegram { background: #f4efdf; border: 1px solid #c9c0a3; max-width: 26em; margin: 1.2em auto;
  color: #33301f; font-family: "SF Mono", Consolas, monospace; }
.es-tg-head { text-align: center; letter-spacing: .5em; font-weight: 800; padding: 8px;
  border-bottom: 2px solid #33301f; font-size: .9em; }
.es-tg-meta { font-size: .68em; padding: 6px 12px; border-bottom: 1px dashed #a89f7f; color: #6c6547; }
.es-tg-body { padding: 14px 12px 16px; letter-spacing: .3em; line-height: 2; font-size: .9em; word-break: keep-all; }

.es-w-diary { background: repeating-linear-gradient(180deg, #fffef8 0 1.9em, #e6dccb 1.9em calc(1.9em + 1px)),
  linear-gradient(90deg, transparent 2.2em, rgba(214,120,120,.5) 2.2em, rgba(214,120,120,.5) calc(2.2em + 1px), transparent calc(2.2em + 1px));
  background-blend-mode: multiply; border: 1px solid #e0d6c2; padding: 1.9em 1.2em 1.4em 2.8em;
  color: #443c30; font-family: var(--es-font, "Nanum Pen Script", cursive, sans-serif);
  line-height: 1.9; white-space: pre-wrap; box-shadow: 0 3px 10px rgba(80,70,40,.14); }
.es-d-head { font-weight: 700; border-bottom: 2px solid rgba(214,120,120,.4); display: inline-block;
  margin-bottom: .4em; }

/* ── SNS·디지털 위젯 추가 ── */
.es-w-phone { background: linear-gradient(180deg, #17181d, #23252e); border-radius: 22px; max-width: 17em;
  margin: 1.2em auto; padding: 26px 18px 22px; text-align: center; color: #f2f2f5;
  box-shadow: 0 8px 24px rgba(0,0,0,.35); }
.es-p-status { font-size: .72em; color: #9a9aa5; letter-spacing: .12em; margin-bottom: 14px; }
.es-p-ava { width: 64px; height: 64px; border-radius: 50%; background: #3c3f4c; margin: 0 auto 10px;
  line-height: 64px; font-size: 1.3em; }
.es-p-name { font-size: 1.25em; font-weight: 700; }
.es-p-sub { font-size: .78em; color: #9a9aa5; margin-top: 3px; min-height: 1em; }
.es-p-btns { display: flex; justify-content: space-between; margin-top: 22px; padding: 0 10px; }
.es-p-btns span { width: 52px; height: 52px; border-radius: 50%; line-height: 52px; font-size: 1.1em; color: #fff; }
.es-p-btns .dec { background: #e5484d; }
.es-p-btns .acc { background: #30c04f; }

.es-w-email { background: #fff; border: 1px solid #dde1e6; border-radius: 8px; color: #1c2128;
  max-width: 30em; margin: 1.2em auto; overflow: hidden; }
.es-e-subject { padding: 12px 14px; font-weight: 800; font-size: 1em; border-bottom: 1px solid #eceff2; }
.es-e-meta { padding: 5px 14px; font-size: .76em; color: #5c6570; }
.es-e-meta b { display: inline-block; width: 4.6em; color: #8a929b; font-weight: 600; }
.es-e-body { padding: 12px 14px 16px; font-size: .88em; line-height: 1.7; border-top: 1px solid #eceff2;
  margin-top: 4px; white-space: pre-wrap; }

.es-w-search { max-width: 26em; margin: 1.2em auto; color: #202124;
  font-family: -apple-system, "Pretendard", "Noto Sans KR", sans-serif; }
.es-se-box { background: #fff; border: 1px solid #dfe1e5; border-radius: 999px; padding: .6em 1.1em;
  font-size: .92em; box-shadow: 0 2px 6px rgba(32,33,36,.14); }
.es-se-box::before { content: "⌕ "; color: #9aa0a6; font-weight: 700; }
.es-se-list { background: #fff; border: 1px solid #dfe1e5; border-top: 0; border-radius: 14px;
  margin: 6px 8px 0; overflow: hidden; }
.es-se-item { padding: .5em 1.1em; font-size: .82em; color: #3c4043; border-bottom: 1px solid #f1f3f4; }
.es-se-item::before { content: "⌕ "; color: #c2c7cc; }
.es-se-item:last-child { border-bottom: 0; }

/* 애니메이션 호환: 축소 동작 선호 시 전부 정지 (정지 상태도 완성 디자인) */
@media (prefers-reduced-motion: reduce) {
  [class*="es-"], [class*="es-"]::before, [class*="es-"]::after { animation: none !important; }
}
`;
