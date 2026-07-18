// ── EPUB 열기/저장 파이프라인 (JSZip + DOMParser, epub.js 미사용) ──
// 화면에 보이는 챕터 DOM과 저장되는 DOM이 같은 객체가 되도록,
// 챕터 XHTML Document를 메모리에 보관하고 저장 시 그대로 직렬화한다.

const XHTML_TYPES = new Set(['application/xhtml+xml', 'text/html']);

export function dirOf(path) {
  const i = path.lastIndexOf('/');
  return i === -1 ? '' : path.slice(0, i + 1);
}

/** base 디렉터리('a/b/') 기준 상대경로 href를 zip 절대경로로 */
export function resolvePath(base, href) {
  href = decodeURIComponent(href.split('#')[0].split('?')[0]);
  const parts = (base + href).split('/');
  const out = [];
  for (const p of parts) {
    if (p === '' || p === '.') continue;
    if (p === '..') out.pop();
    else out.push(p);
  }
  return out.join('/');
}

/** fromDir('a/b/')에서 toPath('a/c/x.css')로 가는 상대경로 */
export function relPath(fromDir, toPath) {
  const from = fromDir.split('/').filter(Boolean);
  const to = toPath.split('/');
  let i = 0;
  while (i < from.length && i < to.length - 1 && from[i] === to[i]) i++;
  return '../'.repeat(from.length - i) + to.slice(i).join('/');
}

export class EpubBook {
  constructor() {
    this.zip = null;
    this.fileName = '';
    this.opfPath = '';
    this.opfDir = '';
    this.opfDoc = null;
    this.title = '';
    this.manifest = new Map();   // id -> {href, mediaType, properties}
    this.spine = [];             // [{idref, path}]
    this.chapters = [];          // [{path, title, doc|null, hadEffects}]
    this.toc = [];               // [{title, path}]
    this.vertical = false;
  }

  static async open(file) {
    const book = new EpubBook();
    book.fileName = file.name.replace(/\.epub$/i, '');
    let zip;
    try {
      zip = await JSZip.loadAsync(file);
    } catch (e) {
      throw { code: 'notzip', message: 'EPUB 파일이 아니거나 파일이 손상된 것 같아요. 다른 파일로 시도해주세요.' };
    }
    book.zip = zip;

    // DRM 감지
    const enc = zip.file('META-INF/encryption.xml');
    if (enc) {
      const encXml = await enc.async('string');
      // 폰트 난독화(IDPF obfuscation)만 있는 경우는 통과시킨다
      const onlyFontObfuscation = !/EncryptedData/i.test(encXml) ||
        /http:\/\/www\.idpf\.org\/2008\/embedding|http:\/\/ns\.adobe\.com\/pdf\/enc#RC/.test(encXml) &&
        !/aes|#kdrm|readium|adept/i.test(encXml);
      if (!onlyFontObfuscation) {
        throw { code: 'drm', message: '구매처에서 잠근(DRM) 파일이라 열 수 없어요. DRM이 없는 EPUB으로 시도해주세요.' };
      }
    }

    const containerFile = zip.file('META-INF/container.xml');
    if (!containerFile) throw { code: 'badepub', message: 'EPUB 구조(container.xml)를 찾지 못했어요. 파일이 손상됐을 수 있어요.' };
    const containerXml = await containerFile.async('string');
    const container = new DOMParser().parseFromString(containerXml, 'application/xml');
    const rootfile = container.querySelector('rootfile');
    book.opfPath = rootfile?.getAttribute('full-path') || '';
    if (!book.opfPath || !zip.file(book.opfPath)) {
      throw { code: 'badepub', message: '책 정보(OPF)를 찾지 못했어요. 파일이 손상됐을 수 있어요.' };
    }
    book.opfDir = dirOf(book.opfPath);

    const opfXml = await zip.file(book.opfPath).async('string');
    book.opfDoc = new DOMParser().parseFromString(opfXml, 'application/xml');
    const opf = book.opfDoc;
    book.title = opf.getElementsByTagName('dc:title')[0]?.textContent?.trim()
      || Array.from(opf.getElementsByTagName('*')).find(el => el.localName === 'title')?.textContent?.trim()
      || book.fileName;

    for (const item of opf.querySelectorAll('manifest > item')) {
      book.manifest.set(item.getAttribute('id'), {
        href: item.getAttribute('href'),
        mediaType: item.getAttribute('media-type'),
        properties: item.getAttribute('properties') || '',
      });
    }
    const spineEl = opf.querySelector('spine');
    if (spineEl?.getAttribute('page-progression-direction') === 'rtl') book.vertical = true;

    for (const ref of opf.querySelectorAll('spine > itemref')) {
      const id = ref.getAttribute('idref');
      const item = book.manifest.get(id);
      if (!item || !XHTML_TYPES.has(item.mediaType)) continue;
      const path = resolvePath(book.opfDir, item.href);
      book.spine.push({ idref: id, path });
    }
    if (!book.spine.length) throw { code: 'badepub', message: '본문 챕터를 찾지 못했어요.' };

    // 챕터 목록 (지연 파싱: 열 때는 spine만, 본문은 진입 시 파싱)
    for (const s of book.spine) {
      const raw = zip.file(s.path);
      book.chapters.push({ path: s.path, title: '', doc: null, hadEffects: false, missing: !raw });
    }

    await book.#loadToc();
    // 목차 제목을 챕터에 매핑
    const byPath = new Map(book.chapters.map(c => [c.path, c]));
    for (const t of book.toc) {
      const ch = byPath.get(t.path);
      if (ch && !ch.title) ch.title = t.title;
    }
    book.chapters.forEach((c, i) => { if (!c.title) c.title = `${i + 1}번째 부분`; });

    // 이전에 이 툴로 만든 파일인지(효과 존재 여부) 가볍게 표시
    await Promise.all(book.chapters.map(async ch => {
      if (ch.missing) return;
      const txt = await zip.file(ch.path).async('string');
      ch.rawText = txt;
      ch.hadEffects = txt.includes('data-es=');
    }));
    return book;
  }

