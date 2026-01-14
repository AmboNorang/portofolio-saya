// ==========================================
// 1. DEFINISI ELEMEN (DOM)
// ==========================================
const listContainer = document.getElementById("daftar-rencana");
const inputRencana = document.getElementById("input-rencana");
const tombolTambah = document.getElementById("btn-tambah");
const tombolKontak = document.querySelector(".btn-kontak");
const teksQuote = document.getElementById("teks-quote");
const penulisQuote = document.getElementById("penulis-quote");
const tombolQuote = document.getElementById("btn-quote");
const inputDurasi = document.getElementById("input-durasi");

// ==========================================
// 2. DATA & LOCAL STORAGE
// ==========================================
let rencanaBelajar = JSON.parse(localStorage.getItem("myRencana")) || [
  "Belajar HTML Semantik (Selesai!)",
  "Mastering CSS & Flexbox (Selesai!)",
  "Integrasi Dasar JavaScript (DOM) (Selesai!)",
  "Implementasi API & Library (Selesai!)",
];

function simpanKeMemori() {
  localStorage.setItem("myRencana", JSON.stringify(rencanaBelajar));
}

// ==========================================
// 3. FUNGSI LOGIKA (FUNCTIONS)
// ==========================================

// --- Fitur Todo List ---
// 1. Tambahkan variabel untuk melacak tugas selesai (bisa disimpan di localStorage juga)
let jumlahSelesai = JSON.parse(localStorage.getItem("jumlahSelesai")) || 0;

function tampilkanRencana() {
  if (!listContainer) return;
  listContainer.innerHTML = "";

  rencanaBelajar.forEach(function (item, index) {
    const li = document.createElement("li");
    li.innerText = item;
    li.style.cursor = "pointer";

    // --- FITUR BARU: Cek apakah tugas sudah mengandung kata "(Selesai!)" ---
    if (item.includes("(Selesai!)")) {
      li.style.textDecoration = "line-through"; // Coret teks
      li.style.opacity = "0.6"; // Buat agak transparan
      li.style.color = "#2ecc71"; // Ubah warna jadi hijau
    }

    li.addEventListener("click", function () {
      // Logika: Jika belum ada tulisan (Selesai!), maka tandai selesai
      if (!rencanaBelajar[index].includes("(Selesai!)")) {
        rencanaBelajar[index] = item + " (Selesai!)";
        jumlahSelesai++; // Tambah angka untuk grafik
        localStorage.setItem("jumlahSelesai", jumlahSelesai);
      }
      // Jika sudah selesai, klik sekali lagi untuk menghapus dari list
      else {
        const konfirmasi = confirm("Hapus rencana ini dari daftar?");
        if (konfirmasi) {
          rencanaBelajar.splice(index, 1);
        }
      }

      simpanKeMemori();
      tampilkanRencana(); // Refresh tampilan
    });

    listContainer.appendChild(li);
  });

  // Update grafik setiap kali ada perubahan status tugas
  if (typeof myChart !== "undefined") updateGrafik();
}

