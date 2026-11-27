# Map Integration - Contact Page

## Overview
Added an interactive Google Map to the Contact (Kontakt) page displaying the address: **Potockiej 37, 60-211 Poznań**.

## Changes Made

### 1. Updated Contact.jsx
- Updated the address information from the placeholder to the actual address:
  - **Old**: ul. Przykładowa 123, 61-001 Poznań
  - **New**: ul. Potockiej 37, 60-211 Poznań
- Added a new map section below the contact form with:
  - Section title: "Jak do nas trafić" (How to reach us)
  - Embedded Google Maps iframe showing the location
  - Link to open the full map in Google Maps

### 2. Updated Contact.css
- Added styling for the map section:
  - `.map-section` - Container with proper spacing
  - `.map-title` - Centered title styling
  - `.map-container` - Card-style container with border and shadow
  - `.map-link` - Styled link to open full map
  - Hover effects for better interactivity
  - Responsive design for mobile devices (smaller map height on mobile)

## Map Details
- **Technology**: Google Maps Embed API (free, no API key required for basic embed)
- **Location**: Potockiej 37, 60-211 Poznań
- **Map Height**: 450px on desktop, 350px on mobile
- **Features**:
  - Interactive Google Map with zoom and pan
  - Marker showing exact location
  - Link to open full map in Google Maps for directions
  - Responsive design
  - Familiar Google Maps interface

## How to View
1. Start the frontend: `npm run dev` (from frontend directory)
2. Navigate to the Contact (Kontakt) page
3. Scroll down to see the map below the contact form

## Benefits
- ✅ Visual representation of the office location using Google Maps
- ✅ No API key required for basic embed functionality
- ✅ Fully responsive design
- ✅ Interactive map with zoom/pan capabilities
- ✅ Link to full Google Maps for detailed directions
- ✅ Consistent styling with the rest of the site
- ✅ Familiar interface that most users recognize
