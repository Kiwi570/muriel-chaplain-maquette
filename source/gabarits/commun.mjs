/* Gabarit commun : head, en-tête (avec le cadran Point Zéro), menu, pied de page, barre fixe du téléphone,
   voile et panneau d'intro (goutte, ondes, « Esprit · Âme · Corps » qui deviennent « Réunis »).
   Les conventions data-* sont celles que lisent le socle JavaScript et l'audit (voir le README). */
import { html, brut } from '../../outils/gabarit.mjs';

/* Liens du menu : sections de l'accueil et pages, depuis donnees/site.json (menu). */
function liens(c) {
  return (c.site.menu || []).map((m) => {
    const libelle = c.s(`nav.${m.cle}`);
    const courant = !m.ancre && m.page === c.page.cle;
    return { href: c.url(m.page, m.ancre || ''), libelle, courant, cle: m.cle };
  });
}

const externe = (c) => html` rel="noopener" target="_blank"`;
const nouvelOnglet = (c) => html`<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span>`;

function tete(c) {
  const p = c.page, cle = p.cle;
  const titre = c.s(`pages.${cle}.titre`), description = c.s(`pages.${cle}.description`);
  const ici = c.abs(c.url(cle));
  const imagePartage = c.abs(`/assets/partage/${p.partage === false ? 'accueil' : cle}-${c.l}.jpg`);
  const structure = c.donnees.structure ? JSON.stringify(c.donnees.structure).replace(/</g, '\\u003c') : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${ici}">
<style>${brut(c.critique.css)}</style>
<script>${brut(c.critique.js)}</script>
${(c.site.polices || []).map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${c.asset('css/socle.css')}">
<link rel="stylesheet" href="${c.asset('css/site.css')}">
<link rel="modulepreload" href="${c.asset('js/site.js')}">
<link rel="modulepreload" href="${c.asset('js/socle/index.js')}">
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script type="module" src="${c.asset('js/site.js')}"></script>
<meta name="theme-color" content="${c.site.couleurs.theme || c.site.couleurs.fond}">
<link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${c.site.nom}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${ici}">
<meta property="og:image" content="${imagePartage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${c.s(`pages.${p.partage === false ? 'accueil' : cle}.partageAlt`)}">
<meta name="twitter:card" content="summary_large_image">
${structure ? html`<script type="application/ld+json">${brut(structure)}</script>` : ''}
</head>`;
}

function cadran(c, classe = '') {
  return html`<span class="cadran ${classe}" data-cadran aria-hidden="true" title="${c.s('commun.cadranAide')}">
  <svg viewBox="0 0 44 44" focusable="false"><circle class="cadran-fond" cx="22" cy="22" r="19"></circle><circle class="cadran-arc" cx="22" cy="22" r="19" pathLength="100"></circle></svg>
  <span class="cadran-chiffre" data-cadran-chiffre>10</span>
</span>`;
}

function entete(c) {
  const a = c.site.actionEntete;
  return html`<header data-entete>
  <div class="entete-rangee">
    <a class="entete-logo" href="${c.url('accueil')}" data-libelle="${c.libelle('accueil')}" aria-label="${c.s('commun.logoAlt')}"${c.page.cle === 'accueil' ? brut(' aria-current="page"') : ''}>
      <img src="/assets/images/logo.svg" alt="" width="40" height="40">
      <span class="logo-texte"><span class="logo-nom">${c.t('commun.nom')}</span><span class="logo-sous">${c.t('commun.sousNom')}</span></span>
    </a>
    <nav data-nav aria-label="${c.s('commun.navigation')}">
      <ul>${liens(c).map((l) => html`<li><a href="${l.href}" data-libelle="${l.libelle}"${l.courant ? brut(' aria-current="page"') : ''}>${l.libelle}</a></li>`)}</ul>
    </nav>
    <div class="entete-actions">
      ${cadran(c)}
      <a class="bouton" href="${c.url(a.page, a.ancre)}" data-libelle="${c.s('nav.rendezvous')}">${c.t('commun.actionEntete')}</a>
      <button type="button" data-menu-bouton aria-controls="menu" aria-expanded="false" data-libelle-ouvrir="${c.s('commun.menu')}" data-libelle-fermer="${c.s('commun.fermer')}"><span class="menu-icone" aria-hidden="true"><span></span><span></span></span><span data-libelle-bouton>${c.t('commun.menu')}</span></button>
    </div>
  </div>
</header>
<div id="menu" data-menu role="dialog" aria-modal="true" aria-label="${c.s('commun.menu')}">
  <div class="menu-grille">
    <ul class="menu-liste">${[{ href: c.url('accueil'), libelle: c.s('pages.accueil.nav'), courant: c.page.cle === 'accueil' }, ...liens(c)].map((l, i) => html`<li style="--i:${i}"><a class="menu-lien" href="${l.href}" data-libelle="${l.libelle}"${l.courant ? brut(' aria-current="page"') : ''}>${l.libelle}</a></li>`)}</ul>
    <div class="menu-contact">
      <p><a class="bouton" href="${c.url(a.page, a.ancre)}" data-libelle="${c.s('nav.rendezvous')}">${c.t('commun.actionEntete')}</a></p>
      <p><a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
      <p><a class="bouton bouton--contour" href="${c.site.contact.whatsapp}"${externe(c)}>${c.t('commun.whatsappLong')}${nouvelOnglet(c)}</a></p>
      <p><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></p>
    </div>
  </div>
</div>`;
}

function pied(c) {
  const k = c.site.contact;
  return html`<footer class="pied" id="pied">
  <div class="conteneur pied-grille">
    <div class="pied-identite">
      <img src="/assets/images/logo-clair.svg" alt="" width="56" height="56">
      <p class="pied-nom">${c.site.nom}</p>
      <p class="pied-sous">${c.t('commun.nom')}</p>
    </div>
    <div>
      <p class="pied-titre">${c.t('commun.contact')}</p>
      <p>${k.adresse}</p>
      <ul>
        <li><a href="tel:${k.telephoneLien}">${k.telephone}</a></li>
        <li><a href="mailto:${k.email}">${k.email}</a></li>
        <li><a href="${k.whatsapp}"${externe(c)}>${c.t('commun.whatsapp')}${nouvelOnglet(c)}</a></li>
      </ul>
    </div>
    <nav aria-label="${c.s('commun.sommaire')}">
      <p class="pied-titre">${c.t('commun.sommaire')}</p>
      <ul>
        <li><a href="${c.url('accueil')}" data-libelle="${c.libelle('accueil')}">${c.libelle('accueil')}</a></li>
        ${liens(c).map((l) => html`<li><a href="${l.href}" data-libelle="${l.libelle}">${l.libelle}</a></li>`)}
        <li><a href="${c.url('accueil', 'rendez-vous')}" data-libelle="${c.s('nav.rendezvous')}">${c.t('nav.rendezvous')}</a></li>
        <li>${c.lien('mentions-legales')}</li>
        <li><a href="${c.url('mentions-legales', 'confidentialite')}" data-libelle="${c.libelle('mentions-legales')}">${c.t('commun.confidentialite')}</a></li>
      </ul>
    </nav>
    <div>
      <p class="pied-titre">${c.t('commun.suivre')}</p>
      <ul>
        <li><a href="${k.facebook}"${externe(c)}>${c.t('commun.facebook')}${nouvelOnglet(c)}</a></li>
        <li><a href="${k.instagram}"${externe(c)}>${c.t('commun.instagram')}${nouvelOnglet(c)}</a></li>
        <li><a href="${k.resalib}"${externe(c)}>${c.t('commun.resalib')}${nouvelOnglet(c)}</a></li>
      </ul>
      <p class="pied-titre">${c.t('commun.confort')}</p>
      <ul>
        <li><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></li>
        <li><a href="#haut" data-sans-transition>${c.t('commun.retourHaut')}</a></li>
      </ul>
    </div>
  </div>
  <div class="conteneur pied-bas">
    <p class="pied-medical">${c.t('commun.nonMedical')}</p>
    <p>${c.t('commun.maquette')}</p>
    <p>© ${c.site.nom} · ${c.t('commun.nom')}</p>
  </div>
</footer>`;
}

function barre(c) {
  const a = c.site.actionEntete;
  return html`<div data-barre-fixe>
  <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a>
  <a class="bouton bouton--contour" href="${c.site.contact.whatsapp}"${externe(c)}>${c.t('commun.whatsapp')}${nouvelOnglet(c)}</a>
  <a class="bouton" href="${c.url(a.page, a.ancre)}" data-libelle="${c.s('nav.rendezvous')}">${c.t('commun.actionCourte')}</a>
</div>`;
}

function voile(c) {
  return html`<div data-voile aria-hidden="true"><div class="voile-contenu"><span class="voile-goutte"></span><img src="/assets/images/logo-clair.svg" alt="" width="56" height="56"><span data-voile-libelle>${c.libelle(c.page.cle)}</span></div></div>`;
}

function intro(c) {
  return html`<div class="ouverture-panneau" data-ouverture aria-hidden="true">
  <svg class="intro-ondes" viewBox="-50 -50 100 100" preserveAspectRatio="xMidYMid meet" focusable="false">
    <circle class="intro-onde" r="12"></circle><circle class="intro-onde" r="24"></circle><circle class="intro-onde" r="38"></circle>
  </svg>
  <span class="intro-goutte"></span>
  <p class="intro-mots"><span class="intro-mot">${c.t('commun.introMot1')}</span><span class="intro-mot">${c.t('commun.introMot2')}</span><span class="intro-mot">${c.t('commun.introMot3')}</span></p>
  <p class="intro-reunis">${c.t('commun.introReunis')}</p>
  <p class="intro-bas"><span class="intro-cadran" data-intro-cadran>10</span><span class="intro-nom">${c.t('commun.introLigne')}</span></p>
</div>`;
}

export function page(c, contenu) {
  return html`<!doctype html>
<html lang="${c.l}" data-v="${c.v}" data-gabarit="${c.page.gabarit || c.page.cle}" data-page="${c.page.cle}"${c.site.curseur ? brut(' data-curseur') : ''}>
${tete(c)}
<body id="haut">
${voile(c)}
${intro(c)}
<a class="evitement" href="#contenu">${c.t('commun.evitement')}</a>
${entete(c)}
<main id="contenu" tabindex="-1"${c.page.sansAction ? brut(' data-sans-action') : ''}>
${contenu}
</main>
${pied(c)}
${barre(c)}
<div class="son-pastille" data-son-pastille role="status" aria-live="polite" hidden data-superpose data-fini="${c.s('commun.son.fini')}">
  <span class="son-ondes" aria-hidden="true"><span></span><span></span><span></span></span>
  <span data-son-texte>${c.t('commun.son.joue')}</span>
  <button type="button" class="son-arreter" data-son-arreter>${c.t('commun.son.arreter')}</button>
</div>
</body>
</html>`;
}
