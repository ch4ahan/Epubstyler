// ── EPUB 스타일러: 앱 본체 ──
import { EpubBook, resolvePath, dirOf } from './epub.js';
import { CATEGORIES, PRESETS, presetById, compatBadge, BASE_CSS } from './presets.js';
import { WIDGETS, widgetSample } from './widgets.js';
import { FONT_CATALOG, downloadCatalogFont, fontFromFile, fontFaceCss } from './fonts.js';

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const uid = () => Math.random().toString(36).slice(2, 8);

const BLOCK_SEL = 'p, h1, h2, h3, h4, h5, h6, li, blockquote, pre, dd, dt, td, th, figcaption, div, section, article';
const DARK_CARDS = new Set(['sysbox', 'levelup', 'hologram', 'terminal', 'magiccontract', 'bloodbox',
  'vignette', 'neon', 'glitch', 'statwin', 'quest', 'livechat', 'flicker', 'shinytitle',
  'warnbox', 'battlelog', 'pixelbox', 'tvnoise', 'breaking', 'phonecall',
  'stainedglass', 'aurora', 'starlight', 'magiccircle', 'dragonbreath', 'velvet',
  'awaken', 'ultimate', 'flamebox', 'manaburst',
  'hud', 'aipanel', 'radar', 'cyber', 'itemget', 'bsod', 'ledboard', 'codeblock', 'countdown',
  'nightmare', 'abyss', 'asylum', 'cctv', 'fluorescent', 'curse',
  'chalkboard', 'blackboard', 'chalktext',
  'skillcard', 'choices', 'lockscreen', 'discord', 'musicplayer', 'videocall', 'subtitle',
  'fireflies', 'snowfall', 'starrain', 'shadowcrawl', 'matrixrain', 'datastream',
  'candlelight', 'forbiddenlib', 'achievement', 'gacha', 'radiolog', 'savepoint', 'bufbar',
  'exitsign', 'time444', 'talisman', 'policeline', 'radiostory', 'xmascard', 'nightsea',
  'filmstrip', 'smartwatch', 'ranking', 'bubblemsg', 'delivery',
  'a-rainfall', 'a-ekg', 'a-lightning']);

// 미리보기 전용 CSS (저장되지 않음 — iframe 머리에만 존재)
const PREVIEW_CSS = `
[data-es] { cursor: pointer; }
.es-selected-block { outline: 2px dashed #4a7bd0; outline-offset: 3px; border-radius: 2px; }
.es-flash { outline: 3px solid #e8a33d; outline-offset: 3px; transition: outline-color 1s; }
img { max-width: 100%; }
`;

const state = {
  book: null,
  chIndex: -1,
  mode: 'sentence',
  fonts: [],              // {name, family, files:[{weight, filename, buffer}], urls:[]}
  savedRange: null,
  selectedBlocks: [],
  active: null,           // {preset, els:[], root, group} 조정 중인 효과
  copyBuffer: null,       // {presetId, options}
  newCover: null,         // {buffer, mediaType}
  currentCat: 'fantasy',
  licNoticeShown: false,
  legacyFontCss: '',
};

const viewer = $('#viewer');
const idoc = () => viewer.contentDocument;
const iwin = () => viewer.contentWindow;

function toast(msg, ms = 2600) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.hidden = true; }, ms);
}

// ═══════════════ 파일 열기 ═══════════════
const dz = $('#dz-target');
dz.addEventListener('click', () => $('#file-input').click());
dz.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') $('#file-input').click(); });
$('#file-input').addEventListener('change', e => { if (e.target.files[0]) openFile(e.target.files[0]); });
['dragover', 'dragleave', 'drop'].forEach(ev => document.addEventListener(ev, e => {
  e.preventDefault();
  dz.classList.toggle('dragover', ev === 'dragover');
  if (ev === 'drop' && e.dataTransfer.files[0]) openFile(e.dataTransfer.files[0]);
}));

async function openFile(file) {
  const errEl = $('#dz-error');
  errEl.hidden = true;
  try {
    const book = await EpubBook.open(file);
    state.book = book;
    state.chIndex = -1;
    state.fonts = [];
    state.active = null;
    await loadLegacyFonts(book);
    $('#book-title').textContent = book.title;
    $('#dropzone').hidden = true;
    $('#workbench').hidden = false;
    await updateCoverUI();
    buildToc();
    buildGenreTabs();
    buildGallery();
    buildFontCatalog();
    renderFontAddedList();
    if (book.vertical) {
      const n = $('#viewer-notice');
      n.textContent = '이 책은 세로쓰기/오른쪽 넘김으로 만들어졌어요. 이 도구는 가로쓰기 책에 최적화되어 있어요.';
      n.hidden = false;
    }
    await renderChapter(0);
    const restored = book.chapters.reduce((a, c) => a + ((c.rawText?.match(/data-es=/g) || []).length), 0);
    if (restored) toast(`이 파일에 이미 적용된 효과 ${restored}개를 불러왔어요. 적용 내역에서 수정할 수 있어요.`);
    refreshAppliedList();
  } catch (err) {
    console.error(err);
    errEl.textContent = err.message || '파일을 여는 데 실패했어요. 다른 EPUB 파일로 시도해주세요.';
    errEl.hidden = false;
  }
}

// 이 툴로 저장했던 파일을 다시 연 경우: 기존 es-styler.css의 @font-face 유지
async function loadLegacyFonts(book) {
  state.legacyFontCss = '';
  const cssPath = book.opfDir + 'styles/es-styler.css';
  const css = await book.resourceText(cssPath);
  if (!css) return;
  const faces = css.match(/@font-face\s*{[^}]*}/g) || [];
  state.legacyFontCss = faces.join('\n');
}

$('#btn-home').addEventListener('click', () => {
  if (!confirm('다른 파일을 열까요? 저장하지 않은 작업은 사라져요.')) return;
  $('#workbench').hidden = true;
  $('#dropzone').hidden = false;
  $('#file-input').value = '';
});

// ═══════════════ 표지 ═══════════════
async function updateCoverUI() {
  state.newCover = null;
  const img = $('#cover-thumb');
  if (state.book.cover) {
    const url = await state.book.resourceUrl(state.book.cover.path, state.book.cover.mediaType);
    if (url) { img.src = url; img.hidden = false; } else img.hidden = true;
    $('#btn-cover').textContent = '표지 바꾸기';
  } else {
    img.hidden = true;
    img.removeAttribute('src');
    $('#btn-cover').textContent = '표지 추가';
  }
}

$('#btn-cover').addEventListener('click', () => $('#cover-input').click());
$('#cover-input').addEventListener('change', async e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file || !state.book) return;
  try {
    const im = new Image();
    im.src = URL.createObjectURL(file);
    await im.decode();
    // 원본 표지와 같은 형식(jpg/png)으로 다시 인코딩해 같은 경로에 덮어쓴다
    const maxW = 1600;
    const scale = Math.min(1, maxW / im.naturalWidth);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(im.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(im.naturalHeight * scale));
    canvas.getContext('2d').drawImage(im, 0, 0, canvas.width, canvas.height);
    const type = state.book.cover?.mediaType === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise(r => canvas.toBlob(r, type, 0.9));
    if (!blob) throw new Error('encode');
    state.newCover = { buffer: await blob.arrayBuffer(), mediaType: type };
    const img = $('#cover-thumb');
    img.src = URL.createObjectURL(blob);
    img.hidden = false;
    toast(state.book.cover
      ? '새 표지를 담았어요. 「EPUB로 저장」하면 표지가 바뀌어요.'
      : '표지를 추가했어요. 「EPUB로 저장」하면 파일에 담겨요.');
  } catch (err) {
    console.error(err);
    toast('이미지를 읽지 못했어요. jpg나 png 파일로 시도해주세요.');
  }
});

