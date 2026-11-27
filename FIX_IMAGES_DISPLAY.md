# 🖼️ Naprawa Wyświetlania Zdjęć w Ogłoszeniach

## Problem
Zdjęcia dodane do ogłoszeń nie wyświetlały się na stronie.

## Przyczyna
W konfiguracji Vite (`frontend/vite.config.js`) brakowało proxy dla ścieżki `/uploads`. Frontend działa na porcie 5173, a backend na porcie 3000. Bez proxy, przeglądarka próbowała załadować obrazy z `http://localhost:5173/uploads/...` zamiast z `http://localhost:3000/uploads/...`.

## Rozwiązanie
Dodano konfigurację proxy dla `/uploads` w pliku `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
  '/uploads': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  }
}
```

## 🚀 Jak Zastosować Naprawę

### Krok 1: Zatrzymaj Serwer Frontend
Jeśli serwer frontend jest uruchomiony, zatrzymaj go (Ctrl+C w oknie terminala).

### Krok 2: Uruchom Ponownie Serwer Frontend
```bash
start-frontend.bat
```

### Krok 3: Sprawdź Wyniki
1. Otwórz przeglądarkę i przejdź do `http://localhost:5173`
2. Kliknij na "Ogłoszenia" w menu
3. Zdjęcia powinny teraz wyświetlać się poprawnie

## ✅ Weryfikacja

### Sprawdź w Konsoli Przeglądarki
1. Otwórz narzędzia deweloperskie (F12)
2. Przejdź do zakładki "Network" (Sieć)
3. Odśwież stronę ogłoszeń
4. Sprawdź czy obrazy z `/uploads/announcements/...` ładują się z kodem 200 (sukces)

### Jeśli Nadal Nie Działa

**Problem 1: Folder uploads nie istnieje**
```bash
# Utwórz folder ręcznie
cd backend
mkdir uploads\announcements
```

**Problem 2: Backend nie jest uruchomiony**
```bash
start-backend.bat
```

**Problem 3: Brak zdjęć w bazie danych**
- Przejdź do panelu Administracja
- Zaloguj się (hasło: `admin123`)
- Edytuj istniejące ogłoszenie i dodaj zdjęcie
- Lub utwórz nowe ogłoszenie ze zdjęciem

**Problem 4: Cache przeglądarki**
- Wyczyść cache przeglądarki (Ctrl+Shift+Delete)
- Lub otwórz stronę w trybie incognito
- Lub wykonaj "Hard Refresh" (Ctrl+Shift+R)

## 📋 Pliki Zmodyfikowane
- `frontend/vite.config.js` - Dodano proxy dla `/uploads`

## 🔍 Szczegóły Techniczne

### Jak Działa Proxy
1. Frontend próbuje załadować obraz: `<img src="/uploads/announcements/image.jpg" />`
2. Vite przechwytuje żądanie do `/uploads`
3. Przekierowuje je do `http://localhost:3000/uploads/announcements/image.jpg`
4. Backend serwuje plik statyczny z folderu `backend/uploads/`
5. Obraz wyświetla się w przeglądarce

### Struktura Katalogów
```
backend/
├── uploads/
│   └── announcements/
│       ├── announcement-1234567890-123456789.jpg
│       ├── announcement-1234567891-987654321.png
│       └── ...
└── server.js (serwuje pliki statyczne)

frontend/
├── vite.config.js (proxy dla /uploads)
└── src/
    └── pages/
        ├── Announcements.jsx (wyświetla obrazy)
        └── Administration.jsx (przesyła obrazy)
```

## 📝 Testowanie

### Test 1: Dodaj Nowe Ogłoszenie ze Zdjęciem
1. Przejdź do Administracja → Ogłoszenia
2. Kliknij "Dodaj Ogłoszenie"
3. Wypełnij formularz
4. Wybierz zdjęcie z dysku
5. Zapisz ogłoszenie
6. Przejdź do strony Ogłoszenia
7. Sprawdź czy zdjęcie się wyświetla

### Test 2: Edytuj Istniejące Ogłoszenie
1. W panelu Administracja kliknij "Edytuj" przy ogłoszeniu
2. Zmień zdjęcie na inne
3. Zapisz zmiany
4. Sprawdź czy nowe zdjęcie się wyświetla

### Test 3: Sprawdź Responsywność
1. Otwórz stronę Ogłoszenia
2. Zmień rozmiar okna przeglądarki
3. Sprawdź czy obrazy skalują się poprawnie
4. Przetestuj na urządzeniu mobilnym (lub w trybie mobilnym w DevTools)

## 🎯 Najlepsze Praktyki

### Dla Administratorów
1. **Optymalizuj obrazy przed przesłaniem:**
   - Maksymalny rozmiar: 5MB
   - Zalecana rozdzielczość: 1920x1080px lub mniejsza
   - Używaj kompresji (np. TinyPNG, Squoosh)

2. **Używaj odpowiednich formatów:**
   - JPEG dla zdjęć
   - PNG dla grafik z przezroczystością
   - WebP dla lepszej kompresji (nowoczesne przeglądarki)

3. **Zawsze dodawaj opis alternatywny:**
   - Pomaga w dostępności (screen readers)
   - Wyświetla się gdy obraz nie może się załadować
   - Pomaga w SEO

### Dla Deweloperów
1. **Zawsze używaj proxy w development:**
   - Unika problemów z CORS
   - Symuluje produkcyjne środowisko

2. **Serwuj pliki statyczne bezpiecznie:**
   - Waliduj typy plików
   - Ogranicz rozmiar plików
   - Używaj unikalnych nazw plików

3. **Implementuj lazy loading:**
   - Już zaimplementowane w `Announcements.jsx`
   - Poprawia wydajność strony

## 📞 Wsparcie

Jeśli problem nadal występuje:
1. Sprawdź logi serwera backend (terminal gdzie uruchomiono `start-backend.bat`)
2. Sprawdź konsolę przeglądarki (F12 → Console)
3. Sprawdź zakładkę Network w DevTools (F12 → Network)
4. Upewnij się że oba serwery są uruchomione (backend i frontend)

## ✅ Checklist
- [x] Dodano proxy dla `/uploads` w `vite.config.js`
- [ ] Zrestartowano serwer frontend
- [ ] Przetestowano wyświetlanie zdjęć na stronie Ogłoszenia
- [ ] Przetestowano dodawanie nowego ogłoszenia ze zdjęciem
- [ ] Przetestowano edycję ogłoszenia ze zdjęciem
- [ ] Sprawdzono responsywność na różnych urządzeniach

---

**Data naprawy:** 14 września 2026  
**Status:** ✅ Naprawione  
**Wersja:** 1.0
