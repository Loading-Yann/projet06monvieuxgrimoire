const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');
require('dotenv').config({ path: '../.env' }); // Chemin relatif vers le fichier .env

// Configurer le prompt
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fonction pour poser une question dans le terminal
const askQuestion = (question) => new Promise((resolve) => rl.question(question, resolve));

(async () => {
  try {
    // Vérifiez si MONGO_URI est défini
    if (!process.env.MONGO_URI) {
      throw new Error('⚠️  MONGO_URI n\'est pas défini dans le fichier .env');
    }

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connexion à MongoDB réussie.');

    // Définir le modèle utilisateur
    const userSchema = new mongoose.Schema({
      email: { type: String, unique: true, required: true },
      password: { type: String, required: true },
    });
    const User = mongoose.model('User', userSchema);

    // Demander les informations utilisateur
    const email = await askQuestion('Email : ');
    const password = await askQuestion('Mot de passe : ');

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ajouter l'utilisateur
    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();
    console.log('✅ Utilisateur ajouté avec succès.');

    // Déconnexion
    await mongoose.disconnect();
    console.log('🔌 Connexion MongoDB fermée.');
  } catch (err) {
    console.error('❌ Erreur lors de l\'ajout de l\'utilisateur :', err);
    process.exit(1);
  } finally {
    rl.close();
  }
})();
