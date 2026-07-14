# Ma Messagerie – Thème Orange & Vert

Application mobile de messagerie instantanée développée avec **React Native** et **Expo**.  
Elle permet d’envoyer des messages texte, des photos et des vidéos, avec une interface soignée aux couleurs orange et vert.

> **Statut du projet :** en cours d’apprentissage et d’amélioration

## Fonctionnalités

- **Liste de conversations** avec avatars colorés (orange & vert).
- **Indicateur de présence** (point vert si le contact est en ligne).
- **Gestes de swipe** :
  - Swipe vers la gauche pour **supprimer** une conversation.
  - Swipe vers la droite pour **archiver** ou **désarchiver**.
- **Section « Archivées »** accessible en bas de la liste.
- **Conversation en temps réel** (données simulées pour l’instant).
  - Saisie fluide avec envoi par touche « Entrée ».
  - Bouton **+** pour joindre une **photo** ou une **vidéo** (galerie / appareil photo).
- **Design orange & vert** cohérent et moderne.


## Technologies utilisées

- [React Native](https://reactnative.dev/) (via Expo)
- [Expo](https://expo.dev/) (SDK 54+)
- [React Navigation](https://reactnavigation.org/) (navigation entre écrans)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) (sélection de médias)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) (swipe et gestes)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) (animations)


## Prérequis

Avant de commencer, assure-toi d’avoir installé :

- [Node.js](https://nodejs.org/) (version LTS recommandée)
- [Git](https://git-scm.com/) (optionnel, pour cloner le projet)
- L’application **Expo Go** sur ton téléphone :
  - [Android (Play Store)](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)


## Mise en place (installation et lancement)

1. **Télécharge ou clone le projet**

   ```bash
   git clone <url-de-ton-depot> MaMessagerie
   cd MaMessagerie
   ```

2. **Si tu n’utilises pas Git, tu peux simplement télécharger le dossier et te placer dedans.**

3. **Installe les dépendances**

    ```bash
    npm install
    ```

4. **Installe les modules Expo nécessaires**

    ```bash
    npx expo install react-native-screens react-native-safe-area-context
    npx expo install @react-navigation/native @react-navigation/native-stack
    npx expo install expo-image-picker react-native-gesture-handler react-native-reanimated
    ```

5. **Configure Reanimated (plugin Babel)**

    Si le fichier babel.config.js n’existe pas, crée-le à la racine avec ce contenu :
    ```js
        module.exports = function(api) {
            api.cache(true);
            return {
                presets: ['babel-preset-expo'],
                plugins: ['react-native-reanimated/plugin'],
            };
        };
    ```

6. **Démarre le serveur de développement**

    ```bash
    npx expo start --clear
    ```
    
    **Remarques** : 
    En cas d'erreur de chargement, vous pouvez taper la commande : 
    
    ```bash
    npx expo start --tunnel
    ```
    ou

    ```bash
    npx expo start --tunnel -c
    ```

7. **Ouvre l’application sur ton téléphone**

    - Lance Expo Go.
    
    - Scanne le QR code affiché dans le terminal (ou dans la page web ouverte).
    
    - L’appli s’affiche instantanément


## Comment utiliser l’application

  - **Voir les conversations :** elles apparaissent sur l’écran d’accueil.
    
  - **Ouvrir une discussion :** tape sur une conversation.
    
  - **Envoyer un message texte :** écris dans le champ en bas, puis appuie sur « Entrée » ou sur le bouton « Envoyer ».
    
  - **Envoyer une photo/vidéo :** appuie sur le bouton +, choisis « Galerie » ou « Appareil photo ».
    
  - **Archiver :** glisse une conversation vers la droite et appuie sur « Archiver ».
    
  - **Supprimer :** glisse une conversation vers la gauche et appuie sur « Supprimer ».
    
  - **Retrouver les conversations archivées :** fais défiler vers le bas de la liste, section « Archivées ». Tu peux les désarchiver ou les supprimer définitivement.


## Améliorations futures

- Sauvegarde des messages dans le cloud (Firebase / Supabase)

- Authentification (connexion / inscription)

- Notifications push

- Profils utilisateur

- Appels audio / vidéo


## Licence
Ce projet est réalisé dans un but éducatif et d’apprentissage. Tu es libre de le modifier et de le partager.

---

**Crée par :** Miryam GAKOSSO
