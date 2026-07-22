// ── 추가 효과 카탈로그 (2차): 스타일 + 애니메이션 ──
// presets.js가 이 파일을 불러와 기존 카탈로그에 합친다.

const color = (key, label, def) => ({ key, label, type: 'color', cssVar: `--es-${key}`, def });
const range = (key, label, def, min, max, step = 1, unit = 'px') =>
  ({ key, label, type: 'range', cssVar: `--es-${key}`, def, min, max, step, unit });
const select = (key, label, def, choices) => ({ key, label, type: 'select', cssVar: `--es-${key}`, def, choices });
const check = (key, label, def) => ({ key, label, type: 'check', def });
const text = (key, label, def) => ({ key, label, type: 'text', cssVar: `--es-${key}`, quoted: true, def });
const fontOpt = () => ({ key: 'font', label: '폰트', type: 'font', cssVar: '--es-font', def: '' });
const pad = (def = 18) => range('pad', '안쪽 여백', def, 4, 44, 1, 'px');
const fs = (def = 100) => range('fs', '글자 크기', def, 70, 160, 5, '%');
const anim = () => [check('anim', '움직임 켜기', true), range('dur', '재생 속도(초)', 2, 0.3, 10, 0.1, 's')];
const iterOpt = def => select('iter', '반복', def, [
  { value: 'infinite', label: '무한 반복' }, { value: '1', label: '1회' }, { value: '3', label: '3회' }]);

const B = (id, cat, name, sample, options = [], motion = false) =>
  ({ id, cat, kind: 'block', name, sample, motion, options });
const I = (id, cat, name, sample, options = [], motion = false) =>
  ({ id, cat, kind: 'inline', name, sample, motion, options });
const W = (id, cat, name, sample) => ({ id, cat, kind: 'widget', name, sample, motion: false, options: [] });
// 움직임 프리셋: 기본 옵션(켜기/속도/반복). 클래스는 es-a-* 로 통일한다.
const A = (id, name, sample, iter = 'infinite', extra = [], kind = 'inline') =>
  ({ id: `a-${id}`, cat: 'motion', kind, name, sample, motion: true, options: [...anim(), iterOpt(iter), ...extra] });

