<?php

namespace App\Services;

use App\Contracts\CategoryRepositoryInterface;
use InvalidArgumentException;
use RuntimeException;

class CategoryService
{
    public function __construct(private CategoryRepositoryInterface $repository) {}

    public function list(): array
    {
        return array_map(fn ($category) => $category->toArray(), $this->repository->findAll());
    }

    public function get(int $id): array
    {
        $category = $this->repository->findById($id);
        if (!$category) {
            throw new RuntimeException("Kategori dengan ID {$id} tidak ditemukan", 404);
        }
        return $category->toArray();
    }

    public function create(array $data): array
    {
        $this->validate($data);
        return $this->repository->create($data)->toArray();
    }

    public function update(int $id, array $data): array
    {
        $this->validate($data);
        $category = $this->repository->update($id, $data);
        if (!$category) {
            throw new RuntimeException("Kategori dengan ID {$id} tidak ditemukan", 404);
        }
        return $category->toArray();
    }

    public function delete(int $id): void
    {
        if (!$this->repository->delete($id)) {
            throw new RuntimeException("Kategori dengan ID {$id} tidak ditemukan", 404);
        }
    }

    private function validate(array $data): void
    {
        if (empty(trim($data['nama'] ?? ''))) {
            throw new InvalidArgumentException('Nama kategori wajib diisi', 422);
        }
    }
}
