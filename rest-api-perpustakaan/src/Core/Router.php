<?php

namespace App\Core;

class Router
{
    private array $routes = [];

    public function __construct(private ?Container $container = null) {}

    public function get(string $path, callable|array $handler): void { $this->add('GET', $path, $handler); }
    public function post(string $path, callable|array $handler): void { $this->add('POST', $path, $handler); }
    public function put(string $path, callable|array $handler): void { $this->add('PUT', $path, $handler); }
    public function delete(string $path, callable|array $handler): void { $this->add('DELETE', $path, $handler); }

    private function add(string $method, string $path, callable|array $handler): void
    {
        $pattern = preg_replace('#\{(\w+)\}#', '(?P<$1>[^/]+)', rtrim($path, '/') ?: '/');
        $this->routes[] = [
            'method'  => $method,
            'pattern' => '#^' . $pattern . '$#',
            'handler' => $handler,
        ];
    }

    public function dispatch(Request $request): void
    {
        $path = $request->getPath();
        $pathMatched = false;

        foreach ($this->routes as $route) {
            if (!preg_match($route['pattern'], $path, $matches)) {
                continue;
            }
            $pathMatched = true;

            if ($route['method'] !== $request->getMethod()) {
                continue;
            }

            $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
            $this->invoke($route['handler'], $request, $params);
            return;
        }

        if ($pathMatched) {
            Response::error('Method tidak diizinkan: ' . $request->getMethod() . ' ' . $path, 405);
            return;
        }

        Response::error('Endpoint tidak ditemukan: ' . $path, 404);
    }

    private function invoke(callable|array $handler, Request $request, array $params): void
    {
        if (is_array($handler) && is_string($handler[0])) {
            $controller = $this->container
                ? $this->container->make($handler[0])
                : new $handler[0]();
            $handler = [$controller, $handler[1]];
        }

        $handler($request, $params);
    }
}
