# Employee Duties Management Setup

## Overview
This feature allows administrators to manage the "Dyżury domowe pracowników osiedla" (Home duties of estate employees) section that appears on the home page. Administrators can edit the duty dates and the list of employees on duty through the admin panel.

## Features
- ✅ Dynamic employee duties display on home page
- ✅ Admin panel for editing duty dates and employee list
- ✅ Add/remove employees from the duty roster
- ✅ Real-time updates reflected on the home page
- ✅ Database-backed storage

## Setup Instructions

### 1. Create the Database Table

Run the setup script to create the `employee_duties` table:

```bash
setup-employee-duties-table.bat
```

Or manually run:
```bash
cd backend
node setup-employee-duties.js
```

This will:
- Create the `employee_duties` table in PostgreSQL
- Insert default sample data
- Set up automatic timestamp updates

### 2. Verify Backend is Running

Make sure your backend server is running:
```bash
start-backend.bat
```

The backend should be accessible at `http://localhost:3000`

### 3. Verify Frontend is Running

Make sure your frontend is running:
```bash
start-frontend.bat
```

The frontend should be accessible at `http://localhost:5173`

## How to Use

### For Administrators

1. **Access Admin Panel**
   - Navigate to `/administration` in your browser
   - Click "Zaloguj się" (Login)
   - Enter password: `admin123`

2. **Edit Employee Duties**
   - Click on the "👷 Dyżury Pracowników" tab
   - Click "✏️ Edytuj Dyżury" button
   - Update the duty dates (e.g., "28-29.03.2026")
   - Modify employee information:
     - **Stanowisko** (Role): e.g., "Instalator", "Elektryk", "Kierownik"
     - **Telefon** (Phone): e.g., "501 327 815"
   - Add new employees with "+ Dodaj Pracownika" button
   - Remove employees with the 🗑️ button
   - Click "Zaktualizuj Dyżury" to save changes

3. **View Changes**
   - Navigate to the home page
   - Scroll to "Dyżury domowe pracowników osiedla" section
   - Changes will be reflected immediately

### For Users

Users can view the current employee duties on the home page:
- The section displays duty dates
- Shows all employees on duty with their roles
- Phone numbers are clickable for easy calling

## Database Structure

### Table: `employee_duties`

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| duty_dates | VARCHAR(100) | Date range for duties (e.g., "28-29.03.2026") |
| employees | JSONB | Array of employee objects with role and phone |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Employee Object Structure (JSONB)
```json
{
  "role": "Instalator",
  "phone": "501 327 815"
}
```

## API Endpoints

### GET `/api/employee-duties`
Fetch current employee duties information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "duty_dates": "28-29.03.2026",
    "employees": [
      {"role": "Instalator", "phone": "501 327 815"},
      {"role": "Elektryk", "phone": "501 037 856"}
    ],
    "created_at": "2026-03-29T18:00:00.000Z",
    "updated_at": "2026-03-29T18:00:00.000Z"
  }
}
```

### PUT `/api/employee-duties/:id`
Update employee duties information.

**Request Body:**
```json
{
  "duty_dates": "30-31.03.2026",
  "employees": [
    {"role": "Instalator", "phone": "501 327 815"},
    {"role": "Elektryk", "phone": "501 037 856"},
    {"role": "Kierownik", "phone": "503 074 873"}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "duty_dates": "30-31.03.2026",
    "employees": [...],
    "updated_at": "2026-03-29T19:00:00.000Z"
  }
}
```

## Files Modified/Created

### Backend Files
- `backend/database/add-employee-duties-table.sql` - Database schema
- `backend/setup-employee-duties.js` - Setup script
- `backend/server.js` - Added API endpoints
- `setup-employee-duties-table.bat` - Windows setup script

### Frontend Files
- `frontend/src/pages/Administration.jsx` - Added employee duties management tab
- `frontend/src/pages/Home.jsx` - Updated to fetch dynamic data

## Troubleshooting

### Issue: "Table already exists" error
**Solution:** The table was already created. You can skip the setup step or drop the table first:
```sql
DROP TABLE IF EXISTS employee_duties;
```

### Issue: Changes not appearing on home page
**Solution:** 
1. Check browser console for errors
2. Verify backend is running and accessible
3. Clear browser cache and refresh
4. Check that the API endpoint returns data: `http://localhost:3000/api/employee-duties`

### Issue: Cannot save changes in admin panel
**Solution:**
1. Check browser console for errors
2. Verify you're logged in as admin
3. Ensure all required fields are filled
4. Check backend logs for errors

## Security Notes

⚠️ **Important:** The current authentication system uses a simple password (`admin123`) for demonstration purposes. In a production environment, you should:
- Implement proper user authentication with hashed passwords
- Use JWT tokens or session management
- Add role-based access control
- Implement HTTPS
- Add CSRF protection

## Future Enhancements

Potential improvements for this feature:
- [ ] Multiple duty periods management
- [ ] Historical duty records
- [ ] Email notifications when duties are updated
- [ ] Calendar integration
- [ ] Employee availability tracking
- [ ] Automatic duty rotation scheduling

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the browser console for errors
3. Check backend logs for server-side issues
4. Verify database connection and table structure
