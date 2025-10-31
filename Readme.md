# Laravel + Next.js Fullstack Application

Blog application dengan Laravel backend + Next.js frontend.

## 🚀 Quick Start (Docker)

```bash
# 1. Jalankan semua services
docker-compose up --build -d

# 2. Setup Laravel
cp laravel/.env.example laravel/.env
docker exec -it laravel php artisan key:generate
docker exec -it laravel php artisan jwt:secret
docker exec -it laravel php artisan migrate
docker exec -it laravel php artisan db:seed
docker exec -it laravel php artisan storage:link

# 3. Akses aplikasi
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api
```

---

## 🔨 Manual Setup

### Prerequisites

- PHP 8.2+
- Composer
- MySQL 8.0+
- Node.js 18+
- npm/yarn

### 1. Setup Database

```bash
# Masuk ke MySQL
mysql -u root -p

# Buat database & user
CREATE DATABASE blog;
CREATE USER 'bloguser'@'localhost' IDENTIFIED BY 'blogpass';
GRANT ALL PRIVILEGES ON blog.* TO 'bloguser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Setup Laravel Backend

```bash
cd laravel

# Install dependencies
composer install

# Copy & edit .env
cp .env.example .env
```

Edit `laravel/.env`:

```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=blog
DB_USERNAME=bloguser
DB_PASSWORD=blogpass
```

```bash
# Generate keys
php artisan key:generate
php artisan jwt:secret

# Run migrations
php artisan migrate
php artisan db:seed

# Create storage link
php artisan storage:link

# Start server
php artisan serve
# Server running di http://localhost:8000
```

### 3. Setup Next.js Frontend

**Buka terminal baru:**

```bash
cd nextjs

# Install dependencies
npm install

# Buat .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Start dev server
npm run dev
# Server running di http://localhost:3000
```

### 4. Akses Aplikasi

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

---

## 🔧 Daily Commands (Docker)

```bash
# Start semua
docker-compose up -d

# Stop semua
docker-compose down

# Lihat logs
docker-compose logs -f

# Restart Laravel
docker-compose restart laravel

# Restart Next.js
docker-compose restart nextjs
```

## 🔧 Daily Commands (Manual)

**Terminal 1 - Laravel:**

```bash
cd laravel
php artisan serve
```

**Terminal 2 - Next.js:**

```bash
cd nextjs
npm run dev
```

---

## 🛠️ Laravel Commands

**Docker:**

```bash
docker exec -it laravel php artisan migrate
docker exec -it laravel php artisan db:seed
docker exec -it laravel php artisan cache:clear
```

**Manual:**

```bash
cd laravel
composer install
php artisan migrate
php artisan db:seed
php artisan cache:clear
```

---

## 🗄️ Database

**Docker:**

```bash
docker exec -it mysql mysql -u bloguser -pblogpass blog
docker exec -it laravel php artisan migrate:fresh --seed
```

**Manual:**

```bash
mysql -u bloguser -pblogpass blog
cd laravel && php artisan migrate:fresh --seed
```

---

## 🐛 Troubleshooting

### Docker

**Laravel error connect MySQL?**

```bash
docker-compose restart laravel mysql
```

**Permission error?**

```bash
docker exec -it laravel chmod -R 777 storage bootstrap/cache
```

**Lihat error?**

```bash
docker-compose logs laravel
docker-compose logs nextjs
```

### Manual

**Laravel connection refused?**

```bash
# Check MySQL running
sudo systemctl status mysql  # Linux
brew services list  # Mac

# Restart MySQL
sudo systemctl restart mysql  # Linux
brew services restart mysql  # Mac
```

**Permission error?**

```bash
cd laravel
chmod -R 777 storage bootstrap/cache
```

**Port 8000 sudah dipakai?**

```bash
# Ganti port
php artisan serve --port=8001

# Jangan lupa update .env.local di Next.js
# NEXT_PUBLIC_API_URL=http://localhost:8001/api
```

**Composer install error?**

```bash
# Update composer
composer self-update

# Install dengan no-scripts
composer install --no-scripts
```
