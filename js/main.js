// Una magnífica humanidad · Magnifica humanitas para empezar (León XIV)
// Escena 3D ligera (Three.js local): frente a la torre de Babel, la muralla de Jerusalén crece un tramo con cada paso.
import * as THREE from './three.module.min.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.remove('no-js');
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const rand = (() => { let s = 11; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();

/* ---------------- Interfaz ---------------- */
requestAnimationFrame(() => document.body.classList.add('is-loaded'));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const menuBtn = document.querySelector('.top__btn'), menu = document.getElementById('menu'), curEl = document.getElementById('actual');
const setMenu = open => { menuBtn.setAttribute('aria-expanded', open); menu.hidden = !open; document.body.classList.toggle('menu-open', open); };
menuBtn.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
const dots = [...document.querySelectorAll('[data-dot]')], secs = [...document.querySelectorAll('.etapa')];
const navIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const n = e.target.dataset.n || null;
  dots.forEach(a => a.classList.toggle('is-active', a.dataset.dot === n));
  curEl.textContent = n ? 'Paso ' + n + ' · ' + dots[n - 1].querySelector('.nm').textContent : e.target.id === 'palabras' ? 'Palabras para entender' : e.target.id === 'final' ? 'Para profundizar' : 'Índice';
}), { rootMargin: '-45% 0px -45% 0px' });
[...secs, ...['inicio', 'prologo', 'palabras', 'final'].map(id => document.getElementById(id))].forEach(el => el && navIO.observe(el));
const wa = t => window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener');
document.querySelectorAll('[data-share]').forEach(b => b.addEventListener('click', () => {
  const n = +b.dataset.share, base = location.href.split('#')[0];
  if (!n) return wa('Una magnífica humanidad · La encíclica de León XIV en siete pasos sencillos\n' + base);
  const s = secs[n - 1];
  wa(`Una magnífica humanidad · Paso ${n}. ${s.querySelector('.etapa__lugar').textContent}: «${s.querySelector('.panel__title').textContent}»\n${s.querySelector('.breve__txt').textContent}\n${base}#${s.id}`);
}));

/* ---------------- Escena ---------------- */
const stageEl = document.querySelector('.stage');
let renderer = null;
try { renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('escena3d'), antialias: true, powerPreference: 'low-power' }); } catch (e) { renderer = null; }
if (!renderer) document.documentElement.classList.add('no-webgl'); else initScene();

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

