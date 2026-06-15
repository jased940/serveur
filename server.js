const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Base de données pour stocker les sessions actives
const utilisateurs = {};

let cpmActuelNormale = 1.50; 

// TA LISTE DE BANNIÈRES CLASSIQUES 
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
        <title>Slice Master - Flux Sécurisé</title>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
        <style>
            body { font-family: sans-serif; background: #f4f6f9; padding: 20px; text-align: center; margin: 0; }
            .header-bar { display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 30px; }
            .solde { font-weight: bold; color: #2ecc71; font-size: 1.3rem; background: #e8f8f5; padding: 8px 15px; border-radius: 20px; }
            .user-section { display: flex; gap: 15px; align-items: center; }
            .btn-logout { background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; display: none; }
            
            .zone-affichage-flex { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; align-items: center; margin: 35px auto; max-width: 1200px; }
            .cadre-pub { background: white; border: 2px dashed #3498db; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 10px; display: inline-flex; align-items: center; justify-content: center; }
        </style>
    </head>
    <body>

        <div class="header-bar">
            <div class="solde">💰 Mon Solde Estimé : <span id="solde-affichage">0.0000</span> €</div>
            <div class="user-section">
                <div id="buttonDiv"></div>
                <span id="user-statut" style="font-weight: 500; display: none;"></span>
                <button id="logoutBtn" class="btn-logout" onclick="deconnexion()">Déconnexion</button>
            </div>
        </div>

        <h2>Plateforme Slice Master — Flux Classique</h2>
        <p style="color: #7f8c8d;">Rafraîchis la page pour charger de nouvelles bannières. Ton solde est sauvegardé !</p>

        <div class="zone-affichage-flex">
            ${htmlPubs}
        </div>

        <script>
            // Récupération de l'identité ou création d'une session de test persistante
            let currentUserId = localStorage.getItem('userId') || "Jasedi_User";
            let userPrenom = localStorage.getItem('userPrenom') || "Invité";
            
            // Sauvegarde locale du solde pour éviter la perte au rafraîchissement
            let soldeLocal = parseFloat(localStorage.getItem('solde_' + currentUserId)) || 0.0000;

            function majInterface() {
                if (currentUserId !== "Jasedi_User") {
                    document.getElementById('buttonDiv').style.style.display = 'none';
                    document.getElementById('user-statut').style.display = 'inline';
                    document.getElementById('user-statut').innerText = "👤 " + userPrenom;
                    document.getElementById('logoutBtn').style.display = 'inline';
                } else {
                    document.getElementById('buttonDiv').style.display = 'block';
                    document.getElementById('user-statut').style.display = 'none';
                    document.getElementById('logoutBtn').style.display = 'none';
                }
                document.getElementById('solde-affichage').innerText = soldeLocal.toFixed(4);
            }

            // Gestion du clic de connexion Google
            function handleCredentialResponse(response) {
                const base64Url = response.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('0' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                const profil = JSON.parse(jsonPayload);
                
                // On bascule sur le vrai compte Google
                currentUserId = profil.email;
                userPrenom = profil.given_name;
                
                localStorage.setItem('userId', currentUserId);
                localStorage.setItem('userPrenom', userPrenom);
                
                // Récupère le solde lié à ce compte Google s'il existe déjà
                soldeLocal = parseFloat(localStorage.getItem('solde_' + currentUserId)) || 0.0000;
                
                majInterface();
                logImpression(); // Valide la vue sur le nouveau compte
            }

            function deconnexion() {
                localStorage.removeItem('userId');
                localStorage.removeItem('userPrenom');
                currentUserId = "Jasedi_User";
                userPrenom = "Invité";
                soldeLocal = parseFloat(localStorage.getItem('solde_Jasedi_User')) || 0.0000;
                majInterface();
            }

            // Calcul et enregistrement du gain au chargement de la page
            function logImpression() {
                fetch('/api/log-impression', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: currentUserId, soldeActuel: soldeLocal })
                })
                .then(res => res.json())
                .then(data => {
                    soldeLocal = data.nouveauSolde;
                    localStorage.setItem('solde_' + currentUserId, soldeLocal); // Sauvegarde dans le navigateur !
                    document.getElementById('solde-affichage').innerText = soldeLocal.toFixed(4);
                });
            }

            window.onload = function () {
                google.accounts.id.initialize({
                    client_id: "TON_CLIENT_ID_GOOGLE_ICI", // <-- METS TON ID CLOUD GOOGLE ICI POUR LE LOGO
                    callback: handleCredentialResponse
                });
                google.accounts.id.renderButton(document.getElementById("buttonDiv"), { theme: "outline", size: "medium" });
                
                majInterface();
                logImpression(); // Gagne de l'argent dès que la page s'actualise !
            };
        </script>
    </body>
    </html>
    `);
});

// ROUTE DU COMPTEUR DE GAINS
app.post('/api/log-impression', (req, res) => {
    const { userId, soldeActuel } = req.body;
    const idClient = userId || "Jasedi_User";
    
    let soldeDeBase = parseFloat(soldeActuel) || 0.0000;
    
    // Ajoute la valeur d'une impression classique
    const partUtilisateur = (cpmActuelNormale / 1000) * 0.70;
    let nouveauSolde = soldeDeBase + partUtilisateur;

    res.json({ success: true, nouveauSolde: nouveauSolde });
});

app.listen(PORT, () => {
    console.log(`Serveur persistant lancé.`);
});
