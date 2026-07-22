// ── 추가 구조형 위젯 (3차) ──
const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');
const lines = t => t.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
const wtext = (key, label, def, ph) => ({ key, label, type: 'text', def, placeholder: ph });
const wselect = (key, label, def, choices) => ({ key, label, type: 'select', def, choices });

export const EXTRA_WIDGETS2 = {
  ranking: {
    rule: '「이름 점수」처럼 한 줄씩 쓰면 순위표가 돼요. 1~3위에 금·은·동 표시가 붙어요.',
    options: [wtext('title', '보드 제목', '헌터 랭킹')],
    render(src, o) {
      const medal = ['gold', 'silver', 'bronze'];
      const rows = lines(src).map((l, i) => {
        const m = /^(.+?)\s+(\S+)$/.exec(l);
        return `<div class="es-rk-row${i < 3 ? ' ' + medal[i] : ''}"><span class="es-rk-n">${i + 1}</span>`
          + `<span class="es-rk-name">${esc(m ? m[1] : l)}</span><b>${esc(m ? m[2] : '')}</b></div>`;
      }).join('');
      return `<div class="es-w-ranking"><div class="es-rk-head">${esc(o.title || 'RANKING')}</div>${rows}</div>`;
    },
  },
  boardingpass: {
    rule: '「항목: 값」 형식으로 한 줄씩. (예: 이름: 김하늘 / 출발: 서울 / 도착: 제주)',
    options: [wtext('flight', '편명', 'KE 1203'), wtext('gate', '탑승구', '17'), wtext('seat', '좌석', '23A')],
    render(src, o) {
      const rows = lines(src).map(l => {
        const m = /^([^:：]+)[:：]\s*(.+)$/.exec(l);
        return m ? `<div class="es-bp-row"><span>${esc(m[1].trim())}</span><b>${esc(m[2])}</b></div>`
          : `<div class="es-bp-row"><b>${esc(l)}</b></div>`;
      }).join('');
      return `<div class="es-w-boardingpass"><div class="es-bp-main"><div class="es-bp-head">BOARDING PASS`
        + `<b>${esc(o.flight || '')}</b></div>${rows}<div class="es-bp-barcode"></div></div>`
        + `<div class="es-bp-stub"><div class="es-bp-row"><span>GATE</span><b>${esc(o.gate || '')}</b></div>`
        + `<div class="es-bp-row"><span>SEAT</span><b>${esc(o.seat || '')}</b></div></div></div>`;
    },
  },
  instastory: {
    rule: '첫 줄이 계정 이름, 나머지 줄이 스토리에 올린 글이 돼요.',
    options: [wtext('time', '올린 시각', '3시간 전')],
    render(src, o) {
      const ls = lines(src);
      const user = ls.shift() || 'user';
      return `<div class="es-w-instastory"><div class="es-is-bar"><i></i></div>`
        + `<div class="es-is-head"><span class="es-is-ava">${esc(user.slice(0, 1).toUpperCase())}</span>`
        + `<b>${esc(user)}</b><span class="es-is-time">${esc(o.time || '')}</span></div>`
        + `<div class="es-is-body">${ls.map(esc).join('<br/>')}</div>`
        + `<div class="es-is-reply">메시지 보내기…<span>♡ ✈</span></div></div>`;
    },
  },
  anonpost: {
    rule: '첫 줄이 글 제목, 나머지 줄이 본문이 돼요.',
    options: [wtext('board', '게시판 이름', '자유 라운지'), wtext('likes', '공감 수', '84'), wtext('cmts', '댓글 수', '23')],
    render(src, o) {
      const ls = lines(src);
      const title = ls.shift() || '';
      return `<div class="es-w-anonpost"><div class="es-ap2-board">${esc(o.board || '')}</div>`
        + `<div class="es-ap2-title">${esc(title)}</div>`
        + `<div class="es-ap2-body">${ls.map(esc).join('<br/>')}</div>`
        + `<div class="es-ap2-foot"><span class="es-ap2-anon">익명</span>공감 ${esc(o.likes || '0')} · 댓글 ${esc(o.cmts || '0')}</div></div>`;
    },
  },
  bubblemsg: {
    rule: '첫 줄이 아티스트 이름, 나머지 줄이 버블 메시지가 돼요.',
    options: [wtext('date', '날짜 표시', '오늘')],
    render(src, o) {
      const ls = lines(src);
      const name = ls.shift() || '';
      const rows = ls.map(t => `<div class="es-bb-row"><span class="es-bb-bubble">${esc(t)}</span></div>`).join('');
      return `<div class="es-w-bubblemsg">${o.date ? `<div class="es-bb-date">${esc(o.date)}</div>` : ''}`
        + `<div class="es-bb-head"><span class="es-bb-ava">${esc(name.slice(0, 1))}</span><b>${esc(name)}</b> 💌</div>${rows}</div>`;
    },
  },
  mapapp: {
    rule: '첫 줄이 목적지 이름, 둘째 줄이 주소나 설명이 돼요.',
    options: [wtext('eta', '도착 정보', '도보 12분 · 850m')],
    render(src, o) {
      const ls = lines(src);
      const dest = ls.shift() || '';
      return `<div class="es-w-mapapp"><div class="es-mp-map"><span class="es-mp-pin">📍</span></div>`
        + `<div class="es-mp-card"><div class="es-mp-dest">${esc(dest)}</div>`
        + (ls.length ? `<div class="es-mp-addr">${esc(ls.join(' '))}</div>` : '')
        + `<div class="es-mp-eta">${esc(o.eta || '')}</div></div></div>`;
    },
  },
  delivery: {
    rule: '첫 줄이 가게 이름, 나머지 줄이 주문 내역이 돼요. 진행 단계는 아래에서 골라요.',
    options: [wselect('step', '현재 단계', '2', [
      { value: '0', label: '주문 접수' }, { value: '1', label: '조리중' },
      { value: '2', label: '배달중' }, { value: '3', label: '배달 완료' }]),
      wtext('eta', '도착 예정', '약 15분 후 도착')],
    render(src, o) {
      const ls = lines(src);
      const store = ls.shift() || '';
      const steps = ['주문 접수', '조리중', '배달중', '배달 완료'];
      const cur = Math.min(3, Math.max(0, +o.step || 0));
      const stepHtml = steps.map((s, i) =>
        `<span class="es-dl-step${i <= cur ? ' on' : ''}${i === cur ? ' cur' : ''}">${s}</span>`).join('<i></i>');
      return `<div class="es-w-delivery"><div class="es-dl-store">${esc(store)}</div>`
        + `<div class="es-dl-steps">${stepHtml}</div>`
        + `<div class="es-dl-eta">${esc(o.eta || '')}</div>`
        + (ls.length ? `<div class="es-dl-items">${ls.map(esc).join('<br/>')}</div>` : '') + `</div>`;
    },
  },
  translator: {
    rule: '첫 줄이 원문, 둘째 줄이 번역 결과가 돼요.',
    options: [wtext('from', '원문 언어', '고대어'), wtext('to', '번역 언어', '한국어')],
    render(src, o) {
      const ls = lines(src);
      return `<div class="es-w-translator"><div class="es-tr-pane"><div class="es-tr-lang">${esc(o.from || '')}</div>`
        + `<div class="es-tr-text">${esc(ls[0] || '')}</div></div>`
        + `<div class="es-tr-arrow">⇄</div>`
        + `<div class="es-tr-pane to"><div class="es-tr-lang">${esc(o.to || '')}</div>`
        + `<div class="es-tr-text">${esc(ls.slice(1).join(' '))}</div></div></div>`;
    },
  },
  interview: {
    rule: '「Q: 질문」「A: 답변」 형식으로 한 줄씩 쓰면 인터뷰 스크립트가 돼요.',
    options: [],
    render(src) {
      const rows = lines(src).map(l => {
        const m = /^([QAqa])\s*[:：.]\s*(.+)$/.exec(l);
        if (!m) return `<div class="es-iv-note">${esc(l)}</div>`;
        const isQ = m[1].toUpperCase() === 'Q';
        return `<div class="es-iv-row ${isQ ? 'q' : 'a'}"><b>${isQ ? 'Q.' : 'A.'}</b> ${esc(m[2])}</div>`;
      }).join('');
      return `<div class="es-w-interview">${rows}</div>`;
    },
  },
};

export const EXTRA_SAMPLES2 = {
  ranking: '검은 늑대 9,842,113\n백야 7,201,556\n이름없음 6,988,001\n김하늘 12',
  boardingpass: '이름: KIM HANEUL\n출발: SEOUL (GMP)\n도착: JEJU (CJU)\n탑승: 09:40',
  instastory: 'haneul_02\n마지막 스토리.\n찾지 마.',
  anonpost: '우리 회사에 이상한 사람이 있다\n분명 어제 퇴사했는데\n오늘 아침에도 자리에 앉아 있었다.',
  bubblemsg: '유하\n오늘 공연 와줘서 고마워\n맨 앞줄에 있던 거 다 봤어\n근데… 그 옆에 있던 사람 누구야?',
  mapapp: '폐쇄된 놀이공원\n경기도 ○○시 산 27-1',
  delivery: '한밤중 떡볶이\n로제 떡볶이 1\n튀김 모둠 1',
  translator: 'Vel korath un morh\n어둠이 그대의 이름을 안다',
  interview: 'Q: 그날 밤 무엇을 보셨나요?\nA: …말해도 믿지 않으실 겁니다.\nQ: 괜찮습니다. 천천히 말씀하세요.\nA: 그건, 사람이 아니었어요.',
};
