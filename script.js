// =================================================================
// SYMULACJA DANYCH Z BAZY (Normalnie tu byłoby połączenie z Supabase)
// =================================================================
const mockUserData = {
    nick: "⎝𝓬𝓪𝓷𝓷𝓸𝓷⎠",
    role: "LVL.4 SECURITY RESEARCHER",
    bio: "Jestem początkującym programistą, który robi strony i programy hobbystycznie. Chętnie podejmę się stworzenia strony na zamówienie dla zainteresowanych osób!",
    subInfo: "Dostępny na zlecenia | C++ / HTML / CSS / JS",
projects: [
    { name: "moje projekty", status: "ZOBACZ PROJEKT", url: "/projekty/" },
    { name: "legitki", status: "zobacz moje umiejętności", url: "/legitki/" },
    { name: "soon", status: "soon", url: "???" },
    { name: "soon", status: "soon", url: "???" },
],
    socials: [
        { name: "DISCORD", url: "#" },
        { name: "GITHUB", url: "#" },
        { name: "X / TWITTER", url: "#" }
    ]
};

// =================================================================
// GŁÓWNA LOGIKA STRONY
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Symulacja opóźnienia sieciowego (ładowanie danych po wejściu animacji)
    // Czekamy ok. 2.5s, aż główna animacja rzutnika się uspokoi
    setTimeout(() => {
        populateBioData();
    }, 2500);

    // Obsługa przycisku "ACTIVE CARD" - adaptacja logiki z oryginalnego logowania
    const activeBtn = document.getElementById("activeCardBtn");
    activeBtn.addEventListener("click", function () {
        
        // Zmiana wyglądu przycisku na "Sukces" (zielony kolor z oryginału)
        this.style.background = "linear-gradient(135deg, #00ff88 0%, #00ffaa 100%)";
        this.innerHTML = "<span>✓ ACCESSING CARD...</span>";
        this.style.boxShadow = "0 0 50px rgba(0, 255, 136, 0.8)";
        this.style.transform = "translateY(-2px)";

        // Symulacja przekierowania po 1.5 sekundy
        setTimeout(() => {
             // Tutaj nastąpi prawdziwe przekierowanie
             console.log("Redirecting to presentation page...");
             // window.location.href = 'prezentacja.html'; 
             
             // (Opcjonalnie dla testu) Reset przycisku
             this.style.background = "linear-gradient(135deg, #0088ff 0%, #00d9ff 100%)";
             this.innerHTML = "<span>► ACTIVE CARD ACCESS</span>";
             this.style.boxShadow = "0 0 30px rgba(0, 217, 255, 0.4)";
        }, 1500);
    });
});


// Funkcja wstawiająca dane do HTML
function populateBioData() {
    // Wstawianie tekstów
    document.getElementById('user-nick').innerText = mockUserData.nick;
    document.getElementById('user-role').innerText = mockUserData.role;
    document.getElementById('bio-text').innerText = mockUserData.bio;
    document.getElementById('sub-info').innerText = mockUserData.subInfo;

    // Generowanie kafelków projektów
    const projectsContainer = document.getElementById('projects-list');
    projectsContainer.innerHTML = ''; // Wyczyszczenie placeholderów
mockUserData.projects.forEach(proj => {
    // Tworzymy link zamiast div-a
    const card = document.createElement('a'); 
    card.className = 'project-card';
    card.href = proj.url; // Dodajemy adres docelowy
    card.style.textDecoration = 'none'; // Usuwamy podkreślenie linku
    
    card.innerHTML = `
        <div class="project-title">${proj.name}</div>
        <div class="project-status" style="color: #00ff88;">${proj.status}</div>
    `;
    projectsContainer.appendChild(card);
});

    // Generowanie linków social media
    const socialsContainer = document.getElementById('social-links');
    socialsContainer.innerHTML = ''; // Wyczyszczenie placeholderów
    mockUserData.socials.forEach(soc => {
        const link = document.createElement('a');
        link.href = soc.url;
        link.innerText = soc.name;
        // Dodajemy mały efekt hover w JS dla spójności
        link.addEventListener('mouseenter', function() { this.style.textShadow = "0 0 15px rgba(0, 217, 255, 1)"; });
        link.addEventListener('mouseleave', function() { this.style.textShadow = "none"; });
        socialsContainer.appendChild(link);
    });
}