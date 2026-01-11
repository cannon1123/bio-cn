// Lista folderów z projektami
// Lista folderów z projektami
const projectFolders = [
    { 
        id: "streaminghub", 
        name: "STREAMINGHUB", 
        desc: "Aplikacja webowa do streamingu treści z wykorzystaniem JavaScript i SQL.", 
        // Tutaj podajesz dokładną ścieżkę do obrazka:
        img: "streaminghub/screen/screen1.png" 
    },
    { 
        id: "soon", 
        name: "SOON", 
        desc: "Wkrótce...", 
        // Przykład innej ścieżki, o którą pytałeś:
        img: "https://via.placeholder.com/300x150?text=SOON" 
    },
    { 
        id: "soon", 
        name: "SOON", 
        desc: "Wkrótce...", 
        // Możesz też dać link do placeholder'a:
        img: "https://via.placeholder.com/300x150?text=SOON" 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    
    projectFolders.forEach(folder => {
        // ZMIANA: Pobieramy ścieżkę obrazka z definicji obiektu (folder.img)
        // Jeśli nie podano img, używamy starej metody jako zapasowej
        const thumbUrl = folder.img ? folder.img : `${folder.id}/screen/screen1.png`;
        
        // Link do projektu pozostaje bez zmian (chyba że też chcesz go ręcznie ustawiać)
        const projectLink = `${folder.id}/index.html`;

        const card = document.createElement('a');
        card.className = 'project-item';
        card.href = projectLink;
        
        card.innerHTML = `
            <div class="thumb-wrapper">
                <img src="${thumbUrl}" alt="${folder.name}" onerror="this.src='https://via.placeholder.com/300x150?text=NO+IMAGE'">
            </div>
            <div class="project-details">
                <span class="folder-tag">DIR: /${folder.id}</span>
                <h3>${folder.name}</h3>
                <p>${folder.desc}</p>
                <div class="view-btn">ACCESS DATA</div>
            </div>
        `;
        
        grid.appendChild(card);
    });
});