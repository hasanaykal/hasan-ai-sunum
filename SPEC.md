# Hasan AI Sunumu — Sahne Sözleşmesi (SPEC)

- 2026-11-21 (TR) — claude — İlk sürüm: iskelet + sahne listesi.
- 2026-11-21 20:32 (TR) — claude — 11 sahne yazıldı (3 Sonnet işçisi), 3 görsel Codex'le üretildi, kontrolcü testi + düzeltmeler bitti. Kalan: yayın adresi, gerçek laptopta deneme.
- 2026-11-21 20:59 (TR) — claude — Yayında: https://hasanaykal.github.io/hasan-ai-sunum/ (Hasan'ın GitHub'ı, repo hasan-ai-sunum, Pages main / root). Canlıda 11 sahne yüklendi, konsol temiz, görseller geliyor.
- 2026-11-21 21:14 (TR) — claude — Yusuf'un geri bildirimi düzeltildi ve yayına alındı: s02 tanımlar artık sırayla yanıp yanık kalıyor; s10 robot kol kalınlaştı, küçük ekranda (1366x768/1536x864) yerleşim sığıyor; s08 Claude çizgisine anthropic.com'dan doğrulanmış tarihler eklendi; main.js boyut değişince (F11) sayfayı yeniden yüklüyor. Açık: Claude 5 kuşağı düğümü eklensin mi (Yusuf'a soruldu).
- 2026-11-21 21:27 (TR) — claude — Yusuf onayıyla s08 model çizgisine 6. düğüm eklendi ve yayına alındı: 'Claude 5 · Bugün · Opus 5.5 · Sonnet 5.5 · Haiku 5.5' (tarihsiz; resmi duyuru tarihi doğrulanamadı).

Fareyle aşağı kaydırılarak sunulan, koyu ve sinematik, Apple ürün sayfası tarzında tek sayfalık site. Sınıfta projeksiyona bağlı laptopta (1920x1080, Chrome) ve internetle açılacak. Teslim: Pazartesi 2026-11-23.
Kaynak içerik: Hasan Aykal'ın 17 slaytlık sunumu "YAPAY ZEKÂ — Üretim, iş hayatı ve Anthropic'in Claude yaklaşımı" (Üretim Yönetimi Projesi, öğrenci no 251619631) + konuşma metni. **Metinler slayttan birebir alınır, yeni bilgi uydurulmaz.**
Referanslar: pear.no (yapay zekâ ile üretilmiş tablo videosu, kaydırınca kare kare oynuyor), apple.com/airpods-pro, studiokogel.com.

## Teknik sözleşme (herkes uyar)
- Yığın: düz ES modülleri, derleme yok. `index.html` içindeki importmap: `three` (0.170.0), `three/addons/`, `gsap` (3.13.0; `gsap/ScrollTrigger.js`, `gsap/SplitText.js`, `gsap/DrawSVGPlugin.js`), `lenis`. Yeni CDN kütüphanesi ekleme.
- Her sahne `scenes/sNN.js` dosyasıdır ve şunu export eder:
  ```js
  export default async function init(el, { gsap, ScrollTrigger, SplitText, THREE, lenis }) { ... }
  ```
  `el` = boş `<section class="scene" id="sNN">`. Sahne kendi DOM'unu `el.innerHTML` ile kurar.
- Sahneye özel CSS `scenes/sNN.css` dosyasında olur; `init` içinde `<link>` olarak `document.head`'e eklenir. Seçiciler `#sNN` ile başlar, global stile sızmaz.
- Ortak sınıflar (style.css): `.wrap .eyebrow .h1 .h2 .h3 .lead .grad .source .card .canvas-layer`. Renk tokenleri: `--bg --fg --muted --line --accent(#d97757) --accent-2(#6ea8ff) --gold --serif --sans --mono`.
- Pin ve scrub için GSAP ScrollTrigger kullanılır. Pin'li sahnenin uzunluğu `end: '+=250%'` gibi, gerekirse daha fazla. Lenis zaten main.js'te bağlı.
- Three.js sahnesi: kendi `<canvas class="canvas-layer">` öğesini oluşturur. Ekrandayken render eder, ekran dışında durur (ScrollTrigger `onToggle` ya da IntersectionObserver). `devicePixelRatio` en fazla 2. Pencere boyu değişince yeniden boyutlanır.
- Görseller `assets/img/` altında durur. Dosya yoksa sahne çökmez, koyu degrade yedeğe düşer.
- Performans: orta seviye bir laptopta 60 fps hedeflenir. Parçacık sayısı en fazla ~15k olur, post-processing yalnız gerekirse eklenir.
- Erişilebilirlik ve yedek: `prefers-reduced-motion` açıksa animasyonlar kısalır.
- Her slaytın altındaki kaynak numarası (ör. `[2][9]`) sahnenin köşesinde `.source` sınıfıyla gösterilir.

## Sahneler

### s01 — Açılış  (slayt 1)
Siyah ekranda Three.js parçacıklarından oluşan, yavaşça nefes alan bir sinir ağı/beyin bulutu; fare hareketine hafif tepki verir. Arkada `assets/img/hero.webp` (AI görseli: karanlıkta parlayan nöral yapı) çok düşük opaklıkta durur. Kaydırınca parçacıklar dağılır, kamera içeri girer.
Metin: eyebrow "Üretim Yönetimi Projesi" · h1 "Yapay <em>Zekâ</em>" · lead "Üretim, iş hayatı ve Anthropic'in Claude yaklaşımı üzerinden bir inceleme" · alt köşede "HASAN AYKAL · 251619631". Altta "Kaydır" ipucu.

### s02 — Temel soru + Yapay zekâ nedir  (slayt 2-3)
Önce tam ekran büyük cümle, kelime kelime açılır (SplitText): "Yapay zekâ yalnızca 'akıllı sohbet' değil; üretim ve iş süreçlerini yeniden tasarlayan bir **teknoloji katmanıdır**."
Ardından pin'li bölüm: iç içe 4 halka (SVG). Kaydırdıkça dıştan içe sırayla çizilir ve etiketlenir: Yapay zekâ ⊃ Makine öğrenmesi ⊃ Derin öğrenme ⊃ Üretken AI. Her halka geldiğinde yanında tanımı belirir:
- Yapay zekâ: İnsan zekâsıyla ilişkilendirilen algılama, akıl yürütme, öğrenme ve karar verme görevlerini makinelerle gerçekleştirme hedefi.
- Makine öğrenmesi: Kuralların tek tek yazılması yerine veriden örüntü öğrenme.
- Derin öğrenme: Çok katmanlı sinir ağlarıyla karmaşık örüntüleri öğrenme.
- Üretken AI: Metin, kod, görsel, ses veya video gibi yeni içerikler üretme.
Kaynak [9].

### s03 — Zaman çizelgesi  (slayt 4)
Başlık "Yapay zekânın gelişimi: dört büyük dalga". Alt metin: "Bugünkü üretken modeller, tek bir buluşun değil; onlarca yıllık araştırma ve altyapı birikiminin sonucudur."
Pin'li yatay kaydırma: dikey kaydırma yatay harekete çevrilir. Ortada ince bir zaman çizgisi soldan sağa dolar. Yedi durak var ve her durakta dev serif yıl, başlık ile alt metin yer alır:
1943 McCulloch–Pitts (yapay nöron) · 1950 Turing testi "Makineler düşünebilir mi?" · 1956 Dartmouth: AI alanı adlandırıldı · 1980'ler Uzman sistemler: kural tabanlı dalga · 2012 Derin öğrenme: görüntü tanımada sıçrama · 2017 Transformer: Attention is All You Need · 2022+ Üretken AI dalgası: ChatGPT (2022), Claude (2023).
Her durakta küçük bir SVG simge çizilir (nöron, soru işareti, kural ağacı, katmanlı ağ, attention okları, sohbet balonu). Kaynak [1][2][9][11][14].

### s04 — Transformer  (slayt 5)  ★ şov sahnesi
Başlık "Transformer neden kritik?" Alt metin: "2017'de yayımlanan 'Attention Is All You Need' çalışması, güncel büyük dil modellerinin temel mimarisini şekillendirdi."
Pin'li: ekranda bir cümle kelimelere bölünür. Kaydırdıkça bir kelimeden diğerlerine ağırlıklı, parlayan SVG eğri çizgiler (attention) çizilir; çizgi kalınlığı ve opaklığı ağırlığı gösterir. Ardından üç sütun sırayla gelir:
- Öncesi: Sıralı ve tekrarlayan mimariler / Uzun bağlamı taşımak daha zordu / Eğitimde paralelleştirme sınırlıydı
- Transformer: Attention mekanizmasıyla girdinin önemli parçalarını ilişkilendirir / Daha fazla paralelleştirme sağlar / Büyük veri ve hesaplama gücüyle ölçeklenebilir
- Sonuç: Büyük dil modelleri / Kod, metin ve çok adımlı akıl yürütme / Üretken AI ürünlerinin hızlanması
En sonda formül: "Veri + hesaplama + mimari + geri bildirim = model yeteneği" (parçalar tek tek birleşir). Kaynak [2][9].

### s05 — Neler yapabiliyor + Sektörler  (slayt 6-7)
Başlık "Yapay zekânın bugün verimli olduğu işler". Alt metin: "En güçlü kullanım alanları genellikle dijital, tekrarlanabilir, ölçülebilir ve insan denetimiyle doğrulanabilir görevlerdir."
6 kart, Apple tarzı ızgara, kaydırdıkça yüzerek gelir: Metin (özetleme · sınıflandırma · taslak üretme), Kod (kod yazma · hata bulma · test üretme), Veri (tablo analizi · örüntü bulma · raporlama), Müşteri (soru yanıtlama · çağrı özeti · kişiselleştirme), Araştırma (kaynak tarama · karşılaştırma · hipotez üretme), Operasyon (talep tahmini · kalite kontrol · planlama desteği).
Alt bant: "tahmin → planlama → kalite → stok → bakım → müşteri hizmeti" bir ışık noktası soldan sağa akar.
Sonra "Hangi sektörler dönüşüyor?": Üretim, Finans, Sağlık, Medya & içerik, Yazılım, Eğitim. Dev kelimeler sırayla ekrandan geçer. Altına: "'Sektör bitti' demek yerine, sektör içindeki görevlerin hangilerinin otomasyona veya desteklenmeye açık olduğunu sormak daha doğrudur." ve "İnsan sorumluluğu, alan bilgisi ve veri güvenliği ortadan kalkmaz; iş akışının tasarımı değişir." Kaynak [9][10].

### s06 — İş gücü etkisi  (slayt 8)
Başlık "AI hangi işleri 'bitiriyor'?" Alt metin: "Daha doğru ifade: bazı görevleri otomatikleştiriyor, bazı görevleri ise AI kullanan çalışanların elinde yeniden şekillendiriyor."
Pin'li: 4 insan silüeti (SVG). Kaydırınca birinin rengi turuncuya döner, sayaç "1 / 4" olur. Büyük metin: "Dünya genelinde her dört çalışandan biri GenAI'ye bir ölçüde maruz bir meslekte." Ardından: "Çoğu iş için 'dönüşüm', tamamen yok oluştan daha olasıdır." Kaynak ILO [10].

### s07 — Sınırlar  (slayt 9)
Başlık "Yapay zekânın sınırları". Alt metin: "Etkileyici çıktı, otomatik olarak doğru veya güvenli çıktı anlamına gelmez."
Kısa bir glitch/sinyal bozulma girişi (RGB kayması). Ardından 6 madde sırayla gelir: Halüsinasyon (Gerçekmiş gibi yanlış bilgi üretebilir.), Önyargı (Eğitim verisindeki kalıpları taşıyabilir.), Gizlilik (Hassas veri ve erişim izinleri yönetilmelidir.), Güvenlik (Kötüye kullanım, prompt injection ve veri sızıntısı riski.), Sorumluluk (Son karar ve hesap verebilirlik insanda kalır.), Maliyet (Model, altyapı ve entegrasyon maliyetleri vardır.). Kaynak [4][5][9].

### s08 — Anthropic + Claude'un gelişimi + Constitutional AI  (slayt 10-12)
Arka plan sıcak tona döner (turuncu `--accent`), `assets/img/anthropic.webp` (AI görseli) kaydırdıkça yavaşça yakınlaşır.
1) Başlık "Anthropic: güvenliği araştırma konusu yapan AI şirketi". Metin: "Dario ve Daniela Amodei liderliğinde kurulan Anthropic, frontier AI sistemlerini güvenilir, yorumlanabilir ve yönlendirilebilir biçimde geliştirmeyi amaçlar." İki kart: Şirketin yaklaşımı (AI safety as a science / Araştırma + ürün + politika birlikte / Güvenlik, model yeteneğinin yanında ilerlemeli), Neyi üretiyor? (Claude model ailesi / Claude.ai ve kurumsal çözümler / API, Claude Code ve bağlantı ekosistemi). [3][15]
2) "Claude: modelden çalışma arkadaşına". Pin'li yatay ya da dikey model çizgisinde düğümler sırayla parlar: Claude 2 (uzun bağlam ve genel sohbet), Claude 3 (Haiku • Sonnet • Opus; hız/zeka/maliyet dengesi), Claude 3.5 (computer use ve güçlü kodlama), Claude 4 (uzun süren kodlama, araştırma ve agent iş akışları), Sonnet 4.6 (kod, computer use, uzun bağlam ve planlama yeteneklerinin yükselmesi). Not: "'En zeki' ifadesini iddia olarak değil, belirli benchmark ve kullanım senaryolarındaki performansla değerlendirmek gerekir." [6][7][16]
3) "Constitutional AI" üç adımla anlatılır: 1 Yararlı, dürüst, zararı azaltan davranış hedefleri · 2 AI feedback: Model yanıtları ilkeler ışığında eleştirir ve iyileştirir · 3 Şeffaflık + denetim: Constitution yayımlanır; güvenlik değerlendirmeleri ve responsible scaling yaklaşımı ürün geliştirmeye eşlik eder. Altına: "Güçlü taraf: safety-by-design iddiası. Sınır: hiçbir yöntem 'kusursuz güvenlik' garantisi vermez." [4][5]
4) Ekosistem ızgarası (slayt 13): Claude.ai, Claude API / Platform, Claude Code, Computer use, MCP, Kurumsal çözümler. Açıklamalar slayttan alınır. [3][6][8]

