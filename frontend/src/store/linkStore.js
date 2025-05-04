import { create } from 'zustand';
import { linksAPI } from '../services/api';
import * as LinkDTO from '../dto/LinkDTO';

export const useLinkStore = create((set, get) => ({
    // Состояние
    links: [],
    currentLink: null,
    isLoading: false,
    error: null,

    // Действия
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    // Загрузка всех ссылок
    fetchLinks: async () => {
        try {
            set({ isLoading: true });
            const response = await linksAPI.getLinks();
            const normalizedLinks = response.data.map(LinkDTO.fromBackend);
            
            set({
                links: normalizedLinks,
                error: null
            });
        } catch (err) {
            console.error('Ошибка при загрузке ссылок:', err);
            set({ error: 'Ошибка при загрузке ссылок', links: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    // Создание новой ссылки
    createLink: async (linkData) => {
        try {
            set({ isLoading: true });
            const data = LinkDTO.toBackend(linkData);
            const response = await linksAPI.createLink(data);
            const newLink = LinkDTO.fromBackend(response.data);

            set(state => ({
                links: [...state.links, newLink],
                error: null
            }));
            return newLink;
        } catch (err) {
            console.error('Ошибка при создании ссылки:', err);
            set({ error: 'Ошибка при создании ссылки' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    // Копирование ссылки
    copyLink: async (url) => {
        try {
            await navigator.clipboard.writeText(url);
            return true;
        } catch (err) {
            console.error('Ошибка при копировании ссылки:', err);
            throw err;
        }
    },

    // Открытие ссылки
    openLink: async (url) => {
        try {
            window.open(url, '_blank', 'noopener,noreferrer');
            return true;
        } catch (err) {
            console.error('Ошибка при открытии ссылки:', err);
            throw err;
        }
    },

    // Переключение избранного
    toggleFavorite: async (linkId) => {
        try {
            set({ isLoading: true });
            const response = await linksAPI.toggleFavorite(linkId);
            const updatedLink = LinkDTO.fromBackend(response.data);
            
            set(state => ({
                links: state.links.map(link => 
                    link.id === linkId ? updatedLink : link
                ),
                error: null
            }));
            
            return updatedLink;
        } catch (err) {
            console.error('Ошибка при изменении избранного:', err);
            set({ error: 'Ошибка при изменении избранного' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    // Переключение корзины
    toggleTrash: async (linkId) => {
        try {
            set({ isLoading: true });
            const response = await linksAPI.toggleTrashed(linkId);
            const updatedLink = LinkDTO.fromBackend(response.data);
            
            set(state => ({
                links: state.links.map(link => 
                    link.id === linkId ? updatedLink : link
                ),
                error: null
            }));
            
            return updatedLink;
        } catch (err) {
            console.error('Ошибка при изменении статуса корзины:', err);
            set({ error: 'Ошибка при изменении статуса корзины' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    // Удаление ссылки
    deleteLink: async (id) => {
        try {
            set({ isLoading: true });
            await linksAPI.deleteLink(id);
            
            set(state => ({
                links: state.links.filter(link => link.id !== id),
                error: null
            }));
        } catch (err) {
            console.error('Ошибка при удалении ссылки:', err);
            set({ error: 'Ошибка при удалении ссылки' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    }
}));