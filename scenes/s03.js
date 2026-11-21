export default async function init(el, { gsap, ScrollTrigger }) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./s03.css', import.meta.url).href;
  document.head.appendChild(link);

  const icons = {
    neuron: '<circle cx="32" cy="32" r="7"/><path d="M26 28 L10 14"/><path d="M26 36 L10 50"/><path d="M30 25 L24 8"/><path d="M30 39 L24 56"/><path d="M39 32 H58"/><circle cx="58" cy="32" r="2"/><circle cx="10" cy="14" r="2"/><circle cx="10" cy="50" r="2"/>',
    question: '<path d="M20 24 C20 10 44 10 44 24 C44 34 32 34 32 42"/><circle cx="32" cy="53" r="2.2"/>',
    dartmouth: '<circle cx="24" cy="26" r="14"/><circle cx="40" cy="26" r="14"/><circle cx="32" cy="40" r="14"/>',
    rules: '<circle cx="32" cy="10" r="4"/><path d="M30 14 L16 30"/><path d="M34 14 L48 30"/><circle cx="14" cy="32" r="3"/><circle cx="50" cy="32" r="3"/><path d="M12 35 L7 52"/><path d="M16 35 L22 52"/><path d="M48 35 L42 52"/><path d="M52 35 L57 52"/><circle cx="7" cy="54" r="2"/><circle cx="22" cy="54" r="2"/><circle cx="42" cy="54" r="2"/><circle cx="57" cy="54" r="2"/>',
    layers: '<circle cx="10" cy="16" r="3"/><circle cx="10" cy="32" r="3"/><circle cx="10" cy="48" r="3"/><circle cx="32" cy="10" r="3"/><circle cx="32" cy="26" r="3"/><circle cx="32" cy="42" r="3"/><circle cx="32" cy="58" r="3"/><circle cx="54" cy="24" r="3"/><circle cx="54" cy="40" r="3"/><path d="M13 16 L29 10 M13 16 L29 26 M13 32 L29 26 M13 32 L29 42 M13 48 L29 42 M13 48 L29 58 M13 32 L29 10 M35 10 L51 24 M35 26 L51 24 M35 26 L51 40 M35 42 L51 40 M35 58 L51 40"/>',
    attention: '<circle cx="8" cy="52" r="2.4"/><circle cx="20" cy="52" r="2.4"/><circle cx="32" cy="52" r="2.4"/><circle cx="44" cy="52" r="2.4"/><circle cx="56" cy="52" r="2.4"/><path d="M32 50 Q32 6 8 50"/><path d="M32 50 Q34 22 56 50"/><path d="M32 50 Q27 32 20 50"/><path d="M32 50 Q38 40 44 50"/>',
    chat: '<path d="M8 10 H56 V42 H30 L18 55 V42 H8 Z"/><path d="M18 22 H46"/><path d="M18 31 H36"/>',
  };
  const stops = [
    { y: '1943', t: 'McCulloch–Pitts', d: 'Yapay nöron', i: 'neuron' },
    { y: '1950', t: 'Turing testi', d: 'Makineler düşünebilir mi?', i: 'question' },
    { y: '1956', t: 'Dartmouth', d: 'AI alanı adlandırıldı', i: 'dartmouth' },
    { y: '1980\'ler', t: 'Uzman sistemler', d: 'Kural tabanlı dalga', i: 'rules' },
    { y: '2012', t: 'Derin öğrenme', d: 'Görüntü tanımada sıçrama', i: 'layers' },
    { y: '2017', t: 'Transformer', d: 'Attention is All You Need', i: 'attention' },
    { y: '2022+', t: 'Üretken AI dalgası', d: 'ChatGPT (2022), Claude (2023)', i: 'chat' },
  ];
  const stopHTML = stops.map((s) => `
    <div class="s03-stop">
      <div class="s03-dot"></div>
      <div class="s03-year"><span>${s.y}</span></div>
      <div class="s03-body">
        <svg class="s03-ic" viewBox="0 0 64 64" aria-hidden="true">${icons[s.i]}</svg>
        <h3 class="h3">${s.t}</h3>
        <p>${s.d}</p>
      </div>
    </div>`).join('');

  el.innerHTML = `
    <div class="s03-pin">
      <div class="s03-track">
        <div class="s03-line"></div><div class="s03-fill"></div>
        <div class="s03-intro"><div class="wrap">
          <p class="eyebrow"><b>03</b> · Zaman çizelgesi</p>
          <h2 class="h2">Yapay zekânın gelişimi: dört büyük dalga</h2>
          <p class="lead">Bugünkü üretken modeller, tek bir buluşun değil; onlarca yıllık araştırma ve altyapı birikiminin sonucudur.</p>
          <div class="s03-scroll"><span>Kaydır</span><span>→</span></div>
        </div></div>
        ${stopHTML}
        <div class="s03-end"></div>
      </div>
      <span class="source">[1][2][9][11][14]</span>
    </div>`;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pin = el.querySelector('.s03-pin');
  const track = el.querySelector('.s03-track');
  const fill = el.querySelector('.s03-fill');
  const dist = () => Math.max(0, track.scrollWidth - innerWidth);

  // Başlangıç durumları
  const stopEls = [...el.querySelectorAll('.s03-stop')];
  stopEls.forEach((s) => {
    gsap.set(s.querySelector('.s03-year span'), { yPercent: 40, opacity: 0, filter: 'blur(12px)' });
    gsap.set(s.querySelectorAll('.s03-body > *'), { opacity: 0, y: 24 });
    gsap.set(s.querySelectorAll('.s03-ic > *'), { drawSVG: '0%' });
  });
  gsap.set('#s03 .s03-intro .wrap > *', { opacity: 0, y: 30 });
  gsap.to('#s03 .s03-intro .wrap > *', {
    opacity: 1, y: 0, duration: reduced ? 0.4 : 1.4, ease: 'expo.out', stagger: 0.12,
    scrollTrigger: { trigger: el, start: 'top 60%', toggleActions: 'play none none none' },
  });

  const tween = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: pin, start: 'top top', end: () => '+=' + (dist() * (reduced ? 0.8 : 1.15) + innerHeight * 0.3),
      pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
    },
  });
  tween.to(track, { x: () => -dist() }, 0)
    .fromTo(fill, { scaleX: () => (innerWidth * 0.55) / track.scrollWidth }, { scaleX: 1 }, 0);

  // Duraklar: her biri ekranın sağ tarafına girince açılır (yatay konuma göre)
  const reveals = stopEls.map((s) => {
    const year = s.querySelector('.s03-year span');
    const body = s.querySelectorAll('.s03-body > *');
    const draws = s.querySelectorAll('.s03-ic > *');
    return gsap.timeline({ paused: true })
      .to(year, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: reduced ? 0.3 : 1.3, ease: 'expo.out' }, 0)
      .to(body, { opacity: 1, y: 0, duration: reduced ? 0.3 : 1, ease: 'power3.out', stagger: 0.1 }, 0.15)
      .to(draws, { drawSVG: '100%', duration: reduced ? 0.3 : 1.4, ease: 'power2.inOut', stagger: 0.04 }, 0.2);
  });
  const states = stopEls.map(() => false);
  const check = () => {
    const x = gsap.getProperty(track, 'x');
    stopEls.forEach((s, i) => {
      const on = s.offsetLeft + x < innerWidth * 0.78;
      if (on !== states[i]) {
        states[i] = on;
        s.classList.toggle('on', on);
        on ? reveals[i].play() : reveals[i].reverse();
      }
    });
  };
  tween.eventCallback('onUpdate', check);
  ScrollTrigger.addEventListener('refresh', check);
  check();
}
