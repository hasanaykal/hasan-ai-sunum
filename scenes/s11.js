export default async function init(el, { gsap, ScrollTrigger }) {
  const link = document.createElement('link');
  link.rel = 'stylesheet'; link.href = new URL('./s11.css', import.meta.url).href;
  document.head.appendChild(link);

  const refs = [
    ['LLNL — The birth of AI research', 'st.llnl.gov/news/look-back/birth-artificial-intelligence-ai-research'],
    ['Vaswani et al. — Attention Is All You Need', 'arxiv.org/abs/1706.03762'],
    ['Anthropic — Company', 'anthropic.com/company'],
    ["Anthropic — Claude's Constitution", 'anthropic.com/news/claudes-constitution'],
    ['Anthropic — Constitutional AI', 'anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback'],
    ['Anthropic — Computer use', 'anthropic.com/news/3-5-models-and-computer-use'],
    ['Anthropic — Claude 4', 'anthropic.com/news/claude-4'],
    ['Anthropic — Model Context Protocol', 'anthropic.com/news/model-context-protocol'],
    ['Stanford HAI — AI Index 2025', 'hai.stanford.edu/ai-index/2025-ai-index-report'],
    ['ILO — Generative AI and Jobs 2025', 'ilo.org/publications/generative-ai-and-jobs-2025-update'],
    ['OpenAI — ChatGPT', 'openai.com/index/chatgpt'],
    ['Google DeepMind — Gemini', 'deepmind.google/technologies/gemini/'],
    ['Meta AI — Llama', 'ai.meta.com/llama/'],
    ['Springer — McCulloch–Pitts neuron paper', 'link.springer.com/article/10.1007/BF02478259'],
    ['Anthropic — early company research', 'anthropic.com/news/anthropic-raises-series-b-to-build-safe-reliable-ai'],
    ['Anthropic — Claude Sonnet 4.6', 'anthropic.com/news/claude-sonnet-4-6'],
  ];
  const words = (t) => t.split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');
  const pts = [
    ["AI'nin tarihi", 'Sembolik kurallardan ölçeklenebilir, üretken ve araç kullanan sistemlere uzanan bir gelişimdir.'],
    ['İş dünyası', 'Bazı görevleri otomatikleştirir; çoğu işte insan–AI işbirliği, beceri dönüşümü ve denetim öne çıkar.'],
    ['Anthropic / Claude', 'Farkını yalnızca model performansında değil; Constitutional AI, güvenlik araştırması, araç bağlantıları ve kurumsal kullanımda arar.'],
  ];

  el.innerHTML = `
  <div class="s11-hero"><div class="wrap">
    <p class="eyebrow"><b>11</b> · Sonuç</p>
    <h2 class="h2 s11-h">${words('AI bir araç değil, yeni bir çalışma biçimi')}</h2>
    <p class="lead s11-lead">Yapay zekânın etkisi modelin zekâsından çok, onu iş akışına nasıl yerleştirdiğimize de bağlıdır.</p>
    <div class="s11-pts">${pts.map(([a, b], i) => `<div class="card s11-pt"><div class="n">0${i + 1}</div><h4>${a}</h4><p>${b}</p></div>`).join('')}</div>
  </div></div>
  <div class="s11-close"><div class="wrap">
    <p class="s11-cs">${words('AI kullanan ve kullanmayan iş yapma biçimleri arasındaki fark büyüyecek.')}</p>
    <div class="s11-thx"><b>Teşekkürler</b><span>Hasan Aykal</span></div>
  </div></div>
  <div class="s11-refs"><div class="wrap">
    <p class="eyebrow">Kaynakça</p>
    <ol>${refs.map(([t, u], i) => `<li><span>[${i + 1}]</span><span><em>${t}</em><br><a href="https://${u}" target="_blank" rel="noopener noreferrer">${u}</a></span></li>`).join('')}</ol>
  </div></div>`;

  const q = (s) => el.querySelector(s), qa = (s) => [...el.querySelectorAll(s)];

  // Sonuç başlığı kelime kelime
  gsap.set(qa('.s11-h .w'), { opacity: 0.12, y: 30 });
  gsap.to(qa('.s11-h .w'), { opacity: 1, y: 0, stagger: 0.12, ease: 'power3.out', duration: 0.8, scrollTrigger: { trigger: q('.s11-hero'), start: 'top 55%', end: 'top 5%', scrub: 0.7 } });
  gsap.from(q('.s11-lead'), { opacity: 0, y: 30, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: q('.s11-lead'), start: 'top 88%' } });
  gsap.to(qa('.s11-pt'), { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: q('.s11-pts'), start: 'top 85%' } });

  // Kapanış cümlesi (pin) + Teşekkürler
  gsap.set(qa('.s11-cs .w'), { opacity: 0.1 });
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: q('.s11-close'), start: 'top top', end: '+=180%', pin: true, scrub: 0.7 } });
  tl.to(qa('.s11-cs .w'), { opacity: 1, stagger: 0.25, duration: 0.5 })
    .to(q('.s11-thx'), { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, '+=0.3')
    .to({}, { duration: 0.6 });
}
