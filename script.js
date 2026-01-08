// =================================================================
// SYMULACJA DANYCH Z BAZY (Normalnie tu byłoby połączenie z Supabase)
// =================================================================
const mockUserData = {
    nick: "NEXUS_GHOST",
    role: "LVL.4 SECURITY RESEARCHER",
    bio: "Specjalista ds. cyberbezpieczeństwa i ciemnych interfejsów. Tworzę rzeczy, które wyglądają jak z roku 2077.",
    subInfo: "Status: Online | Lokalizacja: Encrypted Node | Ostatnia aktywność: 2min temu",
    projects: [
        { name: "HoloAuth System", status: "Verified (5/5 Stars)" },
        { name: "Neon Database", status: "In Progress..." },
        { name: "Secure Gateway", status: "Verified (4.8/5 Stars)" }
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
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-title">${proj.name}</div>
            <div class="project-status">${proj.status}</div>
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