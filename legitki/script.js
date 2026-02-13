// =================================================================
// SYSTEM ZABEZPIECZEŃ (ANTI-DEV & ANTI-DEBUG)
// =================================================================
(function() {
    // 1. Blokada prawego przycisku
    document.addEventListener('contextmenu', event => event.preventDefault());

    // 2. Blokada skrótów klawiszowych (F12, Ctrl+Shift+I/J/U/C)
    document.onkeydown = function(e) {
        if(e.keyCode == 123) return false;
        if(e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0) || e.keyCode == 'C'.charCodeAt(0))) return false;
        if(e.ctrlKey && (e.keyCode == 'U'.charCodeAt(0))) return false;
    };

    // 3. Pętla debuggera (utrudnia analizę w konsoli)
    setInterval(function() {
        const start = new Date().getTime();
        debugger; 
        const end = new Date().getTime();
        if (end - start > 100) {
            // Wykryto otwarte devtools - można tu dodać akcję np. window.location.reload()
            document.body.innerHTML = "<h1>SYSTEM SECURITY TRIGGERED</h1>";
        }
    }, 1000);
})();

// =================================================================
// MOCK DATABASE & CONFIG
// =================================================================

// Symulacja zalogowanego użytkownika (zmień na false żeby testować widok gościa)
const currentUser = {
    isLoggedIn: true,
    nick: "Klient_Testowy",
    canReview: true, // Czy może dodać opinię?
    totalSpent: 150, // PLN
    purchaseCount: 3
};

// Przykładowe opinie w bazie
let legitData = [
    {
        id: 1,
        nick: "Anonim_XYZ",
        rating: 5.0,
        text: "Wszystko śmiga, skrypt działa od strzała. Polecam!",
        stats: { bought: 1, spent: "50 PLN" },
        images: [] // Brak zdjęć
    },
    {
        id: 2,
        nick: "Hacker_PL",
        rating: 4.8,
        text: "Dobry kontakt, szybka realizacja. Mały minus za brak dokumentacji na start, ale support pomógł.",
        stats: { bought: 5, spent: "250 PLN" },
        images: [
            "https://via.placeholder.com/150/0000FF/808080?text=Dowod1", // Placeholdery zamiast Base64 dla czytelności kodu tutaj
            "https://via.placeholder.com/150/FF0000/FFFFFF?text=Dowod2",
            "https://via.placeholder.com/150/FFFF00/000000?text=Dowod3" // To powinno być ukryte
        ]
    },
    {
        id: 3,
        nick: "Klient_Pro",
        rating: 4.5,
        text: "Jest okej.",
        stats: { bought: 2, spent: "100 PLN" },
        images: [
            "https://via.placeholder.com/150/000000/FFFFFF?text=Screen1",
            "https://via.placeholder.com/150/000000/FFFFFF?text=Screen2"
        ]
    }
];

// =================================================================
// LOGIKA STRONY
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    calculateStats();
    renderReviews();
    
    // Obsługa przycisku otwierania modalu
    const openBtn = document.getElementById('open-review-form');
    if(openBtn) {
        openBtn.addEventListener('click', () => {
            document.getElementById('review-modal').style.display = 'flex';
        });
    }

    // Obsługa anulowania
    document.getElementById('cancel-review').addEventListener('click', () => {
        document.getElementById('review-modal').style.display = 'none';
    });

    // Slider oceny (live update)
    const rangeInput = document.getElementById('rating-slider');
    rangeInput.addEventListener('input', (e) => {
        document.getElementById('rating-value-display').innerText = parseFloat(e.target.value).toFixed(1);
    });

    // Symulacja wysyłania (na razie tylko console.log)
    document.getElementById('submit-review').addEventListener('click', () => {
        alert("Funkcja zapisu do bazy będzie dostępna po podpięciu backendu!");
        document.getElementById('review-modal').style.display = 'none';
    });
});

function initAuth() {
    const authDisplay = document.getElementById('auth-display');
    const addReviewBox = document.getElementById('add-review-container');

    if (currentUser.isLoggedIn) {
        authDisplay.innerHTML = `<span style='color:#00ff88'>LOGGED: ${currentUser.nick}</span> <button class='auth-btn'>WYLOGUJ</button>`;
        
        // Sprawdzamy czy może dodać opinię
        if (currentUser.canReview) {
            addReviewBox.style.display = 'block';
        }
    } else {
        authDisplay.innerHTML = `<span class='guest-mode'>GOŚĆ</span> <button class='auth-btn'>ZALOGUJ</button>`;
    }
}

function calculateStats() {
    if (legitData.length === 0) return;

    let sum = 0;
    legitData.forEach(r => sum += r.rating);
    let avg = sum / legitData.length;

    // Aktualizacja nagłówka
    document.getElementById('global-score').innerText = avg.toFixed(1);
    document.getElementById('total-count').innerText = `(${legitData.length} opinii)`;
    
    // Generowanie gwiazdek globalnych
    document.getElementById('global-stars').innerHTML = generateStars(avg);
}

function renderReviews() {
    const container = document.getElementById('reviews-list');
    container.innerHTML = ''; // Czyścimy loader

    legitData.forEach(review => {
        const div = document.createElement('div');
        div.className = 'review-item';

        // Logika zdjęć (ukrywanie > 2)
        let imagesHTML = '';
        if (review.images.length > 0) {
            imagesHTML = `<div class="review-images">`;
            review.images.forEach((img, index) => {
                // Jeśli index > 1 (czyli 3 zdjęcie i więcej), dodajemy klasę hidden (lub styl)
                let style = index > 1 ? 'display:none;' : ''; 
                imagesHTML += `<img src="${img}" class="review-img-thumb img-group-${review.id}" style="${style}" onclick="alert('Tu będzie podgląd full screen')">`;
            });
            imagesHTML += `</div>`;
            
            // Przycisk rozwijania
            if (review.images.length > 2) {
                imagesHTML += `<button class="expand-btn" onclick="expandImages(${review.id}, this)">▼ POKAŻ WIĘCEJ (${review.images.length - 2})</button>`;
            }
        }

        div.innerHTML = `
            <div class="review-top">
                <span class="reviewer-name">${review.nick}</span>
                <div class="reviewer-stats">
                    <span class="stat-badge">Kupiono: ${review.stats.bought}x</span>
                    <span class="stat-badge">Wydano: ${review.stats.spent}</span>
                </div>
            </div>
            <div class="review-stars">${generateStars(review.rating)} <span style="color:#666; font-size:9px;">(${review.rating})</span></div>
            <p class="review-text">${review.text}</p>
            ${imagesHTML}
        `;
        container.appendChild(div);
    });
}

// Helper do gwiazdek (prosty system)
function generateStars(rating) {
    let output = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) output += '★'; // Pełna
        else if (i - 0.5 <= rating) output += '⯪'; // Połówka (znaki unicode mogą się różnić zależnie od fonta, tu uproszczone)
        else output += '☆'; // Pusta
    }
    return output;
}

// Funkcja rozwijania zdjęć
window.expandImages = function(id, btn) {
    const hiddenImages = document.querySelectorAll(`.img-group-${id}`);
    hiddenImages.forEach(img => {
        img.style.display = 'block'; // Pokazujemy
        // Opcjonalnie: Dodaj animację wejścia
        img.style.animation = 'fadeIn 0.5s';
    });
    btn.style.display = 'none'; // Ukrywamy przycisk
};