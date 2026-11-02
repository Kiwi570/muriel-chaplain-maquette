/* Image de partage 1200×630 de chaque page : panneau prune avec le monogramme, l'accroche en Fraunces,
   le nom, et la photo de la page. outils/images-partage.mjs photographie ces pages en JPG. */
import { html, brut } from '../../outils/gabarit.mjs';

export function page(c) {
  const cle = c.page.cle;
  const image = c.page.imagePartage || c.site.imagePartage;
  return html`<!doctype html>
<html lang="${c.l}"><head><meta charset="utf-8">
<link rel="stylesheet" href="/assets/css/socle.css"><link rel="stylesheet" href="/assets/css/site.css">
<style>${brut(`:root{--fond:${c.site.couleurs.fond};--texte:${c.site.couleurs.texte}}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#2b1e2f;color:#f6f0e6}
.carte{display:grid;grid-template-columns:560px 1fr;width:1200px;height:630px}
.carte-texte{display:flex;flex-direction:column;justify-content:space-between;padding:64px 56px 56px 64px;background:#2b1e2f;position:relative}
.carte-texte img{width:76px;height:76px}
.carte-sur{margin:0;font:600 18px/1.3 var(--police-texte);letter-spacing:.18em;text-transform:uppercase;color:#c9a86a}
.carte-titre{font-family:var(--police-titres);font-weight:400;font-size:66px;line-height:1.02;margin:0;text-wrap:balance;font-variation-settings:'opsz' 144}
.carte-nom{font-size:24px;font-weight:600;margin:0;color:#f6f0e6}
.carte-sous{font-size:19px;margin:6px 0 0;color:#d8c9b4}
.carte-image{position:relative;background:center/cover no-repeat}
.carte-ia{position:absolute;right:14px;bottom:14px;padding:4px 10px;border-radius:999px;background:rgba(0,0,0,.66);color:#fff;font:600 15px/1.3 var(--police-texte)}`)}</style>
</head><body>
<div class="carte">
  <div class="carte-texte">
    <img src="/assets/images/logo-clair.svg" alt="">
    <div><p class="carte-sur">${c.site.nom}</p><p class="carte-titre">${c.t(`pages.${cle}.accroche`)}</p></div>
    <div><p class="carte-nom">${c.t('commun.nom')}</p><p class="carte-sous">${c.t('accueil.rdv.acces')}</p></div>
  </div>
  <div class="carte-image" style="background-image:url('/assets/images/${image}')">${image.startsWith('grok/') ? html`<span class="carte-ia">${c.t('commun.mentionIa')}</span>` : ''}</div>
</div>
</body></html>`;
}
