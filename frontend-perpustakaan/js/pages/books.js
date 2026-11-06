const BooksPage = {
    books: [],

    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold">Daftar Buku</h2>
                <button onclick="BooksPage.openModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">+ Tambah Buku</button>
            </div>
            <div id="books-table" class="bg-white rounded-lg shadow overflow-x-auto">
                <p class="p-4 text-gray-500">Memuat data...</p>
            </div>

            <div id="book-modal" class="hidden fixed inset-0 bg-black/50 items-center justify-center z-40">
                <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                    <h3 id="modal-title" class="text-lg font-bold mb-4">Tambah Buku</h3>
                    <form onsubmit="BooksPage.submit(event)" class="space-y-3">
                        <input type="hidden" id="book-id">
                        <div>
                            <label class="block text-sm mb-1">Judul</label>
                            <input id="book-judul" class="w-full border rounded px-3 py-2" required>
                        </div>
                        <div>
                            <label class="block text-sm mb-1">Penulis</label>
                            <input id="book-penulis" class="w-full border rounded px-3 py-2" required>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-sm mb-1">Tahun</label>
                                <input id="book-tahun" type="number" min="0" class="w-full border rounded px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-sm mb-1">Stok</label>
                                <input id="book-stok" type="number" min="0" class="w-full border rounded px-3 py-2">
                            </div>
                        </div>
                        <div class="flex justify-end gap-2 pt-2">
                            <button type="button" onclick="BooksPage.closeModal()" class="px-4 py-2 rounded border">Batal</button>
                            <button type="submit" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>`;
        await this.load();
    },

    async load() {
        const box = document.getElementById('books-table');
        try {
            this.books = await BookService.list();
            if (this.books.length === 0) {
                box.innerHTML = '<p class="p-4 text-gray-500">Belum ada buku.</p>';
                return;
            }
            box.innerHTML = `
                <table class="min-w-full text-left">
                    <thead class="bg-gray-50 text-sm text-gray-600">
                        <tr>
                            <th class="px-4 py-3">ID</th>
                            <th class="px-4 py-3">Judul</th>
                            <th class="px-4 py-3">Penulis</th>
                            <th class="px-4 py-3">Tahun</th>
                            <th class="px-4 py-3">Stok</th>
                            <th class="px-4 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        ${this.books.map(b => `
                            <tr>
                                <td class="px-4 py-3">${b.id}</td>
                                <td class="px-4 py-3">${escapeHtml(b.judul)}</td>
                                <td class="px-4 py-3">${escapeHtml(b.penulis)}</td>
                                <td class="px-4 py-3">${escapeHtml(String(b.tahun ?? '-'))}</td>
                                <td class="px-4 py-3">${escapeHtml(String(b.stok ?? '-'))}</td>
                                <td class="px-4 py-3 space-x-2">
                                    <button onclick="BooksPage.openModal(${b.id})" class="text-blue-600 hover:underline">Edit</button>
                                    <button onclick="BooksPage.remove(${b.id})" class="text-red-600 hover:underline">Hapus</button>
                                </td>
                            </tr>`).join('')}
                    </tbody>
                </table>`;
        } catch (e) {
            box.innerHTML = `<p class="p-4 text-red-600">Gagal memuat data: ${escapeHtml(e.message)}</p>`;
        }
    },

    openModal(id = null) {
        const book = id ? this.books.find(b => b.id === id) : null;
        document.getElementById('modal-title').textContent = book ? 'Edit Buku' : 'Tambah Buku';
        document.getElementById('book-id').value = book ? book.id : '';
        document.getElementById('book-judul').value = book ? book.judul : '';
        document.getElementById('book-penulis').value = book ? book.penulis : '';
        document.getElementById('book-tahun').value = book ? (book.tahun ?? '') : '';
        document.getElementById('book-stok').value = book ? (book.stok ?? '') : '';
        const modal = document.getElementById('book-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    },

    closeModal() {
        const modal = document.getElementById('book-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    },

    async submit(event) {
        event.preventDefault();
        const id = document.getElementById('book-id').value;
        const tahun = document.getElementById('book-tahun').value;
        const stok = document.getElementById('book-stok').value;
        const data = {
            judul: document.getElementById('book-judul').value.trim(),
            penulis: document.getElementById('book-penulis').value.trim(),
        };
        if (tahun !== '') data.tahun = Number(tahun);
        if (stok !== '') data.stok = Number(stok);

        try {
            if (id) {
                await BookService.update(Number(id), data);
                showToast('Buku berhasil diperbarui');
            } else {
                await BookService.create(data);
                showToast('Buku berhasil ditambahkan');
            }
            this.closeModal();
            await this.load();
        } catch (e) {
            showToast(e.message, 'error');
        }
    },

    async remove(id) {
        if (!confirm('Hapus buku ini?')) return;
        try {
            await BookService.remove(id);
            showToast('Buku berhasil dihapus');
            await this.load();
        } catch (e) {
            showToast(e.message, 'error');
        }
    },
};
