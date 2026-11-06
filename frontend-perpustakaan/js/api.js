class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async request(path, options = {}) {
        const response = await fetch(this.baseUrl + path, {
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            ...options,
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Terjadi kesalahan');
        }
        return result.data;
    }

    get(path) { return this.request(path); }
    post(path, body) { return this.request(path, { method: 'POST', body: JSON.stringify(body) }); }
    put(path, body) { return this.request(path, { method: 'PUT', body: JSON.stringify(body) }); }
    delete(path) { return this.request(path, { method: 'DELETE' }); }
}

const api = new ApiClient(CONFIG.BASE_URL);

const BookService = {
    list: () => api.get('/books'),
    get: (id) => api.get(`/books/${id}`),
    create: (data) => api.post('/books', data),
    update: (id, data) => api.put(`/books/${id}`, data),
    remove: (id) => api.delete(`/books/${id}`),
};

const CategoryService = {
    list: () => api.get('/categories'),
    get: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    remove: (id) => api.delete(`/categories/${id}`),
};
