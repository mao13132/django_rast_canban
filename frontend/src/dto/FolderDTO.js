export const fromBackend = (data) => ({
    id: data.folder_id,
    name: data.name,
    parent_id: data.parent_id,
    is_favorite: data.is_favorite,
    is_trashed: data.is_trashed,
    size: data.size,
    created_at: data.created_at,
    updated_at: data.updated_at,
    get_full_path: data.get_full_path
});

export const toBackend = (data) => ({
    name: data.name,
    parent_id: data.parent_id,
    is_favorite: data.is_favorite,
    is_trashed: data.is_trashed
});

export const createEmptyForm = () => ({
    name: '',
    parent_id: null,
    is_favorite: false,
    is_trashed: false
});