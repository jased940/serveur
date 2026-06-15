const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const cagnottes = {
    "Jasedi_User": 0.00
};

app.post('/api/log-impression', (req, res) => {
    const { userId, adId, typePub } = req.body; // On récupère le type de pub (normale ou adulte)

    if (!userId) {
        return res.status(400).json({ error: "Utilisateur manquant" });
    }

    if (!cagnottes[userId]) {
        cagnottes[userId] = 0.00;
    }

    // Configuration des gains de base
    let gainTotalPub = 0.002; // Pub normale

    // Si c'est une pub adulte, on booste le gain (par exemple, double)
    if (typePub === "adulte") {
        gainTotalPub = 0.005; // Le CPM est plus haut !
    }

    const partUtilisateur = gainTotalPub * 0.70; // 70% pour l'utilisateur
    cagnottes[userId] += partUtilisateur;

    console.log(`[${typePub ? typePub.toUpperCase() : 'NORMALE'}] ${userId} a vu une pub. +${partUtilisateur.toFixed(4)}€`);
    console.log(`Nouveau solde : ${cagnottes[userId].toFixed(4)}€`);

    res.json({ 
        message: "Impression créditée !", 
        nouveauSolde: cagnottes[userId].toFixed(4) 
    });
});

app.get('/api/solde/:userId', (req, res) => {
    const userId = req.params.userId;
    const solde = cagnottes[userId] || 0.00;
    res.json({ userId, solde: solde.toFixed(4) });
});

app.listen(PORT, () => {
    console.log(`Serveur Slice boosté lancé sur le port ${PORT}`);
});
