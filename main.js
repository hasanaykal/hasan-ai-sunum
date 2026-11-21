// Ortak giriş noktası. SAHİBİ: şef (claude). Sahne işçileri bu dosyaya dokunmaz.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { SplitText } from 'gsap/SplitText.js';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin.js';
import * as THREE from 'three';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

// Yumuşak kaydırma (fare tekerleği sinematik hissetsin diye)
const lenis = new Lenis({ duration: 1.25, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

// Üst ilerleme çubuğu
gsap.to('#progress', {
  scaleX: 1, ease: 'none',
  scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
});

// SplitText ölçümleri doğru olsun diye önce fontları bekle (en fazla 2,5 sn).
try {
  await Promise.race([
    Promise.all([
      document.fonts.load('400 100px "Instrument Serif"'),
      document.fonts.load('italic 400 100px "Instrument Serif"'),
      document.fonts.load('300 20px Inter'),
      document.fonts.load('500 20px Inter'),
      document.fonts.load('400 13px "JetBrains Mono"'),
    ]),
    new Promise((r) => setTimeout(r, 2500)),
  ]);
} catch (_) { /* font gelmezse yedek fontla devam */ }

const ctx = { gsap, ScrollTrigger, SplitText, THREE, lenis };

// Her sahne kendi dosyasında; biri hata verirse diğerleri çalışmaya devam eder.
const sections = [...document.querySelectorAll('section[data-scene]')];
for (const el of sections) {
  const id = el.dataset.scene;
  try {
    const mod = await import(`./scenes/${id}.js`);
    await mod.default(el, ctx);
  } catch (err) {
    console.error(`[${id}] sahne yüklenemedi:`, err);
    el.classList.add('scene--broken');
    el.innerHTML = `<div class="wrap"><p class="eyebrow">${id}</p><h2 class="h2">Sahne yüklenemedi</h2></div>`;
  }
}
ScrollTrigger.refresh();

// Pencere boyu değişirse (ör. sayfa açıkken F11'e basılırsa) pin mesafeleri bayat kalıyor.
// Çözüm: boyut oturunca sayfayı yeniden yükle, kaydırma oranını koru.
history.scrollRestoration = 'manual';
try {
  const r = parseFloat(sessionStorage.getItem('scrollRatio'));
  sessionStorage.removeItem('scrollRatio');
  if (r > 0) setTimeout(() => {
    const y = r * (document.documentElement.scrollHeight - innerHeight);
    window.scrollTo(0, y);
    lenis.scrollTo(y, { immediate: true, force: true });
    ScrollTrigger.update();
  }, 400);
} catch (_) {}
let lastW = innerWidth, lastH = innerHeight, resizeTimer;
addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (Math.abs(innerWidth - lastW) < 40 && Math.abs(innerHeight - lastH) < 40) return;
    lastW = innerWidth; lastH = innerHeight;
    try {
      const max = document.documentElement.scrollHeight - innerHeight;
      sessionStorage.setItem('scrollRatio', String(max > 0 ? scrollY / max : 0));
    } catch (_) {}
    location.reload();
  }, 450);
});
