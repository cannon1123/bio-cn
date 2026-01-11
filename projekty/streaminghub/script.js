// =================================================================
// 🔧 KONFIGURACJA PROJEKTU (EDYTUJ TYLKO TO DLA KAŻDEGO FOLDERU)
// =================================================================
const projectConfig = {
    title: "streaminghub",
    status: "VERSION 2.5 [STABLE]",
    description: `StreamingHub to projekt strony internetowej do oglądania filmów online za darmo. Aplikacja wykorzystuje relacyjną bazę danych SQL do przechowywania i zarządzania danymi filmów (tytuły, opisy, kategorie). Warstwa frontendowa została zrealizowana z użyciem JavaScript, zapewniając dynamiczne ładowanie treści oraz interaktywny interfejs użytkownika. Projekt łączy logikę backendową z bazą danych, skupiając się na wydajności, czytelności kodu oraz łatwej nawigacji. ⚠️ Uwaga: Strona może automatycznie przejść w tryb uśpienia lub zostać tymczasowo wyłączona po dłuższym okresie nieaktywności (np. około tygodnia), co wynika z ograniczeń hostingowych, a nie błędów aplikacji.`,
    projectUrl: "https://streaminghub.cnhub.pl",
    
    // USTAWIENIA ZDJĘĆ
    // Tutaj wpisz ścieżkę do folderu. 
    // Jeśli zdjęcia są w tym samym folderze w katalogu 'screens', zostaw "screens/"
    // Jeśli są gdzie indziej, wpisz np. "/projekty/projekt2/screen/"
    screenshotsPath: "/projekty/projekt2/screen/", 
    
    totalScreenshots: 6,
    fileExtension: "png"
};

// =================================================================
// ⚙️ SILNIK STRONY (TEGO NIE MUSISZ RUSZAĆ)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Wypełnienie treścią tekstową
    document.getElementById('proj-name').innerText = projectConfig.title;
    document.getElementById('proj-status').innerText = projectConfig.status;
    document.getElementById('proj-desc').innerHTML = projectConfig.description; // innerHTML żeby działały <br>
    
    const linkBtn = document.getElementById('proj-link');
    if(projectConfig.projectUrl && projectConfig.projectUrl !== "#") {
        linkBtn.href = projectConfig.projectUrl;
    } else {
        linkBtn.style.display = 'none'; // Ukryj przycisk, jeśli brak linku
        linkBtn.innerText = "LINK UNAVAILABLE";
    }

    // 2. Generowanie galerii
    generateGallery();
});

function generateGallery() {
    const container = document.getElementById('gallery-container');
    const showMoreBtn = document.getElementById('show-more-btn');
    
    // Czyścimy kontener
    container.innerHTML = '';

    // Pętla tworząca zdjęcia
// Pętla tworząca zdjęcia (ok. linii 50)
    for (let i = 1; i <= projectConfig.totalScreenshots; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'screenshot-container';

        if (i > 3) {
            wrapper.classList.add('hidden-screen');
        }

        const img = document.createElement('img');
        
        
        // 1. Pobieramy ścieżkę z configu (lub używamy domyślnej 'screens/')
        let path = projectConfig.screenshotsPath || "screens/";
        
        // 2. Jeśli zapomniałeś o ukośniku na końcu, dodajemy go automatycznie
        if (!path.endsWith('/')) {
            path += '/';
        }

        // 3. Sklejamy całość: ścieżka + nazwa pliku + rozszerzenie
        img.src = `${path}screen${i}.${projectConfig.fileExtension}`;
        
        // ======================================================

        img.alt = `${projectConfig.title} - Screenshot ${i}`;
        // ... reszta kodu bez zmian ...
        img.className = 'project-img';
        
        img.onerror = function() {
            this.style.display = 'none';
        };

        wrapper.appendChild(img);
        container.appendChild(wrapper);
    }

    // 3. Obsługa przycisku "Pokaż więcej"
    if (projectConfig.totalScreenshots > 3) {
        showMoreBtn.style.display = 'block';
        
        showMoreBtn.addEventListener('click', function() {
            // Znajdź wszystkie ukryte elementy
            const hiddenItems = document.querySelectorAll('.hidden-screen');
            
            hiddenItems.forEach(item => {
                // Efektowne pojawienie się (fade in)
                item.style.opacity = '0';
                item.classList.remove('hidden-screen');
                setTimeout(() => { item.style.opacity = '1'; }, 50);
            });

            // Ukryj przycisk po rozwinięciu
            this.style.display = 'none';
        });
    }
}