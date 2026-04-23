// ==========================================
// 1. DOM ELEMENTS
// ==========================================
const listContainer = document.getElementById("daftar-rencana");
const inputRencana = document.getElementById("input-rencana");
const tombolTambah = document.getElementById("btn-tambah");
const tombolKontak = document.querySelector(".btn-kontak");

const teksQuote = document.getElementById("teks-quote");
const penulisQuote = document.getElementById("penulis-quote");
const tombolQuote = document.getElementById("btn-quote");

const inputDurasi = document.getElementById("input-durasi");

const displayTimer = document.getElementById("display-timer");
const tombolStart = document.getElementById("btn-start");
const tombolPause = document.getElementById("btn-pause");
const tombolResetTimer = document.getElementById("btn-reset-timer");

const tombolTema = document.getElementById("btn-tema");
const themeIcon = document.getElementById("theme-icon");

const btnBackToTop = document.getElementById("btn-back-to-top");

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

const formKontak = document.getElementById("form-kontak");

// ==========================================
// 2. STATE & STORAGE
// ==========================================
let rencanaBelajar =
  JSON.parse(localStorage.getItem("myRencana")) || [
    "W1-D1: Fondasi & Struktur HTML (Selesai!)",
    "W1-D2: API GitHub & Dark Mode (Selesai!)",
    "W1-D3: Logic Todo & Grafik Progres (Selesai!)",
    "W1-D4: Hamburger Menu & Form Kontak (Selesai!)",
    "W1-D5: Animasi AOS & Efek Visual",
    "W1-D6: Persiapan Deployment (Minggu 2)"
  ];

let jumlahSelesai =
  JSON.parse(localStorage.getItem("jumlahSelesai")) || 0;

let waktuTersisa = 25 * 60;
let timerBerjalan = null;

let myChart;

// ==========================================
// 3. STORAGE FUNCTION
// ==========================================
function simpanKeMemori() {
  localStorage.setItem("myRencana", JSON.stringify(rencanaBelajar));
}

// ==========================================
// Fungsi untuk memperbarui dashboard
function updateDashboard() {
  const total = rencanaBelajar.length;
  // Menghitung berapa banyak yang punya teks "(Selesai!)"
  const selesai = rencanaBelajar.filter(item => 
    typeof item === 'string' ? item.includes("(Selesai!)") : item.selesai
  ).length;

  const persen = total > 0 ? Math.round((selesai / total) * 100) : 0;

  // Update elemen dashboard
  document.getElementById("stat-total").innerText = total;
  document.getElementById("stat-selesai").innerText = selesai;
  document.getElementById("stat-persen").innerText = persen + "%";
}

// ==========================================
// 4. TODO LIST
// ==========================================
function tampilkanRencana() {
  if (!listContainer) return;

  listContainer.innerHTML = "";

  rencanaBelajar.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerText = item;

    if (item.includes("(Selesai!)")) {
      li.style.textDecoration = "line-through";
      li.style.opacity = "0.6";
      li.style.color = "#2ecc71";
    }

    li.addEventListener("click", () => {
      if (!rencanaBelajar[index].includes("(Selesai!)")) {
        rencanaBelajar[index] = item + " (Selesai!)";
        jumlahSelesai++;
        localStorage.setItem("jumlahSelesai", JSON.stringify(jumlahSelesai));
      } else {
        if (confirm("Hapus rencana ini dari daftar?")) {
          rencanaBelajar.splice(index, 1);
        }
      }

      simpanKeMemori();
      tampilkanRencana();
    });

    listContainer.appendChild(li);
  });

  // Panggil updateDashboard untuk memperbarui informasi statistik
  updateDashboard();

  // Pastikan grafik diperbarui jika ada
  if (typeof myChart !== "undefined") updateGrafik();
}

// ==========================================
// Fungsi untuk menambah rencana baru
function tambahRencanaBaru() {
  if (!inputRencana) return;

  const teksBaru = inputRencana.value.trim();

  if (teksBaru !== "") {
    rencanaBelajar.push(teksBaru);
    simpanKeMemori();
    tampilkanRencana();
    updateGrafik();
    inputRencana.value = "";
  } else {
    alert("Isi dulu rencananya ya!");
  }
}