### s09 — Rakipler  (slayt 14)
Başlık "Claude tek başına değil: frontier AI yarışı". Apple karşılaştırma tablosu tarzında 4 sütun yan yana kayarak gelir: OpenAI / ChatGPT · GPT (Genel kullanıcı ürünü, API, güçlü dağıtım), Google DeepMind / Gemini (Google ekosistemi, çok modluluk, araştırma), Meta AI / Llama (Açık ağırlık yaklaşımı ve geniş geliştirici ekosistemi), Anthropic / Claude (Güvenlik araştırması, uzun bağlam, kodlama ve kurumsal kullanım). Logo kullanılmaz, yalnız tipografi. Alt not: "Bu tablo 'kazanan' ilan etmez; şirketlerin farklı stratejik avantajlarını gösterir." [3][7][11][12][13]

### s10 — Üretim yönetimi  (slayt 15)  ★ şov sahnesi
Başlık "AI üretim yönetiminde nasıl değer üretir?" Alt metin: "Yapay zekâ yöneticinin yerine geçmekten çok; karar kalitesini ve tepki hızını artıran bir yardımcı katman olabilir."
Arka planda `assets/img/factory.webp` (AI görseli: karanlık, sinematik akıllı fabrika) kaydırdıkça yakınlaşır (pear tarzı). Önde Three.js ile **kodla kurulmuş stilize bir robot kol** durur; kaydırdıkça eklemleri döner ve kol dört istasyonu sırayla gezer. İstasyonlar: Veri (satış, stok, makine, kalite) → Tahmin (talep ve arıza olasılığı) → Karar desteği (plan, kapasite, sipariş önceliği) → Aksiyon (insan onayıyla uygulama). Aktif istasyon parlar.
Son iki kart: "Örnek: stok yönetimi — Talep tahmini + yeniden sipariş noktası + insan kontrolü" ve "Risk — Hatalı veri veya yanlış model, yanlış üretim kararını büyütebilir". [9][10]