// ═══════════════ 목차 ═══════════════
function buildToc() {
  const ol = $('#toc-list');
  ol.innerHTML = '';
  state.book.chapters.forEach((ch, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.textContent = ch.title;
    if (ch.hadEffects) {
      const s = document.createElement('span');
      s.className = 'toc-fx';
      s.textContent = '✦';
      b.appendChild(s);
    }
    b.addEventListener('click', () => renderChapter(i));
    li.appendChild(b);
    ol.appendChild(li);
  });
}

function markTocActive() {
  $$('#toc-list button').forEach((b, i) => b.classList.toggle('active', i === state.chIndex));
  $('#chapter-pos').textContent = `${state.chIndex + 1} / ${state.book.chapters.length}`;
}

$('#btn-prev-ch').addEventListener('click', () => renderChapter(Math.max(0, state.chIndex - 1)));
$('#btn-next-ch').addEventListener('click', () =>
  renderChapter(Math.min(state.book.chapters.length - 1, state.chIndex + 1)));

// ═══════════════ 뷰어 렌더링 ═══════════════
const viewerPrefs = { bg: 'light', fontSize: 100 };

function readerCss() {
  const themes = {
    light: 'background:#ffffff;color:#1c1c1c;',
    sepia: 'background:#f5eeda;color:#3b3122;',
    dark: 'background:#161616;color:#d6d6d0;',
  };
  return `html{font-size:${viewerPrefs.fontSize}%;}
body{${themes[viewerPrefs.bg]}margin:0 auto;max-width:42em;padding:2em 1.4em 6em;line-height:1.75;
font-family:"Pretendard","Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif;word-break:keep-all;}`;
}

/** 현재 iframe의 본문 노드를 챕터 Document로 되돌린다 (같은 객체 원칙) */
function syncBack() {
  if (state.chIndex < 0 || !state.book) return;
  const ch = state.book.chapters[state.chIndex];
  if (!ch?.doc || !viewer.contentDocument?.body) return;
  const target = ch.bodyEl;
  if (!target) return;
  const ibody = viewer.contentDocument.body;
  while (ibody.firstChild) target.appendChild(ch.doc.adoptNode(ibody.firstChild));
}

async function chapterEpubCss(ch, doc) {
  let css = '';
  const head = doc.getElementsByTagName('head')[0];
  if (!head) return css;
  const chDir = dirOf(ch.path);
  for (const link of Array.from(head.getElementsByTagName('link'))) {
    if ((link.getAttribute('rel') || '').includes('stylesheet')) {
      const href = link.getAttribute('href');
      if (!href || href.includes('es-styler.css')) continue;
      const t = await state.book.resourceText(resolvePath(chDir, href));
      if (t) css += `\n/* ${href} */\n` + t;
    }
  }
  for (const st of Array.from(head.getElementsByTagName('style'))) css += '\n' + st.textContent;
  return css;
}

async function previewFontCss() {
  let css = '';
  for (const f of state.fonts) {
    if (!f._urls) f._urls = f.files.map(x => URL.createObjectURL(new Blob([x.buffer])));
    css += fontFaceCss(f, file => f._urls[f.files.indexOf(file)]) + '\n';
  }
  // 다시 연 파일에 이미 담겨 있던 폰트
  if (state.legacyFontCss && state.book) {
    let legacy = state.legacyFontCss;
    const urls = [...legacy.matchAll(/url\(["']?([^"')]+)["']?\)/g)];
    for (const m of urls) {
      const p = resolvePath(state.book.opfDir + 'styles/', m[1]);
      const u = await state.book.resourceUrl(p);
      if (u) legacy = legacy.replace(m[1], u);
    }
    css += legacy;
  }
  return css;
}

async function renderChapter(index) {
  if (!state.book) return;
  closeAdjust();
  hideCtx();
  syncBack();
  state.chIndex = index;
  state.selectedBlocks = [];
  state.savedRange = null;
  $('#btn-select-done').hidden = true;

  const ch = state.book.chapters[index];
  const doc = await state.book.chapterDoc(index);
  const d = idoc();
  d.open();
  d.write('<!DOCTYPE html><html><head><meta charset="utf-8"/>'
    + `<style id="es-reader">${readerCss()}</style>`
    + '<style id="es-epubcss"></style>'
    + '<style id="es-styler"></style>'
    + '</head><body></body></html>');
  d.close();

  if (!doc) {
    d.body.innerHTML = '<p style="color:#999">이 부분은 파일에서 찾을 수 없었어요.</p>';
    markTocActive();
    return;
  }
  ch.bodyEl = doc.getElementsByTagName('body')[0];
  d.getElementById('es-epubcss').textContent = await chapterEpubCss(ch, doc);
  d.getElementById('es-styler').textContent = BASE_CSS + PREVIEW_CSS + await previewFontCss();

  // 본문 노드를 iframe으로 이동 (화면의 DOM = 저장될 DOM)
  if (ch.bodyEl) {
    while (ch.bodyEl.firstChild) d.body.appendChild(d.adoptNode(ch.bodyEl.firstChild));
    const cls = ch.bodyEl.getAttribute('class');
    if (cls) d.body.setAttribute('class', cls);
  }
  // 참고: DOMParser로 파싱된 script 요소는 문서에 넣어도 실행되지 않는다 (미리보기 안전)

  // 이미지 미리보기 경로 치환 (원본 경로는 data-es-orig-src에 보존)
  const chDir = dirOf(ch.path);
  for (const img of Array.from(d.body.querySelectorAll('img'))) {
    const src = img.getAttribute('data-es-orig-src') || img.getAttribute('src');
    if (!src || /^(https?:|data:|blob:)/.test(src)) continue;
    img.setAttribute('data-es-orig-src', src);
    const url = await state.book.resourceUrl(resolvePath(chDir, src));
    if (url) img.setAttribute('src', url);
  }

  attachViewerEvents();
  markTocActive();
  refreshAppliedList();
}

function refreshViewerStyles() {
  const d = idoc();
  const r = d?.getElementById?.('es-reader');
  if (r) r.textContent = readerCss();
}
async function refreshStylerStyles() {
  const d = idoc();
  const s = d?.getElementById?.('es-styler');
  if (s) s.textContent = BASE_CSS + PREVIEW_CSS + await previewFontCss();
}