function tambahRencanaBaru() {
  const teksBaru = inputRencana.value.trim();
  if (teksBaru !== "") {
    rencanaBelajar.push(teksBaru);
    simpanKeMemori();
    tampilkanRencana();
    updateGrafik(); // Tambahkan ini agar grafik update saat tambah data
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

// Klik Tombol Tambah
if (tombolTambah) {
  tombolTambah.addEventListener("click", tambahRencanaBaru);
}

// Tekan Enter di Input (Fitur Tambahan)
if (inputRencana) {
  inputRencana.addEventListener("keypress", function (e) {
    if (e.key === "Enter") tambahRencanaBaru();
  });
}

// Tombol Kontak
if (tombolKontak) {
  tombolKontak.addEventListener("click", function () {
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
  tombolQuote.addEventListener("click", ambilQuote);
}

// ==========================================
// FITUR TIMER BELAJAR (POMODORO)
// ==========================================

let waktuTersisa = 6; // 25 menit dalam detik
let timerBerjalan = null;

const displayTimer = document.getElementById("display-timer");
const tombolStart = document.getElementById("btn-start");
const tombolPause = document.getElementById("btn-pause");
const tombolResetTimer = document.getElementById("btn-reset-timer");

function updateTampilanTimer() {
  const menit = Math.floor(waktuTersisa / 60);
  const detik = waktuTersisa % 60;

  // Menampilkan format 00:00 (menggunakan padStart agar ada angka 0 di depan jika di bawah 10)
  displayTimer.innerText = `${menit.toString().padStart(2, "0")}:${detik
    .toString()
    .padStart(2, "0")}`;
}

function jalankanTimer() {
  if (timerBerjalan) return;

  timerBerjalan = setInterval(() => {
    if (waktuTersisa > 0) {
      waktuTersisa--;
      updateTampilanTimer();

      // CEK: Jika sisa 10 detik, tambahkan efek berkedip
      const timerCard = document.getElementById("timer-area");
      if (waktuTersisa <= 10) {
        timerCard.classList.add("timer-warning");
      } else {
        timerCard.classList.remove("timer-warning");
      }
    } else {
      clearInterval(timerBerjalan);
      timerBerjalan = null;

      const timerCard = document.getElementById("timer-area"); // Simpan di variabel

      // Beri warna hijau sebagai penanda selesai
      timerCard.classList.add("timer-finish");
      timerCard.classList.remove("timer-warning");

      alert("Waktu belajar selesai! Waktunya istirahat sebentar.");
    }
  }, 1000);
}

function jedaTimer() {
  clearInterval(timerBerjalan);
  timerBerjalan = null;
}

function resetTimer() {
  jedaTimer(); // Hentikan timer jika sedang berjalan

  const timerCard = document.getElementById("timer-area");
  // Kembalikan ke warna biru aslinya
  timerCard.classList.remove("timer-finish");
  timerCard.classList.remove("timer-warning");

  // Ambil nilai dari input, jika kosong atau bukan angka gunakan 25
  const menitBaru = parseInt(inputDurasi.value) || 25;

  waktuTersisa = menitBaru * 60; // Ubah menit ke detik
  updateTampilanTimer();

  // Hapus efek peringatan
  document.getElementById("timer-area").classList.remove("timer-warning");
}

inputDurasi.addEventListener("input", function () {
  // Hanya update tampilan jika timer sedang TIDAK berjalan
  if (!timerBerjalan) {
    resetTimer();
  }
});

// Pasang Event Listeners
tombolStart.addEventListener("click", jalankanTimer);
tombolPause.addEventListener("click", jedaTimer);
tombolResetTimer.addEventListener("click", resetTimer);

// ==========================================
// FITUR GRAFIK PROGRES (CHART.JS)
// ==========================================

let myChart;

function inisialisasiGrafik() {
  const ctx = document.getElementById("myChart").getContext("2d");

  // Data awal: Jumlah rencana yang ada vs 0 yang selesai (sebagai simulasi)
  const jumlahTugas = rencanaBelajar.length;

  myChart = new Chart(ctx, {
    type: "doughnut", // Grafik lingkaran bolong tengah (lebih modern)
    data: {
      labels: ["Belum Selesai", "Selesai"],
      datasets: [
        {
          data: [jumlahTugas, 0],
          backgroundColor: ["#e74c3c", "#2ecc71"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true, // Menjaga grafik tetap bulat (1:1)
      plugins: {
        legend: {
          position: "bottom", // Memastikan legenda ada di bawah dengan rapi
          labels: {
            padding: 20, // Memberi jarak antara grafik dan tulisan legenda
            boxWidth: 12,
          },
        },
      },
      layout: {
        padding: 10,
      },
    },
  });
}

function updateGrafik() {
  if (myChart) {
    // Hitung otomatis berapa banyak yang ada kata "(Selesai!)"
    const selesai = rencanaBelajar.filter((item) =>
      item.includes("(Selesai!)")
    ).length;
    const belumSelesai = rencanaBelajar.length - selesai;

    myChart.data.datasets[0].data[0] = belumSelesai;
    myChart.data.datasets[0].data[1] = selesai;
    myChart.update();
  }
}

// Jalankan inisialisasi saat halaman dimuat
inisialisasiGrafik();
tampilkanRencana();
ambilQuote();

const tombolTema = document.getElementById("btn-tema");
tombolTema.addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");

  // Ubah teks tombol
  if (document.body.classList.contains("dark-theme")) {
    tombolTema.innerText = "Mode Terang";
  } else {
    tombolTema.innerText = "Mode Gelap";
  }
});
