const CategoriesPage = {
    categories: [],

    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold">Daftar Kategori</h2>
                <button onclick="CategoriesPage.openModal()" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">+ Tambah Kategori</button>
            </div>
            <div id="categories-table" class="bg-white rounded-lg shadow overflow-x-auto">
                <p class="p-4 text-gray-500">Memuat data...</p>
            </div>

            <div id="category-modal" class="hidden fixed inset-0 bg-black/50 items-center justify-center z-40">
                <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                    <h3 id="category-modal-title" class="text-lg font-bold mb-4">Tambah Kategori</h3>
                    <form onsubmit="CategoriesPage.submit(event)" class="space-y-3">
                        <input type="hidden" id="category-id">
                        <div>
                            <label class="block text-sm mb-1">Nama</label>
                            <input id="category-nama" class="w-full border rounded px-3 py-2" required>
                        </div>
                        <div>
                            <label class="block text-sm mb-1">Deskripsi</label>
                            <textarea id="category-deskripsi" rows="3" class="w-full border rounded px-3 py-2"></textarea>
                        </div>
                        <div class="flex justify-end gap-2 pt-2">
                            <button type="button" onclick="CategoriesPage.closeModal()" class="px-4 py-2 rounded border">Batal</button>
                            <button type="submit" class="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>`;
        await this.load();
    },

    async load() {
        const box = document.getElementById('categories-table');
        try {
            this.categories = await CategoryService.list();
            if (this.categories.length === 0) {
                box.innerHTML = '<p class="p-4 text-gray-500">Belum ada kategori.</p>';
                return;
            }
            box.innerHTML = `
                <table class="min-w-full text-left">
                    <thead class="bg-gray-50 text-sm text-gray-600">
                        <tr>
                            <th class="px-4 py-3">ID</th>
                            <th class="px-4 py-3">Nama</th>
                            <th class="px-4 py-3">Deskripsi</th>
                            <th class="px-4 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        ${this.categories.map(c => `
                            <tr>
                                <td class="px-4 py-3">${c.id}</td>
                                <td class="px-4 py-3">${escapeHtml(c.nama)}</td>
                                <td class="px-4 py-3">${escapeHtml(c.deskripsi ?? '-')}</td>
                                <td class="px-4 py-3 space-x-2">
                                    <button onclick="CategoriesPage.openModal(${c.id})" class="text-blue-600 hover:underline">Edit</button>
                                    <button onclick="CategoriesPage.remove(${c.id})" class="text-red-600 hover:underline">Hapus</button>
                                </td>
                            </tr>`).join('')}
                    </tbody>
                </table>`;
        } catch (e) {
            box.innerHTML = `<p class="p-4 text-red-600">Gagal memuat data: ${escapeHtml(e.message)}</p>`;
        }
    },

    openModal(id = null) {
        const cat = id ? this.categories.find(c => c.id === id) : null;
        document.getElementById('category-modal-title').textContent = cat ? 'Edit Kategori' : 'Tambah Kategori';
        document.getElementById('category-id').value = cat ? cat.id : '';
        document.getElementById('category-nama').value = cat ? cat.nama : '';
        document.getElementById('category-deskripsi').value = cat ? (cat.deskripsi ?? '') : '';
        const modal = document.getElementById('category-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    },

    closeModal() {
        const modal = document.getElementById('category-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    },

    async submit(event) {
        event.preventDefault();
        const id = document.getElementById('category-id').value;
        const data = {
            nama: document.getElementById('category-nama').value.trim(),
            deskripsi: document.getElementById('category-deskripsi').value.trim(),
        };
        try {
            if (id) {
                await CategoryService.update(Number(id), data);
                showToast('Kategori berhasil diperbarui');
            } else {
                await CategoryService.create(data);
                showToast('Kategori berhasil ditambahkan');
            }
            this.closeModal();
            await this.load();
        } catch (e) {
            showToast(e.message, 'error');
        }
    },

    async remove(id) {
        if (!confirm('Hapus kategori ini?')) return;
        try {
            await CategoryService.remove(id);
            showToast('Kategori berhasil dihapus');
            await this.load();
        } catch (e) {
            showToast(e.message, 'error');
        }
    },
};
