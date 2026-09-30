/* =====================================================================
   MAILLOT ZONE : contenu du site. C'est le seul fichier à modifier.
   - Ajouter un maillot : mets la photo dans assets/maillots/ puis copie une ligne.
   - categorie : "club", "selection" ou "special"
   - fond : couleur de fond de la photo (pour que la carte se fonde avec l'image)
   - description (facultatif) : une ou deux phrases, affichées sous le maillot
   ===================================================================== */
window.MZ = {
  telephone: "+229 01 57 98 80 89",
  whatsapp: "2290157988089",
  instagram: "maillot_zone_",

  /* Maillots du grand présentoir en haut de page (dans l'ordre d'apparition).
     - image : photo sur fond BLANC PUR (le blanc disparaît dans le décor).
       Remplace-la par ton rendu Nano Banana quand tu l'as.
     - rotation (optionnel) : images extraites d'une vidéo Veo 3 de 360°,
       ex. rotation: { dossier: "assets/rotation/psg/", images: 96 }
       → le maillot fait un vrai tour complet pendant le défilement. */
  vedettes: [
    { id: "psg-domicile-hechter", image: "assets/rotation/psg-domicile-hechter/001.webp", rotation: { dossier: "assets/rotation/psg-domicile-hechter/", images: 72 } },
    { id: "bresil-domicile-retro", image: "assets/rotation/bresil-domicile-retro/001.webp", rotation: { dossier: "assets/rotation/bresil-domicile-retro/", images: 72 } },
    { id: "man-city-domicile", image: "assets/rotation/man-city-domicile/001.webp", rotation: { dossier: "assets/rotation/man-city-domicile/", images: 72 } },
    { id: "atletico-domicile", image: "assets/rotation/atletico-domicile/001.webp", rotation: { dossier: "assets/rotation/atletico-domicile/", images: 72 } },
    { id: "inter-miami-domicile", image: "assets/rotation/inter-miami-domicile/001.webp", rotation: { dossier: "assets/rotation/inter-miami-domicile/", images: 72 } }
  ],

  /* Tous les maillots de la collection */
  maillots: [
  { id: "france-exterieur", equipe: "France", version: "Extérieur", categorie: "selection", image: "assets/maillots/france-exterieur.jpg", fond: "#ffffff" },
  { id: "om-domicile", equipe: "Olympique de Marseille", version: "Domicile", categorie: "club", image: "assets/maillots/om-domicile.jpg", fond: "#f1f1f1" },
  { id: "psg-domicile-hechter", equipe: "PSG", version: "Domicile Hechter", categorie: "club", image: "assets/maillots/psg-domicile-hechter-rendu.jpg", fond: "#ffffff",
    description: "Le bleu et rouge du Parc, avec la bande Hechter héritée des années 70." },
  { id: "france-domicile-rayures", equipe: "France", version: "Domicile rayé", categorie: "selection", image: "assets/maillots/france-domicile-rayures.jpg", fond: "#afada9" },
  { id: "man-city-domicile", equipe: "Manchester City", version: "Domicile", categorie: "club", image: "assets/maillots/man-city-domicile-rendu.jpg", fond: "#ffffff",
    description: "Le bleu ciel des Citizens, avec son léger dégradé et le sponsor Etihad." },
  { id: "portugal-exterieur", equipe: "Portugal", version: "Extérieur", categorie: "selection", image: "assets/maillots/portugal-exterieur.jpg", fond: "#ffffff" },
  { id: "jamaique-domicile", equipe: "Jamaïque", version: "Domicile", categorie: "selection", image: "assets/maillots/jamaique-domicile.jpg", fond: "#f5f5f5" },
  { id: "real-madrid-domicile", equipe: "Real Madrid", version: "Domicile", categorie: "club", image: "assets/maillots/real-madrid-domicile.jpg", fond: "#ece9ea" },
  { id: "barca-exterieur", equipe: "FC Barcelone", version: "Extérieur", categorie: "club", image: "assets/maillots/barca-exterieur.jpg", fond: "#c0beb6" },
  { id: "man-city-exterieur", equipe: "Manchester City", version: "Extérieur", categorie: "club", image: "assets/maillots/man-city-exterieur.jpg", fond: "#ffffff" },
  { id: "celtic-domicile", equipe: "Celtic", version: "Domicile", categorie: "club", image: "assets/maillots/celtic-domicile.jpg", fond: "#ffffff" },
  { id: "cote-divoire-exterieur", equipe: "Côte d'Ivoire", version: "Extérieur", categorie: "selection", image: "assets/maillots/cote-divoire-exterieur.jpg", fond: "#727375" },
  { id: "bresil-domicile-retro", equipe: "Brésil", version: "Domicile rétro", categorie: "selection", image: "assets/maillots/bresil-domicile-retro-rendu.jpg", fond: "#ffffff",
    description: "Le jaune de la Seleção en version rétro, pour les amoureux du jogo bonito." },
  { id: "inter-miami-domicile", equipe: "Inter Miami", version: "Domicile", categorie: "special", image: "assets/maillots/inter-miami-domicile-rendu.jpg", fond: "#ffffff",
    description: "Le rose du club de Floride, devenu culte depuis l'arrivée de Messi." },
  { id: "senegal-exterieur", equipe: "Sénégal", version: "Extérieur", categorie: "selection", image: "assets/maillots/senegal-exterieur.jpg", fond: "#3767a0" },
  { id: "algerie-domicile", equipe: "Algérie", version: "Domicile", categorie: "selection", image: "assets/maillots/algerie-domicile.jpg", fond: "#ffffff" },
  { id: "psg-third", equipe: "PSG", version: "Third", categorie: "club", image: "assets/maillots/psg-third.jpg", fond: "#ffffff" },
  { id: "cote-divoire-domicile", equipe: "Côte d'Ivoire", version: "Domicile", categorie: "selection", image: "assets/maillots/cote-divoire-domicile.jpg", fond: "#f6f6f6" },
  { id: "france-domicile", equipe: "France", version: "Domicile", categorie: "selection", image: "assets/maillots/france-domicile.jpg", fond: "#f8f8f8" },
  { id: "bresil-exterieur", equipe: "Brésil", version: "Extérieur", categorie: "selection", image: "assets/maillots/bresil-exterieur.jpg", fond: "#bab8b0" },
  { id: "pays-bas-exterieur", equipe: "Pays-Bas", version: "Extérieur", categorie: "selection", image: "assets/maillots/pays-bas-exterieur.jpg", fond: "#ffffff" },
  { id: "egypte-exterieur", equipe: "Égypte", version: "Extérieur", categorie: "selection", image: "assets/maillots/egypte-exterieur.jpg", fond: "#696760" },
  { id: "atletico-domicile", equipe: "Atlético de Madrid", version: "Domicile", categorie: "club", image: "assets/maillots/atletico-domicile-rendu.jpg", fond: "#ffffff",
    description: "Les rayures rouges et blanches des Colchoneros, un classique de la Liga." },
  { id: "ajax-exterieur", equipe: "Ajax", version: "Extérieur", categorie: "club", image: "assets/maillots/ajax-exterieur.jpg", fond: "#655e61" },
  { id: "psg-domicile", equipe: "PSG", version: "Domicile", categorie: "club", image: "assets/maillots/psg-domicile.jpg", fond: "#ffffff" },
  { id: "man-city-third", equipe: "Manchester City", version: "Third", categorie: "club", image: "assets/maillots/man-city-third.jpg", fond: "#f7f7f7" },
  { id: "santos-third", equipe: "Santos", version: "Third", categorie: "special", image: "assets/maillots/santos-third.jpg", fond: "#a19e9c" },
  { id: "barca-domicile", equipe: "FC Barcelone", version: "Domicile", categorie: "club", image: "assets/maillots/barca-domicile.jpg", fond: "#94939a" },
  { id: "al-nassr-domicile", equipe: "Al-Nassr", version: "Domicile", categorie: "special", image: "assets/maillots/al-nassr-domicile.jpg", fond: "#bcad99" },
  { id: "ac-milan-domicile", equipe: "AC Milan", version: "Domicile", categorie: "club", image: "assets/maillots/ac-milan-domicile.jpg", fond: "#9a8571" },
  { id: "liverpool-exterieur", equipe: "Liverpool", version: "Extérieur", categorie: "club", image: "assets/maillots/liverpool-exterieur.jpg", fond: "#405d23" },
  ]
};
