// s07 — Sınırlar: glitch / RGB kayması girişi, ardından 6 madde.
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
  await loadCss('./s07.css');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const items = [
    ['Halüsinasyon', 'Gerçekmiş gibi yanlış bilgi üretebilir.'],
    ['Önyargı', 'Eğitim verisindeki kalıpları taşıyabilir.'],
    ['Gizlilik', 'Hassas veri ve erişim izinleri yönetilmelidir.'],
    ['Güvenlik', 'Kötüye kullanım, prompt injection ve veri sızıntısı riski.'],
    ['Sorumluluk', 'Son karar ve hesap verebilirlik insanda kalır.'],
    ['Maliyet', 'Model, altyapı ve entegrasyon maliyetleri vardır.'],
  ];
  const TITLE = 'Yapay zekânın sınırları';

  el.innerHTML = `
  <div class="s07-pin">
    <div class="s07-scan" aria-hidden="true"></div>
    <div class="s07-noise" aria-hidden="true"></div>
    <div class="wrap s07-wrap">
      <header class="s07-head">
        <p class="eyebrow"><b>07</b> · Sınırlar</p>
        <h2 class="h2 s07-title" data-text="${TITLE}">${TITLE}</h2>
        <p class="lead s07-lead">Etkileyici çıktı, otomatik olarak doğru veya güvenli çıktı anlamına gelmez.</p>
      </header>
      <ol class="s07-list">
        ${items.map(([t, d], i) => `
        <li class="card s07-item">
          <span class="s07-n">0${i + 1}</span>
          <h3 class="s07-h" data-text="${t}">${t}</h3>
          <p class="s07-d">${d}</p>
        </li>`).join('')}
      </ol>
    </div>
    <span class="source s07-source">[4][5][9]</span>
  </div>`;

  const $ = (s) => el.querySelector(s);
  const $$ = (s) => [...el.querySelectorAll(s)];
  const title = $('.s07-title');
  const head = $$('.s07-head > *');
  const lead = $('.s07-lead');
  const eyebrow = $('.s07-head .eyebrow');
  const scan = $('.s07-scan');
  const cards = $$('.s07-item');

  // Başlangıç: başlık gizli, glitch ile belirir
  gsap.set(title, { autoAlpha: 0 });
  gsap.set([lead, eyebrow], { autoAlpha: 0 });
  gsap.set(cards, { autoAlpha: 0, y: 60 });
  gsap.set(scan, { autoAlpha: 0 });

  let played = false;
  let glitchTl = null;
  const glitch = () => {
    if (glitchTl) glitchTl.kill();
    if (reduce) {
      gsap.to([title, lead, eyebrow], { autoAlpha: 1, duration: 0.6 });
      return;
    }
    title.classList.add('is-glitch');
    glitchTl = gsap.timeline({ onComplete: () => title.classList.remove('is-glitch') });
    glitchTl
      .set(scan, { autoAlpha: 1, yPercent: -100 })
      .to(scan, { yPercent: 1100, duration: 0.9, ease: 'power2.in' }, 0)
      .to(eyebrow, { autoAlpha: 1, duration: 0.3 }, 0.1)
      // sinyal bozulması: titreyen opaklık + sarsıntı
      .to(title, {
        keyframes: [
          { autoAlpha: 1, x: -18, skewX: 12, duration: 0.05 },
          { autoAlpha: 0.2, x: 14, skewX: -8, duration: 0.05 },
          { autoAlpha: 1, x: -6, skewX: 4, duration: 0.06 },
          { autoAlpha: 0.4, x: 20, skewX: -14, duration: 0.05 },
          { autoAlpha: 1, x: -10, skewX: 6, duration: 0.07 },
          { autoAlpha: 0.7, x: 6, skewX: 0, duration: 0.05 },
          { autoAlpha: 1, x: 0, skewX: 0, duration: 0.2, ease: 'power3.out' },
        ],
      }, 0.15)
      .to(lead, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 0.8);
  };
  const reset = () => {
    if (glitchTl) glitchTl.kill();
    title.classList.remove('is-glitch');
    gsap.set(title, { autoAlpha: 0, x: 0, skewX: 0 });
    gsap.set([lead, eyebrow], { autoAlpha: 0 });
    played = false;
  };

  ScrollTrigger.create({
    trigger: el, start: 'top 45%', end: 'bottom top',
    onEnter: () => { if (!played) { played = true; glitch(); } },
    onEnterBack: () => { if (!played) { played = true; glitch(); } },
    onLeaveBack: reset,
  });

  // Maddeler: pin içinde scrub ile sırayla gelir, her biri kısa RGB kaymasıyla oturur
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: el, start: 'top top', end: `+=${reduce ? 200 : 340}%`,
      pin: $('.s07-pin'), scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
    },
  });
  tl.to({}, { duration: 0.6 }); // glitch'e nefes payı
  cards.forEach((c, i) => {
    const at = 0.6 + i * 0.9;
    tl.to(c, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, at)
      .fromTo(c.querySelector('.s07-h'),
        { textShadow: '-9px 0 rgba(255,40,80,.85), 9px 0 rgba(0,220,255,.85)' },
        { textShadow: '0px 0 rgba(255,40,80,0), 0px 0 rgba(0,220,255,0)', duration: 0.7, ease: 'power3.out' }, at + 0.05)
      .fromTo(c.querySelector('.s07-n'), { color: '#ffffff' }, { color: '#d97757', duration: 0.6 }, at + 0.1);
  });
  tl.to({}, { duration: 1.2 });
}
