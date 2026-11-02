/* Effets propres au site de Muriel Chaplain. Le socle gère l'ouverture, les transitions, l'en-tête, le menu,
   le mode calme, les boucles et les mesures ; ce fichier ne contient que ce qui est propre au site :
   - intro : goutte, ondes, « Esprit · Âme · Corps » qui deviennent « Réunis », cadran de 10 à 0, l'onde s'ouvre ;
   - cadran Point Zéro dans l'en-tête, lié à la lecture ; eau vivante (WebGL) à l'ouverture de l'accueil ;
   - guide « Quel soin pour moi ? », séance de 10 à 0 (scène épinglée), spirale du Pilier, agenda automatique,
     bol chantant, voyage (galerie horizontale épinglée, nuit et étoiles), lotus qui s'ouvre, plan, formulaire en étapes ;
   - Libérations : « 10 » qui se dissout, fil qui se dénoue, échelle de 10 à 0, onde du déroulé, mots qui tournent ;
   - Reconnexion : aube, intentions qui s'allument, éventail, simulateur, lumière par paliers. */
import { demarrer, boucle, etat, rafraichir, aller, allerAncre, quand } from './socle/index.js?v=1';
import { eauVivante } from './eau.js?v=1';
import { jouerBol, arreterBol, sonDisponible } from './son.js?v=1';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const html = document.documentElement;
const BUREAU = '(min-width: 900px) and (min-height: 520px)';
/* Le voyage n'est épinglé que sur un écran assez haut pour que chaque carte tienne entière. */
const BUREAU_VOYAGE = '(min-width: 900px) and (min-height: 760px)';
/* Typographie française pour les textes posés par le script (espace insécable avant : ; ! ? » et après «). */
const typo = (t) => String(t).replace(/ ([:;!?»])/g, '\u00a0$1').replace(/« /g, '«\u00a0');
let progresPage = 0;
let sonActive = false;
try { sonActive = sessionStorage.getItem('muriel:son') === 'oui'; } catch {}

/* ---------- Cadran Point Zéro (en-tête) ---------- */
function cadran() {
  const el = $('[data-cadran]');
  if (!el) return;
  const chiffre = $('[data-cadran-chiffre]', el);
  const arc = $('.cadran-arc', el);
  let dernier = 10, zeroJoue = false;
  const maj = (p) => {
    progresPage = p;
    const n = Math.max(0, Math.min(10, Math.round(10 * (1 - p))));
    arc.style.strokeDashoffset = String(100 * p);
    if (n !== dernier) {
      dernier = n;
      chiffre.textContent = String(n);
      el.classList.toggle('zero', n === 0);
      if (n === 0 && !zeroJoue && sonActive && !etat.calme) { zeroJoue = true; jouerBol({ doux: true }); }
    }
  };
  /* Lecture directe de la position (pas de ScrollTrigger : rien ne tourne quand la page est immobile, mode calme compris).
     Hauteur de page mesurée au redimensionnement et après chaque rafraîchissement des mesures. */
  let course = 1;
  const mesurer = () => { course = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); };
  const lire = () => maj(Math.max(0, Math.min(1, window.scrollY / course)));
  mesurer();
  lire();
  window.addEventListener('scroll', lire, { passive: true });
  window.addEventListener('resize', () => { mesurer(); lire(); }, { passive: true });
  quand('rafraichi', () => { mesurer(); lire(); });
}

/* Après un saut (lien vers une section, retour au même endroit), l'en-tête reste visible pour situer la lecture ;
   il se cache de nouveau après 24 px de descente. */
function enteteApresSaut() {
  let dernierY = window.scrollY, depuis = null, raf = 0;
  window.addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const y = window.scrollY, d = y - dernierY;
      dernierY = y;
      if (Math.abs(d) > window.innerHeight * 1.2) { depuis = y; html.classList.remove('entete-cache'); return; }
      if (depuis === null) return;
      if (y < depuis) { depuis = null; return; }
      if (y > depuis + 24) { depuis = null; html.classList.add('entete-cache'); } else html.classList.remove('entete-cache');
    });
  }, { passive: true });
}

