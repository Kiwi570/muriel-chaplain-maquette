/* Libérations au Point Zéro : ouverture (un « 10 » qui se dissout en gouttes), le fil de lumière qui se dénoue,
   l'échelle de 10 à 0 à faire glisser (l'eau se calme), le déroulé, l'objectif de vie (mots qui tournent),
   les tarifs, les témoignages, la FAQ et l'appel à l'action. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'liberations', fichier: 'liberations-point-zero', imagePartage: 'grok/liberations-ouverture-1168.webp' };

export default (c) => {
  const T = (k) => c.t(`liberations.${k}`), S = (k) => c.s(`liberations.${k}`), B = (k) => c.tb(`liberations.${k}`);
  const rdv = (params) => c.url('accueil', 'rendez-vous', params);
  const temoins = c.donnees.temoignages.filter((t) => t.pages.includes('liberations'));
  const mots = S('objectif.mots').split('|');
  return html`
<section class="hero hero--page hero--sombre" id="debut">
  <div class="hero-fond">
    ${c.media({ nom: 'grok/liberations-ouverture', alt: S('hero.alt'), cadrage: '66% 50%', cadrageMobile: '50% 62%', priorite: true, classe: 'hero-media', sizes: '100vw' })}
    <div class="hero-voile" aria-hidden="true"></div>
    <span class="dix" data-dix aria-hidden="true" data-audit-ignorer>10</span>
  </div>
  <div class="hero-texte conteneur">
    <p class="surtitre hero-surtitre" data-anime="gsap">${T('hero.surtitre')}</p>
    <h1 class="hero-titre"><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${T('hero.titre1')}</span></span><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${B('hero.titre2')}</span></span></h1>
    <p class="hero-intro" data-anime="gsap">${T('hero.texte')}</p>
    <p class="hero-actions" data-anime="gsap">
      <a class="bouton bouton--clair" href="${rdv('sujet=liberations')}" data-action-principale data-libelle="${c.s('nav.rendezvous')}">${T('hero.action')}</a>
      <a class="lien-fleche lien-fleche--clair" href="#tarifs">${T('tarifs.surtitre')}</a>
    </p>
    <p class="hero-info" data-info-cle data-anime="gsap">${T('hero.info')}</p>
  </div>
</section>

<section class="principe" id="principe">
  <div class="conteneur principe-grille">
    <div class="principe-visuel">
      ${c.media({ nom: 'grok/fil-lumiere', alt: S('principe.alt'), cadrage: '50% 45%', classe: 'principe-media', sizes: '(max-width: 760px) 92vw, 40vw' })}
      <svg class="fil" viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true" focusable="false" data-audit-ignorer><path class="fil-halo" data-fil></path><path class="fil-trait" data-fil></path></svg>
    </div>
    <div class="principe-texte">
      <p class="surtitre" data-anime>${T('principe.surtitre')}</p>
      <h2 data-anime>${B('principe.titre')}</h2>
      <p class="chapeau" data-anime>${T('principe.texte1')}</p>
      <p data-anime>${T('principe.texte2')}</p>
      <blockquote class="citation" data-anime><p>${T('principe.citation')}</p><footer>${T('principe.citationSource')}</footer></blockquote>
    </div>
  </div>
</section>

<section class="echelle" id="echelle">
  <div class="conteneur echelle-grille">
    <div class="echelle-texte">
      <p class="surtitre surtitre--clair" data-anime>${T('echelle.surtitre')}</p>
      <h2 data-anime>${B('echelle.titre')}</h2>
      <p class="chapeau" data-anime>${T('echelle.texte')}</p>
    </div>
    <div class="echelle-outil" data-echelle data-anime
      data-n10="${S('echelle.n10')}" data-n7="${S('echelle.n7')}" data-n4="${S('echelle.n4')}" data-n1="${S('echelle.n1')}" data-n0="${S('echelle.n0')}">
      <div class="echelle-eau" data-visuel>
        <canvas class="echelle-canvas" width="640" height="360" data-echelle-canvas aria-hidden="true"></canvas>
        <output class="echelle-chiffre" for="f-echelle" data-echelle-chiffre>10</output>
      </div>
      <label class="echelle-label" for="f-echelle">${T('echelle.label')}</label>
      <input class="echelle-curseur" id="f-echelle" type="range" min="0" max="10" step="1" value="10" aria-valuetext="${S('echelle.n10')}">
      <p class="echelle-graduations" aria-hidden="true"><span>10</span><span>5</span><span>0</span></p>
      <p class="echelle-etat" data-echelle-etat aria-live="polite">${T('echelle.n10')}</p>
      <p class="aide">${T('echelle.aide')}</p>
    </div>
  </div>
</section>

<section class="deroule" id="deroule">
  <div class="conteneur deroule-grille">
    ${c.media({ nom: 'seance-soin', alt: S('deroule.alt'), cadrage: '32% 45%', classe: 'deroule-media', sizes: '(max-width: 760px) 92vw, 44vw' })}
    <div class="deroule-texte">
      <p class="surtitre" data-anime>${T('deroule.surtitre')}</p>
      <h2 data-anime>${B('deroule.titre')}</h2>
      <p data-anime>${T('deroule.texte')}</p>
      <div class="onde-cadre" data-onde-etapes>
        <svg class="onde-ligne" viewBox="0 0 20 400" preserveAspectRatio="none" aria-hidden="true" focusable="false" data-audit-ignorer><path data-onde d="M10 0 C 0 25, 20 50, 10 75 S 0 125, 10 150 S 20 200, 10 225 S 0 275, 10 300 S 10 350, 10 400" pathLength="100"></path></svg>
        <ol class="onde-etapes">
        
        ${[1, 2, 3, 4].map((n) => html`<li class="onde-etape" data-anime><h3>${T(`deroule.e${n}t`)}</h3><p>${T(`deroule.e${n}`)}</p></li>`)}
      </ol>
      </div>
    </div>
  </div>
</section>

<section class="objectif" id="objectif">
  ${c.media({ nom: 'grok/chemin-horizon', alt: S('objectif.alt'), cadrage: '50% 62%', classe: 'objectif-media', sizes: '100vw' })}
  <div class="conteneur objectif-texte">
    <p class="surtitre surtitre--clair" data-anime>${T('objectif.surtitre')}</p>
    <h2 data-anime>${c.t('liberations.objectif.titreSimple')} <span class="mots" data-mots aria-hidden="true">${mots.map((m, i) => html`<span class="mot${i === 0 ? ' actif' : ''}">${m}&#160;?</span>`)}</span></h2>
    <p data-anime>${T('objectif.texte')}</p>
  </div>
</section>

<section class="tarifs-page" id="tarifs">
  <div class="conteneur tarifs-grille">
    <div>
      <p class="surtitre" data-anime>${T('tarifs.surtitre')}</p>
      <h2 data-anime>${B('tarifs.titre')}</h2>
      <p data-anime>${T('tarifs.texte')}</p>
      ${c.media({ nom: 'quartz-herbe', alt: S('tarifs.alt'), cadrage: '42% 55%', classe: 'tarifs-media', sizes: '(max-width: 760px) 92vw, 40vw' })}
    </div>
    <ul class="formules-cartes">${[1, 2, 3].map((n) => html`<li class="formule-carte" data-anime style="--i:${n}">
      <p class="formule-duree">${T(`tarifs.t${n}`)}</p>
      <p class="formule-prix" data-prix>${T(`tarifs.p${n}`)}${n !== 2 ? html` <small>${T('tarifs.ouPlus')}</small>` : ''}</p>
      <p><a class="bouton bouton--petit" href="${rdv(`sujet=liberations&duree=${S(`tarifs.t${n}`).replace(/\s+/g, '')}`)}" data-libelle="${c.s('nav.rendezvous')}">${T('tarifs.reserver')}</a></p>
    </li>`)}</ul>
  </div>
</section>

<section class="temoignages temoignages--page" id="temoignages">
  <div class="conteneur temoignages-grille">
    <div class="temoignages-tete">
      <p class="surtitre" data-anime>${T('temoignages.surtitre')}</p>
      <h2 data-anime>${B('temoignages.titre')}</h2>
      ${c.media({ nom: 'cabinet-table-portrait', alt: S('temoignages.alt'), cadrage: '50% 60%', classe: 'temoignages-media', sizes: '(max-width: 760px) 92vw, 30vw' })}
    </div>
    <ul class="avis">${temoins.map((t) => html`<li class="avis-carte avis-carte--grande" data-anime>
      <blockquote><p>${t.texte}</p></blockquote>
      <p class="avis-nom">${t.nom}<span>${t.contexte} · ${t.source}</span></p>
    </li>`)}</ul>
  </div>
</section>

<section class="faq" id="faq">
  <div class="conteneur faq-grille">
    <div>
      <p class="surtitre" data-anime>${T('faq.surtitre')}</p>
      <h2 data-anime>${B('faq.titre')}</h2>
      ${c.media({ nom: 'dessin-spirales', alt: S('faq.altDessin'), cadrage: '50% 50%', classe: 'faq-dessin', sizes: '(max-width: 760px) 60vw, 22vw' })}
    </div>
    <div class="faq-liste">${c.donnees.faq.map((f) => html`<details class="faq-item" data-anime><summary>${f.q}</summary><div class="faq-reponse"><p>${f.r}</p></div></details>`)}</div>
  </div>
</section>

<section class="fin-page" id="fin">
  <div class="conteneur fin-grille">
    <div class="lotus lotus--petit" data-lotus aria-hidden="true">
      ${c.media({ nom: 'grok/lotus-ouvert', alt: '', classe: 'lotus-media', sizes: '180px' })}
      <svg class="lotus-trait" viewBox="0 0 100 100" focusable="false" data-audit-ignorer><circle cx="50" cy="50" r="48" pathLength="100"></circle></svg>
    </div>
    <div>
      <h2 data-anime>${B('fin.titre')}</h2>
      <p data-anime>${T('fin.texte')}</p>
      <p class="fin-actions" data-anime>
        <a class="bouton" href="${rdv('sujet=liberations')}" data-libelle="${c.s('nav.rendezvous')}">${T('fin.action')}</a>
        <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a>
      </p>
      <p data-anime><a class="lien-fleche" href="${c.url('reconnexion')}" data-libelle="${c.libelle('reconnexion')}">${T('fin.lien')}</a></p>
    </div>
  </div>
</section>
`;
};
