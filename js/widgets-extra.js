// ── 추가 구조형 위젯 (2차) ──
const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');
const lines = t => t.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
const wtext = (key, label, def, ph) => ({ key, label, type: 'text', def, placeholder: ph });
const wselect = (key, label, def, choices) => ({ key, label, type: 'select', def, choices });
const wfont = () => ({ key: 'font', label: '폰트', type: 'font', cssVar: '--es-font', def: '' });

function chat(t) {
  return lines(t).map(l => {
    const m = /^([^:：]{1,16})[:：]\s*(.+)$/.exec(l);
    if (!m) return { who: 'sys', text: l };
    return m[1].trim() === '나' ? { who: 'me', text: m[2] } : { who: 'other', name: m[1].trim(), text: m[2] };
  });
}

export const EXTRA_WIDGETS = {
  skillcard: {
    rule: '첫 줄이 스킬 이름, 나머지 줄이 스킬 설명이 돼요. 등급에 따라 테두리 색이 바뀌어요.',
    options: [wselect('grade', '등급', 'rare', [
      { value: 'common', label: '일반' }, { value: 'rare', label: '희귀' },
      { value: 'epic', label: '영웅' }, { value: 'legend', label: '전설' }]),
      wtext('cost', '소모/쿨타임', 'MP 30 · 쿨타임 12초')],
    render(src, o) {
      const ls = lines(src);
      const name = ls.shift() || '스킬';
      return `<div class="es-w-skillcard g-${esc(o.grade || 'rare')}"><div class="es-sk-name">${esc(name)}</div>`
        + (o.cost ? `<div class="es-sk-cost">${esc(o.cost)}</div>` : '')
        + `<div class="es-sk-desc">${ls.map(esc).join('<br/>')}</div></div>`;
    },
  },
  choices: {
    rule: '한 줄에 선택지 하나씩. 첫 줄 앞에 「Q:」를 붙이면 질문 문구가 돼요.',
    options: [],
    render(src) {
      const ls = lines(src);
      let q = '';
      if (/^[Qq][:：]/.test(ls[0] || '')) q = ls.shift().replace(/^[Qq][:：]\s*/, '');
      const items = ls.map((l, i) => `<div class="es-ch-item">▶ ${i + 1}. ${esc(l.replace(/^\d+[.)]\s*/, ''))}</div>`).join('');
      return `<div class="es-w-choices">${q ? `<div class="es-ch-q">${esc(q)}</div>` : ''}${items}</div>`;
    },
  },
  polaroid: {
    rule: '선택한 글이 사진 아래 손글씨 캡션이 돼요.',
    options: [wtext('photo', '사진 자리 문구', '(그날의 사진)'), wfont()],
    render(src, o) {
      return `<div class="es-w-polaroid"><div class="es-pl-photo">${esc(o.photo || '(사진)')}</div>`
        + `<div class="es-pl-caption">${esc(src)}</div></div>`;
    },
  },
  bizcard: {
    rule: '첫 줄이 이름, 둘째 줄이 직함, 나머지는 연락처로 작게 들어가요.',
    options: [wtext('company', '회사/소속', '')],
    render(src, o) {
      const ls = lines(src);
      const name = ls.shift() || '';
      const title = ls.shift() || '';
      return `<div class="es-w-bizcard">${o.company ? `<div class="es-bc-co">${esc(o.company)}</div>` : ''}`
        + `<div class="es-bc-name">${esc(name)}</div>`
        + (title ? `<div class="es-bc-title">${esc(title)}</div>` : '')
        + (ls.length ? `<div class="es-bc-contact">${ls.map(esc).join('<br/>')}</div>` : '') + `</div>`;
    },
  },
  medical: {
    rule: '「항목: 값」 형식으로 한 줄씩. (예: 성명: 김하늘 / 병명: 급성 기억상실)',
    options: [wtext('hospital', '병원 이름', '성심종합병원'), wtext('doctor', '의사 이름', '')],
    render(src, o) {
      const rows = lines(src).map(l => {
        const m = /^([^:：]+)[:：]\s*(.+)$/.exec(l);
        return m ? `<div class="es-md-row"><span class="es-md-key">${esc(m[1].trim())}</span>${esc(m[2])}</div>`
          : `<div class="es-md-row">${esc(l)}</div>`;
      }).join('');
      return `<div class="es-w-medical"><div class="es-md-title">진 단 서</div>${rows}`
        + `<div class="es-md-foot">${esc(o.hospital || '')}${o.doctor ? ` · 담당의 ${esc(o.doctor)}` : ''}<span class="es-md-stamp">印</span></div></div>`;
    },
  },
  gradecard: {
    rule: '「과목 점수」처럼 한 줄씩 쓰면 성적표 표가 돼요.',
    options: [wtext('name', '이름', ''), wtext('term', '학기', '1학기 기말고사')],
    render(src, o) {
      const rows = lines(src).map(l => {
        const m = /^(.+?)\s+(\S+)$/.exec(l);
        return `<div class="es-gc-row"><span>${esc(m ? m[1] : l)}</span><b>${esc(m ? m[2] : '')}</b></div>`;
      }).join('');
      return `<div class="es-w-gradecard"><div class="es-gc-head">성 적 표</div>`
        + `<div class="es-gc-meta">${esc(o.term || '')}${o.name ? ` · ${esc(o.name)}` : ''}</div>${rows}</div>`;
    },
  },
  banking: {
    rule: '「내용 금액」처럼 한 줄씩. 금액 앞에 +는 입금(파랑), -는 출금(빨강)으로 표시돼요.',
    options: [wtext('bank', '은행/서비스 이름', '한빛은행'), wtext('balance', '잔액', '')],
    render(src, o) {
      const rows = lines(src).map(l => {
        const m = /^(.+?)\s+([+-]?[\d,]+원?)$/.exec(l);
        const item = m ? m[1] : l, amt = m ? m[2] : '';
        const cls = amt.startsWith('+') ? ' in' : amt.startsWith('-') ? ' out' : '';
        return `<div class="es-bk-row"><span>${esc(item)}</span><b class="es-bk-amt${cls}">${esc(amt)}</b></div>`;
      }).join('');
      return `<div class="es-w-banking"><div class="es-bk-head">${esc(o.bank || '거래 내역')}</div>${rows}`
        + (o.balance ? `<div class="es-bk-bal">잔액 ${esc(o.balance)}</div>` : '') + `</div>`;
    },
  },
  parcel: {
    rule: '「항목: 값」 형식으로 한 줄씩. (예: 받는분: 김하늘 / 보내는분: 익명)',
    options: [wtext('trackno', '운송장 번호', '6841-2299-0173')],
    render(src, o) {
      const rows = lines(src).map(l => {
        const m = /^([^:：]+)[:：]\s*(.+)$/.exec(l);
        return m ? `<div class="es-pc-row"><span class="es-pc-key">${esc(m[1].trim())}</span>${esc(m[2])}</div>`
          : `<div class="es-pc-row">${esc(l)}</div>`;
      }).join('');
      return `<div class="es-w-parcel"><div class="es-pc-head">택배 운송장 <b>${esc(o.trackno || '')}</b></div>${rows}`
        + `<div class="es-pc-barcode"></div></div>`;
    },
  },
  dictionary: {
    rule: '첫 줄이 표제어, 「[발음]」으로 시작하는 줄은 발음, 나머지 줄은 뜻풀이가 돼요.',
    options: [wtext('pos', '품사', '명사')],
    render(src, o) {
      const ls = lines(src);
      const word = ls.shift() || '';
      let pron = '';
      if (/^\[.*\]$/.test(ls[0] || '')) pron = ls.shift();
      const defs = ls.map((l, i) => `<div class="es-dc-def"><b>${i + 1}.</b> ${esc(l)}</div>`).join('');
      return `<div class="es-w-dictionary"><span class="es-dc-word">${esc(word)}</span>`
        + (pron ? ` <span class="es-dc-pron">${esc(pron)}</span>` : '')
        + (o.pos ? ` <span class="es-dc-pos">${esc(o.pos)}</span>` : '') + defs + `</div>`;
    },
  },
  lockscreen: {
    rule: '「앱이름: 내용」 형식으로 한 줄씩 쓰면 잠금화면 알림으로 쌓여요.',
    options: [wtext('time', '시각', '23:47'), wtext('date', '날짜', '7월 18일 금요일')],
    render(src, o) {
      const rows = chat(src).map(it => {
        const app = it.who === 'sys' ? '알림' : (it.who === 'me' ? '나' : it.name);
        return `<div class="es-ls-card"><div class="es-ls-app">${esc(app)}</div><div class="es-ls-msg">${esc(it.text)}</div></div>`;
      }).join('');
      return `<div class="es-w-lockscreen"><div class="es-ls-time">${esc(o.time || '')}</div>`
        + `<div class="es-ls-date">${esc(o.date || '')}</div>${rows}</div>`;
    },
  },
  youtube: {
    rule: '첫 줄이 영상 제목, 「이름: 내용」 줄은 댓글로 붙어요.',
    options: [wtext('channel', '채널 이름', '미스터리극장'), wtext('views', '조회수', '조회수 182만회 · 3일 전')],
    render(src, o) {
      const ls = lines(src);
      const title = ls.shift() || '';
      const cmts = ls.map(l => {
        const m = /^([^:：]{1,16})[:：]\s*(.+)$/.exec(l);
        return m ? `<div class="es-yt-cmt"><b>@${esc(m[1].trim())}</b> ${esc(m[2])}</div>` : `<div class="es-yt-cmt">${esc(l)}</div>`;
      }).join('');
      return `<div class="es-w-youtube"><div class="es-yt-video">▶</div>`
        + `<div class="es-yt-title">${esc(title)}</div>`
        + `<div class="es-yt-meta">${esc(o.channel || '')} · ${esc(o.views || '')}</div>${cmts}</div>`;
    },
  },
  discord: {
    rule: '「이름: 내용」 형식으로 한 줄씩 쓰면 서버 채팅이 돼요.',
    options: [wtext('channel', '채널 이름', '일반')],
    render(src, o) {
      const palette = ['#f47fff', '#7fdbca', '#ffd97f', '#8ab4ff', '#ff8b8b'];
      const cIdx = n => [...n].reduce((a, c) => a + c.codePointAt(0), 0) % palette.length;
      const rows = chat(src).map(it => {
        const nick = it.who === 'me' ? '나' : (it.name || '');
        if (it.who === 'sys') return `<div class="es-dc2-sys">${esc(it.text)}</div>`;
        return `<div class="es-dc2-row"><span class="es-dc2-ava" style="background:${palette[cIdx(nick)]}">${esc(nick.slice(0, 1))}</span>`
          + `<span class="es-dc2-nick" style="color:${palette[cIdx(nick)]}">${esc(nick)}</span> ${esc(it.text)}</div>`;
      }).join('');
      return `<div class="es-w-discord"><div class="es-dc2-head"># ${esc(o.channel || '일반')}</div>${rows}</div>`;
    },
  },
  vote: {
    rule: '첫 줄이 질문, 이후 「항목 (+표수)」 형식으로 한 줄씩 쓰면 투표 게이지가 돼요.',
    options: [],
    render(src) {
      const ls = lines(src);
      const q = ls.shift() || '투표';
      const items = ls.map(l => {
        const m = /^(.+?)(?:\s*\(\+?(\d+)\))?$/.exec(l);
        return { label: m[1], n: +(m[2] || 0) };
      });
      const max = Math.max(1, ...items.map(i => i.n));
      const total = items.reduce((a, i) => a + i.n, 0);
      const rows = items.map(i =>
        `<div class="es-vt-item${i.n === max && i.n > 0 ? ' top' : ''}"><span class="es-vt-bar" style="width:${Math.round(i.n / max * 100)}%"></span>`
        + `<span class="es-vt-label">${esc(i.label)}</span><span class="es-vt-n">${i.n}</span></div>`).join('');
      return `<div class="es-w-vote"><div class="es-vt-q">${esc(q)}</div>${rows}<div class="es-vt-total">${total}명 참여</div></div>`;
    },
  },
  musicplayer: {
    rule: '첫 줄이 곡 제목, 둘째 줄이 가수 이름이 돼요.',
    options: [wtext('cur', '현재 시간', '2:14'), wtext('len', '전체 길이', '3:42')],
    render(src, o) {
      const ls = lines(src);
      const title = ls.shift() || '';
      const artist = ls.shift() || '';
      const pct = (() => {
        const t = x => { const m = /^(\d+):(\d+)$/.exec(x || ''); return m ? +m[1] * 60 + +m[2] : 0; };
        const c = t(o.cur), l = t(o.len);
        return l ? Math.min(100, Math.round(c / l * 100)) : 40;
      })();
      return `<div class="es-w-music"><div class="es-mu-art">♪</div><div class="es-mu-info">`
        + `<div class="es-mu-title">${esc(title)}</div><div class="es-mu-artist">${esc(artist)}</div>`
        + `<div class="es-mu-bar"><i style="width:${pct}%"></i></div>`
        + `<div class="es-mu-time"><span>${esc(o.cur || '')}</span><span>${esc(o.len || '')}</span></div>`
        + `<div class="es-mu-ctrl">⏮ ⏸ ⏭</div></div></div>`;
    },
  },
  videocall: {
    rule: '첫 줄이 상대 이름, 둘째 줄은 통화 시간 등 부가 정보가 돼요.',
    options: [],
    render(src) {
      const ls = lines(src);
      const name = ls.shift() || '';
      return `<div class="es-w-videocall"><div class="es-vc-main"><div class="es-vc-ava">${esc(name.slice(0, 1))}</div>`
        + `<div class="es-vc-name">${esc(name)}</div><div class="es-vc-sub">${esc(ls.join(' '))}</div></div>`
        + `<div class="es-vc-self">나</div>`
        + `<div class="es-vc-btns"><span class="mute">🎤</span><span class="end">✕</span><span class="cam">📷</span></div></div>`;
    },
  },
  market: {
    rule: '첫 줄이 매물 이름, 둘째 줄이 가격, 이후 「이름: 대사」「나: 대사」는 흥정 채팅이 돼요.',
    options: [wtext('status', '거래 상태', '판매중')],
    render(src, o) {
      const ls = lines(src);
      const item = ls.shift() || '';
      const price = ls.shift() || '';
      const rows = chat(ls.join('\n')).map(it => {
        if (it.who === 'sys') return `<div class="es-mk-sys">${esc(it.text)}</div>`;
        return `<div class="es-mk-row${it.who === 'me' ? ' me' : ''}"><span class="es-mk-bubble">${esc(it.text)}</span></div>`;
      }).join('');
      return `<div class="es-w-market"><div class="es-mk-item"><span class="es-mk-thumb">📦</span>`
        + `<span><div class="es-mk-name">${esc(item)}</div><div class="es-mk-price">${esc(price)}`
        + `${o.status ? ` <i>${esc(o.status)}</i>` : ''}</div></span></div>${rows}</div>`;
    },
  },
};

