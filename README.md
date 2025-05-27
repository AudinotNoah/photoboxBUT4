# Galerie Photo - TD6 JS

Ce projet est une galerie photo web réalisée en JavaScript (TD6 - Programmation Web).

## Fonctionnalités principales

- Affichage d'une galerie de photos (vignettes)
- Navigation entre les pages de la galerie (première, précédente, suivante, dernière)
- Affichage d'une photo en grand format (lightbox)
- Affichage des détails d'une photo : titre, description, format, dimensions
- Affichage de la catégorie et des commentaires associés à chaque photo

## Lancement du projet

1. Cloner ou télécharger ce dépôt sur votre machine.
2. Ouvrir un terminal dans le dossier du projet.
3. Lancer un serveur local (exemple avec http-server) :
   ```
   npx http-server . -p 8080
   ```
4. Ouvrir votre navigateur à l'adresse : [http://localhost:8080](http://localhost:8080)

## Structure principale

- `index.html` : page principale
- `js/` : scripts JavaScript (modules)
- `css/` : styles

## Dépendances

Aucune dépendance externe, tout est en JS natif (ES modules).

## Remarques

- L'accès à l'API nécessite d'être sur le réseau de l'IUT ou d'utiliser le VPN.
- Le code est organisé en modules pour la clarté et la réutilisabilité.
