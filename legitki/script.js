// ==========================================
// 1. ZABEZPIECZENIA (Anti-Debug)
// ==========================================
(function() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.onkeydown = function(e) {
        // Blokada F12, Ctrl+Shift+I, itp.
        if(e.keyCode == 123) return false;
        if(e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0))) return false;
        if(e.ctrlKey && (e.keyCode == 'U'.charCodeAt(0))) return false;
    };
    // Delikatna pętla utrudniająca inspekcję (odkomentuj jak chcesz hardkor)
    /* setInterval(() => { debugger; }, 1000); */
})();

// ==========================================
// 2. CONFIG I DANE
// ==========================================
const currentUser = {
    isLogged: true, // Zmień na false żeby ukryć przycisk "Dodaj"
    nick: "Admin_Cannon"
};

const database = [
    { nick: "Klient_1", rating: 5.0, text: "Szybko i sprawnie, polecam!", date: "2024-05-10" },
    { nick: "User_Unknown", rating: 4.5, text: "Działa git, ale instrukcja mogłaby być lepsza.", date: "2024-05-12" },
    { nick: "HackerPL", rating: 5.0, text: "Profeska. Kod czyściutki.", date: "2024-05-14" }
];

// ==========================================
// 3. GŁÓWNA LOGIKA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    loadReviews();

    // Obsługa Modala
    const modal = document.getElementById('modal-overlay');
    const openBtn = document.getElementById('open-modal-btn');
    const cancelBtn = document.getElementById('btn-cancel');
    const submitBtn = document.getElementById('btn-submit');
    const range = document.getElementById('inp-range');

    // Otwieranie
    if(openBtn) {
        openBtn.addEventListener('click', () => {
            modal.style.display = 'flex'; // Zmieniamy z none na flex
        });
    }

    // Zamykanie
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Slider Oceny
    range.addEventListener('input', (e) => {
        document.getElementById('rating-preview').innerText = parseFloat(e.target.value).toFixed(1);
    });

    // Wysyłanie (Symulacja)
    submitBtn.addEventListener('click', () => {
        const title = document.getElementById('inp-title').value;
        if(!title) return alert("Wpisz tytuł!");
        
        // Dodawanie do "bazy" (tylko wizualnie teraz)
        const newReview = {
            nick: currentUser.nick,
            rating: range.value,
            text: document.getElementById('inp-desc').value || "Brak opisu",
            date: "TERAZ"
        };
        
        database.unshift(newReview); // Dodaj na początek
        loadReviews(); // Odśwież listę
        modal.style.display = 'none'; // Zamknij
    });
});

function initAuth() {
    const box = document.getElementById('auth-display');
    const addContainer = document.getElementById('add-btn-container');

    if(currentUser.isLogged) {
        box.innerHTML = `<span class="auth-status">● ${currentUser.nick}</span>`;
        if(addContainer) addContainer.style.display = 'block';
    } else {
        box.innerHTML = `<button style="background:none; border:1px solid #00d9ff; color:#00d9ff; padding:2px 8px; cursor:pointer;">ZALOGUJ</button>`;
    }
}

function loadReviews() {
    const list = document.getElementById('reviews-list');
    list.innerHTML = ""; // Czyść loader

    // Oblicz średnią
    let sum = 0;
    database.forEach(d => sum += parseFloat(d.rating));
    let avg = (database.length > 0) ? (sum / database.length).toFixed(1) : "0.0";

    document.getElementById('global-score').innerText = avg;
    document.getElementById('total-count').innerText = `(${database.length} opinii)`;
    document.getElementById('global-stars').innerText = "★".repeat(Math.round(avg));

    // Generuj HTML
    database.forEach(item => {
        const div = document.createElement('div');
        div.className = 'review-item';
        div.innerHTML = `
            <div class="r-top">
                <span class="r-nick">${item.nick}</span>
                <span style="color:#ffd700">★ ${item.rating}</span>
            </div>
            <div class="r-text">${item.text}</div>
            <div style="font-size:9px; color:#555; text-align:right; margin-top:5px;">${item.date}</div>
        `;
        list.appendChild(div);
    });
}