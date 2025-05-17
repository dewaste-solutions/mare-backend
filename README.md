# Local Setup

## Environment Variables
Create an `.env` file in the root directory and configure the required environment variables:

```bash
NODE_ENV=development
DATABASE_NAME=mare
DATABASE_PASSWORD=yourpassword
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
BACKEND_PORT=8080
CA_CERT=
BACKEND_AUTH_PRIVATE_KEY=openssl rand -hex 64
BACKEND_NODEMAILER_HOST=smtp.gmail.com
BACKEND_NODEMAILER_PORT=587
BACKEND_NODEMAILER_EMAIL=
BACKEND_NODEMAILER_PASS=
BACKEND_NODEMAILER_SERVICE=gmail
BACKEND_FRONTEND_URL=
```

## Database setup
Create a PostgreSQL database
You can set up a PostgreSQL database using your preferred method:

Using Docker (Optional):
```bash
docker run -d --name mare-postgres -e POSTGRES_USER="postgres" -e POSTGRES_PASSWORD="yourpassword" -e POSTGRES_DB="mare" -p 5432:5432 docker.io/postgres:15 
```

Generate & Apply Migrations
Generate migrations:
```bash
npm run db:generate
```
Apply migrations:
```bash
npm run db:migrate
```
Seed Initial Data (Optional)
```
npm run seed
```

## Database Studio
To explore the database schema using Drizzle Studio (Optional):
```bash
npm run db:studio
```

## Running the Application
Development Mode
```bash
npm run dev
```
Production Mode
```bash
npm run build
npm run start
```

<!-- about race condition in database -->
<!-- https://github.com/drizzle-team/drizzle-orm/issues/2875 -->