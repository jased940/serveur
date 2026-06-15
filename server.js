const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Base de données temporaire pour stocker les soldes par utilisateur
const utilisateurs = {
    "Jasedi_User": { solde: 0.00, pubsVues: 0 }
};

let cpmActuelNormale = 1.50; 
let cpmActuelAdulte = 4.50; // CPM boosté pour le flux +18

// Fonction qui génère le code HTML commun pour les pages de pubs
function genererPagePub(titre, typeFlux, couleurBordure, codePubRegie) {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>${titre}</title>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
        <style>
            body { font-family: sans-serif; background: #f4f6f9; padding: 20px; text-align: center; }
            .header-bar { display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 30px; }
            .solde { font-weight: bold; color: #2ecc71; font-size: 1.2rem; }
            .user-section { display: flex; gap: 15px; align-items: center; }
            .btn-logout { background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; display: none; }
            .zone-pub { background: white; border: 3px dashed ${couleurBordure}; margin: 40px auto; padding: 20px; display: inline-block; border-radius: 8px; min-width: 320px; min-height: 250px; }
            .lien-retour { display: inline-block; margin-top: 20px; color: #7f8c8d; text-decoration: none; }
        </style>
    </head>
    <body>

        <div class="header-bar">
            <div class="solde">💰 Solde : <span id="solde-affichage">0.0000</span> €</div>
            <div class="user-section">
                <div id="buttonDiv"></div>
                <span id="user-statut" style="font-weight: 500; display: none;"></span>
                <button id="logoutBtn" class="btn-logout" onclick="deconnexion()">Déconnexion</button>
            </div>
        </div>

        <h2>${titre} en cours de diffusion...</h2>

        <div class="zone-pub">
            ${codePubRegie}
        </div>

        <br>
        <a href="/" class="lien-retour">← Retour à l'accueil</a>

        <script>
            let currentUserId = localStorage.getItem('userId') || "Jasedi_User";
            let userPrenom = localStorage.getItem('userPrenom') || "";

            function majInterface() {
                if (currentUserId !== "Jasedi_User") {
                    document.getElementById('buttonDiv').style.display = 'none';
                    document.getElementById('user-statut').style.display = 'inline';
                    document.getElementById('user-statut').innerText = "👤 Profil : " + userPrenom;
                    document.getElementById('logoutBtn').style.display = 'inline';
                } else {
                    document.getElementById('buttonDiv').style.display = 'block';
                    document.getElementById('user-statut').style.display = 'none';
                    document.getElementById('logoutBtn').style.display = 'none';
                }
                rafraichirSolde();
            }

            function handleCredentialResponse(response) {
                const base64Url = response.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('0' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                const profil = JSON.parse(jsonPayload);
                
                currentUserId = profil.email;
                userPrenom = profil.given_name;
                
                localStorage.setItem('userId', currentUserId);
                localStorage.setItem('userPrenom', userPrenom);
                
                majInterface();
            }

            function deconnexion() {
                localStorage.removeItem('userId');
                localStorage.removeItem('userPrenom');
                currentUserId = "Jasedi_User";
                userPrenom = "";
                majInterface();
            }

            window.onload = function () {
                google.accounts.id.initialize({
                    client_id: "VOTRE_CLIENT_ID_GOOGLE.apps.googleusercontent.com",
                    callback: handleCredentialResponse
                });
                google.accounts.id.renderButton(document.getElementById("buttonDiv"), { theme: "outline", size: "medium" });
                majInterface();
            };

            function rafraichirSolde() {
                fetch('/api/solde/' + currentUserId)
                    .then(res => res.json())
                    .then(data => {
                        document.getElementById('solde-affichage').innerText = data.solde;
                    });
            }

            // Simuler une vue publicitaire automatique toutes les 10 secondes pour le site ouvert en arrière-plan
            setInterval(() => {
                fetch('/api/log-impression', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: currentUserId, typePub: "${typeFlux}" })
                }).then(() => rafraichirSolde());
            }, 10000);

            setInterval(rafraichirSolde, 3000);
        </script>
    </body>
    </html>
    `;
}

// 1. PAGE D'ACCUEIL SIMPLE (TEXTE + DEUX LIENS SIMPLES)
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>Slice Master - Accueil</title>
        <style>
            body { font-family: sans-serif; background-color: #f4f6f9; text-align: center; padding-top: 100px; }
            .liens-container { margin-top: 30px; font-size: 1.2rem; }
            .lien-flux { display: block; margin: 15px; color: #2c3e50; font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>Bienvenue sur la plateforme Slice Master</h1>
        <p>Veuillez choisir le lien du flux publicitaire que vous souhaitez afficher :</p>
        
        <div class="liens-container">
            <a href="/pubs-classiques" class="lien-flux">Accéder au Flux de Publicités Classiques</a>
            <a href="/pubs-adultes" class="lien-flux" style="color: #e74c3c;">Accéder au Flux de Publicités Premium (+18)</a>
        </div>
    </body>
    </html>
    `);
});

