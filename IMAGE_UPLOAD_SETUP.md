# 📸 Instrukcja: Dodawanie Zdjęć do Ogłoszeń

## Przegląd

System ogłoszeń został rozszerzony o możliwość dodawania zdjęć. Administratorzy mogą teraz przesyłać obrazy, które będą wyświetlane wraz z ogłoszeniami na stronie głównej.

## 🚀 Szybki Start

### Krok 1: Aktualizacja Bazy Danych

Uruchom skrypt konfiguracyjny, aby dodać obsługę zdjęć do tabeli `posts`:

```bash
setup-images.bat
```

Ten skrypt:
- Dodaje kolumnę `image_url` do tabeli `posts`
- Dodaje kolumnę `image_alt` dla opisu alternatywnego (dostępność)
- Weryfikuje poprawność zmian

### Krok 2: Restart Serwera Backend

Po aktualizacji bazy danych, uruchom ponownie serwer backend:

```bash
start-backend.bat
```

### Krok 3: Restart Serwera Frontend

Uruchom ponownie serwer frontend:

```bash
start-frontend.bat
```

## 📋 Funkcjonalność

### Dla Administratorów

1. **Dodawanie Ogłoszenia ze Zdjęciem:**
   - Przejdź do panelu Administracja
   - Zaloguj się (hasło demo: `admin123`)
   - Kliknij "Dodaj Ogłoszenie"
   - Wypełnij formularz
   - Wybierz zdjęcie z dysku (kliknij "Wybierz plik")
   - Opcjonalnie dodaj opis alternatywny dla dostępności
   - Kliknij "Dodaj Ogłoszenie"

2. **Edycja Ogłoszenia:**
   - Możesz zmienić zdjęcie wybierając nowy plik
   - Lub pozostawić istniejące zdjęcie bez zmian
   - Zaktualizuj opis alternatywny jeśli potrzeba

3. **Podgląd Zdjęcia:**
   - Po wybraniu pliku, zobaczysz podgląd przed zapisaniem
   - W liście ogłoszeń zobaczysz miniaturę zdjęcia

### Dla Użytkowników

- Zdjęcia są automatycznie wyświetlane na stronie Ogłoszenia
- Obrazy są responsywne i dostosowują się do rozmiaru ekranu
- Lazy loading zapewnia szybsze ładowanie strony

## 🔧 Szczegóły Techniczne

### Backend

**Nowe Endpointy:**
- `POST /api/upload/announcement-image` - Przesyłanie zdjęć

**Zaktualizowane Endpointy:**
- `POST /api/posts` - Teraz obsługuje `image_url` i `image_alt`
- `PUT /api/posts/:id` - Teraz obsługuje `image_url` i `image_alt`

**Konfiguracja Multer:**
- Maksymalny rozmiar pliku: 5MB
- Dozwolone formaty: JPEG, JPG, PNG, GIF, WEBP
- Lokalizacja przesyłanych plików: `backend/uploads/announcements/`

**Struktura Plików:**
```
backend/
├── uploads/
│   └── announcements/
│       └── announcement-[timestamp]-[random].jpg
├── server.js (zaktualizowany)
└── database/
    └── add-images-to-posts.sql (nowy)
```

### Frontend

**Zaktualizowane Komponenty:**
- `Administration.jsx` - Formularz z obsługą przesyłania zdjęć
- `Announcements.jsx` - Wyświetlanie zdjęć w ogłoszeniach
- `Announcements.css` - Style dla obrazów

**Nowe Funkcje w Administration.jsx:**
- `handleImageSelect()` - Obsługa wyboru pliku
- `uploadImage()` - Przesyłanie obrazu do serwera
- Podgląd obrazu przed zapisaniem
- Stan ładowania podczas przesyłania

### Baza Danych

**Nowe Kolumny w Tabeli `posts`:**
```sql
image_url VARCHAR(500)     -- URL do przesłanego zdjęcia
image_alt VARCHAR(255)     -- Opis alternatywny dla dostępności
```

## 📝 Przykład Użycia

### Dodawanie Ogłoszenia z API

