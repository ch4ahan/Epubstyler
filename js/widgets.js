// ── 구조형 위젯: 선택한 텍스트를 순수 정적 HTML+CSS 구조로 변환 ──
// 모든 위젯은 JS 없이 성립한다(EPUB 뷰어 다수가 JS 미실행).
// 원문은 data-es-original 에 보관되어 "효과 제거" 시 완전 복원된다.

const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const lines = t => t.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

/** "이름: 대사" 파싱. "나:"는 내 말풍선. 콜론 없는 줄은 시스템/나레이션 */
function parseChat(t) {
  return lines(t).map(line => {
    const m = /^([^:：]{1,16})[:：]\s*(.+)$/.exec(line);
    if (!m) return { who: 'sys', text: line };
    const name = m[1].trim();
    if (name === '나') return { who: 'me', text: m[2] };
    return { who: 'other', name, text: m[2] };
  });
}

const wtext = (key, label, def, ph) => ({ key, label, type: 'text', def, placeholder: ph });
const wcheck = (key, label, def) => ({ key, label, type: 'check', def });
const wselect = (key, label, def, choices) => ({ key, label, type: 'select', def, choices });
const wfont = () => ({ key: 'font', label: '폰트', type: 'font', cssVar: '--es-font', def: '' });

function chatRows(items, opts, kakao) {
  let html = '';
  let prevName = null;
  for (const it of items) {
    if (it.who === 'sys') { html += `<div class="es-k-sys"><span>${esc(it.text)}</span></div>`; prevName = null; continue; }
    const meta = `<span class="es-k-meta">${opts.unread && it.who === 'me' ? '<span class="unread">1</span>' : ''}${opts.time ? esc(opts.time) : ''}</span>`;
    if (it.who === 'me') {
      html += `<div class="es-k-row me">${meta}<span class="es-k-bubble">${esc(it.text)}</span></div>`;
      prevName = null;
    } else {
      const showName = it.name !== prevName;
      prevName = it.name;
      html += `<div class="es-k-row">`
        + (kakao && showName ? `<span class="es-k-ava">${esc(it.name.slice(0, 1))}</span>` : (kakao ? `<span class="es-k-ava" style="visibility:hidden">.</span>` : ''))
        + (showName ? `<span class="es-k-name">${esc(it.name)}</span>` : '')
        + `<span class="es-k-bubble">${esc(it.text)}</span>${meta}</div>`;
    }
  }
  return html;
}