// ═══════════════ 선택 & 컨텍스트 ═══════════════
function attachViewerEvents() {
  const d = idoc();

  d.addEventListener('click', e => {
    hideCtx();
    const a = e.target.closest?.('a[href]');
    if (a) {
      e.preventDefault();
      const href = a.getAttribute('href');
      if (href && !/^https?:/.test(href)) {
        const p = resolvePath(dirOf(state.book.chapters[state.chIndex].path), href);
        const i = state.book.chapters.findIndex(c => c.path === p);
        if (i >= 0) renderChapter(i);
      }
      return;
    }
    const fx = e.target.closest?.('[data-es], [data-es-group]');
    if (fx) { showCtxFor(fx, e); return; }
    if (state.mode === 'paragraph') {
      const block = e.target.closest?.(BLOCK_SEL);
      if (block && d.body.contains(block) && block.textContent.trim()) {
        if (!e.shiftKey && !state.selectedBlocks.includes(block)) {
          // 추가 탭 = 계속 누적 선택 (모바일 배려)
        }
        if (state.selectedBlocks.includes(block)) {
          block.classList.remove('es-selected-block');
          state.selectedBlocks = state.selectedBlocks.filter(b => b !== block);
        } else {
          block.classList.add('es-selected-block');
          state.selectedBlocks.push(block);
        }
        updateSelectionHint();
        $('#btn-select-done').hidden = state.selectedBlocks.length === 0;
      }
    }
  });

  d.addEventListener('mouseup', () => {
    if (state.mode !== 'sentence') return;
    setTimeout(captureSelection, 10);
  });
  d.addEventListener('selectionchange', () => {
    if (state.mode !== 'sentence') return;
    const sel = iwin().getSelection();
    $('#btn-select-done').hidden = !sel || sel.isCollapsed;
  });
}

function captureSelection() {
  const sel = iwin().getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  if (!idoc().body.contains(range.commonAncestorContainer)) return;
  state.savedRange = range.cloneRange();
  updateSelectionHint();
  openPanel('effects');
}

$('#btn-select-done').addEventListener('click', () => {
  if (state.mode === 'sentence') captureSelection();
  else updateSelectionHint();
  openPanel('effects');
  $('#side-panel').classList.add('open');
});

function selectionText() {
  if (state.mode === 'paragraph') {
    return state.selectedBlocks.map(b => b.textContent.trim()).join('\n');
  }
  return state.savedRange ? state.savedRange.toString() : '';
}

function hasSelection() {
  return state.mode === 'paragraph' ? state.selectedBlocks.length > 0 : !!state.savedRange;
}

function updateSelectionHint() {
  const t = selectionText().trim();
  const hint = $('#effects-hint');
  if (t) {
    hint.innerHTML = '';
    const b = document.createElement('b');
    b.textContent = `“${t.slice(0, 40)}${t.length > 40 ? '…' : ''}”`;
    hint.append('선택됨: ', b, ' — 아래에서 효과를 고르세요.');
  } else {
    hint.textContent = state.mode === 'paragraph'
      ? '문단을 탭하면 선택돼요. 여러 문단을 이어서 탭할 수 있어요.'
      : '본문에서 문장을 드래그하면 효과를 고를 수 있어요.';
  }
}

$('#mode-sentence').addEventListener('click', () => setMode('sentence'));
$('#mode-paragraph').addEventListener('click', () => setMode('paragraph'));
function setMode(m) {
  state.mode = m;
  $('#mode-sentence').classList.toggle('active', m === 'sentence');
  $('#mode-paragraph').classList.toggle('active', m === 'paragraph');
  state.selectedBlocks.forEach(b => b.classList.remove('es-selected-block'));
  state.selectedBlocks = [];
  state.savedRange = null;
  $('#btn-select-done').hidden = true;
  updateSelectionHint();
}

// 효과 영역 탭 메뉴
let ctxTarget = null;
function showCtxFor(el, ev) {
  ctxTarget = rootOf(el);
  const menu = $('#ctx-menu');
  const vr = viewer.getBoundingClientRect();
  menu.hidden = false;
  const x = Math.min(vr.left + ev.clientX, window.innerWidth - 200);
  const y = Math.min(vr.top + ev.clientY + 8, window.innerHeight - 160);
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
}
function hideCtx() { $('#ctx-menu').hidden = true; }
document.addEventListener('click', e => { if (!e.target.closest('.ctx-menu')) hideCtx(); });

function rootOf(el) {
  if (el.hasAttribute('data-es')) return el;
  const g = el.getAttribute('data-es-group');
  return idoc().querySelector(`[data-es][data-es-g="${g}"]`) || el;
}

$('#ctx-edit').addEventListener('click', () => { hideCtx(); if (ctxTarget) editEffect(ctxTarget); });
$('#ctx-remove').addEventListener('click', () => { hideCtx(); if (ctxTarget) { removeEffect(ctxTarget); refreshAppliedList(); } });
$('#ctx-copy').addEventListener('click', () => {
  hideCtx();
  if (!ctxTarget) return;
  const meta = readMeta(ctxTarget);
  if (meta) {
    state.copyBuffer = { presetId: meta.p, options: { ...meta.o } };
    buildGallery();
    toast('스타일을 복사했어요. 다른 문장을 선택하고 갤러리 맨 위 「복사한 스타일」을 누르세요.');
  }
});

// ═══════════════ 패널 & 갤러리 ═══════════════
$$('.pt-btn').forEach(btn => btn.addEventListener('click', () => {
  const panel = $('#side-panel');
  if (window.innerWidth <= 900 && btn.classList.contains('active')) panel.classList.toggle('open');
  else panel.classList.add('open');
  openPanel(btn.dataset.panel);
}));

function openPanel(name) {
  $$('.pt-btn').forEach(b => b.classList.toggle('active', b.dataset.panel === name));
  ['effects', 'applied', 'fonts'].forEach(p => { $(`#panel-${p}`).hidden = p !== name; });
  if (name === 'applied') refreshAppliedList();
}

function buildGenreTabs() {
  const wrap = $('#genre-tabs');
  wrap.innerHTML = '';
  for (const c of CATEGORIES) {
    const b = document.createElement('button');
    b.textContent = c.name;
    b.classList.toggle('active', c.id === state.currentCat);
    b.addEventListener('click', () => { state.currentCat = c.id; buildGenreTabs(); buildGallery(); });
    wrap.appendChild(b);
  }
}

function customPresets() {
  try { return JSON.parse(localStorage.getItem('es-custom-presets') || '[]'); }
  catch { return []; }
}
function saveCustomPresets(list) {
  try { localStorage.setItem('es-custom-presets', JSON.stringify(list)); } catch {}
}

function makeCard({ name, badgeMotion, sampleBuilder, onClick, disabled }) {
  const card = document.createElement('button');
  card.className = 'preset-card';
  if (disabled) card.disabled = true;
  const sample = document.createElement('div');
  sample.className = 'pc-sample';
  sampleBuilder(sample);
  const meta = document.createElement('div');
  meta.className = 'pc-meta';
  const nm = document.createElement('span');
  nm.className = 'pc-name';
  nm.textContent = name;
  const cp = document.createElement('span');
  cp.className = 'pc-compat' + (badgeMotion ? ' motion' : '');
  cp.textContent = badgeMotion ? '움직임은 일부 뷰어에서만' : '어디서나 보임';
  meta.append(nm, cp);
  card.append(sample, meta);
  card.addEventListener('click', onClick);
  return card;
}

function presetSample(container, preset, options) {
  container.classList.toggle('dark', DARK_CARDS.has(preset.id));
  if (preset.kind === 'widget') {
    const t = document.createElement('template');
    const w = WIDGETS[preset.id];
    const opts = { ...defaultOptions(w.options), ...(options || {}) };
    t.innerHTML = w.render(widgetSample[preset.id] || preset.sample, opts);
    const el = t.content.firstElementChild;
    if (el) { el.style.fontSize = '9px'; container.appendChild(el); }
    return;
  }
  const el = document.createElement(preset.kind === 'inline' ? 'span' : 'div');
  el.className = `es-${preset.id}` + (preset.motion ? ' es-on' : '');
  const opts = { ...defaultOptions(preset.options), ...(options || {}) };
  if (preset.kind === 'chars') {
    buildChars(el, preset, preset.sample, opts, document);
  } else {
    el.textContent = preset.sample;
  }
  setOptionVars(el, preset, opts);
  el.style.margin = '0';
  container.appendChild(el);
}

