const API_PREFIX = 'https://webetu.iutnc.univ-lorraine.fr';

export function displayGallery(gallery) {
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) {
        console.error('Gallery section not found');
        return;
    }

    // Créer le conteneur de la galerie
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'gallery-container';

    // Ajouter chaque photo à la galerie
    gallery.photos.forEach(photoData => {
        const photo = photoData.photo;
        const photoElement = document.createElement('div');
        photoElement.className = 'photo-item';
        photoElement.setAttribute('data-photoId', photo.id);
        
        photoElement.innerHTML = `
            <img src="${API_PREFIX + photo.thumbnail.href}" alt="${photo.titre}">
            <div class="photo-info">
                <h3>${photo.titre}</h3>
            </div>
        `;

        // Ajouter l'événement de clic
        photoElement.addEventListener('click', () => {
            window.location.hash = photo.id;
        });

        galleryContainer.appendChild(photoElement);
    });

    // Vider et mettre à jour la section galerie
    gallerySection.innerHTML = '';
    gallerySection.appendChild(galleryContainer);
} 