export const WIDGETS = {
  kakao: {
    rule: '한 줄에 한 마디씩. 「이름: 대사」는 상대방, 「나: 대사」는 내 말풍선(노랑), 콜론 없는 줄은 가운데 안내문이 돼요.',
    options: [wtext('title', '대화방 이름', ''), wtext('time', '시간 표시', '오후 11:23'), wcheck('unread', '안읽음 "1" 표시', true)],
    render(src, o) {
      const items = parseChat(src);
      return `<div class="es-w-kakao">${o.title ? `<div class="es-k-title">${esc(o.title)}</div>` : ''}${chatRows(items, o, true)}</div>`;
    },
  },
  sms: {
    rule: '「이름: 내용」「나: 내용」 형식. 스타일(iOS/안드로이드)은 아래에서 고를 수 있어요.',
    options: [wselect('style', '스타일', 'ios', [{ value: 'ios', label: 'iOS' }, { value: 'android', label: '안드로이드' }]), wtext('time', '시간 표시', '')],
    render(src, o) {
      const items = parseChat(src);
      return `<div class="es-w-sms${o.style === 'android' ? ' android' : ''}">${chatRows(items, o, false)}</div>`;
    },
  },
  statwin: {
    rule: '「항목: 값」 형식. 「HP: 30/100」처럼 「현재/최대」로 쓰면 게이지 바가 생겨요.',
    options: [wtext('title', '창 제목', 'STATUS')],
    render(src, o) {
      let rows = '';
      for (const line of lines(src)) {
        const m = /^([^:：]+)[:：]\s*(.+)$/.exec(line);
        if (!m) { rows += `<div class="es-s-row"><span class="es-s-key">${esc(line)}</span></div>`; continue; }
        const key = m[1].trim(), val = m[2].trim();
        const g = /^(\d+)\s*\/\s*(\d+)$/.exec(val);
        rows += `<div class="es-s-row"><span class="es-s-key">${esc(key)}</span><span class="es-s-val">${esc(val)}</span>`;
        if (g) {
          const pct = Math.max(0, Math.min(100, Math.round(+g[1] / +g[2] * 100)));
          const cls = /^hp|체력/i.test(key) ? ' hp' : /^mp|마나|정신/i.test(key) ? ' mp' : '';
          rows += `<span class="es-s-gauge${cls}"><i style="width:${pct}%"></i></span>`;
        }
        rows += `</div>`;
      }
      return `<div class="es-w-statwin"><div class="es-s-head">${esc(o.title || 'STATUS')}</div><div class="es-s-body">${rows}</div></div>`;
    },
  },
  quest: {
    rule: '첫 줄은 퀘스트 제목, 「-」로 시작하는 줄은 목표, 「보상:」으로 시작하는 줄은 보상이 돼요.',
    options: [],
    render(src) {
      const ls = lines(src);
      const title = ls.shift() || '퀘스트';
      let objs = '', reward = '';
      for (const l of ls) {
        const r = /^보상\s*[:：]\s*(.+)$/.exec(l);
        if (r) { reward = r[1]; continue; }
        objs += `<div class="es-q-obj">${esc(l.replace(/^[-•]\s*/, ''))}</div>`;
      }
      return `<div class="es-w-quest"><div class="es-q-head">${esc(title)}</div><div class="es-q-body">${objs}${reward ? `<div class="es-q-reward">${esc(reward)}</div>` : ''}</div></div>`;
    },
  },
  idcard: {
    rule: '「항목: 값」 형식으로 한 줄씩. 「이름」 항목은 크게 표시돼요. (예: 이름: 김하늘 / 학번: 20241234)',
    options: [wtext('org', '발급기관', '제국 아카데미'), wcheck('barcode', '바코드 표시', true)],
    render(src, o) {
      let name = '', rows = '';
      for (const line of lines(src)) {
        const m = /^([^:：]+)[:：]\s*(.+)$/.exec(line);
        if (!m) { rows += `<div class="es-id-row">${esc(line)}</div>`; continue; }
        const k = m[1].trim(), v = m[2].trim();
        if (!name && /^(이름|성명)$/.test(k)) { name = v; continue; }
        rows += `<div class="es-id-row"><span class="es-id-key">${esc(k)}</span>${esc(v)}</div>`;
      }
      return `<div class="es-w-idcard"><div class="es-id-org">${esc(o.org || '')}</div>`
        + `<span class="es-id-photo">PHOTO</span><div class="es-id-rows">`
        + (name ? `<div class="es-id-name">${esc(name)}</div>` : '') + rows + `</div>`
        + (o.barcode ? `<div class="es-id-barcode"></div>` : '') + `</div>`;
    },
  },
  newspaper: {
    rule: '첫 줄이 헤드라인, 나머지가 기사 본문이 돼요.',
    options: [wtext('paper', '신문 이름', '제국일보'), wtext('date', '날짜', '')],
    render(src, o) {
      const ls = lines(src);
      const headline = ls.shift() || '';
      return `<div class="es-w-newspaper"><div class="es-n-paper">${esc(o.paper || '')}</div>`
        + (o.date ? `<div class="es-n-date">${esc(o.date)}</div>` : '')
        + `<div class="es-n-headline">${esc(headline)}</div>`
        + `<div class="es-n-body">${ls.map(esc).join('<br/>')}</div></div>`;
    },
  },
  letter: {
    rule: '선택한 글 전체가 편지지 위에 놓여요. 손글씨 느낌 폰트를 함께 고르면 더 좋아요.',
    options: [wfont()],
    render(src) { return `<div class="es-w-letter">${esc(src)}</div>`; },
  },
  postit: {
    rule: '선택한 글 전체가 쪽지에 담겨요.',
    options: [wfont()],
    render(src) { return `<div class="es-w-postit">${esc(src)}</div>`; },
  },
  receipt: {
    rule: '「품목 금액」처럼 한 줄씩 쓰면 표로 정리돼요. 마지막 줄에 「합계 금액」을 쓰면 굵게 표시돼요.',
    options: [wtext('store', '가게 이름', ''), wtext('foot', '하단 문구', '이용해 주셔서 감사합니다')],
    render(src, o) {
      let rows = '', total = '';
      for (const line of lines(src)) {
        const m = /^(.+?)\s+([\d,]+원?)$/.exec(line);
        const item = m ? m[1] : line, price = m ? m[2] : '';
        const row = `<div class="es-r-row"><span class="es-r-item">${esc(item)}</span><span class="es-r-price">${esc(price)}</span></div>`;
        if (/^(합계|총액|total)/i.test(item)) total = `<div class="es-r-total">${row}</div>`;
        else rows += row;
      }
      return `<div class="es-w-receipt">${o.store ? `<div class="es-r-head">${esc(o.store)}</div>` : ''}${rows}${total}`
        + (o.foot ? `<div class="es-r-foot">${esc(o.foot)}</div>` : '') + `</div>`;
    },
  },
  contractdoc: {
    rule: '첫 줄이 계약서 제목, 나머지 줄이 조항이 돼요. 조항 번호(제1조…)는 자동으로 붙어요.',
    options: [wtext('sign', '서명', '갑: ______ (인)   을: ______'), wtext('stamp', '도장 글자', '印')],
    render(src, o) {
      const ls = lines(src);
      const title = ls.shift() || '계 약 서';
      const clauses = ls.map((l, i) => {
        const numbered = /^제?\s*\d+\s*[조항]/.test(l);
        return `<div class="es-cd-clause">${numbered ? '' : `제${i + 1}조 `}${esc(l)}</div>`;
      }).join('');
      return `<div class="es-w-contractdoc"><div class="es-cd-title">${esc(title)}</div>${clauses}`
        + `<div class="es-cd-sign">${esc(o.sign || '')}<span class="es-cd-stamp">${esc(o.stamp || '印')}</span></div></div>`;
    },
  },
  insta: {
    rule: '첫 줄이 계정 이름, 다음 줄이 캡션이 돼요. 「이름: 내용」 형식 줄은 댓글로 붙어요.',
    options: [wtext('likes', '좋아요 수', '1,024'), wtext('photo', '사진 자리 문구', '(사진)')],
    render(src, o) {
      const ls = lines(src);
      const user = ls.shift() || 'user';
      let caption = '', cmts = '';
      for (const l of ls) {
        const m = /^([^:：]{1,16})[:：]\s*(.+)$/.exec(l);
        if (m && caption) cmts += `<div class="es-i-cmt"><b>${esc(m[1])}</b>${esc(m[2])}</div>`;
        else caption += (caption ? '<br/>' : '') + esc(l);
      }
      return `<div class="es-w-insta"><div class="es-i-head"><span class="es-i-ava">${esc(user.slice(0, 1).toUpperCase())}</span>${esc(user)}</div>`
        + `<div class="es-i-photo">${esc(o.photo || '(사진)')}</div>`
        + `<div class="es-i-actions">♥ 💬 ✈</div>`
        + (o.likes ? `<div class="es-i-likes">좋아요 ${esc(o.likes)}개</div>` : '')
        + `<div class="es-i-caption"><b>${esc(user)}</b>${caption}</div>${cmts}</div>`;
    },
  },
  tweet: {
    rule: '첫 줄에 「이름 @아이디」, 나머지 줄이 본문이 돼요.',
    options: [wtext('rt', '리트윗 수', '482'), wtext('likes', '마음 수', '1.2만')],
    render(src, o) {
      const ls = lines(src);
      const first = ls.shift() || '';
      const m = /^(.*?)\s*(@\S+)?$/.exec(first);
      const name = (m?.[1] || '익명').trim() || '익명';
      const handle = m?.[2] || '@' + name.replace(/\s+/g, '_');
      return `<div class="es-w-tweet"><div class="es-t-head"><span class="es-t-ava">${esc(name.slice(0, 1))}</span>`
        + `<div><div class="es-t-name">${esc(name)}</div><div class="es-t-handle">${esc(handle)}</div></div></div>`
        + `<div class="es-t-body">${ls.map(esc).join('\n')}</div>`
        + `<div class="es-t-stats"><b>${esc(o.rt || '0')}</b> 재게시 &nbsp;&nbsp; <b>${esc(o.likes || '0')}</b> 마음에 들어요</div></div>`;
    },
  },
  comments: {
    rule: '「닉네임: 내용 (+추천수)」 형식. 줄 앞에 「ㄴ」을 붙이면 대댓글이 돼요. 추천수가 가장 높은 댓글에 BEST가 붙어요.',
    options: [wtext('title', '게시판 이름', '자유게시판')],
    render(src, o) {
      const items = lines(src).map(line => {
        const reply = /^[ㄴL>]\s*/.test(line);
        const body = line.replace(/^[ㄴL>]\s*/, '');
        const m = /^([^:：]{1,16})[:：]\s*(.+?)(?:\s*\(\+(\d+)\))?$/.exec(body);
        if (!m) return { reply, nick: '익명', text: body, vote: 0 };
        return { reply, nick: m[1].trim(), text: m[2], vote: +(m[3] || 0) };
      });
      const maxVote = Math.max(0, ...items.filter(i => !i.reply).map(i => i.vote));
      const rows = items.map(i =>
        `<div class="es-c-item${i.reply ? ' reply' : ''}">`
        + (!i.reply && i.vote > 0 && i.vote === maxVote ? '<span class="es-c-best">BEST</span>' : '')
        + `<span class="es-c-nick">${esc(i.nick)}</span>${esc(i.text)}`
        + (i.vote ? `<span class="es-c-vote">▲ ${i.vote}</span>` : '') + `</div>`).join('');
      return `<div class="es-w-comments"><div class="es-c-head">${esc(o.title || '댓글')} <span style="color:#888;font-weight:400">[${items.length}]</span></div>${rows}</div>`;
    },
  },
  livechat: {
    rule: '「닉네임: 내용」 형식으로 한 줄씩. 닉네임마다 다른 색이 자동으로 입혀져요.',
    options: [],
    render(src) {
      const palette = ['#ff8a80', '#80d8ff', '#ffd180', '#b9f6ca', '#ea80fc', '#8c9eff', '#ffff8d'];
      const colorOf = n => palette[[...n].reduce((a, c) => a + c.codePointAt(0), 0) % palette.length];
      const rows = parseChat(src).map(it => {
        const nick = it.who === 'me' ? '나' : (it.name || '');
        if (it.who === 'sys') return `<div class="es-l-row" style="color:#9aa">${esc(it.text)}</div>`;
        return `<div class="es-l-row"><span class="es-l-nick" style="color:${colorOf(nick)}">${esc(nick)}</span>${esc(it.text)}</div>`;
      }).join('');
      return `<div class="es-w-livechat">${rows}</div>`;
    },
  },
};