  async #loadToc() {
    // EPUB3 nav 우선
    for (const [, item] of this.manifest) {
      if ((item.properties || '').split(/\s+/).includes('nav')) {
        const path = resolvePath(this.opfDir, item.href);
        const f = this.zip.file(path);
        if (!f) break;
        const doc = new DOMParser().parseFromString(await f.async('string'), 'application/xhtml+xml');
        const nav = Array.from(doc.getElementsByTagName('nav')).find(n =>
          (n.getAttributeNS('http://www.idpf.org/2007/ops', 'type') || n.getAttribute('epub:type')) === 'toc')
          || doc.getElementsByTagName('nav')[0];
        if (nav) {
          for (const a of nav.getElementsByTagName('a')) {
            const href = a.getAttribute('href');
            if (!href) continue;
            this.toc.push({ title: a.textContent.trim(), path: resolvePath(dirOf(path), href) });
          }
          if (this.toc.length) return;
        }
      }
    }
    // EPUB2 NCX
    for (const [, item] of this.manifest) {
      if (item.mediaType === 'application/x-dtbncx+xml') {
        const path = resolvePath(this.opfDir, item.href);
        const f = this.zip.file(path);
        if (!f) break;
        const doc = new DOMParser().parseFromString(await f.async('string'), 'application/xml');
        for (const np of doc.getElementsByTagName('navPoint')) {
          const label = np.getElementsByTagName('text')[0]?.textContent?.trim() || '';
          const src = np.getElementsByTagName('content')[0]?.getAttribute('src');
          if (src) this.toc.push({ title: label, path: resolvePath(dirOf(path), src) });
        }
        return;
      }
    }
  }

  /** 챕터 XHTML을 파싱해 Document를 반환(캐시). 이 Document가 곧 저장 대상이다. */
  async chapterDoc(index) {
    const ch = this.chapters[index];
    if (!ch || ch.missing) return null;
    if (ch.doc) return ch.doc;
    const txt = ch.rawText ?? await this.zip.file(ch.path).async('string');
    let doc = new DOMParser().parseFromString(txt, 'application/xhtml+xml');
    if (doc.getElementsByTagName('parsererror').length) {
      // 규격이 느슨한 파일: HTML 파서로 복구
      doc = new DOMParser().parseFromString(txt, 'text/html');
    }
    ch.doc = doc;
    return doc;
  }

  /** zip 안 리소스를 Blob URL로 (이미지·CSS 미리보기용) */
  async resourceUrl(path, mediaType) {
    const f = this.zip.file(path);
    if (!f) return null;
    const buf = await f.async('arraybuffer');
    return URL.createObjectURL(new Blob([buf], { type: mediaType || 'application/octet-stream' }));
  }

  async resourceText(path) {
    const f = this.zip.file(path);
    return f ? f.async('string') : null;
  }

  /**
   * 스타일이 심어진 새 EPUB Blob 생성.
   * stylerCss: 전체 효과 CSS, fonts: [{family, files:[{filename, buffer}]}],
   * esManifest: 적용 내역 JSON 객체
   */
  async save({ stylerCss, fonts, esManifest }) {
    const out = new JSZip();
    // 규격: mimetype은 무압축·첫 엔트리
    out.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

    const cssPath = this.opfDir + 'styles/es-styler.css';
    const fontDir = this.opfDir + 'fonts/';

    const chapterByPath = new Map(this.chapters.map(c => [c.path, c]));

    // 원본 엔트리 복사 (수정된 챕터와 OPF는 새 내용으로)
    const entries = [];
    this.zip.forEach((path, entry) => { if (!entry.dir && path !== 'mimetype') entries.push(path); });

    for (const path of entries) {
      const ch = chapterByPath.get(path);
      if (ch?.doc) {
        out.file(path, this.#serializeChapter(ch, path, cssPath));
      } else if (path === this.opfPath) {
        continue; // 아래에서 새 OPF로
      } else {
        out.file(path, await this.zip.file(path).async('uint8array'));
      }
    }

    // 스타일·폰트 추가
    out.file(cssPath, stylerCss);
    const fontFiles = [];
    for (const font of fonts) {
      for (const f of font.files) {
        const p = fontDir + f.filename;
        out.file(p, f.buffer);
        fontFiles.push(p);
      }
    }

    out.file(this.opfPath, this.#patchedOpf(cssPath, fontFiles));
    out.file('es-manifest.json', JSON.stringify(esManifest, null, 2));

    return out.generateAsync({
      type: 'blob',
      mimeType: 'application/epub+zip',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });
  }

  /** 챕터 직렬화: 미리보기 전용 요소 제거·이미지 경로 복원 후 well-formed XHTML로 */
  #serializeChapter(ch, path, cssPath) {
    const root = ch.doc.documentElement.cloneNode(true);

    // 미리보기 전용 요소 제거
    for (const el of Array.from(root.querySelectorAll('[data-es-preview], .es-preview-only'))) el.remove();
    for (const el of Array.from(root.querySelectorAll('.es-selected-block'))) el.classList.remove('es-selected-block');
    for (const el of Array.from(root.querySelectorAll('[class=""]'))) el.removeAttribute('class');

    // 미리보기용 blob 경로 → 원본 경로 복원
    for (const el of Array.from(root.querySelectorAll('[data-es-orig-src]'))) {
      el.setAttribute('src', el.getAttribute('data-es-orig-src'));
      el.removeAttribute('data-es-orig-src');
    }
    for (const el of Array.from(root.querySelectorAll('[data-es-orig-href]'))) {
      el.setAttribute('href', el.getAttribute('data-es-orig-href'));
      el.removeAttribute('data-es-orig-href');
    }

    // 효과가 있으면 styler.css 링크 보장
    const XHTML_NS = 'http://www.w3.org/1999/xhtml';
    const hasEffects = !!root.querySelector('[data-es]');
    let head = root.querySelector('head');
    if (hasEffects) {
      if (!head) {
        head = ch.doc.createElementNS(XHTML_NS, 'head');
        root.insertBefore(head, root.firstChild);
      }
      const rel = relPath(dirOf(path), cssPath);
      const already = Array.from(head.querySelectorAll('link')).some(l =>
        (l.getAttribute('href') || '').endsWith('es-styler.css'));
      if (!already) {
        const link = ch.doc.createElementNS(XHTML_NS, 'link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', rel);
        head.appendChild(link);
      }
    }

    if (!root.getAttribute('xmlns')) root.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    let xml = new XMLSerializer().serializeToString(root);
    // XHTML에서 문제되는 HTML 파서 잔재 정리
    xml = xml.replace(/&nbsp;/g, ' ');
    if (!xml.startsWith('<?xml')) xml = '<?xml version="1.0" encoding="utf-8"?>\n' + xml;
    return xml;
  }

  #patchedOpf(cssPath, fontFiles) {
    const opf = this.opfDoc;
    const manifestEl = opf.querySelector('manifest');
    const ns = 'http://www.idpf.org/2007/opf';
    const existingHrefs = new Set(
      Array.from(manifestEl.querySelectorAll('item')).map(i => resolvePath(this.opfDir, i.getAttribute('href'))));

    const addItem = (path, id, mediaType) => {
      if (existingHrefs.has(path)) return;
      const item = opf.createElementNS(ns, 'item');
      item.setAttribute('id', id);
      item.setAttribute('href', relPath(this.opfDir, path));
      item.setAttribute('media-type', mediaType);
      manifestEl.appendChild(item);
      existingHrefs.add(path);
    };

    addItem(cssPath, 'es-styler-css', 'text/css');
    fontFiles.forEach((p, i) => {
      const ext = p.split('.').pop().toLowerCase();
      const mt = { woff2: 'font/woff2', woff: 'font/woff', ttf: 'application/vnd.ms-opentype', otf: 'application/vnd.ms-opentype' }[ext] || 'application/octet-stream';
      addItem(p, `es-font-${i}`, mt);
    });

    let xml = new XMLSerializer().serializeToString(opf);
    if (!xml.startsWith('<?xml')) xml = '<?xml version="1.0" encoding="utf-8"?>\n' + xml;
    return xml;
  }
}