// ==========================================
// Pastikan updateDashboard dipanggil saat halaman pertama kali dimuat
document.addEventListener("DOMContentLoaded", () => {
  tampilkanRencana();
  updateDashboard();
});

// ==========================================
// 5. QUOTE API
// ==========================================
async function ambilQuote() {
  const teksQuote = document.getElementById("teks-quote");
  const penulisQuote = document.getElementById("penulis-quote");

  const quoteLokal = [
    { content: "Coding bukan cuma soal sintaks, tapi soal memecahkan masalah nyata.", author: "Hashiif" },
    { content: "Progres sekecil apa pun adalah langkah menuju selesai.", author: "Anonim" },
    { content: "Teknologi harusnya membantu manusia menjaga lingkungan.", author: "Hashiif" }
  ];

  try {
    teksQuote.innerText = "Memuat nasihat bijak...";
    const respon = await fetch("https://api.quotable.io/random");
    if (!respon.ok) throw new Error("Gagal terhubung API");

    const data = await respon.json();
    if (teksQuote) teksQuote.innerText = `"${data.content}"`;
    if (penulisQuote) penulisQuote.innerText = `- ${data.author}`;
  } catch (error) {
    const random = quoteLokal[Math.floor(Math.random() * quoteLokal.length)];
    if (teksQuote) teksQuote.innerText = `"${random.content}"`;
    if (penulisQuote) penulisQuote.innerText = `- ${random.author}`;
  }
}

// ==========================================
// 6. TIMER
// ==========================================
function updateTampilanTimer() {
  if (!displayTimer) return;

  const menit = Math.floor(waktuTersisa / 60);
  const detik = waktuTersisa % 60;

  displayTimer.innerText =
    `${menit.toString().padStart(2, "0")}:${detik
      .toString()
      .padStart(2, "0")}`;
}

function jalankanTimer() {
  if (timerBerjalan) return;

  timerBerjalan = setInterval(() => {
    if (waktuTersisa > 0) {
      waktuTersisa--;
      updateTampilanTimer();

      const timerCard = document.getElementById("timer-area");
      if (timerCard) {
        if (waktuTersisa <= 10) {
          timerCard.classList.add("timer-warning");
        } else {
          timerCard.classList.remove("timer-warning");
        }
      }
    } else {
      clearInterval(timerBerjalan);
      timerBerjalan = null;

      const timerCard = document.getElementById("timer-area");
      timerCard.classList.add("timer-finish");
      timerCard.classList.remove("timer-warning");

      // Ganti alert() dengan SweetAlert2
      Swal.fire({
        title: 'Waktu Habis!',
        text: 'Istirahat sejenak yuk sebelum lanjut belajar.',
        icon: 'info',
        confirmButtonColor: '#3498db'
      });
    }
  }, 1000);
}

function jedaTimer() {
  clearInterval(timerBerjalan);
  timerBerjalan = null;
}

function resetTimer() {
  jedaTimer();

  const timerCard = document.getElementById("timer-area");
  timerCard.classList.remove("timer-finish", "timer-warning");

  const menitBaru = parseInt(inputDurasi.value) || 25;
  waktuTersisa = menitBaru * 60;

  updateTampilanTimer();
}

