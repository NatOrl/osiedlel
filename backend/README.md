# OsiedleL Backend

Express.js backend for OsiedleL application.

## Getting Started

### Installation

```bash
npm install
```

### Running the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## Database Setup

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for PostgreSQL setup instructions.

## API Endpoints

### General
- `GET /api` - Welcome message
- `GET /api/health` - Health check endpoint
- `GET /api/data` - Example static data endpoint

### Database
- `GET /api/db/test` - Test database connection
- `GET /api/items` - Get all items from database
- `POST /api/items` - Create new item (requires JSON body: `{name, description}`)

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=osiedlel
DB_PASSWORD=postgres
DB_PORT=5432
```

## Dependencies

- **express** - Web framework
- **cors** - Enable CORS
- **pg** - PostgreSQL client
- **dotenv** - Environment variable management

## Development Roadmap

0. [x] **Project Foundation**: Express server setup with PostgreSQL connection.
1. [ ] **Database Schema Expansion**:
    *   Create `announcements` table (id, title, content, date).
    *   Create `documents` table (id, title, category, file_url).
    *   Create `users` table for admin access.
2. [ ] **Resource Controllers**:
    *   Implement CRUD for Announcements.
    *   Implement CRUD for Documents.
3. [ ] **File Management System**:
    *   Setup `multer` for handling PDF uploads.
    *   Configure static file serving for document downloads.
4. [ ] **Security & Authentication**:
    *   Implement JWT-based authentication.
    *   Secure admin-only routes (Create/Update/Delete).
    *   Add request validation and error handling middleware.
5. [ ] **Email Integration**:
    *   Setup `nodemailer` to process contact form submissions.
    *   Configure SMTP settings for community email.
