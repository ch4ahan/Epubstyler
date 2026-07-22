// ── 추가 효과 카탈로그 (3차): 스타일 + 애니메이션 ──
const color = (key, label, def) => ({ key, label, type: 'color', cssVar: `--es-${key}`, def });
const range = (key, label, def, min, max, step = 1, unit = 'px') =>
  ({ key, label, type: 'range', cssVar: `--es-${key}`, def, min, max, step, unit });
const select = (key, label, def, choices) => ({ key, label, type: 'select', cssVar: `--es-${key}`, def, choices });
const text = (key, label, def) => ({ key, label, type: 'text', cssVar: `--es-${key}`, quoted: true, def });
const fontOpt = () => ({ key: 'font', label: '폰트', type: 'font', cssVar: '--es-font', def: '' });
const pad = (def = 18) => range('pad', '안쪽 여백', def, 4, 44, 1, 'px');
const fs = (def = 100) => range('fs', '글자 크기', def, 70, 160, 5, '%');
const anim = () => [{ key: 'anim', label: '움직임 켜기', type: 'check', def: true }, range('dur', '재생 속도(초)', 2, 0.3, 10, 0.1, 's')];
const iterOpt = def => select('iter', '반복', def, [
  { value: 'infinite', label: '무한 반복' }, { value: '1', label: '1회' }, { value: '3', label: '3회' }]);

const B = (id, cat, name, sample, options = [], motion = false) =>
  ({ id, cat, kind: 'block', name, sample, motion, options });
const I = (id, cat, name, sample, options = [], motion = false) =>
  ({ id, cat, kind: 'inline', name, sample, motion, options });
const W = (id, cat, name, sample) => ({ id, cat, kind: 'widget', name, sample, motion: false, options: [] });
const A = (id, name, sample, iter = 'infinite', extra = [], kind = 'inline') =>
  ({ id: `a-${id}`, cat: 'motion', kind, name, sample, motion: true, options: [...anim(), iterOpt(iter), ...extra] });