export const EXTRA_SAMPLES = {
  skillcard: '섬광 베기\n전방의 적을 빛의 속도로 벤다.\n치명타 확률 +40%',
  choices: 'Q: 문 너머에서 소리가 들린다.\n조용히 문을 연다\n뒤도 안 보고 도망친다\n소리를 지른다',
  polaroid: '우리가 마지막으로 웃었던 날',
  bizcard: '한지원\n수석 헌터 · A급\n010-0000-0000\nhunter@assn.kr',
  medical: '성명: 김하늘\n병명: 급성 기억상실\n소견: 최근 3개월의 기억이 소실됨\n안정이 필요함',
  gradecard: '국어 98\n수학 72\n마법학 100\n체술 45',
  banking: '김하늘 +500,000\n편의점 -4,500\n알 수 없는 입금 +99,999,999',
  parcel: '받는분: 김하늘\n보내는분: 익명\n내용물: 열지 마시오',
  dictionary: '회귀\n[회귀/回歸]\n한 바퀴 돌아 제자리로 돌아옴\n죽기 전 시점으로 되돌아가는 일',
  lockscreen: '엄마: 어디야 전화 좀 받아\n은행: [입금] 99,999,999원\n모르는번호: 지금 창밖을 봐',
  youtube: '폐교에서 하룻밤 (진짜 나옴)\n구독자A: 3:42 뒤에 뭐 지나감\n구독자B: 이거 보고 소름돋아서 바로 껐다',
  discord: '레이드장: 오늘 밤 10시 집결\n힐러: 저 오늘 못 가요\n나: 대타 구해옴',
  vote: '오늘 밤 습격, 갈 사람?\n간다 (+12)\n미쳤냐 (+3)\n구경만 (+7)',
  musicplayer: '밤의 끝을 걷는 법\n달빛소년단',
  videocall: '할머니\n통화 시간 00:47',
  market: '한정판 마법서 (미개봉)\n120,000원\n구매자: 혹시 네고 되나요?\n나: 칼답 주시면 만원 빼드림',
};
