# PostgreSQL Database Setup Guide

## Prerequisites

1. **Install PostgreSQL**
   - Download from: https://www.postgresql.org/download/
   - Or use Docker: `docker run --name osiedlel-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`

## Setup Steps

### 1. Create Database

Connect to PostgreSQL and create the database:

```bash
# Using psql command line
psql -U postgres

# In psql prompt:
CREATE DATABASE osiedlel;
\q
```

Or using pgAdmin or any PostgreSQL GUI tool.

### 2. Run Database Schema

Execute the schema file to create tables:

```bash
# From the backend directory
psql -U postgres -d osiedlel -f database/schema.sql
```

Or copy the contents of `database/schema.sql` and run it in your PostgreSQL client.

### 3. Configure Environment Variables

Copy the example environment file:

```bash
# In backend directory
cp .env.example .env
```

Edit `.env` file with your database credentials:

```env
PORT=3000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=osiedlel
DB_PASSWORD=your_password_here
DB_PORT=5432
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the Server

```bash
npm run dev
```

## Testing Database Connection

Once the server is running, test the database connection:

1. **Health Check:**
   ```
   GET http://localhost:3000/api/health
   ```

2. **Database Test:**
   ```
   GET http://localhost:3000/api/db/test
   ```

3. **Get Items:**
   ```
   GET http://localhost:3000/api/items
   ```

4. **Create Item:**
   ```
   POST http://localhost:3000/api/items
   Content-Type: application/json

   {
     "name": "New Item",
     "description": "Item description"
   }
   ```

## Database Schema

### Items Table

```sql
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Connection Refused

- Make sure PostgreSQL is running
- Check if the port 5432 is correct
- Verify credentials in `.env` file

### Authentication Failed

- Check username and password in `.env`
- Ensure the user has access to the database

### Database Does Not Exist

- Create the database first: `CREATE DATABASE osiedlel;`
- Make sure DB_NAME in `.env` matches the created database

## Using Docker (Alternative)

If you prefer using Docker for PostgreSQL:

```bash
# Start PostgreSQL container
docker run --name osiedlel-postgres \
  -e POSTGRES_DB=osiedlel \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres

# Access the container
docker exec -it osiedlel-postgres psql -U postgres -d osiedlel

# Run schema
docker exec -i osiedlel-postgres psql -U postgres -d osiedlel < database/schema.sql
```

## Next Steps

- Add more tables as needed in `database/schema.sql`
- Create database migrations for version control
- Add database seeding scripts for development data
- Consider using an ORM like Prisma or TypeORM for complex queries