function buildGallery() {
  const g = $('#preset-gallery');
  g.innerHTML = '';

  if (state.copyBuffer) {
    const base = presetById(state.copyBuffer.presetId);
    if (base) {
      g.appendChild(makeCard({
        name: `📋 복사한 스타일 (${base.name})`,
        badgeMotion: base.motion,
        sampleBuilder: c => presetSample(c, base, state.copyBuffer.options),
        onClick: () => applyPreset(base, { ...state.copyBuffer.options }),
      }));
    }
  }

  if (state.currentCat === 'custom') {
    const list = customPresets();
    if (!list.length) {
      const p = document.createElement('p');
      p.className = 'panel-hint';
      p.textContent = '아직 저장한 프리셋이 없어요. 효과를 조정한 뒤 「내 프리셋으로 저장」을 눌러보세요.';
      g.appendChild(p);
    }
    list.forEach((cp, i) => {
      const base = presetById(cp.presetId);
      if (!base) return;
      const card = makeCard({
        name: `★ ${cp.name}`,
        badgeMotion: base.motion,
        sampleBuilder: c => presetSample(c, base, cp.options),
        onClick: () => applyPreset(base, { ...cp.options }),
      });
      const del = document.createElement('span');
      del.textContent = ' 삭제';
      del.style.cssText = 'font-size:10px;color:var(--danger);cursor:pointer;';
      del.addEventListener('click', e => {
        e.stopPropagation();
        const l = customPresets(); l.splice(i, 1); saveCustomPresets(l); buildGallery();
      });
      card.querySelector('.pc-meta').appendChild(del);
      g.appendChild(card);
    });
    // 내보내기/불러오기
    const tools = document.createElement('div');
    tools.style.cssText = 'grid-column:1/-1;display:flex;gap:8px;margin-top:8px;';
    const exp = document.createElement('button'); exp.className = 'btn'; exp.textContent = 'JSON 내보내기';
    exp.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(customPresets(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'my-presets.json'; a.click();
    });
    const impLabel = document.createElement('label'); impLabel.className = 'btn'; impLabel.textContent = 'JSON 불러오기';
    impLabel.style.cssText = 'display:flex;align-items:center;cursor:pointer;';
    const imp = document.createElement('input'); imp.type = 'file'; imp.accept = '.json'; imp.hidden = true;
    imp.addEventListener('change', async () => {
      try {
        const arr = JSON.parse(await imp.files[0].text());
        if (Array.isArray(arr)) { saveCustomPresets([...customPresets(), ...arr]); buildGallery(); toast('프리셋을 불러왔어요.'); }
      } catch { toast('프리셋 파일을 읽지 못했어요.'); }
    });
    impLabel.appendChild(imp);
    tools.append(exp, impLabel);
    g.appendChild(tools);
    return;
  }

  for (const preset of PRESETS.filter(p => p.cat === state.currentCat)) {
    g.appendChild(makeCard({
      name: preset.name,
      badgeMotion: preset.motion,
      sampleBuilder: c => presetSample(c, preset),
      onClick: () => applyPreset(preset),
    }));
  }
}

// ═══════════════ 옵션 적용 ═══════════════
function defaultOptions(optDefs) {
  const o = {};
  for (const d of optDefs || []) o[d.key] = d.def;
  return o;
}

function setOptionVars(el, preset, opts) {
  for (const d of preset.options || []) {
    if (d.direct) {
      const v = opts[d.key];
      if (v === '' || v == null) el.style.removeProperty(d.direct);
      else el.style.setProperty(d.direct, String(v));
      continue;
    }
    if (!d.cssVar) continue;
    const v = opts[d.key];
    if (v === '' || v == null) { el.style.removeProperty(d.cssVar); continue; }
    let val = String(v);
    if (d.type === 'range') val = v + (d.unit === '°' ? 'deg' : d.unit || '');
    if (d.quoted) val = JSON.stringify(String(v));
    if (d.type === 'font') val = `"${v}"`;
    el.style.setProperty(d.cssVar, val);
  }
  if (preset.motion) el.classList.toggle('es-on', opts.anim !== false);
}

function writeMeta(el, preset, opts, group) {
  el.setAttribute('data-es', JSON.stringify({ p: preset.id, o: opts, v: 1 }));
  el.setAttribute('data-es-g', group);
}
function readMeta(el) {
  try { return JSON.parse(el.getAttribute('data-es')); } catch { return null; }
}

function groupEls(root) {
  const g = root.getAttribute('data-es-g');
  if (!g) return [root];
  return Array.from(idoc().querySelectorAll(`[data-es-g="${g}"], [data-es-group="${g}"]`));
}

// 글자별 span 분할 (점점 커지는/작아지는/뒤틀린 글자 — 애니메이션 없이 모든 뷰어에서 성립)
function buildChars(el, preset, text, opts, docRef) {
  el.textContent = '';
  const chars = [...text];
  const n = Math.max(1, chars.length - 1);
  chars.forEach((c, i) => {
    if (c === '\n') { el.appendChild(docRef.createElement('br')); return; }
    const s = docRef.createElement('span');
    s.setAttribute('class', 'es-ch');
    let style = '';
    if (preset.id === 'grow' || preset.id === 'shrink') {
      const from = +opts.from || 100, to = +opts.to || 100;
      style += `font-size:${Math.round(from + (to - from) * i / n)}%;`;
    } else if (preset.id === 'warped') {
      const rot = +opts.rot || 8, jit = +opts.jit || 3;
      const r = ((i * 137) % (rot * 2 + 1)) - rot;
      const y = ((i * 89) % (jit * 2 + 1)) - jit;
      style += `transform:rotate(${r}deg) translateY(${y}px);`;
    }
    if (style) s.setAttribute('style', style);
    s.textContent = c === ' ' ? ' ' : c;
    el.appendChild(s);
  });
}

// ═══════════════ 효과 적용 ═══════════════
const LEAF_BLOCK = 'p, h1, h2, h3, h4, h5, h6, li, blockquote, pre, dd, dt, td, th, figcaption';

function leafBlocksInRange(range) {
  const d = idoc();
  const blocks = [];
  for (const el of d.body.querySelectorAll(LEAF_BLOCK)) {
    if (range.intersectsNode(el) && !el.querySelector(LEAF_BLOCK)) blocks.push(el);
  }
  return blocks;
}

/** 선택 범위를 블록별로 잘라 span으로 감싼다. 반환: 생성된 span 목록 */
function wrapRangePerBlock(range, makeSpan) {
  const d = idoc();
  const blocks = leafBlocksInRange(range);
  const spans = [];
  const wrapSub = sub => {
    if (sub.collapsed || !sub.toString().length) return;
    const span = makeSpan();
    try {
      span.appendChild(sub.extractContents());
      sub.insertNode(span);
      spans.push(span);
    } catch (e) { console.warn('감싸기 실패', e); }
  };
  if (!blocks.length) { wrapSub(range); return spans; }
  for (const block of blocks) {
    const sub = d.createRange();
    sub.selectNodeContents(block);
    if (block.contains(range.startContainer)) sub.setStart(range.startContainer, range.startOffset);
    if (block.contains(range.endContainer)) sub.setEnd(range.endContainer, range.endOffset);
    wrapSub(sub);
  }
  return spans;
}

