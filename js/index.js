import { loadPicture, loadResource } from './photoloader.js';
import { displayPicture, displayCategory, displayComments } from './ui.js';

async function getPicture(id) {
    try {
        // Charger les données de la photo
        const picture = await loadPicture(id);
        console.log('Photo data:', picture);
        displayPicture(picture);

        // Charger et afficher la catégorie
        if (picture.links && picture.links.categorie) {
            const category = await loadResource(picture.links.categorie.href);
            displayCategory(category);
        }

        // Charger et afficher les commentaires
        if (picture.links && picture.links.comments) {
            const comments = await loadResource(picture.links.comments.href);
            displayComments(comments);
        }
    } catch (error) {
        console.error('Error in getPicture:', error);
    }
}

// Gérer le hash dans l'URL
function handleHashChange() {
    const id = window.location.hash.substring(1);
    if (id) {
        getPicture(id);
    }
}

// Écouter les changements de hash
window.addEventListener('hashchange', handleHashChange);

// Charger la photo initiale si un hash est présent
if (window.location.hash) {
    handleHashChange();
} 