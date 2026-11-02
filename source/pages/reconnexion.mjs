/* Reconnexion à Soi : ouverture à l'aube, intentions qui s'allument comme des reflets, outils en éventail,
   trois formats, simulateur des formules (galets sur la durée, total, par séance, par mois),
   la métaphore des volts (lumière qui monte par paliers), témoignage, appel à l'action. */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'reconnexion', fichier: 'reconnexion-a-soi', imagePartage: 'grok/reconnexion-ouverture-1168.webp' };

const euros = (n) => new Intl.NumberFormat('fr-FR', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }).format(n).replace(/[  ]/g, ' ') + ' €';

export default (c) => {
  const T = (k, v) => c.t(`reconnexion.${k}`, v), S = (k, v) => c.s(`reconnexion.${k}`, v), B = (k) => c.tb(`reconnexion.${k}`);
  const rdv = (params) => c.url('accueil', 'rendez-vous', params);
  const formules = c.donnees.formules;
  const choisie = formules.find((f) => f.id === '3-mois') || formules[0];
  const temoins = c.donnees.temoignages.filter((t) => t.pages.includes('reconnexion'));
  const moisTexte = (f) => (f.mois === 1 ? S('simulateur.mois1') : S('simulateur.moisN', { n: f.mois }));
  return html`
<section class="hero hero--page" id="debut">
  <div class="hero-fond">
    ${c.media({ nom: 'grok/reconnexion-ouverture', alt: S('hero.alt'), cadrage: '72% 55%', cadrageMobile: '50% 66%', priorite: true, classe: 'hero-media', sizes: '100vw' })}
    <div class="hero-voile" aria-hidden="true"></div>
    <div class="aube" data-aube aria-hidden="true" data-audit-ignorer></div>
  </div>
  <div class="hero-texte conteneur">
    <p class="surtitre hero-surtitre" data-anime="gsap">${T('hero.surtitre')}</p>
    <h1 class="hero-titre"><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${T('hero.titre1')}</span></span><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${B('hero.titre2')}</span></span></h1>
    <p class="hero-intro" data-anime="gsap">${T('hero.texte')}</p>
    <p class="hero-actions" data-anime="gsap">
      <a class="bouton bouton--clair" href="#simulateur" data-action-principale>${T('hero.action')}</a>
    </p>
    <p class="hero-info" data-info-cle data-anime="gsap">${T('hero.info')}</p>
  </div>
</section>

<section class="intentions" id="intentions">
  ${c.media({ nom: 'grok/reflets-lumiere', alt: S('intentions.alt'), cadrage: '60% 50%', classe: 'intentions-media', sizes: '100vw' })}
  <div class="conteneur intentions-grille">
    <div class="intentions-tete">
      <p class="surtitre surtitre--clair" data-anime>${T('intentions.surtitre')}</p>
      <h2 data-anime>${B('intentions.titre')}</h2>
      <p data-anime>${T('intentions.texte')}</p>
    </div>
    <ul class="intentions-liste" data-intentions>${c.donnees.intentions.map((x) => html`<li class="intention">${x}</li>`)}</ul>
  </div>
</section>

<section class="outils" id="outils">
  <div class="conteneur">
    <div class="tete-section">
      <p class="surtitre" data-anime>${T('outils.surtitre')}</p>
      <h2 data-anime>${B('outils.titre')}</h2>
      <p class="chapeau" data-anime>${T('outils.texte')}</p>
    </div>
    <ul class="eventail" data-eventail>${c.donnees.outils.map((o, i) => html`<li class="eventail-carte" style="--i:${i}">
      ${c.media({ nom: o.image, alt: o.alt, cadrage: o.cadrage, classe: 'eventail-media', sizes: '(max-width: 760px) 70vw, 18vw' })}
      <h3>${o.titre}</h3>
    </li>`)}</ul>
  </div>
</section>

<section class="formats" id="formats">
  <div class="conteneur">
    <div class="tete-section">
      <p class="surtitre" data-anime>${T('formats.surtitre')}</p>
      <h2 data-anime>${B('formats.titre')}</h2>
    </div>
    <ul class="formats-grille">
      ${[['f1', 'cabinet-table', '50% 55%'], ['f2', 'grok/a-distance', '50% 50%'], ['f3', 'grok/sejour-intensif', '50% 55%']].map(([f, img, cad]) => html`<li class="format" data-anime>
        ${c.media({ nom: img, alt: S(`formats.${f}alt`), cadrage: cad, classe: 'format-media', sizes: '(max-width: 760px) 92vw, 30vw' })}
        <h3>${T(`formats.${f}t`)}</h3>
        <p>${T(`formats.${f}`)}</p>
      </li>`)}
    </ul>
  </div>
</section>

<section class="simulateur" id="simulateur">
  <div class="conteneur simulateur-grille" data-simulateur
    data-mois1="${S('simulateur.mois1')}" data-moisn="${S('simulateur.moisN')}" data-seances="${S('simulateur.seances')}"
    data-semaine="${S('simulateur.semaine')}" data-quinzaine="${S('simulateur.quinzaine')}">
    <div class="simulateur-choix">
      <p class="surtitre" data-anime>${T('simulateur.surtitre')}</p>
      <h2 data-anime>${B('simulateur.titre')}</h2>
      <p data-anime>${T('simulateur.texte')}</p>
      <fieldset class="duree-choix" data-anime>
        <legend class="visuellement-cache">${T('simulateur.legende')}</legend>
        ${formules.map((f) => html`<label class="duree"><input type="radio" name="formule-simulee" value="${f.id}" data-mois="${f.mois}" data-seances="${f.seances}" data-rythme="${f.rythme}" data-prix="${f.prix}"${f === choisie ? brut(' checked') : ''}><span class="duree-mois">${moisTexte(f)}<small>${S('simulateur.ligne', { n: f.seances, rythme: f.rythme === 'semaine' ? S('simulateur.chaqueSemaine') : S('simulateur.tous15') })}</small></span><span class="duree-prix">${euros(f.prix)}</span></label>`)}
      </fieldset>
      <p class="aide">${T('simulateur.autres')}</p>
    </div>
    <div class="simulateur-resultat" data-anime>
      <div class="galets" data-galets aria-hidden="true" data-visuel>
        <div class="galets-ligne"></div>
        <div class="galets-piste" data-galets-piste>${Array.from({ length: choisie.seances }, (_, i) => html`<span class="galet" style="--x:${((i + 0.5) / choisie.seances * 100).toFixed(2)}%"></span>`)}</div>
        <p class="galets-bornes"><span>${T('simulateur.debut')}</span><span data-galets-fin>${moisTexte(choisie)}</span></p>
      </div>
      <p class="aide">${T('simulateur.galetsAide')}</p>
      <dl class="resultat">
        <div><dt class="visuellement-cache">${T('simulateur.legende')}</dt><dd class="resultat-seances" data-res-seances>${S('simulateur.seances', { n: choisie.seances })}, ${choisie.rythme === 'semaine' ? T('simulateur.semaine') : T('simulateur.quinzaine')}</dd></div>
        <div class="resultat-total"><dt>${T('simulateur.total')}</dt><dd data-prix data-total="${choisie.prix}" data-res-total>${euros(choisie.prix)}</dd></div>
        <div><dt>${T('simulateur.parSeance')}</dt><dd data-prix data-res-seance>${euros(Math.round(choisie.prix / choisie.seances))}</dd></div>
        <div><dt>${T('simulateur.parMois')}</dt><dd data-prix data-res-mois>${euros(Math.round(choisie.prix / choisie.mois))}</dd></div>
      </dl>
      <p class="resultat-inclus">${T('simulateur.inclus')}</p>
      <p><a class="bouton" href="${rdv(`sujet=reconnexion&formule=${choisie.id}`)}" data-simulateur-lien data-libelle="${c.s('nav.rendezvous')}">${T('simulateur.action')}</a></p>
    </div>
  </div>
</section>

<section class="pourquoi" id="pourquoi">
  <div class="conteneur pourquoi-grille">
    <div>
      <p class="surtitre" data-anime>${T('pourquoi.surtitre')}</p>
      <h2 data-anime>${B('pourquoi.titre')}</h2>
      <p class="chapeau" data-anime>${T('pourquoi.texte1')}</p>
      <p data-anime>${T('pourquoi.texte2')}</p>
    </div>
    <div class="volts" data-volts>
      ${c.media({ nom: 'grok/lumiere-progressive', alt: S('pourquoi.alt'), classe: 'volts-media', sizes: '(max-width: 760px) 92vw, 46vw' })}
      <div class="volts-ombre" data-volts-ombre aria-hidden="true"></div>
      <ol class="volts-paliers">${[1, 2, 3, 4].map((n) => html`<li class="palier" data-palier="${n}" data-superpose>${T(`pourquoi.v${n}`)}</li>`)}</ol>
    </div>
  </div>
</section>

<section class="temoignage-grand" id="temoignage">
  <div class="conteneur temoignage-grille">
    ${c.media({ nom: 'grok/cheval-main', alt: S('temoignage.alt'), cadrage: '50% 55%', classe: 'temoignage-media', sizes: '(max-width: 760px) 92vw, 36vw' })}
    <div>
      <p class="surtitre" data-anime>${T('temoignage.surtitre')}</p>
      <p class="grand-mot" data-anime>${T('temoignage.titre')}</p>
      ${temoins.map((t, i) => html`<figure class="avis-carte${i === 0 ? ' avis-carte--grande' : ''}" data-anime><blockquote><p>${t.texte}</p></blockquote><figcaption class="avis-nom">${t.nom}<span>${t.contexte} · ${t.source}</span></figcaption></figure>`)}
    </div>
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
        <a class="bouton" href="${rdv('sujet=reconnexion')}" data-libelle="${c.s('nav.rendezvous')}">${T('fin.action')}</a>
        <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a>
      </p>
      <p data-anime><a class="lien-fleche" href="${c.url('liberations')}" data-libelle="${c.libelle('liberations')}">${T('fin.lien')}</a></p>
    </div>
  </div>
</section>
`;
};
