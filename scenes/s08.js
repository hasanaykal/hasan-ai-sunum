export default async function init(el, { gsap, ScrollTrigger }) {
  const link = document.createElement('link');
  link.rel = 'stylesheet'; link.href = new URL('./s08.css', import.meta.url).href;
  document.head.appendChild(link);

  const nodes = [
    ['Claude 2', 'Temmuz 2023', 'Claude 2', 'Uzun bağlam ve genel sohbet'],
    ['Claude 3', 'Mart 2024', 'Claude 3 Haiku • Sonnet • Opus', 'Haiku • Sonnet • Opus; hız/zeka/maliyet dengesi'],
    ['Claude 3.5', 'Ekim 2024', 'Claude 3.5 Sonnet (yükseltilmiş) ve 3.5 Haiku', 'Computer use ve güçlü kodlama'],
    ['Claude 4', 'Mayıs 2025', 'Claude Opus 4 ve Claude Sonnet 4', 'Uzun süren kodlama, araştırma ve agent iş akışları'],
    ['Sonnet 4.6', 'Şubat 2026', 'Claude Sonnet 4.6', 'Kod, computer use, uzun bağlam ve planlama yeteneklerinin yükselmesi'],
    ['Claude 5', 'Bugün', 'Opus 5.5 · Sonnet 5.5 · Haiku 5.5', 'Kasım 2026 itibarıyla en güncel Claude kuşağı'],
  ];
  const eco = [
    ['Claude.ai', 'Bireysel ve ekip kullanımı: yazma, analiz, araştırma, dosya ve proje çalışmaları.'],
    ['Claude API / Platform', 'Şirketlerin kendi uygulamalarına Claude yetenekleri eklemesi.'],
    ['Claude Code', 'Yazılım projelerinde kodu okuma, düzenleme, test ve terminal tabanlı iş akışları.'],
    ['Computer use', 'Ekranı görme, fare/klavye eylemleriyle yazılım kullanma; deneysel ve kontrollü kullanım.'],
    ['MCP', "Claude'u veri kaynakları ve iş araçlarına bağlayan açık standart yaklaşımı."],
    ['Kurumsal çözümler', 'Güvenlik, yönetim, entegrasyon ve ölçek gerektiren işletme kullanımları.'],
  ];

  el.innerHTML = `
  <div class="s8-bg"><div class="s8-warm"></div><img class="s8-img" src="assets/img/anthropic.webp" alt="" onerror="this.remove()"><div class="s8-veil"></div></div>

  <div class="s8-block" data-b="intro"><div class="wrap">
    <p class="eyebrow"><b>08</b> · Anthropic</p>
    <h2 class="h2 s8-h">Anthropic: güvenliği araştırma konusu yapan AI şirketi</h2>
    <p class="lead s8-lead">Dario ve Daniela Amodei liderliğinde kurulan Anthropic, frontier AI sistemlerini güvenilir, yorumlanabilir ve yönlendirilebilir biçimde geliştirmeyi amaçlar.</p>
    <div class="s8-cards">
      <div class="card"><h3 class="h3">Şirketin yaklaşımı</h3><ul><li>AI safety as a science</li><li>Araştırma + ürün + politika birlikte</li><li>Güvenlik, model yeteneğinin yanında ilerlemeli</li></ul></div>
      <div class="card"><h3 class="h3">Neyi üretiyor?</h3><ul><li>Claude model ailesi</li><li>Claude.ai ve kurumsal çözümler</li><li>API, Claude Code ve bağlantı ekosistemi</li></ul></div>
    </div>
    <span class="source s8-src">[3][15]</span>
  </div></div>

  <div class="s8-block" data-b="tl"><div class="wrap">
    <p class="eyebrow"><b>08</b> · Model çizgisi</p>
    <h2 class="h2 s8-h" style="max-width:none">Claude: modelden <em>çalışma arkadaşına</em></h2>
    <p class="lead s8-sub">Claude'un model kuşakları, çıkış sırasıyla</p>
    <div class="s8-tl"><div class="s8-line"><i></i></div>
      <div class="s8-nodes">${nodes.map(([a, b, c, d]) => `<div class="s8-node"><span class="d">${b}</span><h4>${a}</h4><span class="m">${c}</span><p>${d}</p></div>`).join('')}</div></div>
    <p class="s8-note">"En zeki" ifadesini iddia olarak değil, belirli benchmark ve kullanım senaryolarındaki performansla değerlendirmek gerekir.</p>
    <span class="source s8-src">[6][7][16]</span>
  </div></div>

  <div class="s8-block" data-b="con"><div class="wrap">
    <p class="eyebrow"><b>08</b> · Güvenlik yöntemi</p>
    <h2 class="h2 s8-h" style="max-width:none">Constitutional AI</h2>
    <div class="s8-steps">
      <div class="card s8-step"><span class="n">01</span><p>Yararlı, dürüst, zararı azaltan davranış hedefleri.</p></div>
      <div class="card s8-step"><span class="n">02</span><h4>AI feedback</h4><p>Model yanıtları ilkeler ışığında eleştirir ve iyileştirir.</p></div>
      <div class="card s8-step"><span class="n">03</span><h4>Şeffaflık + denetim</h4><p>Constitution yayımlanır; güvenlik değerlendirmeleri ve responsible scaling yaklaşımı ürün geliştirmeye eşlik eder.</p></div>
    </div>
    <div class="s8-verdict"><p><b>Güçlü taraf:</b> safety-by-design iddiası.</p><p><b>Sınır:</b> hiçbir yöntem "kusursuz güvenlik" garantisi vermez.</p></div>
    <span class="source s8-src">[4][5]</span>
  </div></div>

  <div class="s8-block" data-b="eco"><div class="wrap">
    <p class="eyebrow"><b>08</b> · Ekosistem</p>
    <h2 class="h2 s8-h" style="max-width:none">Anthropic neler üretiyor?</h2>
    <p class="lead" style="margin:0 0 28px">Claude, tek bir sohbet arayüzünden çok; model + geliştirici platformu + araç bağlantıları ekosistemidir.</p>
    <div class="s8-eco">${eco.map(([a, b], i) => `<div class="card"><span class="k">0${i + 1}</span><h4>${a}</h4><p>${b}</p></div>`).join('')}</div>
    <span class="source s8-src">[3][6][8]</span>
  </div></div>`;

  const q = (s) => el.querySelector(s), qa = (s) => [...el.querySelectorAll(s)];
  const B = (n) => q(`[data-b="${n}"]`);

  gsap.to(q('.s8-warm'), { opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'top -10%', scrub: 0.8 } });
  gsap.fromTo(q('.s8-img'), { scale: 1 }, { scale: 1.3, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 } });

  const intro = B('intro');
  gsap.from(intro.querySelectorAll('.eyebrow, .s8-h, .s8-lead'), { y: 40, opacity: 0, duration: 1.1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: intro, start: 'top 65%' } });
  gsap.from(intro.querySelectorAll('.card'), { y: 60, opacity: 0, duration: 1.1, stagger: .15, ease: 'power3.out', scrollTrigger: { trigger: intro, start: 'top 45%' } });

  // Model çizgisi (pin): düğümler ilerlemeye göre yanar
  const nds = qa('.s8-node');
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
    trigger: B('tl'), start: 'top top', end: '+=200%', pin: true, scrub: 0.8,
    onUpdate: (self) => nds.forEach((n, i) => n.classList.toggle('on', self.progress * (nds.length + 0.2) >= i + 0.1)),
  } });
  tl.to(q('.s8-line i'), { scaleX: 1, duration: 1 }, 0);

  // Constitutional AI (pin)
  const ct = gsap.timeline({ defaults: { ease: 'power2.out' }, scrollTrigger: { trigger: B('con'), start: 'top top', end: '+=220%', pin: true, scrub: 0.8 } });
  qa('.s8-step').forEach((s, i) => ct.to(s, { opacity: 1, y: 0, duration: 1 }, i * 1.1));
  ct.to(q('.s8-verdict'), { opacity: 1, duration: 1 }, 3.4).to({}, { duration: .8 });

  // Ekosistem
  gsap.to(qa('.s8-eco .card'), { opacity: 1, y: 0, duration: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: q('.s8-eco'), start: 'top 80%' } });
  gsap.from(q('[data-b="eco"] .s8-h'), { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: B('eco'), start: 'top 70%' } });
}
