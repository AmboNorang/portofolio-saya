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

// ==========================================
// 2. DATA & LOCAL STORAGE
// ==========================================
let rencanaBelajar = JSON.parse(localStorage.getItem("myRencana")) || [
  "Belajar HTML Semantik (Selesai!)",
  "Mastering CSS & Flexbox (Selesai!)",
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

        li.addEventListener("click", function () {
            rencanaBelajar.splice(index, 1);
            jumlahSelesai++; // Tambah angka selesai
            localStorage.setItem("jumlahSelesai", jumlahSelesai); // Simpan progres
            simpanKeMemori();
            tampilkanRencana();
        });
        listContainer.appendChild(li);
    });

    if (myChart) updateGrafik();
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

let waktuTersisa = 25 * 60; // 25 menit dalam detik
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
      document.getElementById("timer-area").classList.remove("timer-warning"); // Hapus efek saat selesai
      alert("Waktu belajar selesai! Waktunya istirahat sebentar.");
    }
  }, 1000);
}

function jedaTimer() {
  clearInterval(timerBerjalan);
  timerBerjalan = null;
}

function resetTimer() {
  jedaTimer();
  waktuTersisa = 25 * 60;
  updateTampilanTimer();
  // Hapus class warning jika tombol reset ditekan saat sedang berkedip
  document.getElementById("timer-area").classList.remove("timer-warning");
}

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
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
}

function updateGrafik() {
    if (myChart) {
        myChart.data.datasets[0].data[0] = rencanaBelajar.length; // Belum selesai
        myChart.data.datasets[0].data[1] = jumlahSelesai;        // Selesai
        myChart.update();
    }
}

// Jalankan inisialisasi saat halaman dimuat
inisialisasiGrafik();
tampilkanRencana();
ambilQuote();

const tombolTema = document.getElementById("btn-tema");
tombolTema.addEventListener("click", function() {
    document.body.classList.toggle("dark-theme");
    
    // Ubah teks tombol
    if (document.body.classList.contains("dark-theme")) {
        tombolTema.innerText = "Mode Terang";
    } else {
        tombolTema.innerText = "Mode Gelap";
    }
});