```javascript
// 1. Prześlij zdjęcie
const formData = new FormData();
formData.append('image', imageFile);

const uploadResponse = await fetch('/api/upload/announcement-image', {
  method: 'POST',
  body: formData
});

const { imageUrl } = await uploadResponse.json();

// 2. Utwórz ogłoszenie ze zdjęciem
const response = await fetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Tytuł ogłoszenia',
    category: 'Kategoria',
    summary: 'Podsumowanie',
    content: 'Treść ogłoszenia',
    published_date: '2026-03-27',
    image_url: imageUrl,
    image_alt: 'Opis zdjęcia'
  })
});
```

## 🎨 Stylizacja

Zdjęcia w ogłoszeniach:
- Zaokrąglone rogi (12px)
- Cień dla głębi
- Efekt hover (powiększenie 2%)
- Maksymalna wysokość: 400px
- Responsywne (100% szerokości kontenera)
- Object-fit: cover (zachowanie proporcji)

## 🔒 Bezpieczeństwo

1. **Walidacja Typu Pliku:**
   - Tylko obrazy są akceptowane
   - Sprawdzanie rozszerzenia i MIME type

2. **Limit Rozmiaru:**
   - Maksymalnie 5MB na plik

3. **Unikalne Nazwy Plików:**
   - Timestamp + losowa liczba
   - Zapobiega konfliktom nazw

## 🐛 Rozwiązywanie Problemów

### Problem: Zdjęcia nie są wyświetlane

**Rozwiązanie:**
1. Sprawdź czy folder `backend/uploads/announcements/` istnieje
2. Upewnij się, że serwer backend jest uruchomiony
3. Sprawdź konsolę przeglądarki pod kątem błędów CORS

### Problem: Błąd podczas przesyłania

**Rozwiązanie:**
1. Sprawdź rozmiar pliku (max 5MB)
2. Upewnij się, że format jest obsługiwany (jpg, png, gif, webp)
3. Sprawdź uprawnienia do zapisu w folderze `uploads/`

### Problem: Baza danych nie ma kolumn image_url/image_alt

**Rozwiązanie:**
```bash
# Uruchom ponownie skrypt migracji
setup-images.bat
```

## 📚 Pliki Projektu

**Nowe Pliki:**
- `backend/database/add-images-to-posts.sql` - Migracja bazy danych
- `backend/setup-images.js` - Skrypt konfiguracyjny
- `setup-images.bat` - Skrypt uruchamiający migrację
- `IMAGE_UPLOAD_SETUP.md` - Ta dokumentacja

**Zmodyfikowane Pliki:**
- `backend/server.js` - Dodano obsługę multer i endpointy
- `backend/package.json` - Dodano zależność multer
- `frontend/src/pages/Administration.jsx` - Formularz z przesyłaniem
- `frontend/src/pages/Announcements.jsx` - Wyświetlanie obrazów
- `frontend/src/pages/Announcements.css` - Style dla obrazów

## 🎯 Najlepsze Praktyki

1. **Optymalizuj Obrazy:**
   - Kompresuj zdjęcia przed przesłaniem
   - Używaj odpowiednich formatów (WebP dla lepszej kompresji)
   - Zalecany rozmiar: max 1920x1080px

2. **Dostępność:**
   - Zawsze dodawaj opis alternatywny (image_alt)
   - Opisuj co jest na zdjęciu, nie jak wygląda

3. **Wydajność:**
   - Lazy loading jest włączony automatycznie
   - Obrazy ładują się tylko gdy są widoczne

## 📞 Wsparcie

W razie problemów:
1. Sprawdź logi serwera backend
2. Sprawdź konsolę przeglądarki
3. Upewnij się, że wszystkie zależności są zainstalowane
4. Zweryfikuj połączenie z bazą danych

## ✅ Checklist Wdrożenia

- [ ] Uruchomiono `setup-images.bat`
- [ ] Zrestartowano serwer backend
- [ ] Zrestartowano serwer frontend
- [ ] Przetestowano dodawanie ogłoszenia ze zdjęciem
- [ ] Przetestowano edycję ogłoszenia ze zdjęciem
- [ ] Sprawdzono wyświetlanie na stronie Ogłoszenia
- [ ] Zweryfikowano responsywność na urządzeniach mobilnych

---

**Wersja:** 1.0  
**Data:** 27 marca 2026  
**Autor:** System OsiedleL
