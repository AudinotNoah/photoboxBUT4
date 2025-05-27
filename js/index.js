import { loadPicture, loadResource } from './photoloader.js';
import { displayPicture, displayCategory, displayComments } from './ui.js';
import { load, next, prev, first, last } from './gallery.js';
import { displayGallery } from './gallery_ui.js';

function getLinks(gallery) {
    return gallery.links || gallery._links || {};
}

function updateNavButtons(gallery) {
    const links = getLinks(gallery);
    document.getElementById('next-page').disabled = !links.next;
    document.getElementById('prev-page').disabled = !links.prev;
    document.getElementById('first-page').disabled = !links.first;
    document.getElementById('last-page').disabled = !links.last;
}

async function getPicture(id) {
    try {
        const picture = await loadPicture(id);
        console.log('Photo data:', picture);
        displayPicture(picture);

        if (picture.links && picture.links.categorie) {
            const category = await loadResource(picture.links.categorie.href);
            displayCategory(category);
        }

        if (picture.links && picture.links.comments) {
            const comments = await loadResource(picture.links.comments.href);
            displayComments(comments);
        }
    } catch (error) {
        console.error('Error in getPicture:', error);
    }
}

function handleHashChange() {
    const id = window.location.hash.substring(1);
    if (id) {
        getPicture(id);
    }
}

window.addEventListener('hashchange', handleHashChange);

if (window.location.hash) {
    handleHashChange();
}

document.getElementById('load-gallery').addEventListener('click', async () => {
    try {
        const gallery = await load();
        console.log('Gallery data:', gallery);
        displayGallery(gallery);
        updateNavButtons(gallery);
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
});

document.getElementById('next-page').addEventListener('click', async () => {
    try {
        const gallery = await next();
        if (gallery) {
            console.log('Gallery data:', gallery);
            displayGallery(gallery);
            updateNavButtons(gallery);
        }
    } catch (error) {
        console.error('Error loading next page:', error);
    }
});

document.getElementById('prev-page').addEventListener('click', async () => {
    try {
        const gallery = await prev();
        if (gallery) {
            console.log('Gallery data:', gallery);
            displayGallery(gallery);
            updateNavButtons(gallery);
        }
    } catch (error) {
        console.error('Error loading previous page:', error);
    }
});

document.getElementById('first-page').addEventListener('click', async () => {
    try {
        const gallery = await first();
        if (gallery) {
            console.log('Gallery data:', gallery);
            displayGallery(gallery);
            updateNavButtons(gallery);
        }
    } catch (error) {
        console.error('Error loading first page:', error);
    }
});

document.getElementById('last-page').addEventListener('click', async () => {
    try {
        const gallery = await last();
        if (gallery) {
            console.log('Gallery data:', gallery);
            displayGallery(gallery);
            updateNavButtons(gallery);
        }
    } catch (error) {
        console.error('Error loading last page:', error);
    }
}); 