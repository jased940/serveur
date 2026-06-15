const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// On fixe ton vrai CPM global Adsterra que tu as vu (0.079 $)
let cpmTotalReel = 0.079; 

// TA LISTE DE BANNIÈRES CLASSIQUES (Strictement tes codes propres)
const listePubsClassiques = [
    `<div class="cadre-pub"><script async="async" data-cfasync="false" src="https://pl29755887.effectivecpmnetwork.com/0c4aec7de1dbfd24dc489c49dbbeed58/invoke.js"></script><div id="container-0c4aec7de1dbfd24dc489c49dbbeed58"></div></div>`,
    `<div class="cadre-pub"><script src="https://pl29755888.effectivecpmnetwork.com/dc/fc/00/dcfc006b10c9d5326ca60c79c48734c5.js"></script></div>`,
    `<div class="cadre-pub"><script type="text/javascript">atOptions = { 'key' : '3c4b9d3350a0a36321339e43f2b58753', 'format' : 'iframe', 'height' : 60, 'width' : 468, 'params' : {} };</script><script src="https://www.highperformanceformat.com/3c4b9d3350a0a36321339e43f2b58753/invoke.js"></script></div>`,
    `<div class="cadre-pub"><script type="text/javascript">atOptions = { 'key' : '10bf4948cf1f53154a13e844be16da7c', 'format' : 'iframe', 'height' : 300, 'width' : 160, 'params' : {} };</script><script src="https://www.highperformanceformat.com/10bf4948cf1f53154a13e844be16da7c/invoke.js"></script></div>`,
    `<div class="cadre-pub"><script type="text/javascript">atOptions = { 'key' : 'b05b1a1e20bfa3cf90a8b1d5f64e558c', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };</script><script src="https://www.highperformanceformat.com/b05b1a1e20bfa3cf90a8b1d5f64e558c/invoke.js"></script></div>`,
    `<div class="cadre-pub"><script type="text/javascript">atOptions = { 'key' : '413409990af4d94ae0983ac152a17618', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };</script><script src="https://www.highperformanceformat.com/413409990af4d94ae0983ac152a17618/invoke.js"></script></div>`,
    `<div class="cadre-pub"><script type="text/javascript">atOptions = { 'key' : '2674947c70efac48b9eeb0f5df20d589', 'format' : 'iframe', 'height' : 600, 'width' : 160, 'params' : {} };</script><script src="https://www.highperformanceformat.com/2674947c70efac48b9eeb0f5df20d589/invoke.js"></script></div>`,
    `<div class="cadre-pub"><script type="text/javascript">atOptions = { 'key' : 'a78e8a7f558059741b744692e636f93b', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };</script><script src="https://www.highperformanceformat.com/a78e8a7f558059741b744692e636f93b/invoke.js"></script></div>`,
    `<div class="cadre-pub"><script src="https://pl29755879.effectivecpmnetwork.com/8f/d5/45/8fd5451c080fad19be8c00d3a1c497d9.js"></script></div>`
];

// PAGE DE DIFFUSION PRINCIPALE
app.get('/', (req, res) => {
    let htmlPubs = "";
    listePubsClassiques.forEach(codeHtml => htmlPubs += codeHtml);

    res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>Slice Master - Mode Cookie Persistant</title>
        <style>
            body { font-family: sans-serif; background: #f4f6f9; padding: 20px; text-align: center; margin: 0; }
            .header-bar { display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 30px; }
            .stats-box { display: flex; gap: 15px; }
            .solde { font-weight: bold; color: #2ecc71; font-size: 1.1rem; background: #e8f8f5; padding: 8px 15px; border-radius: 20px; }
            .solde-admin { font-weight: bold; color: #9b59b6; font-size: 1.1rem; background: #f5eef8; padding: 8px 15px; border-radius: 20px; }
            
            .zone-affichage-flex { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; align-items: center; margin: 35px auto; max-width: 1200px; }
            .cadre-pub { background: white; border: 2px dashed #3498db; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 10px; display: inline-flex; align-items: center; justify-content: center; }
        </style>
    </head>
    <body>

        <div class="header-bar">
            <div class="stats-box">
                <div class="solde">💰 Solde Utilisateur (70%) : <span id="solde-affichage">0.0000</span> $</div>
                <div class="solde-admin">👑 Mes Gains Admin (30%) : <span id="admin-affichage">0.0000</span> $</div>
            </div>
            <div style="color: #7f8c8d; font-weight: bold;">Jasedi_User</div>
        </div>

        <h2>Slice Master — Sauvegarde Automatique par Cookie local</h2>
        <p style="color: #7f8c8d;">Spamme la touche rafraîchir (F5). Tes gains s'accumulent en direct sans jamais retomber à zéro !</p>

        <div class="zone-affichage-flex">
            ${htmlPubs}
        </div>

        <script>
            // CONFIGURATION FINANCIÈRE DIRECTE
            const cpm = ${cpmTotalReel};
            const nbrPubsDeLaPage = 9; // Nombre de bannières chargées à chaque fois
            
            // Calcul mathématique brut d'un rafraîchissement complet de la page
            const valeurBruteUnePub = cpm / 1000;
            const gainTotalPageBrut = valeurBruteUnePub * nbrPubsDeLaPage;
            
            const partUserPourCeChargement = gainTotalPageBrut * 0.70;
            const partAdminPourCeChargement = gainTotalPageBrut * 0.30;

            // RÉCUPÉRATION DES COOKIES LOCAUX (Ce qui évite le reset à zéro)
            let soldeUserSauf = parseFloat(localStorage.getItem('cookie_solde_user')) || 0.00000;
            let soldeAdminSauf = parseFloat(localStorage.getItem('cookie_solde_admin')) || 0.00000;

            // ON AJOUTE L'ARGENT DIRECTEMENT AU CHARGEMENT DE LA PAGE
            soldeUserSauf += partUserPourCeChargement;
            soldeAdminSauf += partAdminPourCeChargement;

            // ON ENREGISTRE TOUT DE SUITE DANS LA MÉMOIRE DU NAVIGATEUR
            localStorage.setItem('cookie_solde_user', soldeUserSauf);
            localStorage.setItem('cookie_solde_admin', soldeAdminSauf);

            // AFFICHAGE À L'ÉCRAN
            document.getElementById('solde-affichage').innerText = soldeUserSauf.toFixed(5);
            document.getElementById('admin-affichage').innerText = soldeAdminSauf.toFixed(5);
        </script>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Serveur Cookie local 70/30 opérationnel.`);
});
