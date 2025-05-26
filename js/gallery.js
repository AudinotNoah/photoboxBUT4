import { loadResource } from './photoloader.js';
import { API_BASE_URL } from './config.js';

let currentGallery = null;

export async function load() {
    try {
        const gallery = await loadResource(`${API_BASE_URL}/photos`);
        currentGallery = gallery;
        return gallery;
    } catch (error) {
        console.error('Error loading gallery:', error);
        throw error;
    }
}

export async function next() {
    if (currentGallery && currentGallery.links.next) {
        try {
            const gallery = await loadResource(currentGallery.links.next.href);
            currentGallery = gallery;
            return gallery;
        } catch (error) {
            console.error('Error loading next page:', error);
            throw error;
        }
    }
    return null;
}

export async function prev() {
    if (currentGallery && currentGallery.links.prev) {
        try {
            const gallery = await loadResource(currentGallery.links.prev.href);
            currentGallery = gallery;
            return gallery;
        } catch (error) {
            console.error('Error loading previous page:', error);
            throw error;
        }
    }
    return null;
}

export async function first() {
    if (currentGallery && currentGallery.links.first) {
        try {
            const gallery = await loadResource(currentGallery.links.first.href);
            currentGallery = gallery;
            return gallery;
        } catch (error) {
            console.error('Error loading first page:', error);
            throw error;
        }
    }
    return null;
}

export async function last() {
    if (currentGallery && currentGallery.links.last) {
        try {
            const gallery = await loadResource(currentGallery.links.last.href);
            currentGallery = gallery;
            return gallery;
        } catch (error) {
            console.error('Error loading last page:', error);
            throw error;
        }
    }
    return null;
} 