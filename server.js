const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Permet à ton extension de communiquer avec le serveur
app.use(cors());
app.use(express.json());

// Message de test quand on va sur l'URL
app.get('/', (req, res) => {
  res.send('Le serveur de Jasedi est en ligne ! 🚀');
});

// Route pour enregistrer une pub vue (impression)
app.post('/api/log-impression', (req, res) => {
  const { userId, adId } = req.body;
  console.log(`Pub vue par l'utilisateur : ${userId} (Pub ID: ${adId})`);
  
  // Ici on calculera et ajoutera les centimes plus tard
  res.status(200).json({ success: true, message: 'Impression enregistrée !' });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