// 2. PAGE FLUX CLASSIQUE (En attente de tes 10 codes propres)
app.get('/pubs-classiques', (req, res) => {
    res.send(genererPagePub("Flux Classique Standard", "normale", "#3498db", "<p style='color:#7f8c8d;'>En attente des 10 codes classiques...</p>"));
});

// 3. PAGE FLUX ADULTE (Tes codes haute rémunération injectés ici !)
app.get('/pubs-adultes', (req, res) => {
    const codesAdultes = `
        <script src="https://pl29755879.effectivecpmnetwork.com/8f/d5/45/8fd5451c080fad19be8c00d3a1c497d9.js"></script>
        <script async="async" data-cfasync="false" src="https://pl29755887.effectivecpmnetwork.com/0c4aec7de1dbfd24dc489c49dbbeed58/invoke.js"></script>
        <div id="container-0c4aec7de1dbfd24dc489c49dbbeed58"></div>
        <script src="https://pl29755888.effectivecpmnetwork.com/dc/fc/00/dcfc006b10c9d5326ca60c79c48734c5.js"></script>
        <script>
            atOptions = { 'key' : '3c4b9d3350a0a36321339e43f2b58753', 'format' : 'iframe', 'height' : 60, 'width' : 468, 'params' : {} };
        </script>
        <script src="https://www.highperformanceformat.com/3c4b9d3350a0a36321339e43f2b58753/invoke.js"></script>
        <script>
            atOptions = { 'key' : '10bf4948cf1f53154a13e844be16da7c', 'format' : 'iframe', 'height' : 300, 'width' : 160, 'params' : {} };
        </script>
        <script src="https://www.highperformanceformat.com/10bf4948cf1f53154a13e844be16da7c/invoke.js"></script>
        <script>
            atOptions = { 'key' : '413409990af4d94ae0983ac152a17618', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };
        </script>
        <script src="https://www.highperformanceformat.com/413409990af4d94ae0983ac152a17618/invoke.js"></script>
        <script>
            atOptions = { 'key' : 'b05b1a1e20bfa3cf90a8b1d5f64e558c', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };
        </script>
        <script src="https://www.highperformanceformat.com/b05b1a1e20bfa3cf90a8b1d5f64e558c/invoke.js"></script>
        <script>
            atOptions = { 'key' : '2674947c70efac48b9eeb0f5df20d589', 'format' : 'iframe', 'height' : 600, 'width' : 160, 'params' : {} };
        </script>
        <script src="https://www.highperformanceformat.com/2674947c70efac48b9eeb0f5df20d589/invoke.js"></script>
        <script>
            atOptions = { 'key' : 'a78e8a7f558059741b744692e636f93b', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };
        </script>
        <script src="https://www.highperformanceformat.com/a78e8a7f558059741b744692e636f93b/invoke.js"></script>
    `;
    res.send(genererPagePub("Flux Premium Adulte", "adulte", "#e74c3c", codesAdultes));
});

// ROUTE DES LOGS D'IMPRESSIONS
app.post('/api/log-impression', (req, res) => {
    const { userId, typePub } = req.body;
    const idAUtiliser = userId || "Jasedi_User";

    if (!utilisateurs[idAUtiliser]) {
        utilisateurs[idAUtiliser] = { solde: 0.00, pubsVues: 0 };
    }

    let cpmApplique = typePub === "adulte" ? cpmActuelAdulte : cpmActuelNormale;
    const partUtilisateur = (cpmApplique / 1000) * 0.70;

    utilisateurs[idAUtiliser].solde += partUtilisateur;
    utilisateurs[idAUtiliser].pubsVues += 1;

    res.json({ message: "Gain validé !", soldeActuel: utilisateurs[idAUtiliser].solde.toFixed(4) });
});

// ROUTE DU SOLDE
app.get('/api/solde/:userId', (req, res) => {
    const userId = req.params.userId;
    const user = utilisateurs[userId] || { solde: 0.00 };
    res.json({ userId, solde: user.solde.toFixed(4) });
});

app.listen(PORT, () => {
    console.log(`Serveur Slice publicitaire opérationnel sur le port ${PORT}`);
});