function clearSelectionState() {
  state.selectedBlocks.forEach(b => b.classList.remove('es-selected-block'));
  state.selectedBlocks = [];
  state.savedRange = null;
  try { iwin().getSelection()?.removeAllRanges(); } catch {}
  $('#btn-select-done').hidden = true;
  updateSelectionHint();
}

function applyPreset(preset, presetOpts) {
  if (!state.book || state.chIndex < 0) return;
  if (!hasSelection()) {
    toast('먼저 본문에서 문장을 드래그하거나 문단을 탭해서 선택해주세요.');
    return;
  }
  if (preset.kind === 'widget') { openWidgetModal(preset, null, presetOpts); return; }

  const d = idoc();
  const opts = presetOpts ? { ...defaultOptions(preset.options), ...presetOpts } : defaultOptions(preset.options);
  const group = uid();
  let els = [];

  if (state.mode === 'paragraph') {
    if (preset.kind === 'block' && state.selectedBlocks.length) {
      // 문단들을 하나의 박스(div)로 묶는다
      const div = d.createElement('div');
      div.setAttribute('class', `es-${preset.id}`);
      const first = state.selectedBlocks[0];
      first.parentNode.insertBefore(div, first);
      state.selectedBlocks.forEach(b => { b.classList.remove('es-selected-block'); div.appendChild(b); });
      els = [div];
    } else {
      for (const b of state.selectedBlocks) {
        b.classList.remove('es-selected-block');
        const span = d.createElement('span');
        span.setAttribute('class', `es-${preset.id}`);
        while (b.firstChild) span.appendChild(b.firstChild);
        b.appendChild(span);
        els.push(span);
      }
    }
  } else {
    const range = state.savedRange;
    if (!range) return;
    els = wrapRangePerBlock(range, () => {
      const span = d.createElement('span');
      span.setAttribute('class', `es-${preset.id}${preset.kind === 'block' ? ' es-block' : ''}`);
      return span;
    });
  }

  if (!els.length) { toast('이 영역에는 효과를 적용할 수 없었어요. 문장을 다시 선택해주세요.'); return; }

  if (preset.kind === 'chars') {
    for (const el of els) {
      const original = el.textContent;
      el.setAttribute('data-es-original', original);
      buildChars(el, preset, original, opts, d);
    }
  }

  els.forEach((el, i) => {
    setOptionVars(el, preset, opts);
    if (i === 0) writeMeta(el, preset, opts, group);
    else { el.setAttribute('data-es-group', group); }
  });

  clearSelectionState();
  openAdjust({ preset, els, root: els[0], opts });
  refreshAppliedList();
}

// ═══════════════ 효과 제거/수정 ═══════════════
function removeEffect(root) {
  const meta = readMeta(root);
  const preset = meta ? presetById(meta.p) : null;
  const els = groupEls(root);
  const d = idoc();
  for (const el of els) {
    if (!el.isConnected) continue;
    if (preset?.kind === 'widget' || el.classList.contains('es-widget')) {
      const original = el.getAttribute('data-es-original') || '';
      const frag = d.createDocumentFragment();
      original.split(/\n/).filter(s => s.trim()).forEach(line => {
        const p = d.createElement('p');
        p.textContent = line;
        frag.appendChild(p);
      });
      el.replaceWith(frag);
    } else if (el.hasAttribute('data-es-original') && preset?.kind === 'chars') {
      el.replaceWith(d.createTextNode(el.getAttribute('data-es-original')));
    } else {
      const parent = el.parentNode;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      el.remove();
      parent.normalize?.();
    }
  }
  closeAdjust();
  toast('효과를 제거하고 원문으로 되돌렸어요.');
}

function editEffect(root) {
  const meta = readMeta(root);
  if (!meta) return;
  const preset = presetById(meta.p);
  if (!preset) return;
  if (preset.kind === 'widget') {
    openWidgetModal(preset, root, meta.o);
  } else {
    openAdjust({ preset, els: groupEls(root), root, opts: { ...defaultOptions(preset.options), ...meta.o } });
  }
}

// ═══════════════ 미세 조정 시트 ═══════════════
function openAdjust(active) {
  state.active = active;
  const { preset, opts } = active;
  $('#adjust-title').textContent = preset.name;
  const badge = $('#adjust-badge');
  badge.textContent = compatBadge(preset);
  badge.className = 'as-badge' + (preset.motion ? ' motion' : '');
  const body = $('#adjust-body');
  body.innerHTML = '';

  for (const d of preset.options || []) {
    const row = document.createElement('div');
    row.className = 'opt-row';
    const label = document.createElement('span');
    label.className = 'opt-label';
    label.textContent = d.label;
    row.appendChild(label);

    const update = v => {
      opts[d.key] = v;
      applyActiveOptions();
    };

    if (d.type === 'color') {
      const inp = document.createElement('input');
      inp.type = 'color';
      inp.value = /^#([0-9a-f]{6})/i.exec(String(opts[d.key] || ''))?.[0] || '#888888';
      inp.addEventListener('input', () => update(inp.value));
      row.appendChild(inp);
      if (!/^#([0-9a-f]{6})$/i.test(String(opts[d.key] || ''))) {
        const note = document.createElement('span');
        note.className = 'opt-val';
        note.textContent = opts[d.key] ? '' : '기본';
        row.appendChild(note);
      }
    } else if (d.type === 'range') {
      const inp = document.createElement('input');
      inp.type = 'range';
      inp.min = d.min; inp.max = d.max; inp.step = d.step;
      inp.value = opts[d.key];
      const val = document.createElement('span');
      val.className = 'opt-val';
      val.textContent = opts[d.key] + (d.unit || '');
      inp.addEventListener('input', () => { val.textContent = inp.value + (d.unit || ''); update(+inp.value); });
      row.append(inp, val);
    } else if (d.type === 'select') {
      const sel = document.createElement('select');
      for (const c of d.choices) {
        const o = document.createElement('option');
        o.value = c.value; o.textContent = c.label;
        sel.appendChild(o);
      }
      sel.value = opts[d.key];
      sel.addEventListener('change', () => update(sel.value));
      row.appendChild(sel);
    } else if (d.type === 'check') {
      const inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.checked = opts[d.key] !== false;
      inp.addEventListener('change', () => update(inp.checked));
      row.appendChild(inp);
    } else if (d.type === 'text') {
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.value = opts[d.key] ?? '';
      if (d.placeholder) inp.placeholder = d.placeholder;
      inp.addEventListener('input', () => update(inp.value));
      row.appendChild(inp);
    } else if (d.type === 'font') {
      const sel = document.createElement('select');
      const o0 = document.createElement('option');
      o0.value = ''; o0.textContent = '책 기본 폰트';
      sel.appendChild(o0);
      for (const f of state.fonts) {
        const o = document.createElement('option');
        o.value = f.family; o.textContent = f.name;
        sel.appendChild(o);
      }
      sel.value = opts[d.key] || '';
      sel.addEventListener('change', () => update(sel.value));
      row.appendChild(sel);
      if (!state.fonts.length) {
        const note = document.createElement('span');
        note.className = 'opt-val';
        note.style.width = 'auto';
        note.textContent = '폰트 탭에서 추가';
        row.appendChild(note);
      }
    }
    body.appendChild(row);
  }
  if (!(preset.options || []).length) {
    body.innerHTML = '<p class="panel-hint">이 효과는 따로 조정할 옵션이 없어요.</p>';
  }
  $('#adjust-sheet').hidden = false;
}

