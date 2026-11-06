<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Services\CategoryService;
use Throwable;

class CategoryController
{
    public function __construct(private CategoryService $service) {}

    public function index(Request $request, array $params = []): void
    {
        $this->handle(fn () => Response::success($this->service->list(), 'Daftar kategori'));
    }

    public function show(Request $request, array $params = []): void
    {
        $this->handle(fn () => Response::success(
            $this->service->get((int) ($params['id'] ?? 0)),
            'Detail kategori'
        ));
    }

    public function store(Request $request, array $params = []): void
    {
        $this->handle(fn () => Response::success(
            $this->service->create($request->getBody()),
            'Kategori berhasil dibuat',
            201
        ));
    }

    public function update(Request $request, array $params = []): void
    {
        $this->handle(fn () => Response::success(
            $this->service->update((int) ($params['id'] ?? 0), $request->getBody()),
            'Kategori berhasil diperbarui'
        ));
    }

    public function destroy(Request $request, array $params = []): void
    {
        $this->handle(function () use ($params) {
            $this->service->delete((int) ($params['id'] ?? 0));
            Response::success(null, 'Kategori berhasil dihapus');
        });
    }

    private function handle(callable $action): void
    {
        try {
            $action();
        } catch (Throwable $e) {
            $code = $e->getCode();
            $status = (is_int($code) && $code >= 400 && $code <= 599) ? $code : 500;
            $message = $status === 500 ? 'Terjadi kesalahan pada server' : $e->getMessage();
            Response::error($message, $status);
        }
    }
}
