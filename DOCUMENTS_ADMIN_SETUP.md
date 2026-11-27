# Documents Library & Admin Panel Setup Guide

This guide explains how to set up and use the newly implemented **Document Library** (Task 3) and **Admin Panel** (Task 4) features.

## 🎯 What's New

### Task 3: Document Library ✅
- **Categorized document management** with database integration
- **Full CRUD API** for documents at `/api/documents`
- **Responsive UI** with loading states and error handling
- **File metadata** including size, upload date, and download links

### Task 4: Admin Panel ✅
- **Secure authentication** (demo password: "admin123")
- **Tabbed interface** for managing Announcements and Documents
- **Full CRUD operations** with forms for creating, editing, and deleting content
- **Real-time updates** with visual feedback

## 📋 Prerequisites

Before setting up the new features, ensure you have:

1. ✅ PostgreSQL installed and running
2. ✅ Backend server configured (`.env` file with database credentials)
3. ✅ Node.js and npm installed
4. ✅ Existing database with `posts` table (from Task 2)

## 🚀 Setup Instructions

### Step 1: Set Up Documents Table

Run the setup script to create the `documents` table and insert sample data:

```bash
# From the project root directory
setup-documents-table.bat
```

**Or manually:**

```bash
cd backend
node setup-documents.js
```

This will:
- Create the `documents` table in your database
- Add 6 sample documents across 3 categories
- Set up indexes for better performance
- Configure automatic timestamp updates

### Step 2: Start the Backend Server

```bash
start-backend.bat
```

**Or manually:**

```bash
cd backend
npm start
```

The backend will run on `http://localhost:3000`

### Step 3: Start the Frontend

```bash
start-frontend.bat
```

**Or manually:**

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📚 Using the Document Library

### Viewing Documents

1. Navigate to **Dokumenty** (Documents) in the main menu
2. Browse documents organized by category:
   - **Regulaminy Ogólne** (General Regulations)
   - **Formularze** (Forms)
   - **Raporty Finansowe** (Financial Reports)
3. Each document shows:
   - Title and description
   - Upload date
   - File size
   - Download button

### API Endpoints for Documents

```javascript
// Get all documents
GET /api/documents

// Get documents by category
GET /api/documents/category/:category

// Get single document
GET /api/documents/:id

// Create new document (admin only)
POST /api/documents
Body: {
  title: string,
  description: string,
  category: string,
  file_url: string,
  file_name: string,
  file_size: number,
  uploaded_date: date
}

// Update document (admin only)
PUT /api/documents/:id

// Delete document (admin only)
DELETE /api/documents/:id
```

## 🔐 Using the Admin Panel

### Logging In

1. Navigate to **Administracja** (Administration) in the main menu
2. Click the **🔐 Zaloguj się** (Login) button
3. Enter the demo password: **admin123**
4. You'll be redirected to the admin dashboard

### Managing Announcements

1. Click the **📢 Ogłoszenia** (Announcements) tab
2. Click **+ Dodaj Ogłoszenie** (Add Announcement) to create new content
3. Fill in the form:
   - **Tytuł** (Title) - Required
   - **Kategoria** (Category) - Required (e.g., Spotkanie, Konserwacja, Regulamin)
   - **Podsumowanie** (Summary) - Optional
   - **Treść** (Content) - Required
   - **Data Publikacji** (Publication Date) - Required
4. Click **Dodaj Ogłoszenie** (Add Announcement) to save
5. To edit: Click **✏️ Edytuj** (Edit) on any announcement
6. To delete: Click **🗑️ Usuń** (Delete) with confirmation

### Managing Documents

1. Click the **📄 Dokumenty** (Documents) tab
2. Click **+ Dodaj Dokument** (Add Document) to create new content
3. Fill in the form:
   - **Tytuł** (Title) - Required
   - **Opis** (Description) - Optional
   - **Kategoria** (Category) - Required
   - **URL Pliku** (File URL) - Required (e.g., `/documents/file.pdf`)
   - **Nazwa Pliku** (File Name) - Required (e.g., `file.pdf`)
   - **Rozmiar Pliku** (File Size) - Optional (in bytes)
   - **Data Przesłania** (Upload Date) - Required
4. Click **Dodaj Dokument** (Add Document) to save
5. To edit: Click **✏️ Edytuj** (Edit) on any document
6. To delete: Click **🗑️ Usuń** (Delete) with confirmation

### Logging Out

Click the **Wyloguj się** (Logout) button in the top-right corner of the admin panel.

## 🗄️ Database Schema

### Documents Table

```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    uploaded_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Features Implemented

### Document Library Features
- ✅ API integration with loading and error states
- ✅ Automatic categorization and grouping
- ✅ File size formatting (KB/MB)
- ✅ Date formatting in Polish locale
- ✅ Download links for all documents
- ✅ Responsive design for all screen sizes
- ✅ Empty state handling

### Admin Panel Features
- ✅ Simple authentication system (demo)
- ✅ Tabbed interface for different content types
- ✅ Create, Read, Update, Delete (CRUD) operations
- ✅ Form validation
- ✅ Success/error feedback
- ✅ Confirmation dialogs for deletions
- ✅ Real-time data refresh after operations
- ✅ Responsive design for mobile and desktop
- ✅ Edit mode with pre-filled forms
- ✅ Cancel functionality

## 🔒 Security Notes

**Important:** The current authentication is a **demo implementation** using a simple password check. For production use, you should:

1. Implement proper JWT-based authentication
2. Add user registration and management
3. Use bcrypt for password hashing
4. Add role-based access control (RBAC)
5. Implement session management
6. Add CSRF protection
7. Use HTTPS in production

## 📝 Sample Data

The setup script includes sample data:

**Documents:**
- 2 documents in "Regulaminy Ogólne"
- 2 documents in "Formularze"
- 2 documents in "Raporty Finansowe"

You can modify or delete these through the admin panel.

## 🐛 Troubleshooting

### Documents not loading
- Check if backend server is running
- Verify database connection in backend console
- Check browser console for errors
- Ensure documents table exists: `SELECT * FROM documents;`

### Admin panel login not working
- Ensure you're using the correct password: `admin123`
- Check browser console for JavaScript errors
- Clear browser cache and reload

### Cannot create/edit documents
- Verify you're logged in to the admin panel
- Check backend console for API errors
- Ensure all required fields are filled
- Check database permissions

## 🎯 Next Steps

With Tasks 3 and 4 completed, you can now:

1. **Task 5**: Implement the Contact System with email integration
2. **Task 6**: Add Tailwind CSS for professional styling
3. **Production**: Implement proper authentication and security
4. **Enhancement**: Add file upload functionality for documents
5. **Enhancement**: Add rich text editor for announcements

## 📞 Support

For issues or questions:
- Check the main README.md
- Review the frontend/README.md for detailed implementation notes
- Check backend/README.md for API documentation

---

**Status**: Tasks 3 & 4 ✅ COMPLETED
**Date**: March 27, 2026