/* ---------- Intro ---------- */
function introTimeline() {
  if (!gsap) return null;
  const panneau = $('[data-ouverture]');
  const mots = $$('.intro-mot');
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  const vh = window.innerHeight;
  const portrait = matchMedia('(max-width: 760px) and (orientation: portrait)').matches;
  /* Écart de chaque mot au centre : mesuré une fois, au début de l'intro. */
  const pr = panneau.getBoundingClientRect();
  const centre = { x: pr.left + pr.width / 2, y: pr.top + pr.height / 2 };
  const ecarts = mots.map((m) => { const r = m.getBoundingClientRect(); return { x: centre.x - (r.left + r.width / 2), y: centre.y - (r.top + r.height / 2) }; });
  const compteur = { n: 10 };
  const cad = $('[data-intro-cadran]');
  tl.fromTo('.intro-goutte', { y: -vh * 0.42, opacity: 0, scaleY: 1.5 }, { y: 0, opacity: 1, scaleY: 1, duration: 0.42, ease: 'power2.in' }, 0.05)
    .to('.intro-goutte', { opacity: 0, scale: 0.2, duration: 0.18, ease: 'power1.out' }, 0.47)
    .fromTo('.intro-onde', { attr: { r: 0.5 }, opacity: 0.95 }, { attr: { r: (i) => [14, 30, 49][i] }, opacity: 0.2, duration: 1.3, stagger: 0.1, ease: 'power2.out' }, 0.45)
    .fromTo(mots, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.42, stagger: 0.07 }, 0.55)
    .to(mots, { x: (i) => ecarts[i].x * (portrait ? 0 : 1), y: (i) => ecarts[i].y * (portrait ? 1 : 0), opacity: 0, scale: 0.85, duration: 0.36, ease: 'power2.in' }, 1.12)
    .fromTo('.intro-reunis', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.42 }, 1.36)
    .to(compteur, { n: 0, duration: 0.6, ease: 'power1.inOut', onUpdate: () => { if (cad) cad.textContent = String(Math.round(compteur.n)); } }, 1.0);
  /* L'onde centrale s'ouvre en cercle et découvre la page. */
  const rayon = Math.hypot(window.innerWidth, vh) * 0.62 + 60;
  const seuil = Math.hypot(window.innerWidth / 2, vh / 4);
  const trou = { r: -60 };
  delete panneau.dataset.gouttiere;
  tl.to(trou, {
    r: rayon, duration: 0.62, ease: 'power3.in',
    onUpdate: () => {
      panneau.style.setProperty('--trou', trou.r + 'px');
      if (trou.r > seuil) panneau.dataset.gouttiere = '#f6f0e6'; else delete panneau.dataset.gouttiere;
    },
  }, 1.66);
  arriveeHero(tl, 1.78);
  return tl;
}

