// s06 — İş gücü etkisi: 4 silüet, biri turuncuya döner, 1 / 4.
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
  await loadCss('./s06.css');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fig = (i) => `
    <svg class="s06-fig" viewBox="0 0 100 210" data-i="${i}" aria-hidden="true">
      <circle class="s06-ring" cx="50" cy="104" r="46" fill="none" stroke="#d97757" stroke-width="1.5" opacity="0"/>
      <circle class="s06-head" cx="50" cy="42" r="23"/>
      <path class="s06-body" d="M12 210 V132 Q12 90 50 90 Q88 90 88 132 V210 Z"/>
    </svg>`;

  el.innerHTML = `
  <div class="s06-pin">
    <div class="s06-glow" aria-hidden="true"></div>
    <header class="wrap s06-head-wrap">
      <p class="eyebrow"><b>06</b> · İş gücü</p>
      <h2 class="h2 s06-title">AI hangi işleri <em>'bitiriyor'</em>?</h2>
      <p class="lead s06-lead">Daha doğru ifade: bazı görevleri otomatikleştiriyor, bazı görevleri ise AI kullanan çalışanların elinde yeniden şekillendiriyor.</p>
    </header>

    <div class="wrap s06-row">
      <div class="s06-figs">${[0, 1, 2, 3].map(fig).join('')}</div>
      <div class="s06-counter" aria-label="1 / 4">
        <span class="s06-num"><span class="s06-digits"><i>0</i><i>1</i></span></span>
        <span class="s06-slash">/ 4</span>
      </div>
    </div>

    <div class="wrap s06-texts">
      <p class="s06-t s06-t1">Dünya genelinde her dört çalışandan biri <em>GenAI'ye</em> bir ölçüde maruz bir meslekte.</p>
      <p class="s06-t s06-t2">Çoğu iş için 'dönüşüm', tamamen yok oluştan daha olasıdır.</p>
    </div>
    <span class="source s06-source">ILO [10]</span>
  </div>`;

  const $ = (s) => el.querySelector(s);
  const $$ = (s) => [...el.querySelectorAll(s)];
  const figs = $$('.s06-fig');
  const HIT = 2;
  const hit = figs[HIT];

  gsap.set(figs, { autoAlpha: 0, y: 70, scale: 0.9 });
  gsap.set(['.s06-t1', '.s06-t2'], { autoAlpha: 0, y: 40 });
  gsap.set('.s06-counter', { autoAlpha: 0, x: 40 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: el, start: 'top top', end: `+=${reduce ? 250 : 480}%`,
      pin: $('.s06-pin'), scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
    },
  });

  tl.from('.s06-head-wrap > *', { y: 50, autoAlpha: 0, stagger: 0.16, duration: 1, ease: 'power3.out' }, 0)
    .to(figs, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.28, duration: 1, ease: 'power3.out' }, 1)
    .to('.s06-counter', { autoAlpha: 1, x: 0, duration: 0.9, ease: 'power3.out' }, 2)
    // Bir silüet turuncuya döner
    .to(hit.querySelectorAll('.s06-head, .s06-body'), { fill: '#d97757', duration: 0.9, ease: 'power2.inOut' }, 3.4)
    .to(hit, { scale: 1.1, y: -14, filter: 'drop-shadow(0 0 34px rgba(217,119,87,.75))', duration: 0.9, ease: 'power3.out' }, 3.4)
    .fromTo(hit.querySelector('.s06-ring'), { autoAlpha: 0.9, scale: 0.6, transformOrigin: '50% 50%' },
      { autoAlpha: 0, scale: 1.7, duration: 1.1, ease: 'power2.out' }, 3.5)
    .to(figs.filter((f) => f !== hit), { opacity: 0.55, duration: 0.8 }, 3.6)
    .to('.s06-digits', { yPercent: -50, duration: 0.7, ease: 'power3.inOut' }, 3.6)
    .to('.s06-num', { color: '#d97757', textShadow: '0 0 40px rgba(217,119,87,.6)', duration: 0.7 }, 3.6)
    // Metin 1
    .to('.s06-t1', { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' }, 4.4)
    .to({}, { duration: 1.2 }, 5.4)
    .to('.s06-t1', { autoAlpha: 0, y: -40, duration: 0.8, ease: 'power3.in' }, 6.6)
    // Metin 2
    .to('.s06-t2', { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' }, 7.2)
    .to({}, { duration: 1.4 }, 8.2);
}
