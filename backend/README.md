# Backend - Employee Monitoring System

Backend service untuk aplikasi monitoring karyawan, mencakup autentikasi, manajemen profil, absensi, notifikasi real-time, dan logging menggunakan message queue.

## Setup Environment

```
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.vjlgahqrsldnpfxjojib:Dpy8mtQWmsm2bCap@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.vjlgahqrsldnpfxjojib:Dpy8mtQWmsm2bCap@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"
```

## Install Dependencies

```
npm install
```

## Run Prisma Migration

```
npm run prisma:migrate-dev
```

## Run RabbitMQ Container

```
docker-compose up -d
```

## Run the Service

```
npm run start:dev
```

Server will run at `http://localhost:9099`
