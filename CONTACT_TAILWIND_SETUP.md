# Contact System & Tailwind CSS Setup Guide

This guide covers the implementation of **Task 5: Contact System** and **Task 6: Tailwind CSS Integration**.

## 🎯 What's New

### Task 5: Contact System ✅
- **Database storage** for contact form submissions
- **Full CRUD API** for contact messages at `/api/contact-messages`
- **Form validation** with loading states and error handling
- **Success/error feedback** with visual alerts
- **Admin access** to view and manage contact messages

### Task 6: Tailwind CSS ✅
- **Tailwind CSS configured** and ready to use
- **Custom color palette** matching the existing design
- **PostCSS integration** for optimal build process
- **Utility-first approach** available alongside existing CSS
- **Responsive design utilities** for all screen sizes

---

## 📋 Prerequisites

Before setting up the new features, ensure you have:

1. ✅ PostgreSQL installed and running
2. ✅ Backend server configured (`.env` file with database credentials)
3. ✅ Node.js and npm installed
4. ✅ Existing database with `posts` and `documents` tables

---

## 🚀 Task 5: Contact System Setup

### Step 1: Install Dependencies (if needed)

The contact system uses the existing database connection, so no additional backend dependencies are required.

### Step 2: Set Up Contact Messages Table

Run the setup script to create the `contact_messages` table:

```bash
# From the project root directory
setup-contact-table.bat
```

**Or manually:**

```bash
cd backend
node setup-contact.js
```

This will:
- Create the `contact_messages` table in your database
- Add indexes for better query performance
- Set up automatic timestamp updates
- Insert 3 sample contact messages for testing

### Step 3: Verify Backend API

The backend server already includes the contact API endpoints. Ensure your backend is running:

```bash
start-backend.bat
```

The backend will run on `http://localhost:3000`

### Step 4: Test the Contact Form

Start the frontend:

```bash
start-frontend.bat
```

Navigate to **Kontakt** (Contact) in the main menu and test the form:
1. Fill in all required fields
2. Click "Wyślij Wiadomość" (Send Message)
3. You should see a success message
4. The form will clear automatically

---

## 📚 Using the Contact System

### For Residents (Public)

1. Navigate to **Kontakt** (Contact) page
2. Fill in the contact form:
   - **Imię i Nazwisko** (Name) - Required
   - **Email** - Required
   - **Temat** (Subject) - Required
   - **Wiadomość** (Message) - Required
3. Click **Wyślij Wiadomość** (Send Message)
4. Wait for confirmation message
5. Contact information is displayed on the left side

### For Administrators

Administrators can view and manage contact messages through the database or by adding a contact messages tab to the admin panel.

**Database Query:**
```sql
-- View all contact messages
SELECT * FROM contact_messages ORDER BY created_at DESC;

-- View new messages only
SELECT * FROM contact_messages WHERE status = 'new' ORDER BY created_at DESC;

-- Update message status
UPDATE contact_messages SET status = 'in_progress' WHERE id = 1;
```

### API Endpoints for Contact Messages

```javascript
// Get all contact messages (admin)
GET /api/contact-messages

// Get single contact message
GET /api/contact-messages/:id

// Create new contact message (from form)
POST /api/contact-messages
Body: {
  name: string,
  email: string,
  subject: string,
  message: string
}

// Update contact message status (admin)
PUT /api/contact-messages/:id
Body: {
  status: 'new' | 'in_progress' | 'resolved'
}

// Delete contact message (admin)
DELETE /api/contact-messages/:id
```

---

## 🎨 Task 6: Tailwind CSS Setup

### Step 1: Install Tailwind CSS

Install Tailwind CSS and its dependencies:

```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
```

### Step 2: Configuration Files

The following configuration files have been created:

**`tailwind.config.js`** - Tailwind configuration with custom colors and theme
**`postcss.config.js`** - PostCSS configuration for Tailwind processing
**`src/index.css`** - Updated with Tailwind directives

### Step 3: Using Tailwind CSS

Tailwind CSS is now available throughout your application. You can use Tailwind utility classes alongside your existing CSS.

**Example usage:**

```jsx
// Using Tailwind classes
<div className="flex items-center justify-between p-4 bg-primary-500 text-white rounded-lg shadow-soft">
  <h2 className="text-2xl font-bold">Hello Tailwind!</h2>
  <button className="px-4 py-2 bg-white text-primary-500 rounded hover:bg-gray-100 transition">
    Click me
  </button>
</div>
```

**Custom Colors Available:**
- `primary-{50-900}` - Purple/blue gradient colors
- `secondary-{50-900}` - Purple colors
- Standard Tailwind colors (blue, red, green, etc.)

