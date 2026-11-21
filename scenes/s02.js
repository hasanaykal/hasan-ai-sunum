export default async function init(el, { gsap, ScrollTrigger, SplitText }) {
  try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]); } catch (e) {}
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./s02.css', import.meta.url).href;
  document.head.appendChild(link);

  const rings = [
    { name: 'Yapay zekâ', r: 280, c: '#6ea8ff', d: 'İnsan zekâsıyla ilişkilendirilen algılama, akıl yürütme, öğrenme ve karar verme görevlerini makinelerle gerçekleştirme hedefi.' },
    { name: 'Makine öğrenmesi', r: 210, c: '#a692f2', d: 'Kuralların tek tek yazılması yerine veriden örüntü öğrenme.' },
    { name: 'Derin öğrenme', r: 140, c: '#e8c48a', d: 'Çok katmanlı sinir ağlarıyla karmaşık örüntüleri öğrenme.' },
    { name: 'Üretken AI', r: 70, c: '#d97757', d: 'Metin, kod, görsel, ses veya video gibi yeni içerikler üretme.' },
  ];
  const BOTTOM = 580;
  const svg = rings.map((g, i) => {
    const cy = BOTTOM - g.r;
    const ly = i === 3 ? cy + 6 : cy - g.r + 38;
    return `<g class="rg">
      <circle class="ring" cx="300" cy="${cy}" r="${g.r}" stroke="${g.c}" fill="${g.c}" transform="rotate(-90 300 ${cy})"/>
      <text class="rl${i === 3 ? ' sm' : ''}" x="300" y="${ly}" fill-opacity="0">${g.name}</text>
    </g>`;
  }).join('');
  const defs = rings.map((g) => `<li class="s02-def" style="--c:${g.c}"><h3>${g.name}</h3><p>${g.d}</p></li>`).join('');

  el.innerHTML = `
    <div class="s02-a"><div class="wrap">
      <p class="s02-quote">Yapay zekâ yalnızca ‘akıllı sohbet’ değil; üretim ve iş süreçlerini yeniden tasarlayan bir <strong>teknoloji katmanıdır</strong>.</p>
    </div></div>
    <div class="s02-b"><div class="wrap">
      <div class="s02-grid">
        <div class="s02-svgbox"><svg viewBox="0 0 600 600" role="img" aria-label="İç içe halkalar: Yapay zekâ, makine öğrenmesi, derin öğrenme, üretken AI">${svg}</svg></div>
        <div>
          <p class="eyebrow"><b>02</b> · Yapay zekâ nedir?</p>
          <ul class="s02-defs">${defs}</ul>
        </div>
      </div>
    </div><span class="source">[9]</span></div>`;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- A: kelime kelime açılan cümle ----------
  const quote = el.querySelector('.s02-quote');
  const split = new SplitText(quote, { type: 'words', wordsClass: 'w' });
  gsap.set(split.words, { opacity: 0.1, y: 14, filter: 'blur(5px)' });
  quote.querySelectorAll('strong .w').forEach((w) => w.classList.add('grad'));
  gsap.timeline({
    scrollTrigger: { trigger: '#s02 .s02-a', start: 'top top', end: reduced ? '+=60%' : '+=170%', pin: true, scrub: 0.7 },
  }).to(split.words, { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power3.out', stagger: 0.12, duration: 0.5 })
    .to({}, { duration: 0.8 });

  // ---------- B: 4 halka ----------
  const groups = [...el.querySelectorAll('.rg')];
  const items = [...el.querySelectorAll('.s02-def')];
  gsap.set(items, { opacity: 0.2, y: 14, filter: 'grayscale(1)' });
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#s02 .s02-b', start: 'top top', end: reduced ? '+=250%' : '+=520%', pin: true, scrub: 0.8 },
  });
  groups.forEach((g, i) => {
    const ring = g.querySelector('.ring'), label = g.querySelector('text');
    const t = i * 1.5;
    tl.fromTo(ring, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1, ease: 'power3.inOut' }, t)
      .to(ring, { fillOpacity: 0.07 + i * 0.015, duration: 0.8, ease: 'power2.out' }, t + 0.5)
      .to(label, { fillOpacity: 1, duration: 0.6, ease: 'power3.out' }, t + 0.7)
      .to(items[i], { opacity: 1, y: 0, filter: 'grayscale(0)', duration: 0.8, ease: 'power3.out' }, t + 0.35);
    if (i > 0) tl.to(items[i - 1], { opacity: 0.72, duration: 0.6, ease: 'power2.out' }, t + 0.35);
  });
  tl.to({}, { duration: 3.6 });
}
