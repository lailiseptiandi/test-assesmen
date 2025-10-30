<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Str;

class PostTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        if (!$user) {
            $this->command->warn('Tidak ada user ditemukan. Jalankan UserSeeder dulu.');
            return;
        }

        $posts = [
            [
                'title' => 'Tips Produktivitas di Pagi Hari',
                'content' => 'Bangun lebih awal dan buat daftar kegiatan harian agar lebih fokus dan produktif sepanjang hari.',
            ],
            [
                'title' => 'Cara Menulis Blog yang Menarik',
                'content' => 'Gunakan bahasa yang ringan, beri nilai manfaat, dan sertakan gambar pendukung untuk menarik pembaca.',
            ],
            [
                'title' => 'Panduan Memulai Bisnis Online dari Nol',
                'content' => 'Pelajari dasar pemasaran digital dan pilih platform yang sesuai dengan target pasar Anda.',
            ],
            [
                'title' => 'Rahasia Kopi yang Nikmat di Rumah',
                'content' => 'Gunakan biji kopi segar dan perhatikan perbandingan air serta suhu seduhan.',
            ],
            [
                'title' => 'Manfaat Jalan Pagi untuk Kesehatan',
                'content' => 'Jalan kaki di pagi hari dapat meningkatkan mood, melancarkan peredaran darah, dan menjaga kebugaran.',
            ],
            [
                'title' => 'Belajar Pemrograman untuk Pemula',
                'content' => 'Mulailah dengan bahasa yang mudah seperti Python atau PHP, dan praktikkan setiap hari.',
            ],
            [
                'title' => 'Cara Mengatur Keuangan Pribadi',
                'content' => 'Catat semua pemasukan dan pengeluaran, serta sisihkan minimal 10% untuk tabungan.',
            ],
            [
                'title' => 'Ide Dekorasi Minimalis untuk Rumah Kecil',
                'content' => 'Gunakan warna netral, furnitur multifungsi, dan pencahayaan alami agar ruangan terasa luas.',
            ],
            [
                'title' => 'Mengenal Konsep Self-Care',
                'content' => 'Self-care bukan egois, tapi cara menjaga kesehatan mental dan fisik agar tetap seimbang.',
            ],
            [
                'title' => 'Tren Teknologi di Tahun Ini',
                'content' => 'AI, Internet of Things, dan blockchain menjadi teknologi yang semakin berkembang pesat tahun ini.',
            ],
        ];

        foreach ($posts as $data) {
            Post::create([
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'thumbnail' => 'https://via.placeholder.com/640x360.png?text=' . urlencode($data['title']),
                'content' => $data['content'],
                'user_id' => $user->id,
            ]);
        }

        $this->command->info('Data post berhasil digenerate!');
    }
}
