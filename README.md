# Retro Radio

Application web statique de radio Internet, optimisée pour mobile. Ouvrez `index.html` pour un aperçu local. Pour installer la PWA, hébergez tous les fichiers statiques à la racine d'un site HTTPS (par exemple GitHub Pages ou Vercel), puis utilisez « Ajouter à l'écran d'accueil » dans le navigateur.

Les stations proviennent de l'API communautaire Radio Browser. Leur disponibilité, les métadonnées et la compatibilité des flux dépendent des diffuseurs et du navigateur. Le service worker met en cache uniquement l'interface : la lecture et la recherche nécessitent Internet. Les favoris sont stockés localement dans le navigateur. Le champ de recherche cherche par nom de station.

Les zones physiques sont mesurées séparément pour les photos 1200×800 et 720×1080 dans `controls.css`. Le volume accepte clic, glissement souris/tactile avec capture du pointeur et clavier (flèches, Home/End). Le réglage utilise le volume du lecteur HTML ; certains navigateurs mobiles imposent leur volume système.

Tests : servir le dossier sur http://127.0.0.1:4173, rendre le paquet `playwright` disponible, puis exécuter `node tests/controls.cjs`. `RADIO_TEST_BROWSER` permet de choisir un exécutable Chromium et `RADIO_TEST_URL` une autre URL. Les tests couvrent sept largeurs de 320 à 1440 px, les six commandes et le volume souris/tactile/clavier. Les réponses Radio Browser et les flux audio sont remplacés par des données déterministes et un WAV local ; ces tests ne garantissent pas la disponibilité des diffuseurs. Des captures `radio-check-*.png` sont produites.
