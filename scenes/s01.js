export default async function init(el, { gsap, ScrollTrigger, SplitText, THREE }) {
  try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]); } catch (e) {}
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./s01.css', import.meta.url).href;
  document.head.appendChild(link);

  el.innerHTML = `
    <img class="s01-hero" src="assets/img/hero.webp" alt="" aria-hidden="true">
    <canvas class="canvas-layer" aria-hidden="true"></canvas>
    <div class="s01-vignette"></div>
    <div class="s01-copy"><div class="wrap">
      <p class="eyebrow s01-a">Üretim Yönetimi Projesi</p>
      <h1 class="h1">Yapay <em>Zekâ</em></h1>
      <p class="lead s01-a">Üretim, iş hayatı ve Anthropic'in Claude yaklaşımı üzerinden bir inceleme</p>
    </div></div>
    <div class="s01-foot">
      <div class="s01-id s01-a">HASAN AYKAL · 251619631</div>
      <div class="s01-hint s01-a"><span>Kaydır</span><i></i></div>
    </div>`;
  const hero = el.querySelector('.s01-hero');
  hero.addEventListener('error', () => hero.remove());

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = el.querySelector('canvas');

  // ---------- Three.js: parçacık sinir ağı ----------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
  camera.position.z = 5.2;
  const group = new THREE.Group();
  scene.add(group);

  // Beyin benzeri bulut: iki yarımküre + gürültü
  const N = 9000;
  const pos = new Float32Array(N * 3), seed = new Float32Array(N), dir = new Float32Array(N * 3);
  const pts = [];
  for (let i = 0; i < N; i++) {
    const side = Math.random() < 0.5 ? -1 : 1;
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const r = 0.62 + 0.38 * Math.pow(Math.random(), 0.45);
    let x = s * Math.cos(th) * 0.78 * r, y = u * 0.85 * r, z = s * Math.sin(th) * 1.1 * r;
    x += side * 0.42;
    if (Math.abs(x) < 0.07) x += side * 0.1;
    const k = Math.sin(x * 9 + y * 7) * Math.cos(z * 8 - y * 5) * 0.045;
    x += k; y += k * 0.8; z += k;
    pos.set([x, y, z], i * 3);
    seed[i] = Math.random();
    const dx = x + (Math.random() - 0.5), dy = y + (Math.random() - 0.5), dz = z + (Math.random() - 0.5);
    const l = Math.hypot(dx, dy, dz) || 1;
    dir.set([dx / l, dy / l, dz / l], i * 3);
    pts.push([x, y, z, i]);
  }

  const common = `
    uniform float uTime; uniform float uScatter; uniform float uPx;
    attribute float aSeed; attribute vec3 aDir;
    vec3 disp(vec3 p, float sd) {
      float b = 1.0 + 0.035 * sin(uTime * 0.7 + sd * 6.2831) + 0.02 * sin(uTime * 0.37 + p.y * 3.0);
      p *= b;
      p += 0.015 * vec3(sin(uTime * 0.6 + sd * 40.0), cos(uTime * 0.5 + sd * 31.0), sin(uTime * 0.45 + sd * 17.0));
      float sc = uScatter * uScatter;
      p += aDir * sc * (2.0 + sd * 6.0);
      return p;
    }`;
  const mkMat = (isPoint) => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uScatter: { value: 0 }, uPx: { value: 1 } },
    vertexShader: common + `
      varying float vS; varying float vA;
      void main() {
        vec3 p = disp(position, aSeed);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        vS = aSeed; vA = 1.0 - smoothstep(0.35, 1.0, uScatter);
        ${isPoint ? 'gl_PointSize = (1.4 + aSeed * 2.4) * uPx * (4.5 / -mv.z);' : ''}
      }`,
    fragmentShader: `
      varying float vS; varying float vA;
      void main() {
        vec3 c = mix(vec3(0.43, 0.66, 1.0), vec3(0.85, 0.47, 0.34), smoothstep(0.7, 1.0, vS));
        ${isPoint
          ? `float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d); a *= a;
             gl_FragColor = vec4(c * 1.3, a * 0.85 * vA);`
          : `gl_FragColor = vec4(c, 0.10 * vA);`}
      }`,
  });
  const pMat = mkMat(true);
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  pGeo.setAttribute('aDir', new THREE.BufferAttribute(dir, 3));
  const points = new THREE.Points(pGeo, pMat);
  points.frustumCulled = false;
  group.add(points);

  // Sinapslar: yakın nokta çiftleri
  const segs = [];
  for (let n = 0; n < 1700; n++) {
    const a = pts[(Math.random() * N) | 0];
    for (let t = 0; t < 30; t++) {
      const b = pts[(Math.random() * N) | 0];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      if (d > 0.08 && d < 0.3) { segs.push(a, b); break; }
    }
  }
  const lp = new Float32Array(segs.length * 3), ls = new Float32Array(segs.length), ld = new Float32Array(segs.length * 3);
  segs.forEach((p, i) => {
    lp.set([p[0], p[1], p[2]], i * 3);
    ls[i] = seed[p[3]];
    ld.set(dir.subarray(p[3] * 3, p[3] * 3 + 3), i * 3);
  });
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(lp, 3));
  lGeo.setAttribute('aSeed', new THREE.BufferAttribute(ls, 1));
  lGeo.setAttribute('aDir', new THREE.BufferAttribute(ld, 3));
  const lMat = mkMat(false);
  const lines = new THREE.LineSegments(lGeo, lMat);
  lines.frustumCulled = false;
  group.add(lines);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e) => { mouse.tx = (e.clientX / innerWidth) * 2 - 1; mouse.ty = (e.clientY / innerHeight) * 2 - 1; };
  addEventListener('pointermove', onMove, { passive: true });

  function resize() {
    const w = el.clientWidth || innerWidth, h = el.clientHeight || innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    pMat.uniforms.uPx.value = dpr * h / 900;
    group.position.x = Math.min(1.5, 0.55 * camera.aspect);
    group.scale.setScalar(Math.min(1.15, 0.7 + camera.aspect * 0.22));
  }
  resize();
  addEventListener('resize', resize);

  const state = { scatter: 0, zoom: 0 };
  let running = true;
  const clock = new THREE.Clock();
  const tick = () => {
    if (!running) return;
    const t = clock.getElapsedTime();
    mouse.x += (mouse.tx - mouse.x) * 0.04; mouse.y += (mouse.ty - mouse.y) * 0.04;
    group.rotation.y = t * 0.08 + mouse.x * 0.35;
    group.rotation.x = mouse.y * 0.18 + Math.sin(t * 0.2) * 0.04;
    camera.position.z = 5.2 - state.zoom * 3.2;
    for (const m of [pMat, lMat]) { m.uniforms.uTime.value = t; m.uniforms.uScatter.value = state.scatter; }
    renderer.render(scene, camera);
  };
  gsap.ticker.add(tick);

  ScrollTrigger.create({
    trigger: el, start: 'top bottom', end: 'bottom top',
    onToggle: (self) => { running = self.isActive; },
  });

  // ---------- Kaydırma: dağıl + içeri gir ----------
  gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.8 } })
    .to(state, { scatter: 1, zoom: 1, ease: 'power2.in' }, 0)
    .to('#s01 .s01-copy .wrap', { yPercent: -25, opacity: 0, ease: 'power2.in' }, 0)
    .to('#s01 .s01-foot', { opacity: 0, ease: 'none', duration: 0.3 }, 0)
    .to(hero, { scale: 1.25, ease: 'none' }, 0);

  // ---------- Açılış animasyonu ----------
  const split = new SplitText('#s01 .h1', { type: 'chars' });
  const k = reduced ? 0.3 : 1;
  gsap.set(split.chars, { yPercent: 60, opacity: 0, rotateX: -50, filter: 'blur(14px)', transformOrigin: '50% 100%' });
  gsap.set('#s01 .s01-a', { opacity: 0, y: 18 });
  gsap.set(canvas, { opacity: 0 });
  if (!reduced) gsap.timeline({ repeat: -1 }).fromTo('#s01 .s01-hint i', { scaleY: 0, opacity: 1 }, { scaleY: 1, duration: 1.2, ease: 'power2.inOut' }).to('#s01 .s01-hint i', { opacity: 0, duration: 1 });
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .to(canvas, { opacity: 1, duration: 2.4 * k, ease: 'power2.out' }, 0)
    .to('#s01 .eyebrow', { opacity: 1, y: 0, duration: 1.2 * k }, 0.3 * k)
    .to(split.chars, { yPercent: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)', duration: 1.6 * k, stagger: 0.05 * k }, 0.45 * k)
    .to('#s01 .lead', { opacity: 1, y: 0, duration: 1.4 * k }, 1.1 * k)
    .to('#s01 .s01-id, #s01 .s01-hint', { opacity: 1, y: 0, duration: 1.2 * k }, 1.6 * k);
}
