import { API_URL } from './config.js';

export function displayPicture(picture) {
    const photoSection = document.getElementById('la_photo');
    const photoData = picture.photo;
    photoSection.innerHTML = `
        <h2>${photoData.titre}</h2>
        <img src="${API_URL + photoData.url.href}" alt="${photoData.titre}">
        <p>Type: ${photoData.type}</p>
        <p>Format: ${photoData.format}, ${photoData.width}x${photoData.height}</p>
        <p>${photoData.descr}</p>
        <h4 id="la_categorie"></h4>
        <ul id="les_commentaires"></ul>
    `;
}

export function displayCategory(category) {
    const categorySection = document.getElementById('la_categorie');
    if (categorySection) {
        categorySection.textContent = `Catégorie : ${category.categorie.nom}`;
    }
}

export function displayComments(comments) {
    const commentsList = document.getElementById('les_commentaires');
    console.log('Commentaires reçus :', comments);
    // Cherche un tableau dans comments
    let arr = Array.isArray(comments) ? comments : (comments.comments || comments.items || []);
    commentsList.innerHTML = arr.map(comment => `
        <li>
            (${comment.pseudo}) ${comment.content}
        </li>
    `).join('');
} 