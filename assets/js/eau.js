/* Eau vivante (WebGL) : la photo d'ouverture ondule doucement, le curseur ou le doigt y trace des ondes,
   et l'agitation baisse à mesure que le cadran Point Zéro descend vers 0.
   - Le dessin ne tourne qu'à l'écran, onglet visible, jamais en mode calme (boucle du socle).
   - Densité de pixels limitée (1,25 sur ordinateur, 1 sur téléphone), 60 images par seconde au plus,
     résolution réduite d'elle-même si les images prennent trop de temps.
   - Sans WebGL, ou en cas d'erreur, rien n'est affiché : la photo reste en place dessous. */
import { boucle, etat, quand } from './socle/index.js?v=1';

const VS = `attribute vec2 p; varying vec2 v; void main(){ v = vec2(p.x * .5 + .5, .5 - p.y * .5); gl_Position = vec4(p, 0., 1.); }`;
const FS = `precision mediump float;
varying vec2 v;
uniform sampler2D uTex;
uniform vec2 uRes, uImg, uPos;
uniform float uT, uAgit;
uniform vec4 uO[6];
void main(){
  float rc = uRes.x / uRes.y, ri = uImg.x / uImg.y;
  vec2 echelle = rc > ri ? vec2(1., ri / rc) : vec2(rc / ri, 1.);
  vec2 decal = (1. - echelle) * uPos;
  float eau = smoothstep(.36, .62, v.y);
  vec2 d = vec2(0.);
  d.x += sin(v.y * 92. + uT * 1.2 + sin(v.x * 7. + uT * .3) * 2.) * .0015 * uAgit * eau;
  d.y += sin(v.x * 26. + v.y * 44. + uT * .85) * .0021 * uAgit * eau;
  float lum = 0.;
  for (int i = 0; i < 6; i++) {
    vec4 o = uO[i];
    if (o.w <= 0.) continue;
    vec2 q = (v - o.xy) * vec2(rc, 1.);
    float r = length(q);
    float front = o.z * .32;
    float k = (r - front);
    float w = sin(k * 64.) * exp(-abs(k) * 16.) * exp(-o.z * 1.3) * o.w;
    d += (q / (r + 1e-4)) * w * .011;
    lum += w;
  }
  vec3 c = texture2D(uTex, decal + (v + d) * echelle).rgb;
  c += vec3(1., .9, .72) * max(lum, 0.) * .07;
  gl_FragColor = vec4(c, 1.);
}`;

function compiler(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLImageElement} img  la photo d'ouverture (même cadrage que object-position)
 * @param {{ agitation: () => number }} o
 */
