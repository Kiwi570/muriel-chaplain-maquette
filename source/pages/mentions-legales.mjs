/* Mentions légales : fiche à compléter, éditeur, hébergeur (adresse vérifiée), cadre de pratique non médical,
   crédits (illustrations générées), confidentialité. Barre de lecture et sommaire qui suit la lecture. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'mentions-legales', fichier: 'mentions-legales', imagePartage: 'grok/mentions-entete-1168.webp', sansAction: true };

const sections = ['fiche', 'editeur', 'hebergeur', 'cadre', 'credits', 'confidentialite'];

export default (c) => html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="page-tete page-tete--legal conteneur" id="debut">
  <div>
    <h1>${c.t('mentions.titre')}</h1>
    <nav data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${sections.map((s) => html`<li><a href="#${s}">${c.t(`mentions.${s}.titre`)}</a></li>`)}</ul></nav>
  </div>
  ${c.media({ nom: 'grok/mentions-entete', alt: '', cadrage: '60% 55%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 44vw' })}
</section>
<div class="texte-long conteneur" data-sans-visuel>
  ${sections.map((s) => html`<section id="${s}" data-sans-visuel><h2>${c.t(`mentions.${s}.titre`)}</h2><p>${c.t(`mentions.${s}.texte`)}</p></section>`)}
</div>
`;
