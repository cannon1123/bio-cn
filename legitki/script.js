// =================================================================
// DANE & KONFIGURACJA
// =================================================================
const appData = {
    user: {
        nick: "⎝𝓬𝓪𝓷𝓷𝓸𝓷⎠",
        role: "HOBBYIST DEVELOPER",
        bio: "Jestem początkującym programistą, który robi strony i programy hobbystycznie. Chętnie podejmę się stworzenia strony na zamówienie!",
        subInfo: "Dostępny na zlecenia | C++ / HTML / CSS / JS"
    },
    projects: [
        { name: "moje projekty", status: "ZOBACZ PROJEKT", url: "/projekty/" },
        { name: "legitki", status: "sprawdź opinie", url: "#", action: "app.switchView('legitki')" },
        { name: "soon", status: "soon", url: "#" },
        { name: "soon", status: "soon", url: "#" }
    ],
    socials: [
        { name: "DISCORD", url: "#" },
        { name: "GITHUB", url: "#" },
        { name: "X / TWITTER", url: "#" }
    ]
};

// Symulowana baza danych (Legitki)
// Obrazki trzymamy tu jako Base64 (w przyszłości zmienisz na URL Supabase)
let dbLegitki = [
    {
        id: 1,
        client: "Kowalski_Dev",
        project: "Bot Discord",
        price: 50,
        desc: "Szybko i sprawnie, polecam.",
        link: "",
        image: null // brak screena
    },
    {
        id: 2,
        client: "Anonim",
        project: "Strona Portfolio",
        price: 150,
        desc: "Super design, 1:1 jak chciałem.",
        link: "https://google.com",
        image: null 
    }
];

// Stan aplikacji
let currentUser = null; // null = gość, {role: 'admin'} = admin

// =================================================================
// LOGIKA APLIKACJI
// =================================================================
const app = {
    // Inicjalizacja (start strony)
    init: () => {
        // Czekamy na animację rzutnika (oryginalne 2.5s)
        setTimeout(() => {
            app.renderBio();
            app.renderLegitki();
        }, 2500);
    },

    // 1. Renderowanie Bio (Twoja stara funkcja, odświeżona)
    renderBio: () => {
        document.getElementById('user-nick').innerText = appData.user.nick;
        document.getElementById('user-role').innerText = appData.user.role;
        document.getElementById('bio-text').innerText = appData.user.bio;
        document.getElementById('sub-info').innerText = appData.user.subInfo;

        const pContainer = document.getElementById('projects-list');
        pContainer.innerHTML = '';
        appData.projects.forEach(p => {
            const el = document.createElement('a');
            el.className = 'project-card';
            el.href = p.url;
            el.style.textDecoration = 'none';
            if(p.action) { 
                el.onclick = (e) => { e.preventDefault(); eval(p.action); };
            }
            el.innerHTML = `<div class="project-title">${p.name}</div><div class="project-status">${p.status}</div>`;
            pContainer.appendChild(el);
        });

        const sContainer = document.getElementById('social-links');
        sContainer.innerHTML = '';
        appData.socials.forEach(s => {
            const el = document.createElement('a');
            el.href = s.url;
            el.innerText = s.name;
            sContainer.appendChild(el);
        });
    },

    // 2. Przełączanie widoków (Bio <-> Legitki <-> Login)
    switchView: (viewName) => {
        // Ukryj wszystko
        document.querySelectorAll('.fade-view').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

        // Pokaż wybrane
        const target = document.getElementById('view-' + viewName);
        if(target) {
            target.style.display = 'block';
            // Znajdź guzik w nawigacji
            const navBtn = document.querySelector(`.nav-item[onclick="app.switchView('${viewName}')"]`);
            if(navBtn) navBtn.classList.add('active');
        }

        // Odśwież dane jeśli wchodzimy w legitki
        if(viewName === 'legitki') app.renderLegitki();
    },

    // 3. Renderowanie Legitek + Obliczanie Zarobków
    renderLegitki: () => {
        const list = document.getElementById('legitki-container');
        list.innerHTML = '';

        let total = 0;
        
        // Odwracamy tablicę (najnowsze na górze)
        [...dbLegitki].reverse().forEach(item => {
            total += parseInt(item.price || 0);

            const div = document.createElement('div');
            div.className = 'legitka-item';
            
            // Opcjonalne elementy
            const imgHtml = item.image ? `<img src="${item.image}" class="l-img">` : '';
            const linkHtml = item.link ? `<a href="${item.link}" target="_blank" class="l-link">[ ZOBACZ PROJEKT ]</a>` : '';

            div.innerHTML = `
                <div class="legitka-header">
                    <span class="l-client">${item.client}</span>
                    <span class="l-price">+${item.price} PLN</span>
                </div>
                <div class="l-project">PROJEKT: ${item.project}</div>
                <div class="l-desc">"${item.desc}"</div>
                ${linkHtml}
                ${imgHtml}
            `;
            list.appendChild(div);
        });

        // Aktualizacja statystyk
        document.getElementById('stat-money').innerText = total + " PLN";
        document.getElementById('stat-count').innerText = dbLegitki.length;

        // Widoczność guzika admina
        const isAdmin = currentUser && currentUser.role === 'admin';
        document.getElementById('admin-panel').style.display = isAdmin ? 'block' : 'none';
    },

    // 4. Logowanie (Prosta symulacja)
    handleLogin: (e) => {
        e.preventDefault();
        const u = document.getElementById('login-user').value;
        const p = document.getElementById('login-pass').value;
        const msg = document.getElementById('login-msg');

        if(u === 'admin' && p === 'admin') { // HASŁO
            currentUser = { role: 'admin' };
            msg.style.color = '#00ff88';
            msg.innerText = "ACCESS GRANTED";
            
            // Zmiana menu na Logout
            const navBtn = document.getElementById('btn-login-nav');
            navBtn.innerText = "[ LOGOUT ]";
            navBtn.onclick = app.handleLogout;

            setTimeout(() => app.switchView('legitki'), 1000);
        } else {
            msg.style.color = 'red';
            msg.innerText = "ACCESS DENIED";
        }
    },

    handleLogout: () => {
        currentUser = null;
        const navBtn = document.getElementById('btn-login-nav');
        navBtn.innerText = "[ LOGIN ]";
        navBtn.onclick = () => app.switchView('login');
        app.switchView('bio');
        alert("Wylogowano.");
    },

    // 5. Dodawanie Legitki (Base64)
    handleAddLegitka: (e) => {
        e.preventDefault();
        
        const client = document.getElementById('inp-client').value;
        const project = document.getElementById('inp-project').value;
        const price = document.getElementById('inp-price').value;
        const link = document.getElementById('inp-link').value;
        const desc = document.getElementById('inp-desc').value;
        
        // Zapisujemy screena z podglądu (jeśli jest)
        const previewBox = document.getElementById('img-preview-box');
        const imgBase64 = previewBox.querySelector('img') ? previewBox.querySelector('img').src : null;

        const newItem = {
            id: Date.now(),
            client, project, price, link, desc, image: imgBase64
        };

        // Dodaj do bazy
        dbLegitki.push(newItem);
        
        // Reset i powrót
        e.target.reset();
        previewBox.innerHTML = '';
        app.switchView('legitki');
    },

    // Podgląd obrazka przed uploadem
    handleFilePreview: (input) => {
        if(input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('img-preview-box').innerHTML = 
                    `<img src="${e.target.result}" style="width:50px; border:1px solid #00d9ff; margin-top:5px;">`;
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
};

// Start po załadowaniu DOM
document.addEventListener('DOMContentLoaded', app.init);