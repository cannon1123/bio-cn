const mockUserData = {
    nick: "⎝𝓬𝓪𝓷𝓷𝓸𝓷⎠",
    role: "HOBBYIST DEVELOPER",
    bio: "Jestem początkującym programistą, który robi strony i programy hobbystycznie. Chętnie podejmę się stworzenia strony na zamówienie dla zainteresowanych osób!",
    subInfo: "Dostępny na zlecenia | C++ / HTML / CSS / JS",
    // TU WPISZ LINKI DO SWOICH PODSTRON
    navigation: [
        { name: "LEGIT CHECKI", status: "OPEN", url: "legit.html" },
        { name: "STRONA POKAZOWA", status: "ACTIVE", url: "pokazowa.html" },
        { name: "ZAMÓWIENIA", status: "CONTACT", url: "order.html" }
    ],
    socialLinks: {
        discord: "https://discord.gg/TWOJ-LINK"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Animacja ładowania danych
    setTimeout(() => {
        document.getElementById('user-nick').innerText = mockUserData.nick;
        document.getElementById('user-role').innerText = mockUserData.role;
        document.getElementById('bio-text').innerText = mockUserData.bio;
        document.getElementById('sub-info').innerText = mockUserData.subInfo;
        document.getElementById('discord-link').href = mockUserData.socialLinks.discord;

        const navContainer = document.getElementById('projects-list');
        navContainer.innerHTML = ''; 

        mockUserData.navigation.forEach(item => {
            const btn = document.createElement('a');
            btn.className = 'project-card';
            btn.href = item.url;
            btn.innerHTML = `
                <span class="project-title">${item.name}</span>
                <span class="project-status">${item.status}</span>
            `;
            navContainer.appendChild(btn);
        });
    }, 1500);
});