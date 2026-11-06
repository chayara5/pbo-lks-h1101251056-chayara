#!/bin/bash
# Skrip uji otomatis CRUD Buku - REST API Perpustakaan

BASE_URL="http://localhost:8000/api"
H="Content-Type: application/json"

if ! curl -s -o /dev/null "$BASE_URL/books"; then
  echo "Server tidak bisa dihubungi di $BASE_URL"
  echo "Jalankan dulu: php -S localhost:8000 -t public"
  exit 1
fi

echo "== Test 1: GET semua buku =="
curl -s "$BASE_URL/books" | jq -c '{success: .success, jumlah_data: (.data | length)}'
echo

echo "== Test 2: POST buku baru =="
ID=$(curl -s -X POST "$BASE_URL/books" -H "$H" \
  -d '{"judul":"Buku Uji Otomatis","penulis":"Tester","tahun":2024,"stok":3}' | jq -r '.data.id')
echo "ID baru: $ID"
echo

echo "== Test 3: GET buku ID $ID =="
curl -s "$BASE_URL/books/$ID" | jq -c '{success: .success, data: .data}'
echo

echo "== Test 4: PUT ubah buku =="
curl -s -X PUT "$BASE_URL/books/$ID" -H "$H" \
  -d '{"judul":"Buku Uji Diubah","penulis":"Tester","tahun":2025,"stok":9}' | jq -c '{success: .success, data: .data}'
echo

echo "== Test 5: DELETE buku =="
curl -s -X DELETE "$BASE_URL/books/$ID" | jq -c '{success: .success, message: .message}'
echo

echo "== Test 6: Validasi error =="
curl -s -X POST "$BASE_URL/books" -H "$H" -d '{"judul":""}' | jq -c '{success: .success, message: .message}'
echo
