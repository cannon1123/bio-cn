// Lista folderów z projektami
const projectFolders = [
    { id: "projekt_1", name: "HoloAuth System", desc: "System autoryzacji opartej o kryptografię." },
    { id: "projekt_2", name: "Neon Database", desc: "Zabezpieczona baza danych SQL." },
    { id: "projekt_3", name: "Cyber Shell", desc: "Emulator terminala w przeglądarce." }
];

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    
    projectFolders.forEach(folder => {
        // Ścieżka do miniatury: folder/screens/screen1.png
        const thumbUrl = `${folder.id}/screens/screen1.png`;
        // Ścieżka do podstrony projektu: folder/index.html
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