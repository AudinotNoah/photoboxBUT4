import { API_BASE_URL } from './config.js';

const API_PREFIX = 'https://webetu.iutnc.univ-lorraine.fr';

export async function loadPicture(idPicture) {
    try {
        const response = await fetch(`${API_BASE_URL}/photos/${idPicture}`, {
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading picture:', error);
        throw error;
    }
}

export async function loadResource(uri) {
    // Préfixe si l'uri commence par '/'
    const url = uri.startsWith('/') ? API_PREFIX + uri : uri;
    try {
        const response = await fetch(url, {
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading resource:', error);
        throw error;
    }
} 