function applyActiveOptions() {
  const a = state.active;
  if (!a) return;
  const d = idoc();
  for (const el of a.els) {
    if (!el.isConnected) continue;
    setOptionVars(el, a.preset, a.opts);
    if (a.preset.kind === 'chars') {
      buildChars(el, a.preset, el.getAttribute('data-es-original') || el.textContent, a.opts, d);
    }
  }
  const root = a.els[0];
  if (root?.isConnected) writeMeta(root, a.preset, a.opts, root.getAttribute('data-es-g') || uid());
}

function closeAdjust() {
  state.active = null;
  $('#adjust-sheet').hidden = true;
}

$('#adjust-close').addEventListener('click', () => { closeAdjust(); refreshAppliedList(); });
$('#adjust-done').addEventListener('click', () => { closeAdjust(); refreshAppliedList(); toast('적용했어요. 「EPUB로 저장」을 누르면 파일에 담겨요.'); });
$('#adjust-remove').addEventListener('click', () => {
  if (state.active?.root) removeEffect(state.active.root);
  refreshAppliedList();
});
$('#adjust-save-preset').addEventListener('click', () => {
  const a = state.active;
  if (!a) return;
  const name = prompt('프리셋 이름을 지어주세요', `내 ${a.preset.name}`);
  if (!name) return;
  const list = customPresets();
  list.push({ name, presetId: a.preset.id, options: { ...a.opts } });
  saveCustomPresets(list);
  toast('「내 프리셋」 탭에 저장했어요.');
});

// ═══════════════ 위젯 모달 ═══════════════
let widgetCtx = null; // {preset, editRoot, opts}

function openWidgetModal(preset, editRoot, presetOpts) {
  const w = WIDGETS[preset.id];
  const opts = { ...defaultOptions(w.options), ...(presetOpts || {}) };
  let source;
  if (editRoot) source = editRoot.getAttribute('data-es-original') || '';
  else {
    source = selectionText().trim();
    if (!source) {
      toast('글자가 있는 문장을 선택해야 이 효과를 쓸 수 있어요.');
      return;
    }
  }
  widgetCtx = { preset, editRoot, opts };
  $('#widget-modal-title').textContent = `${preset.name} — 이렇게 바뀝니다`;
  $('#widget-source').value = source;
  $('#widget-rule-hint').textContent = w.rule;

  const optWrap = $('#widget-options');
  optWrap.innerHTML = '';
  for (const d of w.options) {
    const row = document.createElement('div');
    row.className = 'opt-row';
    const label = document.createElement('span');
    label.className = 'opt-label';
    label.textContent = d.label;
    row.appendChild(label);
    if (d.type === 'check') {
      const inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.checked = opts[d.key] !== false;
      inp.addEventListener('change', () => { opts[d.key] = inp.checked; renderWidgetPreview(); });
      row.appendChild(inp);
    } else if (d.type === 'select') {
      const sel = document.createElement('select');
      for (const c of d.choices) {
        const o = document.createElement('option');
        o.value = c.value; o.textContent = c.label;
        sel.appendChild(o);
      }
      sel.value = opts[d.key];
      sel.addEventListener('change', () => { opts[d.key] = sel.value; renderWidgetPreview(); });
      row.appendChild(sel);
    } else if (d.type === 'font') {
      const sel = document.createElement('select');
      const o0 = document.createElement('option');
      o0.value = ''; o0.textContent = '기본(손글씨풍)';
      sel.appendChild(o0);
      for (const f of state.fonts) {
        const o = document.createElement('option');
        o.value = f.family; o.textContent = f.name;
        sel.appendChild(o);
      }
      sel.value = opts[d.key] || '';
      sel.addEventListener('change', () => { opts[d.key] = sel.value; renderWidgetPreview(); });
      row.appendChild(sel);
    } else {
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.value = opts[d.key] ?? '';
      inp.addEventListener('input', () => { opts[d.key] = inp.value; renderWidgetPreview(); });
      row.appendChild(inp);
    }
    optWrap.appendChild(row);
  }
  renderWidgetPreview();
  $('#widget-modal').hidden = false;
}

function renderWidgetPreview() {
  if (!widgetCtx) return;
  const { preset, opts } = widgetCtx;
  const html = WIDGETS[preset.id].render($('#widget-source').value, opts);
  const t = document.createElement('template');
  t.innerHTML = html;
  const box = $('#widget-preview');
  box.innerHTML = '';
  const el = t.content.firstElementChild;
  if (el) {
    if (opts.font) el.style.setProperty('--es-font', `"${opts.font}"`);
    box.appendChild(el);
  }
}
$('#widget-source').addEventListener('input', renderWidgetPreview);
$('#widget-modal-close').addEventListener('click', closeWidgetModal);
$('#widget-cancel').addEventListener('click', closeWidgetModal);
function closeWidgetModal() { $('#widget-modal').hidden = true; widgetCtx = null; }

$('#widget-apply').addEventListener('click', () => {
  if (!widgetCtx) return;
  const { preset, editRoot, opts } = widgetCtx;
  const d = idoc();
  const source = $('#widget-source').value;
  const html = WIDGETS[preset.id].render(source, opts);
  const t = document.createElement('template');
  t.innerHTML = html;
  const inner = t.content.firstElementChild;
  if (!inner) return;

  const build = () => {
    const root = d.createElement('div');
    root.setAttribute('class', 'es-widget');
    root.appendChild(d.importNode(inner, true));
    root.setAttribute('data-es-original', source);
    if (opts.font) root.style.setProperty('--es-font', `"${opts.font}"`);
    writeMeta(root, preset, opts, uid());
    return root;
  };

  if (editRoot) {
    const root = build();
    editRoot.replaceWith(root);
  } else {
    let anchorBlocks;
    if (state.mode === 'paragraph') anchorBlocks = state.selectedBlocks.slice();
    else if (state.savedRange) anchorBlocks = leafBlocksInRange(state.savedRange);
    if (!anchorBlocks?.length) { toast('넣을 위치를 찾지 못했어요. 문단을 다시 선택해주세요.'); return; }
    const root = build();
    anchorBlocks[0].parentNode.insertBefore(root, anchorBlocks[0]);
    anchorBlocks.forEach(b => b.remove());
  }
  clearSelectionState();
  closeWidgetModal();
  refreshAppliedList();
  toast('변환했어요. 위젯을 탭하면 다시 고칠 수 있어요.');
});

