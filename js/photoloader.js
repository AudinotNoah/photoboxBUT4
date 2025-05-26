import { API_BASE_URL } from './config.js';

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
    try {
        const response = await fetch(uri, {
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