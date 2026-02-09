// =================================================================
// KONFIGURACJA I SYMULOWANA BAZA DANYCH
// =================================================================

// Stan aplikacji
let currentUser = null; // null = niezalogowany

// Mockowe dane użytkownika (Bio)
const bioData = {
    nick: "⎝𝓬𝓪𝓷𝓷𝓸𝓷⎠",
    role: "LVL.4 SECURITY RESEARCHER",
    bio: "Jestem początkującym programistą. Tworzę strony WWW i aplikacje. Specjalizacja: Frontend & Security.",
    subInfo: "C++ / HTML / CSS / JS / SQL",
    projects: [
        { name: "moje projekty", status: "ZOBACZ PROJEKT", url: "/projekty/" },
        { name: "legitki", status: "zobacz opinie", url: "#", action: "switchView('legitki')" }, // Link wewnętrzny
        { name: "soon", status: "wkrótce", url: "#" },
        { name: "soon", status: "wkrótce", url: "#" },
    ],
    socials: [
        { name: "DISCORD", url: "#" },
        { name: "GITHUB", url: "#" },
        { name: "TWITTER", url: "#" }
    ]
};

// Mockowe dane legitek (Baza danych Supabase wyglądałaby podobnie)
let legitkiData = [
    { 
        id: 1,
        client: "Anon_User", 
        project: "Skrypt logowania", 
        price: 150, 
        desc: "Szybka realizacja, wszystko działa. Polecam.",
        link: "https://github.com",
        image: null // null lub base64 string
    },
    { 
        id: 2,
        client: "Firma_XYZ", 
        project: "Strona Wizytówka", 
        price: 400, 
        desc: "Dobry kontakt, ładny design. Trochę opóźnienia, ale warto.",
        link: "",
        image: null 
    }
];

// =================================================================
// INICJALIZACJA
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Opóźnienie startowe (animacja rzutnika)
    setTimeout(() => {
        populateBio();
    }, 2500);
    
    // Obsługa inputu pliku (podgląd)
    document.getElementById('inp-image').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                const previewDiv = document.getElementById('preview-container');
                previewDiv.innerHTML = `<img src="${evt.target.result}" style="width: 50px; height: 50px; margin-top: 5px; border: 1px solid #00d9ff;">`;
            };
            reader.readAsDataURL(file);
        }
    });
});

// =================================================================
// LOGIKA NAWIGACJI (SPA)
// =================================================================

function switchView(viewName) {
    // Ukryj wszystkie widoki
    document.querySelectorAll('.view-section').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active-view');
    });

    // Pokaż wybrany widok
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
        target.style.display = 'block';
        // Mały hack na animację CSS
        setTimeout(() => target.classList.add('active-view'), 10);
    }

    // Aktualizacja przycisków menu
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // Logika przycisków
    if(viewName === 'bio') document.querySelector('button[onclick="switchView(\'bio\')"]').classList.add('active');
    if(viewName === 'legitki') {
        document.querySelector('button[onclick="switchView(\'legitki\')"]').classList.add('active');
        renderLegitki(); // Odśwież listę przy wejściu
    }
    if(viewName === 'login') document.getElementById('auth-btn').classList.add('active');
}

// =================================================================
// RENDEROWANIE TREŚCI
// =================================================================

function populateBio() {
    document.getElementById('user-nick').innerText = bioData.nick;
    document.getElementById('user-role').innerText = bioData.role;
    document.getElementById('bio-text').innerText = bioData.bio;
    document.getElementById('sub-info').innerText = bioData.subInfo;

    const projectsContainer = document.getElementById('projects-list');
    projectsContainer.innerHTML = '';
    
    bioData.projects.forEach(proj => {
        const card = document.createElement('a');
        card.className = 'project-card';
        card.href = proj.url;
        // Obsługa wewnetrznego przełączania widoku jeśli zdefiniowano action
        if(proj.action) {
            card.onclick = (e) => { e.preventDefault(); eval(proj.action); };
        }
        
        card.innerHTML = `
            <div class="project-title">${proj.name}</div>
            <div class="project-status" style="color: #00ff88;">${proj.status}</div>
        `;
        projectsContainer.appendChild(card);
    });

    const socialsContainer = document.getElementById('social-links');
    socialsContainer.innerHTML = '';
    bioData.socials.forEach(soc => {
        const link = document.createElement('a');
        link.href = soc.url;
        link.innerText = soc.name;
        link.addEventListener('mouseenter', function() { this.style.textShadow = "0 0 15px rgba(0, 217, 255, 1)"; });
        link.addEventListener('mouseleave', function() { this.style.textShadow = "none"; });
        socialsContainer.appendChild(link);
    });
}

