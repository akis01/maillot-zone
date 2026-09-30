# Maillot Zone · site vitrine

Site vitrine d'une boutique de maillots de foot au Bénin : présentoir qui fait tourner de vrais maillots au défilement, vitrine 360°, collection filtrable et prise de rendez-vous par WhatsApp.

**Stack :** HTML · CSS · JavaScript · GSAP ScrollTrigger (animations au défilement). Aucune installation, aucun build.

## Modifier le contenu

Tout se trouve dans **`products.js`** :
- `telephone`, `whatsapp`, `instagram` : les coordonnées de la boutique ;
- `vedettes` : les maillots du grand présentoir en haut de page, dans l'ordre ;
- `maillots` : une ligne par maillot de la collection. Pour en ajouter un, mets la photo dans `assets/maillots/` et copie une ligne en changeant `equipe`, `version`, `categorie` (`club`, `selection` ou `special`), `image` et `fond` (la couleur de fond de la photo, par exemple `#ffffff`).

## Sections

1. **Présentoir** : chaque maillot vedette pivote, fait un demi-tour et laisse place au suivant pendant le défilement. Sous le maillot, une fiche indique l'équipe, la version et un bouton « Demander ce maillot » qui ouvre WhatsApp avec le message déjà écrit.
2. **Bandeau** des équipes disponibles.
3. **Vitrine 360°** : 12 maillots en anneau, qui tourne au défilement.
4. **Collection** : les 31 maillots avec des filtres. Chaque maillot s'ouvre en grand.
5. **Commander** : les 3 étapes.
6. **Rendez-vous** : un formulaire qui prépare le message WhatsApp, plus le téléphone et l'Instagram.

## Rendus 3D avec Nano Banana et Veo 3

Le présentoir accepte deux niveaux de rendu :
- **une image** par maillot, sur fond blanc pur : le blanc disparaît dans le décor ;
- **une vidéo de rotation à 360°** : elle est découpée en images, et le maillot fait un vrai tour complet au rythme du défilement.

### 1. Rendu produit (Nano Banana, dans Gemini)

Joins la photo du maillot et utilise ce prompt :

```
Recreate this exact football jersey as a premium e-commerce product photo: the jersey worn by an invisible ghost mannequin, seen from the front, perfectly centered, filling about 80% of a square 1:1 frame. Pure white seamless background (#FFFFFF), soft even studio lighting, realistic fabric texture and natural folds, a very soft shadow under the jersey. Keep every detail identical to the original photo: colors, stripes, crest, sponsor, logos, collar and sleeves. No hanger, no visible mannequin, no text, no watermark.
```

### 2. Rotation 360° (Veo 3, dans Gemini)

Joins le rendu obtenu à l'étape 1 et utilise ce prompt :

```
Product turntable video. The football jersey from the image, worn by an invisible ghost mannequin, rotates slowly and smoothly 360 degrees on the spot, exactly one full turn at constant speed, ending where it started. Static locked-off camera: no zoom, no pan, no camera movement. The jersey stays perfectly centered and the same size the whole time. Pure white seamless studio background, soft studio lighting, photorealistic fabric. No people, no text, no added logos, no music.
```

Format : 16:9 conseillé (le maillot tient entièrement dans le carré central). En 9:16, ajoute au prompt : « Leave generous empty white space above and below the jersey; the whole jersey must stay inside the central square of the frame. »

Veo n'a jamais vu le dos du maillot : il l'invente. Vérifie le résultat et relance si le dos ne ressemble pas au vrai.

### 3. Intégration

- Image : remplace le chemin `image` de la vedette dans `products.js`.
- Vidéo : découpe-la en images numérotées `001.webp`, `002.webp`… dans `assets/rotation/<maillot>/`, puis ajoute par exemple `rotation: { dossier: "assets/rotation/psg/", images: 96 }` à la vedette. Pour découper la vidéo :

```
ffmpeg -i psg.mp4 -vf "fps=12,crop=min(iw\,ih):min(iw\,ih),scale=720:720" -c:v libwebp -quality 78 assets/rotation/psg/%03d.webp
```

## Mettre en ligne sur Cloudflare Pages

1. Dans le tableau de bord Cloudflare : **Workers & Pages → Créer → Pages → Importer un dépôt Git**, puis choisis ce dépôt.
2. Réglages de build : **Framework preset : None**, **commande de build : laisser vide**, **répertoire de sortie : `/`**.
3. **Enregistrer et déployer.** Le site est en ligne sur `https://<nom-du-projet>.pages.dev`, et chaque `git push` le met à jour.

## Sécurité

Déjà en place dans le code (fonctionne aussi sur l'adresse `pages.dev`) :
- **`_headers`** : politique de sécurité du contenu (CSP) stricte, qui n'autorise que les scripts du site et de cdnjs ; protection contre l'affichage du site dans une autre page (clickjacking) ; HTTPS forcé (HSTS) ; pas de détection du type des fichiers (`nosniff`) ; caméra, micro et localisation désactivés ; images non affichables par d'autres sites (anti-hotlink).
- **SRI** : les scripts GSAP chargés depuis le CDN sont vérifiés par leur empreinte ; s'ils étaient modifiés, le navigateur refuserait de les exécuter.
- **Page 404** propre au lieu d'une page par défaut.
- Le site est 100 % statique : pas de base de données, pas de connexion, pas de formulaire envoyé à un serveur. Il n'y a donc presque rien à attaquer.

Fourni par Cloudflare sans rien faire : HTTPS, CDN mondial, protection DDoS automatique.

Avec un **nom de domaine à toi géré par Cloudflare** (par exemple `maillotzone.com`), tu débloques en plus, gratuitement :
- **Security → Bots → Bot Fight Mode** : bloque les robots malveillants ;
- **Security → Bots → Block AI bots** : bloque les robots qui aspirent le contenu pour entraîner des IA ;
- **Security → WAF** : règles de pare-feu (par exemple bloquer les pays ou les chemins que visent les scanners, comme `/wp-admin`) et limitation du nombre de requêtes ;
- **Scrape Shield → Hotlink Protection** et **Email Address Obfuscation** ;
- le mode **« Under Attack »** en cas d'attaque.
