/* Bol chantant créé dans le navigateur (Web Audio) : jamais joué sans un geste du visiteur, jamais en mode calme.
   Partiels inharmoniques légèrement désaccordés (battements), attaque douce, longue résonance.
   Une pastille dit ce qui joue, avec un bouton Arrêter ; l'état est annoncé aux lecteurs d'écran. */
let ctx = null;
let actif = null;
let surFin = null;

export function sonDisponible() {
  return !!(window.AudioContext || window.webkitAudioContext);
}

export function jouerBol({ doux = false, fin } = {}) {
  if (!sonDisponible()) return false;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    arreterBol(true);
    const t0 = ctx.currentTime + 0.02;
    const duree = doux ? 6.5 : 9.5;
    const sortie = ctx.createGain();
    sortie.gain.setValueAtTime(0.0001, t0);
    sortie.gain.exponentialRampToValueAtTime(doux ? 0.1 : 0.22, t0 + 0.035);
    sortie.gain.exponentialRampToValueAtTime(0.0001, t0 + duree);
    sortie.connect(ctx.destination);
    const f0 = doux ? 196 : 220;
    const partiels = [[1, 1], [2.71, 0.42], [5.18, 0.2], [8.47, 0.09]];
    const oscs = [];
    partiels.forEach(([r, a], i) => {
      [-0.55, 0.55].forEach((det) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f0 * r + det * (i + 1);
        g.gain.setValueAtTime(a * 0.5, t0);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + duree * (1 - i * 0.18));
        o.connect(g); g.connect(sortie);
        o.start(t0); o.stop(t0 + duree + 0.1);
        oscs.push(o);
      });
    });
    surFin = fin || null;
    const minuteur = setTimeout(() => terminer(), duree * 1000);
    actif = { sortie, oscs, minuteur };
    return true;
  } catch (err) {
    console.warn('[son]', err);
    return false;
  }
}

function terminer() {
  actif = null;
  const f = surFin; surFin = null;
  f && f();
}

export function arreterBol(silencieux = false) {
  if (!actif || !ctx) return;
  const { sortie, oscs, minuteur } = actif;
  clearTimeout(minuteur);
  const t = ctx.currentTime;
  try {
    sortie.gain.cancelScheduledValues(t);
    sortie.gain.setValueAtTime(Math.max(sortie.gain.value, 0.0001), t);
    sortie.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    oscs.forEach((o) => { try { o.stop(t + 0.3); } catch {} });
  } catch {}
  if (silencieux) { actif = null; surFin = null; return; }
  terminer();
}

export const enCours = () => !!actif;