/* Premier écran : le titre monte ligne à ligne, le reste suit. Sert à l'intro et à l'arrivée sous le voile. */
function arriveeHero(tl, t0) {
  if (!$('.hero-ligne')) return;
  tl.fromTo('.hero-ligne',
    { yPercent: 60, opacity: 1, clipPath: 'polygon(-5% 140%, 105% 140%, 105% 140%, -5% 140%)' },
    { yPercent: 0, opacity: 1, clipPath: 'polygon(-5% -40%, 105% -40%, 105% 140%, -5% 140%)', duration: 0.85, stagger: 0.1, ease: 'power3.out', clearProps: 'clipPath' }, t0)
    .fromTo('.hero-surtitre, .hero-intro, .hero-actions, .hero-info', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.07 }, t0 + 0.08);
  if ($('[data-dix]')) {
    tl.fromTo('[data-dix]', { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 0.5 }, t0 - 0.1)
      .to('[data-dix]', { opacity: 0, yPercent: 14, duration: 0.7, ease: 'power2.in', onStart: gouttesDix }, t0 + 0.45);
  }
  if ($('[data-aube]')) tl.fromTo('[data-aube]', { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' }, t0);
}

/* Le « 10 » se dissout en gouttes. */
function gouttesDix() {
  const dix = $('[data-dix]');
  if (!dix || etat.calme) return;
  const r = dix.getBoundingClientRect();
  const fond = dix.parentElement;
  const fr = fond.getBoundingClientRect();
  for (let i = 0; i < 9; i++) {
    const g = document.createElement('span');
    g.className = 'goutte-dix';
    g.setAttribute('aria-hidden', 'true');
    g.setAttribute('data-audit-ignorer', '');
    g.setAttribute('data-ephemere', '');
    Object.assign(g.style, { position: 'absolute', zIndex: 3, width: '6px', height: '9px', borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%', background: 'rgba(246,240,230,.55)',
      left: (r.left - fr.left + r.width * (0.2 + Math.random() * 0.6)) + 'px', top: (r.top - fr.top + r.height * (0.45 + Math.random() * 0.3)) + 'px', pointerEvents: 'none' });
    fond.appendChild(g);
    gsap.fromTo(g, { y: 0, opacity: 0.9 }, { y: 80 + Math.random() * 120, opacity: 0, duration: 0.9 + Math.random() * 0.6, delay: Math.random() * 0.3, ease: 'power2.in', onComplete: () => g.remove() });
  }
}

/* ---------- Eau vivante ---------- */
function eau() {
  const canvas = $('[data-eau]');
  if (!canvas) return;
  const img = $('.hero-media img');
  const lancer = () => eauVivante(canvas, img, { agitation: () => 0.15 + 0.85 * Math.max(0, 1 - progresPage * 6) });
  if (etat.pret) lancer(); else quand('pret', lancer);
}

/* ---------- Parallaxe douce (images plus grandes que leur déplacement) ---------- */
function parallaxes() {
  if (!gsap || !ST || etat.calme) return;
  $$('.hero-fond').forEach((f) => {
    gsap.fromTo(f, { yPercent: 0 }, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: f.closest('.hero'), start: 'top top', end: 'bottom top', scrub: true } });
  });
  $$('.objectif-media img, .intentions-media img, .seance-media img').forEach((img) => {
    gsap.set(img, { scale: 1.16 });
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('.offre-media--respire img, .muriel-arche img, .principe-media img, .deroule-media img, .temoignage-media img').forEach((img) => {
    gsap.fromTo(img, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ---------- Guide « Quel soin pour moi ? » ---------- */
function guide() {
  const g = $('[data-guide]');
  if (!g) return;
  const grille = $('.soins-grille');
  const reponse = $('[data-guide-reponse]', g);
  const vide = reponse.textContent;
  const boutons = $$('[data-envie]', g);
  boutons.forEach((b) => b.addEventListener('click', () => {
    const deja = b.getAttribute('aria-pressed') === 'true';
    boutons.forEach((x) => x.setAttribute('aria-pressed', 'false'));
    $$('.soin', grille).forEach((s) => s.classList.remove('conseille'));
    if (deja) { grille.classList.remove('guide-actif'); reponse.textContent = vide; return; }
    b.setAttribute('aria-pressed', 'true');
    const carte = $(`[data-soin="${b.dataset.envie}"]`, grille);
    carte.classList.add('conseille');
    grille.classList.add('guide-actif');
    reponse.textContent = typo(reponse.dataset.modele.replace('{envie}', b.dataset.envieTexte).replace('{soin}', b.dataset.soinNom));
    /* Sur téléphone, la carte conseillée vient à l'écran. */
    if (matchMedia('(max-width: 760px)').matches) aller(carte);
  }));
}

/* ---------- Séance de 10 à 0 (épinglée sur ordinateur) ---------- */
function seance() {
  const s = $('[data-scene-seance]');
  if (!s || !gsap || !ST || etat.calme) return;
  const etapes = $$('[data-etape-seance]', s);
  const notes = etapes.map((e) => +e.dataset.note);
  const chiffre = $('[data-grand-chiffre]', s);
  const arc = $('[data-grand-arc]', s);
  ST.matchMedia({
    [BUREAU]: () => {
      s.setAttribute('data-plein-ecran', '');
      s.setAttribute('data-entete-cache', '');
      /* Le grand cadran affiche toujours la note de l'étape visible ; il descend vers elle quand l'étape change. */
      let actuelle = 0;
      const compteur = { n: notes[0] };
      const afficher = () => { chiffre.textContent = String(Math.round(compteur.n)); arc.style.strokeDashoffset = String(100 * (1 - compteur.n / 10)); };
      const montrer = (i) => {
        if (i === actuelle) return;
        const avant = etapes[actuelle];
        actuelle = i;
        gsap.to(avant, { autoAlpha: 0, y: -18, duration: 0.35, overwrite: true });
        gsap.fromTo(etapes[i], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45, delay: 0.12, overwrite: true });
        gsap.to(compteur, { n: notes[i], duration: 0.6, ease: 'power2.out', overwrite: true, onUpdate: afficher });
      };
      gsap.set(etapes, { autoAlpha: 0 });
      gsap.set(etapes[0], { autoAlpha: 1, y: 0 });
      afficher();
      const st = ST.create({
        trigger: s, start: 'top top', end: () => '+=' + Math.round(window.innerHeight * 2.2), pin: true, anticipatePin: 1,
        onUpdate: (x) => montrer(Math.min(notes.length - 1, Math.round(x.progress * (notes.length - 1)))),
      });
      return () => { st.kill(); gsap.set(etapes, { clearProps: 'all' }); s.removeAttribute('data-plein-ecran'); s.removeAttribute('data-entete-cache'); };
    },
  });
}

/* Mentions légales : en haut de page, avant la première section, aucun lien du sommaire n'est marqué comme en cours. */
function sommaireHaut() {
  const sommaire = $('[data-sommaire]');
  const premier = sommaire && $('a[href^="#"]', sommaire);
  const cible = premier && document.getElementById(decodeURIComponent(premier.hash.slice(1)));
  if (!cible) return;
  let raf = 0;
  const maj = () => {
    raf = 0;
    if (cible.getBoundingClientRect().top > window.innerHeight * 0.4) $$('[aria-current]', sommaire).forEach((x) => x.removeAttribute('aria-current'));
  };
  window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => requestAnimationFrame(maj)); }, { passive: true });
}

/* En-tête caché pendant les scènes épinglées (séance, voyage) : seulement quand la scène est réellement épinglée
   (attribut data-entete-cache posé par la scène, selon la taille de l'écran). */
function scenesSansEntete() {
  const scenes = $$('[data-scene-seance], [data-scene-voyage]');
  if (!scenes.length || !('IntersectionObserver' in window)) return;
  const dans = new Set();
  const maj = () => html.classList.toggle('scene-sans-entete', [...dans].some((x) => x.hasAttribute('data-entete-cache')));
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => (e.isIntersecting ? dans.add(e.target) : dans.delete(e.target)));
    maj();
  }, { rootMargin: '-45% 0px -45% 0px' });
  scenes.forEach((x) => io.observe(x));
  quand('rafraichi', maj);
}

