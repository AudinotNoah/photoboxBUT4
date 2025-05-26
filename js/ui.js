export function displayPicture(picture) {
    const photoSection = document.getElementById('la_photo');
    const photoData = picture.photo;
    photoSection.innerHTML = `
        <h2>${photoData.titre}</h2>
        <img src="${photoData.url.href}" alt="${photoData.titre}">
        <p>Type: ${photoData.type}</p>
        <p>Format: ${photoData.format}, ${photoData.width}x${photoData.height}</p>
        <p>${photoData.descr}</p>
    `;
}

export function displayCategory(category) {
    const categorySection = document.getElementById('la_categorie');
    categorySection.textContent = `Catégorie : ${category.name}`;
}

export function displayComments(comments) {
    const commentsList = document.getElementById('les_commentaires');
    commentsList.innerHTML = comments.map(comment => `
        <li>
            <p>${comment.content}</p>
            <small>Par: ${comment.author}</small>
        </li>
    `).join('');
} 