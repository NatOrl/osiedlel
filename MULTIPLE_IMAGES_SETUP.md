# 🖼️ Instrukcja: Wiele Zdjęć w Ogłoszeniach z Karuzelą

## Przegląd

System ogłoszeń został rozszerzony o możliwość dodawania wielu zdjęć do jednego ogłoszenia. Gdy ogłoszenie ma więcej niż 2 zdjęcia, automatycznie wyświetlana jest karuzela z nawigacją.

## 🚀 Szybki Start

### Krok 1: Uruchom Migrację Bazy Danych

```bash
setup-multiple-images.bat
```

Ten skrypt:
- Usuwa stare kolumny `image_url` i `image_alt`
- Dodaje nową kolumnę `images` typu JSONB
- Tworzy indeks dla lepszej wydajności

### Krok 2: Zrestartuj Serwery

```bash
# Terminal 1 - Backend
start-backend.bat

# Terminal 2 - Frontend  
start-frontend.bat
```

## 📋 Funkcjonalność

### Dla Administratorów

1. **Dodawanie Wielu Zdjęć:**
   - Przejdź do panelu Administracja
   - Kliknij "Dodaj Ogłoszenie"
   - Wybierz wiele plików naraz (Ctrl+klik lub Shift+klik)
   - Każde zdjęcie może mieć własny opis alternatywny
   - Możesz usunąć poszczególne zdjęcia przed zapisaniem

2. **Edycja Ogłoszenia:**
   - Istniejące zdjęcia są zachowane
   - Możesz dodać nowe zdjęcia
   - Możesz usunąć wybrane zdjęcia
   - Możesz edytować opisy alternatywne

### Dla Użytkowników

**Wyświetlanie Zdjęć:**
- **1-2 zdjęcia:** Wyświetlane obok siebie w siatce
- **3+ zdjęcia:** Automatyczna karuzela z:
  - Nawigacją strzałkami (← →)
  - Wskaźnikami kropek
  - Automatycznym przewijaniem co 5 sekund
  - Możliwością zatrzymania na hover

## 🔧 Szczegóły Techniczne

### Backend

**Struktura Danych w Bazie:**
```sql
-- Kolumna images przechowuje tablicę JSON
images JSONB DEFAULT '[]'::jsonb

-- Przykładowa zawartość:
[
  {"url": "/uploads/announcements/image1.jpg", "alt": "Opis 1"},
  {"url": "/uploads/announcements/image2.jpg", "alt": "Opis 2"},
  {"url": "/uploads/announcements/image3.jpg", "alt": "Opis 3"}
]
```

**API Endpoints:**
- `POST /api/upload/announcement-image` - Przesyłanie pojedynczego zdjęcia
- `POST /api/posts` - Tworzenie ogłoszenia z tablicą images
- `PUT /api/posts/:id` - Aktualizacja ogłoszenia z tablicą images

### Frontend

**Nowe Komponenty:**
- `ImageCarousel` - Komponent karuzeli (wbudowany w Announcements.jsx)
- Obsługa wielu plików w Administration.jsx
- Automatyczne wykrywanie liczby zdjęć i wybór trybu wyświetlania

**Logika Wyświetlania:**
```javascript
if (images.length === 0) {
  // Brak zdjęć - nie wyświetlaj nic
} else if (images.length <= 2) {
  // 1-2 zdjęcia - siatka
  <div className="announcement-images-grid">
} else {
  // 3+ zdjęcia - karuzela
  <ImageCarousel images={images} />
}
```

## 🎨 Stylizacja Karuzeli

**Funkcje:**
- Płynne przejścia między slajdami
- Responsywny design
- Wskaźniki aktywnego slajdu
- Przyciski nawigacji z efektami hover
- Automatyczne przewijanie z możliwością zatrzymania

**CSS Classes:**
- `.carousel-container` - Główny kontener
- `.carousel-slide` - Pojedynczy slajd
- `.carousel-button` - Przyciski nawigacji
- `.carousel-indicators` - Wskaźniki kropek

## 📝 Przykład Użycia

### Dodawanie Ogłoszenia z Wieloma Zdjęciami

```javascript
// 1. Wybierz wiele plików
<input 
  type="file" 
  multiple 
  accept="image/*"
  onChange={handleImagesSelect}
/>

// 2. Prześlij wszystkie zdjęcia
const uploadedImages = await uploadImages();

// 3. Zapisz ogłoszenie
await fetch('/api/posts', {
  method: 'POST',
  body: JSON.stringify({
    title: 'Tytuł',
    content: 'Treść',
    images: [
      {url: '/uploads/img1.jpg', alt: 'Opis 1'},
      {url: '/uploads/img2.jpg', alt: 'Opis 2'},
      {url: '/uploads/img3.jpg', alt: 'Opis 3'}
    ]
  })
});
```

