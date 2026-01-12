// ==========================================
// 1. DATA (ARRAY)
// ==========================================
// Daftar rencana belajar yang akan muncul otomatis di HTML
const rencanaBelajar = [
    "Belajar HTML Semantik (Selesai!)",
    "Mastering CSS & Flexbox (Selesai!)",
    "Membuat Fitur Dark Mode (Selesai!)",
    "Manipulasi DOM dengan Array (Sedang Berjalan)",
    "Membangun Proyek Todo-List (Next)"
];

// ==========================================
// 2. FUNGSI RENDER LIST (ARRAY TO DOM)
// ==========================================
function tampilkanRencana() {
    const listContainer = document.getElementById('daftar-rencana');
    
    // Pastikan container ada sebelum diisi
    if (listContainer) {
        listContainer.innerHTML = ""; // Bersihkan isi lama

        rencanaBelajar.forEach(function(item, index) {
            const li = document.createElement('li');
            li.innerText = item;
            
            // Tambahkan gaya kursor agar user tahu ini bisa diklik
            li.style.cursor = "pointer";
            li.title = "Klik untuk menghapus";
        
            // Fungsi Hapus saat item diklik
            li.addEventListener('click', function() {
                // Menghapus 1 data berdasarkan urutan (index) nya
                rencanaBelajar.splice(index, 1);
                
                // Render ulang daftar agar yang dihapus hilang dari layar
                tampilkanRencana();
            });
        
            listContainer.appendChild(li);
        });
    }
}

// Jalankan fungsi tampilkanRencana saat halaman pertama kali dimuat
tampilkanRencana();


// ==========================================
// 3. FITUR SAPAAN NAMA (HUBUNGI SAYA)
// ==========================================
const tombolKontak = document.querySelector('.btn-kontak');

tombolKontak.addEventListener('click', function() {
    const namaUser = prompt("Halo! Siapa nama kamu?");

    if (namaUser) {
        alert("Salam kenal, " + namaUser + "! Senang kamu melihat portofolio saya.");
        tombolKontak.innerText = "Halo, " + namaUser + "!";
        tombolKontak.style.backgroundColor = "#2ecc71"; // Warna Hijau
    } else {
        alert("Wah, kamu tidak mengisi nama ya?");
    }
});


// ==========================================
// 4. FITUR DARK MODE (GANTI TEMA)
// ==========================================
const tombolTema = document.getElementById('btn-tema');
const bodi = document.body;

tombolTema.addEventListener('click', function() {
    // Tambah/Hapus class 'dark-theme' pada tag <body>
    bodi.classList.toggle('dark-theme');

    // Cek apakah sekarang sedang Mode Gelap atau tidak
    if (bodi.classList.contains('dark-theme')) {
        tombolTema.innerText = "Mode Terang";
    } else {
        tombolTema.innerText = "Mode Gelap";
    }
});

// 1. Ambil elemen input dan tombol tambah
const inputBaru = document.getElementById('input-rencana');
const tombolTambah = document.getElementById('btn-tambah');

// 2. Fungsi saat tombol Tambah diklik
tombolTambah.addEventListener('click', function() {
    const teksRencana = inputBaru.value; // Ambil teks dari input

    // Cek jika input tidak kosong
    if (teksRencana !== "") {
        // Masukkan data baru ke dalam Array rencanaBelajar
        rencanaBelajar.push(teksRencana);

        // Panggil kembali fungsi tampilkanRencana() agar list terupdate
        tampilkanRencana();

        // Kosongkan kembali kolom input
        inputBaru.value = "";
    } else {
        alert("Ketik sesuatu dulu ya!");
    }
});