export const EXTRA_PRESETS = [
  // ═══ 로판·판타지 ═══
  B('stainedglass', 'fantasy', '스테인드글라스', '빛은 유리를 지나 기도가 된다', [pad(20), fs(), fontOpt()]),
  B('ribbon', 'fantasy', '리본 배너 제목', '제1장 · 몰락한 공녀', [color('accent', '리본 색', '#a4485c'), fs(110), fontOpt()]),
  B('gemframe', 'fantasy', '보석 프레임', '보석함 깊은 곳의 비밀', [color('accent', '보석 색', '#7e4fd4'), color('bg', '배경색', '#fdfbff'), pad(20), fs(), fontOpt()]),
  B('prayer', 'fantasy', '기도문', '빛이시여, 길 잃은 양을 인도하소서', [color('accent', '장식 색', '#b3924e'), fs(105), fontOpt()]),
  B('holylight', 'fantasy', '성광', '신탁이 내려졌다', [color('accent', '후광 색', '#f0d47e'), pad(22), fs(), fontOpt()]),
  B('aurora', 'fantasy', '오로라', '하늘이 녹아내리듯 물들었다', [pad(20), fs(), ...anim(), fontOpt()], true),
  B('starlight', 'fantasy', '별빛', '별이 쏟아지는 밤이었다', [color('bg', '밤하늘 색', '#151b33'), pad(20), fs(), fontOpt()]),
  B('magiccircle', 'fantasy', '마법진', '소환 의식이 시작된다', [color('accent', '마법진 색', '#9d6bff'), pad(26), fs(), ...anim(), fontOpt()], true),
  B('runeframe', 'fantasy', '룬 각인', 'ᚱᚢᚾ — 고대의 언어가 깨어난다', [color('accent', '룬 색', '#3f7d6c'), color('bg', '배경색', '#f2efe6'), pad(18), fs(), fontOpt()]),
  B('spirit', 'fantasy', '정령의 축복', '숲의 정령이 곁에 머문다', [color('accent', '자연 색', '#4d9e5f'), pad(18), fs(), fontOpt()]),
  B('crystal', 'fantasy', '수정 결정', '얼음보다 맑은 결정', [color('accent', '수정 색', '#7ec5e8'), pad(18), fs(), fontOpt()]),
  B('oracle', 'fantasy', '신탁', '─ 운명은 이미 정해져 있다 ─', [color('accent', '빛줄기 색', '#e8d9a0'), pad(24), fs(105), fontOpt()]),
  B('dragonbreath', 'fantasy', '용의 숨결', '용이 눈을 떴다', [color('accent', '화염 색', '#d43f2a'), color('accent2', '금빛', '#e8b04a'), pad(20), fs(), fontOpt()]),
  B('crownframe', 'fantasy', '왕관 프레임', '여왕 폐하 만세', [color('accent', '금장 색', '#b8912f'), color('bg', '배경색', '#fffdf4'), pad(20), fs(), fontOpt()]),
  B('velvet', 'fantasy', '벨벳 카드', '초대받은 자만 들어올 수 있다', [color('bg', '벨벳 색', '#4e1526'), color('accent', '금테 색', '#caa64c'), pad(22), fs(), fontOpt()]),
  B('marble', 'fantasy', '대리석', '궁전의 아침은 차갑다', [pad(22), fs(), fontOpt()]),

  // ═══ 종이·문서 ═══
  B('prophecy', 'paper', '예언서', '핏빛 달이 뜨는 날, 왕좌가 무너지리라', [color('accent', '문양 색', '#8c6bb8'), pad(24), fs(), fontOpt()]),
  B('parchment', 'paper', '양피지', '오래된 기록의 첫 장', [color('bg', '종이색', '#ead9b0'), color('ink', '글자색', '#503f22'), pad(20), fs(), fontOpt()]),
  B('oldletter', 'paper', '오래된 편지', '이 편지가 닿을 때쯤이면…', [color('bg', '종이색', '#f6efdc'), color('ink', '잉크색', '#42506b'), pad(24), fs(), fontOpt()]),
  B('waxseal', 'paper', '밀랍 봉인', '봉인을 뜯는 순간, 되돌릴 수 없다', [color('accent', '봉인 색', '#a02c2c'), text('seal', '인장 글자', 'S'), pad(22), fs(), fontOpt()]),
  B('labnote', 'paper', '연구노트', '실험 47일차. 피험체가 말을 하기 시작했다.', [color('accent', '모눈 색', '#b9cfe0'), pad(20), fs(95), fontOpt()]),
  B('magazine', 'paper', '잡지 인터뷰', '"저는 그날 아무것도 보지 못했어요."', [color('accent', '포인트 색', '#d5462e'), pad(20), fs(), fontOpt()]),
  B('classified', 'paper', '기밀문서', '대외비: 7급 이상 열람 가능', [text('stamp', '스탬프 문구', 'SECRET'), color('accent', '스탬프 색', '#c22a1e'), pad(20), fs(95)]),
  B('casefile', 'paper', '사건파일', '사건번호 1998-1031. 미제.', [text('label', '파일 라벨', 'CASE FILE'), pad(20), fs(95)]),

  // ═══ 액션 ═══
  B('awaken', 'action', '각성', '눈동자에 푸른 번개가 스쳤다', [color('accent', '번개 색', '#4da3ff'), pad(20), fs(105), fontOpt()]),
  B('ultimate', 'action', '필살기', '최종오의 — 멸화참', [color('accent', '에너지 색', '#ff3b1f'), pad(20), fs(110), fontOpt()]),
  I('slashmark', 'action', '참격', '검이 지나간 자리', [color('accent', '검광 색', '#c9d6e2'), fs(110), fontOpt()]),
  B('shockwave', 'action', '충격파', '쿠웅ㅡ 대지가 울렸다', [color('accent', '파동 색', '#e8a33d'), pad(22), fs(105), fontOpt()]),
  B('flamebox', 'action', '화염', '불길이 모든 것을 삼켰다', [color('accent', '불꽃 색', '#ff6b2a'), pad(20), fs(), fontOpt()]),
  B('icebox', 'action', '빙결', '시간마저 얼어붙었다', [color('accent', '얼음 색', '#8ed4f0'), pad(20), fs(), fontOpt()]),
  I('boltmark', 'action', '낙뢰', '하늘이 갈라졌다', [color('accent', '번개 색', '#ffd94d'), fs(115), fontOpt()]),
  B('manaburst', 'action', '마력 폭주', '제어할 수 없는 힘이 흘러넘친다', [color('accent', '마력 색', '#b44dff'), pad(20), fs(), fontOpt()]),
  B('barrier', 'action', '결계', '이 선 안으로는 아무것도 들어올 수 없다', [color('accent', '결계 색', '#5fd4c8'), pad(20), fs(), fontOpt()]),

  // ═══ 게임·SF ═══
  B('hud', 'game', 'HUD 인터페이스', 'TARGET LOCKED · 거리 340m', [color('accent', 'HUD 색', '#39d98a'), pad(16), fs(92)]),
  B('aipanel', 'game', 'AI 분석 패널', '분석 완료 · 위협 등급 S', [color('accent', '패널 색', '#5fb0ff'), text('title', '패널 제목', 'AI ANALYSIS'), pad(16), fs(92), fontOpt()]),
  B('errorwin', 'game', '오류 팝업', '치명적인 오류가 발생했습니다', [color('accent', '제목줄 색', '#c0392b'), text('title', '창 제목', '오류'), fs(95), fontOpt()]),
  B('radar', 'game', '데이터 스캔', '스캔 중… 생체 반응 3건 감지', [color('accent', '레이더 색', '#3fe07c'), pad(20), fs(92), ...anim()], true),
  B('cyber', 'game', '사이버 네온 카드', '2077, 밤의 도시', [color('accent', '네온 색 1', '#00e5ff'), color('accent2', '네온 색 2', '#ff2ea6'), pad(20), fs(), fontOpt()]),
  B('itemget', 'game', '아이템 획득', '[전설] 몰락한 왕의 검을 획득했습니다', [select('grade', '등급 색', '#ff9c2e', [
    { value: '#9e9e9e', label: '일반(회색)' }, { value: '#3fa9f5', label: '희귀(파랑)' },
    { value: '#b44dff', label: '영웅(보라)' }, { value: '#ff9c2e', label: '전설(주황)' }]), pad(14), fs(95), fontOpt()]),
  B('bsod', 'game', '블루스크린', '시스템에 문제가 발생하여 재부팅이 필요합니다', [fs(95)]),
  B('ledboard', 'game', '전광판 LED', 'NEXT STOP · 종말역', [color('accent', 'LED 색', '#ff4d2e'), pad(16), fs(105)]),
  B('codeblock', 'game', '해킹 코드', 'inject --target=world.exe', [color('accent', '키워드 색', '#66d9ef'), pad(16), fs(88)]),
  B('countdown', 'game', '카운트다운', '00:59:59', [color('accent', '숫자 색', '#ff3b30'), fs(160)]),
  W('skillcard', 'game', '스킬 카드', '섬광 베기'),
  W('choices', 'game', '게임 선택지', '▶ 1. 문을 연다'),

  // ═══ 공포 ═══
  B('nightmare', 'horror', '악몽', '깨어나도 꿈속이었다', [pad(22), fs(), fontOpt()]),
  B('abyss', 'horror', '심연', '그것은 바닥 없는 어둠이었다', [pad(24), fs(), fontOpt()]),
  B('bloodstain', 'horror', '핏자국 종이', '여기서 무슨 일이 있었던 걸까', [color('bg', '종이색', '#f1e9da'), color('accent', '얼룩 색', '#8f1d14'), pad(22), fs(), fontOpt()]),
  B('asylum', 'horror', '폐병원', '3호실. 침대는 아직 따뜻했다.', [pad(22), fs(95), fontOpt()]),
  B('brokenmirror', 'horror', '깨진 거울', '거울 속의 내가 웃고 있었다', [pad(22), fs(), fontOpt()]),
  B('cctv', 'horror', 'CCTV 화면', '03:33:33 · 비상계단', [text('label', '화면 표시', 'CAM 04'), pad(18), fs(92), ...anim()], true),
  B('fluorescent', 'horror', '형광등 조명', '복도 끝 형광등이 깜빡였다', [color('accent', '조명 색', '#c8e6c9'), pad(20), fs(), ...anim(), fontOpt()], true),
  B('curse', 'horror', '저주', '이 글을 읽는 자, 사흘 안에…', [color('accent', '문양 색', '#5c1a1a'), pad(22), fs(), fontOpt()]),
  I('scratch', 'horror', '긁힌 자국', '나가게 해줘', [color('accent', '흠집 색', '#7a7a7a'), fs(105), fontOpt()]),
  I('mirror', 'horror', '거울 반전 글자', '도와줘', [fs(), fontOpt()]),
  I('whisper', 'horror', '속삭임', '들리니… 내 목소리가…', [range('ls', '자간', 4, 1, 12, 0.5, 'px'), fontOpt()]),
  B('mold', 'horror', '곰팡이 벽지', '벽지 뒤에서 뭔가 자라고 있었다', [pad(22), fs(), fontOpt()]),
  I('dday', 'horror', 'D-DAY 스탬프', '남은 시간', [text('day', '스탬프 문구', 'D-3'), color('accent', '도장 색', '#c22a1e'), fs(), fontOpt()]),

  // ═══ 감성 ═══
  B('sakura', 'mood', '벚꽃', '봄바람에 꽃잎이 흩날렸다', [pad(20), fs(), fontOpt()]),
  B('rosegarden', 'mood', '장미정원', '장미가 피는 계절에 다시 만나요', [color('accent', '장미 색', '#c94f6d'), pad(22), fs(), fontOpt()]),
  B('sunset', 'mood', '노을', '하루의 끝이 물들어간다', [pad(22), fs(), fontOpt()]),
  B('dawn', 'mood', '새벽', '아직 아무도 깨지 않은 시간', [pad(22), fs(), fontOpt()]),
  B('mist', 'mood', '물안개', '호수 위로 안개가 내려앉았다', [pad(22), fs(), fontOpt()]),
  B('frost', 'mood', '겨울 서리', '유리창에 겨울이 피었다', [pad(22), fs(), fontOpt()]),
  B('glassjar', 'mood', '유리병 편지', '언젠가 닿기를 바라며', [color('accent', '유리 색', '#a8cfd8'), pad(20), fs(), fontOpt()]),
  B('watercolor', 'mood', '수채화', '번지는 것은 물감만이 아니었다', [color('accent', '물감 색 1', '#7fb8d8'), color('accent2', '물감 색 2', '#e8a0b8'), pad(22), fs(), fontOpt()]),
  B('pressedflower', 'mood', '꽃압화 편지', '책갈피 속 마른 꽃처럼', [color('bg', '종이색', '#fbf7ec'), pad(24), fs(), fontOpt()]),

  // ═══ 학교·칠판 ═══
  B('chalkboard', 'paper', '초록 칠판', '오늘의 목표: 살아남기', [color('bg', '칠판 색', '#2e5641'), pad(22), fs(), fontOpt()]),
  B('blackboard', 'paper', '검은 칠판', '수업 중 떠들지 말 것', [pad(22), fs(), fontOpt()]),
  I('chalktext', 'paper', '분필 글씨', '방과후 옥상으로', [color('ink', '분필 색', '#f2f0e4'), fs(105), fontOpt()]),
  B('noticepin', 'paper', '교실 공지', '가정통신문: 내일은 단축수업입니다', [color('bg', '종이색', '#fffef2'), color('accent', '압정 색', '#d5462e'), pad(20), fs(95), fontOpt()]),
  B('whiteboard', 'paper', '화이트보드', '회의 안건: 축제 예산', [color('accent', '마커 색', '#2456c4'), pad(22), fs(), fontOpt()]),
  B('timetable', 'paper', '시간표', '1교시 국어 · 2교시 마법학', [color('accent', '칸 선 색', '#9db8d0'), pad(16), fs(92), fontOpt()]),
  B('examsheet', 'paper', '시험지', '다음 중 옳은 것을 고르시오.', [text('title', '시험 제목', '2026학년도 1학기 중간고사'), pad(20), fs(92)]),
  B('wrongnote', 'paper', '오답노트', '또 틀렸다. 다시는 안 틀린다.', [color('accent', '빨간펜 색', '#d5462e'), pad(20), fs(95), fontOpt()]),

  // ═══ 실물 ═══
  B('tornnote', 'mockup', '찢은 메모지', '먼저 가 있을게.\n찾지 마.', [color('bg', '종이색', '#fdfaef'), pad(20), fs(), fontOpt()]),
  W('polaroid', 'mockup', '폴라로이드', '우리가 웃던 날'),
  W('bizcard', 'mockup', '명함', '한지원 · 수석 헌터'),
  W('medical', 'mockup', '진단서', '병명: 급성 기억상실'),
  W('gradecard', 'mockup', '성적표', '마법학 100'),
  W('banking', 'mockup', '이체 내역', '+99,999,999'),
  W('parcel', 'mockup', '택배 송장', '내용물: 열지 마시오'),
  W('dictionary', 'mockup', '사전 항목', '회귀 [회귀/回歸]'),

  // ═══ SNS·디지털 ═══
  B('subtitle', 'sns', 'OTT 자막', '(낮은 목소리로) 아무한테도 말하지 마', [fs(105), fontOpt()]),
  W('lockscreen', 'sns', '잠금화면 알림', '23:47'),
  W('youtube', 'sns', '유튜브 화면', '폐교에서 하룻밤'),
  W('discord', 'sns', '디스코드 채팅', '# 레이드공지'),
  W('vote', 'sns', '단톡방 투표', '간다 (+12)'),
  W('musicplayer', 'sns', '뮤직 플레이어', '♪ 밤의 끝을 걷는 법'),
  W('videocall', 'sns', '영상통화', '할머니'),
  W('market', 'sns', '중고거래 채팅', '네고 되나요?'),

  // ═══ 본문 연출 ═══
  B('quotecard', 'scene', '명언 카드', '무너지는 것은 한순간이지만, 다시 쌓는 것은 평생이다', [color('accent', '장식선 색', '#a08a5f'), fs(105), fontOpt()]),
  B('monologue', 'scene', '독백 프레임', '나는 왜 그때 아무 말도 하지 못했을까', [fs(), fontOpt()]),
  B('flashback', 'scene', '회상 장면', '십 년 전, 그 여름의 일이었다', [pad(24), fs(), fontOpt()]),
  B('dreamscene', 'scene', '꿈속 장면', '여긴 어디지. 발이 땅에 닿지 않는다.', [pad(24), fs(), fontOpt()]),
  B('prologue', 'scene', '프롤로그', '이것은 멸망 이후의 이야기다', [text('label', '라벨 문구', 'PROLOGUE'), color('accent', '장식 색', '#a08a5f'), fs(105), fontOpt()]),
  B('ending', 'scene', '챕터 엔딩', '그리고 아침이 밝았다.', [color('accent', '장식 색', '#a08a5f'), fs(), fontOpt()]),
  B('poem', 'scene', '시집 레이아웃', '별 하나에 추억과\n별 하나에 사랑과', [range('lh', '행간', 2.4, 1.6, 3.5, 0.1, ''), fs(105), fontOpt()]),
  B('linefocus', 'scene', '대사 강조', '"내가 널 지킬게."', [color('accent', '막대 색', '#3a3a34'), fs(125), fontOpt()]),

  // ═══ 텍스트 ═══
  I('correction', 'text', '정정 텍스트', '실수였다', [text('fix', '고친 말', '계획이었다'), color('accent', '펜 색', '#d5462e'), fontOpt()]),
  I('circlemark', 'text', '동그라미 강조', '범인', [color('accent', '동그라미 색', '#d5462e'), range('bw', '선 굵기', 2, 1, 5, 0.5, 'px'), fontOpt()]),
  I('memoryfade', 'text', '기억 페이드', '분명 여기까지는 기억이 나는데', [color('ink', '글자색', '#444444'), fontOpt()]),
  I('halffill', 'text', '반만 칠한 글자', '절반의 진심', [color('accent', '채움 색', '#e8a33d'), color('ink', '윗부분 색', '#3a3a34'), fs(115), fontOpt()]),

  // ═══ 움직임 (애니메이션) ═══
  A('fadein', '서서히 나타나기', '어둠 속에서 떠오르는 글자', '1'),
  A('fadeup', '아래에서 떠오르기', '천천히 올라오며 나타나요', '1'),
  A('fadedown', '위에서 내려오기', '하늘에서 내려오듯', '1'),
  A('slideleft', '왼쪽에서 등장', '스윽 ―', '1'),
  A('slideright', '오른쪽에서 등장', '― 스윽', '1'),
  A('zoomin', '커지며 등장', '쿵!', '1'),
  A('zoomout', '작아지며 등장', '멀리서 다가오듯', '1'),
  A('popin', '팝 등장', '띠링!', '1'),
  A('bouncein', '통통 등장', '통, 통, 통', '1'),
  A('flipin', '뒤집히며 등장', '카드가 뒤집히듯', '1'),
  A('rotatein', '돌며 등장', '빙그르르', '1'),
  A('curtain', '커튼 열리기', '막이 오른다', '1'),
  A('inkreveal', '잉크 번짐 등장', '먹물이 번지듯', '1'),
  A('sparkle', '반짝임', '보석처럼 반짝', 'infinite', [color('accent', '반짝이 색', '#ffd94d')]),
  A('breathing', '숨쉬기', '천천히… 깊게…', 'infinite'),
  A('floating', '둥실 떠다니기', '구름 위를 걷듯', 'infinite'),
  A('halo', '후광 맥동', '성스러운 기운', 'infinite', [color('accent', '후광 색', '#f0d47e')]),
  A('ripple', '물결 파동', '파문이 번진다', 'infinite', [color('accent', '파동 색', '#5fb0ff')]),
  A('flashfx', '섬광', '번쩍!', '3', [color('accent', '섬광 색', '#fff8c4')]),
  A('bouncefx', '통통 튀기', '두근두근', 'infinite'),
  A('softblink', '은은한 깜빡임', '반딧불처럼', 'infinite'),
  A('fairydust', '요정 가루', '반짝이는 입자가 떠다녀요', 'infinite', [color('accent', '입자 색', '#ffd6f2')], 'block'),
  A('fireflies', '반딧불이', '여름밤의 불빛', 'infinite', [color('accent', '불빛 색', '#d8f07e')], 'block'),
  A('petals', '꽃잎 흩날림', '봄의 끝자락', 'infinite', [color('accent', '꽃잎 색', '#f7c1d0')], 'block'),
  A('snowfall', '눈 내림', '소리 없이 쌓이는 밤', 'infinite', [], 'block'),
  A('starrain', '별똥별', '소원을 빌 시간', 'infinite', [], 'block'),
  A('screenshake', '화면 흔들림', '지진이 난 것처럼', '3', [], 'block'),
  A('speedline', '스피드 라인', '질주!', 'infinite', [], 'block'),
  A('chargeup', '기 모으기', '힘이 모여든다…!', 'infinite', [color('accent', '기운 색', '#4da3ff')]),
  A('ghostfade', '유령 아른거림', '있는 듯 없는 듯', 'infinite'),
  A('shadowcrawl', '그림자 스멀거림', '어둠이 기어온다', 'infinite', [], 'block'),
  A('distortion', '왜곡', '현실이 일그러진다', 'infinite'),
  A('typingfx', '타이핑', '지금 입력 중입니다…', '1'),
  A('matrixrain', '매트릭스 레인', '01001000 01101001', 'infinite', [color('accent', '코드 색', '#37e05d')], 'block'),
  A('scanlinefx', '스캔라인', '스캔 중…', 'infinite', [color('accent', '스캔 색', '#41e8ff')], 'block'),
  A('datastream', '데이터 스트림', '전송 중 ▸▸▸', 'infinite', [color('accent', '흐름 색', '#5fb0ff')], 'block'),
];

