// Mengambil data dari localStorage yang sama dengan halaman utama
let rencanaBelajar = JSON.parse(localStorage.getItem("myRencana")) || [];

function tampilkanAdminRencana() {
    const container = document.getElementById("admin-list-rencana");
    const statTotal = document.getElementById("total-rencana");
    
    container.innerHTML = "";
    statTotal.innerText = rencanaBelajar.length;

    rencanaBelajar.forEach((item, index) => {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.padding = "10px";
        div.style.borderBottom = "1px solid #eee";

        const teks = typeof item === 'string' ? item : item.teks;

        div.innerHTML = `
            <span>${teks}</span>
            <button onclick="hapusData(${index})" style="color: red; border:none; background:none; cursor:pointer;">Hapus</button>
        `;
        container.appendChild(div);
    });
}

window.hapusData = function(index) {
    if(confirm("Yakin ingin menghapus data ini?")) {
        rencanaBelajar.splice(index, 1);
        localStorage.setItem("myRencana", JSON.stringify(rencanaBelajar));
        tampilkanAdminRencana();
    }
}

document.addEventListener("DOMContentLoaded", tampilkanAdminRencana);