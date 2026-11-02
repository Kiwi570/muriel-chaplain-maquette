/* Page 404 aux couleurs du site : une goutte suspendue au-dessus de l'eau. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: '404', fichier: '404', langues: ['fr'], partage: false };

export default (c) => html`
<section class="hero hero--page hero--sombre introuvable" id="debut">
  <div class="hero-fond">
    ${c.media({ nom: 'grok/page-404', alt: c.s('introuvable.alt'), cadrage: '58% 45%', cadrageMobile: '50% 55%', priorite: true, classe: 'hero-media', sizes: '100vw' })}
    <div class="hero-voile" aria-hidden="true"></div>
  </div>
  <div class="hero-texte conteneur">
    <h1 class="hero-titre"><span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.tb('introuvable.titre')}</span></span></h1>
    <p class="hero-intro" data-anime="gsap">${c.t('introuvable.texte')}</p>
    <p class="hero-actions" data-anime="gsap">${c.lien('accueil', { classe: 'bouton bouton--clair', texte: c.t('introuvable.retour'), attrs: 'data-action-principale' })}</p>
  </div>
</section>
`;