export const EXTRA_PRESETS2 = [
  // ═══ 로판·판타지 ═══
  B('candlelight', 'fantasy', '촛불 조명', '촛불 하나가 어둠을 밀어냈다', [color('accent', '불빛 색', '#ffb64d'), pad(22), fs(), ...anim(), fontOpt()], true),
  B('crest', 'fantasy', '가문 문장', '아르덴 공작가의 이름으로', [color('accent', '문장 색', '#8c6b3f'), color('bg', '배경색', '#fbf7ee'), text('sym', '문장 기호', '⚜'), pad(20), fs(), fontOpt()]),
  B('templepillar', 'fantasy', '신전 기둥', '신탁의 방으로 들어서라', [color('accent', '기둥 색', '#cfc6b0'), color('bg', '배경색', '#f6f2e8'), pad(20), fs(), fontOpt()]),
  B('forbiddenlib', 'fantasy', '금지된 서고', '읽어서는 안 될 책이 있었다', [color('bg', '어둠 색', '#1a1712'), color('ink', '글자색', '#c8b98f'), pad(22), fs(), fontOpt()]),
  B('alchemy', 'fantasy', '연금술 레시피', '재료를 정해진 순서로 섞어라', [color('accent', '기호 색', '#6b8f6b'), color('bg', '배경색', '#eef2e6'), pad(20), fs(), fontOpt()]),
  I('darkwhisper', 'fantasy', '흑막의 속삭임', '…모든 것이 계획대로군', [color('accent', '그림자 색', '#7a1f2b'), fs(105), fontOpt()]),

  // ═══ 종이·문서 ═══
  B('burntdoc', 'paper', '불에 탄 문서', '증거는 이미 재가 되었다', [color('bg', '종이색', '#e8dcc0'), pad(24), fs(), fontOpt()]),
  B('wetdoc', 'paper', '물에 젖은 문서', '잉크가 눈물처럼 번져 있었다', [color('bg', '종이색', '#e4e6e0'), color('ink', '잉크색', '#3a4652'), pad(22), fs(), fontOpt()]),
  B('tornpage', 'paper', '찢어진 페이지', '…그 다음 장은 찢겨 있었다', [color('bg', '종이색', '#f6efdc'), pad(20), fs(), fontOpt()]),
  B('testament', 'paper', '유언장', '나의 마지막 뜻을 여기 남긴다', [color('accent', '테두리 색', '#5a4a2a'), pad(24), fs(), fontOpt()]),
  B('dunning', 'paper', '독촉장', '기한 내 상환하지 않을 시…', [color('accent', '도장 색', '#c22a1e'), text('stamp', '도장 글자', '催告'), pad(20), fs(), fontOpt()]),
  B('extraedition', 'paper', '호외', '호외! 황제 붕어', [color('ink', '글자색', '#1a1a1a'), fs(115), fontOpt()]),
  B('scrapbook', 'paper', '스크랩북', '오려 붙인 그날의 기사', [color('accent', '테이프 색', '#e8dba0'), color('bg', '종이색', '#faf6ea'), pad(22), fs(), fontOpt()]),

  // ═══ 게임·SF ═══
  B('achievement', 'game', '업적 달성', '업적 달성: 첫 회귀', [color('accent', '트로피 색', '#ffcf4d'), color('bg', '배경색', '#20242e'), pad(14), fs(95), fontOpt()]),
  W('ranking', 'game', '랭킹 보드', '1위 검은 늑대'),
  B('gacha', 'game', '가챠 결과', '★★★★★ SSR 등장!', [color('accent', '광채 색', '#ffd94d'), color('bg', '배경색', '#1a1226'), pad(18), fs(105), ...anim(), fontOpt()], true),
  B('missionclear', 'game', '미션 CLEAR', 'MISSION CLEAR', [select('kind', '판정', '#3fd07c', [{ value: '#3fd07c', label: 'CLEAR(초록)' }, { value: '#e5484d', label: 'FAILED(빨강)' }]), text('label', '판정 문구', 'CLEAR'), fs(130), fontOpt()]),
  B('tutorial', 'game', '튜토리얼 말풍선', '여기를 눌러 진행하세요!', [color('accent', '말풍선 색', '#3fa9f5'), pad(16), fs(95), fontOpt()]),
  B('bufbar', 'game', '버프/디버프 바', '공격력 상승 · 중독 · 기절', [color('accent', '테두리 색', '#5fb0ff'), pad(12), fs(90)]),
  B('radiolog', 'game', '무전 통신', '[치직] 응답하라, 여기는 본부', [color('accent', '신호 색', '#7ad67a'), pad(16), fs(92)]),
  B('savepoint', 'game', '세이브 포인트', '진행 상황을 저장하시겠습니까?', [color('accent', '포인트 색', '#5fd4c8'), color('bg', '배경색', '#12202a'), pad(18), fs(95), fontOpt()]),

  // ═══ 공포 ═══
  B('talisman', 'horror', '부적', '급급여율령', [color('accent', '주사 색', '#c81e1e'), color('bg', '한지색', '#f0e6d2'), pad(20), fs(105), fontOpt()]),
  B('policeline', 'horror', '폴리스라인', '접근 금지 구역', [text('label', '테이프 문구', 'KEEP OUT'), pad(20), fs(), fontOpt()]),
  B('exitsign', 'horror', '비상구 표지판', '출구는 어디에도 없었다', [color('accent', '표지 색', '#2ecc71'), pad(20), fs(), fontOpt()]),
  I('time444', 'horror', '4시 44분', '4:44', [color('accent', '숫자 색', '#e5202e'), fs(140)]),
  B('obituary', 'horror', '부고 명단', '삼가 고인의 명복을 빕니다', [pad(22), fs(), fontOpt()]),
  I('hallucination', 'horror', '환청', '자꾸만 이름을 부른다', [color('accent', '잔상 색', '#8b3a4a'), fs(105), fontOpt()]),
  B('foggyglass', 'horror', '김 서린 유리', '유리에 손자국이 남아 있었다', [pad(24), fs(), fontOpt()]),

  // ═══ 감성 ═══
  B('rainwindow', 'mood', '비 오는 창문', '창밖엔 비가 내리고 있었다', [color('bg', '유리 색', '#3a4a5c'), pad(22), fs(), ...anim(), fontOpt()], true),
  B('autumnleaf', 'mood', '가을 낙엽', '낙엽이 발밑에서 바스락거렸다', [color('bg', '배경색', '#f3e4cc'), color('ink', '글자색', '#6b4a2a'), pad(22), fs(), fontOpt()]),
  B('xmascard', 'mood', '크리스마스 카드', '메리 크리스마스', [color('accent', '전구 색', '#d5362e'), color('bg', '배경색', '#0f3a2e'), pad(22), fs(), fontOpt()]),
  B('nightsea', 'mood', '밤바다', '달빛이 파도 위에서 부서졌다', [pad(22), fs(), fontOpt()]),
  B('filmstrip', 'mood', '필름 스트립', '그 여름은 한 장의 사진 같았다', [pad(16), fs(), fontOpt()]),
  B('coffeestain', 'mood', '커피 얼룩 메모', '식은 커피 옆에 남긴 한 줄', [color('bg', '종이색', '#f6efe2'), pad(22), fs(), fontOpt()]),

  // ═══ 학교 ═══
  B('award', 'paper', '상장', '위 학생은 성적이 우수하여…', [color('accent', '금테 색', '#c9a83f'), text('title', '상장 제목', '표 창 장'), pad(24), fs(), fontOpt()]),
  B('mealplan', 'paper', '급식표', '오늘의 급식: 제육볶음, 미역국', [color('accent', '칸 색', '#7fb87f'), pad(16), fs(92), fontOpt()]),
  B('attendance', 'paper', '출석부', '3번 김하늘 ○ / 4번 이서준 ×', [color('accent', '선 색', '#b09060'), pad(16), fs(92)]),
  B('omr', 'paper', 'OMR 카드', '1번 정답을 마킹하시오', [color('accent', '마킹 색', '#333'), pad(18), fs(92)]),
  B('lockernote', 'paper', '사물함 쪽지', '방과후 옥상에서 기다릴게', [color('bg', '쪽지 색', '#fdf6e3'), pad(18), fs(), fontOpt()]),

  // ═══ 실물 ═══
  W('boardingpass', 'mockup', '보딩패스', 'KIM HANEUL · GATE 17'),
  B('trainticket', 'mockup', '기차표', '서울 → 부산 · 12호차 3A', [color('accent', '테두리 색', '#2a5caa'), pad(16), fs(92), fontOpt()]),
  B('lotto', 'mockup', '로또 복권', '7 14 21 28 35 42', [color('accent', '번호 색', '#e5202e'), pad(18), fs(), fontOpt()]),
  B('fortunecookie', 'mockup', '포춘쿠키', '뜻밖의 손님이 찾아옵니다', [pad(16), fs(), fontOpt()]),
  B('doorhanger', 'mockup', '도어행어', '방해하지 마세요', [color('accent', '태그 색', '#a02c3a'), pad(20), fs(), fontOpt()]),
  B('medicinebag', 'mockup', '약봉투', '1일 3회 · 식후 30분', [color('accent', '포인트 색', '#3a8f6b'), color('bg', '봉투 색', '#fbfaf4'), pad(18), fs(92), fontOpt()]),

  // ═══ SNS·디지털 ═══
  B('voicefile', 'sns', '녹음 파일', '음성 메시지 (0:14)', [color('accent', '파형 색', '#5b7fff'), pad(14), fs(90), fontOpt()]),
  B('smartwatch', 'sns', '스마트워치', '심박수 168 BPM', [color('accent', '수치 색', '#ff4d5e'), pad(18), fs(95), ...anim(), fontOpt()], true),

  // ═══ 본문 연출 ═══
  B('screenplay', 'scene', '시나리오 대본', '옥상 위, 두 사람이 마주 선다.', [text('scene', '씬 헤더', 'S#12. 밤 · 옥상'), pad(18), fs(), fontOpt()]),
  W('interview', 'scene', '인터뷰 Q&A', 'Q. 그날 밤 무엇을…'),
  B('chaptercover', 'scene', '챕터 표지', '균열', [text('num', '챕터 번호', 'Chapter 7'), color('accent', '번호 색', '#a08a5f'), fs(140), fontOpt()]),
  B('timeskip', 'scene', '시간 경과', '3년 후', [color('accent', '선 색', '#8a8a80'), fs(110), fontOpt()]),
  B('radiostory', 'scene', '라디오 사연', '오늘의 사연을 소개합니다', [color('accent', '포인트 색', '#c97b3f'), color('bg', '배경색', '#2a2420'), pad(20), fs(), fontOpt()]),

  // ═══ 텍스트 ═══
  I('rainbow', 'text', '무지개 글자', '일곱 빛깔 무지개', [fs(115), fontOpt()]),
  I('stencil', 'text', '스텐실 글자', 'DANGER', [color('ink', '글자색', '#3a3a34'), fs(120), fontOpt()]),
  I('emboss', 'text', '엠보싱 글자', '눌러 찍은 글씨', [color('ink', '글자색', '#d8d4cc'), fs(115), fontOpt()]),
  I('dotemphasis', 'text', '글자 옆 강조점', '방점을 찍다', [color('accent', '점 색', '#3a3a34'), fs(), fontOpt()]),
  I('talltext', 'text', '길쭉한 장체', '길게 늘어진 그림자', [fs(115), range('scaley', '세로 비율', 150, 110, 220, 5, '%'), color('ink', '글자색', ''), fontOpt()]),
  I('footnote', 'text', '각주 마커', '수상한 단어', [text('mark', '각주 번호', '1'), color('accent', '마커 색', '#3a6fb0'), fontOpt()]),

  // ═══ 움직임 ═══
  A('pendulum', '시계추', '똑, 딱, 똑, 딱', 'infinite'),
  A('jelly', '젤리', '말랑말랑', 'infinite'),
  A('rainbowcycle', '무지개 순환', '색이 천천히 돌아요', 'infinite'),
  A('focusin', '초점 맞추기', '흐릿하게 다가온다', '1'),
  A('stampdown', '도장 쾅', '승인!', '1'),
  A('pageflip', '페이지 넘김', '다음 장으로', '1'),
  A('rainfall', '비 내림', '창밖엔 비가 내린다', 'infinite', [], 'block'),
  A('leaffall', '낙엽 흩날림', '가을이 지나간다', 'infinite', [color('accent', '낙엽 색', '#d89a4a')], 'block'),
  A('mistflow', '안개 흐름', '안개가 밀려온다', 'infinite', [], 'block'),
  A('ekg', '심전도', '삐― 삐― 삐―', 'infinite', [color('accent', '라인 색', '#3fe07c')], 'block'),
  A('lightning', '번개 배경', '천둥이 울렸다', 'infinite', [], 'block'),
];

