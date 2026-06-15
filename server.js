const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Base de données temporaire (qui associera les emails Google aux soldes)
const utilisateurs = {
    "Jasedi_User": { solde: 0.00, pubsVues: 0 }
};

let cpmActuelNormale = 1.50; 
let cpmActuelAdulte = 3.50;  

// PAGE D'ACCUEIL
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>Slice Master - Accueil</title>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
        <style>
            body { font-family: sans-serif; background-color: #f4f6f9; text-align: center; padding-top: 80px; margin: 0; }
            
            /* Zone Profil & Solde en haut à gauche */
            .sidebar-gauche { position: absolute; top: 20px; left: 20px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
            .solde-box { background: #2ecc71; color: white; padding: 12px 20px; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-size: 1.1rem; }
            .user-info { background: #34495e; color: white; padding: 8px 15px; border-radius: 6px; font-size: 0.9rem; display: none; }
            
            .btn { display: inline-block; padding: 20px 40px; margin: 20px; font-size: 1.2rem; font-weight: bold; color: white; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 10px rgba(0,0,0,0.1); transition: 0.2s; }
            .btn-normal { background-color: #3498db; }
            .btn-adulte { background-color: #e74c3c; }
            .btn:hover { transform: scale(1.05); }
        </style>
    </head>
    <body>

        <div class="sidebar-gauche">
            <div class="solde-box">
                💰 Mon Solde : <span id="solde-affichage">0.0000</span> €
            </div>
            
            <div id="buttonDiv"></div>
            
            <div id="user-statut" class="user-info"></div>
        </div>

        <h1>Bienvenue sur Slice Master</h1>
        <p>Choisissez le type de flux publicitaire que vous souhaitez lancer :</p>
        <a href="/pubs-classiques" class="btn btn-normal">Flux Classique (Standard)</a>
        <a href="/pubs-adultes" class="btn btn-adulte">Flux Premium (Adulte +18)</a>

        <script>
            let currentUserId = "Jasedi_User"; // Utilisateur par défaut si non connecté

            // Fonction qui reçoit la réponse de Google après connexion
            function handleCredentialResponse(response) {
                // Décodage basique du jeton Google pour avoir les infos du profil
                const base64Url = response.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('0' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const profilGoogle = JSON.parse(jsonPayload);
                
                // On change l'identifiant par l'adresse email de l'utilisateur
                currentUserId = profilGoogle.email;
                
                // On met à jour l'affichage de l'interface
                document.getElementById('user-statut').style.display = 'block';
                document.getElementById('user-statut').innerText = "👤 Connecté : " + profilGoogle.given_name;
                document.getElementById('buttonDiv').style.display = 'none'; // Cache le bouton après connexion
                
                rafraichirSolde();
            }

            window.onload = function () {
                // Initialisation du bouton Google
                // TODO: Il faudra remplacer 'VOTRE_CLIENT_ID_GOOGLE' par ta vraie clé Google Cloud plus tard
                google.accounts.id.initialize({
                    client_id: "VOTRE_CLIENT_ID_GOOGLE.apps.googleusercontent.com",
                    callback: handleCredentialResponse
                });
                google.accounts.id.renderButton(
                    document.getElementById("buttonDiv"),
                    { theme: "outline", size: "medium", text: "signin_with" } 
                );
            }

            function rafraichirSolde() {
                fetch('/api/solde/' + currentUserId)
                    .then(res => res.json())
                    .then(data => {
                        document.getElementById('solde-affichage').innerText = data.solde;
                    });
            }

            setInterval(rafraichirSolde, 3000);
            rafraichirSolde();
        </script>
    </body>
    </html>
    `);
});

// PAGES DES FLUX (INCHANGÉES)
app.get('/pubs-classiques', (req, res) => {
    res.send(`<html><body style="font-family:sans-serif; text-align:center; background:#eef2f3;"><h2>Flux Classique Actif</h2><div style="width:336px; height:280px; background:white; border:3px dashed #3498db; margin:30px auto; display:flex; align-items:center; justify-content:center;"><p style="color:#7f8c8d;">Zone Pub Classique</p></div></body></html>`);
});

app.get('/pubs-adultes', (req, res) => {
    res.send(`<html><body style="font-family:sans-serif; text-align:center; background:#fdf2f2;"><h2 style="color:#e74c3c;">Flux Premium (+18) Actif</h2><div style="width:336px; height:280px; background:white; border:3px dashed #e74c3c; margin:30px auto; display:flex; align-items:center; justify-content:center;"><p style="color:#e74c3c; font-weight:bold;">Zone Pub Haute Rémunération</p></div></body></html>`);
});

// LOGS ET ENREGISTREMENT DES COMPTES
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

app.get('/api/solde/:userId', (req, res) => {
    const userId = req.params.userId;
    const user = utilisateurs[userId] || { solde: 0.00 };
    res.json({ userId, solde: user.solde.toFixed(4) });
});

app.listen(PORT, () => {
    console.log(`Serveur Slice avec Google Auth lancé sur le port ${PORT}`);
});