### s11 — Sonuç + Kaynakça  (slayt 16-17)
Büyük başlık kelime kelime açılır: "AI bir araç değil, yeni bir çalışma biçimi". Alt metin: "Yapay zekânın etkisi modelin zekâsından çok, onu iş akışına nasıl yerleştirdiğimize de bağlıdır." Ardından üç numaralı madde (01 AI'nin tarihi / 02 İş dünyası / 03 Anthropic / Claude; metinleri slayt 16'dan alınır).
Kapanış cümlesi tam ekranda: "AI kullanan ve kullanmayan iş yapma biçimleri arasındaki fark büyüyecek." Altında "Teşekkürler" ve "Hasan Aykal".
En altta sade kaynakça listesi [1]-[16] (slayt 17'deki URL'lerle, tıklanabilir, küçük mono font).

## Slayttan birebir metinler (eksik kalanlar)
Slayt 12 (Constitutional AI) adımları: "1 — Yararlı, dürüst, zararı azaltan davranış hedefleri." · "2 — AI feedback: Model yanıtları ilkeler ışığında eleştirir ve iyileştirir." · "3 — Şeffaflık + denetim: Constitution yayımlanır; güvenlik değerlendirmeleri ve responsible scaling yaklaşımı ürün geliştirmeye eşlik eder." (1. adımın slaytta ayrı başlığı yok.)
Slayt 13 (Ekosistem): Claude.ai — "Bireysel ve ekip kullanımı: yazma, analiz, araştırma, dosya ve proje çalışmaları." · Claude API / Platform — "Şirketlerin kendi uygulamalarına Claude yetenekleri eklemesi." · Claude Code — "Yazılım projelerinde kodu okuma, düzenleme, test ve terminal tabanlı iş akışları." · Computer use — "Ekranı görme, fare/klavye eylemleriyle yazılım kullanma; deneysel ve kontrollü kullanım." · MCP — "Claude'u veri kaynakları ve iş araçlarına bağlayan açık standart yaklaşımı." · Kurumsal çözümler — "Güvenlik, yönetim, entegrasyon ve ölçek gerektiren işletme kullanımları." Başlık: "Anthropic neler üretiyor?" Alt metin: "Claude, tek bir sohbet arayüzünden çok; model + geliştirici platformu + araç bağlantıları ekosistemidir."
Slayt 16 (Sonuç): 01 AI'nin tarihi — "Sembolik kurallardan ölçeklenebilir, üretken ve araç kullanan sistemlere uzanan bir gelişimdir." · 02 İş dünyası — "Bazı görevleri otomatikleştirir; çoğu işte insan–AI işbirliği, beceri dönüşümü ve denetim öne çıkar." · 03 Anthropic / Claude — "Farkını yalnızca model performansında değil; Constitutional AI, güvenlik araştırması, araç bağlantıları ve kurumsal kullanımda arar."
Slayt 8 iki sütun başlığı: "Daha yüksek maruziyet" ve "İnsanın kritik kaldığı alanlar" (slaytta altları boş).

