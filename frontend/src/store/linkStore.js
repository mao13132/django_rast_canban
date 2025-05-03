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
    }
}));