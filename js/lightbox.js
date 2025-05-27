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
                        <div class="category"></div>
                        <div class="comments">
                            <h4 style="margin:0.5em 0 0.2em 0; color:#4CAF50; font-size:1em;">Ajouter un commentaire</h4>
                            <form class="add-comment-form" style="margin-bottom: 1em; max-width: 100%;">
                                <div class="form-row">
                                    <input type="text" name="pseudo" placeholder="Votre pseudo" required style="width: 32%; font-size: 0.9em; margin-right: 2%;">
                                    <input type="text" name="titre" placeholder="Titre" required style="width: 32%; font-size: 0.9em; margin-right: 2%;">
                                    <button type="submit" style="width: 30%; font-size: 0.9em; padding: 0.3em 0.5em;">Envoyer</button>
                                </div>
                                <textarea name="content" placeholder="Votre commentaire" required style="width: 100%; font-size: 0.9em; margin-top: 0.3em;"></textarea>
                                <div class="comment-message" style="color:#4CAF50;margin-top:0.5em;"></div>
                            </form>
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

        lightbox.addEventListener('submit', async (e) => {
            if (e.target.classList.contains('add-comment-form')) {
                e.preventDefault();
                const form = e.target;
                const pseudo = form.pseudo.value.trim();
                const titre = form.titre.value.trim();
                const content = form.content.value.trim();
                const messageDiv = form.querySelector('.comment-message');
                messageDiv.textContent = '';
                if (!pseudo || !titre || !content) {
                    messageDiv.textContent = 'Tous les champs sont obligatoires.';
                    messageDiv.style.color = 'red';
                    return;
                }
                try {
                    const photoId = this.currentPhotoId;
                    const response = await fetch(`${API_PHOTOS_URL}/${photoId}/comments`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=utf8'
                        },
                        credentials: 'include',
                        body: JSON.stringify({ pseudo, titre, content })
                    });
                    if (response.status === 201) {
                        messageDiv.textContent = 'Commentaire ajouté !';
                        messageDiv.style.color = '#4CAF50';
                        form.reset();
                        await this.updateContent();
                    } else {
                        const err = await response.json();
                        messageDiv.textContent = err.message || 'Erreur lors de l\'ajout du commentaire.';
                        messageDiv.style.color = 'red';
                    }
                } catch (error) {
                    messageDiv.textContent = 'Erreur lors de l\'ajout du commentaire.';
                    messageDiv.style.color = 'red';
                }
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
                const comments = (commentsData.comments || []).slice().reverse();
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