/* Accueil : ouverture sur l'eau (WebGL), Muriel, les soins et le guide « Quel soin pour moi ? »,
   la séance de 10 à 0 (scène épinglée), accompagnements et enseignements, ateliers (agenda automatique, bol chantant),
   voyage (galerie horizontale épinglée), témoignages, rendez-vous (plan, lotus, formulaire en étapes). */
import { html, brut } from '../../outils/gabarit.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'grok/accueil-eau-1168.webp' };

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const dateLongue = (iso) => { const d = new Date(iso + 'T12:00:00Z'); return `${JOURS[d.getUTCDay()]} ${d.getUTCDate() === 1 ? '1er' : d.getUTCDate()} ${MOIS[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
/* Statut calculé à la génération (date de Paris), recalculé par le JavaScript à la date réelle du visiteur. */
const aujourdhui = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date());

/* Étoiles du bivouac : positions fixes (pseudo-hasard déterministe). */
const etoiles = Array.from({ length: 46 }, (_, i) => {
  const r = (n) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
  return { x: (r(1) * 100).toFixed(2), y: (r(2) * 46).toFixed(2), t: (1 + r(3) * 2.4).toFixed(2) };
});

const tarif = (c, t) => html`<li class="tarif" data-prix><span class="tarif-duree">${t.duree}</span><span class="tarif-prix">${t.prix}${t.plus ? html` <small>${c.t('accueil.soins.ouPlus')}</small>` : ''}</span></li>`;

/* Lien vers le formulaire de rendez-vous avec le choix déjà fait (?sujet=…). */
const versRdv = (c, params, texte, classe = 'bouton bouton--petit') =>
  html`<a class="${classe}" href="${c.url('accueil', 'rendez-vous', params)}" data-choix="${params}" data-libelle="${c.s('nav.rendezvous')}">${texte}</a>`;

const sujets = (c) => [
  ['liberations', c.donnees.soins[0].nom], ['energetique', c.donnees.soins[1].nom], ['massage', c.donnees.soins[2].nom],
  ['sonotherapie', c.donnees.soins[3].nom], ['reconnexion', c.s('accueil.accompagner.reconnexionTitre')],
  ['pilier', c.s('accueil.accompagner.pilierTitre')], ['cheval', c.s('accueil.accompagner.chevalTitre')],
  ['atelier', c.s('accueil.ateliers.titre').replace(/<[^>]+>/g, '')], ['voyage', c.s('accueil.voyage.titre').replace(/<[^>]+>/g, '')],
];

export default (c) => {
  const T = (k) => c.t(`accueil.${k}`), S = (k) => c.s(`accueil.${k}`), B = (k) => c.tb(`accueil.${k}`);
  const jour = aujourdhui();
  const dates = c.donnees.agenda.dates;
  const prochaine = dates.find((d) => d >= jour);
  const temoins = c.donnees.temoignages.filter((t) => t.pages.includes('accueil'));
  return html`
<section class="hero hero--accueil" id="debut">
  <div class="hero-fond">
    ${c.media({ nom: 'grok/accueil-eau', alt: S('hero.alt'), cadrage: '62% 55%', cadrageMobile: '50% 62%', priorite: true, classe: 'hero-media', sizes: '100vw' })}
    <canvas class="hero-eau" data-eau aria-hidden="true" data-audit-ignorer></canvas>
    <div class="hero-voile" aria-hidden="true"></div>
  </div>
  <div class="hero-texte conteneur">
    <p class="surtitre hero-surtitre" data-anime="gsap">${T('hero.surtitre')}</p>
    <h1 class="hero-titre"><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${T('hero.titre1')}</span></span><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${B('hero.titre2')}</span></span></h1>
    <p class="hero-intro" data-anime="gsap">${T('hero.texte')}</p>
    <p class="hero-actions" data-anime="gsap">
      <a class="bouton bouton--clair" href="${c.url('accueil', 'rendez-vous')}" data-action-principale data-libelle="${c.s('nav.rendezvous')}">${T('hero.action')}</a>
      <a class="lien-fleche lien-fleche--clair" href="${c.url('accueil', 'soins')}" data-libelle="${c.s('nav.soins')}">${T('hero.secondaire')}</a>
    </p>
    <p class="hero-info" data-info-cle data-anime="gsap">${T('hero.info')}</p>
  </div>
</section>

<section class="muriel" id="muriel">
  <div class="conteneur muriel-grille">
    <div class="muriel-visuels">
      ${c.media({ nom: 'muriel-assise-tambour', alt: S('muriel.alt1'), cadrage: '50% 38%', classe: 'muriel-arche', sizes: '(max-width: 760px) 90vw, 38vw' })}
      ${c.media({ nom: 'cristal-plaques-jardin', alt: S('muriel.alt2'), cadrage: '50% 45%', classe: 'muriel-petite', sizes: '(max-width: 760px) 50vw, 18vw' })}
    </div>
    <div class="muriel-texte">
      <p class="surtitre" data-anime>${T('muriel.surtitre')}</p>
      <h2 data-anime>${B('muriel.titre')}</h2>
      <p class="chapeau" data-anime>${T('muriel.texte1')}</p>
      <p data-anime>${T('muriel.texte2')}</p>
      <p class="annees" data-anime><strong class="annees-chiffre" data-compteur="35">35</strong><span>${T('muriel.anneesTexte')}</span></p>
      <h3 class="petit-titre" data-anime>${T('muriel.parcoursTitre')}</h3>
      <ul class="parcours" data-anime>${c.donnees.parcours.map((p) => html`<li>${p}</li>`)}</ul>
      <p class="pour-qui" data-anime><strong>${T('muriel.pourQuiTitre')}</strong> ${T('muriel.pourQui')}</p>
    </div>
  </div>
</section>

<section class="soins" id="soins">
  <div class="conteneur">
    <div class="tete-section">
      <p class="surtitre" data-anime>${T('soins.surtitre')}</p>
      <h2 data-anime>${B('soins.titre')}</h2>
      <p class="chapeau" data-anime>${T('soins.texte')}</p>
    </div>
    <div class="guide" data-guide data-anime>
      <p class="guide-titre" id="guide-titre">${T('soins.guideTitre')}</p>
      <p class="guide-aide">${T('soins.guideAide')}</p>
      <div class="guide-choix" role="group" aria-labelledby="guide-titre">
        ${c.donnees.soins.map((s) => html`<button type="button" class="pastille" data-envie="${s.id}" data-envie-texte="${s.envie}" data-soin-nom="${s.nom}" aria-pressed="false">${s.envie}</button>`)}
      </div>
      <p class="guide-reponse" data-guide-reponse aria-live="polite" data-modele="${S('soins.guideConseil')}">${T('soins.guideVide')}</p>
    </div>
    <ul class="soins-grille">
      ${c.donnees.soins.map((s, i) => html`<li class="soin" id="soin-${s.id}" data-soin="${s.id}" style="--i:${i}">
        <article class="soin-carte" data-anime>
          ${c.media({ nom: s.image, alt: s.alt, cadrage: s.cadrage, classe: 'soin-media', sizes: '(max-width: 760px) 92vw, (max-width: 1180px) 46vw, 24vw' })}
          <div class="soin-corps">
            <p class="soin-tag"><span class="soin-conseil">${T('soins.conseil')}</span><span>${T('soins.nonMedical')}</span></p>
            <h3>${s.nom}</h3>
            <p>${s.texte}</p>
            <ul class="tarifs" aria-label="${S('soins.tarifsTitre')}">${s.tarifs.map((t) => tarif(c, t))}</ul>
            <p class="soin-lieu">${s.lieu}</p>
            <p class="soin-actions">
              ${s.page ? html`<a class="lien-fleche" href="${c.url(s.page)}" data-libelle="${c.libelle(s.page)}">${T('soins.decouvrir')}</a>` : ''}
              ${versRdv(c, `sujet=${s.id}`, T('soins.reserver'))}
            </p>
          </div>
        </article>
      </li>`)}
    </ul>
    <p class="avertissement" data-anime>${T('soins.avertissement')}</p>
  </div>
</section>

<section class="seance" id="seance" data-scene-seance>
  <div class="seance-fond" aria-hidden="true" data-audit-ignorer>
    ${c.media({ nom: 'grok/eau-calme-texture', alt: '', classe: 'seance-media', sizes: '100vw' })}
  </div>
  <div class="seance-grille conteneur">
    <div class="seance-tete">
      <p class="surtitre surtitre--clair" data-anime>${T('seance.surtitre')}</p>
      <h2 data-anime>${B('seance.titre')}</h2>
      <p data-anime>${T('seance.texte')}</p>
      <p class="seance-pratique" data-anime>${T('seance.pratique')}</p>
    </div>
    <div class="seance-cadran" aria-hidden="true" data-visuel>
      <svg viewBox="0 0 200 200" focusable="false"><circle class="grand-fond" cx="100" cy="100" r="88"></circle><circle class="grand-arc" cx="100" cy="100" r="88" pathLength="100" data-grand-arc></circle>
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => html`<line class="grand-trait" x1="100" y1="8" x2="100" y2="16" transform="rotate(${n * 36} 100 100)"></line>`)}
      </svg>
      <span class="grand-chiffre" data-grand-chiffre>10</span>
      <span class="grand-legende">${T('seance.note')}</span>
    </div>
    <ol class="seance-etapes">
      ${c.donnees.seance.map((e, i) => html`<li class="seance-etape" data-etape-seance="${i}" data-note="${e.note}">
        <span class="etape-note" aria-hidden="true">${e.note}</span>
        <div><h3>${e.titre}</h3><p>${e.texte}</p></div>
      </li>`)}
    </ol>
  </div>