**Custom Shadows:**
- `shadow-soft` - Subtle shadow
- `shadow-medium` - Medium shadow
- `shadow-strong` - Strong shadow

### Step 4: Gradual Migration

You can gradually migrate your existing CSS to Tailwind:

1. **Keep existing CSS** - All current styles continue to work
2. **Add Tailwind classes** - Use Tailwind for new components
3. **Refactor incrementally** - Replace CSS with Tailwind utilities over time

**Example: Before and After**

```css
/* Before (CSS) */
.button {
  padding: 12px 24px;
  background-color: #667eea;
  color: white;
  border-radius: 8px;
  font-weight: 600;
}
```

```jsx
// After (Tailwind)
<button className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition">
  Button
</button>
```

---

## 🗄️ Database Schema

### Contact Messages Table

```sql
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Status Values:**
- `new` - Newly submitted message
- `in_progress` - Being handled by admin
- `resolved` - Issue resolved

---

## 🎨 Features Implemented

### Contact System Features
- ✅ Database storage for all contact form submissions
- ✅ Full CRUD API endpoints
- ✅ Form validation (client and server-side)
- ✅ Loading states during submission
- ✅ Success/error feedback messages
- ✅ Automatic form clearing after successful submission
- ✅ Responsive design
- ✅ Sample data for testing

### Tailwind CSS Features
- ✅ Tailwind CSS v3 configured
- ✅ PostCSS integration
- ✅ Custom color palette
- ✅ Custom shadows
- ✅ Font family configuration
- ✅ Responsive design utilities
- ✅ Dark mode support (via existing CSS variables)
- ✅ Compatible with existing CSS

---

## 🐛 Troubleshooting

### Contact Form Issues

**Form not submitting:**
- Check if backend server is running on port 3000
- Verify database connection in backend console
- Check browser console for JavaScript errors
- Ensure `contact_messages` table exists

**No success/error message:**
- Check browser console for errors
- Verify API endpoint is responding
- Check network tab in browser dev tools

**Database errors:**
- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check if table was created: `SELECT * FROM contact_messages;`

### Tailwind CSS Issues

**Styles not applying:**
- Ensure frontend dev server is running
- Check that `tailwind.config.js` and `postcss.config.js` exist
- Verify Tailwind directives are in `src/index.css`
- Clear browser cache and restart dev server

**Build errors:**
- Run `npm install` in frontend directory
- Check for PostCSS/Tailwind version conflicts
- Verify all config files use ES modules syntax

**Existing styles broken:**
- Tailwind's base styles may conflict with existing CSS
- Use `@layer` directives to organize styles
- Add `important: true` to Tailwind config if needed

---

## 📝 Sample Data

The setup script includes sample contact messages:

1. **Jan Kowalski** - Question about fees (status: new)
2. **Anna Nowak** - Elevator problem (status: in_progress)
3. **Piotr Wiśniewski** - Hot water issue (status: resolved)

You can view, modify, or delete these through the database.

---

## 🎯 Next Steps

With Tasks 5 and 6 completed, you can now:

1. **Add Contact Messages to Admin Panel**
   - Create a new tab in Administration page
   - Display all contact messages
   - Allow status updates and replies

2. **Email Notifications** (Optional Enhancement)
   - Install nodemailer: `npm install nodemailer`
   - Configure SMTP settings in `.env`
   - Send email notifications when messages are received

3. **Migrate to Tailwind CSS**
   - Gradually replace existing CSS with Tailwind utilities
   - Use Tailwind for all new components
   - Consider using shadcn/ui for pre-built components

4. **Production Deployment**
   - Set up environment variables for production
   - Configure email service for contact form
   - Implement rate limiting for contact form
   - Add CAPTCHA to prevent spam

---

## 📞 Support

For issues or questions:
- Check the main README.md
- Review the frontend/README.md for detailed implementation notes
- Check backend/README.md for API documentation
- Review DOCUMENTS_ADMIN_SETUP.md for admin panel features

---

## 🔗 Related Files

### Backend Files
- `backend/server.js` - Contact API endpoints
- `backend/database/add-contact-messages-table.sql` - Database schema
- `backend/setup-contact.js` - Setup script
- `setup-contact-table.bat` - Windows batch file

### Frontend Files
- `frontend/src/pages/Contact.jsx` - Contact form component
- `frontend/src/pages/Contact.css` - Contact page styles
- `frontend/tailwind.config.js` - Tailwind configuration
- `frontend/postcss.config.js` - PostCSS configuration
- `frontend/src/index.css` - Global styles with Tailwind directives

---

**Status**: Tasks 5 & 6 ✅ COMPLETED  
**Date**: March 27, 2026  
**Version**: 1.0.0
