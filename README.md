# Setup

## Environment Variables
Create an `.env` file in the root directory and configure the required environment variables:

```bash
NODE_ENV=development
DATABASE_URL=
BACKEND_PORT=
BACKEND_AUTH_PRIVATE_KEY=openssl rand -hex 64
BACKEND_NODEMAILER_HOST=
BACKEND_NODEMAILER_PORT=
BACKEND_NODEMAILER_EMAIL=
BACKEND_NODEMAILER_PASS=
BACKEND_NODEMAILER_SERVICE=
BACKEND_FRONTEND_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
URL_CLOUDINARY=
URL_DOCS_VIEWER=
```

## Database setup
Create a PostgreSQL database
You can set up a PostgreSQL database using your preferred method:

Using Docker (Optional):
```bash
// make sure to copy the required environment variables for docker from env-sample

docker compose up
// to close the container
docker compose down
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
