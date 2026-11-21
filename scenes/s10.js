export default async function init(el, { gsap, ScrollTrigger, THREE }) {
  const link = document.createElement('link');
  link.rel = 'stylesheet'; link.href = new URL('./s10.css', import.meta.url).href;
  document.head.appendChild(link);

  const stations = [
    { name: 'Veri', sub: 'satış, stok, makine, kalite', col: 0x6ea8ff },
    { name: 'Tahmin', sub: 'talep ve arıza olasılığı', col: 0xe8c48a },
    { name: 'Karar desteği', sub: 'plan, kapasite, sipariş önceliği', col: 0xd97757 },
    { name: 'Aksiyon', sub: 'insan onayıyla uygulama', col: 0x7be0a8 },
  ];
  const hex = (c) => '#' + c.toString(16).padStart(6, '0');

  el.innerHTML = `
  <div class="s10-stage">
    <img class="s10-img" src="assets/img/factory.webp" alt="" onerror="this.remove()">
    <div class="s10-veil"></div>
    <canvas class="canvas-layer"></canvas>
    <div class="s10-head">
      <p class="eyebrow"><b>10</b> · Üretim yönetimi</p>
      <h2 class="h2 s10-h">AI üretim yönetiminde nasıl <em>değer üretir?</em></h2>
      <p class="lead">Yapay zekâ yöneticinin yerine geçmekten çok; karar kalitesini ve tepki hızını artıran bir yardımcı katman olabilir.</p>
    </div>
    <div class="s10-chips">${stations.map((s, i) => `<div class="s10-chip" style="--c:${hex(s.col)}"><span class="n">0${i + 1}</span><h4>${s.name}</h4><p>${s.sub}</p></div>`).join('')}</div>
    <div class="s10-end">
      <div class="card"><span class="k">Örnek: stok yönetimi</span><h3>Talep tahmini + yeniden sipariş noktası + insan kontrolü</h3></div>
      <div class="card risk"><span class="k">Risk</span><h3>Hatalı veri veya yanlış model, yanlış üretim kararını büyütebilir</h3></div>
    </div>
    <span class="source s10-src">[9][10]</span>
  </div>`;

  const q = (s) => el.querySelector(s);
  const stage = q('.s10-stage'), canvas = q('.canvas-layer');
  const chips = [...el.querySelectorAll('.s10-chip')];

  // ---------- Three.js ----------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 60);
  camera.position.set(0, 5.2, 10.5);
  camera.lookAt(0, 1.3, -1.2);

  try {
    const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.7;
  } catch (e) { /* env yoksa düz ışıkla devam */ }

  scene.add(new THREE.HemisphereLight(0x9bb4ff, 0x2a1810, 0.35));
  const key = new THREE.DirectionalLight(0xfff0dd, 2.2);
  key.position.set(5, 9, 6); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 30 });
  key.shadow.bias = -0.0005;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x6ea8ff, 1.4); rim.position.set(-6, 4, -5); scene.add(rim);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.45 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  const metal = new THREE.MeshStandardMaterial({ color: 0xaab2c0, metalness: 1, roughness: 0.32 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1b1e26, metalness: 0.85, roughness: 0.4 });
  const orange = new THREE.MeshStandardMaterial({ color: 0xd97757, metalness: 0.6, roughness: 0.35, emissive: 0x451a0c, emissiveIntensity: 0.6 });
  const add = (parent, geo, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  };

  // Robot kol
  const L1 = 2.5, L2 = 2.2, SY = 1.0;
  const robot = new THREE.Group(); scene.add(robot);
  add(robot, new THREE.CylinderGeometry(0.95, 1.1, 0.35, 48), dark, 0, 0.175, 0);
  add(robot, new THREE.CylinderGeometry(0.7, 0.8, 0.25, 48), metal, 0, 0.47, 0);
  const yaw = new THREE.Group(); yaw.position.y = 0.6; robot.add(yaw);
  add(yaw, new THREE.CylinderGeometry(0.55, 0.6, 0.55, 40), metal, 0, 0.27, 0);
  const shoulder = new THREE.Group(); shoulder.position.y = SY - 0.6; yaw.add(shoulder);
  const sj = add(shoulder, new THREE.CylinderGeometry(0.42, 0.42, 0.9, 36), orange); sj.rotation.x = Math.PI / 2;
  add(shoulder, new THREE.BoxGeometry(L1, 0.38, 0.5), metal, L1 / 2, 0, 0);
  add(shoulder, new THREE.BoxGeometry(L1 - 0.6, 0.12, 0.62), dark, L1 / 2, 0, 0);
  const elbow = new THREE.Group(); elbow.position.x = L1; shoulder.add(elbow);
  const ej = add(elbow, new THREE.CylinderGeometry(0.34, 0.34, 0.8, 36), orange); ej.rotation.x = Math.PI / 2;
  add(elbow, new THREE.BoxGeometry(L2, 0.3, 0.4), metal, L2 / 2, 0, 0);
  const wrist = new THREE.Group(); wrist.position.x = L2; elbow.add(wrist);
  add(wrist, new THREE.SphereGeometry(0.26, 32, 24), orange);
  const grip = new THREE.Group(); wrist.add(grip);
  add(grip, new THREE.BoxGeometry(0.28, 0.5, 0.5), dark, 0.2, 0, 0);
  const fing = [add(grip, new THREE.BoxGeometry(0.5, 0.1, 0.12), metal, 0.55, 0.22, 0), add(grip, new THREE.BoxGeometry(0.5, 0.1, 0.12), metal, 0.55, -0.22, 0)];
  const tip = new THREE.PointLight(0xffffff, 0, 5); tip.position.set(0.6, 0, 0); grip.add(tip);

  // İstasyonlar (yay üzerinde)
  const pads = stations.map((s, i) => {
    const phi = THREE.MathUtils.degToRad(-62 + i * (124 / 3));
    const R = 3.9, x = R * Math.sin(phi), z = -R * Math.cos(phi) + 0.2;
    const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
    add(g, new THREE.CylinderGeometry(0.75, 0.85, 0.2, 48), dark, 0, 0.1, 0);
    const mat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: s.col, emissiveIntensity: 0.15, metalness: 0.3, roughness: 0.4 });
    add(g, new THREE.CylinderGeometry(0.6, 0.6, 0.06, 48), mat, 0, 0.23, 0);
    const ring = add(g, new THREE.TorusGeometry(0.78, 0.025, 12, 64), new THREE.MeshBasicMaterial({ color: s.col, transparent: true, opacity: 0.5 }), 0, 0.21, 0);
    ring.rotation.x = Math.PI / 2; ring.castShadow = false;
    const item = add(g, i === 0 ? new THREE.BoxGeometry(0.4, 0.4, 0.4) : i === 1 ? new THREE.SphereGeometry(0.26, 24, 18) : i === 2 ? new THREE.CylinderGeometry(0.2, 0.2, 0.45, 24) : new THREE.OctahedronGeometry(0.3), new THREE.MeshStandardMaterial({ color: s.col, metalness: 0.5, roughness: 0.25, emissive: s.col, emissiveIntensity: 0.3 }), 0, 0.55, 0);
    return { pos: new THREE.Vector3(x, 0, z), mat, ring, item, col: new THREE.Color(s.col), act: 0 };
  });
  const home = new THREE.Vector3(0.9, 3.8, 0.5);

  // Ters kinematik: hedef noktaya uzan
  const tmp = new THREE.Vector3();
  function reach(t) {
    const r = Math.hypot(t.x, t.z), dy = t.y - SY;
    let d = Math.min(Math.hypot(r, dy), L1 + L2 - 0.02); d = Math.max(d, Math.abs(L1 - L2) + 0.15);
    const a = Math.acos(THREE.MathUtils.clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    const g = Math.acos(THREE.MathUtils.clamp((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2), -1, 1));
    const pitch = Math.atan2(dy, r) + a;
    yaw.rotation.y = Math.atan2(-t.z, t.x);
    shoulder.rotation.z = pitch;
    elbow.rotation.z = -(Math.PI - g);
    wrist.rotation.z = -(pitch - (Math.PI - g)) - Math.PI / 2 + 0.0; // gripper aşağı baksın
  }

  const st = { blend: 0, t: 0, fade: 1 };
  const smooth = (x) => x * x * (3 - 2 * x);
  let activeIdx = -1, time = 0;

  function pose() {
    // t: 0..3 ham; her istasyonda bekleme payı
    const i0 = Math.min(Math.floor(st.t), 2), f = st.t - i0;
    const m = smooth(THREE.MathUtils.clamp((f - 0.28) / 0.44, 0, 1));
    const dwell = 1 - THREE.MathUtils.clamp(Math.min(f, 1 - f) * 7, 0, 1); // 1 = istasyonda
    const pa = pads[i0].pos, pb = pads[Math.min(i0 + 1, 3)].pos;
    tmp.lerpVectors(pa, pb, m);
    const lift = Math.sin(Math.PI * m) * 1.0;
    const near = st.t >= 2.999 ? 1 : (f < 0.5 ? 1 - m : m) ;
    tmp.y = 1.15 + lift - 0.55 * near * (m === 0 || m === 1 ? 1 : 0.4);
    const target = tmp.clone().lerp(home, 1 - smooth(st.blend));
    // etkin istasyon
    const idx = st.blend < 0.95 ? -1 : (f < 0.5 ? i0 : Math.min(i0 + 1, 3));
    const reached = st.blend >= 0.95 && (m < 0.2 || m > 0.8 || st.t >= 2.999);
    const ai = reached ? idx : -1;
    if (ai !== activeIdx) { activeIdx = ai; chips.forEach((c, i) => c.classList.toggle('on', i === ai)); }
    reach(target);
    void dwell;
  }

  function resize() {
    const w = stage.clientWidth || 1, h = stage.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w / h < 1.3 ? 14 : 10.5;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage); resize();

  let visible = false, raf = 0;
  function frame(ms) {
    if (!visible) { raf = 0; return; }
    raf = requestAnimationFrame(frame);
    time = ms / 1000;
    pose();
    pads.forEach((p, i) => {
      const target = i === activeIdx ? 1 : 0;
      p.act += (target - p.act) * 0.12;
      p.mat.emissiveIntensity = 0.15 + p.act * 2.4;
      p.ring.material.opacity = 0.35 + p.act * 0.65;
      p.ring.scale.setScalar(1 + p.act * 0.12 + Math.sin(time * 3) * 0.015 * p.act);
      p.item.rotation.y = time * 0.8 + i; p.item.position.y = 0.55 + Math.sin(time * 1.6 + i) * 0.04 + p.act * 0.1;
    });
    const act = pads[activeIdx];
    tip.intensity += ((act ? 2.5 : 0) - tip.intensity) * 0.15;
    if (act) tip.color.copy(act.col);
    const open = act ? 0.05 : 0.16;
    fing[0].position.y += (open + 0.1 - fing[0].position.y) * 0.1; fing[1].position.y += (-(open + 0.1) - fing[1].position.y) * 0.1;
    robot.position.y = 0;
    renderer.render(scene, camera);
  }
  const setVisible =(v) => { visible = v; if (v && !raf) raf = requestAnimationFrame(frame); };
  new IntersectionObserver((es) => setVisible(es.some((e) => e.isIntersecting)), { rootMargin: '100px' }).observe(stage);

  // ---------- Scroll ----------
  const img = q('.s10-img');
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: stage, start: 'top top', end: '+=520%', pin: true, scrub: 0.8 } });
  if (img) tl.fromTo(img, { scale: 1 }, { scale: 1.55, duration: 6 }, 0);
  tl.to(st, { blend: 1, duration: 0.6, ease: 'power2.inOut' }, 0.2);
  tl.to(st, { t: 3, duration: 3.6 }, 0.8);
  tl.to(q('.s10-head'), { opacity: 0, y: -40, duration: 0.5 }, 4.7)
    .to(q('.s10-chips'), { opacity: 0, y: 40, duration: 0.5 }, 4.7)
    .to(canvas, { opacity: 0.3, duration: 0.6 }, 4.8)
    .to(el.querySelectorAll('.s10-end .card'), { opacity: 1, y: 0, duration: 0.8, stagger: 0.3, ease: 'power2.out' }, 5.0)
    .to({}, { duration: 0.6 });
}
