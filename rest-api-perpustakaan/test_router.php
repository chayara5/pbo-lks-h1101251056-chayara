<?php
require 'vendor/autoload.php';

use App\Core\Router;
use App\Core\Request;
use App\Core\Container;

// Simulasi URI
$_SERVER['REQUEST_URI'] = '/api/hello';
$_SERVER['REQUEST_METHOD'] = 'GET';

$router = new Router();
$router->get('/api/hello', function() {
    echo "✅ Router bekerja! Endpoint /api/hello terpanggil." . PHP_EOL;
});

$router->dispatch(new Request());

// Tambahan: uji Container
$container = new Container();
$container->bind('salam', fn() => new ArrayObject(['pesan' => 'Halo']));
echo "✅ Container bind() dan make() bekerja: " . $container->make('salam')['pesan'] . PHP_EOL;