export function eauVivante(canvas, img, o) {
  if (etat.calme || !canvas || !img) return null;
  let gl = null;
  /* Contexte non opaque : un canvas déclaré opaque fait sauter le dessin des couches dessous, ce qui laissait un trou
     au bas de l'ouverture dans certains navigateurs. Le dessin reste opaque (alpha 1 dans le shader). */
  try { gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' }); } catch {}
  if (!gl) return null;
  let prog, tex, u = {};
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compiler(gl, gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compiler(gl, gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ['uTex', 'uRes', 'uImg', 'uPos', 'uT', 'uAgit', 'uO'].forEach((n) => (u[n] = gl.getUniformLocation(prog, n)));
    tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  } catch (err) {
    console.warn('[eau] WebGL indisponible', err);
    return null;
  }

  const telephone = matchMedia('(max-width: 760px)').matches || matchMedia('(pointer: coarse)').matches;
  const dprMax = telephone ? 1 : 1.25;
  /* Rendu logiciel (pas de carte graphique) : on part directement en résolution réduite. */
  let logiciel = false;
  try {
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const nom = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    logiciel = /swiftshader|llvmpipe|software|basic render/i.test(nom);
  } catch {}
  let qualite = logiciel ? 0.5 : 1, largeur = 0, hauteur = 0, pos = [0.5, 0.5], pret = false;
  const ondes = new Float32Array(24); /* x, y, âge, force × 6 */
  let prochaine = 0;

  function charger() {
    if (!img.complete || !img.naturalWidth) return;
    try {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.uniform2f(u.uImg, img.naturalWidth, img.naturalHeight);
      const op = getComputedStyle(img).objectPosition.split(' ').map((x) => parseFloat(x) / 100);
      pos = [isNaN(op[0]) ? 0.5 : op[0], isNaN(op[1]) ? 0.5 : op[1]];
      gl.uniform2f(u.uPos, pos[0], pos[1]);
      pret = true;
    } catch (err) { console.warn('[eau] texture', err); }
  }

  function dimensionner() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, dprMax) * qualite;
    largeur = Math.max(2, Math.round(r.width * dpr));
    hauteur = Math.max(2, Math.round(r.height * dpr));
    canvas.width = largeur; canvas.height = hauteur;
    gl.viewport(0, 0, largeur, hauteur);
    gl.uniform2f(u.uRes, largeur, hauteur);
  }

  img.addEventListener('load', charger);
  const ro = new ResizeObserver(() => { dimensionner(); charger(); });
  ro.observe(canvas);
  dimensionner();
  charger();

  /* Pendant le défilement, l'image reste figée : le navigateur garde toute sa marge pour faire glisser la page. */
  let dernierDefil = -1e9;
  window.addEventListener('scroll', () => { dernierDefil = performance.now(); }, { passive: true });

  let accu = 0, lent = 0, temps = 0, affiche = false;
  const ctl = boucle(canvas, (dt) => {
    if (!pret) return;
    if (affiche && performance.now() - dernierDefil < 140) return;
    accu += dt;
    if (accu < 1 / 61) return; /* 60 images par seconde au plus */
    const pas = accu; accu = 0;
    /* Qualité qui baisse d'elle-même si les images prennent trop de temps. */
    lent = pas > 1 / 38 ? lent + 1 : Math.max(0, lent - 1);
    if (lent > 40 && qualite > 0.55) { qualite *= 0.8; lent = 0; dimensionner(); }
    temps += pas;
    for (let i = 0; i < 6; i++) if (ondes[i * 4 + 3] > 0) { ondes[i * 4 + 2] += pas; if (ondes[i * 4 + 2] > 3.2) ondes[i * 4 + 3] = 0; }
    gl.uniform1f(u.uT, temps);
    gl.uniform1f(u.uAgit, o.agitation());
    gl.uniform4fv(u.uO, ondes);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!affiche) { affiche = true; canvas.classList.add('actif'); }
  }, { lourde: true });

  function onde(x, y, force = 0.7) {
    const i = prochaine; prochaine = (prochaine + 1) % 6;
    ondes.set([x, y, 0, force], i * 4);
  }

  /* Ondes sous la souris (un peu espacées) et au toucher. Coordonnées gardées : aucune mesure pendant le défilement. */
  const zone = canvas.closest('.hero') || canvas;
  let haut = 0, gauche = 0, l = 1, h = 1, dernier = 0, lx = -1, ly = -1;
  const remesurer = () => { const r = zone.getBoundingClientRect(); haut = r.top + window.scrollY; gauche = r.left; l = r.width || 1; h = r.height || 1; };
  remesurer();
  window.addEventListener('resize', remesurer, { passive: true });
  quand('rafraichi', remesurer);
  const versUv = (e) => [(e.clientX - gauche) / l, (e.clientY - (haut - window.scrollY)) / h];
  zone.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const t = performance.now();
    if (t - dernier < 110 || Math.hypot(e.clientX - lx, e.clientY - ly) < 26) return;
    dernier = t; lx = e.clientX; ly = e.clientY;
    const [x, y] = versUv(e);
    onde(x, y, 0.55);
  }, { passive: true });
  zone.addEventListener('pointerdown', (e) => { const [x, y] = versUv(e); onde(x, y, 1); }, { passive: true });

  return { onde, arreter() { ctl.arreter(); ro.disconnect(); } };
}
