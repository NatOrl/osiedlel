# Color Scheme Documentation

## Overview
The website now features a fresh, professional color scheme with a white background, green primary colors, and blue secondary accents.

## Color Palette

### Primary Colors (Green)
- **Main Accent**: `#10b981` (Emerald Green)
- **Light Background**: `rgba(16, 185, 129, 0.1)`
- **Border**: `rgba(16, 185, 129, 0.5)`
- **Usage**: Primary buttons, links, active states, success messages, main interactive elements

### Secondary Colors (Blue)
- **Main Accent**: `#3b82f6` (Bright Blue)
- **Light Background**: `rgba(59, 130, 246, 0.1)`
- **Border**: `rgba(59, 130, 246, 0.5)`
- **Usage**: Secondary buttons, hover states, complementary accents, edit actions

### Base Colors
- **Background**: `#ffffff` (Pure White)
- **Text**: `#4a5568` (Slate Gray)
- **Headings**: `#1a202c` (Dark Gray)
- **Borders**: `#e2e8f0` (Light Gray)
- **Code Background**: `#f7fafc` (Very Light Gray)

## Where Colors Are Used

### Green (Primary)
- Download buttons on Documents page
- Submit buttons on Contact form
- Active navigation links
- Feature card hover borders
- Success alerts
- Primary action buttons
- Announcement categories
- Admin panel primary actions

### Blue (Secondary)
- Document card hover borders
- Contact info card hover borders
- Edit buttons in Administration
- Hero section gradient (combined with green)
- Admin notice gradient (combined with green)
- Loading spinner accent
- Secondary interactive elements

### White Background
- All page backgrounds
- Card backgrounds
- Form backgrounds
- Clean, professional appearance throughout

## CSS Variables

### Light Mode
```css
--accent: #10b981;           /* Green primary */
--accent-bg: rgba(16, 185, 129, 0.1);
--accent-border: rgba(16, 185, 129, 0.5);
--secondary: #3b82f6;        /* Blue secondary */
--secondary-bg: rgba(59, 130, 246, 0.1);
--secondary-border: rgba(59, 130, 246, 0.5);
--bg: #ffffff;               /* White background */
--text: #4a5568;
--text-h: #1a202c;
--border: #e2e8f0;
```

### Dark Mode
The color scheme automatically adapts for dark mode with adjusted values:
- Green: `#34d399` (lighter, more visible)
- Blue: `#60a5fa` (lighter, more visible)
- Background: `#1a202c` (dark)
- Text colors adjusted for dark backgrounds

## Tailwind Configuration

The Tailwind config includes full color scales for both primary (green) and secondary (blue):

**Primary (Green)**: 50-900 scale from `#ecfdf5` to `#064e3b`
**Secondary (Blue)**: 50-900 scale from `#eff6ff` to `#1e3a8a`

## Design Principles

1. **White Background**: Creates a clean, professional, and spacious feel
2. **Green Primary**: Represents growth, harmony, and positive actions
3. **Blue Secondary**: Adds trust, stability, and visual variety
4. **High Contrast**: Ensures excellent readability
5. **Consistent Application**: Colors are used consistently across all pages
6. **Accessibility**: Color combinations meet WCAG contrast requirements

## Files Modified

- `frontend/src/index.css` - Global color variables
- `frontend/tailwind.config.js` - Tailwind color scales
- `frontend/src/pages/Home.css` - Hero gradient
- `frontend/src/pages/Administration.css` - Admin notice, edit buttons
- `frontend/src/pages/Announcements.css` - Category badges, spinner
- `frontend/src/pages/Documents.css` - Card hovers, download buttons
- `frontend/src/pages/Contact.css` - Info card hovers, success alerts

## Testing

To see the new color scheme in action:
1. Start the frontend: `npm run dev` (in frontend directory)
2. Navigate through all pages to see the cohesive color application
3. Test hover states on cards, buttons, and links
4. Try form submissions to see success messages
5. Check dark mode (if your system uses it)
