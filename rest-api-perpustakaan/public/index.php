<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Env;
use App\Contracts\BookRepositoryInterface;
use App\Contracts\CategoryRepositoryInterface;
use App\Controllers\BookController;
use App\Controllers\CategoryController;
use App\Core\Container;
use App\Core\Request;
use App\Core\Response;
use App\Core\Router;
use App\Database\Connection;
use App\Repositories\MySQLBookRepository;
use App\Repositories\MySQLCategoryRepository;

Env::load(__DIR__ . '/../.env');

// Binding Container (Composition Root)
$container = new Container();
$container->singleton(PDO::class, fn () => Connection::get());
$container->bind(BookRepositoryInterface::class, MySQLBookRepository::class);
$container->bind(CategoryRepositoryInterface::class, MySQLCategoryRepository::class);

// Routing
$router = new Router($container);
$router->get('/api/books', [BookController::class, 'index']);
$router->get('/api/books/{id}', [BookController::class, 'show']);
$router->post('/api/books', [BookController::class, 'store']);
$router->put('/api/books/{id}', [BookController::class, 'update']);
$router->delete('/api/books/{id}', [BookController::class, 'destroy']);

$router->get('/api/categories', [CategoryController::class, 'index']);
$router->get('/api/categories/{id}', [CategoryController::class, 'show']);
$router->post('/api/categories', [CategoryController::class, 'store']);
$router->put('/api/categories/{id}', [CategoryController::class, 'update']);
$router->delete('/api/categories/{id}', [CategoryController::class, 'destroy']);

try {
    $router->dispatch(new Request());
} catch (Throwable $e) {
    Response::error('Terjadi kesalahan pada server', 500);
}