/* ---------- Spirale dorée à côté du dessin du Pilier ---------- */
function spirale() {
  const p = $('[data-spirale]');
  if (!p) return;
  const pts = [];
  const tours = 3.4, n = 260;
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = t * tours * Math.PI * 2 - Math.PI / 2, r = 6 + t * 84;
    pts.push(`${(100 + Math.cos(a) * r).toFixed(1)} ${(100 + Math.sin(a) * r * 1.12).toFixed(1)}`);
  }
  p.setAttribute('d', 'M' + pts.join(' L'));
  p.setAttribute('pathLength', '100');
  if (!gsap || !ST || etat.calme) { p.style.strokeDashoffset = '0'; return; }
  gsap.fromTo(p, { strokeDashoffset: 100 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: p.closest('.offre'), start: 'top 85%', end: 'bottom 45%', scrub: 0.6 } });
}

/* ---------- Agenda : dates passées, jour même, prochaine date, calculés à la date de Paris ---------- */
function agenda() {
  const a = $('[data-agenda]');
  if (!a) return;
  const jour = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date());
  const ms = (d) => Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10));
  const items = $$('[data-date]', a);
  const prochaine = items.map((li) => li.dataset.date).find((d) => d >= jour);
  items.forEach((li) => {
    const d = li.dataset.date, st = $('[data-statut]', li);
    li.classList.toggle('passe', d < jour);
    li.classList.toggle('aujourdhui', d === jour);
    li.classList.toggle('prochaine', d === prochaine && d !== jour);
    if (d < jour) st.textContent = typo(a.dataset.termine);
    else if (d === jour) st.textContent = typo(a.dataset.aujourdhui);
    else if (d === prochaine) {
      const n = Math.round((ms(d) - ms(jour)) / 86400000);
      st.textContent = typo(n === 1 ? a.dataset.demain : a.dataset.dans.replace('{n}', n));
    } else st.textContent = '';
  });
  const aucune = $('[data-agenda-aucune]', a);
  if (aucune) aucune.hidden = !!prochaine;
}

/* ---------- Bol chantant ---------- */
function bol() {
  const bouton = $('[data-bol]');
  const pastille = $('[data-son-pastille]');
  const texte = pastille && $('[data-son-texte]', pastille);
  const joue = texte ? texte.textContent : '';
  if (!bouton) return;
  if (etat.calme || !sonDisponible()) { bouton.hidden = true; const note = $('.son-note'); if (note) note.hidden = true; return; }
  const ondes = $$('[data-bol-ondes] span');
  let anim = null;
  const fin = () => {
    if (anim) { anim.kill(); anim = null; gsap.set(ondes, { opacity: 0 }); }
    if (pastille) { texte.textContent = typo(pastille.dataset.fini || ''); setTimeout(() => { pastille.hidden = true; texte.textContent = joue; }, 900); }
  };
  bouton.addEventListener('click', () => {
    if (!jouerBol({ fin })) return;
    sonActive = true;
    try { sessionStorage.setItem('muriel:son', 'oui'); } catch {}
    if (pastille) { texte.textContent = joue; pastille.hidden = false; }
    if (gsap && ondes.length) {
      if (anim) anim.kill();
      anim = gsap.timeline({ repeat: 3 }).fromTo(ondes, { scale: 0.1, opacity: 0.95 }, { scale: 1.7, opacity: 0, duration: 2.2, stagger: 0.55, ease: 'power1.out' });
    }
  });
  if (pastille) $('[data-son-arreter]', pastille).addEventListener('click', () => { arreterBol(); fin(); bouton.focus({ preventScroll: true }); });
}

