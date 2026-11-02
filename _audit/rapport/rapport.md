# Rapport d’audit

Projet : `muriel-chaplain-maquette` · 02/11/2026 21:00:55 · 20 min · 5 page(s) contrôlée(s) en entier · audit complet

## Résumé

- Échecs : **0**
- À regarder : **2**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), mesures (208), balayage (4), films d’ouverture (8), films de transition (8), bords de l’écran (5), intro accélérable et passable (7), menu (1), clavier (5), liens et boutons (5), liens profonds (16), liens vers la page en cours (4), changements de hauteur (3), mode calme (8), bouton du mode calme (2), simulateur (5), rendez-vous (1), guide-echelle-agenda (1), parcours du projet (1), tient dans l’écran (8), films des épinglages (2), fluidité (8), défilement selon l’appareil (5), vitesse (4), captures (1)

## Échecs

Aucun.

## À regarder

### rechargement au milieu de la page (1)

- **rechargement au milieu de la page** — `/liberations-point-zero` — écran différent à la même position après rechargement (4.6 %), voir comparaisons/rechargement-liberations-point-zero-*.png _(1366×768)_

### fluidité (1)

- **fluidité** — `/` — 6 % d'images de plus de 50 ms _(1366×768 défilement à la molette, processeur ralenti 4 fois)_

## Non lancé

- **Safari (WebKit)** : WebKit ne peut pas s’installer ici : vérification à faire dans Safari sur le Mac (liste dans le rapport)

### À vérifier dans Safari sur le Mac (WebKit indisponible ici)

- Ouverture de chaque page : rien qui clignote, intro complète au premier chargement et au rechargement.
- Changement de page : le voile couvre l’écran, pas de page blanche ; retour arrière sans intro ni voile resté.
- Défilement : fluide (natif), en-tête qui se cache et revient sans clignoter, sections épinglées entières.
- Menu sur iPhone (mode Responsive de Safari) : ouverture, fermeture, page bloquée derrière.
- Polices, images, mention « Illustration générée », formulaires et barre fixe du bas.

## Repères

- Numéro de version des fichiers : ?v=1
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Mode sans WebGL : contrôlé sur les 1 page(s) qui utilisent WebGL (/).
- Ouverture / (1366×768) : 2904 ms depuis le premier octet
- Ouverture /liberations-point-zero (1366×768) : 2888 ms depuis le premier octet
- Ouverture /mentions-legales (1366×768) : 2509 ms depuis le premier octet
- Ouverture /reconnexion-a-soi (1366×768) : 2901 ms depuis le premier octet
- Ouverture / (390×844) : 2902 ms depuis le premier octet
- Ouverture /liberations-point-zero (390×844) : 2898 ms depuis le premier octet
- film de l'ouverture /liberations-point-zero 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /mentions-legales (390×844) : 2458 ms depuis le premier octet
- Ouverture /reconnexion-a-soi (390×844) : 2897 ms depuis le premier octet
- Bords de l’écran : 406 images d’intro, 17 de voile et 136 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Changements de hauteur /mentions-legales : aucun effet ScrollTrigger, rien à recalculer.
- Tient dans l'écran /liberations-point-zero : aucune section épinglée ou plein écran.
- Tient dans l'écran /mentions-legales : aucune section épinglée ou plein écran.
- Tient dans l'écran /reconnexion-a-soi : aucune section épinglée ou plein écran.
- Fluidité /liberations-point-zero 1366×768 (molette) : 3 % d'images lentes sur 362, tâche la plus longue 81 ms
- Fluidité /mentions-legales 1366×768 (molette) : 0 % d'images lentes sur 147, tâche la plus longue 0 ms
- Fluidité /reconnexion-a-soi 1366×768 (molette) : 2 % d'images lentes sur 317, tâche la plus longue 86 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1118, tâche la plus longue 0 ms
- Fluidité /liberations-point-zero 390×844 (doigt) : 0 % d'images lentes sur 1348, tâche la plus longue 0 ms
- Fluidité /mentions-legales 390×844 (doigt) : 0 % d'images lentes sur 1343, tâche la plus longue 0 ms
- Fluidité /reconnexion-a-soi 390×844 (doigt) : 0 % d'images lentes sur 1343, tâche la plus longue 0 ms
- Vitesse / : 1.15 s de calcul au chargement (téléphone ralenti).
- Vitesse /liberations-point-zero : 0.71 s de calcul au chargement (téléphone ralenti).
- Vitesse /mentions-legales : 0.47 s de calcul au chargement (téléphone ralenti).
- Vitesse /reconnexion-a-soi : 0.69 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`
