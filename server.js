const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Base de données pour ton profil de test
const utilisateurs = {
    "Jasedi_User": { solde: 0.00, pubsVues: 0 }
};

let cpmActuelNormale = 1.50; // Taux de base pour tes bannières classiques

// TA LISTE SÉCURISÉE AVEC UNIQUEMENT TES BANNIÈRES CLASSIQUES
const listePubsClassiques = [
    // 1. Script ed58
    `<div class="cadre-pub"><script async="async" data-cfasync="false" src="https://pl29755887.effectivecpmnetwork.com/0c4aec7de1dbfd24dc489c49dbbeed58/invoke.js"></script><div id="container-0c4aec7de1dbfd24dc489c49dbbeed58"></div></div>`,
    
    // 2. Script 34c5
    `<div class="cadre-pub"><script src="https://pl29755888.effectivecpmnetwork.com/dc/fc/00/dcfc006b10c9d5326ca60c79c48734c5.js"></script></div>`,
    
    // 3. Format 468x60
    `<div class="cadre-pub"><script type="text/javascript">atOptions = { 'key' : '3c4b9d3350a0a36321339e43f2b58753', 'format' : 'iframe', 'height' : 60, 'width' : 468, 'params' : {} };</script><script src="https://www.highperformanceformat.com/3c4b9d3350a0a36321339e43f2b58753/invoke.js"></script></div>`,
    
    // 4. Ton nouveau format 160x300
    `<div class="cadre-pub"><script type="text/javascript">atOptions = { 'key' : '10bf4948cf1f53154a13e844be16da7c', 'format' : 'iframe', 'height' : 300, 'width' : 160, 'params' : {} };</script><script src="https://www.highperformanceformat.com/10bf4948cf1f53154a13e844be16da7c/invoke.js"></script></div>`,
    
    // 5. Format Rectangle (300x250)
    `<div class="cadre-pub"><script type="text/javascript">atOptions = { 'key' : 'b05b1a1e20bfa3cf90a8b1d5f64e558c', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };</script><script src="https://www.highperformanceformat.com/b05b1a1e20bfa3cf90a8b1d5f64e558c/invoke.js"></script></div>`,
    
    // 6. Format Mobile (320x50)
    `<div class="cadre-pub"><script type="text/javascript">atOptions = { 'key' : '413409990af4d94ae0983ac152a17618', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };</script><script src="https://www.highperformanceformat.com/413409990af4d94ae0983ac152a17618/invoke.js"></script></div>`,
    
    // 7. Format Gratte-ciel vertical (160x600)
    `<div class="cadre-pub"><script type="text/javascript">atOptions = { 'key' : '2674947c70efac48b9eeb0f5df20d589', 'format' : 'iframe', 'height' : 600, 'width' : 160, 'params' : {} };</script><script src="https://www.highperformanceformat.com/2674947c70efac48b9eeb0f5df20d589/invoke.js"></script></div>`,
    
    // 8. Format Grande Bannière (728x90)
    `<div class="cadre-pub"><script type="text/javascript">atOptions = { 'key' : 'a78e8a7f558059741b744692e636f93b', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };</script><script src="https://www.highperformanceformat.com/a78e8a7f558059741b744692e636f93b/invoke.js"></script></div>`,
    
    // 9. Script 97d9 de fin de liste
    `<div class="cadre-pub"><script src="https://pl29755879.effectivecpmnetwork.com/8f/d5/45/8fd5451c080fad19be8c00d3a1c497d9.js"></script></div>`
];

// PAGE DE DIFFUSION UNIQUE
app.get('/', (req, res) => {
    let htmlPubs = "";
    listePubsClassiques.forEach(codeHtml => {
        htmlPubs += codeHtml;
    });

    res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>Slice Master - Flux Pro</title>
        <style>
            body { font-family: sans-serif; background: #f4f6f9; padding: 20px; text-align: center; margin: 0; }
            .header-bar { display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 30px; }
            .solde { font-weight: bold; color: #2ecc71; font-size: 1.3rem; background: #e8f8f5; padding: 8px 15px; border-radius: 20px; }
            
            /* Alignement propre de toutes tes bannières à l'écran */
            .zone-affichage-flex { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; align-items: center; margin: 35px auto; max-width: 1200px; }
            .cadre-pub { background: white; border: 2px dashed #3498db; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 10px; display: inline-flex; align-items: center; justify-content: center; }
        </style>
    </head>
    <body>

        <div class="header-bar">
            <div class="solde">💰 Mon Solde Estimé : <span id="solde-affichage">0.0000</span> €</div>
            <div style="color: #7f8c8d; font-size: 0.9rem;">Utilisateur : Jasedi_User</div>
        </div>

        <h2>Plateforme Slice Master — Flux Classique Actif</h2>
        <p style="color: #7f8c8d;">Flux sécurisé. Les bannières s'affichent ci-dessous sans blocage.</p>

        <div class="zone-affichage-flex">
            ${htmlPubs}
        </div>

        <script>
            // Ajoute un gain simulé automatique à l'affichage
            function simulerGainImpression() {
                fetch('/api/log-impression', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: "Jasedi_User" })
                });
            }

            function rafraichirSolde() {
                fetch('/api/solde/Jasedi_User')
                    .then(res => res.json())
                    .then(data => {
                        document.getElementById('solde-affichage').innerText = data.solde;
                    });
            }

            // Exécution au chargement
            simulerGainImpression();
            setInterval(rafraichirSolde, 2000);
        </script>
    </body>
    </html>
    `);
});

// ROUTE DES LOGS D'IMPRESSIONS
app.post('/api/log-impression', (req, res) => {
    const partUtilisateur = (cpmActuelNormale / 1000) * 0.70;
    utilisateurs["Jasedi_User"].solde += partUtilisateur;
    utilisateurs["Jasedi_User"].pubsVues += 1;
    res.json({ success: true });
});

// ROUTE DU SOLDE
app.get('/api/solde/:userId', (req, res) => {
    const user = utilisateurs["Jasedi_User"];
    res.json({ solde: user.solde.toFixed(4) });
});

app.listen(PORT, () => {
    console.log(`Serveur 100% Classique mis à jour.`);
});
