<?php

namespace App\Services;

use App\Contracts\BookRepositoryInterface;
use InvalidArgumentException;
use RuntimeException;

class BookService
{
    public function __construct(private BookRepositoryInterface $repository) {}

    public function list(): array
    {
        return array_map(fn ($book) => $book->toArray(), $this->repository->findAll());
    }

    public function get(int $id): array
    {
        $book = $this->repository->findById($id);
        if (!$book) {
            throw new RuntimeException("Buku dengan ID {$id} tidak ditemukan", 404);
        }
        return $book->toArray();
    }

    public function create(array $data): array
    {
        $this->validate($data);
        return $this->repository->create($data)->toArray();
    }

    public function update(int $id, array $data): array
    {
        $this->validate($data);
        $book = $this->repository->update($id, $data);
        if (!$book) {
            throw new RuntimeException("Buku dengan ID {$id} tidak ditemukan", 404);
        }
        return $book->toArray();
    }

    public function delete(int $id): void
    {
        if (!$this->repository->delete($id)) {
            throw new RuntimeException("Buku dengan ID {$id} tidak ditemukan", 404);
        }
    }

    private function validate(array $data): void
    {
        if (empty(trim($data['judul'] ?? ''))) {
            throw new InvalidArgumentException('Judul wajib diisi', 422);
        }
        if (empty(trim($data['penulis'] ?? ''))) {
            throw new InvalidArgumentException('Penulis wajib diisi', 422);
        }
        if (isset($data['tahun']) && (!is_numeric($data['tahun']) || $data['tahun'] < 0)) {
            throw new InvalidArgumentException('Tahun tidak valid', 422);
        }
        if (isset($data['stok']) && (!is_numeric($data['stok']) || $data['stok'] < 0)) {
            throw new InvalidArgumentException('Stok tidak valid', 422);
        }
    }
}
