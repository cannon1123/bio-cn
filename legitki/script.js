// =================================================================
// 1. SECURITY MODULE (Blokady)
// =================================================================
document.addEventListener('contextmenu', event => event.preventDefault());

document.onkeydown = function(e) {
    if(e.keyCode == 123) return false; // F12
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false;
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) return false;
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false;
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
};

// =================================================================
// 2. DANE TESTOWE (MOCK DATA)
// =================================================================
// Placeholder Base64 image (niebieski kwadrat)
const mockImg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iODAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDMzNjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZHk9Ii4zZW0iIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIj5QUkRTRzwvdGV4dD48L3N2Zz4=";

const reviewsData = [
    {
        id: 1,
        nick: "K4mil_Dev",
        bought: 3,
        spent: "150 PLN",
        rating: 5.0,
        text: "Szybka realizacja, wszystko działa jak należy. Polecam!",
        images: [mockImg, mockImg]
    },
    {
        id: 2,
        nick: "Anonim_99",
        bought: 1,
        spent: "40 PLN",
        rating: 4.5,
        text: "Trochę problemów przy konfiguracji, ale support pomógł.",
        images: [mockImg]
    },
    {
        id: 3,
        nick: "Big_Boss_2024",
        bought: 15,
        spent: "2500 PLN",
        rating: 5.0,
        text: "Kupiłem pakiet VIP. Działa wyśmienicie. Poniżej dowody zakupu.",
        // Dużo zdjęć, aby przetestować przycisk "Rozwiń"
        images: [mockImg, mockImg, mockImg, mockImg, mockImg]
    }
];

// =================================================================
// 3. LOGIKA APLIKACJI
// =================================================================

document.addEventListener("DOMContentLoaded", () => {
    // A. Symulacja Ładowania
    setTimeout(() => {
        const loader = document.getElementById('loader-screen');
        const content = document.getElementById('main-content');
        
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            content.style.display = 'block';
            
            // Dopiero po załadowaniu liczymy statystyki
            initApp();
        }, 500);
    }, 2000); // Czas trwania loadera: 2 sekundy
});

function initApp() {
    renderStats();
    renderReviews();
}

function renderStats() {
    const total = reviewsData.length;
    // Średnia
    const sum = reviewsData.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = total > 0 ? (sum / total).toFixed(2) : "0.00";

    // Animacja liczby
    animateNumber("global-rating-val", 0, parseFloat(avg), 1500);
    document.getElementById('total-reviews').innerText = total;

    // Aktualizacja gwiazdek w nagłówku (prosta wersja)
    const starsContainer = document.getElementById('global-stars');
    starsContainer.innerHTML = getStarsHTML(avg);
}

function renderReviews() {
    const container = document.getElementById('reviews-container');
    container.innerHTML = '';

    reviewsData.forEach(rev => {
        const card = document.createElement('div');
        card.className = 'review-card';

        // Obsługa zdjęć
        let galleryHTML = '';
        if (rev.images.length > 0) {
            // Pierwsze 2 zdjęcia widoczne
            const visibleImgs = rev.images.slice(0, 2).map(src => `<img src="${src}" class="proof-img">`).join('');
            
            // Reszta ukryta
            let hiddenImgs = '';
            let btnHTML = '';
            
            if (rev.images.length > 2) {
                hiddenImgs = `<div class="hidden-content" id="hidden-${rev.id}" style="display:none; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 8px;">
                                ${rev.images.slice(2).map(src => `<img src="${src}" class="proof-img">`).join('')}
                              </div>`;
                btnHTML = `<button class="expand-btn" onclick="toggleGallery(${rev.id}, this)">[+] POKAŻ WIĘCEJ (${rev.images.length - 2})</button>`;
            }

            galleryHTML = `<div class="gallery-grid">${visibleImgs}</div> ${hiddenImgs} ${btnHTML}`;
        }

        card.innerHTML = `
            <div class="card-top">
                <div>
                    <div class="user-nick">${rev.nick}</div>
                    <div class="user-stats">
                        <span>KUPIŁ: ${rev.bought}x</span>
                        <span>WYDAŁ: ${rev.spent}</span>
                    </div>
                </div>
                <div class="card-rating">${rev.rating} ★</div>
            </div>
            <div class="review-text">"${rev.text}"</div>
            ${galleryHTML}
        `;
        container.appendChild(card);
    });
}

// Funkcja pomocnicza do generowania gwiazdek
function getStarsHTML(rating) {
    let output = '';
    for(let i=1; i<=5; i++) {
        if(i <= Math.round(rating)) output += '★';
        else output += '☆';
    }
    return output;
}

// Animacja licznika
function animateNumber(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = (progress * (end - start) + start).toFixed(2);
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

// Funkcja globalna (dostępna dla HTML) do rozwijania
window.toggleGallery = function(id, btn) {
    const hiddenDiv = document.getElementById(`hidden-${id}`);
    if (hiddenDiv.style.display === 'none') {
        hiddenDiv.style.display = 'grid'
    }
}