// =================================================================
// 🔧 KONFIGURACJA PROJEKTU (EDYTUJ TYLKO TO DLA KAŻDEGO FOLDERU)
// =================================================================
const projectConfig = {
    title: "streaminghub",          // Nazwa projektu
    status: "VERSION 2.5 [STABLE]",  // Status (np. W Budowie, Ukończony)
    description: `
        StreamingHub to projekt strony internetowej do oglądania filmów online za darmo. Aplikacja wykorzystuje relacyjną bazę danych SQL do przechowywania i zarządzania danymi filmów (tytuły, opisy, kategorie). Warstwa frontendowa została zrealizowana z użyciem JavaScript, zapewniając dynamiczne ładowanie treści oraz interaktywny interfejs użytkownika. Projekt łączy logikę backendową z bazą danych, skupiając się na wydajności, czytelności kodu oraz łatwej nawigacji.

⚠️ Uwaga: Strona może automatycznie przejść w tryb uśpienia lub zostać tymczasowo wyłączona po dłuższym okresie nieaktywności (np. około tygodnia), co wynika z ograniczeń hostingowych, a nie błędów aplikacji.
    `,
    projectUrl: "https://streaminghub.cnhub.pl", // Link do przycisku
    
    // USTAWIENIA ZDJĘĆ
    // Skrypt szuka zdjęć w folderze "screens" o nazwach: screen1.png, screen2.png itd.
    totalScreenshots: 5,   // Ile masz łącznie zdjęć w folderze screens?
    fileExtension: "png"   // Czy zdjęcia to .png czy .jpg?
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
    for (let i = 1; i <= projectConfig.totalScreenshots; i++) {
        // Tworzymy wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'screenshot-container';

        // Jeśli to 4. lub kolejne zdjęcie, dodaj klasę ukrywającą
        if (i > 3) {
            wrapper.classList.add('hidden-screen');
        }

        // Tworzymy obrazek
        // Ścieżka: ./screens/screen1.png
        const img = document.createElement('img');
        img.src = `screens/screen${i}.${projectConfig.fileExtension}`;
        img.alt = `${projectConfig.title} - Screenshot ${i}`;
        img.className = 'project-img';
        
        // Obsługa błędu ładowania obrazka (gdyby pliku brakowało)
        img.onerror = function() {
            this.style.display = 'none';
            console.warn(`Błąd ładowania: screens/screen${i}.${projectConfig.fileExtension}`);
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