</section>

<section class="accompagner" id="accompagner">
  <div class="conteneur">
    <div class="tete-section">
      <p class="surtitre" data-anime>${T('accompagner.surtitre')}</p>
      <h2 data-anime>${B('accompagner.titre')}</h2>
      <p class="chapeau" data-anime>${T('accompagner.texte')}</p>
    </div>
    <div class="offres">
      <article class="offre offre--grande" data-anime>
        ${c.media({ nom: 'grok/reconnexion-sentier', alt: S('accompagner.reconnexionAlt'), classe: 'offre-media', sizes: '(max-width: 760px) 92vw, 40vw' })}
        <div class="offre-corps">
          <h3>${T('accompagner.reconnexionTitre')}</h3>
          <p>${T('accompagner.reconnexionTexte')}</p>
          <p class="offre-prix" data-prix>${T('accompagner.reconnexionPrix')}</p>
          <p><a class="bouton" href="${c.url('reconnexion')}" data-libelle="${c.libelle('reconnexion')}">${T('accompagner.reconnexionLien')}</a></p>
        </div>
      </article>
      <article class="offre" id="pilier" data-anime>
        <div class="offre-dessin">
          ${c.media({ nom: 'dessin-pilier', alt: S('accompagner.pilierAlt'), cadrage: '50% 42%', classe: 'offre-media offre-media--dessin', sizes: '(max-width: 760px) 92vw, 26vw' })}
          <svg class="spirale" viewBox="0 0 200 200" aria-hidden="true" focusable="false" data-audit-ignorer><path data-spirale d=""></path></svg>
        </div>
        <div class="offre-corps">
          <h3>${T('accompagner.pilierTitre')}</h3>
          <p>${T('accompagner.pilierTexte')}</p>
          <p class="offre-prix" data-prix>${T('accompagner.pilierPrix')}</p>
          <p class="offre-lieu">${T('accompagner.pilierLieu')}</p>
          <p>${versRdv(c, 'sujet=pilier', T('accompagner.pilierAction'), 'bouton bouton--contour')}</p>
        </div>
      </article>
      <article class="offre" id="cheval" data-anime>
        ${c.media({ nom: 'grok/cheval-main', alt: S('accompagner.chevalAlt'), classe: 'offre-media offre-media--respire', sizes: '(max-width: 760px) 92vw, 26vw' })}
        <div class="offre-corps">
          <h3>${T('accompagner.chevalTitre')}</h3>
          <p>${T('accompagner.chevalTexte')}</p>
          <p class="offre-prix" data-prix>${T('accompagner.chevalPrix')}</p>
          <p>${versRdv(c, 'sujet=cheval', T('accompagner.chevalAction'), 'bouton bouton--contour')}</p>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="ateliers" id="ateliers">
  <div class="conteneur ateliers-grille">
    <div class="ateliers-texte">
      <p class="surtitre" data-anime>${T('ateliers.surtitre')}</p>
      <h2 data-anime>${B('ateliers.titre')}</h2>
      <p class="chapeau" data-anime>${T('ateliers.texte')}</p>
      <div class="agenda" data-agenda data-anime data-termine="${S('ateliers.termine')}" data-aujourdhui="${S('ateliers.aujourdhui')}" data-demain="${S('ateliers.demain')}" data-dans="${S('ateliers.dansJours')}">
        <p class="agenda-titre">${T('ateliers.datesTitre')}</p>
        <ol class="agenda-liste">${dates.map((d) => {
          const passe = d < jour, auj = d === jour;
          return html`<li class="agenda-date${passe ? ' passe' : ''}${d === prochaine ? ' prochaine' : ''}" data-date="${d}"><time datetime="${d}">${dateLongue(d)}</time><span class="agenda-statut" data-statut>${passe ? T('ateliers.termine') : auj ? T('ateliers.aujourdhui') : d === prochaine ? T('ateliers.prochaine') : ''}</span></li>`;
        })}</ol>
        <p class="agenda-aucune" data-agenda-aucune${prochaine ? brut(' hidden') : ''}>${T('ateliers.aucune')}</p>
      </div>
      <ul class="infos" data-anime>
        <li>${T('ateliers.horaire')}</li>
        <li>${T('ateliers.lieu')}</li>
        <li data-prix>${T('ateliers.tarif')}</li>
        <li>${T('ateliers.apporter')}</li>
        <li>${T('ateliers.reservation')}</li>
      </ul>
      <p class="ateliers-actions" data-anime>
        ${versRdv(c, 'sujet=atelier', T('ateliers.action'), 'bouton')}
        <button type="button" class="bouton bouton--contour bouton-bol" data-bol><span class="bol-icone" aria-hidden="true"></span>${c.t('commun.son.ecouter')}</button>
      </p>
      <p class="son-note" data-anime>${c.t('commun.son.note')}</p>
    </div>
    <div class="ateliers-visuels">
      <div class="bol-scene">
        ${c.media({ nom: 'instruments-bain-sonore', alt: S('ateliers.altInstruments'), cadrage: '50% 55%', classe: 'ateliers-media', sizes: '(max-width: 760px) 92vw, 44vw' })}
        <div class="bol-ondes" data-bol-ondes aria-hidden="true" data-audit-ignorer><span></span><span></span><span></span><span></span></div>
      </div>
      ${c.media({ nom: 'danse-en-cercle', alt: S('ateliers.altDanse'), cadrage: '50% 45%', classe: 'ateliers-media ateliers-media--petite', sizes: '(max-width: 760px) 70vw, 24vw' })}
    </div>
  </div>
  <div class="conteneur">
    <p class="petit-titre intervenants-titre" data-anime>${T('ateliers.intervenantsTitre')}</p>
    <ul class="intervenants">${c.donnees.intervenants.map((p) => html`<li class="intervenant" data-anime><p class="intervenant-nom">${p.nom}<span>${p.role}</span></p><p>${p.texte}</p></li>`)}</ul>
  </div>