// ═══════════════ 적용 내역 ═══════════════
function refreshAppliedList() {
  if (!state.book) return;
  const wrap = $('#applied-list');
  wrap.innerHTML = '';
  syncCurrentIntoCount();
  let total = 0;

  state.book.chapters.forEach((ch, i) => {
    let items = [];
    if (i === state.chIndex && idoc()?.body) {
      items = Array.from(idoc().body.querySelectorAll('[data-es]'));
    } else if (ch.doc) {
      items = Array.from(ch.doc.querySelectorAll('[data-es]'));
    } else if (ch.rawText) {
      const n = (ch.rawText.match(/data-es=/g) || []).length;
      if (n) {
        total += n;
        const head = document.createElement('div');
        head.className = 'ap-chapter';
        head.textContent = ch.title;
        const row = document.createElement('button');
        row.className = 'ap-item';
        row.innerHTML = `<span class="ap-text">효과 ${n}개 — 눌러서 이 챕터 열기</span>`;
        row.addEventListener('click', () => renderChapter(i));
        wrap.append(head, row);
      }
      return;
    }
    if (!items.length) return;
    total += items.length;
    const head = document.createElement('div');
    head.className = 'ap-chapter';
    head.textContent = ch.title;
    wrap.appendChild(head);

    for (const el of items) {
      const meta = readMeta(el);
      const preset = meta ? presetById(meta.p) : null;
      const row = document.createElement('button');
      row.className = 'ap-item';
      const tag = document.createElement('span');
      tag.className = 'ap-preset';
      tag.textContent = preset?.name || meta?.p || '효과';
      const txt = document.createElement('span');
      txt.className = 'ap-text';
      const raw = (el.getAttribute('data-es-original') || el.textContent || '').trim();
      txt.textContent = raw.slice(0, 34) || '(내용 없음)';
      const actions = document.createElement('span');
      actions.className = 'ap-actions';
      const mk = (icon, title, fn) => {
        const b = document.createElement('button');
        b.textContent = icon; b.title = title;
        b.addEventListener('click', e => { e.stopPropagation(); fn(); });
        return b;
      };
      actions.append(
        mk('✏️', '수정', async () => { await gotoEffect(i, el); const live = liveEl(el); if (live) editEffect(live); }),
        mk('📋', '스타일 복사', () => {
          if (meta) { state.copyBuffer = { presetId: meta.p, options: { ...meta.o } }; buildGallery(); toast('스타일을 복사했어요. 문장을 선택한 뒤 갤러리 맨 위에서 적용하세요.'); }
        }),
        mk('🗑', '제거', async () => { await gotoEffect(i, el); const live = liveEl(el); if (live) removeEffect(live); refreshAppliedList(); }),
      );
      row.append(tag, txt, actions);
      row.addEventListener('click', async () => {
        await gotoEffect(i, el);
        const live = liveEl(el);
        if (live) {
          live.scrollIntoView({ block: 'center' });
          live.classList.add('es-flash');
          setTimeout(() => live.classList.remove('es-flash'), 1500);
        }
      });
      wrap.appendChild(row);
    }
  });

  if (!total) {
    wrap.innerHTML = '<div class="ap-empty">아직 적용한 효과가 없어요.<br/>본문에서 문장을 선택하고 효과를 골라보세요.</div>';
  }
  $('#applied-count').textContent = total || '';
}

function syncCurrentIntoCount() { /* 현재 챕터 DOM은 iframe에 있으므로 위에서 직접 읽는다 */ }

async function gotoEffect(chIndex, el) {
  if (chIndex !== state.chIndex) await renderChapter(chIndex);
}
function liveEl(el) {
  if (el.isConnected && idoc()?.body?.contains(el)) return el;
  const g = el.getAttribute?.('data-es-g');
  return g ? idoc()?.querySelector(`[data-es-g="${g}"]`) : null;
}

// ═══════════════ 폰트 ═══════════════
/** 선택한 문장/문단에만 해당 폰트를 입힌다 (책 전체 변경 아님) */
function applyFontToSelection(font) {
  if (!hasSelection()) {
    toast('먼저 본문에서 문장을 드래그하거나 문단을 탭한 뒤, 폰트의 「선택에 적용」을 눌러주세요.');
    return false;
  }
  applyPreset(presetById('fontarea'), { font: font.family });
  return true;
}

function buildFontCatalog() {
  const wrap = $('#font-catalog');
  const q = $('#font-search').value.trim();
  wrap.innerHTML = '';
  const list = FONT_CATALOG.filter(f => !q || f.name.includes(q) || f.repo.toLowerCase().includes(q.toLowerCase()));
  if (!list.length) {
    wrap.innerHTML = '<p class="panel-hint">카탈로그에서 찾지 못했어요. 아래 「파일로 추가」로 직접 올릴 수 있어요.</p>';
    return;
  }
  for (const entry of list) {
    const row = document.createElement('div');
    row.className = 'fc-item';
    const name = document.createElement('span');
    name.className = 'fc-name';
    name.textContent = entry.name;
    const existing = state.fonts.find(f => f.name === entry.name);
    if (existing) {
      const btnApply = document.createElement('button');
      btnApply.textContent = '선택에 적용';
      btnApply.addEventListener('click', () => applyFontToSelection(existing));
      row.append(name, btnApply);
    } else {
      const btn = document.createElement('button');
      btn.textContent = '추가';
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.textContent = '…';
        try {
          const font = await downloadCatalogFont(entry, msg => { btn.textContent = '…'; });
          state.fonts.push(font);
          renderFontAddedList();
          await refreshStylerStyles();
          injectMainFontPreview(font);
          buildFontCatalog();
          // 선택해 둔 문장이 있으면 바로 그 부분에 입힌다
          if (hasSelection()) applyFontToSelection(font);
          else toast(`「${font.name}」 폰트를 담았어요. 본문에서 문장을 선택하고 「선택에 적용」을 누르면 그 부분만 바뀌어요.`);
        } catch (e) {
          console.error(e);
          btn.disabled = false;
          btn.textContent = '추가';
          toast('폰트를 내려받지 못했어요. 인터넷 연결을 확인하고 다시 시도해주세요.');
        }
      });
      row.append(name, btn);
    }
    wrap.appendChild(row);
  }
}
$('#font-search').addEventListener('input', buildFontCatalog);

function injectMainFontPreview(font) {
  if (!font._urls) font._urls = font.files.map(x => URL.createObjectURL(new Blob([x.buffer])));
  const st = document.createElement('style');
  st.textContent = fontFaceCss(font, file => font._urls[font.files.indexOf(file)]);
  document.head.appendChild(st);
}

$('#font-file-input').addEventListener('change', async e => {
  const file = e.target.files[0];
  if (!file) return;
  if (!state.licNoticeShown) {
    state.licNoticeShown = true;
    if (!confirm('임베드(EPUB 파일에 담기)가 허용된 폰트인지 확인하셨나요?\n유료 폰트는 라이선스에 따라 파일 담기가 금지될 수 있어요.')) {
      e.target.value = '';
      return;
    }
  }
  try {
    const font = await fontFromFile(file);
    if (state.fonts.some(f => f.family === font.family)) { toast('같은 이름의 폰트가 이미 담겨 있어요.'); return; }
    state.fonts.push(font);
    renderFontAddedList();
    await refreshStylerStyles();
    injectMainFontPreview(font);
    buildFontCatalog();
    if (hasSelection()) applyFontToSelection(font);
    else toast(`「${font.name}」 폰트를 담았어요. 본문에서 문장을 선택하고 「선택에 적용」을 누르면 그 부분만 바뀌어요.`);
  } catch (err) {
    toast(err.message || '폰트 파일을 읽지 못했어요.');
  }
  e.target.value = '';
});

function renderFontAddedList() {
  const ul = $('#font-added-list');
  ul.innerHTML = '';
  $('#font-added-count').textContent = state.fonts.length ? `${state.fonts.length}개` : '';
  for (const f of state.fonts) {
    const li = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = f.name;
    name.style.flex = '1';
    name.style.fontFamily = `"${f.family}"`;
    const size = document.createElement('span');
    size.className = 'size';
    const kb = Math.round(f.files.reduce((a, x) => a + x.buffer.byteLength, 0) / 1024);
    size.textContent = kb > 1024 ? (kb / 1024).toFixed(1) + 'MB' : kb + 'KB';
    const apply = document.createElement('button');
    apply.textContent = '선택에 적용';
    apply.className = 'btn';
    apply.style.minHeight = '30px';
    apply.addEventListener('click', () => applyFontToSelection(f));
    const del = document.createElement('button');
    del.textContent = '빼기';
    del.className = 'btn';
    del.style.minHeight = '30px';
    del.addEventListener('click', () => {
      state.fonts = state.fonts.filter(x => x !== f);
      renderFontAddedList();
      buildFontCatalog();
      refreshStylerStyles();
    });
    li.append(name, size, apply, del);
    ul.appendChild(li);
  }
  if (!state.fonts.length) {
    ul.innerHTML = '<li style="border:0;color:var(--ink-soft)">아직 담은 폰트가 없어요.</li>';
  }
}

