```markdown
# 🎬 DRAMAKUY

DramaKuy adalah web streaming drama berbasis frontend (React CDN + Babel) yang menggunakan API pihak ketiga.  
Project ini dibuat untuk personal use dan sharing, fokus ke UX ringan, history tontonan, dan resume playback, tanpa backend database.  
Website ini tidak menyimpan file video apa pun dan hanya bertindak sebagai agregator.

---

## ✨ Fitur Utama

### 🎥 Streaming Drama
- HTML5 video player
- Multiple kualitas video
- Ganti kualitas tanpa reset waktu
- Auto lanjut ke episode berikutnya

### 📝 Riwayat Tontonan
- Otomatis tersimpan di localStorage
- Update setiap ±5 detik (throttled)
- Menyimpan:
  - Judul
  - Episode terakhir
  - Progress
  - Waktu terakhir ditonton

### ▶️ Resume Playback
Saat membuka drama yang sama akan muncul opsi:
- **Lanjutkan dari menit terakhir**
- **Mulai ulang dari awal**
- Tidak memaksa balik ke episode 1

### 🔖 Resume Episode
- Episode terakhir otomatis aktif
- Episode list langsung highlight posisi terakhir

### 🧭 Sidebar Navigation
- Sidebar kiri (desktop & mobile)
- Navigasi cepat antar halaman
- Tampilan ringan tanpa shadow berlebihan

### 🗑️ Manajemen History
- Hapus satu riwayat
- Hapus semua riwayat
- Sinkron langsung ke localStorage

---

## 🧠 Alur Data Singkat

```javascript
User menonton video
→ Progress dipantau secara berkala
→ Data disimpan ke localStorage
→ Digunakan kembali untuk resume & history
```

Semua berjalan full di frontend.

---

📦 Struktur Data History

Key di localStorage: dramakuy_history

Isi data berupa array object:

```json
{
  "bookId": "string",
  "bookName": "string",
  "cover": "string",
  "episodeIndex": "number",
  "episodeNumber": "string",
  "currentTime": "number",
  "duration": "number",
  "lastWatchedAt": "timestamp"
}
```

---

🔌 API Source

Project ini menggunakan API pihak ketiga sebagai sumber data drama dan video streaming.

Sumber API utama:
https://www.magma-api.biz.id/

API ini digunakan untuk:

· List drama
· Detail drama
· Episode
· Link video & kualitas

---

⚙️ Teknologi yang Digunakan

```yaml
Frontend:
  - React 18 (CDN)
  - Babel Standalone
  - HTML5 Video
  - CSS (Neo Brutalism style)
  - Font Awesome
  - localStorage

Tidak digunakan:
  - Redux
  - Backend database
  - Library tambahan
  - Framework berat
```

---

🚀 Cara Menjalankan

1. Jalankan server API / proxy (Node.js + Express untuk CORS)
2. Jalankan server lokal
3. Buka melalui browser (localhost)

Project ini frontend-only, cocok untuk static hosting + API proxy.

---

🛡️ Ketentuan Penggunaan

· Konten berasal dari API pihak ketiga
· DramaKuy tidak menyimpan file video
· Hak cipta sepenuhnya milik pemilik konten
· Digunakan untuk keperluan pribadi dan non-komersial

---

🙏 Terima Kasih

Terima kasih kepada:

· Penyedia API di https://www.magma-api.biz.id/
· Semua developer open-source yang karyanya membantu project ini

Tanpa mereka, project ini cuma folder kosong dan harapan palsu.

---

👤 Pembuat

Dibuat oleh:
Kangzhyro17_

---

⚠️ Catatan

Project ini dibuat untuk eksperimen dan pembelajaran.
Gunakan dengan tanggung jawab dan patuhi hukum yang berlaku.

```