</section>

<section class="voyage" id="voyage" data-scene-voyage>
  <div class="voyage-fond" aria-hidden="true" data-audit-ignorer>
    ${c.media({ nom: 'grok/desert-dunes', alt: '', cadrage: '60% 62%', cadrageMobile: '50% 60%', classe: 'voyage-media', sizes: '100vw' })}
    <div class="voyage-nuit" data-voyage-nuit></div>
    <div class="etoiles" data-etoiles data-audit-ignorer>${etoiles.map((e) => html`<span style="left:${e.x}%;top:${e.y}%;--t:${e.t}s"></span>`)}</div>
  </div>
  <div class="voyage-tete conteneur">
    <p class="surtitre surtitre--clair">${T('voyage.surtitre')}</p>
    <h2>${B('voyage.titre')}</h2>
  </div>
  <div class="voyage-piste" data-galerie tabindex="0" role="region" aria-label="${S('voyage.region')}">
    <article class="v-carte v-carte--intro">
      <p class="v-sous">${T('voyage.sousTitre')}</p>
      <p class="v-dates"><strong>${T('voyage.dates')}</strong><span>${T('voyage.nuits')}</span></p>
      <p class="v-prix" data-prix>${T('voyage.prix')}</p>
      <p>${T('voyage.intro')}</p>
      <p class="v-avec">${T('voyage.avec')}</p>
    </article>
    ${c.donnees.voyage.cartes.map((v, i) => html`<article class="v-carte${v.image ? ' v-carte--image' : ' v-carte--texte'}">
      ${v.image ? c.media({ nom: v.image, alt: v.alt, classe: 'v-media', sizes: '(max-width: 760px) 80vw, 30vw' }) : html`<span class="v-numero" aria-hidden="true">0${i + 1}</span>`}
      <div class="v-corps">${v.image ? html`<span class="v-etape" aria-hidden="true">0${i + 1}</span>` : ''}<h3>${v.titre}</h3><p>${v.texte}</p></div>
    </article>`)}
    <article class="v-carte v-carte--infos" id="voyage-inclus">
      <div class="v-colonnes">
        <div><h3>${T('voyage.inclusTitre')}</h3><ul class="v-liste">${c.donnees.voyage.inclus.map((x) => html`<li>${x}</li>`)}</ul></div>
        <div><h3>${T('voyage.nonInclusTitre')}</h3><ul class="v-liste v-liste--non">${c.donnees.voyage.nonInclus.map((x) => html`<li>${x}</li>`)}</ul></div>
      </div>
    </article>
    <article class="v-carte v-carte--infos" id="voyage-infos">
      <h3>${T('voyage.contactsTitre')}</h3>
      <ul class="v-contacts">${c.donnees.voyage.contacts.map((k) => html`<li>${k.nom}&#160;: <a href="tel:${k.lien}">${k.tel}</a></li>`)}</ul>
      <p class="v-public">${T('voyage.public')}</p>
      <p>${versRdv(c, 'sujet=voyage', T('voyage.action'), 'bouton bouton--clair')}</p>
      <p class="v-note">${T('voyage.note')}</p>
    </article>
  </div>
  <div class="voyage-bas conteneur">
    <div class="voyage-progres" aria-hidden="true"><span data-voyage-progres></span></div>
    <p class="voyage-aide"><span class="aide-souris">${T('voyage.defiler')}</span><span class="aide-doigt">${T('voyage.glisser')}</span></p>
  </div>
