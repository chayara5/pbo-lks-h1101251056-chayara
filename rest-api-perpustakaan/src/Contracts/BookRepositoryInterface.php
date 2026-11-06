<?php

namespace App\Contracts;

use App\Models\Book;

interface BookRepositoryInterface
{
    /** @return Book[] */
    public function findAll(): array;

    public function findById(int $id): ?Book;

    public function create(array $data): Book;

    public function update(int $id, array $data): ?Book;

    public function delete(int $id): bool;
}
