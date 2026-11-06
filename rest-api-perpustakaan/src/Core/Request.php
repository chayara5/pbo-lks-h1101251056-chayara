<?php

namespace App\Core;

class Request
{
    private string $method;
    private string $path;
    private array $query;
    private array $body;

    public function __construct()
    {
        $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';
        $this->path = $path === '/' ? '/' : rtrim($path, '/');

        $this->query = $_GET ?? [];

        $raw = file_get_contents('php://input');
        $json = $raw ? json_decode($raw, true) : null;
        $this->body = is_array($json) ? $json : ($_POST ?? []);
    }

    public function getMethod(): string { return $this->method; }
    public function getPath(): string { return $this->path; }
    public function getQuery(): array { return $this->query; }
    public function getBody(): array { return $this->body; }

    public function input(string $key, mixed $default = null): mixed
    {
        return $this->body[$key] ?? $this->query[$key] ?? $default;
    }
}