export const EXTRA_CSS2 = `
/* ═══ 로판·판타지 (3차) ═══ */
.es-candlelight { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--es-accent,#ffb64d) 32%, transparent), transparent 62%), #16110a; color:#f0dcb4; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-radius:8px; text-shadow:0 0 8px color-mix(in srgb, var(--es-accent,#ffb64d) 55%, transparent); }
.es-candlelight.es-on { animation:esc-flicker calc(var(--es-dur,2s)*1.3) ease-in-out infinite; }
@keyframes esc-flicker { 0%,100%{ box-shadow:inset 0 0 30px rgba(0,0,0,.5);} 45%{ box-shadow:inset 0 0 42px rgba(0,0,0,.62);} 60%{ box-shadow:inset 0 0 26px rgba(0,0,0,.42);} }
.es-crest { display:block; margin:1.2em 0; padding:var(--es-pad,20px) var(--es-pad,20px) var(--es-pad,20px); background:var(--es-bg,#fbf7ee); color:#4a3d22; font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); border:2px solid var(--es-accent,#8c6b3f); border-radius:6px; text-align:center; position:relative; }
.es-crest::before { content:var(--es-sym,"⚜"); display:block; font-size:1.5em; color:var(--es-accent,#8c6b3f); margin-bottom:.3em; }
.es-templepillar { display:block; margin:1.2em 0; padding:var(--es-pad,20px) calc(var(--es-pad,20px) + 1.4em); background:var(--es-bg,#f6f2e8); color:#4a453a; font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); text-align:center; border-left:14px solid; border-right:14px solid; border-image:repeating-linear-gradient(90deg, var(--es-accent,#cfc6b0) 0 3px, #fff 3px 5px, var(--es-accent,#cfc6b0) 5px 8px, #e8e2d4 8px 11px) 14; }
.es-forbiddenlib { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:repeating-linear-gradient(90deg, #14110c 0 22px, #1c1812 22px 24px), var(--es-bg,#1a1712); color:var(--es-ink,#c8b98f); font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); border-top:3px solid #3a3020; border-bottom:3px solid #3a3020; box-shadow:inset 0 0 34px #000; }
.es-alchemy { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:var(--es-bg,#eef2e6); color:#3a4a3a; font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); border:1px solid var(--es-accent,#6b8f6b); border-radius:4px; }
.es-alchemy::before { content:"☿ 🜁 🜂 🜃 🜄"; display:block; text-align:center; color:var(--es-accent,#6b8f6b); margin-bottom:.6em; letter-spacing:.3em; opacity:.85; }
.es-darkwhisper { color:#d8c4c8; font-size:var(--es-fs,105%); font-style:italic; font-family:var(--es-font,inherit); text-shadow:0 0 8px var(--es-accent,#7a1f2b), 1px 1px 0 rgba(0,0,0,.4); }

/* ═══ 종이·문서 (3차) ═══ */
.es-burntdoc { display:block; margin:1.2em 0; padding:var(--es-pad,24px); background:radial-gradient(ellipse at 50% 50%, var(--es-bg,#e8dcc0) 50%, #8a6a3a 78%, #2a1a0a 100%); color:#3d3222; font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); border-radius:4px; box-shadow:inset 0 0 30px rgba(60,30,0,.4); clip-path:polygon(2% 4%, 8% 0, 20% 3%, 35% 0, 52% 4%, 68% 0, 84% 3%, 96% 0, 100% 8%, 97% 22%, 100% 40%, 96% 60%, 100% 78%, 97% 94%, 88% 100%, 70% 96%, 50% 100%, 32% 97%, 14% 100%, 3% 95%, 0 80%, 3% 60%, 0 40%, 4% 20%); }
.es-wetdoc { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:radial-gradient(ellipse at 30% 40%, rgba(120,140,160,.35) 0 20%, transparent 45%), radial-gradient(ellipse at 75% 70%, rgba(110,130,150,.3) 0 18%, transparent 42%), var(--es-bg,#e4e6e0); color:var(--es-ink,#3a4652); font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); border:1px solid #b8bcb8; filter:blur(.15px); text-shadow:0 0 2px rgba(80,100,120,.4); }
.es-tornpage { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:var(--es-bg,#f6efdc); color:#42382a; font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); border:1px solid #ddd2b8; box-shadow:2px 2px 6px rgba(80,60,20,.15); clip-path:polygon(0 0, 100% 0, 100% 100%, 88% 96%, 82% 100%, 74% 95%, 66% 100%, 58% 96%, 50% 100%, 42% 95%, 34% 100%, 26% 96%, 18% 100%, 10% 95%, 0 100%); }
.es-testament { display:block; margin:1.2em 0; padding:var(--es-pad,24px); background:#fdfaf0; color:#33302a; font-size:var(--es-fs,100%); font-family:var(--es-font, "Nanum Myeongjo", Batang, serif); border:double 4px var(--es-accent,#5a4a2a); text-align:center; }
.es-testament::before { content:"遺 言 狀"; display:block; font-weight:800; letter-spacing:.4em; margin-bottom:.8em; border-bottom:1px solid var(--es-accent,#5a4a2a); padding-bottom:.4em; }
.es-dunning { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:#fdfbf4; color:#33312a; font-size:var(--es-fs,100%); font-family:var(--es-font, Batang, serif); border:1px solid #ccc4a8; position:relative; overflow:hidden; }
.es-dunning::before { content:var(--es-stamp,"催告"); position:absolute; top:10px; right:8px; transform:rotate(14deg); border:3px solid var(--es-accent,#c22a1e); color:var(--es-accent,#c22a1e); font-weight:900; padding:.1em .35em; border-radius:6px; opacity:.7; font-size:1.1em; }
.es-extraedition { display:block; margin:1.2em 0; padding:16px; background:#f2ece0; color:var(--es-ink,#1a1a1a); font-family:var(--es-font, "Nanum Myeongjo", Batang, serif); text-align:center; border-top:4px double #1a1a1a; border-bottom:4px double #1a1a1a; }
.es-extraedition::before { content:"號 外"; display:inline-block; background:#1a1a1a; color:#f2ece0; font-size:.5em; padding:.15em .6em; letter-spacing:.3em; margin-bottom:.4em; vertical-align:middle; }
.es-extraedition { font-size:var(--es-fs,115%); font-weight:900; line-height:1.3; }
.es-scrapbook { display:block; margin:1.4em 0; padding:var(--es-pad,22px); background:var(--es-bg,#faf6ea); color:#3a382c; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); box-shadow:0 2px 8px rgba(60,50,20,.18); position:relative; transform:rotate(-.8deg); border:1px solid #e4dcc4; }
.es-scrapbook::before, .es-scrapbook::after { content:""; position:absolute; width:52px; height:20px; background:color-mix(in srgb, var(--es-accent,#e8dba0) 75%, transparent); transform:rotate(-24deg); }
.es-scrapbook::before { top:-8px; left:-14px; }
.es-scrapbook::after { bottom:-8px; right:-14px; transform:rotate(-24deg); }

/* ═══ 게임·SF (3차) ═══ */
.es-achievement { display:block; margin:1.2em 0; padding:var(--es-pad,14px) 16px; background:var(--es-bg,#20242e); color:#f0ead0; font-size:var(--es-fs,95%); font-family:var(--es-font,inherit); border-left:4px solid var(--es-accent,#ffcf4d); border-radius:6px; box-shadow:0 2px 10px rgba(0,0,0,.3); }
.es-achievement::before { content:"🏆 업적 달성"; display:block; color:var(--es-accent,#ffcf4d); font-size:.75em; letter-spacing:.14em; font-weight:800; margin-bottom:.35em; }
.es-gacha { display:block; margin:1.2em 0; padding:var(--es-pad,18px); text-align:center; background:radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--es-accent,#ffd94d) 40%, var(--es-bg,#1a1226)), var(--es-bg,#1a1226) 72%); color:#fff3c4; font-size:var(--es-fs,105%); font-weight:800; font-family:var(--es-font,inherit); border-radius:12px; border:1px solid var(--es-accent,#ffd94d); text-shadow:0 0 12px var(--es-accent,#ffd94d); box-shadow:0 0 24px color-mix(in srgb, var(--es-accent,#ffd94d) 45%, transparent); }
.es-gacha.es-on { animation:esc-gacha var(--es-dur,2s) ease-in-out infinite; }
@keyframes esc-gacha { 0%,100%{ box-shadow:0 0 18px color-mix(in srgb, var(--es-accent,#ffd94d) 40%, transparent);} 50%{ box-shadow:0 0 36px color-mix(in srgb, var(--es-accent,#ffd94d) 75%, transparent);} }
.es-missionclear { display:block; margin:1.4em auto; width:max-content; max-width:92%; padding:.3em .9em; text-align:center; font-size:var(--es-fs,130%); font-weight:900; letter-spacing:.14em; font-family:var(--es-font,inherit); color:var(--es-kind,#3fd07c); border:3px solid var(--es-kind,#3fd07c); border-radius:8px; transform:rotate(-4deg); text-shadow:0 2px 4px rgba(0,0,0,.3); box-shadow:0 0 16px color-mix(in srgb, var(--es-kind,#3fd07c) 45%, transparent); }
.es-missionclear::after { content:var(--es-label,"CLEAR"); }
.es-tutorial { display:block; margin:1.2em 0; padding:var(--es-pad,16px); background:#fff; color:#26303c; font-size:var(--es-fs,95%); font-family:var(--es-font,inherit); border:2px solid var(--es-accent,#3fa9f5); border-radius:14px; position:relative; box-shadow:0 3px 10px rgba(0,0,0,.14); }
.es-tutorial::before { content:"💡"; position:absolute; left:-6px; top:-14px; background:var(--es-accent,#3fa9f5); border-radius:50%; width:1.8em; height:1.8em; line-height:1.8em; text-align:center; }
.es-bufbar { display:block; margin:1.2em 0; padding:var(--es-pad,12px); background:#12161e; color:#dce4f0; font-size:var(--es-fs,90%); font-family:var(--es-font,inherit); border:1px solid var(--es-accent,#5fb0ff); border-radius:8px; }
.es-bufbar::before { content:"● 상태 효과"; display:block; color:var(--es-accent,#5fb0ff); font-size:.75em; letter-spacing:.1em; margin-bottom:.4em; }
.es-radiolog { display:block; margin:1.2em 0; padding:var(--es-pad,16px); background:#0e1410; color:var(--es-accent,#7ad67a); font-size:var(--es-fs,92%); font-family:"SF Mono", Consolas, monospace; border-radius:6px; border-left:3px solid var(--es-accent,#7ad67a); }
.es-radiolog::before { content:"📻 RADIO ▸ "; opacity:.7; font-size:.8em; }
.es-savepoint { display:block; margin:1.2em auto; max-width:24em; padding:var(--es-pad,18px); text-align:center; background:var(--es-bg,#12202a); color:#dcecf0; font-size:var(--es-fs,95%); font-family:var(--es-font,inherit); border:1px solid var(--es-accent,#5fd4c8); border-radius:10px; box-shadow:0 0 14px color-mix(in srgb, var(--es-accent,#5fd4c8) 35%, transparent); }
.es-savepoint::before { content:"💾"; display:block; font-size:1.6em; margin-bottom:.3em; }

/* ═══ 공포 (3차) ═══ */
.es-talisman { display:block; margin:1.2em auto; max-width:11em; padding:var(--es-pad,20px) 14px; text-align:center; background:var(--es-bg,#f0e6d2); color:var(--es-accent,#c81e1e); font-size:var(--es-fs,105%); font-family:var(--es-font, "Nanum Myeongjo", Batang, serif); font-weight:700; writing-mode:vertical-rl; border:2px solid var(--es-accent,#c81e1e); letter-spacing:.2em; box-shadow:0 3px 10px rgba(80,20,20,.25); }
.es-policeline { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:#14140c; color:#e8e4d0; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); position:relative; }
.es-policeline::before, .es-policeline::after { content:var(--es-label,"KEEP OUT") "  " var(--es-label,"KEEP OUT"); position:absolute; left:-10%; width:120%; background:#f2c200; color:#14140c; font-weight:900; font-size:.7em; letter-spacing:.2em; text-align:center; overflow:hidden; white-space:nowrap; }
.es-policeline::before { top:8px; transform:rotate(-3deg); }
.es-policeline::after { bottom:8px; transform:rotate(3deg); }
.es-policeline { padding-top:2.4em; padding-bottom:2.4em; }
.es-exitsign { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:#0a0f0a; color:#cfe8cf; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-radius:4px; position:relative; padding-top:2.6em; }
.es-exitsign::before { content:"→ EXIT"; position:absolute; top:.5em; left:.8em; background:var(--es-accent,#2ecc71); color:#04120a; font-weight:800; font-size:.72em; padding:.15em .6em; border-radius:3px; letter-spacing:.16em; box-shadow:0 0 12px var(--es-accent,#2ecc71); }
.es-time444 { display:inline-block; padding:.1em .4em; background:#0a0a0a; color:var(--es-accent,#e5202e); font-size:var(--es-fs,140%); font-weight:800; font-family:"SF Mono", Consolas, monospace; letter-spacing:.1em; border-radius:6px; text-shadow:0 0 10px var(--es-accent,#e5202e); font-variant-numeric:tabular-nums; }
.es-obituary { display:block; margin:1.2em auto; max-width:24em; padding:var(--es-pad,22px); background:#f7f7f4; color:#2a2a2a; font-size:var(--es-fs,100%); font-family:var(--es-font, "Nanum Myeongjo", Batang, serif); border:6px solid #1a1a1a; text-align:center; }
.es-obituary::before { content:"訃 告"; display:block; font-weight:800; letter-spacing:.4em; margin-bottom:.6em; }
.es-hallucination { position:relative; color:#2a2a2a; font-size:var(--es-fs,105%); font-family:var(--es-font,inherit); text-shadow:2px 0 color-mix(in srgb, var(--es-accent,#8b3a4a) 60%, transparent), -2px 1px color-mix(in srgb, var(--es-accent,#8b3a4a) 40%, transparent), 1px -1px rgba(80,80,90,.4); }
.es-foggyglass { display:block; margin:1.2em 0; padding:var(--es-pad,24px); background:linear-gradient(135deg, #c4ccd0, #aeb8bc); color:#4a5258; font-size:var(--es-fs,100%); font-family:var(--es-font, "Nanum Pen Script", cursive, sans-serif); border-radius:8px; box-shadow:inset 0 0 40px rgba(255,255,255,.7); text-shadow:0 0 4px rgba(255,255,255,.9); filter:blur(.2px); }

/* ═══ 감성 (3차) ═══ */
.es-rainwindow { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:linear-gradient(120deg, transparent 0 6px, rgba(180,200,220,.25) 6px 7px, transparent 7px 14px), linear-gradient(100deg, transparent 0 10px, rgba(180,200,220,.2) 10px 11px, transparent 11px 22px), var(--es-bg,#3a4a5c); color:#dce6f0; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-radius:8px; text-shadow:0 1px 3px rgba(0,0,0,.4); }
.es-rainwindow.es-on { animation:esc-rain calc(var(--es-dur,2s)*.8) linear infinite; }
@keyframes esc-rain { to { background-position:-14px 40px, 22px 44px, 0 0; } }
.es-autumnleaf { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:radial-gradient(ellipse 5px 3px at 15% 20%, #c8853a 60%, transparent 70%), radial-gradient(ellipse 4px 2.5px at 80% 35%, #b06a2a 60%, transparent 70%), radial-gradient(ellipse 4px 3px at 45% 80%, #d89a4a 60%, transparent 70%), var(--es-bg,#f3e4cc); color:var(--es-ink,#6b4a2a); font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-radius:10px; }
.es-xmascard { display:block; margin:1.2em 0; padding:calc(var(--es-pad,22px) + .6em) var(--es-pad,22px) var(--es-pad,22px); background:var(--es-bg,#0f3a2e); color:#f0f4ee; font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); text-align:center; border-radius:8px; position:relative; }
.es-xmascard::before { content:"●  ●  ●  ●  ●  ●  ●"; position:absolute; top:.35em; left:0; right:0; text-align:center; font-size:.7em; letter-spacing:.5em; color:var(--es-accent,#d5362e); text-shadow:0 0 6px currentColor; }
.es-nightsea { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:linear-gradient(180deg, #0d1b3a 0%, #16305c 60%, #1c4470 100%); color:#dce8f8; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-radius:8px; box-shadow:inset 0 -20px 30px rgba(120,160,220,.15); text-shadow:0 0 8px rgba(180,210,255,.4); }
.es-filmstrip { display:block; margin:1.2em 0; padding:var(--es-pad,16px) calc(var(--es-pad,16px) + 1em); background:#1a1a1a; color:#e8e8e0; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-top:1.6em solid #1a1a1a; border-bottom:1.6em solid #1a1a1a; border-image:repeating-linear-gradient(90deg, #1a1a1a 0 10px, #e8e8e0 10px 16px, #1a1a1a 16px 26px) 16; background-clip:padding-box; }
.es-coffeestain { display:block; margin:1.2em 0; padding:var(--es-pad,22px); background:radial-gradient(circle at 80% 25%, transparent 14px, rgba(140,90,50,.28) 15px 18px, transparent 19px), var(--es-bg,#f6efe2); color:#4a3f2c; font-size:var(--es-fs,100%); font-family:var(--es-font, "Nanum Pen Script", cursive, sans-serif); border:1px solid #e0d6c0; }

/* ═══ 학교 (3차) ═══ */
.es-award { display:block; margin:1.2em auto; max-width:28em; padding:var(--es-pad,24px); background:#fffef8; color:#33302a; font-size:var(--es-fs,100%); font-family:var(--es-font, "Nanum Myeongjo", Batang, serif); border:3px solid var(--es-accent,#c9a83f); outline:1px solid var(--es-accent,#c9a83f); outline-offset:4px; text-align:center; }
.es-award::before { content:var(--es-title,"표 창 장"); display:block; font-size:1.5em; font-weight:800; letter-spacing:.5em; margin-bottom:.7em; color:#3a3420; }
.es-mealplan { display:block; margin:1.2em 0; padding:var(--es-pad,16px); background:#fdfef8; color:#33402a; font-size:var(--es-fs,92%); font-family:var(--es-font,inherit); border:2px solid var(--es-accent,#7fb87f); border-radius:8px; }
.es-mealplan::before { content:"🍚 오늘의 급식"; display:block; background:var(--es-accent,#7fb87f); color:#fff; margin:calc(var(--es-pad,16px)*-1) calc(var(--es-pad,16px)*-1) var(--es-pad,16px); padding:.4em .8em; font-size:.85em; font-weight:700; }
.es-attendance { display:block; margin:1.2em 0; padding:var(--es-pad,16px); background:linear-gradient(0deg, transparent calc(1.8em - 1px), color-mix(in srgb, var(--es-accent,#b09060) 50%, transparent) 1.8em), #fdfdf8; background-size:100% 1.8em; color:#3a352a; font-size:var(--es-fs,92%); font-family:var(--es-font,inherit); line-height:1.8em; border:1px solid color-mix(in srgb, var(--es-accent,#b09060) 60%, #888); }
.es-attendance::before { content:"출 석 부"; display:block; font-weight:800; letter-spacing:.3em; border-bottom:2px solid var(--es-accent,#b09060); margin-bottom:.3em; }
.es-omr { display:block; margin:1.2em 0; padding:var(--es-pad,18px); background:#fbfbf6; color:#2a2a2a; font-size:var(--es-fs,92%); font-family:var(--es-font,inherit); border:1px solid #ccc; border-radius:4px; }
.es-omr::after { content:"① ② ③ ④ ⑤"; display:block; margin-top:.6em; letter-spacing:.4em; color:var(--es-accent,#333); font-size:1.1em; }
.es-lockernote { display:block; margin:1.2em auto; max-width:18em; padding:var(--es-pad,18px); background:var(--es-bg,#fdf6e3); color:#4a4436; font-size:var(--es-fs,100%); font-family:var(--es-font, "Nanum Pen Script", cursive, sans-serif); box-shadow:0 3px 10px rgba(80,70,30,.2); transform:rotate(-1.2deg); border:1px solid #e8dfc4; }

/* ═══ 실물 (3차) ═══ */
.es-trainticket { display:block; margin:1.2em auto; max-width:24em; padding:var(--es-pad,16px); background:#fdfdfa; color:#2a3648; font-size:var(--es-fs,92%); font-family:var(--es-font,inherit); border:2px solid var(--es-accent,#2a5caa); border-radius:6px; position:relative; }
.es-trainticket::before { content:"🚄 TRAIN"; display:block; color:var(--es-accent,#2a5caa); font-size:.72em; font-weight:800; letter-spacing:.14em; margin-bottom:.4em; }
.es-trainticket::after { content:""; position:absolute; right:3.4em; top:-2px; bottom:-2px; border-left:2px dashed var(--es-accent,#2a5caa); }
.es-lotto { display:block; margin:1.2em auto; max-width:22em; padding:var(--es-pad,18px); background:#fffef6; color:#2a2a2a; font-size:var(--es-fs,100%); font-family:var(--es-font, "SF Mono", monospace); text-align:center; border:1px dashed #b0a878; border-radius:6px; letter-spacing:.16em; font-weight:800; }
.es-lotto::before { content:"L O T T O"; display:block; color:var(--es-accent,#e5202e); font-size:.66em; letter-spacing:.5em; margin-bottom:.5em; }
.es-fortunecookie { display:block; margin:1.2em auto; max-width:22em; padding:.8em 1.4em; background:#fdfaf0; color:#5a4a32; font-size:var(--es-fs,100%); font-family:var(--es-font, Georgia, serif); font-style:italic; text-align:center; border-top:1px solid #d8c8a0; border-bottom:1px solid #d8c8a0; }
.es-fortunecookie::before { content:"🥠 "; font-style:normal; }
.es-doorhanger { display:block; margin:1.2em auto; max-width:11em; padding:var(--es-pad,20px) 14px calc(var(--es-pad,20px) + .8em); background:var(--es-accent,#a02c3a); color:#f8e8ea; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); text-align:center; border-radius:8px 8px 10px 10px; position:relative; }
.es-doorhanger::before { content:""; position:absolute; top:6px; left:50%; transform:translateX(-50%); width:2.4em; height:2.4em; border:3px solid #f8e8ea; border-radius:50%; }
.es-doorhanger { padding-top:3.6em; }
.es-medicinebag { display:block; margin:1.2em auto; max-width:20em; padding:var(--es-pad,18px); background:var(--es-bg,#fbfaf4); color:#33402a; font-size:var(--es-fs,92%); font-family:var(--es-font,inherit); border:1px solid #d8ddc8; border-radius:4px; }
.es-medicinebag::before { content:"💊 복약 안내"; display:block; color:var(--es-accent,#3a8f6b); font-weight:700; font-size:.85em; border-bottom:1px dashed #c0ccb8; padding-bottom:.4em; margin-bottom:.5em; }

/* ═══ SNS·디지털 (3차) ═══ */
.es-voicefile { display:flex; align-items:center; gap:10px; margin:1.2em auto; max-width:22em; padding:var(--es-pad,14px) 16px; background:#eef2ff; color:#2a3452; font-size:var(--es-fs,90%); font-family:var(--es-font,inherit); border-radius:999px; }
.es-voicefile::before { content:"▶"; flex:none; width:2em; height:2em; line-height:2em; text-align:center; border-radius:50%; background:var(--es-accent,#5b7fff); color:#fff; }
.es-voicefile::after { content:""; flex:1; height:20px; background:repeating-linear-gradient(90deg, var(--es-accent,#5b7fff) 0 2px, transparent 2px 5px); -webkit-mask:repeating-linear-gradient(90deg, #000 0 2px, transparent 2px 5px); opacity:.6; margin-left:6px; }
.es-smartwatch { display:block; margin:1.2em auto; max-width:14em; padding:var(--es-pad,18px); background:#0a0a0c; color:#f0f0f4; font-size:var(--es-fs,95%); font-family:var(--es-font,inherit); text-align:center; border-radius:26px; border:6px solid #26262a; }
.es-smartwatch::before { content:"♥"; display:block; color:var(--es-accent,#ff4d5e); font-size:1.6em; }
.es-smartwatch.es-on::before { animation:esc-heart2 calc(var(--es-dur,2s)*.7) ease-in-out infinite; }
@keyframes esc-heart2 { 0%,100%{ transform:scale(1);} 30%{ transform:scale(1.22);} 45%{ transform:scale(1);} }

/* ═══ 본문 연출 (3차) ═══ */
.es-screenplay { display:block; margin:1.2em 0; padding:var(--es-pad,18px); background:#fdfdf8; color:#2a2a28; font-size:var(--es-fs,100%); font-family:var(--es-font, "Courier New", monospace); border:1px solid #e0e0d4; }
.es-screenplay::before { content:var(--es-scene,"S#12"); display:block; font-weight:800; letter-spacing:.06em; margin-bottom:.7em; text-transform:uppercase; border-bottom:1px solid #ccc; padding-bottom:.3em; }
.es-chaptercover { display:block; margin:2em auto; max-width:26em; text-align:center; padding:1.6em 1em; font-size:var(--es-fs,140%); font-weight:800; font-family:var(--es-font, Georgia, "Nanum Myeongjo", serif); }
.es-chaptercover::before { content:var(--es-num,"Chapter"); display:block; font-size:.42em; font-weight:600; letter-spacing:.4em; color:var(--es-accent,#a08a5f); margin-bottom:1em; }
.es-chaptercover::after { content:""; display:block; width:2.4em; border-top:2px solid var(--es-accent,#a08a5f); margin:.8em auto 0; }
.es-timeskip { display:block; margin:1.8em auto; text-align:center; font-size:var(--es-fs,110%); font-family:var(--es-font,inherit); color:#6a6a62; letter-spacing:.15em; }
.es-timeskip::before, .es-timeskip::after { content:"—"; color:var(--es-accent,#8a8a80); margin:0 .8em; }
.es-radiostory { display:block; margin:1.2em 0; padding:var(--es-pad,20px); background:var(--es-bg,#2a2420); color:#f0e6d8; font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); border-radius:8px; border-left:4px solid var(--es-accent,#c97b3f); }
.es-radiostory::before { content:"📻 사연"; display:block; color:var(--es-accent,#c97b3f); font-size:.75em; letter-spacing:.16em; font-weight:700; margin-bottom:.5em; }

/* ═══ 텍스트 (3차) ═══ */
.es-rainbow { background:linear-gradient(90deg, #e5484d, #f2a33c, #f5d90a, #3fd07c, #3fa9f5, #6b5cff, #b44dff); -webkit-background-clip:text; background-clip:text; color:transparent; -webkit-text-fill-color:transparent; font-weight:800; font-size:var(--es-fs,115%); font-family:var(--es-font,inherit); }
.es-stencil { color:var(--es-ink,#3a3a34); font-weight:900; font-size:var(--es-fs,120%); font-family:var(--es-font, "Arial Black", sans-serif); letter-spacing:.05em; background:repeating-linear-gradient(115deg, transparent 0 8px, rgba(255,255,255,.9) 8px 10px); -webkit-background-clip:text; background-clip:text; }
.es-emboss { color:var(--es-ink,#d8d4cc); font-weight:800; font-size:var(--es-fs,115%); font-family:var(--es-font,inherit); text-shadow:-1px -1px 0 rgba(255,255,255,.7), 1px 1px 1px rgba(0,0,0,.35); }
.es-dotemphasis { font-size:var(--es-fs,100%); font-family:var(--es-font,inherit); text-emphasis:filled dot var(--es-accent,#3a3a34); -webkit-text-emphasis:filled dot var(--es-accent,#3a3a34); text-emphasis-position:over; -webkit-text-emphasis-position:over; }
.es-talltext { display:inline-block; transform:scaleY(calc(var(--es-scaley,150%) / 100)); transform-origin:bottom; color:var(--es-ink,inherit); font-size:var(--es-fs,115%); font-family:var(--es-font,inherit); }
.es-footnote { font-family:var(--es-font,inherit); }
.es-footnote::after { content:var(--es-mark,"1"); font-size:.62em; vertical-align:super; color:var(--es-accent,#3a6fb0); font-weight:700; margin-left:1px; }

/* ═══ 움직임 (3차) ═══ */
.es-a-pendulum.es-on { animation:esa-pendulum calc(var(--es-dur,2s)) ease-in-out infinite; transform-origin:top center; }
@keyframes esa-pendulum { 0%,100%{ transform:rotate(-8deg);} 50%{ transform:rotate(8deg);} }
.es-a-jelly.es-on { animation:esa-jelly calc(var(--es-dur,2s)) ease-in-out infinite; }
@keyframes esa-jelly { 0%,100%{ transform:scale(1,1);} 30%{ transform:scale(1.14,.82);} 45%{ transform:scale(.9,1.12);} 60%{ transform:scale(1.06,.96);} 75%{ transform:scale(.98,1.02);} }
.es-a-rainbowcycle { color:#e5484d; font-weight:800; }
.es-a-rainbowcycle.es-on { animation:esa-huecycle calc(var(--es-dur,2s)*2) linear infinite; }
@keyframes esa-huecycle { from { filter:hue-rotate(0deg);} to { filter:hue-rotate(360deg);} }
.es-a-focusin.es-on { animation:esa-focus var(--es-dur,2s) ease both; animation-iteration-count:var(--es-iter,1); }
@keyframes esa-focus { from { filter:blur(8px); opacity:0; letter-spacing:.3em;} to { filter:blur(0); opacity:1; letter-spacing:normal;} }
.es-a-stampdown.es-on { animation:esa-stamp var(--es-dur,2s) cubic-bezier(.3,1.4,.5,1) both; animation-iteration-count:var(--es-iter,1); }
@keyframes esa-stamp { 0%{ transform:scale(3) rotate(-12deg); opacity:0;} 60%{ transform:scale(.92) rotate(-4deg); opacity:1;} 80%{ transform:scale(1.04) rotate(-6deg);} 100%{ transform:scale(1) rotate(-5deg);} }
.es-a-pageflip.es-on { animation:esa-pageflip var(--es-dur,2s) ease both; animation-iteration-count:var(--es-iter,1); transform-origin:left center; }
@keyframes esa-pageflip { from { transform:perspective(600px) rotateY(-95deg); opacity:0;} to { transform:none; opacity:1;} }
.es-a-rainfall { padding:1em 1.2em; border-radius:8px; background-color:#26303c; color:#dce6f0; background-image:repeating-linear-gradient(105deg, transparent 0 8px, rgba(180,205,230,.28) 8px 9px, transparent 9px 18px); }
.es-a-rainfall.es-on { animation:esa-rainfall calc(var(--es-dur,2s)*.6) linear infinite; }
@keyframes esa-rainfall { to { background-position:-14px 40px; } }
.es-a-leaffall { padding:1em 1.2em; border-radius:8px; background-color:#f3e8d4; color:#5a4128; background-image:radial-gradient(ellipse 5px 3px, var(--es-accent,#d89a4a) 60%, transparent 70%), radial-gradient(ellipse 4px 2.5px, color-mix(in srgb, var(--es-accent,#d89a4a) 70%, #8a4a1a) 60%, transparent 70%); background-size:90px 110px, 60px 76px; }
.es-a-leaffall.es-on { animation:esa-leaffall calc(var(--es-dur,2s)*3) linear infinite; }
@keyframes esa-leaffall { to { background-position:-24px 110px, 16px 76px; } }
.es-a-mistflow { padding:1em 1.2em; border-radius:8px; background:linear-gradient(90deg, #cfd6da 0%, #eef1f3 40%, #cfd6da 80%); background-size:220% 100%; color:#5a6268; }
.es-a-mistflow.es-on { animation:esa-mistflow calc(var(--es-dur,2s)*3) linear infinite; }
@keyframes esa-mistflow { to { background-position:-220% 0; } }
.es-a-ekg { padding:1em 1.2em; border-radius:8px; background:#0a120a; color:var(--es-accent,#3fe07c); font-family:"SF Mono", monospace; position:relative; overflow:hidden; }
.es-a-ekg::after { content:""; position:absolute; left:0; bottom:20%; width:40%; height:2px; background:var(--es-accent,#3fe07c); box-shadow:0 0 8px var(--es-accent,#3fe07c); -webkit-mask:linear-gradient(90deg, transparent 0 40%, #000 45% 47%, transparent 48% 50%, #000 52% 53%, transparent 54%); mask:linear-gradient(90deg, transparent 0 40%, #000 45% 47%, transparent 48% 50%, #000 52% 53%, transparent 54%); }
.es-a-ekg.es-on::after { animation:esa-ekg calc(var(--es-dur,2s)) linear infinite; }
@keyframes esa-ekg { from { transform:translateX(-40%);} to { transform:translateX(250%);} }
.es-a-lightning { padding:1em 1.2em; border-radius:8px; background:#161824; color:#e8ecf8; }
.es-a-lightning.es-on { animation:esa-lightning calc(var(--es-dur,2s)*2) steps(1) infinite; }
@keyframes esa-lightning { 0%,90%,100%{ background:#161824;} 92%{ background:#5a648a;} 94%{ background:#161824;} 96%{ background:#7a86b4;} 98%{ background:#161824;} }

/* ═══ 위젯 (3차) ═══ */
.es-w-ranking { background:#141822; border-radius:12px; max-width:22em; margin:1.2em auto; overflow:hidden; color:#e4e8f0; }
.es-rk-head { padding:10px 14px; background:#1c2130; font-weight:800; font-size:.9em; letter-spacing:.1em; border-bottom:1px solid #2a3040; }
.es-rk-row { display:flex; align-items:center; gap:10px; padding:8px 14px; font-size:.88em; border-bottom:1px solid #1e2330; }
.es-rk-n { flex:none; width:1.7em; height:1.7em; line-height:1.7em; text-align:center; border-radius:50%; background:#2a3040; font-size:.8em; font-weight:800; }
.es-rk-row.gold .es-rk-n { background:linear-gradient(135deg,#ffd94d,#e0a020); color:#3a2a00; }
.es-rk-row.silver .es-rk-n { background:linear-gradient(135deg,#e0e4ea,#9aa0ac); color:#2a2e34; }
.es-rk-row.bronze .es-rk-n { background:linear-gradient(135deg,#e0a875,#a06838); color:#2e1c0c; }
.es-rk-name { flex:1; }
.es-rk-row b { color:#8fb0e0; font-variant-numeric:tabular-nums; }

.es-w-boardingpass { display:flex; max-width:26em; margin:1.2em auto; background:#fff; border:1px solid #dfe4ea; border-radius:10px; overflow:hidden; color:#243044; box-shadow:0 4px 12px rgba(30,50,80,.12); }
.es-bp-main { flex:1; padding:14px 16px; }
.es-bp-head { display:flex; justify-content:space-between; font-weight:800; font-size:.82em; letter-spacing:.1em; color:#2a5caa; border-bottom:1px solid #eef1f5; padding-bottom:6px; margin-bottom:8px; }
.es-bp-row { display:flex; justify-content:space-between; font-size:.82em; padding:3px 0; }
.es-bp-row span { color:#8a94a2; }
.es-bp-barcode { margin-top:10px; height:22px; background:repeating-linear-gradient(90deg,#243044 0 2px,transparent 2px 5px,#243044 5px 6px,transparent 6px 9px); }
.es-bp-stub { flex:none; width:6.5em; padding:14px 12px; border-left:2px dashed #c4ccd6; background:#f6f8fb; }
.es-bp-stub .es-bp-row { display:block; margin-bottom:8px; }
.es-bp-stub .es-bp-row b { font-size:1.1em; }

.es-w-instastory { max-width:16em; margin:1.2em auto; background:linear-gradient(180deg,#3a2c4a,#1a1420); border-radius:16px; overflow:hidden; color:#fff; box-shadow:0 8px 24px rgba(0,0,0,.3); }
.es-is-bar { padding:8px 10px 0; }
.es-is-bar i { display:block; height:2.5px; background:rgba(255,255,255,.4); border-radius:2px; overflow:hidden; position:relative; }
.es-is-bar i::after { content:""; position:absolute; left:0; top:0; bottom:0; width:60%; background:#fff; }
.es-is-head { display:flex; align-items:center; gap:7px; padding:8px 10px; font-size:.82em; }
.es-is-ava { width:24px; height:24px; border-radius:50%; background:linear-gradient(45deg,#f09433,#dc2743,#bc1888); text-align:center; line-height:24px; font-size:.72em; font-weight:800; }
.es-is-time { color:#c0c0c8; font-size:.82em; margin-left:auto; }
.es-is-body { padding:2.6em 1em; text-align:center; font-size:1.05em; line-height:1.6; text-shadow:0 1px 4px rgba(0,0,0,.5); }
.es-is-reply { padding:8px 12px; margin:0 10px 12px; border:1px solid rgba(255,255,255,.4); border-radius:999px; font-size:.76em; color:#d0d0d8; display:flex; justify-content:space-between; }

.es-w-anonpost { background:#fff; border:1px solid #e2e4e8; border-radius:10px; max-width:26em; margin:1.2em auto; padding:14px 16px; color:#26282c; }
.es-ap2-board { font-size:.72em; color:#8a9098; font-weight:700; letter-spacing:.06em; margin-bottom:6px; }
.es-ap2-title { font-weight:800; font-size:.98em; margin-bottom:8px; }
.es-ap2-body { font-size:.86em; line-height:1.65; color:#3a3e44; }
.es-ap2-foot { margin-top:12px; padding-top:8px; border-top:1px solid #eef0f3; font-size:.74em; color:#8a9098; }
.es-ap2-anon { display:inline-block; background:#eef0f3; color:#5a6068; border-radius:4px; padding:.1em .45em; margin-right:.5em; font-weight:700; }

.es-w-bubblemsg { background:#f5ecfa; border-radius:14px; max-width:22em; margin:1.2em auto; padding:14px; color:#3a2c48; }
.es-bb-date { text-align:center; font-size:.7em; color:#9a8ab0; margin-bottom:8px; }
.es-bb-head { display:flex; align-items:center; gap:7px; font-weight:800; font-size:.88em; margin-bottom:10px; }
.es-bb-ava { width:26px; height:26px; border-radius:50%; background:linear-gradient(135deg,#c89aeb,#9a6bd4); color:#fff; text-align:center; line-height:26px; font-size:.78em; }
.es-bb-row { margin:6px 0; }
.es-bb-bubble { display:inline-block; max-width:82%; background:#fff; border-radius:4px 14px 14px 14px; padding:.5em .8em; font-size:.86em; box-shadow:0 1px 3px rgba(120,80,160,.15); }

.es-w-mapapp { background:#fff; border:1px solid #e2e4e8; border-radius:12px; max-width:22em; margin:1.2em auto; overflow:hidden; color:#26282c; box-shadow:0 4px 12px rgba(0,0,0,.1); }
.es-mp-map { height:6em; background:linear-gradient(135deg,#dce8dc,#c8dcc4); background-image:repeating-linear-gradient(0deg,transparent 0 18px,rgba(255,255,255,.5) 18px 19px),repeating-linear-gradient(90deg,transparent 0 24px,rgba(255,255,255,.5) 24px 25px); position:relative; }
.es-mp-pin { position:absolute; left:50%; top:44%; transform:translate(-50%,-50%); font-size:1.7em; }
.es-mp-card { padding:12px 14px; }
.es-mp-dest { font-weight:800; font-size:.95em; }
.es-mp-addr { font-size:.78em; color:#8a9098; margin-top:2px; }
.es-mp-eta { margin-top:8px; font-size:.82em; color:#2a8f5a; font-weight:700; }

.es-w-delivery { background:#fff; border:1px solid #e2e4e8; border-radius:12px; max-width:24em; margin:1.2em auto; padding:14px 16px; color:#26282c; }
.es-dl-store { font-weight:800; font-size:.92em; margin-bottom:12px; }
.es-dl-steps { display:flex; align-items:center; font-size:.68em; color:#b0b6be; }
.es-dl-step { white-space:nowrap; }
.es-dl-step.on { color:#ff7e36; font-weight:700; }
.es-dl-step.cur { color:#ff5e10; }
.es-dl-steps i { flex:1; height:2px; background:#e4e6ea; margin:0 4px; }
.es-dl-eta { margin-top:10px; font-weight:800; font-size:.9em; color:#ff5e10; }
.es-dl-items { margin-top:8px; padding-top:8px; border-top:1px solid #eef0f3; font-size:.8em; color:#5a6068; }

.es-w-translator { display:flex; align-items:stretch; gap:0; max-width:26em; margin:1.2em auto; background:#fff; border:1px solid #dfe4ea; border-radius:10px; overflow:hidden; color:#26282c; }
.es-tr-pane { flex:1; padding:12px 14px; }
.es-tr-pane.to { background:#f4f8ff; }
.es-tr-lang { font-size:.68em; color:#8a94a2; font-weight:700; letter-spacing:.06em; margin-bottom:6px; }
.es-tr-text { font-size:.88em; line-height:1.5; }
.es-tr-arrow { flex:none; display:flex; align-items:center; padding:0 4px; color:#b0b6be; }

.es-w-interview { background:#fdfdfb; border-left:3px solid #cfc4a8; max-width:28em; margin:1.2em auto; padding:16px 18px; color:#2c2a24; font-family:"Nanum Myeongjo", Batang, serif; }
.es-iv-row { font-size:.9em; line-height:1.7; margin:8px 0; }
.es-iv-row.q { font-weight:700; color:#33302a; }
.es-iv-row.a { color:#5a544a; padding-left:1.2em; }
.es-iv-row b { margin-right:.3em; }
.es-iv-note { font-size:.82em; color:#9a9488; font-style:italic; text-align:center; margin:6px 0; }
`;