</section>

<section class="temoignages" id="temoignages">
  <div class="conteneur temoignages-grille">
    <div class="temoignages-tete">
      <p class="surtitre" data-anime>${T('temoignages.surtitre')}</p>
      <h2 data-anime>${B('temoignages.titre')}</h2>
      <p data-anime>${T('temoignages.texte')}</p>
      ${c.media({ nom: 'cabinet-coin-tambour', alt: S('temoignages.alt'), cadrage: '50% 60%', classe: 'temoignages-media', sizes: '(max-width: 760px) 92vw, 30vw' })}
    </div>
    <ul class="avis">${temoins.map((t) => html`<li class="avis-carte" data-anime>
      <blockquote><p>${t.texte}</p></blockquote>
      <p class="avis-nom">${t.nom}<span>${t.contexte} · ${t.source}</span></p>
    </li>`)}</ul>
  </div>
  <div class="ruban-section">
    <div class="ruban" id="ruban-avis" data-boucle-css data-ruban aria-hidden="true"><p>${[0, 1].map(() => c.donnees.temoignages.map((t) => html`<span>${T('temoignages.ruban')} ${t.nom.split(/[ ,]/)[0]}</span>`))}</p></div>
    <button type="button" class="ruban-pause" data-pause-pour="ruban-avis" data-libelle-pause="${c.s('commun.pause')}" data-libelle-lecture="${c.s('commun.lecture')}"><span data-libelle-bouton>${c.t('commun.pause')}</span></button>
  </div>
