# Tasks 5 & 6 Quick Start Guide

Quick setup instructions for **Task 5: Contact System** and **Task 6: Tailwind CSS**.

## ⚡ Quick Setup (5 Minutes)

### Task 5: Contact System

**1. Set up the database table:**
```bash
setup-contact-table.bat
```

**2. Start the servers (if not already running):**
```bash
start-backend.bat
start-frontend.bat
```

**3. Test the contact form:**
- Open http://localhost:5173/contact
- Fill in the form and submit
- You should see a success message!

**Done!** ✅ Contact system is ready to use.

---

### Task 6: Tailwind CSS

**1. Install Tailwind dependencies:**
```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
```

**2. Restart the frontend server:**
```bash
# Press Ctrl+C to stop the current server
npm run dev
```

**3. Test Tailwind (optional):**
Add this to any component to test:
```jsx
<div className="p-4 bg-primary-500 text-white rounded-lg shadow-soft">
  Tailwind is working! 🎉
</div>
```

**Done!** ✅ Tailwind CSS is configured and ready to use.

---

## 📚 What You Get

### Task 5: Contact System
- ✅ Working contact form with database storage
- ✅ Success/error messages
- ✅ Form validation
- ✅ API endpoints for admin management
- ✅ Sample data for testing

### Task 6: Tailwind CSS
- ✅ Tailwind CSS v3 configured
- ✅ Custom color palette
- ✅ PostCSS integration
- ✅ Works alongside existing CSS
- ✅ Ready for gradual migration

---

## 🔍 Verify Installation

### Check Contact System:
```sql
-- In PostgreSQL
SELECT * FROM contact_messages;
```

### Check Tailwind CSS:
```bash
# In frontend directory
ls tailwind.config.js postcss.config.js
```

---

## 📖 Full Documentation

For detailed information, see:
- **CONTACT_TAILWIND_SETUP.md** - Complete setup guide
- **frontend/README.md** - Updated roadmap with implementation details

---

## 🆘 Quick Troubleshooting

**Contact form not working?**
- Ensure backend is running on port 3000
- Check if `contact_messages` table exists
- Look for errors in browser console

**Tailwind not working?**
- Run `npm install` in frontend directory
- Restart the dev server
- Clear browser cache

---

## 🎯 Next Steps

1. **Test the contact form** - Submit a test message
2. **View contact messages** - Check the database
3. **Try Tailwind classes** - Add utilities to components
4. **Read full documentation** - Learn all features

---

**Need Help?** Check CONTACT_TAILWIND_SETUP.md for detailed troubleshooting.
