# EduMentor — Система управления репетитором

Полноценное веб-приложение для организации работы репетитора: заявки, ученики, расписание, домашние задания, материалы и оплаты.

## Технологии

**Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Zustand + React Router

**Backend:** Node.js + TypeScript + Express + Prisma ORM + PostgreSQL + JWT

---

## Быстрый старт

### 1. Требования

- Node.js 18+
- PostgreSQL (запущенный локально)

### 2. Настройка базы данных

Создайте БД в PostgreSQL:
```sql
CREATE DATABASE tutor_db;
```

### 3. Запуск Backend

```bash
cd server
npm install
# При необходимости отредактируйте .env (DATABASE_URL)
npx prisma db push
npm run db:seed
npm run dev
```

Сервер запустится на `http://localhost:5000`

### 4. Запуск Frontend

```bash
cd client
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`

---

## Тестовые аккаунты

| Роль       | Email                  | Пароль     |
|------------|------------------------|------------|
| Репетитор  | tutor@tutor.kz         | tutor123   |
| Ученик     | alina@student.kz       | student123 |
| Ученик     | daniyar@student.kz     | student123 |
| Ученик     | madina@student.kz      | student123 |

---

## Структура проекта

```
Project/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # UI-компоненты
│   │   ├── layouts/       # PublicLayout, DashboardLayout
│   │   ├── lib/           # api.ts, utils.ts
│   │   ├── pages/
│   │   │   ├── public/    # Лендинг-страницы
│   │   │   ├── dashboard/ # Кабинет репетитора
│   │   │   └── student/   # Кабинет ученика
│   │   ├── store/         # Zustand (auth)
│   │   └── types/         # TypeScript типы
│   └── ...
└── server/                # Express backend
    ├── prisma/
    │   ├── schema.prisma  # Схема БД
    │   └── seed.ts        # Тестовые данные
    └── src/
        ├── middleware/    # JWT auth
        └── routes/        # API endpoints
```

## Маршруты приложения

| Путь | Описание |
|------|----------|
| `/` | Главная (лендинг) |
| `/about` | О репетиторе |
| `/services` | Услуги |
| `/pricing` | Стоимость |
| `/reviews` | Отзывы |
| `/contact` | Контакты |
| `/apply` | Форма заявки |
| `/login` | Авторизация |
| `/dashboard` | Кабинет репетитора |
| `/student` | Кабинет ученика |
