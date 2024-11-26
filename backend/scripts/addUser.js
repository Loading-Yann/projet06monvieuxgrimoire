const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

(async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect('mongodb+srv://admin:bwMdRtcpFC7a4bMZ@cluster0.gdm7h.mongodb.net/monvieuxgrimoire_test?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connexion à MongoDB réussie.');

    // Définir le modèle utilisateur
    const userSchema = new mongoose.Schema({
      _id: String,
      email: String,
      password: String,
    });
    const User = mongoose.model('User', userSchema);

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash('password', 10);

    // Ajouter l'utilisateur
    const user = new User({
      _id: "fakeUserId123",
      email: "test@example.com",
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
  }
})();