/* ---------- Voyage : galerie horizontale épinglée, nuit et étoiles ---------- */
function voyage() {
  const s = $('[data-scene-voyage]');
  if (!s) return;
  const piste = $('.voyage-piste', s);
  const barre = $('[data-voyage-progres]', s);
  const nuit = $('[data-voyage-nuit]', s);
  const etoiles = $$('[data-etoiles] span', s);
  const media = $('.voyage-media', s);
  const ciel = (p) => {
    const q = Math.max(0, (p - 0.62) / 0.38);
    if (nuit) nuit.style.opacity = String(q * 0.88);
    etoiles.forEach((e, i) => { e.style.opacity = String(Math.max(0, Math.min(1, q * 1.6 - (i / etoiles.length) * 0.7))); });
  };
  if (!gsap || !ST || etat.calme) { ciel(0); return; }
  ST.matchMedia({
    [BUREAU_VOYAGE]: () => {
      piste.removeAttribute('tabindex');
      s.setAttribute('data-plein-ecran', '');
      s.setAttribute('data-entete-cache', '');
      const distance = () => Math.max(0, piste.scrollWidth - window.innerWidth);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: s, start: 'top top', end: () => '+=' + distance(), pin: true, anticipatePin: 1, scrub: 0.6, invalidateOnRefresh: true,
          onUpdate: (x) => { barre.style.transform = `scaleX(${x.progress})`; ciel(x.progress); },
        },
      });
      tl.fromTo(piste, { x: 0 }, { x: () => -distance(), ease: 'none' }, 0);
      if (media) tl.fromTo(media, { xPercent: 0 }, { xPercent: -6, ease: 'none' }, 0);
      return () => { piste.setAttribute('tabindex', '0'); s.removeAttribute('data-plein-ecran'); s.removeAttribute('data-entete-cache'); ciel(0); };
    },
    '(max-width: 899px), (max-height: 759px)': () => {
      /* Sur téléphone : la piste glisse au doigt ; progression et ciel suivent sa position (largeur mesurée au redimensionnement). */
      let max = 1;
      const mesurer = () => { max = Math.max(1, piste.scrollWidth - piste.clientWidth); };
      mesurer();
      const onScroll = () => { const p = piste.scrollLeft / max; barre.style.transform = `scaleX(${p})`; ciel(p); };
      piste.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', mesurer);
      return () => { piste.removeEventListener('scroll', onScroll); window.removeEventListener('resize', mesurer); };
    },
  });
}