// ═══════════════ 저장 ═══════════════
function collectUsedFamilies() {
  const used = new Set();
  const scan = root => {
    for (const el of root.querySelectorAll('[data-es]')) {
      const meta = readMeta(el);
      if (meta?.o?.font) used.add(meta.o.font);
    }
  };
  state.book.chapters.forEach((ch, i) => {
    if (i === state.chIndex && idoc()?.body) scan(idoc().body);
    else if (ch.doc) scan(ch.doc);
  });
  return used;
}

function countEffects() {
  let n = 0;
  state.book.chapters.forEach((ch, i) => {
    if (i === state.chIndex && idoc()?.body) n += idoc().body.querySelectorAll('[data-es]').length;
    else if (ch.doc) n += ch.doc.querySelectorAll('[data-es]').length;
    else if (ch.rawText) n += (ch.rawText.match(/data-es=/g) || []).length;
  });
  return n;
}

$('#btn-save').addEventListener('click', () => {
  if (!state.book) return;
  const nEffects = countEffects();
  const used = collectUsedFamilies();
  const usedFonts = state.fonts.filter(f => used.has(f.family));
  const summary = $('#save-summary');
  summary.innerHTML = '';
  const p1 = document.createElement('p');
  p1.innerHTML = `<b>효과 ${nEffects}개</b>${usedFonts.length ? `, <b>폰트 ${usedFonts.length}개</b>` : ''}가 포함됩니다.`;
  const ul = document.createElement('ul');
  ul.className = 'save-list';
  const li1 = document.createElement('li');
  li1.textContent = `저장 파일: ${state.book.fileName}_styled.epub (원본은 그대로 남아요)`;
  ul.appendChild(li1);
  if (state.newCover) {
    const lc = document.createElement('li');
    lc.textContent = state.book.cover ? '표지 교체 1건' : '새 표지 추가 1건';
    ul.appendChild(lc);
  }
  for (const f of usedFonts) {
    const li = document.createElement('li');
    const kb = Math.round(f.files.reduce((a, x) => a + x.buffer.byteLength, 0) / 1024);
    li.textContent = `폰트 담기: ${f.name} (${kb > 1024 ? (kb / 1024).toFixed(1) + 'MB' : kb + 'KB'})`;
    ul.appendChild(li);
  }
  if (!nEffects) {
    const li = document.createElement('li');
    li.textContent = '아직 적용한 효과가 없어요. 그래도 저장할 수 있어요.';
    ul.appendChild(li);
  }
  summary.append(p1, ul);
  $('#save-modal').hidden = false;
  $('#save-confirm').dataset.fonts = usedFonts.map(f => f.name).join(',');
});
$('#save-modal-close').addEventListener('click', () => { $('#save-modal').hidden = true; });
$('#save-cancel').addEventListener('click', () => { $('#save-modal').hidden = true; });

$('#save-confirm').addEventListener('click', async () => {
  $('#save-modal').hidden = true;
  const btn = $('#btn-save');
  btn.disabled = true;
  btn.textContent = '저장 중…';
  try {
    syncBack();
    // 효과가 있는 미파싱 챕터도 파싱해 링크를 보장한다
    for (let i = 0; i < state.book.chapters.length; i++) {
      const ch = state.book.chapters[i];
      if (!ch.doc && ch.rawText?.includes('data-es=')) await state.book.chapterDoc(i);
    }
    const used = collectUsedFamiliesFromDocs();
    const usedFonts = state.fonts.filter(f => used.has(f.family));
    let stylerCss = BASE_CSS + '\n';
    for (const f of usedFonts) stylerCss += fontFaceCss(f, file => `../fonts/${encodeURI(file.filename)}`) + '\n';
    if (state.legacyFontCss) {
      const have = new Set(usedFonts.map(f => f.family));
      const keep = (state.legacyFontCss.match(/@font-face\s*{[^}]*}/g) || []).filter(b => {
        const fam = /font-family\s*:\s*["']?([^"';]+)/.exec(b)?.[1]?.trim();
        return fam && !have.has(fam);
      });
      stylerCss += keep.join('\n');
    }

    const esManifest = { app: 'epub-styler', version: 1, created: new Date().toISOString(), effects: [] };
    state.book.chapters.forEach(ch => {
      if (!ch.doc) return;
      for (const el of ch.doc.querySelectorAll('[data-es]')) {
        const meta = readMeta(el);
        if (meta) esManifest.effects.push({ chapter: ch.path, preset: meta.p, options: meta.o,
          text: (el.getAttribute('data-es-original') || el.textContent || '').slice(0, 80) });
      }
    });

    const blob = await state.book.save({ stylerCss, fonts: usedFonts, esManifest, newCover: state.newCover });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${state.book.fileName}_styled.epub`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 30000);
    toast('저장했어요! 내려받은 파일은 일반 EPUB 뷰어에서도 효과가 그대로 보여요.');
    await renderChapter(state.chIndex); // 본문 노드를 다시 화면으로
  } catch (err) {
    console.error(err);
    toast('저장에 실패했어요: ' + (err.message || '메모리가 부족하거나 파일이 너무 커요. 새로고침 후 다시 시도해주세요.'), 5000);
  } finally {
    btn.disabled = false;
    btn.textContent = 'EPUB로 저장';
  }
});

function collectUsedFamiliesFromDocs() {
  const used = new Set();
  state.book.chapters.forEach(ch => {
    if (!ch.doc) return;
    for (const el of ch.doc.querySelectorAll('[data-es]')) {
      const meta = readMeta(el);
      if (meta?.o?.font) used.add(meta.o.font);
    }
  });
  return used;
}

// ═══════════════ 보기 설정 ═══════════════
$('#btn-viewer-settings').addEventListener('click', () => {
  $('#viewer-settings-pop').hidden = !$('#viewer-settings-pop').hidden;
});
document.addEventListener('click', e => {
  if (!e.target.closest('#viewer-settings-pop') && !e.target.closest('#btn-viewer-settings')) {
    $('#viewer-settings-pop').hidden = true;
  }
});
$$('.vs-bg').forEach(b => b.addEventListener('click', () => {
  viewerPrefs.bg = b.dataset.vbg;
  $$('.vs-bg').forEach(x => x.classList.toggle('active', x === b));
  refreshViewerStyles();
}));
$('#vs-fontsize').addEventListener('input', e => {
  viewerPrefs.fontSize = +e.target.value;
  $('#vs-fontsize-val').textContent = e.target.value + '%';
  refreshViewerStyles();
});

// ═══════════════ 부트스트랩 ═══════════════
(function boot() {
  // 프리셋 카드·위젯 미리보기용으로 메인 문서에도 기본 CSS 주입
  const st = document.createElement('style');
  st.textContent = BASE_CSS;
  document.head.appendChild(st);
  updateSelectionHint();
})();