## Kaynakça (slayt 17)
[1] LLNL — The birth of AI research — st.llnl.gov/news/look-back/birth-artificial-intelligence-ai-research
[2] Vaswani et al. — Attention Is All You Need — arxiv.org/abs/1706.03762
[3] Anthropic — Company — anthropic.com/company
[4] Anthropic — Claude's Constitution — anthropic.com/news/claudes-constitution
[5] Anthropic — Constitutional AI — anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback
[6] Anthropic — Computer use — anthropic.com/news/3-5-models-and-computer-use
[7] Anthropic — Claude 4 — anthropic.com/news/claude-4
[8] Anthropic — Model Context Protocol — anthropic.com/news/model-context-protocol
[9] Stanford HAI — AI Index 2025 — hai.stanford.edu/ai-index/2025-ai-index-report
[10] ILO — Generative AI and Jobs 2025 — ilo.org/publications/generative-ai-and-jobs-2025-update
[11] OpenAI — ChatGPT — openai.com/index/chatgpt
[12] Google DeepMind — Gemini — deepmind.google/technologies/gemini/
[13] Meta AI — Llama — ai.meta.com/llama/
[14] Springer — McCulloch–Pitts neuron paper — link.springer.com/article/10.1007/BF02478259
[15] Anthropic — early company research — anthropic.com/news/anthropic-raises-series-b-to-build-safe-reliable-ai
[16] Anthropic — Claude Sonnet 4.6 — anthropic.com/news/claude-sonnet-4-6

## Sahiplik
| Dosya | Sahibi |
|---|---|
| index.html, main.js, style.css, SPEC.md | şef (claude) |
| scenes/s01-s03.* | işçi A |
| scenes/s04-s07.* | işçi B |
| scenes/s08-s11.* | işçi C |
| assets/img/* | Codex (görsel üretimi) |