function initScene() {
  const mobile = innerWidth < 760;
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene(), BG_N = new THREE.Color('#E8D9C0'), BG_W = new THREE.Color('#F2D7A6');
  scene.background = BG_N.clone(); scene.fog = new THREE.FogExp2(BG_N.clone(), .024);
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 400);
  const hemi = new THREE.HemisphereLight('#fff3dc', '#8a6d48', 1.6); scene.add(hemi);
  const moon = new THREE.DirectionalLight('#fff0d0', 2.2); moon.position.set(-10, 16, 10); scene.add(moon);
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  const glowTex = canvasTex(128, 128, g => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,240,205,1)'); r.addColorStop(.3, 'rgba(240,190,100,.55)'); r.addColorStop(1, 'rgba(201,163,91,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); });
  const glow = (color = '#ffffff', s = 1) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, depthWrite: false, opacity: 0 })); sp.scale.setScalar(s); scene.add(sp); return sp; };

  // suelo y estrellas
  const ground = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshStandardMaterial({ color: '#cdb995', roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; scene.add(ground);
  const SN = mobile ? 700 : 1200, sp = new Float32Array(SN * 3);
  for (let i = 0; i < SN; i++) { const th = rand() * Math.PI * 2, ph = rand() * Math.PI * .42; sp.set([Math.cos(th) * Math.sin(ph) * 120, Math.cos(ph) * 70 + 8, Math.sin(th) * Math.sin(ph) * 120], i * 3); }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: '#ffffff', size: mobile ? .38 : .3, fog: false, transparent: true, opacity: 0 })));

  /* Babel: torre escalonada con circuitos */
  const BX = 5.5, BZ = -1.5;
  const circ = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#2a2f33'; g.fillRect(0, 0, w, h); g.strokeStyle = '#59d4e6'; g.lineWidth = 2;
    for (let k = 0; k < 26; k++) { let x = rand() * w, y = rand() * h; g.beginPath(); g.moveTo(x, y);
      for (let j = 0; j < 4; j++) { if (rand() < .5) x += (rand() - .5) * 90; else y += (rand() - .5) * 90; g.lineTo(x, y); } g.stroke();
      g.fillStyle = '#9ff0ff'; g.fillRect(x - 3, y - 3, 6, 6); }
  });
  const towerMat = new THREE.MeshStandardMaterial({ color: '#66727c', map: circ, emissiveMap: circ, emissive: '#ffffff', emissiveIntensity: .4, roughness: .7 });
  const tower = new THREE.Group(); tower.position.set(BX, 0, BZ); scene.add(tower);
  for (let i = 0; i < 7; i++) { const w = 3.4 - i * .42, h = .9;
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), towerMat); m.position.y = h / 2 + i * h; tower.add(m); }
  const towerGlow = glow('#7fe6ff', 7); towerGlow.position.set(BX, 3.5, BZ);
  const towerLight = new THREE.PointLight('#5fd8f0', 0, 14, 1.5); towerLight.position.set(BX - 2, 4, BZ + 2); scene.add(towerLight);

  /* Jerusalén: siete tramos de muralla, uno por paso */
  const JX = -5, JZ = 1.5, JR = 3.4, N = 7;
  const stoneTex = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#b89a6a'; g.fillRect(0, 0, w, h);
    const rows = 6, rh = h / rows;
    for (let r = 0; r < rows; r++) { let x = r % 2 ? -30 : 0; while (x < w) { const bw = 50 + rand() * 40, v = 150 + rand() * 50;
      g.fillStyle = `rgb(${v},${v * .84},${v * .6})`; g.fillRect(x + 2, r * rh + 2, bw - 4, rh - 4); x += bw; } }
  });
  const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: .9 });
  const segs = [];
  // el primer tramo mira a la cámara (sur) y los demás siguen en el sentido de las agujas
  for (let i = 0; i < N; i++) {
    const a = Math.PI / 2 + i / N * Math.PI * 2, a2 = a + Math.PI * 2 / N, am = (a + a2) / 2;
    const len = 2 * JR * Math.sin(Math.PI / N) + .05;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(len, 1.5, .5), stoneMat);
    wall.position.set(JX + Math.cos(am) * JR * Math.cos(Math.PI / N), .75, JZ + Math.sin(am) * JR * Math.cos(Math.PI / N));
    wall.rotation.y = -am + Math.PI / 2; scene.add(wall);
    const tw = new THREE.Mesh(new THREE.CylinderGeometry(.38, .44, 2.1, 10), stoneMat);
    tw.position.set(JX + Math.cos(a) * JR, 1.05, JZ + Math.sin(a) * JR); scene.add(tw);
    const rub = new THREE.Group();
    for (let k = 0; k < 5; k++) { const r = new THREE.Mesh(new THREE.BoxGeometry(.25 + rand() * .3, .18 + rand() * .2, .25 + rand() * .3), stoneMat);
      r.position.set((rand() - .5) * len, .1, (rand() - .5) * 1.1); r.rotation.set(rand(), rand() * 3, rand()); rub.add(r); }
    rub.position.copy(wall.position); rub.position.y = 0; rub.rotation.y = wall.rotation.y; scene.add(rub);
    const lamp = glow('#ffd88a', .9); lamp.position.set(JX + Math.cos(am) * (JR - .8), .45, JZ + Math.sin(am) * (JR - .8));
    const torch = glow('#ffcf80', .7); torch.position.set(tw.position.x, 2.3, tw.position.z);
    segs.push({ wall, tw, rub, lamp, torch, am, b: 0 });
  }
  const temple = new THREE.Group(); temple.position.set(JX, 0, JZ); scene.add(temple);
  const tBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, .35, 1.5), stoneMat); tBase.position.y = .18; temple.add(tBase);
  const tBody = new THREE.Mesh(new THREE.BoxGeometry(.9, .9, 1.1), new THREE.MeshStandardMaterial({ color: '#e2cf9e', roughness: .7, emissive: '#e0a84e', emissiveIntensity: 0 })); tBody.position.y = .8; temple.add(tBody);
  const templeGlow = glow('#ffe0a0', 4); templeGlow.position.set(JX, 1.4, JZ);
  const cityLight = new THREE.PointLight('#ffcf80', 0, 16, 1.4); cityLight.position.set(JX, 3, JZ); scene.add(cityLight);

  // paso 2: el camino de la doctrina social, de Babel a la puerta de la ciudad
  const road = new THREE.CatmullRomCurve3([V(BX - 1.5, 0, BZ + 2.2), V(2.5, 0, 4.5), V(-1, 0, 6.5), V(-4, 0, JZ + JR + .9)]);
  const roadDots = Array.from({ length: 16 }, (_, i) => { const g = glow('#ffd27a', .55); g.position.copy(road.getPoint(i / 15)).setY(.2); return g; });
  // paso 3: la piedra angular, en la plaza
  const corner = new THREE.Mesh(new THREE.BoxGeometry(1, .28, .6), new THREE.MeshStandardMaterial({ color: '#cdb489', roughness: .85, emissive: '#ffcf80', emissiveIntensity: 0 }));
  corner.position.set(JX, .14, JZ + 1.5); scene.add(corner);
  const cornerGlow = glow('#ffe1a0', 1.8); cornerGlow.position.set(JX, .5, JZ + 1.5);
  // paso 5: tres puertas encendidas (verdad, trabajo, libertad)
  const gates = [0, 2, 5].map(i => { const am = segs[i].am, g = glow('#ffe3a8', 1); g.position.set(JX + Math.cos(am) * (JR + .25), 1, JZ + Math.sin(am) * (JR + .25)); g.scale.set(1.5, 2.2, 1); return g; });
  // paso 6: luces rojas de guerra y palomas de luz
  const redTex = canvasTex(64, 64, g => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,190,160,1)'); r.addColorStop(.3, 'rgba(255,70,40,.7)'); r.addColorStop(1, 'rgba(255,40,20,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
  const sparks = Array.from({ length: 40 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: redTex, transparent: true, depthWrite: false, opacity: 0 }));
    s.scale.setScalar(.3 + rand() * .25); scene.add(s); return { s, r: 2.5 + rand() * 4, h: 2 + rand() * 5, a: rand() * 6.28, w: .2 + rand() * .5 }; });
  const doves = Array.from({ length: 30 }, () => ({ s: glow('#fff6e6', .3 + rand() * .2), a: rand() * 6.28, r: .5 + rand() * 4, k: rand(), v: .25 + rand() * .3 }));
  // paso 7: hilos de esperanza entre las lámparas
  const thr = [];
  for (let i = 0; i < N; i++) { const p = segs[i].lamp.position, q = segs[(i + 3) % N].lamp.position; thr.push(p.x, .45, p.z, q.x, .45, q.z, p.x, .45, p.z, JX, 1, JZ); }
  const thrGeo = new THREE.BufferGeometry(); thrGeo.setAttribute('position', new THREE.Float32BufferAttribute(thr, 3));
  const thrMat = new THREE.LineBasicMaterial({ color: '#c8922e', transparent: true, opacity: 0, depthWrite: false });
  scene.add(new THREE.LineSegments(thrGeo, thrMat));

  /* Cámara guiada por el scroll */
  const CAMS = {
    over:  { p: V(0, 7, 19), t: V(0, 1.8, 0) },
    p1:    { p: V(.5, 5.5, 14), t: V(0, 2.2, 0) },
    p2:    { p: V(1, 8, 15), t: V(-.5, .3, 3) },
    p3:    { p: V(JX + 2, 9, JZ + 8), t: V(JX, 0, JZ) },
    p4:    { p: V(BX - 4.5, 4.5, BZ + 8), t: V(BX, 3, BZ) },
    p5:    { p: V(JX + 3, 4.5, JZ + 9), t: V(JX, 1, JZ) },
    p6:    { p: V(2, 6.5, 17), t: V(0, 3, 0) },
    p7:    { p: V(JX + 4, 7.5, JZ + 11), t: V(JX, 1.4, JZ) },
    final: { p: V(0, 10, 23), t: V(-1, 2, 0) },
  };
  const PORT = { over: { p: V(1, 8, 16), t: V(.3, 1.2, 0) }, p1: { p: V(3, 5, 11), t: V(2.5, 2.8, -1) }, p6: { p: V(4, 5.5, 12), t: V(3, 3.5, -1) } };
  const SHIFT = new Set(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7']);
  const shiftCam = c => { const d = c.t.clone().sub(c.p), r = d.clone().cross(V(0, 1, 0)).setY(0).normalize().multiplyScalar(d.length() * .2); return { p: c.p.clone().add(r), t: c.t.clone().add(r) }; };
  let keys = [], steps = [], war = [0, 0, 0], vh = innerHeight;
  function buildKeys() {
    const portrait = innerWidth < innerHeight, y0 = scrollY; vh = innerHeight; keys = [];
    document.querySelectorAll('[data-cam]').forEach(el => {
      const c = el.dataset.cam; if (c === 'travel') return;
      const r = el.getBoundingClientRect(), top = r.top + y0, bot = r.bottom + y0, a = top - vh * .1, b = Math.max(a, bot - vh * .9);
      const cm = (!portrait && SHIFT.has(c)) ? shiftCam(CAMS[c]) : (portrait && PORT[c]) || CAMS[c]; keys.push([a, cm], [b, cm]);
    });
    keys.sort((p, q) => p[0] - q[0]);
    steps = secs.map(s => { const top = s.getBoundingClientRect().top + y0; return [top - vh * .7, top - vh * .05]; });
    const s6 = secs[5].getBoundingClientRect(), t6 = s6.top + y0, h6 = s6.height;
    war = [t6 - vh * .6, t6 + h6 * .35, t6 + h6 * .6];
  }
  const tmpP = V(0, 0, 0), tmpT = V(0, 0, 0);
  function camAt(y) {
    if (y <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) {
      const [ya, a] = keys[i], [yb, b] = keys[i + 1];
      if (y <= yb) { const t = yb > ya ? smooth(0, 1, (y - ya) / (yb - ya)) : 1; return { p: tmpP.lerpVectors(a.p, b.p, t).clone(), t: tmpT.lerpVectors(a.t, b.t, t).clone() }; }
    }
    return keys[keys.length - 1][1];
  }
  const resize = () => { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); buildKeys(); };
  addEventListener('resize', resize); addEventListener('load', buildKeys); resize();

  const cur = { p: keys[0][1].p.clone(), t: keys[0][1].t.clone(), s: new Array(7).fill(0), war: 0, peace: 0 };
  const clock = new THREE.Clock(); let running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) { clock.getDelta(); loop(); } });
  const off = V(0, 0, 0);
  function loop() {
    if (!running) return;
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime, y = scrollY, mv = reduceMotion ? 0 : 1;
    const k = reduceMotion ? 1 : 1 - Math.exp(-dt * 2.8), k2 = reduceMotion ? 1 : 1 - Math.exp(-dt * 2.2);
    const c = camAt(y); cur.p.lerp(c.p, k); cur.t.lerp(c.t, k);
    steps.forEach((r, i) => { cur.s[i] += (smooth(r[0], r[1], y) - cur.s[i]) * k2; });
    cur.war += (smooth(war[0], war[1], y) * (1 - smooth(war[1], war[2], y)) - cur.war) * k2;
    cur.peace += (smooth(war[1], war[2], y) - cur.peace) * k2;
    const S = cur.s, port = camera.aspect < 1 ? 1 + (1 - camera.aspect) * .55 : 1;
    off.subVectors(cur.p, cur.t).multiplyScalar(port);
    camera.position.copy(cur.t).add(off); camera.position.x += Math.sin(t * .15) * .3 * mv; camera.lookAt(cur.t);

    // la muralla: un tramo por paso
    segs.forEach((g, i) => { const b = Math.max(.03, S[i]);
      g.wall.scale.y = b; g.wall.position.y = .75 * b; g.tw.scale.y = Math.max(.15, b); g.tw.position.y = 1.05 * Math.max(.15, b);
      g.rub.visible = b < .97; g.rub.scale.setScalar(1 - b * .9);
      g.lamp.material.opacity = S[i] * (.75 + Math.sin(t * 3 + i) * .1); g.torch.material.opacity = S[i] > .95 ? .35 + S[6] * .45 : 0; });
    // la torre: brilla en el paso de la IA y se apaga al final
    towerMat.emissiveIntensity = .4 + S[3] * (.55 + Math.sin(t * 2.2) * .15) * (1 - S[5] * .7) - S[6] * .15;
    towerGlow.material.opacity = S[3] * .35 * (1 - S[5] * .8); towerLight.intensity = S[3] * 6 * (1 - S[5] * .8);
    roadDots.forEach((d, i) => { d.material.opacity = smooth(i / 16, i / 16 + .12, S[1] * 1.15) * (.7 + Math.sin(t * 2 + i) * .1); });
    corner.material.emissiveIntensity = S[2] * .4; cornerGlow.material.opacity = S[2] * (.6 + Math.sin(t * 1.5) * .06);
    gates.forEach((g, i) => { g.material.opacity = S[4] * (.5 + Math.sin(t * 2 + i) * .06) + S[6] * .2; });
    sparks.forEach((s, i) => { const a = s.a + t * s.w * mv; s.s.position.set(BX + Math.cos(a) * s.r, s.h + Math.sin(t * 1.3 + i) * .3, BZ + Math.sin(a) * s.r * .8); s.s.material.opacity = cur.war * .9; });
    doves.forEach(d => { const q = (d.k + t * .05 * d.v * mv) % 1, a = d.a + q * 3;
      d.s.position.set(JX + Math.cos(a) * (d.r * .4 + q * 5), 1 + q * 11, JZ + Math.sin(a) * (d.r * .4 + q * 5)); d.s.material.opacity = cur.peace * (1 - q) * .9; });
    // paso 7: la ciudad entera se ilumina
    thrMat.opacity = S[6] * (.45 + Math.sin(t * 1.6) * .06);
    tBody.material.emissiveIntensity = S[2] * .2 + S[6] * .7;
    templeGlow.material.opacity = S[2] * .25 + S[6] * (.8 + Math.sin(t * 1.4) * .08);
    cityLight.intensity = 2 + S.reduce((a, b) => a + b, 0) * 1.4 + S[6] * 9;
    scene.background.lerpColors(BG_N, BG_W, S[6] * .9); scene.fog.color.copy(scene.background); hemi.intensity = 1.6 + S[6] * .4;
    renderer.render(scene, camera);
  }
  loop();
  requestAnimationFrame(() => stageEl.classList.add('is-ready'));
}
