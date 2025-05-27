import { Lightbox } from './lightbox.js';
import { API_URL } from './config.js';

let lightbox = null;

export function displayGallery(gallery) {
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) {
        console.error('Gallery section not found');
        return;
    }

    if (!lightbox) {
        lightbox = new Lightbox();
    }
    
    lightbox.setPhotos(gallery.photos.map(item => item.photo));

    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'gallery-container';

    gallery.photos.forEach(photoData => {
        const photo = photoData.photo;
        const photoElement = document.createElement('div');
        photoElement.className = 'photo-item';
        photoElement.setAttribute('data-photoId', photo.id);
        
        photoElement.innerHTML = `
            <img src="${API_URL + photo.thumbnail.href}" alt="${photo.titre}">
            <div class="photo-info">
                <h3>${photo.titre}</h3>
            </div>
        `;

        photoElement.addEventListener('click', () => {
            lightbox.show(photo.id);
        });

        galleryContainer.appendChild(photoElement);
    });

    gallerySection.innerHTML = '';
    gallerySection.appendChild(galleryContainer);
} 