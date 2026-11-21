export default async function init(el, { gsap }) {
  const link = document.createElement('link');
  link.rel = 'stylesheet'; link.href = new URL('./s09.css', import.meta.url).href;
  document.head.appendChild(link);

  const cols = [
    ['OpenAI', 'ChatGPT · GPT', 'Genel kullanıcı ürünü, API, güçlü dağıtım'],
    ['Google DeepMind', 'Gemini', 'Google ekosistemi, çok modluluk, araştırma'],
    ['Meta AI', 'Llama', 'Açık ağırlık yaklaşımı ve geniş geliştirici ekosistemi'],
    ['Anthropic', 'Claude', 'Güvenlik araştırması, uzun bağlam, kodlama ve kurumsal kullanım'],
  ];
  el.innerHTML = `<div class="wrap">
    <p class="eyebrow"><b>09</b> · Rakipler</p>
    <h2 class="h2 s9-h">Claude tek başına değil: <em>frontier AI yarışı</em></h2>
    <div class="s9-cols">${cols.map(([c, n, d], i) => `<div class="s9-col${i === 3 ? ' me' : ''}"><div class="s9-co">${c}</div><div class="s9-name">${n}</div><p>${d}</p></div>`).join('')}</div>
    <p class="s9-note">Bu tablo "kazanan" ilan etmez; şirketlerin farklı stratejik avantajlarını gösterir.</p>
    <span class="source s9-src">[3][7][11][12][13]</span>
  </div>`;
  const q = (s) => el.querySelector(s);
  gsap.from(el.querySelectorAll('.eyebrow, .s9-h'), { y: 40, opacity: 0, duration: 1.1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 55%' } });
  gsap.to(el.querySelectorAll('.s9-col'), { opacity: 1, x: 0, duration: 1.2, stagger: .18, ease: 'power3.out', scrollTrigger: { trigger: q('.s9-cols'), start: 'top 80%' } });
  gsap.to(q('.s9-note'), { opacity: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: q('.s9-note'), start: 'top 92%' } });
}
