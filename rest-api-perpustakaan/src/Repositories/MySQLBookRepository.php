<?php

namespace App\Repositories;

use App\Contracts\BookRepositoryInterface;
use App\Models\Book;
use PDO;

class MySQLBookRepository implements BookRepositoryInterface
{
    public function __construct(private PDO $pdo) {}

    public function findAll(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM books ORDER BY id DESC');
        return array_map([$this, 'toBook'], $stmt->fetchAll());
    }

    public function findById(int $id): ?Book
    {
        $stmt = $this->pdo->prepare('SELECT * FROM books WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ? $this->toBook($row) : null;
    }

    public function create(array $data): Book
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO books (judul, penulis, tahun, stok)
             VALUES (:judul, :penulis, :tahun, :stok)'
        );
        $stmt->execute([
            'judul'   => $data['judul'],
            'penulis' => $data['penulis'],
            'tahun'   => $data['tahun'] ?? null,
            'stok'    => $data['stok'] ?? 0,
        ]);
        return $this->findById((int) $this->pdo->lastInsertId());
    }

    public function update(int $id, array $data): ?Book
    {
        if (!$this->findById($id)) {
            return null;
        }
        $stmt = $this->pdo->prepare(
            'UPDATE books SET judul = :judul, penulis = :penulis,
             tahun = :tahun, stok = :stok WHERE id = :id'
        );
        $stmt->execute([
            'judul'   => $data['judul'],
            'penulis' => $data['penulis'],
            'tahun'   => $data['tahun'] ?? null,
            'stok'    => $data['stok'] ?? 0,
            'id'      => $id,
        ]);
        return $this->findById($id);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM books WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    }

    private function toBook(array $row): Book
    {
        return new Book(
            (int) $row['id'],
            $row['judul'],
            $row['penulis'],
            $row['tahun'] !== null ? (int) $row['tahun'] : null,
            (int) $row['stok']
        );
    }
}