// ==========================================
// 7. CHART
// ==========================================
function inisialisasiGrafik() {
  const ctx = document.getElementById("myChart")?.getContext("2d");
  if (!ctx) return;

  myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Belum Selesai", "Selesai"],
      datasets: [{
        data: [rencanaBelajar.length, 0],
        backgroundColor: ["#e74c3c", "#2ecc71"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            padding: 25,
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

function updateGrafik() {
  if (!myChart) return;

  const selesai = rencanaBelajar.filter(item =>
    item.includes("(Selesai!)")
  ).length;

  const belum = rencanaBelajar.length - selesai;

  myChart.data.datasets[0].data = [belum, selesai];
  myChart.update();
}

// ==========================================
// 8. GITHUB API
// ==========================================
async function hubungkanGitHub() {
  const nameEl = document.getElementById("gh-name");  // Beri efek loading sebelum fetch
  if (nameEl) nameEl.classList.add("skeleton");

  try {
    const respon = await fetch("https://api.github.com/users/AmbonOrang");
    const data = await respon.json();

    // Hapus efek skeleton setelah data dapat
    if (nameEl) {
      nameEl.classList.remove("skeleton");
      nameEl.innerText = data.name || data.login;
    }
    // Lanjutkan kode untuk elemen lainnya
  } catch (error) {
    if (nameEl) nameEl.classList.remove("skeleton");
  }
}

// ==========================================
// 9. DARK MODE
// ==========================================
function updateIcon(isDark) {
  if (themeIcon) {
    themeIcon.innerText = isDark ? "☀️" : "🌙";
  }
}

// ==========================================
// 10. EVENT LISTENERS
// ==========================================

// Todo
tombolTambah?.addEventListener("click", tambahRencanaBaru);
inputRencana?.addEventListener("keypress", e => {
  if (e.key === "Enter") tambahRencanaBaru();
});

// Kontak
tombolKontak?.addEventListener("click", () => {
  const namaUser = prompt("Halo! Siapa nama kamu?");
  if (namaUser) {
    alert(`Salam kenal, ${namaUser}!`);
    tombolKontak.innerText = `Halo, ${namaUser}!`;
  }
});

// Quote
tombolQuote?.addEventListener("click", ambilQuote);

// Timer
tombolStart?.addEventListener("click", jalankanTimer);
tombolPause?.addEventListener("click", jedaTimer);
tombolResetTimer?.addEventListener("click", resetTimer);

inputDurasi?.addEventListener("input", () => {
  if (!timerBerjalan) resetTimer();
});

// Dark Mode
tombolTema?.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  updateIcon(isDark);
  localStorage.setItem("tema", isDark ? "dark" : "light");
});

// Back To Top
window.onscroll = () => {
  if (!btnBackToTop) return;

  btnBackToTop.style.display =
    document.documentElement.scrollTop > 300 ? "block" : "none";
};

btnBackToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Hamburger
hamburger?.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  hamburger.classList.toggle("toggle");
});

document.querySelectorAll(".nav-menu a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

// Form
formKontak?.addEventListener("submit", e => {
  e.preventDefault();

  const nama = document.getElementById("nama-kontak").value;
  const email = document.getElementById("email-kontak").value;
  const pesan = document.getElementById("pesan-kontak").value;

  if (nama && email && pesan) {
    // Ganti alert dengan SweetAlert2
    Swal.fire({
      title: 'Terkirim!',
      text: `Terima kasih, ${nama}! Pesan kamu telah diterima.`,
      icon: 'success',
      confirmButtonColor: '#27ae60'
    });

    formKontak.reset();

    const tombol = document.getElementById("btn-kirim");
    tombol.innerText = "Terkirim! ✅";
    tombol.style.backgroundColor = "#3498db";

    setTimeout(() => {
      tombol.innerText = "Kirim Pesan";
      tombol.style.backgroundColor = "#27ae60";
    }, 3000);
  }
});

// ==========================================
// 11. INIT
// ==========================================
inisialisasiGrafik();
tampilkanRencana();
ambilQuote();
hubungkanGitHub();

AOS.init({
  duration: 1000,
  once: true
});

// Load tema awal
if (localStorage.getItem("tema") === "dark") {
  document.body.classList.add("dark-theme");
  updateIcon(true);
}

// Fitur Pintu Rahasia: Tekan 'Shift + A' untuk masuk ke Admin
document.addEventListener('keydown', (e) => {
  if (e.key === 'A' && e.shiftKey) {
      // Kita gunakan SweetAlert2 yang sudah kita pasang kemarin agar keren
      Swal.fire({
          title: 'Akses Admin',
          input: 'password',
          inputLabel: 'Masukkan Password',
          inputPlaceholder: 'Password-nya: 1234',
          showCancelButton: true,
          confirmButtonColor: '#2c3e50'
      }).then((result) => {
          if (result.value === '1234') { // Ganti '1234' dengan password pilihanmu
              window.location.href = 'admin.html';
          } else if (result.value) {
              Swal.fire('Salah!', 'Password yang kamu masukkan salah.', 'error');
          }
      });
  }
});