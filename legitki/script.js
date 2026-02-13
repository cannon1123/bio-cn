// =================================================================
// SECURITY MODULE (Anti-Debug & Protection)
// =================================================================
(function() {
    // 1. Blokada Prawego Przycisku
    document.addEventListener('contextmenu', event => event.preventDefault());

    // 2. Blokada Skrótów Klawiszowych
    document.onkeydown = function(e) {
        if(e.keyCode == 123) return false; // F12
        if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false; // Ctrl+Shift+I
        if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) return false; // Ctrl+Shift+C
        if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false; // Ctrl+Shift+J
        if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false; // Ctrl+U
    }

    // 3. Console Clearing & Debugger Loop (Hardcore mode)
    // Uwaga: To może irytować przy developmencie, zakomentuj jeśli testujesz sam.
    setInterval(() => {
        console.clear();
        // console.log("%c SYSTEM SECURED BY CANNON ", "color: #00ff88; background: #000; font-size: 20px; padding: 10px;");
    }, 2000);

    // Prosty debugger trap
    setInterval(function() {
        (function() {}.constructor("debugger")());
    }, 1000);
})();


// =================================================================
// MOCK DATA (Baza Danych - Symulacja)
// =================================================================

// Helper: Generuje losowy base64 (kolorowy kwadrat) dla testu, 
// normalnie tu będą prawdziwe screeny z DB.
function getMockBase64(color) {
    // Zwraca mały pixel w base64, żeby nie zaśmiecać kodu
    return `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iODAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiR7Y29sb3J9Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGR5PSIuM2VtIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSI+UFJPT0Y8L3RleHQ+PC9zdmc+`;
}

const mockReviews = [
    {
        id: 1,
        nick: "K4mil_Dev",
        boughtTimes: 3,
        totalSpent: "150 PLN",
        rating: 5.0,
        text: "Najlepszy dev, wszystko śmiga. Skrypt pod bio działa idealnie. Polecam!",
        images: [getMockBase64('#003366'), getMockBase64('#004488')] 
    },
    {
        id: 2,
        nick: "Anon_User99",
        boughtTimes: 1,
        totalSpent: "40 PLN",
        rating: 4.5,
        text: "Dobre, ale instalacja chwilę zajęła. Support pomógł w 5 minut.",
        images: [getMockBase64('#660033')] // Tylko 1 zdjęcie
    },
    {
        id: 3,
        nick: "BigBoss",
        boughtTimes: 12,
        totalSpent: "1200 PLN",
        rating: 5.0,
        text: "Kupiłem pakiet VIP. Wszystko bangla. Legit w opór. Tutaj macie screeny z panelu.",
        // 4 zdjęcia - powinno ukryć 2
        images: [
            getMockBase64('#006600'), 
            getMockBase64('#008800'), 
            getMockBase64('#00aa00'), 
            getMockBase64('#00cc00')
        ]
    }
];

// =================================================================
// LOGIC
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Symulacja pobierania z bazy
    setTimeout(() => {
        renderReviews(mockReviews);
        calculateGlobalStats(mockReviews);
    }, 1000);
});

function calculateGlobalStats(reviews) {
    const total = reviews.length;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = total > 0 ? (sum / total).toFixed(2) : "0.00"; // Np. 4.83

    // Animacja licznika
    animateValue("global-rating-val", 0, parseFloat(avg), 1500);
    
    document.getElementById('total-reviews-count').innerText = total;

    // Generowanie gwiazdek globalnych (z dokładnością)
    // Tutaj prosta wersja tekstowa lub graficzna
    // Można to rozbudować o pasek wypełnienia w CSS
}

function renderReviews(reviews) {
    const container = document.getElementById('reviews-list');
    container.innerHTML = ''; // Czyścimy loader

    reviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';
        
        // Gwiazdki (prosta pętla)
        let starsHtml = '';
        for(let i=1; i<=5; i++) {
            if(i <= Math.floor(review.rating)) starsHtml += '★';
            else if(i === Math.ceil(review.rating) && !Number.isInteger(review.rating)) starsHtml += '½'; // Opcjonalnie pół gwiazdki
            else starsHtml += '☆';
        }

        // Obsługa obrazków
        let imagesHtml = '<div class="review-gallery">';
        let hiddenImagesHtml = '';
        let expandBtnHtml = '';

        if(review.images && review.images.length > 0) {
            // Pierwsze 2 zdjęcia
            review.images.slice(0, 2).forEach(img => {
                imagesHtml += `<img src="${img}" class="gallery-img" onclick="openFullImage('${img}')">`;
            });

            // Pozostałe zdjęcia (ukryte)
            if(review.images.length > 2) {
                const remaining = review.images.length - 2;
                hiddenImagesHtml = `<div class="hidden-images" id="gallery-hidden-${review.id}" style="display: none; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px;">`;
                
                review.images.slice(2).forEach(img => {
                    hiddenImagesHtml += `<img src="${img}" class="gallery-img" onclick="openFullImage('${img}')">`;
                });
                hiddenImagesHtml += `</div>`;

                expandBtnHtml = `<button class="expand-btn" onclick="toggleGallery(${review.id}, this)">
                                    [+] ZOBACZ WIĘCEJ DOWODÓW (${remaining})
                                 </button>`;
            }
        }
        imagesHtml += '</div>'; // Koniec głównej galerii

        card.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <h3>${review.nick}</h3>
                    <div class="reviewer-stats">
                        <div class="stat-item">KUPIŁ: <span>${review.boughtTimes}x</span></div>
                        <div class="stat-item">WYDAŁ: <span>${review.totalSpent}</span></div>
                    </div>
                </div>
                <div class="review-stars">${review.rating} ${starsHtml}</div>
            </div>
            <div class="review-content">"${review.text}"</div>
            ${imagesHtml}
            ${hiddenImagesHtml}
            ${expandBtnHtml}
        `;

        container.appendChild(card);
    });
}

// Funkcja rozwijania zdjęć
window.toggleGallery = function(id, btn) {
    const hiddenDiv = document.getElementById(`gallery-hidden-${id}`);
    if (hiddenDiv.style.display === 'none') {
        hiddenDiv.style.display = 'grid'; // Grid żeby pasowało do reszty
        btn.innerHTML = '[-] UKRYJ DOWODY';
    } else {
        hiddenDiv.style.display = 'none';
        btn.innerHTML = '[+] ZOBACZ WIĘCEJ DOWODÓW';
    }
};

// Funkcja (placeholder) do powiększania zdjęć
window.openFullImage = function(src) {
    // Tutaj można dodać prosty lightbox modal
    console.log("Opening image:", src);
    // Na razie proste otwarcie w nowej karcie dla testu
    // window.open(src, '_blank');
};

// Helper do animacji liczb
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = (progress * (end - start) + start).toFixed(2);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}