// s05 — Yetenekler (6 kart), akan ışık bandı, sektörler (dev kelimeler).
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
  await loadCss('./s05.css');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cards = [
    ['Metin', ['özetleme', 'sınıflandırma', 'taslak üretme']],
    ['Kod', ['kod yazma', 'hata bulma', 'test üretme']],
    ['Veri', ['tablo analizi', 'örüntü bulma', 'raporlama']],
    ['Müşteri', ['soru yanıtlama', 'çağrı özeti', 'kişiselleştirme']],
    ['Araştırma', ['kaynak tarama', 'karşılaştırma', 'hipotez üretme']],
    ['Operasyon', ['talep tahmini', 'kalite kontrol', 'planlama desteği']],
  ];
  const flow = ['tahmin', 'planlama', 'kalite', 'stok', 'bakım', 'müşteri hizmeti'];
  const sectors = ['Üretim', 'Finans', 'Sağlık', 'Medya & içerik', 'Yazılım', 'Eğitim'];

  el.innerHTML = `
  <div class="s05-glow s05-glow--a" aria-hidden="true"></div>
  <div class="s05-glow s05-glow--b" aria-hidden="true"></div>

  <div class="wrap s05-intro">
    <p class="eyebrow"><b>05</b> · Yetenekler</p>
    <h2 class="h2 s05-title">Yapay zekânın bugün <em>verimli</em> olduğu işler</h2>
    <p class="lead s05-lead">En güçlü kullanım alanları genellikle dijital, tekrarlanabilir, ölçülebilir ve insan denetimiyle doğrulanabilir görevlerdir.</p>
  </div>

  <div class="wrap s05-grid">
    ${cards.map(([t, items], i) => `
    <article class="card s05-card">
      <span class="s05-num">0${i + 1}</span>
      <h3 class="s05-card-h">${t}</h3>
      <ul class="s05-chips">${items.map((x) => `<li>${x}</li>`).join('')}</ul>
    </article>`).join('')}
  </div>

  <div class="s05-band" aria-label="${flow.join(' → ')}">
    <div class="s05-band-track">
      <div class="s05-band-line"></div>
      <div class="s05-band-fill"></div>
      <div class="s05-band-dot"></div>
      ${flow.map((f, i) => `<div class="s05-node" style="left:${(i / (flow.length - 1)) * 100}%"><i></i><span>${f}</span></div>`).join('')}
    </div>
  </div>

  <div class="s05-sect">
    <div class="wrap s05-sect-head">
      <p class="eyebrow"><b>05</b> · Sektörler</p>
      <h3 class="s05-sect-title">Hangi sektörler dönüşüyor?</h3>
    </div>
    <div class="s05-marquee"><div class="s05-track">
      ${sectors.map((s, i) => `<span class="s05-word${i % 2 ? ' is-outline' : ''}">${s}</span>`).join('<span class="s05-sep" aria-hidden="true">✦</span>')}
    </div></div>
    <div class="wrap s05-notes">
      <p class="s05-note s05-note--a">'Sektör bitti' demek yerine, sektör içindeki görevlerin hangilerinin otomasyona veya desteklenmeye açık olduğunu sormak daha doğrudur.</p>
      <p class="s05-note s05-note--b">İnsan sorumluluğu, alan bilgisi ve veri güvenliği ortadan kalkmaz; iş akışının tasarımı değişir.</p>
    </div>
    <span class="source s05-source">[9][10]</span>
  </div>`;

  const $ = (s) => el.querySelector(s);
  const $$ = (s) => [...el.querySelectorAll(s)];

  // Başlık girişi
  gsap.from($$('.s05-intro > *'), {
    y: 60, autoAlpha: 0, stagger: 0.14, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.s05-intro', start: 'top 82%', toggleActions: 'play none none reverse' },
  });

  // Kartlar: kaydırdıkça yüzerek gelir, sütuna göre farklı mesafe (paralaks hissi)
  $$('.s05-card').forEach((card, i) => {
    const col = i % 3;
    gsap.fromTo(card,
      { y: 70 + col * 40, autoAlpha: 0, scale: 0.95 },
      {
        y: 0, autoAlpha: 1, scale: 1, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 98%', end: 'top 58%', scrub: 0.8 },
      });
    // Fare ile ışık takibi
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  });

  // Işık bandı: nokta soldan sağa akar, düğümler sırayla yanar
  const dot = $('.s05-band-dot');
  const fill = $('.s05-band-fill');
  const nodes = $$('.s05-node');
  const bandTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: '.s05-band', start: 'top 88%', end: 'top 38%', scrub: 0.8 },
  });
  bandTl.fromTo(dot, { left: '0%' }, { left: '100%', duration: 1 }, 0)
    .fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
  nodes.forEach((n, i) => {
    const at = (i / (nodes.length - 1)) * 0.98;
    bandTl.to(n, { '--on': 1, duration: 0.08, ease: 'power2.out' }, at)
      .fromTo(n.querySelector('span'), { autoAlpha: 0.35, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'power2.out' }, at);
  });
  gsap.from('.s05-band-track', {
    autoAlpha: 0, y: 40, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.s05-band', start: 'top 92%', toggleActions: 'play none none reverse' },
  });

  // Sektörler: pinli, dev kelimeler soldan sağa değil, sağdan sola geçer
  const track = $('.s05-track');
  const sectTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.s05-sect', start: 'top top', end: `+=${reduce ? 220 : 380}%`,
      pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
    },
  });
  sectTl.fromTo(track,
    { x: () => window.innerWidth * 0.92 },
    { x: () => -(track.scrollWidth + window.innerWidth * 0.04 - window.innerWidth * 0.28), duration: 4 }, 0)
    .fromTo('.s05-sect-head > *', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.5, ease: 'power3.out' }, 0)
    .fromTo('.s05-note', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.35, duration: 0.6, ease: 'power3.out' }, 3.1);

  // Parlayan kelime vurgusu: ekranın ortasındaki kelime dolu, diğerleri soluk
  const words = $$('.s05-word');
  const hi = () => {
    const mid = window.innerWidth / 2;
    let best = null; let bd = 1e9;
    for (const w of words) {
      const r = w.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bd) { bd = d; best = w; }
    }
    words.forEach((w) => w.classList.toggle('is-hot', w === best));
  };
  ScrollTrigger.create({ trigger: '.s05-sect', start: 'top top', end: `+=${reduce ? 220 : 380}%`, onUpdate: hi, onRefresh: hi });
}