</section>

<section class="rdv" id="rendez-vous">
  <div class="conteneur rdv-grille">
    <div class="rdv-infos">
      <p class="surtitre" data-anime>${T('rdv.surtitre')}</p>
      <h2 data-anime>${B('rdv.titre')}</h2>
      <p class="chapeau" data-anime>${T('rdv.texte')}</p>
      <div class="lotus" data-lotus aria-hidden="true">
        ${c.media({ nom: 'grok/lotus-ouvert', alt: S('rdv.lotusAlt'), classe: 'lotus-media', sizes: '220px' })}
        <svg class="lotus-trait" viewBox="0 0 100 100" focusable="false" data-audit-ignorer><circle cx="50" cy="50" r="48" pathLength="100"></circle></svg>
      </div>
      <div class="rdv-contact" data-anime>
        <h3 class="petit-titre">${T('rdv.contactTitre')}</h3>
        <p class="rdv-tel"><a href="tel:${c.site.contact.telephoneLien}">${T('rdv.appeler')}</a></p>
        <p>${T('rdv.smsWhatsapp')} · <a href="${c.site.contact.whatsapp}" rel="noopener" target="_blank">${c.t('commun.whatsappLong')}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span></a></p>
        <p><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
      </div>
      <div class="rdv-lieu" data-anime>
        <h3 class="petit-titre">${T('rdv.cabinetTitre')}</h3>
        <p><strong>${T('rdv.adresse')}</strong></p>
        <ul class="infos">
          <li>${T('rdv.acces')}</li><li>${T('rdv.domicile')}</li><li>${T('rdv.distance')}</li><li>${T('rdv.paiement')}</li>
        </ul>
        <p><a class="lien-fleche" href="${c.site.contact.itineraire}" rel="noopener" target="_blank">${T('rdv.itineraire')}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span></a></p>
      </div>
      <figure class="plan" data-visuel data-anime>
        ${c.media({ nom: 'grok/haut-languedoc', alt: S('rdv.alt'), classe: 'plan-media', sizes: '(max-width: 760px) 92vw, 40vw' })}
        <svg class="plan-svg" viewBox="0 0 400 260" role="img" aria-label="${S('rdv.carteLegende')} : ${S('rdv.carteCabinet')}, ${S('rdv.carteLamalou')}, ${S('rdv.carteZone')}" focusable="false">
          <circle class="plan-zone" cx="200" cy="138" r="104" pathLength="100" data-plan-zone></circle>
          <text class="plan-texte plan-texte--zone" x="200" y="26" text-anchor="middle" data-repere>${T('rdv.carteZone')}</text>
          <circle class="plan-point plan-point--lamalou" cx="200" cy="138" r="5" data-repere></circle>
          <text class="plan-texte" x="212" y="160" data-repere>${T('rdv.carteLamalou')}</text>
          <circle class="plan-halo" cx="172" cy="112" r="10"></circle>
          <circle class="plan-point plan-point--cabinet" cx="172" cy="112" r="6" data-repere></circle>
          <text class="plan-texte plan-texte--fort" x="160" y="96" text-anchor="end" data-repere>${T('rdv.carteCabinet')}</text>
          <g class="plan-nord" transform="translate(370 34)"><path d="M0 -14 L6 6 L0 2 L-6 6 Z"></path><text x="0" y="22" text-anchor="middle">N</text></g>
        </svg>
      </figure>
      <p class="plan-legende" data-anime>${T('rdv.carteLegende')}</p>
    </div>
    <div class="rdv-formulaire">
      <form data-formulaire class="formulaire etapes" data-etapes action="#" novalidate>
        <h3 class="form-titre">${T('rdv.formTitre')}</h3>
        <p class="etapes-annonce">${T('rdv.etapes')}</p>
        <ol class="etapes-progres" aria-hidden="true">${['e1', 'e2', 'e3', 'e4'].map((e, i) => html`<li data-progres="${i + 1}"><span>${i + 1}</span>${T('rdv.' + e)}</li>`)}</ol>
        <p class="etape-statut visuellement-cache" data-etape-statut aria-live="polite" data-modele="${S('rdv.etape')}"></p>
        <div class="etapes-cadre" data-etapes-cadre>
          <fieldset class="etape" data-etape="1">
            <legend>${T('rdv.e1')} · ${T('rdv.sujetLegende')}</legend>
            <div class="choix-grille">${sujets(c).map(([v, l], i) => html`<label class="choix"><input type="radio" name="sujet" value="${v}"${i === 0 ? brut(' required') : ''}><span>${l}</span></label>`)}</div>
            <div class="champ champ--court"><label for="f-duree">${T('rdv.dureeLabel')}</label>
              <select id="f-duree" name="duree"><option value="">${T('rdv.dureeAucune')}</option>${[...new Set(c.donnees.soins.flatMap((s) => s.tarifs.map((t) => t.duree)))].map((d) => html`<option value="${d.replace(/\s+/g, '')}">${d}</option>`)}</select></div>
            <div class="champ champ--court" data-formule-champ><label for="f-formule">${T('rdv.formuleLabel')}</label>
              <select id="f-formule" name="formule"><option value="">${T('rdv.dureeAucune')}</option>${c.donnees.formules.map((f) => html`<option value="${f.id}">${f.mois === 1 ? c.s('reconnexion.simulateur.mois1') : c.s('reconnexion.simulateur.moisN', { n: f.mois })} · ${c.s('reconnexion.simulateur.seances', { n: f.seances })} · ${new Intl.NumberFormat('fr-FR').format(f.prix).replace(/[\u202f\u00a0]/g, ' ')} €</option>`)}</select></div>
          </fieldset>
          <fieldset class="etape" data-etape="2">
            <legend>${T('rdv.e2')} · ${T('rdv.lieuLegende')}</legend>
            <div class="choix-grille choix-grille--colonne">
              <label class="choix"><input type="radio" name="lieu" value="cabinet" required><span>${T('rdv.lieuCabinet')}</span></label>
              <label class="choix"><input type="radio" name="lieu" value="domicile"><span>${T('rdv.lieuDomicile')}</span></label>
              <label class="choix"><input type="radio" name="lieu" value="distance"><span>${T('rdv.lieuDistance')}</span></label>
            </div>
            <p class="aide">${T('rdv.lieuAide')}</p>
          </fieldset>
          <fieldset class="etape" data-etape="3">
            <legend>${T('rdv.e3')}</legend>
            <p class="sous-legende" id="jours-legende">${T('rdv.joursLegende')}</p>
            <div class="choix-grille choix-grille--petits" role="group" aria-labelledby="jours-legende">${['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map((j) => html`<label class="choix choix--petit"><input type="checkbox" name="jours" value="${j}"><span>${T('jours.' + j)}</span></label>`)}</div>
            <p class="sous-legende" id="moments-legende">${T('rdv.momentsLegende')}</p>
            <div class="choix-grille choix-grille--petits" role="group" aria-labelledby="moments-legende">${['matin', 'apresMidi', 'soir'].map((m) => html`<label class="choix choix--petit"><input type="checkbox" name="moments" value="${m}"><span>${T('rdv.' + m)}</span></label>`)}</div>
            <div class="champ"><label for="f-precisions">${T('rdv.precisions')}</label><textarea id="f-precisions" name="precisions" rows="3"></textarea></div>
          </fieldset>
          <fieldset class="etape" data-etape="4">
            <legend>${T('rdv.e4')}</legend>
            <div class="champ"><label for="f-nom">${T('rdv.nom')}</label><input id="f-nom" name="nom" autocomplete="name" required></div>
            <div class="champ"><label for="f-tel">${T('rdv.tel')}</label><input id="f-tel" name="tel" type="tel" autocomplete="tel" inputmode="tel" required></div>
            <div class="champ"><label for="f-email">${T('rdv.email')}</label><input id="f-email" name="email" type="email" autocomplete="email"></div>
            <div class="champ"><label for="f-message">${T('rdv.message')}</label><textarea id="f-message" name="message" rows="3"></textarea></div>
            <p class="mention-donnees">${B('rdv.donnees')}</p>
          </fieldset>
        </div>
        <p class="etape-erreur" data-etape-erreur role="alert" hidden>${T('rdv.choisir')}</p>
        <div class="etapes-nav">
          <button type="button" class="bouton bouton--contour" data-precedent>${T('rdv.precedent')}</button>
          <button type="button" class="bouton" data-suivant>${T('rdv.suivant')}</button>
          <button type="submit" class="bouton" data-envoyer>${T('rdv.envoyer')}</button>
        </div>
        <p class="simule">${T('rdv.simule')}</p>
        <p data-message-envoi role="status" tabindex="-1" hidden data-texte="${S('rdv.envoye')}"></p>
      </form>
      <aside class="recap" data-recap aria-label="${S('rdv.recapTitre')}">
        <p class="recap-titre">${T('rdv.recapTitre')}</p>
        <dl>
          <div><dt>${T('rdv.recapSoin')}</dt><dd data-recap-sujet>—</dd></div>
          <div><dt>${T('rdv.recapLieu')}</dt><dd data-recap-lieu>—</dd></div>
          <div><dt>${T('rdv.recapDispo')}</dt><dd data-recap-dispo>—</dd></div>
        </dl>
      </aside>
    </div>
  </div>
</section>
`;
};
