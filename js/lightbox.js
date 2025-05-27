import { API_BASE_URL, API_PHOTOS_URL, API_URL } from './config.js';
import { loadResource, loadPicture } from './photoloader.js';

export class Lightbox {
    constructor() {
        this.currentPhotoId = null;
        this.photos = [];
        this.currentIndex = -1;
        this.createLightboxElement();
    }

    createLightboxElement() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev">&lt;</button>
                <button class="lightbox-next">&gt;</button>
                <div class="lightbox-image-container">
                    <img src="" alt="">
                    <div class="lightbox-info">
                        <h2></h2>
                        <p class="description"></p>
                        <p class="metadata"></p>
                        <p class="category"></p>
                        <div class="comments">
                            <h3>Commentaires :</h3>
                            <ul></ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.close());
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.showPrevious());
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.showNext());

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.close();
            }
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!document.querySelector('.lightbox')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.showPrevious();
                    break;
                case 'ArrowRight':
                    this.showNext();
                    break;
            }
        });

        this.element = lightbox;
    }

    setPhotos(photos) {
        this.photos = photos;
    }

    show(photoId) {
        this.currentPhotoId = photoId;
        this.currentIndex = this.photos.findIndex(p => {
            const photo = p.photo || p;
            return photo.id === photoId;
        });
        
        if (!document.querySelector('.lightbox')) {
            document.body.appendChild(this.element);
        }

        this.updateContent();
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.element.remove();
        document.body.style.overflow = '';
    }

    showPrevious() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            const photo = this.photos[this.currentIndex].photo || this.photos[this.currentIndex];
            this.currentPhotoId = photo.id;
            this.updateContent();
        }
    }

    showNext() {
        if (this.currentIndex < this.photos.length - 1) {
            this.currentIndex++;
            const photo = this.photos[this.currentIndex].photo || this.photos[this.currentIndex];
            this.currentPhotoId = photo.id;
            this.updateContent();
        }
    }

    async updateContent() {
        const photoData = this.photos[this.currentIndex];
        const photo = photoData.photo || photoData;
        const img = this.element.querySelector('img');
        const title = this.element.querySelector('h2');
        const description = this.element.querySelector('.description');
        const metadata = this.element.querySelector('.metadata');
        const category = this.element.querySelector('.category');
        const commentsList = this.element.querySelector('.comments ul');

        try {
            const photoDetails = await loadResource(`${API_PHOTOS_URL}/${photo.id}`);
            const fullPhoto = photoDetails.photo;
            const links = photoDetails.links;
          
            img.src = API_URL + '/' + fullPhoto.url.href;
            img.alt = fullPhoto.titre;
            title.textContent = fullPhoto.titre;
            description.textContent = fullPhoto.descr || '';
            metadata.textContent = `${fullPhoto.format || 'Image'}, ${fullPhoto.width || ''}x${fullPhoto.height || ''}`;
          
            try {
                const categoryData = await loadResource(links.categorie.href);
                category.textContent = `Catégorie : ${categoryData.categorie.nom}`;
            } catch (error) {
                category.textContent = 'Catégorie non disponible';
                console.error('Erreur lors du chargement de la catégorie :', error);
            }
          
            try {
                const commentsData = await loadResource(links.comments.href);
                const comments = commentsData.comments || [];
                commentsList.innerHTML = comments.length > 0 
                    ? comments.map(comment => `
                        <li>
                            <strong>${comment.pseudo}</strong> : ${comment.content}
                        </li>
                    `).join('')
                    : '<li>Aucun commentaire</li>';
            } catch (error) {
                commentsList.innerHTML = '<li>Impossible de charger les commentaires</li>';
                console.error('Erreur lors du chargement des commentaires :', error);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des détails de la photo :', error);
            title.textContent = 'Erreur de chargement';
            description.textContent = 'Impossible de charger les détails de la photo';
            category.textContent = '';
            commentsList.innerHTML = '';
        }
        

        this.element.querySelector('.lightbox-prev').disabled = this.currentIndex === 0;
        this.element.querySelector('.lightbox-next').disabled = this.currentIndex === this.photos.length - 1;
    }
} 