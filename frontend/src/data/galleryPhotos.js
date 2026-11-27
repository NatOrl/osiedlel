// Estate photo gallery data (used by the home page photo section and the /gallery page).
//
// HOW TO ADD PHOTOS
//  1. Copy the image file into frontend/public/gallery/ (e.g. frontend/public/gallery/park.jpg)
//  2. Add an entry below with url: '/gallery/park.jpg' and the matching category id.
// Categories without any photo are shown on the home page as "Zdjęcia wkrótce".

export const GALLERY_CATEGORIES = [
  { id: 'buildings', label: 'Budynki mieszkalne', icon: '🏘️' },
  { id: 'green', label: 'Tereny zielone', icon: '🌳' },
  { id: 'shared', label: 'Przestrzenie wspólne', icon: '🪑' },
  { id: 'events', label: 'Wydarzenia społeczności', icon: '🎉' },
];

export const GALLERY_PHOTOS = [
  {
    id: 'buildings-1',
    category: 'buildings',
    url: '/gallery/budynki-ulica.jpg',
    alt: 'Zabytkowe kamienice przy ul. Matejki i Wyspiańskiego w Poznaniu',
  },
  // Community events - photos published by Klub Osiedlowy Krąg (https://www.klubkrag.pl/)
  {
    id: 'events-1',
    category: 'events',
    url: 'https://www.klubkrag.pl/slider/6b0458ddc5ff9.jpg',
    alt: 'Wydarzenie w Klubie Osiedlowym Krąg',
  },
  {
    id: 'events-2',
    category: 'events',
    url: 'https://www.klubkrag.pl/slider/68c182942ad63.jpg',
    alt: 'Wydarzenie w Klubie Osiedlowym Krąg',
  },
  {
    id: 'events-3',
    category: 'events',
    url: 'https://www.klubkrag.pl/slider/6707143292efc.jpg',
    alt: 'Wydarzenie w Klubie Osiedlowym Krąg',
  },
  {
    id: 'events-4',
    category: 'events',
    url: 'https://www.klubkrag.pl/slider/6b045b5db680b.jpg',
    alt: 'Wydarzenie w Klubie Osiedlowym Krąg',
  },
];