export const widgetSample = {
  kakao: '수아: 야 너 그 소문 들었어?\n나: 무슨 소문\n수아: 3반에 전학생 온대\n나: 헐',
  sms: '엄마: 밥은 먹었니\n나: 지금 먹으러 가요',
  statwin: '이름: 김도윤\n레벨: 17\nHP: 42/100\nMP: 88/100\n근력: 24',
  quest: '메인 퀘스트 — 잃어버린 검\n- 폐광 입구를 조사한다\n- 그림자 늑대 5마리 처치\n보상: 경험치 1,200 / 은화 40',
  idcard: '이름: 김하늘\n학번: 20241234\n소속: 2학년 3반\n생년월일: 2008. 3. 14.',
  newspaper: '왕세자, 어젯밤 궁에서 사라지다\n왕실 근위대는 어젯밤 자정 무렵 왕세자가 침전에서 사라졌다고 밝혔다.\n목격자들은 검은 마차가 북문을 빠져나갔다고 증언했다.',
  letter: '너에게.\n이 편지가 닿을 때쯤이면 나는 아마 먼 곳에 있을 거야.\n부디 나를 찾지 말아줘.',
  postit: '냉장고에 밥 있음.\n데워 먹어.\n— 엄마가',
  receipt: '아메리카노 4,500\n치즈케이크 6,800\n합계 11,300',
  contractdoc: '영혼 양도 계약서\n갑은 을에게 소원 하나를 이행한다.\n을은 대가로 수명 10년을 지불한다.\n본 계약은 파기할 수 없다.',
  insta: 'haneul_02\n오늘의 하늘. 내일도 맑았으면.\n민지: 사진 미쳤다\n준호: 어디야 여기??',
  tweet: '목격자A @witness_00\n방금 시청역에서 이상한 거 봤는데 나만 본 거 아니지?\n사진 있는 사람 DM 좀',
  comments: '익게이1: 이거 실화냐 (+128)\nㄴ 익게이2: ㄹㅇ 소름돋음\n익게이3: 주작같은데 (+42)',
  livechat: '별사탕: 아 이 부분 진짜 무서움\n달빛토끼: 뒤에 뭐 지나가지 않았음?\n야광별: 님들 그거 봤어요??',
};
