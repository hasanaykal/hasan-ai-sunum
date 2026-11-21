// s04 — Transformer (şov sahnesi): attention eğrileri scroll ile çizilir, üç sütun, formül.
const loadCss = (href) => new Promise((res) => {
  const url = new URL(href, import.meta.url).href;
  if (document.querySelector(`link[data-scene-css="${url}"]`)) return res();
  const l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = url; l.dataset.sceneCss = url;
  l.onload = l.onerror = () => res();
  document.head.appendChild(l);
  setTimeout(res, 2500);
});

export default async function init(el, { gsap, ScrollTrigger }) {
  await loadCss('./s04.css');
  try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]); } catch (e) { /* yok say */ }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cümle: "o" kelimesi diğerlerine farklı ağırlıkla bakar.
  const words = ['Hayvan', 'sokağı', 'geçmedi', 'çünkü', 'o', 'çok', 'yorgundu'];
  const QUERY = 4;
  const weights = { 0: 0.95, 6: 0.72, 5: 0.4, 2: 0.3, 1: 0.22, 3: 0.12 };
  const order = [0, 6, 5, 2, 1, 3]; // çizim sırası (ağırlığa göre)

  el.innerHTML = `
  <div class="s04-pin">
    <div class="s04-glow" aria-hidden="true"></div>
    <header class="wrap s04-head">
      <p class="eyebrow"><b>04</b> · Transformer</p>
      <h2 class="h2 s04-title">Transformer <em>neden</em> kritik?</h2>
      <p class="lead s04-lead">2017'de yayımlanan 'Attention Is All You Need' çalışması, güncel büyük dil modellerinin temel mimarisini şekillendirdi.</p>
    </header>

    <div class="s04-stage">
      <div class="s04-sentence" aria-label="${words.join(' ')}">
        ${words.map((w, i) => `<span class="s04-w${i === QUERY ? ' is-q' : ''}" data-i="${i}">${w}</span>`).join('')}
      </div>
      <svg class="s04-svg" aria-hidden="true">
        <defs>
          <linearGradient id="s04-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#6ea8ff"/>
            <stop offset="1" stop-color="#d97757"/>
          </linearGradient>
          <filter id="s04-blur" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="5"/>
          </filter>
        </defs>
        <g class="s04-glows"></g>
        <g class="s04-curves"></g>
        <g class="s04-dots"></g>
        <g class="s04-labels"></g>
      </svg>
      <p class="s04-caption">«o» kelimesi, cümledeki diğer kelimelere farklı ağırlıkla dikkat eder.</p>
    </div>

    <div class="wrap s04-cols">
      <article class="card s04-col s04-col--before">
        <p class="eyebrow">Öncesi</p>
        <ul>
          <li>Sıralı ve tekrarlayan mimariler</li>
          <li>Uzun bağlamı taşımak daha zordu</li>
          <li>Eğitimde paralelleştirme sınırlıydı</li>
        </ul>
      </article>
      <article class="card s04-col s04-col--mid">
        <p class="eyebrow">Transformer</p>
        <ul>
          <li>Attention mekanizmasıyla girdinin önemli parçalarını ilişkilendirir</li>
          <li>Daha fazla paralelleştirme sağlar</li>
          <li>Büyük veri ve hesaplama gücüyle ölçeklenebilir</li>
        </ul>
      </article>
      <article class="card s04-col s04-col--after">
        <p class="eyebrow">Sonuç</p>
        <ul>
          <li>Büyük dil modelleri</li>
          <li>Kod, metin ve çok adımlı akıl yürütme</li>
          <li>Üretken AI ürünlerinin hızlanması</li>
        </ul>
      </article>
    </div>

    <div class="s04-formula" aria-label="Veri + hesaplama + mimari + geri bildirim = model yeteneği">
      <div class="s04-f-line">
        <span class="s04-f t">Veri</span><span class="s04-f op">+</span>
        <span class="s04-f t">hesaplama</span><span class="s04-f op">+</span>
        <span class="s04-f t">mimari</span><span class="s04-f op">+</span>
        <span class="s04-f t">geri bildirim</span>
      </div>
      <div class="s04-f-line s04-f-res"><span class="s04-f op eq">=</span> <span class="s04-f res grad">model yeteneği</span></div>
    </div>

    <span class="source s04-source">[2][9]</span>
  </div>`;

  const $ = (s, r = el) => r.querySelector(s);
  const $$ = (s, r = el) => [...r.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';

  const pin = $('.s04-pin');
  const stage = $('.s04-stage');
  const svg = $('.s04-svg');
  const wEls = $$('.s04-w');
  const gCurves = $('.s04-curves');
  const gGlows = $('.s04-glows');
  const gDots = $('.s04-dots');
  const gLabels = $('.s04-labels');

  const make = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent.appendChild(n);
    return n;
  };

  // Eğri geometrisini kelime konumlarından üret
  const curves = order.map((i) => {
    const w = weights[i];
    const sw = 1.2 + w * 6;
    const op = 0.25 + w * 0.75;
    const path = make('path', {
      fill: 'none', stroke: 'url(#s04-grad)', 'stroke-width': sw.toFixed(2),
      'stroke-linecap': 'round', opacity: op.toFixed(2),
    }, gCurves);
    const glow = make('path', {
      fill: 'none', stroke: 'url(#s04-grad)', 'stroke-width': (sw * 2.4).toFixed(2),
      'stroke-linecap': 'round', opacity: (op * 0.55).toFixed(2), filter: 'url(#s04-blur)',
    }, gGlows);
    const dot = make('circle', { r: (3 + w * 5).toFixed(1), fill: '#fff', class: 's04-dot' }, gDots);
    const label = make('text', { class: 's04-lab', 'text-anchor': 'middle' }, gLabels);
    label.textContent = w.toFixed(2).replace('.', ',');
    return { i, w, path, glow, dot, label };
  });
  const qDot = make('circle', { r: 6, fill: '#d97757', class: 's04-dot s04-qdot' }, gDots);

  let tl = null;
  let lastW = 0;
  const grad = $('#s04-grad');
  const build = () => {
    const sr = stage.getBoundingClientRect();
    const changed = Math.abs(sr.width - lastW) > 1;
    lastW = sr.width;
    grad.setAttribute('x2', sr.width);
    svg.setAttribute('width', sr.width);
    svg.setAttribute('height', sr.height);
    svg.setAttribute('viewBox', `0 0 ${sr.width} ${sr.height}`);
    const pts = wEls.map((w) => {
      const r = w.getBoundingClientRect();
      return { x: r.left - sr.left + r.width / 2, y: r.top - sr.top - 14 };
    });
    const q = pts[QUERY];
    qDot.setAttribute('cx', q.x); qDot.setAttribute('cy', q.y);
    curves.forEach((c) => {
      const t = pts[c.i];
      const dist = Math.abs(t.x - q.x);
      const peak = 46 + dist * 0.26;
      const cx = (q.x + t.x) / 2;
      const cy = q.y - peak * 2;
      const d = `M ${q.x.toFixed(1)} ${q.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${t.x.toFixed(1)} ${t.y.toFixed(1)}`;
      c.path.setAttribute('d', d);
      c.glow.setAttribute('d', d);
      c.dot.setAttribute('cx', t.x); c.dot.setAttribute('cy', t.y);
      c.label.setAttribute('x', cx); c.label.setAttribute('y', q.y - peak - 14);
    });
    return changed;
  };
  build();

  // Başlangıç durumları
  gsap.set($$('.s04-cols, .s04-formula, .s04-col, .s04-f'), { autoAlpha: 0 });
  gsap.set($$('.s04-col li'), { autoAlpha: 0, y: 14 });
  gsap.set([...$$('.s04-dot'), ...$$('.s04-lab')], { autoAlpha: 0 });
  gsap.set($('.s04-caption'), { autoAlpha: 0 });

  const endPct = reduce ? 360 : 700;
  tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: el, start: 'top top', end: `+=${endPct}%`,
      pin: pin, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
    },
  });

  // 0) Giriş
  tl.fromTo($$('.s04-head > *'), { y: 46, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.18, duration: 1, ease: 'power3.out' }, 0)
    .fromTo(wEls, { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 1, ease: 'power3.out' }, 0.5)
    .to($('.s04-caption'), { autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 1.6)
    .to(qDot, { autoAlpha: 1, duration: 0.5 }, 1.7)
    .fromTo(qDot, { attr: { r: 0 } }, { attr: { r: 7 }, duration: 0.7, ease: 'expo.out' }, 1.7)
    .to(wEls[QUERY], { color: '#d97757', textShadow: '0 0 38px rgba(217,119,87,.75)', duration: 0.8, ease: 'power2.out' }, 1.7);

  // 1) Attention eğrileri sırayla çizilir
  curves.forEach((c, k) => {
    const at = 2.4 + k * 0.95;
    tl.fromTo([c.path, c.glow], { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.25, ease: 'power2.inOut' }, at)
      .to(c.dot, { autoAlpha: 1, duration: 0.3 }, at + 0.95)
      .fromTo(c.dot, { attr: { r: 0 } }, { attr: { r: 3 + c.w * 5 }, duration: 0.6, ease: 'back.out(3)' }, at + 0.95)
      .to(c.label, { autoAlpha: 0.9, duration: 0.5, ease: 'power2.out' }, at + 1.0)
      .to(wEls[c.i], {
        color: '#ffffff',
        textShadow: `0 0 ${14 + c.w * 40}px rgba(110,168,255,${(0.25 + c.w * 0.6).toFixed(2)})`,
        duration: 0.7, ease: 'power2.out',
      }, at + 0.9);
  });
  const t1 = 2.4 + order.length * 0.95 + 1.2; // ≈ 9.3
  tl.to({}, { duration: 0.6 }, t1);

  // 2) Sahne çıkar, üç sütun girer
  const t2 = t1 + 0.6;
  tl.to([stage], { y: -80, autoAlpha: 0, duration: 0.9, ease: 'power3.in' }, t2)
    .to($('.s04-lead'), { autoAlpha: 0, y: -20, duration: 0.6, ease: 'power2.in' }, t2)
    .set($('.s04-cols'), { autoAlpha: 1 }, t2 + 0.7);
  $$('.s04-col').forEach((col, k) => {
    const a = t2 + 0.8 + k * 1.25;
    tl.fromTo(col, { y: 90, autoAlpha: 0, rotateX: 12 }, { y: 0, autoAlpha: 1, rotateX: 0, duration: 1.1, ease: 'power3.out', transformPerspective: 900 }, a)
      .to($$('li', col), { autoAlpha: 1, y: 0, stagger: 0.22, duration: 0.7, ease: 'power3.out' }, a + 0.55);
  });
  const t3 = t2 + 0.8 + 2 * 1.25 + 2.1 + 0.8;

  // 3) Sütunlar ve başlık çıkar, formül birleşir
  tl.to([$('.s04-cols'), $('.s04-head')], { autoAlpha: 0, y: -50, duration: 1, ease: 'power3.in' }, t3)
    .set($('.s04-formula'), { autoAlpha: 1 }, t3 + 0.9);
  const parts = $$('.s04-f');
  parts.forEach((p, k) => {
    const isRes = p.classList.contains('res');
    tl.fromTo(p,
      { y: isRes ? 40 : 60, autoAlpha: 0, scale: isRes ? 0.86 : 0.92 },
      { y: 0, autoAlpha: 1, scale: 1, duration: isRes ? 1.2 : 0.8, ease: isRes ? 'expo.out' : 'power3.out' },
      t3 + 1 + k * 0.6);
  });
  const res = $('.s04-f.res');
  tl.fromTo(res, { filter: 'drop-shadow(0 0 0px rgba(217,119,87,0))' },
    { filter: 'drop-shadow(0 0 36px rgba(217,119,87,.55))', duration: 1, ease: 'power2.out' }, t3 + 1 + parts.length * 0.6)
    .to({}, { duration: 1.2 });

  // Yeniden ölçümde eğrileri tekrar hesapla
  ScrollTrigger.addEventListener('refreshInit', () => { if (build() && tl) tl.invalidate(); });

  // Arka plan ışıması fareye hafifçe tepki verir
  const glow = $('.s04-glow');
  if (!reduce && glow) {
    const gx = gsap.quickTo(glow, 'x', { duration: 1.2, ease: 'power3.out' });
    const gy = gsap.quickTo(glow, 'y', { duration: 1.2, ease: 'power3.out' });
    window.addEventListener('pointermove', (e) => {
      gx((e.clientX / innerWidth - 0.5) * 120);
      gy((e.clientY / innerHeight - 0.5) * 80);
    }, { passive: true });
  }
}