function renderLegitki() {
    const list = document.getElementById('legitki-list');
    list.innerHTML = '';

    // 1. Obliczanie statystyk
    let totalEarned = 0;
    legitkiData.forEach(item => totalEarned += parseInt(item.price));
    
    document.getElementById('total-earnings').innerText = totalEarned + " PLN";
    document.getElementById('total-vouches').innerText = legitkiData.length;

    // 2. Kontrola Admina (przycisk dodawania)
    const adminPanel = document.getElementById('admin-controls');
    if (currentUser && currentUser.role === 'admin') {
        adminPanel.style.display = 'block';
    } else {
        adminPanel.style.display = 'none';
    }

    // 3. Generowanie listy
    // Odwracamy tablicę, żeby najnowsze były na górze
    [...legitkiData].reverse().forEach(item => {
        const el = document.createElement('div');
        el.className = 'legitka-card';
        
        // Obrazek (jeśli istnieje base64)
        let imgHtml = '';
        if(item.image) {
            imgHtml = `<img src="${item.image}" class="legitka-img-preview" onclick="alert('TODO: Fullscreen image')">`;
        }

        // Link (jeśli istnieje)
        let linkHtml = '';
        if(item.link) {
            linkHtml = `<a href="${item.link}" target="_blank" class="legitka-link">ZOBACZ PROJEKT</a>`;
        }

        el.innerHTML = `
            <div class="legitka-header">
                <span class="client-name">${item.client}</span>
                <span class="project-price">+${item.price} PLN</span>
            </div>
            <div class="legitka-desc">
                <strong>Projekt:</strong> ${item.project}<br>
                "${item.desc}"
            </div>
            ${linkHtml}
            ${imgHtml}
        `;
        list.appendChild(el);
    });
}

// =================================================================
// LOGIKA: LOGOWANIE I SYSTEM KONT
// =================================================================

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    const msg = document.getElementById('login-msg');

    msg.innerText = "VERIFYING ENCRYPTION KEYS...";
    msg.style.color = "#00d9ff";

    // SYMULACJA SPRAWDZANIA Z BAZY
    setTimeout(() => {
        if(email === "admin@cannon.pl" && pass === "admin") {
            // Sukces logowania
            currentUser = {
                nick: "⎝𝓬𝓪𝓷𝓷𝓸𝓷⎠",
                role: "admin"
            };
            msg.innerText = "ACCESS GRANTED. WELCOME BACK.";
            msg.style.color = "#00ff88";
            
            // Zmiana UI
            document.getElementById('auth-btn').innerText = "LOGOUT";
            document.getElementById('auth-btn').onclick = handleLogout;
            
            // Przekieruj do legitek, żeby admin mógł edytować
            setTimeout(() => switchView('legitki'), 1000);
        } else {
            // Błąd
            msg.innerText = "ACCESS DENIED. INVALID CREDENTIALS.";
            msg.style.color = "red";
        }
    }, 1000);
}

function handleLogout() {
    currentUser = null;
    document.getElementById('auth-btn').innerText = "LOGIN";
    document.getElementById('auth-btn').onclick = () => switchView('login');
    switchView('bio');
    alert("SYSTEM: Logged out successfully.");
}

// =================================================================
// LOGIKA: DODAWANIE LEGITKI (BASE64)
// =================================================================

function handleNewLegitka(e) {
    e.preventDefault();
    
    // Zbieranie danych
    const client = document.getElementById('inp-client').value;
    const price = document.getElementById('inp-price').value;
    const project = document.getElementById('inp-project-name').value;
    const link = document.getElementById('inp-link').value;
    const desc = document.getElementById('inp-desc').value;
    const fileInput = document.getElementById('inp-image');

    // Funkcja zapisująca do "bazy"
    const saveToDb = (base64Img) => {
        const newItem = {
            id: Date.now(), // Fake ID
            client: client,
            price: parseInt(price),
            project: project,
            link: link,
            desc: desc,
            image: base64Img
        };

        // Dodaj do tablicy (w Supabase: await supabase.from('legitki').insert(newItem))
        legitkiData.push(newItem);

        // Reset i powrót
        e.target.reset();
        document.getElementById('preview-container').innerHTML = '';
        switchView('legitki');
    };

    // Przetwarzanie obrazka na Base64
    if(fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            saveToDb(evt.target.result); // To jest string Base64
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveToDb(null);
    }
}