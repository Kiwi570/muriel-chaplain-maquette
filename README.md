# Maquette — Soins Esprit Âme et Corps Réunis (Muriel Chaplain)

Maquette du futur site de Muriel Chaplain, énergéticienne à L’Horte (Taussac-la-Billière, près de Lamalou-les-Bains, Hérault).
Direction artistique « Point Zéro » : eau, lumière du soir, lotus ; un cadran de 10 à 0 accompagne la lecture.

Pages : accueil, Libérations au Point Zéro, Reconnexion à Soi, mentions légales (avec confidentialité), page 404.

## Travailler sur la maquette

Site statique (HTML, CSS, JavaScript), prêt pour Vercel sans étape de construction.

| Commande (depuis ce dossier) | Rôle |
|---|---|
| `node outils/generer.mjs` | Régénère les pages à partir de `donnees/` et `source/` (ne jamais modifier les `.html` à la main). |
| `node outils/images-partage.mjs` | Recrée les images de partage 1200×630 (`assets/partage/`). |
| `python3 outils/images.py recu/lot.json` | Convertit les photos reçues en WebP (plusieurs tailles). |
| `node _audit/audit.mjs` | Audit complet avant chaque livraison (rapport dans `_audit/rapport/`). |

- Textes : `donnees/textes/fr.json` ; données : `donnees/*.json` (soins, tarifs, agenda, témoignages, formules, voyage…).
- Pages : `source/pages/*.mjs` ; gabarit commun : `source/gabarits/commun.mjs`.
- Style : `assets/css/site.css` ; effets : `assets/js/site.js`, `assets/js/eau.js` (eau WebGL), `assets/js/son.js` (bol chantant).
- Agenda des ateliers : ajouter les dates dans `donnees/agenda.json` ; « Terminé », « Aujourd’hui » et « Dans N jours » se calculent seuls à la date de Paris.
- À chaque nouvelle version : augmenter `version` dans `donnees/site.json`, régénérer, auditer.

## À retirer à la mise en ligne définitive

- La consigne `noindex` : balise robots dans `source/gabarits/commun.mjs` et en-tête `X-Robots-Tag` dans `vercel.json`.
- Les formulaires simulés (rendez-vous, demande d’informations du voyage) : à brancher sur un vrai envoi (e-mail ou outil de réservation).
- Les mentions « à compléter » et « à confirmer » une fois les informations fournies.
- La ligne « Maquette : … » du pied de page.

## À garder

- La mention « Illustration générée » sur chaque image créée par IA (dossier `assets/images/grok/`), vignettes et images de partage comprises.
- La mention « pratiques de bien-être non médicales » sur les soins et dans le pied de page.

## Points à confirmer avec Muriel

1. **Promesses de santé** : le site actuel en contient (« Pleine Santé », « auto-guérison », « maladies », « phobies, ronflements, surpoids », « retour du sommeil »…). La maquette les reformule en bien-être et précise le cadre non médical : à valider avec elle.
2. **Témoignages** : ceux de Pascale (cancer) et de l’adolescente de 16 ans ont été retirés. Les autres sont des extraits fidèles, coupés « […] » sans mot ajouté. Prénom « Céline » repris du nom de fichier de la capture : à confirmer. Les noms complets publiés sur Facebook sont abrégés (initiale).
3. **Voyage au Maroc** : vendre ensemble transferts, hébergement et repas constitue un forfait touristique ; l’organisateur doit être immatriculé chez Atout France (ou passer par un opérateur immatriculé). La maquette ne propose qu’une demande d’informations. Nombre de nuits : 14 du 6 au 20 mars (le site dit 13, l’affiche dit « 13 jours dans le désert »).
4. **Mention « ou plus »** : le site actuel l’indique pour les libérations (1 h et 2 h, pas 1 h 30) et pour les ateliers ; la maquette suit exactement le site. Muriel souhaite-t-elle une règle unique (par exemple « selon vos ressources » pour tous les soins) ?
5. **Lieux et tarifs** : libérations et sonothérapie à distance ? Rayon à domicile 30 min (site) ou 40 min (Resalib) ? « Centre Rayonne » à Ceyras le jeudi, toujours d’actualité ?
6. **Parcours** : durées de formation différentes entre le site et Resalib ; la maquette n’affiche pas de durée.
7. **Photos** : accord des personnes visibles sur la photo de danse en cercle ; crédits photo.
8. **Mentions légales** : forme juridique, SIRET (750 012 155 indiqué sur Resalib), directeur de la publication, politique de confidentialité.
9. **Images Grok** : livrées en 1 168 px de large ; nettes sur portable et téléphone, un peu douces sur très grand écran. À régénérer en plus grand si possible.

## Mise en ligne

Dépôt GitHub `Kiwi570/muriel-chaplain-maquette`, puis Vercel (`muriel-chaplain-maquette.vercel.app`). Les commandes sont données à chaque livraison.
Après la mise en ligne, désactiver Vercel Authentication (Settings, Deployment Protection) pour que la maquette soit visible.
