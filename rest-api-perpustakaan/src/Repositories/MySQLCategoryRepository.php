<?php

namespace App\Repositories;

use App\Contracts\CategoryRepositoryInterface;
use App\Models\Category;
use PDO;

class MySQLCategoryRepository implements CategoryRepositoryInterface
{
    public function __construct(private PDO $pdo) {}

    public function findAll(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM categories ORDER BY id ASC');
        return array_map([$this, 'toCategory'], $stmt->fetchAll());
    }

    public function findById(int $id): ?Category
    {
        $stmt = $this->pdo->prepare('SELECT * FROM categories WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ? $this->toCategory($row) : null;
    }

    public function create(array $data): Category
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO categories (nama, deskripsi) VALUES (:nama, :deskripsi)'
        );
        $stmt->execute([
            'nama'      => $data['nama'],
            'deskripsi' => $data['deskripsi'] ?? null,
        ]);
        return $this->findById((int) $this->pdo->lastInsertId());
    }

    public function update(int $id, array $data): ?Category
    {
        if (!$this->findById($id)) {
            return null;
        }
        $stmt = $this->pdo->prepare(
            'UPDATE categories SET nama = :nama, deskripsi = :deskripsi WHERE id = :id'
        );
        $stmt->execute([
            'nama'      => $data['nama'],
            'deskripsi' => $data['deskripsi'] ?? null,
            'id'        => $id,
        ]);
        return $this->findById($id);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM categories WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    }

    private function toCategory(array $row): Category
    {
        return new Category((int) $row['id'], $row['nama'], $row['deskripsi']);
    }
}