export const EXTRA_CSS = `
/* ═══ 로판·판타지 (2차) ═══ */
.es-stainedglass { display:block; margin:1.2em 0; padding:var(--es-pad,20px); color:#fff; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); text-shadow:0 1px 3px rgba(0,0,0,.6); border:6px solid #3d3630; border-radius:14px 14px 4px 4px; background:linear-gradient(135deg, rgba(196,74,74,.85) 0 25%, rgba(74,196,129,.85) 0 45%, rgba(74,111,196,.85) 0 70%, rgba(196,164,74,.85) 0 100%), #222; box-shadow: inset 0 0 0 2px rgba(255,255,255,.25), inset 0 0 30px rgba(0,0,0,.4); }
.es-ribbon { display:block; width:max-content; max-width:86%; margin:1.4em auto; padding:.55em 1.6em; background:var(--es-accent,#a4485c); color:#fff; font-weight:800; font-size:var(--es-fs,110%); font-family:var(--es-font,inherit); position:relative; text-align:center; box-shadow:0 3px 8px rgba(0,0,0,.25); }
.es-ribbon::before, .es-ribbon::after { content:""; position:absolute; top:6px; border:.85em solid color-mix(in srgb, var(--es-accent,#a4485c) 75%, #000); z-index:-1; }
.es-ribbon::before { left:-1.2em; border-left-color:transparent; }
.es-ribbon::after { right:-1.2em; border-right-color:transparent; }
.es-gemframe { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:var(--es-bg,#fdfbff); color:inherit; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border:2px solid var(--es-accent,#7e4fd4); border-radius:10px; position:relative; box-shadow:0 0 12px color-mix(in srgb, var(--es-accent,#7e4fd4) 30%, transparent); }
.es-gemframe::before { content:"◆"; position:absolute; top:-.7em; left:50%; transform:translateX(-50%); color:var(--es-accent,#7e4fd4); background:var(--es-bg,#fdfbff); padding:0 .4em; }
.es-gemframe::after { content:"◆   ◆"; position:absolute; bottom:-.7em; left:50%; transform:translateX(-50%); color:var(--es-accent,#7e4fd4); background:var(--es-bg,#fdfbff); padding:0 .4em; letter-spacing:.5em; }
.es-prayer { display:block; margin:1.4em auto; max-width:28em; text-align:center; font-size:var(--es-fs,105%); font-family:var(--es-font, Georgia, "Nanum Myeongjo", serif); font-style:italic; line-height:2; color:inherit; padding:1em 0; border-top:1px solid var(--es-accent,#b3924e); border-bottom:1px solid var(--es-accent,#b3924e); }
.es-prayer::before { content:"✝"; display:block; color:var(--es-accent,#b3924e); font-style:normal; margin-bottom:.5em; }
.es-holylight { display:block; margin:1.2em 0; padding:var(--es-pad,22px); text-align:center; color:#6b5417; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); background:radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--es-accent,#f0d47e) 65%, #fff) 0%, #fffdf2 70%); border-radius:10px; box-shadow:0 0 26px color-mix(in srgb, var(--es-accent,#f0d47e) 60%, transparent); text-shadow:0 0 8px #fff; }
.es-aurora { display:block; margin:1.2em 0; padding:var(--es-pad,20px); color:#eafcf6; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); background:linear-gradient(115deg, #0d1b2e 0%, #14504a 30%, #3b2b66 60%, #0d1b2e 100%); background-size:250% 250%; border-radius:10px; text-shadow:0 0 8px rgba(140,255,220,.5); }
.es-aurora.es-on { animation: es-aurora-flow calc(var(--es-dur,2s)*3) ease-in-out infinite; }
@keyframes es-aurora-flow { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }
.es-starlight { display:block; margin:1.2em 0; padding:var(--es-pad,20px); color:#e8ecff; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-radius:10px; background-color:var(--es-bg,#151b33); background-image:radial-gradient(circle, #fff 1px, transparent 1.8px), radial-gradient(circle, #ffffff90 .8px, transparent 1.5px), radial-gradient(circle, #ffe9a850 1.2px, transparent 2px); background-size:110px 110px, 70px 70px, 160px 160px; background-position:10px 20px, 40px 60px, 80px 10px; }
.es-magiccircle { display:block; margin:1.2em 0; padding:var(--es-pad,26px); text-align:center; color:#e7dcff; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); background:radial-gradient(circle at 50% 50%, transparent 52%, color-mix(in srgb, var(--es-accent,#9d6bff) 50%, transparent) 53% 54%, transparent 55%, transparent 60%, color-mix(in srgb, var(--es-accent,#9d6bff) 35%, transparent) 61% 61.7%, transparent 63%), #140b26; border-radius:12px; border:1px solid color-mix(in srgb, var(--es-accent,#9d6bff) 50%, transparent); position:relative; }
.es-magiccircle::before { content:"✦"; position:absolute; top:8px; left:12px; color:var(--es-accent,#9d6bff); opacity:.7; }
.es-magiccircle::after { content:"✦"; position:absolute; bottom:8px; right:12px; color:var(--es-accent,#9d6bff); opacity:.7; }
.es-magiccircle.es-on { animation: es-mc-pulse calc(var(--es-dur,2s)*1.5) ease-in-out infinite; }
@keyframes es-mc-pulse { 0%,100%{ box-shadow:0 0 8px color-mix(in srgb, var(--es-accent,#9d6bff) 40%, transparent);} 50%{ box-shadow:0 0 24px color-mix(in srgb, var(--es-accent,#9d6bff) 75%, transparent);} }
.es-runeframe { display:block; margin:1.2em 0; padding:var(--es-pad,18px); background:var(--es-bg,#f2efe6); color:#3d3a2c; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border:2px solid var(--es-accent,#3f7d6c); position:relative; }
.es-runeframe::before { content:"ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ"; position:absolute; top:-0.75em; left:50%; transform:translateX(-50%); background:var(--es-bg,#f2efe6); color:var(--es-accent,#3f7d6c); padding:0 .6em; font-size:.8em; letter-spacing:.4em; }
.es-spirit { display:block; margin:1.2em 0; padding:var(--es-pad,18px); color:#2c4a30; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); background:radial-gradient(circle at 12% 20%, color-mix(in srgb, var(--es-accent,#4d9e5f) 30%, transparent) 0 3px, transparent 4px), radial-gradient(circle at 85% 30%, color-mix(in srgb, var(--es-accent,#4d9e5f) 35%, transparent) 0 2px, transparent 3px), radial-gradient(circle at 60% 80%, color-mix(in srgb, var(--es-accent,#4d9e5f) 28%, transparent) 0 2.5px, transparent 3.5px), linear-gradient(160deg, #f0f9ee, #dcefdb); border-radius:14px; border:1px solid color-mix(in srgb, var(--es-accent,#4d9e5f) 40%, transparent); }
.es-crystal { display:block; margin:1.2em 0; padding:var(--es-pad,18px); color:#1e4a5f; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); background:linear-gradient(135deg, rgba(255,255,255,.85), color-mix(in srgb, var(--es-accent,#7ec5e8) 30%, #fff)); border:1px solid var(--es-accent,#7ec5e8); border-radius:4px 18px 4px 18px; box-shadow:0 4px 14px color-mix(in srgb, var(--es-accent,#7ec5e8) 45%, transparent), inset 0 0 18px rgba(255,255,255,.7); }
.es-oracle { display:block; margin:1.2em 0; padding:var(--es-pad,24px); text-align:center; color:#5c4c1e; font-size:var(--es-fs,105%); font-family:var(--es-font, Georgia, serif); background:repeating-conic-gradient(from -6deg at 50% -20%, transparent 0 6deg, color-mix(in srgb, var(--es-accent,#e8d9a0) 30%, transparent) 6deg 8deg), #fffcf0; letter-spacing:.06em; }
.es-dragonbreath { display:block; margin:1.2em 0; padding:var(--es-pad,20px); color:#ffe4c4; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); background:linear-gradient(160deg, #2b0f08, #571c10); border:1px solid var(--es-accent2,#e8b04a); border-radius:8px; box-shadow:0 0 18px color-mix(in srgb, var(--es-accent,#d43f2a) 55%, transparent), inset 0 -12px 24px color-mix(in srgb, var(--es-accent,#d43f2a) 40%, transparent); text-shadow:0 0 8px color-mix(in srgb, var(--es-accent,#d43f2a) 70%, transparent); }
.es-crownframe { display:block; margin:1.6em 0 1.2em; padding:var(--es-pad,20px); background:var(--es-bg,#fffdf4); color:#54452c; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border:2px solid var(--es-accent,#b8912f); border-radius:8px; position:relative; text-align:center; }
.es-crownframe::before { content:"♛"; position:absolute; top:-.95em; left:50%; transform:translateX(-50%); color:var(--es-accent,#b8912f); background:var(--es-bg,#fffdf4); padding:0 .45em; font-size:1.15em; }
.es-velvet { display:block; margin:1.2em 0; padding:var(--es-pad,22px); color:#f2dfae; font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); background:radial-gradient(ellipse at 30% 20%, color-mix(in srgb, var(--es-bg,#4e1526) 70%, #fff) 0%, var(--es-bg,#4e1526) 55%); border:1px solid var(--es-accent,#caa64c); outline:1px solid var(--es-accent,#caa64c); outline-offset:3px; }
.es-marble { display:block; margin:1.2em 0; padding:var(--es-pad,22px); color:#3c3f45; font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); background:linear-gradient(120deg, #f4f4f2 0 40%, #e6e7ea 41% 43%, #f4f4f2 44% 70%, #e9eaec 71% 72%, #f7f7f5 73%); border:1px solid #cdd0d6; box-shadow:inset 0 0 24px rgba(120,126,140,.18); }

/* ═══ 종이·문서 ═══ */
.es-prophecy { display:block; margin:1.2em 0; padding:var(--es-pad,24px); color:#4c3a5c; font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, "Nanum Myeongjo", serif); background:radial-gradient(circle at 50% 50%, transparent 40%, color-mix(in srgb, var(--es-accent,#8c6bb8) 14%, transparent) 41% 42%, transparent 43%), radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--es-accent,#8c6bb8) 10%, transparent) 0 12%, transparent 13%), #f3ecdd; border:1px solid #cbbfa4; font-style:italic; text-align:center; letter-spacing:.04em; }
.es-parchment { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:linear-gradient(150deg, color-mix(in srgb, var(--es-bg,#ead9b0) 88%, #806030), var(--es-bg,#ead9b0) 40%, color-mix(in srgb, var(--es-bg,#ead9b0) 90%, #806030)); color:var(--es-ink,#503f22); font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); border:2px solid #a68d5c; border-radius:3px; box-shadow:inset 0 0 26px rgba(120,90,40,.25); }
.es-oldletter { display:block; margin:1.2em 0; padding:var(--es-pad,24px); background:linear-gradient(180deg, var(--es-bg,#f6efdc) 0 33%, color-mix(in srgb, var(--es-bg,#f6efdc) 92%, #555) 33.4%, var(--es-bg,#f6efdc) 33.8% 66%, color-mix(in srgb, var(--es-bg,#f6efdc) 92%, #555) 66.4%, var(--es-bg,#f6efdc) 66.8%); color:var(--es-ink,#42506b); font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); border:1px solid #d8cfb6; box-shadow:0 2px 8px rgba(90,80,50,.2); text-shadow:.3px .3px .6px color-mix(in srgb, var(--es-ink,#42506b) 30%, transparent); }
.es-waxseal { display:block; margin:1.2em 0; padding:var(--es-pad,22px) var(--es-pad,22px) calc(var(--es-pad,22px) + 1.6em); background:#f9f3e4; color:#4c4433; font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); border:1px solid #ddd2b8; position:relative; }
.es-waxseal::after { content:var(--es-seal,"S"); position:absolute; right:16px; bottom:10px; width:2.1em; height:2.1em; line-height:2.1em; text-align:center; border-radius:50%; background:radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--es-accent,#a02c2c) 60%, #fff) 0 12%, var(--es-accent,#a02c2c) 45%); color:#fff0e0; font-weight:800; box-shadow:0 2px 5px rgba(0,0,0,.35); transform:rotate(-8deg); }
.es-labnote { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:linear-gradient(0deg, transparent calc(1.5em - 1px), color-mix(in srgb, var(--es-accent,#b9cfe0) 55%, transparent) 1.5em), linear-gradient(90deg, transparent calc(1.5em - 1px), color-mix(in srgb, var(--es-accent,#b9cfe0) 55%, transparent) 1.5em), #fdfefe; background-size:1.5em 1.5em; color:#334; font-size:var(--es-fs,95%); font-family:var(--es-font,"Nanum Pen Script", cursive, sans-serif); border:1px solid #c8d8e4; }
.es-magazine { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:#fff; color:#222; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-top:6px solid var(--es-accent,#d5462e); box-shadow:0 3px 12px rgba(0,0,0,.14); font-weight:600; line-height:1.7; }
.es-magazine::before { content:"INTERVIEW"; display:block; color:var(--es-accent,#d5462e); font-size:.68em; letter-spacing:.34em; margin-bottom:.7em; font-weight:800; }
.es-classified { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:#efe8d6; color:#3c382c; font-size:var(--es-fs,95%); font-family:"Courier New", Courier, monospace; border:1px solid #b8ac8c; position:relative; overflow:hidden; }
.es-classified::before { content:var(--es-stamp,"SECRET"); position:absolute; top:14px; right:-30px; transform:rotate(24deg); border:3px solid var(--es-accent,#c22a1e); color:var(--es-accent,#c22a1e); font-weight:900; letter-spacing:.28em; padding:.1em 2em; opacity:.55; }
.es-casefile { display:block; margin:2em 0 1.2em; padding:var(--es-pad,20px); background:#e8dcc0; color:#3f3826; font-size:var(--es-fs,95%); font-family:"Courier New", Courier, monospace; border:1px solid #b8a878; border-radius:0 8px 8px 8px; position:relative; box-shadow:2px 3px 0 #cbbc94; }
.es-casefile::before { content:var(--es-label,"CASE FILE"); position:absolute; top:-1.5em; left:-1px; background:#e8dcc0; border:1px solid #b8a878; border-bottom:0; padding:.15em .9em; font-size:.72em; letter-spacing:.18em; border-radius:6px 6px 0 0; }

/* ═══ 액션 ═══ */
.es-awaken { display:block; margin:1.2em 0; padding:var(--es-pad,20px); text-align:center; color:#dceeff; font-weight:800; font-size:var(--es-fs,105%); font-family:var(--es-font,inherit); background:radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--es-accent,#4da3ff) 40%, transparent), transparent 65%), #0a1220; border:1px solid var(--es-accent,#4da3ff); border-radius:8px; box-shadow:0 0 22px color-mix(in srgb, var(--es-accent,#4da3ff) 55%, transparent); text-shadow:0 0 12px var(--es-accent,#4da3ff); position:relative; }
.es-awaken::before { content:"⚡"; position:absolute; top:6px; left:10px; color:var(--es-accent,#4da3ff); }
.es-ultimate { display:block; margin:1.2em 0; padding:var(--es-pad,20px); text-align:center; color:#fff; font-weight:900; font-size:var(--es-fs,110%); font-family:var(--es-font,inherit); letter-spacing:.1em; background:radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--es-accent,#ff3b1f) 65%, #200) 0%, #1c0500 70%); border-radius:10px; box-shadow:0 0 30px color-mix(in srgb, var(--es-accent,#ff3b1f) 65%, transparent), inset 0 0 20px color-mix(in srgb, var(--es-accent,#ff3b1f) 40%, transparent); text-shadow:0 0 14px var(--es-accent,#ff3b1f); }
.es-slashmark { position:relative; font-size:var(--es-fs,110%); font-weight:700; font-family:var(--es-font,inherit); background:linear-gradient(115deg, transparent 46%, var(--es-accent,#c9d6e2) 47% 49%, #fff 49.5% 50.5%, var(--es-accent,#c9d6e2) 51% 53%, transparent 54%); padding:0 .1em; }
.es-shockwave { display:block; margin:1.2em 0; padding:var(--es-pad,22px); text-align:center; color:#4c3a1c; font-weight:800; font-size:var(--es-fs,105%); font-family:var(--es-font,inherit); background:repeating-radial-gradient(circle at 50% 50%, transparent 0 14px, color-mix(in srgb, var(--es-accent,#e8a33d) 22%, transparent) 14px 16px), #fdf6e8; border-radius:12px; }
.es-flamebox { display:block; margin:1.2em 0; padding:var(--es-pad,20px); color:#ffe0c4; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); background:linear-gradient(0deg, color-mix(in srgb, var(--es-accent,#ff6b2a) 45%, #200) 0%, #241008 60%); border-radius:8px 8px 3px 3px; border-bottom:4px solid var(--es-accent,#ff6b2a); box-shadow:0 6px 18px color-mix(in srgb, var(--es-accent,#ff6b2a) 45%, transparent); }
.es-icebox { display:block; margin:1.2em 0; padding:var(--es-pad,20px); color:#1c4458; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); background:linear-gradient(180deg, #f2fbff, color-mix(in srgb, var(--es-accent,#8ed4f0) 35%, #fff)); border:1px solid var(--es-accent,#8ed4f0); border-radius:3px 16px 3px 16px; box-shadow:inset 0 0 18px rgba(255,255,255,.8), 0 3px 10px color-mix(in srgb, var(--es-accent,#8ed4f0) 45%, transparent); text-shadow:0 1px 0 #fff; }
.es-boltmark { display:inline-block; transform:skewX(-8deg); color:var(--es-accent,#ffd94d); font-weight:900; font-size:var(--es-fs,115%); font-family:var(--es-font,inherit); text-shadow:0 0 6px var(--es-accent,#ffd94d), 0 0 18px color-mix(in srgb, var(--es-accent,#ffd94d) 60%, transparent), 1px 1px 0 #3a2c00; }
.es-manaburst { display:block; margin:1.2em 0; padding:var(--es-pad,20px); color:#f0dcff; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); background:radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--es-accent,#b44dff) 45%, #150822), #150822 75%); border-radius:10px; box-shadow:0 0 26px color-mix(in srgb, var(--es-accent,#b44dff) 60%, transparent); text-shadow:0 0 10px var(--es-accent,#b44dff); }
.es-barrier { display:block; margin:1.2em 0; padding:var(--es-pad,20px); color:inherit; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border:2px solid color-mix(in srgb, var(--es-accent,#5fd4c8) 70%, transparent); outline:1px solid color-mix(in srgb, var(--es-accent,#5fd4c8) 35%, transparent); outline-offset:5px; border-radius:14px; background:color-mix(in srgb, var(--es-accent,#5fd4c8) 8%, transparent); box-shadow:inset 0 0 20px color-mix(in srgb, var(--es-accent,#5fd4c8) 20%, transparent); }

/* ═══ 게임·SF (2차) ═══ */
.es-hud { display:block; margin:1.2em 0; padding:var(--es-pad,16px); color:var(--es-accent,#39d98a); font-size:var(--es-fs,92%); font-family:"SF Mono", Consolas, monospace; background:rgba(4,16,10,.92); border:1px solid color-mix(in srgb, var(--es-accent,#39d98a) 60%, transparent); position:relative; }
.es-hud::before, .es-hud::after { content:""; position:absolute; width:14px; height:14px; border:2px solid var(--es-accent,#39d98a); }
.es-hud::before { top:-2px; left:-2px; border-right:0; border-bottom:0; }
.es-hud::after { bottom:-2px; right:-2px; border-left:0; border-top:0; }
.es-aipanel { display:block; margin:1.2em 0; color:#dcecff; font-size:var(--es-fs,92%); font-family:var(--es-font,inherit); background:#0c1626f0; border:1px solid var(--es-accent,#5fb0ff); border-radius:8px; overflow:hidden; padding:var(--es-pad,16px); }
.es-aipanel::before { content:"◈ " var(--es-title,"AI ANALYSIS"); display:block; margin:calc(var(--es-pad,16px)*-1) calc(var(--es-pad,16px)*-1) var(--es-pad,16px); padding:.4em .9em; font-size:.75em; letter-spacing:.2em; color:var(--es-accent,#5fb0ff); background:color-mix(in srgb, var(--es-accent,#5fb0ff) 14%, transparent); border-bottom:1px solid color-mix(in srgb, var(--es-accent,#5fb0ff) 40%, transparent); }
.es-errorwin { display:block; margin:1.2em auto; max-width:26em; background:#f2f2f2; color:#222; font-size:var(--es-fs,95%); font-family:var(--es-font,inherit); border:1px solid #999; border-radius:8px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,.3); padding:0 0 14px; }
.es-errorwin::before { content:"⚠ " var(--es-title,"오류") "                                   ✕"; display:block; white-space:pre; background:var(--es-accent,#c0392b); color:#fff; padding:.4em .8em; font-size:.85em; font-weight:700; margin-bottom:12px; }
.es-errorwin { padding-left:16px; padding-right:16px; }
.es-radar { display:block; margin:1.2em 0; padding:var(--es-pad,20px); color:var(--es-accent,#3fe07c); font-size:var(--es-fs,92%); font-family:"SF Mono", Consolas, monospace; background:radial-gradient(circle at 50% 50%, transparent 0 24%, color-mix(in srgb, var(--es-accent,#3fe07c) 25%, transparent) 25% 25.7%, transparent 27% 49%, color-mix(in srgb, var(--es-accent,#3fe07c) 18%, transparent) 50% 50.7%, transparent 52%), #04130a; border-radius:10px; border:1px solid color-mix(in srgb, var(--es-accent,#3fe07c) 45%, transparent); }
.es-radar.es-on { animation: es-radar-pulse calc(var(--es-dur,2s)) linear infinite; }
@keyframes es-radar-pulse { 0%,100%{ box-shadow:inset 0 0 12px color-mix(in srgb, var(--es-accent,#3fe07c) 20%, transparent);} 50%{ box-shadow:inset 0 0 34px color-mix(in srgb, var(--es-accent,#3fe07c) 45%, transparent);} }
.es-cyber { display:block; margin:1.2em 0; padding:var(--es-pad,20px); color:#e8f8ff; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); background:linear-gradient(120deg, #0a0c1a 0 60%, color-mix(in srgb, var(--es-accent2,#ff2ea6) 22%, #0a0c1a)); border-left:4px solid var(--es-accent,#00e5ff); border-right:4px solid var(--es-accent2,#ff2ea6); box-shadow:0 0 16px color-mix(in srgb, var(--es-accent,#00e5ff) 40%, transparent); text-shadow:0 0 6px color-mix(in srgb, var(--es-accent,#00e5ff) 60%, transparent); }
.es-itemget { display:block; margin:1.2em 0; padding:var(--es-pad,14px) 16px; color:#f4ead0; font-size:var(--es-fs,95%); font-family:var(--es-font,inherit); background:#171310f0; border:2px solid var(--es-grade,#ff9c2e); border-radius:10px; box-shadow:0 0 14px color-mix(in srgb, var(--es-grade,#ff9c2e) 55%, transparent); }
.es-itemget::before { content:"✦ 획득"; display:inline-block; color:var(--es-grade,#ff9c2e); font-size:.75em; letter-spacing:.2em; margin-right:.8em; font-weight:800; vertical-align:middle; }
.es-bsod { display:block; margin:1.2em 0; padding:26px 22px; background:#0d59c9; color:#fff; font-size:var(--es-fs,95%); font-family:"Segoe UI", "Malgun Gothic", sans-serif; }
.es-bsod::before { content:":("; display:block; font-size:3.2em; margin-bottom:.3em; font-weight:300; }
.es-bsod::after { content:"오류 코드: FATE_NOT_FOUND"; display:block; margin-top:1em; font-size:.72em; opacity:.8; font-family:Consolas, monospace; }
.es-ledboard { display:block; margin:1.2em 0; padding:var(--es-pad,16px); text-align:center; background:#0c0c0e; color:var(--es-accent,#ff4d2e); font-size:var(--es-fs,105%); font-weight:800; letter-spacing:.3em; font-family:"SF Mono", Consolas, monospace; border-radius:6px; border:6px solid #232326; text-shadow:0 0 6px var(--es-accent,#ff4d2e); background-image:radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1.5px); background-size:5px 5px; }
.es-codeblock { display:block; margin:1.2em 0; padding:var(--es-pad,16px); background:#1e222a; color:#c8d2e0; font-size:var(--es-fs,88%); font-family:"SF Mono", Consolas, monospace; border-radius:8px; border-left:4px solid var(--es-accent,#66d9ef); white-space:pre-wrap; }
.es-codeblock::before { content:"$ "; color:var(--es-accent,#66d9ef); font-weight:700; }
.es-countdown { display:block; margin:1.2em auto; width:max-content; max-width:90%; padding:.3em .7em; background:#0c0c0e; color:var(--es-accent,#ff3b30); font-size:var(--es-fs,160%); font-weight:800; font-family:"SF Mono", Consolas, monospace; letter-spacing:.14em; border-radius:8px; border:1px solid #2c2c30; text-shadow:0 0 10px color-mix(in srgb, var(--es-accent,#ff3b30) 70%, transparent); font-variant-numeric:tabular-nums; }

/* ═══ 공포 (2차) ═══ */
.es-nightmare { display:block; margin:1.2em 0; padding:var(--es-pad,22px); color:#cfc4d8; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); background:#171220; border-radius:40% 4% 38% 6% / 6% 42% 5% 40%; box-shadow:inset 0 0 34px #000, 0 0 18px rgba(60,30,80,.5); filter:blur(.2px); }
.es-abyss { display:block; margin:1.2em 0; padding:var(--es-pad,24px); color:#8f95a3; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); background:radial-gradient(ellipse at 50% 130%, #000 30%, transparent 75%), linear-gradient(0deg, #000 0%, #121722 100%); border-radius:8px; box-shadow:inset 0 -26px 40px #000; }
.es-bloodstain { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:radial-gradient(ellipse at 82% 18%, color-mix(in srgb, var(--es-accent,#8f1d14) 45%, transparent) 0 9%, transparent 16%), radial-gradient(ellipse at 20% 85%, color-mix(in srgb, var(--es-accent,#8f1d14) 35%, transparent) 0 6%, transparent 12%), radial-gradient(circle at 65% 70%, color-mix(in srgb, var(--es-accent,#8f1d14) 28%, transparent) 0 2%, transparent 5%), var(--es-bg,#f1e9da); color:#463c2c; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border:1px solid #d0c4ac; }
.es-asylum { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:linear-gradient(180deg, #b8bcb8 0 55%, #8f948f 55.3%), repeating-linear-gradient(90deg, transparent 0 30px, rgba(0,0,0,.05) 30px 31px); color:#31352f; font-size:var(--es-fs,95%); font-family:var(--es-font,inherit); box-shadow:inset 0 0 40px rgba(30,35,30,.35); }
.es-brokenmirror { display:block; margin:1.2em 0; padding:var(--es-pad,22px); color:#3a4048; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); background:linear-gradient(160deg, #e9edf2 0 48%, #d4dae2 48.5% 49%, #eef1f5 49.5% 72%, #d4dae2 72.4% 72.8%, #e6eaef 73.2%), linear-gradient(20deg, transparent 0 64%, #cbd2db 64.3% 64.7%, transparent 65%); border:6px solid #6d747e; box-shadow:inset 0 0 20px rgba(255,255,255,.6); }
.es-cctv { display:block; margin:1.2em 0; padding:var(--es-pad,18px); background:repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 1px, transparent 1px 3px), #1d1f1d; color:#cfd4cf; font-size:var(--es-fs,92%); font-family:"SF Mono", Consolas, monospace; filter:grayscale(1) contrast(1.1); border-radius:4px; position:relative; padding-top:2.2em; }
.es-cctv::before { content:"● REC   " var(--es-label,"CAM 04"); position:absolute; top:.6em; left:.9em; font-size:.75em; color:#e05050; letter-spacing:.12em; }
.es-cctv.es-on::before { animation: es-blink calc(var(--es-dur,2s)/2) steps(1) infinite; }
.es-fluorescent { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:linear-gradient(180deg, color-mix(in srgb, var(--es-accent,#c8e6c9) 30%, #1c211c), #161a16 60%); color:color-mix(in srgb, var(--es-accent,#c8e6c9) 85%, #fff); font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-radius:6px; text-shadow:0 0 6px color-mix(in srgb, var(--es-accent,#c8e6c9) 60%, transparent); }
.es-fluorescent.es-on { animation: es-flicker-k calc(var(--es-dur,2s)*1.6) steps(1) infinite; }
.es-curse { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--es-accent,#5c1a1a) 55%, transparent) 0 6%, transparent 14%), radial-gradient(circle at 78% 72%, color-mix(in srgb, var(--es-accent,#5c1a1a) 45%, transparent) 0 8%, transparent 16%), #0f0a0a; color:#c8b4b4; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border:1px solid color-mix(in srgb, var(--es-accent,#5c1a1a) 70%, #000); text-align:center; }
.es-curse::before { content:"卍 呪 卍"; display:block; color:color-mix(in srgb, var(--es-accent,#5c1a1a) 60%, #f00); letter-spacing:.7em; margin-bottom:.6em; font-size:.8em; opacity:.8; }
.es-scratch { position:relative; font-size:var(--es-fs,105%); font-family:var(--es-font,inherit); background:linear-gradient(105deg, transparent 20%, color-mix(in srgb, var(--es-accent,#7a7a7a) 60%, transparent) 20.5% 21%, transparent 21.5% 48%, color-mix(in srgb, var(--es-accent,#7a7a7a) 55%, transparent) 48.5% 49%, transparent 49.5% 76%, color-mix(in srgb, var(--es-accent,#7a7a7a) 60%, transparent) 76.5% 77%, transparent 77.5%); }
.es-mirror { display:inline-block; transform:scaleX(-1); font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); }
.es-whisper { font-size:.82em; opacity:.62; letter-spacing:var(--es-ls,4px); font-style:italic; font-family:var(--es-font,inherit); filter:blur(.3px); }
.es-mold { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:radial-gradient(circle at 12% 20%, rgba(64,92,58,.5) 0 5%, transparent 11%), radial-gradient(circle at 88% 76%, rgba(52,74,48,.55) 0 8%, transparent 15%), radial-gradient(circle at 55% 95%, rgba(60,84,54,.4) 0 6%, transparent 12%), radial-gradient(circle at 70% 15%, rgba(80,100,70,.3) 0 3%, transparent 7%), #d9d4c4; color:#3e4234; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border:1px solid #a8a48e; }
.es-dday { position:relative; display:inline-block; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); }
.es-dday::after { content:var(--es-day,"D-3"); position:absolute; right:-.6em; top:-1em; transform:rotate(10deg); border:2.5px solid var(--es-accent,#c22a1e); color:var(--es-accent,#c22a1e); font-weight:900; padding:.02em .3em; border-radius:6px; font-size:.85em; opacity:.85; background:rgba(255,255,255,.6); }

/* ═══ 감성 ═══ */
.es-sakura { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:radial-gradient(circle at 12% 18%, #f7c1d0 0 4px, transparent 5px), radial-gradient(circle at 78% 30%, #f9cfdb 0 3px, transparent 4px), radial-gradient(circle at 30% 82%, #f4b5c8 0 3.5px, transparent 4.5px), radial-gradient(circle at 90% 78%, #f7c1d0 0 2.5px, transparent 3.5px), linear-gradient(160deg, #fff5f8, #fde8ef); color:#7a4456; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-radius:14px; border:1px solid #f2cdd9; }
.es-rosegarden { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:#fdf6f7; color:#5c3038; font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); border:2px solid color-mix(in srgb, var(--es-accent,#c94f6d) 50%, #fff); border-radius:12px; position:relative; text-align:center; }
.es-rosegarden::before { content:"❀ ❀ ❀"; display:block; color:var(--es-accent,#c94f6d); letter-spacing:.8em; margin-bottom:.5em; font-size:.85em; }
.es-sunset { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:linear-gradient(180deg, #f9b16e 0%, #e8746a 45%, #9d5c8f 100%); color:#fff8f0; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-radius:10px; text-shadow:0 1px 4px rgba(120,40,40,.4); }
.es-dawn { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:linear-gradient(180deg, #1e2c4a 0%, #40567e 55%, #90a4c0 100%); color:#e8eefb; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-radius:10px; text-shadow:0 0 8px rgba(180,200,255,.35); }
.es-mist { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:linear-gradient(180deg, #eef1f2 0%, #d7dee0cc 100%); color:#5c6a70; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-radius:12px; box-shadow:inset 0 0 30px rgba(255,255,255,.9); text-shadow:0 0 2px rgba(255,255,255,.8); }
.es-frost { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:linear-gradient(135deg, #eaf4fb, #d8e9f5); color:#3c586c; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border:1px solid #c2dcee; border-radius:10px; box-shadow:inset 0 0 0 4px rgba(255,255,255,.65), inset 0 0 24px rgba(255,255,255,.9); }
.es-frost::before { content:"❄"; float:right; color:#9cc4de; }
.es-glassjar { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:linear-gradient(120deg, rgba(255,255,255,.6), color-mix(in srgb, var(--es-accent,#a8cfd8) 22%, transparent)); color:#3e5c64; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border:2px solid color-mix(in srgb, var(--es-accent,#a8cfd8) 70%, #fff); border-radius:18px; box-shadow:inset 4px 0 8px rgba(255,255,255,.8), 0 4px 10px color-mix(in srgb, var(--es-accent,#a8cfd8) 40%, transparent); }
.es-watercolor { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:radial-gradient(ellipse at 15% 25%, color-mix(in srgb, var(--es-accent,#7fb8d8) 32%, transparent) 0 32%, transparent 60%), radial-gradient(ellipse at 85% 70%, color-mix(in srgb, var(--es-accent2,#e8a0b8) 32%, transparent) 0 34%, transparent 62%), #fefdfb; color:#4c4a52; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-radius:8px; }
.es-pressedflower { display:block; margin:1.2em 0; padding:var(--es-pad,24px); background:var(--es-bg,#fbf7ec); color:#5c523c; font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); border:1px double #d8ccae; position:relative; }
.es-pressedflower::after { content:"✿"; position:absolute; top:10px; right:14px; color:#c9a0ae; opacity:.75; }

/* ═══ 학교·칠판 ═══ */
.es-chalkboard { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:radial-gradient(ellipse at 30% 40%, rgba(255,255,255,.06), transparent 60%), var(--es-bg,#2e5641); color:#f2f0e4; font-size:var(--es-fs,100%); font-family:var(--es-font,"Nanum Pen Script", cursive, sans-serif); border:8px solid #8a6a44; border-radius:4px; text-shadow:0 0 1px #fff; box-shadow:inset 0 0 30px rgba(0,0,0,.35); }
.es-blackboard { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:radial-gradient(ellipse at 70% 30%, rgba(255,255,255,.05), transparent 55%), #1e2422; color:#f4f2e8; font-size:var(--es-fs,100%); font-family:var(--es-font,"Nanum Pen Script", cursive, sans-serif); border:8px solid #6d5232; border-radius:4px; text-shadow:0 0 1px #fff; box-shadow:inset 0 0 30px rgba(0,0,0,.45); }
.es-chalktext { color:var(--es-ink,#f2f0e4); font-size:var(--es-fs,105%); font-family:var(--es-font,"Nanum Pen Script", cursive, sans-serif); text-shadow:0 0 1px currentColor, .5px .5px 0 rgba(255,255,255,.3); letter-spacing:.03em; }
.es-noticepin { display:block; margin:1.6em auto 1.2em; max-width:30em; padding:var(--es-pad,20px); background:var(--es-bg,#fffef2); color:#3c3a30; font-size:var(--es-fs,95%); font-family:var(--es-font,inherit); border:1px solid #e0dcc4; box-shadow:0 3px 8px rgba(60,50,20,.18); position:relative; transform:rotate(-.6deg); }
.es-noticepin::before { content:""; position:absolute; top:-8px; left:50%; transform:translateX(-50%); width:14px; height:14px; border-radius:50%; background:radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--es-accent,#d5462e) 55%, #fff), var(--es-accent,#d5462e) 60%); box-shadow:0 2px 3px rgba(0,0,0,.3); }
.es-whiteboard { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:#fdfdfd; color:var(--es-accent,#2456c4); font-size:var(--es-fs,100%); font-family:var(--es-font,"Nanum Pen Script", cursive, sans-serif); border:6px solid #c8ccd2; border-radius:6px; box-shadow:inset 0 0 20px rgba(160,170,180,.15); }
.es-timetable { display:block; margin:1.2em 0; padding:var(--es-pad,16px); background:linear-gradient(0deg, transparent calc(2em - 1px), color-mix(in srgb, var(--es-accent,#9db8d0) 60%, transparent) 2em), linear-gradient(90deg, transparent calc(6em - 1px), color-mix(in srgb, var(--es-accent,#9db8d0) 60%, transparent) 6em), #fdfefe; background-size:100% 2em, 6em 100%; color:#354; font-size:var(--es-fs,92%); font-family:var(--es-font,inherit); border:2px solid color-mix(in srgb, var(--es-accent,#9db8d0) 80%, #446); line-height:2em; }
.es-examsheet { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:#fff; color:#222; font-size:var(--es-fs,92%); font-family:"Nanum Myeongjo", Batang, serif; border:1px solid #999; }
.es-examsheet::before { content:var(--es-title,"2026학년도 1학기 중간고사"); display:block; text-align:center; font-weight:800; border:2px solid #222; padding:.4em; margin-bottom:1em; letter-spacing:.1em; }
.es-wrongnote { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:repeating-linear-gradient(180deg, #fffef8 0 1.8em, #e8e2d0 1.8em calc(1.8em + 1px)); color:#3c3a30; font-size:var(--es-fs,95%); font-family:var(--es-font,inherit); border:1px solid #ddd6c0; border-left:4px solid var(--es-accent,#d5462e); text-decoration:underline; text-decoration-style:wavy; text-decoration-color:var(--es-accent,#d5462e); text-decoration-thickness:1.5px; text-underline-offset:4px; }

/* ═══ 실물 (2차) ═══ */
.es-tornnote { display:block; margin:1.2em auto; max-width:22em; padding:var(--es-pad,20px) 18px 26px; background:var(--es-bg,#fdfaef); color:#4a4436; font-size:var(--es-fs,100%); font-family:var(--es-font,"Nanum Pen Script", cursive, sans-serif); box-shadow:0 3px 10px rgba(70,60,30,.2); clip-path:polygon(0 0, 100% 0, 100% 92%, 94% 97%, 88% 93%, 81% 98%, 74% 94%, 67% 98%, 60% 93%, 52% 97%, 45% 93%, 38% 98%, 30% 94%, 23% 98%, 16% 93%, 9% 97%, 3% 93%, 0 97%); white-space:pre-wrap; }
.es-w-polaroid { background:#fdfdfa; padding:14px 14px 12px; max-width:16em; margin:1.2em auto; transform:rotate(-2deg); box-shadow:0 5px 16px rgba(0,0,0,.28); }
.es-pl-photo { background:linear-gradient(135deg, #cfd6cd, #a9b4ad 60%, #8f9e96); height:11em; display:flex; align-items:center; justify-content:center; color:#eef2ee; font-size:.85em; text-shadow:0 1px 2px rgba(0,0,0,.4); }
.es-pl-caption { padding:12px 4px 4px; text-align:center; font-family:var(--es-font,"Nanum Pen Script", cursive, sans-serif); color:#44403a; font-size:.95em; }
.es-w-bizcard { background:#fff; border:1px solid #e2e2dc; max-width:19em; margin:1.2em auto; padding:16px 18px; color:#2c2c28; box-shadow:0 3px 10px rgba(0,0,0,.14); border-radius:4px; }
.es-bc-co { font-size:.7em; letter-spacing:.24em; color:#8a8a80; margin-bottom:10px; font-weight:700; }
.es-bc-name { font-size:1.2em; font-weight:800; }
.es-bc-title { font-size:.8em; color:#6a6a60; margin-top:2px; }
.es-bc-contact { font-size:.72em; color:#8a8a80; margin-top:12px; border-top:1px solid #eee; padding-top:8px; line-height:1.6; }
.es-w-medical { background:#fefefc; border:2px solid #4c545c; max-width:26em; margin:1.2em auto; padding:18px; color:#2c3036; font-family:"Nanum Myeongjo", Batang, serif; }
.es-md-title { text-align:center; font-size:1.25em; font-weight:800; letter-spacing:.5em; margin-bottom:12px; border-bottom:1px solid #4c545c; padding-bottom:8px; }
.es-md-row { font-size:.85em; margin:5px 0; }
.es-md-key { display:inline-block; width:5.2em; color:#6a7078; font-size:.9em; }
.es-md-foot { margin-top:14px; text-align:right; font-size:.78em; color:#5a6068; border-top:1px dashed #a8b0b8; padding-top:8px; }
.es-md-stamp { display:inline-block; border:2px solid #c0392b; color:#c0392b; border-radius:50%; width:1.9em; height:1.9em; line-height:1.8em; text-align:center; margin-left:.5em; transform:rotate(-10deg); font-weight:800; }
.es-w-gradecard { background:#fdfdf8; border:1px solid #b0aa90; max-width:20em; margin:1.2em auto; padding:16px; color:#3a382c; font-family:"Nanum Myeongjo", Batang, serif; }
.es-gc-head { text-align:center; font-weight:800; letter-spacing:.4em; border-bottom:2px solid #3a382c; padding-bottom:6px; margin-bottom:6px; }
.es-gc-meta { text-align:center; font-size:.72em; color:#7a7460; margin-bottom:8px; }
.es-gc-row { display:flex; justify-content:space-between; font-size:.85em; padding:.3em .2em; border-bottom:1px dotted #c8c2a8; }
.es-w-banking { background:#fff; border:1px solid #e4e6ea; border-radius:14px; max-width:22em; margin:1.2em auto; overflow:hidden; color:#26282c; box-shadow:0 4px 12px rgba(30,40,60,.1); }
.es-bk-head { padding:10px 14px; font-weight:800; font-size:.9em; background:#f5f7fa; border-bottom:1px solid #e4e6ea; }
.es-bk-row { display:flex; justify-content:space-between; padding:8px 14px; font-size:.85em; border-bottom:1px solid #f0f2f5; }
.es-bk-amt.in { color:#2456c4; } .es-bk-amt.out { color:#d5462e; }
.es-bk-bal { padding:8px 14px; text-align:right; font-size:.78em; color:#8a9098; }
.es-w-parcel { background:#fefdf8; border:2px solid #3c3a30; max-width:24em; margin:1.2em auto; padding:14px; color:#33312a; font-family:var(--es-font,inherit); }
.es-pc-head { font-size:.8em; font-weight:700; border-bottom:2px solid #3c3a30; padding-bottom:6px; margin-bottom:8px; }
.es-pc-row { font-size:.85em; margin:4px 0; }
.es-pc-key { display:inline-block; width:5.4em; color:#7a7666; font-size:.9em; }
.es-pc-barcode { margin-top:10px; height:24px; background:repeating-linear-gradient(90deg, #33312a 0 2px, transparent 2px 5px, #33312a 5px 6px, transparent 6px 8px, #33312a 8px 11px, transparent 11px 13px); }
.es-w-dictionary { background:#fdfdf6; border-top:3px solid #3c3a30; border-bottom:1px solid #c8c2a8; max-width:26em; margin:1.2em auto; padding:14px 16px; color:#33312a; font-family:"Nanum Myeongjo", Batang, serif; }
.es-dc-word { font-size:1.2em; font-weight:800; }
.es-dc-pron { color:#7a7666; font-size:.85em; }
.es-dc-pos { font-size:.7em; color:#8a2c1e; border:1px solid #c0a8a0; border-radius:3px; padding:.05em .35em; vertical-align:middle; }
.es-dc-def { font-size:.88em; margin-top:6px; line-height:1.6; }

/* ═══ SNS·디지털 (2차) ═══ */
.es-subtitle { display:block; width:max-content; max-width:92%; margin:1.4em auto; padding:.4em 1em; background:rgba(8,8,10,.82); color:#fff; font-size:var(--es-fs,105%); font-family:var(--es-font,inherit); text-align:center; border-radius:4px; text-shadow:0 1px 2px #000; line-height:1.5; }
.es-w-lockscreen { background:linear-gradient(180deg, #2a3140, #171b26); border-radius:24px; max-width:18em; margin:1.2em auto; padding:26px 14px 20px; color:#fff; box-shadow:0 8px 24px rgba(0,0,0,.35); }
.es-ls-time { text-align:center; font-size:2.4em; font-weight:200; letter-spacing:.02em; }
.es-ls-date { text-align:center; font-size:.75em; color:#aab2c4; margin:2px 0 16px; }
.es-ls-card { background:rgba(255,255,255,.14); border-radius:12px; padding:9px 12px; margin:7px 0; -webkit-backdrop-filter:blur(4px); backdrop-filter:blur(4px); }
.es-ls-app { font-size:.68em; color:#c4ccdb; font-weight:700; margin-bottom:2px; }
.es-ls-msg { font-size:.82em; line-height:1.45; }
.es-w-youtube { background:#fff; border:1px solid #e2e2e2; border-radius:12px; max-width:26em; margin:1.2em auto; overflow:hidden; color:#0f0f0f; }
.es-yt-video { background:#000; color:#fff; text-align:center; padding:2.2em 0; font-size:1.6em; }
.es-yt-title { padding:10px 12px 2px; font-weight:700; font-size:.95em; line-height:1.4; }
.es-yt-meta { padding:0 12px 10px; font-size:.75em; color:#606060; border-bottom:1px solid #eee; }
.es-yt-cmt { padding:8px 12px 0; font-size:.8em; line-height:1.5; }
.es-yt-cmt:last-child { padding-bottom:10px; }
.es-yt-cmt b { color:#606060; margin-right:.4em; font-weight:600; }
.es-w-discord { background:#313338; border-radius:10px; max-width:26em; margin:1.2em auto; overflow:hidden; color:#dbdee1; font-size:.88em; }
.es-dc2-head { padding:9px 14px; background:#2b2d31; color:#949ba4; font-weight:700; border-bottom:1px solid #232428; font-size:.9em; }
.es-dc2-row { padding:6px 14px; line-height:1.5; }
.es-dc2-ava { display:inline-block; width:22px; height:22px; border-radius:50%; color:#222; text-align:center; line-height:22px; font-size:.7em; font-weight:800; margin-right:7px; vertical-align:middle; }
.es-dc2-nick { font-weight:700; margin-right:.4em; }
.es-dc2-sys { padding:6px 14px; color:#949ba4; font-size:.85em; font-style:italic; }
.es-w-vote { background:#fff; border:1px solid #e2e4e8; border-radius:14px; max-width:22em; margin:1.2em auto; padding:14px; color:#26282c; }
.es-vt-q { font-weight:800; font-size:.95em; margin-bottom:10px; }
.es-vt-item { position:relative; border:1px solid #e2e4e8; border-radius:9px; padding:.5em .8em; margin:6px 0; font-size:.85em; overflow:hidden; }
.es-vt-bar { position:absolute; left:0; top:0; bottom:0; background:#e8f0fe; z-index:0; }
.es-vt-item.top .es-vt-bar { background:#cfe0fc; }
.es-vt-label, .es-vt-n { position:relative; z-index:1; }
.es-vt-n { float:right; color:#5a6068; font-weight:700; }
.es-vt-total { text-align:right; font-size:.72em; color:#8a9098; margin-top:6px; }
.es-w-music { display:flex; gap:14px; background:linear-gradient(135deg, #2a2233, #17131e); border-radius:16px; max-width:24em; margin:1.2em auto; padding:16px; color:#f0ecf5; align-items:center; }
.es-mu-art { flex:none; width:64px; height:64px; border-radius:12px; background:linear-gradient(135deg, #6b5a8c, #3c3252); display:flex; align-items:center; justify-content:center; font-size:1.6em; }
.es-mu-info { flex:1; min-width:0; }
.es-mu-title { font-weight:800; font-size:.95em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.es-mu-artist { font-size:.75em; color:#b0a8c4; margin:2px 0 8px; }
.es-mu-bar { height:5px; border-radius:999px; background:rgba(255,255,255,.18); overflow:hidden; }
.es-mu-bar i { display:block; height:100%; background:#e8e2f5; }
.es-mu-time { display:flex; justify-content:space-between; font-size:.62em; color:#b0a8c4; margin-top:4px; }
.es-mu-ctrl { text-align:center; margin-top:6px; letter-spacing:1em; font-size:.9em; }
.es-w-videocall { position:relative; background:#14171c; border-radius:18px; max-width:20em; margin:1.2em auto; padding:34px 16px 20px; color:#fff; overflow:hidden; }
.es-vc-main { text-align:center; padding:1em 0 2em; }
.es-vc-ava { width:74px; height:74px; border-radius:50%; background:#3c4552; margin:0 auto 10px; line-height:74px; text-align:center; font-size:1.6em; }
.es-vc-name { font-size:1.15em; font-weight:700; }
.es-vc-sub { font-size:.75em; color:#9aa4b2; margin-top:4px; }
.es-vc-self { position:absolute; top:12px; right:12px; width:3.4em; height:4.4em; background:#2a3038; border:1px solid #454e5a; border-radius:8px; text-align:center; line-height:4.4em; font-size:.75em; color:#9aa4b2; }
.es-vc-btns { display:flex; justify-content:center; gap:18px; }
.es-vc-btns span { width:46px; height:46px; border-radius:50%; background:#2e3540; line-height:46px; text-align:center; }
.es-vc-btns .end { background:#e5484d; }
.es-w-market { background:#fff; border:1px solid #e4e6ea; border-radius:14px; max-width:22em; margin:1.2em auto; overflow:hidden; color:#26282c; }
.es-mk-item { display:flex; gap:10px; padding:10px 12px; border-bottom:1px solid #eef0f3; align-items:center; }
.es-mk-thumb { flex:none; width:44px; height:44px; background:#f2f4f6; border-radius:8px; display:flex; align-items:center; justify-content:center; }
.es-mk-name { font-weight:700; font-size:.88em; }
.es-mk-price { font-size:.8em; color:#5a6068; font-weight:700; }
.es-mk-price i { font-style:normal; font-size:.85em; color:#fff; background:#ff7e36; border-radius:4px; padding:.05em .4em; margin-left:.3em; }
.es-mk-row { padding:4px 12px; }
.es-mk-row.me { text-align:right; }
.es-mk-bubble { display:inline-block; max-width:76%; background:#f1f3f5; border-radius:12px; padding:.4em .7em; font-size:.82em; text-align:left; }
.es-mk-row.me .es-mk-bubble { background:#ff7e36; color:#fff; }
.es-mk-sys { text-align:center; font-size:.72em; color:#8a9098; padding:4px 0; }
.es-w-market .es-mk-row:last-child { padding-bottom:10px; }

/* ═══ 게임 위젯 (2차) ═══ */
.es-w-skillcard { border-radius:12px; max-width:22em; margin:1.2em auto; padding:14px 16px; background:#14161d; color:#e4e8f0; border:2px solid #9e9e9e; }
.es-w-skillcard.g-common { border-color:#9e9e9e; }
.es-w-skillcard.g-rare { border-color:#3fa9f5; box-shadow:0 0 12px rgba(63,169,245,.4); }
.es-w-skillcard.g-epic { border-color:#b44dff; box-shadow:0 0 14px rgba(180,77,255,.45); }
.es-w-skillcard.g-legend { border-color:#ff9c2e; box-shadow:0 0 16px rgba(255,156,46,.5); }
.es-sk-name { font-weight:800; font-size:1.02em; }
.es-w-skillcard.g-rare .es-sk-name { color:#7cc4ff; } .es-w-skillcard.g-epic .es-sk-name { color:#d09aff; } .es-w-skillcard.g-legend .es-sk-name { color:#ffc26e; }
.es-sk-cost { font-size:.72em; color:#8a94a8; margin:3px 0 8px; }
.es-sk-desc { font-size:.82em; line-height:1.6; color:#c2cad8; border-top:1px solid rgba(255,255,255,.1); padding-top:8px; }
.es-w-choices { background:#101725f0; border:1px solid #3d5a8c; border-radius:10px; max-width:24em; margin:1.2em auto; padding:12px 14px; color:#dce8ff; }
.es-ch-q { font-size:.85em; color:#8fb0e0; margin-bottom:8px; border-bottom:1px dashed rgba(143,176,224,.35); padding-bottom:6px; }
.es-ch-item { padding:.45em .6em; margin:4px 0; font-size:.9em; border:1px solid rgba(143,176,224,.3); border-radius:8px; background:rgba(143,176,224,.08); }

/* ═══ 본문 연출 ═══ */
.es-quotecard { display:block; margin:1.6em auto; max-width:30em; text-align:center; font-size:var(--es-fs,105%); font-family:var(--es-font, Georgia, "Nanum Myeongjo", serif); line-height:1.9; padding:1.2em .5em; border-top:2px solid var(--es-accent,#a08a5f); border-bottom:2px solid var(--es-accent,#a08a5f); position:relative; }
.es-quotecard::before { content:"❝"; display:block; color:var(--es-accent,#a08a5f); font-size:1.6em; line-height:1; margin-bottom:.3em; }
.es-monologue { display:block; margin:1.8em 12%; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); font-style:italic; opacity:.82; line-height:2.1; }
.es-flashback { display:block; margin:1.2em 0; padding:var(--es-pad,24px); background:#efe4cf; color:#5c4c34; font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); border-radius:6px; box-shadow:inset 0 0 34px rgba(120,90,40,.3); }
.es-flashback::before { content:"─ 그때의 기억 ─"; display:block; text-align:center; font-size:.72em; letter-spacing:.3em; color:#9a865e; margin-bottom:.9em; }
.es-dreamscene { display:block; margin:1.2em 0; padding:var(--es-pad,24px); background:linear-gradient(160deg, #e6ecf8, #d4dcf0); color:#4c5878; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-radius:16px; box-shadow:inset 0 0 30px rgba(255,255,255,.85); text-shadow:0 0 3px rgba(255,255,255,.9); font-style:italic; }
.es-prologue { display:block; margin:2em auto; max-width:28em; text-align:center; font-size:var(--es-fs,105%); font-family:var(--es-font, Georgia, "Nanum Myeongjo", serif); line-height:2; padding:1.6em 1em; }
.es-prologue::before { content:var(--es-label,"PROLOGUE"); display:block; font-size:.68em; letter-spacing:.5em; color:var(--es-accent,#a08a5f); margin-bottom:1.2em; }
.es-prologue::after { content:""; display:block; width:3em; border-top:1px solid var(--es-accent,#a08a5f); margin:1.4em auto 0; }
.es-ending { display:block; margin:2em auto; max-width:28em; text-align:center; font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); line-height:2; }
.es-ending::after { content:"✦  ✦  ✦"; display:block; color:var(--es-accent,#a08a5f); letter-spacing:.8em; margin-top:1.2em; font-size:.8em; }
.es-poem { display:block; margin:1.8em auto; max-width:20em; text-align:center; font-size:var(--es-fs,105%); line-height:var(--es-lh,2.4); font-family:var(--es-font, Georgia, "Nanum Myeongjo", serif); white-space:pre-wrap; }
.es-linefocus { display:block; margin:1.6em auto; width:max-content; max-width:88%; font-size:var(--es-fs,125%); font-weight:800; font-family:var(--es-font,inherit); padding:.3em 1em; border-left:4px solid var(--es-accent,#3a3a34); border-right:4px solid var(--es-accent,#3a3a34); text-align:center; }

/* ═══ 텍스트 (2차) ═══ */
.es-correction { position:relative; text-decoration:line-through; text-decoration-color:var(--es-accent,#d5462e); text-decoration-thickness:2px; font-family:var(--es-font,inherit); margin-right:.2em; }
.es-correction::after { content:var(--es-fix,""); position:absolute; left:15%; top:-1.05em; color:var(--es-accent,#d5462e); font-size:.72em; white-space:nowrap; font-weight:700; transform:rotate(-2deg); }
.es-circlemark { display:inline-block; padding:.05em .35em; border:var(--es-bw,2px) solid var(--es-accent,#d5462e); border-radius:255px 18px 225px 18px / 18px 225px 18px 255px; transform:rotate(-1.5deg); font-family:var(--es-font,inherit); }
.es-memoryfade { background:linear-gradient(90deg, var(--es-ink,#444) 30%, color-mix(in srgb, var(--es-ink,#444) 20%, transparent) 92%); -webkit-background-clip:text; background-clip:text; color:transparent; -webkit-text-fill-color:transparent; font-family:var(--es-font,inherit); }
.es-halffill { background:linear-gradient(0deg, var(--es-accent,#e8a33d) 0 46%, var(--es-ink,#3a3a34) 46%); -webkit-background-clip:text; background-clip:text; color:transparent; -webkit-text-fill-color:transparent; font-weight:800; font-size:var(--es-fs,115%); font-family:var(--es-font,inherit); }

/* ═══ 움직임 ═══ */
[class*="es-a-"], [class*="es-a-"]::before, [class*="es-a-"]::after { animation-iteration-count: var(--es-iter, infinite) !important; }
span[class*="es-a-"] { display:inline-block; }
div[class*="es-a-"], .es-block[class*="es-a-"] { display:block; }
.es-a-fadein.es-on { animation-name:esa-fade; animation-duration:var(--es-dur,2s); animation-fill-mode:both; animation-timing-function:ease; }
@keyframes esa-fade { from { opacity:0; } to { opacity:1; } }
.es-a-fadeup.es-on { animation:esa-fadeup var(--es-dur,2s) ease both; animation-iteration-count:var(--es-iter,1); }
@keyframes esa-fadeup { from { opacity:0; transform:translateY(.8em); } to { opacity:1; transform:none; } }
.es-a-fadedown.es-on { animation:esa-fadedown var(--es-dur,2s) ease both; animation-iteration-count:var(--es-iter,1); }
@keyframes esa-fadedown { from { opacity:0; transform:translateY(-.8em); } to { opacity:1; transform:none; } }
.es-a-slideleft.es-on { animation:esa-slideleft var(--es-dur,2s) cubic-bezier(.2,.9,.3,1) both; animation-iteration-count:var(--es-iter,1); }
@keyframes esa-slideleft { from { opacity:0; transform:translateX(-2em); } to { opacity:1; transform:none; } }
.es-a-slideright.es-on { animation:esa-slideright var(--es-dur,2s) cubic-bezier(.2,.9,.3,1) both; animation-iteration-count:var(--es-iter,1); }
@keyframes esa-slideright { from { opacity:0; transform:translateX(2em); } to { opacity:1; transform:none; } }
.es-a-zoomin.es-on { animation:esa-zoomin var(--es-dur,2s) cubic-bezier(.2,.9,.3,1) both; animation-iteration-count:var(--es-iter,1); }
@keyframes esa-zoomin { from { opacity:0; transform:scale(.4); } to { opacity:1; transform:scale(1); } }
.es-a-zoomout.es-on { animation:esa-zoomout var(--es-dur,2s) ease both; animation-iteration-count:var(--es-iter,1); }
@keyframes esa-zoomout { from { opacity:0; transform:scale(1.8); } to { opacity:1; transform:scale(1); } }
.es-a-popin.es-on { animation:esa-popin calc(var(--es-dur,2s)*.6) cubic-bezier(.34,1.56,.64,1) both; animation-iteration-count:var(--es-iter,1); }
@keyframes esa-popin { 0% { opacity:0; transform:scale(.5); } 70% { opacity:1; transform:scale(1.08); } 100% { transform:scale(1); } }
.es-a-bouncein.es-on { animation:esa-bouncein var(--es-dur,2s) ease both; animation-iteration-count:var(--es-iter,1); }
@keyframes esa-bouncein { 0% { opacity:0; transform:translateY(-1.4em); } 40% { opacity:1; transform:translateY(0); } 60% { transform:translateY(-.5em); } 80% { transform:translateY(0); } 92% { transform:translateY(-.15em); } 100% { transform:none; } }
.es-a-flipin.es-on { animation:esa-flipin var(--es-dur,2s) ease both; animation-iteration-count:var(--es-iter,1); }
@keyframes esa-flipin { from { opacity:0; transform:perspective(400px) rotateX(80deg); } to { opacity:1; transform:none; } }
.es-a-rotatein.es-on { animation:esa-rotatein var(--es-dur,2s) ease both; animation-iteration-count:var(--es-iter,1); }
@keyframes esa-rotatein { from { opacity:0; transform:rotate(-180deg) scale(.6); } to { opacity:1; transform:none; } }
.es-a-curtain.es-on { animation:esa-curtain var(--es-dur,2s) ease both; animation-iteration-count:var(--es-iter,1); }
@keyframes esa-curtain { from { clip-path:inset(0 50% 0 50%); } to { clip-path:inset(0 0 0 0); } }
.es-a-inkreveal.es-on { animation:esa-ink var(--es-dur,2s) ease both; animation-iteration-count:var(--es-iter,1); }
@keyframes esa-ink { from { clip-path:circle(0% at 50% 50%); opacity:.4; } to { clip-path:circle(120% at 50% 50%); opacity:1; } }
.es-a-sparkle { position:relative; }
.es-a-sparkle::after { content:"✦"; color:var(--es-accent,#ffd94d); font-size:.7em; position:absolute; top:-.6em; right:-.8em; }
.es-a-sparkle.es-on::after { animation:esa-twinkle var(--es-dur,2s) ease-in-out infinite; }
@keyframes esa-twinkle { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.25; transform:scale(.55) rotate(40deg); } }
.es-a-breathing.es-on { animation:esa-breath calc(var(--es-dur,2s)*2) ease-in-out infinite; }
@keyframes esa-breath { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.035); opacity:.88; } }
.es-a-floating.es-on { animation:esa-float calc(var(--es-dur,2s)*1.6) ease-in-out infinite; }
@keyframes esa-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-.35em); } }
.es-a-halo { text-shadow:0 0 10px var(--es-accent,#f0d47e); }
.es-a-halo.es-on { animation:esa-halo var(--es-dur,2s) ease-in-out infinite; }
@keyframes esa-halo { 0%,100% { text-shadow:0 0 8px var(--es-accent,#f0d47e); } 50% { text-shadow:0 0 20px var(--es-accent,#f0d47e), 0 0 34px color-mix(in srgb, var(--es-accent,#f0d47e) 55%, transparent); } }
.es-a-ripple { position:relative; }
.es-a-ripple::after { content:""; position:absolute; inset:-4px -8px; border:2px solid var(--es-accent,#5fb0ff); border-radius:999px; opacity:.45; }
.es-a-ripple.es-on::after { animation:esa-ripple var(--es-dur,2s) ease-out infinite; }
@keyframes esa-ripple { 0% { transform:scale(.8); opacity:.7; } 100% { transform:scale(1.6); opacity:0; } }
.es-a-flashfx.es-on { animation:esa-flash var(--es-dur,2s) steps(1) infinite; animation-iteration-count:var(--es-iter,3); }
@keyframes esa-flash { 0%,100% { background:transparent; } 6% { background:var(--es-accent,#fff8c4); } 12% { background:transparent; } 18% { background:var(--es-accent,#fff8c4); } 24% { background:transparent; } }
.es-a-bouncefx.es-on { animation:esa-bounce calc(var(--es-dur,2s)*.8) ease-in-out infinite; }
@keyframes esa-bounce { 0%,100% { transform:translateY(0); } 35% { transform:translateY(-.4em); } 55% { transform:translateY(.06em); } 70% { transform:translateY(-.14em); } }
.es-a-softblink.es-on { animation:esa-softblink calc(var(--es-dur,2s)*1.5) ease-in-out infinite; }
@keyframes esa-softblink { 0%,100% { opacity:1; } 50% { opacity:.42; } }
.es-a-fairydust { padding:1em 1.2em; border-radius:12px; background-color:rgba(60,30,70,.06); background-image:radial-gradient(circle, var(--es-accent,#ffd6f2) 1.3px, transparent 2.2px), radial-gradient(circle, color-mix(in srgb, var(--es-accent,#ffd6f2) 65%, transparent) 1px, transparent 1.8px); background-size:70px 70px, 46px 46px; background-position:8px 12px, 30px 34px; }
.es-a-fairydust.es-on { animation:esa-drift calc(var(--es-dur,2s)*4) linear infinite; }
@keyframes esa-drift { to { background-position:78px -58px, -16px -12px; } }
.es-a-fireflies { padding:1em 1.2em; border-radius:12px; background-color:#101a12; color:#d8e8d0; background-image:radial-gradient(circle, var(--es-accent,#d8f07e) 1.6px, transparent 3px), radial-gradient(circle, color-mix(in srgb, var(--es-accent,#d8f07e) 55%, transparent) 1.1px, transparent 2.4px); background-size:110px 90px, 70px 60px; background-position:20px 30px, 50px 10px; }
.es-a-fireflies.es-on { animation:esa-drift calc(var(--es-dur,2s)*5) linear infinite; }
.es-a-petals { padding:1em 1.2em; border-radius:12px; background-color:#fff5f8; background-image:radial-gradient(ellipse 4px 2.5px, var(--es-accent,#f7c1d0) 60%, transparent 70%), radial-gradient(ellipse 3px 2px, color-mix(in srgb, var(--es-accent,#f7c1d0) 70%, #fff) 60%, transparent 70%); background-size:80px 100px, 52px 70px; }
.es-a-petals.es-on { animation:esa-fall calc(var(--es-dur,2s)*3) linear infinite; }
@keyframes esa-fall { to { background-position:-18px 100px, 12px 70px; } }
.es-a-snowfall { padding:1em 1.2em; border-radius:12px; background-color:#2b3a55; color:#eef2fb; background-image:radial-gradient(circle, #fff 1.4px, transparent 2.4px), radial-gradient(circle, #ffffffb0 1px, transparent 1.9px); background-size:90px 90px, 55px 55px; }
.es-a-snowfall.es-on { animation:esa-snowfall calc(var(--es-dur,2s)*3.5) linear infinite; }
@keyframes esa-snowfall { to { background-position:18px 90px, -12px 55px; } }
.es-a-starrain { padding:1em 1.2em; border-radius:12px; background-color:#10142b; color:#e8ecff; background-image:linear-gradient(125deg, transparent 0 46%, #fff 49% 50%, transparent 53%), radial-gradient(circle, #fff 1px, transparent 1.8px); background-size:130px 90px, 60px 60px; }
.es-a-starrain.es-on { animation:esa-starrain calc(var(--es-dur,2s)*2.5) linear infinite; }
@keyframes esa-starrain { to { background-position:-130px 90px, -8px 60px; } }
.es-a-screenshake.es-on { animation:esa-shakebig calc(var(--es-dur,2s)*.4) linear infinite; animation-iteration-count:var(--es-iter,3); }
@keyframes esa-shakebig { 0%,100% { transform:translate(0,0); } 20% { transform:translate(-4px,2px); } 40% { transform:translate(4px,-2px); } 60% { transform:translate(-3px,-2px); } 80% { transform:translate(3px,2px); } }
.es-a-speedline { padding:1em 1.2em; background:repeating-linear-gradient(90deg, transparent 0 26px, rgba(120,130,150,.22) 26px 34px); border-radius:8px; font-weight:800; font-style:italic; }
.es-a-speedline.es-on { animation:esa-speed calc(var(--es-dur,2s)*.5) linear infinite; }
@keyframes esa-speed { to { background-position:-60px 0; } }
.es-a-chargeup.es-on { animation:esa-charge calc(var(--es-dur,2s)*1.4) ease-in infinite; }
@keyframes esa-charge { 0% { text-shadow:0 0 2px var(--es-accent,#4da3ff); transform:scale(1); } 80% { text-shadow:0 0 16px var(--es-accent,#4da3ff), 0 0 30px color-mix(in srgb, var(--es-accent,#4da3ff) 60%, transparent); transform:scale(1.04); } 100% { text-shadow:0 0 4px var(--es-accent,#4da3ff); transform:scale(1); } }
.es-a-ghostfade.es-on { animation:esa-ghost calc(var(--es-dur,2s)*2) ease-in-out infinite; }
@keyframes esa-ghost { 0%,100% { opacity:.9; filter:blur(0); } 50% { opacity:.28; filter:blur(1.2px); } }
.es-a-shadowcrawl { padding:1em 1.2em; background:linear-gradient(90deg, #0a0a0c 0%, #232328 30%, #0a0a0c 60%); background-size:220% 100%; color:#b8b8c0; border-radius:8px; }
.es-a-shadowcrawl.es-on { animation:esa-crawl calc(var(--es-dur,2s)*3) linear infinite; }
@keyframes esa-crawl { to { background-position:-220% 0; } }
.es-a-distortion.es-on { animation:esa-distort calc(var(--es-dur,2s)) steps(2) infinite; }
@keyframes esa-distort { 0%,100% { transform:skewX(0); } 25% { transform:skewX(4deg) translateX(1px); } 50% { transform:skewX(-3deg); } 75% { transform:skewX(2deg) translateX(-1px); } }
.es-a-typingfx { white-space:nowrap; overflow:hidden; vertical-align:bottom; border-right:2px solid currentColor; }
.es-a-typingfx.es-on { animation:esa-typing calc(var(--es-dur,2s)*2) steps(28, end) both, es-blink .7s steps(1) infinite; animation-iteration-count:var(--es-iter,1), infinite; }
@keyframes esa-typing { from { max-width:0; } to { max-width:100%; } }
.es-a-matrixrain { padding:1em 1.2em; background-color:#020a04; color:var(--es-accent,#37e05d); font-family:"SF Mono", Consolas, monospace; border-radius:8px; background-image:repeating-linear-gradient(0deg, color-mix(in srgb, var(--es-accent,#37e05d) 14%, transparent) 0 2px, transparent 2px 9px), repeating-linear-gradient(90deg, transparent 0 14px, rgba(0,0,0,.5) 14px 16px); text-shadow:0 0 6px var(--es-accent,#37e05d); }
.es-a-matrixrain.es-on { animation:esa-matrix calc(var(--es-dur,2s)) linear infinite; }
@keyframes esa-matrix { to { background-position:0 36px, 0 0; } }
.es-a-scanlinefx { position:relative; padding:1em 1.2em; border:1px solid color-mix(in srgb, var(--es-accent,#41e8ff) 50%, transparent); border-radius:8px; overflow:hidden; }
.es-a-scanlinefx::after { content:""; position:absolute; left:0; right:0; top:18%; height:2px; background:var(--es-accent,#41e8ff); box-shadow:0 0 10px var(--es-accent,#41e8ff); opacity:.75; }
.es-a-scanlinefx.es-on::after { animation:esa-scan calc(var(--es-dur,2s)*1.5) linear infinite; }
@keyframes esa-scan { 0% { top:-4%; } 100% { top:104%; } }
.es-a-datastream { padding:1em 1.2em; border-radius:8px; background:repeating-linear-gradient(90deg, color-mix(in srgb, var(--es-accent,#5fb0ff) 16%, transparent) 0 12px, transparent 12px 26px), #0c1420; color:#cfe4ff; font-family:"SF Mono", Consolas, monospace; }
.es-a-datastream.es-on { animation:esa-stream calc(var(--es-dur,2s)*.8) linear infinite; }
@keyframes esa-stream { to { background-position:52px 0, 0 0; } }
`;