/* ---------- Lotus qui s'ouvre, plan qui se dessine ---------- */
function lotus() {
  $$('[data-lotus]').forEach((l) => {
    const m = $('.lotus-media', l), c = $('.lotus-trait circle', l);
    if (!gsap || !ST || etat.calme) return;
    gsap.timeline({ scrollTrigger: { trigger: l, start: 'top 82%', once: true } })
      .fromTo(c, { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0)
      .fromTo($('picture', m), { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(50% at 50% 50%)', duration: 1.3, ease: 'power3.out' }, 0.35)
      .fromTo($('img', m), { scale: 0.7, rotate: -25 }, { scale: 1, rotate: 0, duration: 1.6, ease: 'power3.out' }, 0.35);
  });
  const zone = $('[data-plan-zone]');
  if (zone && gsap && ST && !etat.calme) {
    gsap.timeline({ scrollTrigger: { trigger: zone.closest('.plan'), start: 'top 85%', once: true } })
      .fromTo(zone, { scale: 0.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out', svgOrigin: '200 138' })
      .fromTo('.plan-halo', { scale: 1, opacity: 0.8 }, { scale: 2.6, opacity: 0, duration: 1.2, repeat: 2, ease: 'power1.out', svgOrigin: '172 112' }, 0.3)
      .set('.plan-halo', { opacity: 0.6, scale: 1 });
  }
}

/* ---------- Formulaire de rendez-vous en étapes ---------- */
function formulaire() {
  const f = $('[data-etapes]');
  if (!f) return;
  const etapes = $$('[data-etape]', f);
  const cadre = $('[data-etapes-cadre]', f);
  const prec = $('[data-precedent]', f), suiv = $('[data-suivant]', f), env = $('[data-envoyer]', f);
  const statut = $('[data-etape-statut]', f);
  const erreur = $('[data-etape-erreur]', f);
  const progres = $$('[data-progres]', f);
  const recap = { sujet: $('[data-recap-sujet]'), lieu: $('[data-recap-lieu]'), dispo: $('[data-recap-dispo]') };
  const champDuree = $('#f-duree', f).closest('.champ'), champFormule = $('[data-formule-champ]', f);
  let courante = 0;

  const libelleCoche = (nom) => { const c = $(`input[name="${nom}"]:checked`, f); return c ? c.closest('label').textContent.trim() : ''; };
  const majRecap = () => {
    const sujet = $('input[name="sujet"]:checked', f);
    const v = sujet ? sujet.value : '';
    champFormule.hidden = v !== 'reconnexion';
    champDuree.hidden = !['liberations', 'energetique', 'massage', 'sonotherapie', 'pilier', 'cheval'].includes(v);
    let s = libelleCoche('sujet');
    const d = $('#f-duree', f), fo = $('#f-formule', f);
    if (s && !champDuree.hidden && d.value) s += ' · ' + d.options[d.selectedIndex].textContent;
    if (s && !champFormule.hidden && fo.value) s += ' · ' + fo.options[fo.selectedIndex].textContent;
    recap.sujet.textContent = s || '—';
    recap.lieu.textContent = libelleCoche('lieu') || '—';
    const coches = (nom) => $$(`input[name="${nom}"]:checked`, f).map((c) => c.closest('label').textContent.trim());
    const dispo = [...coches('jours'), ...coches('moments')].join(', ');
    recap.dispo.textContent = dispo || '—';
  };

  const afficher = (i, focus = true) => {
    const h0 = cadre.offsetHeight;
    etapes.forEach((e, k) => e.classList.toggle('active', k === i));
    const h1 = cadre.offsetHeight;
    if (gsap && !etat.calme && h0 && h0 !== h1) gsap.fromTo(cadre, { height: h0 }, { height: h1, duration: 0.42, ease: 'power2.out', clearProps: 'height', onComplete: rafraichir });
    else rafraichir();
    prec.hidden = i === 0;
    suiv.hidden = i === etapes.length - 1;
    env.hidden = i !== etapes.length - 1;
    progres.forEach((p, k) => { p.classList.toggle('actif', k === i); p.classList.toggle('fait', k < i); });
    statut.textContent = typo(statut.dataset.modele.replace('{n}', i + 1) + ' : ' + $('legend', etapes[i]).textContent.trim());
    erreur.hidden = true;
    courante = i;
    if (focus) { const c = $('input, select, textarea', etapes[i]); c && c.focus({ preventScroll: true }); }
  };

  /* Groupes de boutons radio obligatoires : vérifiés ici (le socle vérifie les autres champs). */
  const groupeManquant = (racine) => $$('input[type="radio"][required]', racine).find((r) => !$(`input[name="${r.name}"]:checked`, f));
  suiv.addEventListener('click', () => {
    const manque = groupeManquant(etapes[courante]);
    if (manque) { erreur.hidden = false; manque.focus(); return; }
    afficher(Math.min(etapes.length - 1, courante + 1));
  });
  prec.addEventListener('click', () => afficher(Math.max(0, courante - 1)));
  document.addEventListener('submit', (e) => {
    if (e.target !== f) return;
    const manque = groupeManquant(f);
    if (manque) {
      e.preventDefault(); e.stopImmediatePropagation();
      afficher(etapes.indexOf(manque.closest('[data-etape]')), false);
      erreur.hidden = false; manque.focus();
    }
  }, true);
  f.addEventListener('submit', () => setTimeout(() => {
    /* Une erreur dans les coordonnées : on reste sur l'étape 4. Envoi simulé : le message s'affiche. */
    rafraichir();
  }, 0));
  f.addEventListener('change', majRecap);
  f.addEventListener('input', majRecap);

  /* Boutons « Réserver » de la même page : le choix est fait sans recharger. */
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[data-choix]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const url = new URL(a.href, location.href);
    if (url.pathname.replace(/index(\.html)?$/, '') !== location.pathname.replace(/index(\.html)?$/, '')) return;
    e.preventDefault();
    const p = new URLSearchParams(a.dataset.choix);
    p.forEach((v, k) => {
      $$(`[name="${k}"]`, f).forEach((c) => { if (c.type === 'radio' || c.type === 'checkbox') c.checked = c.value === v; else c.value = v; });
    });
    history.replaceState(null, '', url.pathname + '?' + p.toString() + '#rendez-vous');
    majRecap();
    afficher(0, false);
    allerAncre('#rendez-vous', { pousser: false });
  }, true);

  majRecap();
  afficher(0, false);
}

/* ---------- Libérations : fil qui se dénoue ---------- */
function fil() {
  const chemins = $$('[data-fil]');
  if (!chemins.length) return;
  const W = 600, H = 160, n = 220;
  const dessiner = (t) => {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const s = i / n, a = s * Math.PI * 2 * 4.5, r = 34 * (1 - t) * Math.sin(Math.PI * s);
      pts.push(`${(s * W - r * Math.sin(a) * 1.4).toFixed(1)} ${(H / 2 + r * Math.cos(a) + Math.sin(s * 9 + t * 2) * 6 * (1 - t)).toFixed(1)}`);
    }
    const d = 'M' + pts.join(' L');
    chemins.forEach((c) => c.setAttribute('d', d));
  };
  dessiner(etat.calme ? 1 : 0);
  if (!gsap || !ST || etat.calme) return;
  const o = { t: 0 };
  gsap.to(o, { t: 1, ease: 'none', onUpdate: () => dessiner(o.t), scrollTrigger: { trigger: chemins[0].closest('section'), start: 'top 70%', end: 'bottom 55%', scrub: 0.5 } });
}

/* ---------- Libérations : échelle de 10 à 0 ---------- */
function echelle() {
  const o = $('[data-echelle]');
  if (!o) return;
  const input = $('#f-echelle', o), chiffre = $('[data-echelle-chiffre]', o), etatTexte = $('[data-echelle-etat]', o);
  const canvas = $('[data-echelle-canvas]', o);
  const ctx = canvas.getContext('2d');
  let v = 10, vue = 10, w = 640, h = 360;
  const texte = (n) => (n >= 10 ? o.dataset.n10 : n >= 7 ? o.dataset.n7 : n >= 4 ? o.dataset.n4 : n >= 1 ? o.dataset.n1 : o.dataset.n0);
  const maj = () => {
    v = +input.value;
    chiffre.textContent = String(v);
    const t = typo(texte(v));
    if (etatTexte.textContent !== t) etatTexte.textContent = t;
    input.setAttribute('aria-valuetext', typo(`${v} : ${t}`));
    if (etat.calme) dessin(0);
  };
  const dimension = () => {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = canvas.width = Math.max(2, Math.round(r.width * dpr)); h = canvas.height = Math.max(2, Math.round(r.height * dpr));
  };
  new ResizeObserver(() => { dimension(); dessin(0, performance.now() / 1000); }).observe(canvas);
  function dessin(dt, t = 0) {
    vue += (v - vue) * (1 - Math.exp(-(dt || 1) * 4));
    const a = vue / 10;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#2b1e2f'); g.addColorStop(1, '#170f1b');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, max = Math.hypot(w, h) * 0.55, k = Math.min(w, h) / 360;
    ctx.lineWidth = 1.4 * k;
    for (let i = 0; i < 9; i++) {
      const base = ((t * 26 * (0.3 + a) + i * (max / 9)) % max);
      const alpha = (1 - base / max) * (0.15 + 0.6 * a);
      if (alpha <= 0.01) continue;
      ctx.strokeStyle = `rgba(201,168,106,${alpha.toFixed(3)})`;
      ctx.beginPath();
      for (let s = 0; s <= 120; s++) {
        const th = (s / 120) * Math.PI * 2;
        const r = base + Math.sin(th * 7 + t * 2.2 + i) * 9 * k * a + Math.sin(th * 3 - t * 1.4) * 5 * k * a;
        const x = cx + Math.cos(th) * r, y = cy + Math.sin(th) * r * 0.42;
        s ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    /* À 0 : l'eau devient miroir, un halo doré au centre. */
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160 * k);
    halo.addColorStop(0, `rgba(255,226,170,${(0.28 * (1 - a)).toFixed(3)})`);
    halo.addColorStop(1, 'rgba(255,226,170,0)');
    ctx.fillStyle = halo; ctx.fillRect(0, 0, w, h);
  }
  input.addEventListener('input', maj);
  maj();
  dimension();
  boucle(canvas, (dt, t) => dessin(dt, t));
}

/* ---------- Libérations : onde du déroulé, mots qui tournent ---------- */
function onde() {
  const p = $('[data-onde]');
  if (!p || !gsap || !ST || etat.calme) return;
  gsap.fromTo(p, { strokeDashoffset: 100 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: p.closest('[data-onde-etapes]'), start: 'top 75%', end: 'bottom 60%', scrub: 0.5 } });
}

function motsTournants() {
  const boite = $('[data-mots]');
  if (!boite || etat.calme) return;
  const mots = $$('.mot', boite);
  /* Un seul passage (moins de 5 s), puis le dernier mot reste : rien ne tourne indéfiniment. */
  let t = 0, i = 0;
  const ctl = boucle(boite, (dt) => {
    t += dt;
    if (t < 1.25) return;
    t = 0; i++;
    mots.forEach((m, k) => m.classList.toggle('actif', k === i));
    if (i >= mots.length - 1) ctl.arreter();
  });
}

/* ---------- Reconnexion : intentions, éventail, simulateur, paliers de lumière ---------- */
function intentions() {
  const items = $$('.intention');
  if (!items.length) return;
  if (!ST || etat.calme) { items.forEach((x) => x.classList.add('allume')); return; }
  items.forEach((x) => ST.create({ trigger: x, start: 'top 78%', once: true, onEnter: () => x.classList.add('allume') }));
}

function eventail() {
  const cartes = $$('.eventail-carte');
  if (!cartes.length || !gsap || !ST || etat.calme) return;
  const m = (cartes.length - 1) / 2;
  gsap.set(cartes, { x: (i) => (m - i) * 70 + '%', rotate: (i) => (i - m) * 7, y: (i) => Math.abs(i - m) * 18 });
  gsap.to(cartes, { x: 0, rotate: 0, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.05, scrollTrigger: { trigger: '[data-eventail]', start: 'top 80%', once: true } });
}

function simulateur() {
  const s = $('[data-simulateur]');
  if (!s) return;
  const euros = (n) => new Intl.NumberFormat('fr-FR', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }).format(n) + ' €';
  const piste = $('[data-galets-piste]', s), fin = $('[data-galets-fin]', s);
  const lien = $('[data-simulateur-lien]', s);
  const total = $('[data-res-total]', s);
  const maj = (anime) => {
    const r = $('input[name="formule-simulee"]:checked', s);
    if (!r) return;
    const mois = +r.dataset.mois, seances = +r.dataset.seances, prix = +r.dataset.prix;
    const moisTxt = mois === 1 ? s.dataset.mois1 : s.dataset.moisn.replace('{n}', mois);
    $('[data-res-seances]', s).textContent = typo(s.dataset.seances.replace('{n}', seances).replace(/ (h|de) /g, ' $1 ') + ', ' + (r.dataset.rythme === 'semaine' ? s.dataset.semaine : s.dataset.quinzaine));
    total.textContent = euros(prix);
    total.dataset.total = String(prix);
    $('[data-res-seance]', s).textContent = euros(Math.round(prix / seances));
    $('[data-res-mois]', s).textContent = euros(Math.round(prix / mois));
    fin.textContent = typo(moisTxt);
    piste.innerHTML = '';
    for (let i = 0; i < seances; i++) {
      const g = document.createElement('span');
      g.className = 'galet';
      g.style.setProperty('--x', (((i + 0.5) / seances) * 100).toFixed(2) + '%');
      piste.appendChild(g);
    }
    if (anime && gsap && !etat.calme) gsap.fromTo(piste.children, { y: -26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.025, ease: 'back.out(2)' });
    const u = new URL(lien.href, location.href);
    u.searchParams.set('formule', r.value);
    lien.href = u.pathname + u.search + u.hash;
  };
  s.addEventListener('change', (e) => { if (e.target.name === 'formule-simulee') maj(true); });
  maj(false);
}

function paliers() {
  const v = $('[data-volts]');
  if (!v) return;
  const ombre = $('[data-volts-ombre]', v), pal = $$('[data-palier]', v);
  if (!ST || etat.calme) { pal.forEach((p) => p.classList.add('allume')); return; }
  ST.create({
    trigger: v, start: 'top 80%', end: 'bottom 35%', scrub: true,
    onUpdate: (x) => {
      const n = Math.min(4, Math.floor(x.progress * 4.4 + 0.6));
      ombre.style.opacity = String(0.72 - (n / 4) * 0.64);
      pal.forEach((p, i) => p.classList.toggle('allume', i < n));
    },
  });
}

/* ---------- Démarrage ---------- */
demarrer({
  preparer() {
    cadran();
    enteteApresSaut();
    parallaxes();
    guide();
    seance();
    spirale();
    agenda();
    bol();
    voyage();
    scenesSansEntete();
    sommaireHaut();
    lotus();
    formulaire();
    fil();
    echelle();
    onde();
    motsTournants();
    intentions();
    eventail();
    simulateur();
    paliers();
    eau();
  },
  jouer: introTimeline,
  etatFinal() {
    if (!gsap) return;
    gsap.set('.hero-ligne, .hero-surtitre, .hero-intro, .hero-actions, .hero-info', { clearProps: 'transform,opacity,clipPath' });
    gsap.set('[data-dix]', { opacity: 0 });
    gsap.set('[data-aube]', { opacity: 1 });
    gsap.set('.lotus-media picture', { clipPath: 'circle(50% at 50% 50%)' });
    gsap.set('.lotus-trait circle, [data-onde], [data-spirale]', { strokeDashoffset: 0 });
    gsap.set('[data-plan-zone]', { scale: 1, opacity: 1, svgOrigin: '200 138' });
  },
  arrivee() {
    if (!gsap) return;
    const tl = gsap.timeline();
    arriveeHero(tl, 0.1);
  },
});
