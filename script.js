// ==========================================
// 1. DEFINISI ELEMEN (DOM)
// ==========================================
const listContainer = document.getElementById('daftar-rencana');
const inputRencana = document.getElementById('input-rencana');
const tombolTambah = document.getElementById('btn-tambah');
const tombolKontak = document.querySelector('.btn-kontak');
const teksQuote = document.getElementById('teks-quote');
const penulisQuote = document.getElementById('penulis-quote');
const tombolQuote = document.getElementById('btn-quote');

// ==========================================
// 2. DATA & LOCAL STORAGE
// ==========================================
let rencanaBelajar = JSON.parse(localStorage.getItem('myRencana')) || [
    "Belajar HTML Semantik (Selesai!)",
    "Mastering CSS & Flexbox (Selesai!)"
];

function simpanKeMemori() {
    localStorage.setItem('myRencana', JSON.stringify(rencanaBelajar));
}

// ==========================================
// 3. FUNGSI LOGIKA (FUNCTIONS)
// ==========================================

// --- Fitur Todo List ---
function tampilkanRencana() {
    if (!listContainer) return;
    listContainer.innerHTML = ""; 

    rencanaBelajar.forEach(function(item, index) {
        const li = document.createElement('li');
        li.innerText = item;
        li.style.cursor = "pointer";
        li.title = "Klik untuk menghapus";
    
        li.addEventListener('click', function() {
            rencanaBelajar.splice(index, 1);
            simpanKeMemori(); 
            tampilkanRencana();
        });
        listContainer.appendChild(li);
    });
}

function tambahRencanaBaru() {
    const teksBaru = inputRencana.value.trim();
    if (teksBaru !== "") {
        rencanaBelajar.push(teksBaru);
        simpanKeMemori();
        tampilkanRencana();
        inputRencana.value = "";
    } else {
        alert("Isi dulu rencananya ya!");
    }
}

// --- Fitur API Quote ---
async function ambilQuote() {
    try {
        teksQuote.innerText = "Memuat nasihat bijak...";
        const respon = await fetch("https://api.adviceslip.com/advice");
        if (!respon.ok) throw new Error("Gagal terhubung");
        const data = await respon.json();
        teksQuote.innerText = `"${data.slip.advice}"`;
        penulisQuote.innerText = "- Advice Slip";
    } catch (error) {
        teksQuote.innerText = "Gagal mengambil kutipan.";
        console.error(error);
    }
}

// ==========================================
// 4. EVENT LISTENERS (INTERAKSI)
// ==========================================

// Jalankan saat pertama kali dimuat
tampilkanRencana();
ambilQuote();

// Klik Tombol Tambah
if (tombolTambah) {
    tombolTambah.addEventListener('click', tambahRencanaBaru);
}

// Tekan Enter di Input (Fitur Tambahan)
if (inputRencana) {
    inputRencana.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') tambahRencanaBaru();
    });
}

// Tombol Kontak
if (tombolKontak) {
    tombolKontak.addEventListener('click', function() {
        const namaUser = prompt("Halo! Siapa nama kamu?");
        if (namaUser) {
            alert(`Salam kenal, ${namaUser}! Senang kamu melihat portofolio saya.`);
            tombolKontak.innerText = `Halo, ${namaUser}!`;
            tombolKontak.style.backgroundColor = "#2ecc71";
        }
    });
}

// Tombol Ganti Quote
if (tombolQuote) {
    tombolQuote.addEventListener('click', ambilQuote);
}