## 🐛 Rozwiązywanie Problemów

### Problem: Stare ogłoszenia nie mają zdjęć

**Przyczyna:** Migracja usuwa stare kolumny `image_url` i `image_alt`

**Rozwiązanie:**
1. Przed migracją wykonaj backup bazy danych
2. Po migracji ręcznie dodaj zdjęcia do starych ogłoszeń przez panel administracji

### Problem: Karuzela nie działa

**Rozwiązanie:**
1. Sprawdź konsolę przeglądarki (F12)
2. Upewnij się że ogłoszenie ma więcej niż 2 zdjęcia
3. Wyczyść cache przeglądarki (Ctrl+Shift+R)

### Problem: Zdjęcia nie przesyłają się

**Rozwiązanie:**
1. Sprawdź rozmiar plików (max 5MB każdy)
2. Sprawdź format (jpg, png, gif, webp)
3. Sprawdź logi backendu

## 🎯 Najlepsze Praktyki

### Dla Administratorów

1. **Liczba Zdjęć:**
   - Optymalna: 3-5 zdjęć na ogłoszenie
   - Maksymalna: bez limitu, ale zalecane do 10

2. **Rozmiar i Jakość:**
   - Kompresuj zdjęcia przed przesłaniem
   - Zalecana rozdzielczość: 1200x800px
   - Format: JPEG dla zdjęć, PNG dla grafik

3. **Opisy Alternatywne:**
   - Zawsze dodawaj opisy dla dostępności
   - Opisuj co jest na zdjęciu, nie jak wygląda
   - Bądź zwięzły ale konkretny

### Dla Deweloperów

1. **Wydajność:**
   - Lazy loading jest włączony automatycznie
   - Karuzela ładuje tylko widoczne slajdy
   - Obrazy są serwowane przez proxy

2. **Dostępność:**
   - Wszystkie obrazy mają atrybuty alt
   - Przyciski karuzeli mają aria-labels
   - Wskaźniki są dostępne dla czytników ekranu

3. **Responsywność:**
   - Karuzela działa na wszystkich urządzeniach
   - Touch gestures dla urządzeń mobilnych (do dodania)
   - Automatyczne skalowanie obrazów

## 📚 Pliki Projektu

**Nowe Pliki:**
- `backend/database/add-multiple-images-to-posts.sql` - Migracja
- `backend/setup-multiple-images.js` - Skrypt migracji
- `setup-multiple-images.bat` - Uruchamiacz migracji
- `MULTIPLE_IMAGES_SETUP.md` - Ta dokumentacja

**Zmodyfikowane Pliki:**
- `backend/server.js` - API dla wielu zdjęć
- `frontend/src/pages/Administration.jsx` - Formularz z wieloma zdjęciami
- `frontend/src/pages/Announcements.jsx` - Wyświetlanie z karuzelą
- `frontend/src/pages/Announcements.css` - Style karuzeli

## ✅ Checklist Wdrożenia

- [ ] Wykonano backup bazy danych
- [ ] Uruchomiono `setup-multiple-images.bat`
- [ ] Zrestartowano backend
- [ ] Zrestartowano frontend
- [ ] Przetestowano dodawanie ogłoszenia z 1 zdjęciem
- [ ] Przetestowano dodawanie ogłoszenia z 2 zdjęciami
- [ ] Przetestowano dodawanie ogłoszenia z 3+ zdjęciami
- [ ] Sprawdzono karuzelę (nawigacja, auto-play)
- [ ] Przetestowano edycję ogłoszenia
- [ ] Sprawdzono responsywność na mobile
- [ ] Zweryfikowano dostępność (alt texts, aria-labels)

## 🔄 Migracja ze Starych Danych

Jeśli masz istniejące ogłoszenia ze starym formatem (image_url, image_alt):

```sql
-- Opcjonalnie: Konwertuj stare dane przed migracją
UPDATE posts 
SET images = jsonb_build_array(
  jsonb_build_object('url', image_url, 'alt', COALESCE(image_alt, ''))
)
WHERE image_url IS NOT NULL;
```

**UWAGA:** Uruchom to PRZED migracją `setup-multiple-images.bat`

## 📞 Wsparcie

W razie problemów:
1. Sprawdź logi backend (terminal)
2. Sprawdź konsolę przeglądarki (F12)
3. Sprawdź Network tab w DevTools
4. Upewnij się że oba serwery działają

---

**Wersja:** 1.0  
**Data:** 14 września 2026  
**Status:** ✅ Gotowe do wdrożenia
