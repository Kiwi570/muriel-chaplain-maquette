/* Parcours propres à la maquette de Muriel Chaplain :
   - simulateur Reconnexion à Soi : total, prix par séance, par mois vérifiés par le calcul, galets = séances ;
   - formulaire de rendez-vous en étapes : choix obligatoire, préremplissage par l'adresse, double clic, message simulé ;
   - guide « Quel soin pour moi ? » : la carte conseillée est signalée ;
   - échelle de 10 à 0 : le texte suit la note ;
   - agenda : dates passées marquées « Terminé ». */
/* Coche comme une personne : clic sur l'étiquette visible du choix (le bouton natif est masqué). */
async function cocher(page, sel) {
  const etiquette = page.locator('label', { has: page.locator(sel) }).first();
  await etiquette.scrollIntoViewIfNeeded();
  await etiquette.click();
  const ok = await page.$eval(sel, (i) => i.checked);
  if (!ok) throw new Error('choix non coché : ' + sel);
}

export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  /* Simulateur. */
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      await page.goto(BASE + '/reconnexion-a-soi', { waitUntil: 'load' });
      await attendrePret(page);
      const formules = await page.$$eval('input[name="formule-simulee"]', (l) => l.map((i) => ({ id: i.value, mois: +i.dataset.mois, seances: +i.dataset.seances, prix: +i.dataset.prix })));
      for (const f of formules) {
        await cocher(page, `input[name="formule-simulee"][value="${f.id}"]`);
        await attendre(250);
        const r = await page.evaluate(() => {
          const n = (s) => parseFloat(document.querySelector(s).textContent.replace(/[^\d,]/g, '').replace(',', '.'));
          return { total: +document.querySelector('[data-res-total]').dataset.total, totalTxt: n('[data-res-total]'), seance: n('[data-res-seance]'), mois: n('[data-res-mois]'), galets: document.querySelectorAll('[data-galets-piste] .galet').length, lien: document.querySelector('[data-simulateur-lien]').getAttribute('href') };
        });
        /* Montants par séance et par mois arrondis à l'euro (affichés « environ »). */
        const attenduSeance = Math.round(f.prix / f.seances), attenduMois = Math.round(f.prix / f.mois);
        if (r.total !== f.prix || r.totalTxt !== f.prix) R.echec('simulateur', `${f.id} : total ${r.totalTxt} au lieu de ${f.prix}`, { page: '/reconnexion-a-soi', taille: '390×844' });
        if (Math.abs(r.seance - attenduSeance) > 0.005) R.echec('simulateur', `${f.id} : ${r.seance} par séance au lieu de ${attenduSeance}`, { page: '/reconnexion-a-soi' });
        if (Math.abs(r.mois - attenduMois) > 0.005) R.echec('simulateur', `${f.id} : ${r.mois} par mois au lieu de ${attenduMois}`, { page: '/reconnexion-a-soi' });
        if (r.galets !== f.seances) R.echec('simulateur', `${f.id} : ${r.galets} galets pour ${f.seances} séances`, { page: '/reconnexion-a-soi' });
        if (!r.lien.includes('formule=' + f.id)) R.echec('simulateur', `${f.id} : le bouton ne transmet pas la formule (${r.lien})`, { page: '/reconnexion-a-soi' });
      }
      R.ok('simulateur', formules.length);
    } finally { await ctx.close(); }
  }

  /* Formulaire en étapes, prérempli par l'adresse. */
  {
    const { ctx, page } = await contexte({ taille: T('1440×900') });
    try {
      await page.goto(BASE + '/?sujet=reconnexion&formule=6-mois#rendez-vous', { waitUntil: 'load' });
      await attendrePret(page);
      const pre = await page.evaluate(() => ({ sujet: (document.querySelector('input[name="sujet"]:checked') || {}).value, formule: document.querySelector('#f-formule').value, recap: document.querySelector('[data-recap-sujet]').textContent }));
      if (pre.sujet !== 'reconnexion' || pre.formule !== '6-mois') R.echec('rendez-vous', `préremplissage incomplet : ${JSON.stringify(pre)}`, { page: '/' });
      if (!/Reconnexion/.test(pre.recap)) R.echec('rendez-vous', 'le récapitulatif ne reprend pas le choix prérempli', { page: '/' });
      /* Étape 2 sans choix : refus avec message. */
      await page.click('[data-suivant]');
      await attendre(500);
      await page.click('[data-suivant]');
      await attendre(300);
      const bloque = await page.evaluate(() => ({ visible: !document.querySelector('[data-etape-erreur]').hidden, etape: document.querySelector('.etape.active').dataset.etape }));
      if (!bloque.visible || bloque.etape !== '2') R.echec('rendez-vous', `l'étape 2 laisse passer sans choix de lieu (${JSON.stringify(bloque)})`, { page: '/' });
      await cocher(page, 'input[name="lieu"][value="cabinet"]');
      await page.click('[data-suivant]'); await attendre(450);
      await cocher(page, 'input[name="moments"][value="matin"]');
      await page.click('[data-suivant]'); await attendre(450);
      await page.fill('#f-nom', 'Test Maquette');
      await page.fill('#f-tel', '06 00 00 00 00');
      await page.dblclick('[data-envoyer]');
      await attendre(400);
      const fin = await page.evaluate(() => ({ msg: !document.querySelector('[data-message-envoi]').hidden, desactive: document.querySelector('[data-envoyer]').disabled }));
      if (!fin.msg) R.echec('rendez-vous', 'le message « demande simulée » ne s’affiche pas', { page: '/' });
      if (!fin.desactive) R.echec('rendez-vous', 'le bouton d’envoi reste actif après envoi (double envoi possible)', { page: '/' });
      /* Bouton « Réserver » de la même page : le choix est fait sans recharger. */
      await page.goto(BASE + '/', { waitUntil: 'load' });
      await attendrePret(page);
      await page.evaluate(() => { window.__marque = 1; });
      await page.click('#soin-massage [data-choix]');
      await attendre(1500);
      const meme = await page.evaluate(() => ({ marque: window.__marque === 1, sujet: (document.querySelector('input[name="sujet"]:checked') || {}).value, haut: document.querySelector('#rendez-vous').getBoundingClientRect().top }));
      if (!meme.marque) R.echec('rendez-vous', 'le bouton Réserver d’une carte recharge la page', { page: '/' });
      if (meme.sujet !== 'massage') R.echec('rendez-vous', `le bouton Réserver ne présélectionne pas le soin (${meme.sujet})`, { page: '/' });
      if (meme.haut > 200 || meme.haut < -20) R.regarder('rendez-vous', `après Réserver, la section rendez-vous est à ${Math.round(meme.haut)} px du haut`, { page: '/' });
      R.ok('rendez-vous', 1);
    } finally { await ctx.close(); }
  }

  /* Guide, échelle, agenda. */
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/', { waitUntil: 'load' });
      await attendrePret(page);
      await page.click('[data-envie="sonotherapie"]');
      await attendre(300);
      const g = await page.evaluate(() => ({ conseille: document.querySelector('.soin.conseille')?.dataset.soin, texte: document.querySelector('[data-guide-reponse]').textContent }));
      if (g.conseille !== 'sonotherapie' || !/Sonothérapie/.test(g.texte)) R.echec('guide', `le guide ne conseille pas le bon soin (${JSON.stringify(g)})`, { page: '/' });
      const ag = await page.evaluate(() => {
        const jour = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date());
        return [...document.querySelectorAll('[data-date]')].map((li) => ({ d: li.dataset.date, passe: li.classList.contains('passe'), attendu: li.dataset.date < jour }));
      });
      ag.filter((x) => x.passe !== x.attendu).forEach((x) => R.echec('agenda', `${x.d} : statut « passé » faux`, { page: '/' }));
      await page.goto(BASE + '/liberations-point-zero', { waitUntil: 'load' });
      await attendrePret(page);
      await page.fill('#f-echelle', '0');
      await page.dispatchEvent('#f-echelle', 'input');
      await attendre(200);
      const e = await page.evaluate(() => ({ chiffre: document.querySelector('[data-echelle-chiffre]').textContent, etat: document.querySelector('[data-echelle-etat]').textContent }));
      if (e.chiffre !== '0' || !/Point Zéro/.test(e.etat)) R.echec('echelle', `l'échelle ne suit pas la note (${JSON.stringify(e)})`, { page: '/liberations-point-zero' });
      R.ok('guide-echelle-agenda', 1);
    } finally { await ctx.close(); }
  }
}
