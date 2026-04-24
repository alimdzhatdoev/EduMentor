# Техническая документация — EduMentor

## Содержание

1. [Обзор системы](#1-обзор-системы)
2. [Архитектура приложения](#2-архитектура-приложения)
3. [Стек технологий](#3-стек-технологий)
4. [Структура проекта](#4-структура-проекта)
5. [База данных](#5-база-данных)
6. [API-эндпоинты](#6-api-эндпоинты)
7. [Фронтенд — маршруты и страницы](#7-фронтенд--маршруты-и-страницы)
8. [Аутентификация и авторизация](#8-аутентификация-и-авторизация)
9. [Развёртывание и запуск](#9-развёртывание-и-запуск)
10. [Тестовые данные](#10-тестовые-данные)

---

## 1. Обзор системы

**EduMentor** — веб-приложение для автоматизации работы частного репетитора. Система охватывает полный цикл взаимодействия репетитора с учеником: от первичной заявки до учёта оплат.

### Ключевые возможности

| Модуль | Описание |
|---|---|
| Публичный лендинг | Презентация услуг, отзывы, прайс, форма заявки |
| Заявки | Приём и обработка заявок от потенциальных учеников |
| Ученики | Ведение базы учеников с профилями |
| Расписание | Планирование и просмотр занятий по дням |
| Занятия | Полный учёт уроков (статус, формат, стоимость) |
| Домашние задания | Назначение заданий и отслеживание статуса выполнения |
| Материалы | Библиотека учебных материалов (документы, видео, ссылки) |
| Оплаты | Учёт платежей и контроль задолженностей |
| Кабинет ученика | Личный кабинет для просмотра расписания, заданий и материалов |

---

## 2. Архитектура приложения

Приложение построено по классической клиент-серверной архитектуре (SPA + REST API).

```
┌─────────────────────────────────┐
│         Браузер (Client)        │
│  React SPA (Vite + TypeScript)  │
│  порт 5173 (dev)                │
└────────────────┬────────────────┘
                 │ HTTP / REST API
                 │ Bearer JWT Token
┌────────────────▼────────────────┐
│         Backend (Server)        │
│  Node.js + Express + TypeScript │
│  порт 5000                      │
└────────────────┬────────────────┘
                 │ Prisma ORM
┌────────────────▼────────────────┐
│        PostgreSQL Database      │
│  База данных: tutor_db          │
└─────────────────────────────────┘
```

### Принципы архитектуры

- **Разделение ролей**: два типа пользователей — `TUTOR` (репетитор) и `STUDENT` (ученик). Каждый имеет свой интерфейс и набор прав.
- **REST API**: сервер предоставляет JSON API, фронтенд потребляет его через `axios`.
- **JWT авторизация**: токен хранится в `localStorage`, передаётся в заголовке `Authorization: Bearer <token>`.
- **Ролевой доступ**: мидлвары `authenticate` и `requireTutor` защищают эндпоинты на уровне сервера, `ProtectedRoute` — на уровне клиента.

---

## 3. Стек технологий

### Frontend

| Технология | Версия | Назначение |
|---|---|---|
| React | 18.2 | UI-фреймворк |
| TypeScript | 5.3 | Типизация |
| Vite | 5.1 | Сборщик и dev-сервер |
| React Router DOM | 6.22 | Маршрутизация SPA |
| Tailwind CSS | 3.4 | Утилитарные CSS-классы |
| shadcn/ui (Radix UI) | — | Компонентная библиотека |
| Zustand | 4.5 | Управление состоянием (auth) |
| Axios | 1.6 | HTTP-клиент |
| React Hook Form | 7.51 | Управление формами |
| Zod | 3.22 | Валидация схем |
| date-fns | 3.3 | Работа с датами |
| lucide-react | 0.344 | Иконки |

### Backend

| Технология | Версия | Назначение |
|---|---|---|
| Node.js | 18+ | Среда выполнения |
| TypeScript | 5.3 | Типизация |
| Express | 4.18 | HTTP-фреймворк |
| Prisma ORM | 5.10 | Работа с БД |
| PostgreSQL | — | База данных |
| bcryptjs | 2.4 | Хэширование паролей |
| jsonwebtoken | 9.0 | JWT-токены |
| helmet | 7.1 | HTTP-заголовки безопасности |
| cors | 2.8 | CORS-политика |
| multer | 1.4 | Загрузка файлов |
| zod | 3.22 | Валидация данных |
| dotenv | 16.4 | Переменные окружения |

---

## 4. Структура проекта

```
Project/
├── client/                        # React-фронтенд
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx               # Точка входа
│       ├── App.tsx                # Маршрутизация
│       ├── index.css              # Глобальные стили
│       ├── components/            # Переиспользуемые компоненты
│       │   ├── EmptyState.tsx
│       │   ├── PageHeader.tsx
│       │   ├── ProtectedRoute.tsx
│       │   ├── StatusBadge.tsx
│       │   └── ui/                # shadcn/ui компоненты
│       ├── layouts/
│       │   ├── PublicLayout.tsx   # Шапка/подвал для лендинга
│       │   └── DashboardLayout.tsx # Боковое меню для кабинета
│       ├── lib/
│       │   ├── api.ts             # Настроенный axios-инстанс
│       │   └── utils.ts           # Вспомогательные функции
│       ├── pages/
│       │   ├── LoginPage.tsx      # Страница авторизации
│       │   ├── public/            # Публичные страницы (лендинг)
│       │   │   ├── HomePage.tsx
│       │   │   ├── AboutPage.tsx
│       │   │   ├── ServicesPage.tsx
│       │   │   ├── PricingPage.tsx
│       │   │   ├── ReviewsPage.tsx
│       │   │   ├── ContactPage.tsx
│       │   │   └── ApplyPage.tsx
│       │   ├── dashboard/         # Кабинет репетитора
│       │   │   ├── DashboardHome.tsx
│       │   │   ├── ApplicationsPage.tsx
│       │   │   ├── StudentsPage.tsx
│       │   │   ├── SchedulePage.tsx
│       │   │   ├── LessonsPage.tsx
│       │   │   ├── HomeworkPage.tsx
│       │   │   ├── MaterialsPage.tsx
│       │   │   ├── PaymentsPage.tsx
│       │   │   └── ProfilePage.tsx
│       │   └── student/           # Кабинет ученика
│       │       ├── StudentHome.tsx
│       │       ├── StudentSchedule.tsx
│       │       ├── StudentLessons.tsx
│       │       ├── StudentHomework.tsx
│       │       ├── StudentMaterials.tsx
│       │       └── StudentProfile.tsx
│       ├── store/
│       │   └── authStore.ts       # Zustand-стор (JWT, user)
│       └── types/
│           └── index.ts           # TypeScript-интерфейсы
│
└── server/                        # Express-бэкенд
    ├── .env                       # Переменные окружения
    ├── tsconfig.json
    ├── prisma/
    │   ├── schema.prisma          # Схема базы данных
    │   └── seed.ts                # Заполнение тестовыми данными
    └── src/
        ├── index.ts               # Точка входа сервера
        ├── middleware/
        │   └── auth.ts            # JWT-аутентификация, ролевые миддлвары
        └── routes/
            ├── auth.ts
            ├── applications.ts
            ├── students.ts
            ├── lessons.ts
            ├── homework.ts
            ├── materials.ts
            └── payments.ts
```

---

## 5. База данных

### Схема (Prisma / PostgreSQL)

#### Перечисления (Enums)

| Enum | Значения |
|---|---|
| `Role` | `TUTOR`, `STUDENT` |
| `ApplicationStatus` | `NEW`, `IN_PROGRESS`, `APPROVED`, `REJECTED` |
| `LessonStatus` | `SCHEDULED`, `COMPLETED`, `CANCELLED` |
| `LessonFormat` | `ONLINE`, `OFFLINE` |
| `HomeworkStatus` | `ASSIGNED`, `SUBMITTED`, `REVIEWED` |
| `PaymentStatus` | `PENDING`, `PAID`, `OVERDUE` |
| `MaterialType` | `DOCUMENT`, `VIDEO`, `LINK`, `IMAGE` |

#### Модель: `User`

| Поле | Тип | Описание |
|---|---|---|
| `id` | String (cuid) | Первичный ключ |
| `fullName` | String | Полное имя |
| `email` | String (unique) | Email (логин) |
| `passwordHash` | String | Хэш пароля (bcrypt) |
| `phone` | String? | Телефон (опц.) |
| `role` | Role | `TUTOR` или `STUDENT` |
| `avatarUrl` | String? | URL аватара (опц.) |
| `createdAt` | DateTime | Дата создания |
| `updatedAt` | DateTime | Дата обновления |

#### Модель: `Application` (Заявка)

| Поле | Тип | Описание |
|---|---|---|
| `id` | String | Первичный ключ |
| `name` | String | Имя заявителя |
| `phone` | String | Телефон |
| `email` | String? | Email (опц.) |
| `subject` | String | Предмет |
| `level` | String | Уровень/класс |
| `preferredTime` | String? | Предпочтительное время |
| `message` | String? | Сообщение |
| `status` | ApplicationStatus | Статус заявки |
| `createdAt` | DateTime | Дата создания |

#### Модель: `Student` (Ученик)

| Поле | Тип | Описание |
|---|---|---|
| `id` | String | Первичный ключ |
| `userId` | String (unique) | Ссылка на `User` |
| `subject` | String | Основной предмет |
| `level` | String | Класс/уровень |
| `notes` | String? | Заметки репетитора |
| `createdAt` | DateTime | Дата создания |
| `updatedAt` | DateTime | Дата обновления |

#### Модель: `Lesson` (Занятие)

| Поле | Тип | Описание |
|---|---|---|
| `id` | String | Первичный ключ |
| `studentId` | String | Ссылка на `Student` |
| `title` | String | Тема занятия |
| `description` | String? | Описание |
| `date` | DateTime | Дата занятия |
| `startTime` | String | Время начала |
| `endTime` | String | Время конца |
| `format` | LessonFormat | `ONLINE` / `OFFLINE` |
| `status` | LessonStatus | Статус занятия |
| `price` | Float | Стоимость занятия |
| `comment` | String? | Комментарий |

#### Модель: `Homework` (Домашнее задание)

| Поле | Тип | Описание |
|---|---|---|
| `id` | String | Первичный ключ |
| `studentId` | String | Ссылка на `Student` |
| `lessonId` | String? | Ссылка на `Lesson` (опц.) |
| `title` | String | Название задания |
| `description` | String? | Описание |
| `dueDate` | DateTime? | Срок сдачи |
| `status` | HomeworkStatus | Статус выполнения |

#### Модель: `Material` (Учебный материал)

| Поле | Тип | Описание |
|---|---|---|
| `id` | String | Первичный ключ |
| `title` | String | Название |
| `description` | String? | Описание |
| `type` | MaterialType | Тип материала |
| `url` | String? | Ссылка (для LINK/VIDEO) |
| `fileUrl` | String? | Путь к файлу |
| `studentId` | String? | Привязка к ученику (null = общий) |
| `subject` | String? | Предмет |

#### Модель: `Payment` (Оплата)

| Поле | Тип | Описание |
|---|---|---|
| `id` | String | Первичный ключ |
| `studentId` | String | Ссылка на `Student` |
| `amount` | Float | Сумма |
| `paymentDate` | DateTime? | Дата оплаты |
| `status` | PaymentStatus | `PENDING`, `PAID`, `OVERDUE` |
| `comment` | String? | Комментарий |

### Связи между моделями

```
User (1) ──── (1) Student
Student (1) ── (N) Lesson
Student (1) ── (N) Homework
Student (1) ── (N) Material
Student (1) ── (N) Payment
Lesson  (1) ── (N) Homework
```

---

## 6. API-эндпоинты

Базовый URL: `http://localhost:5000/api`

### Аутентификация — `/api/auth`

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| `POST` | `/auth/login` | Публичный | Вход в систему, возвращает JWT + user |
| `GET` | `/auth/me` | Авторизованный | Получить данные текущего пользователя |

**Тело запроса `POST /auth/login`:**
```json
{ "email": "tutor@tutor.kz", "password": "tutor123" }
```

**Ответ:**
```json
{
  "token": "<JWT>",
  "user": { "id": "...", "fullName": "...", "email": "...", "role": "TUTOR", ... }
}
```

---

### Заявки — `/api/applications`

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| `POST` | `/applications` | Публичный | Подать заявку (форма на сайте) |
| `GET` | `/applications` | TUTOR | Получить все заявки |
| `PATCH` | `/applications/:id` | TUTOR | Обновить статус заявки |

---

### Ученики — `/api/students`

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| `GET` | `/students` | Авторизованный | Получить список учеников |
| `GET` | `/students/:id` | Авторизованный | Получить ученика по ID |
| `POST` | `/students` | TUTOR | Создать ученика (создаёт User + Student) |
| `PATCH` | `/students/:id` | TUTOR | Обновить данные ученика |
| `DELETE` | `/students/:id` | TUTOR | Удалить ученика |

---

### Занятия — `/api/lessons`

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| `GET` | `/lessons` | Авторизованный | Все занятия (репетитор) / свои (ученик) |
| `GET` | `/lessons/:id` | Авторизованный | Занятие по ID |
| `POST` | `/lessons` | TUTOR | Создать занятие |
| `PATCH` | `/lessons/:id` | TUTOR | Обновить занятие |
| `DELETE` | `/lessons/:id` | TUTOR | Удалить занятие |

---

### Домашние задания — `/api/homework`

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| `GET` | `/homework` | Авторизованный | Все задания (репетитор) / свои (ученик) |
| `GET` | `/homework/:id` | Авторизованный | Задание по ID |
| `POST` | `/homework` | TUTOR | Создать задание |
| `PATCH` | `/homework/:id` | Авторизованный | Обновить задание (ученик может менять статус) |
| `DELETE` | `/homework/:id` | TUTOR | Удалить задание |

---

### Материалы — `/api/materials`

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| `GET` | `/materials` | Авторизованный | Все материалы (репетитор) / доступные (ученик) |
| `GET` | `/materials/:id` | Авторизованный | Материал по ID |
| `POST` | `/materials` | TUTOR | Добавить материал |
| `PATCH` | `/materials/:id` | TUTOR | Обновить материал |
| `DELETE` | `/materials/:id` | TUTOR | Удалить материал |

---

### Оплаты — `/api/payments`

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| `GET` | `/payments` | Авторизованный | Все платежи (репетитор) / свои (ученик) |
| `POST` | `/payments` | TUTOR | Добавить платёж |
| `PATCH` | `/payments/:id` | TUTOR | Обновить платёж |
| `DELETE` | `/payments/:id` | TUTOR | Удалить платёж |

---

## 7. Фронтенд — маршруты и страницы

### Публичные маршруты (без авторизации)

| Маршрут | Компонент | Описание |
|---|---|---|
| `/` | `HomePage` | Главная страница — герой, преимущества, призыв к действию |
| `/about` | `AboutPage` | О репетиторе — биография, опыт, достижения |
| `/services` | `ServicesPage` | Предоставляемые услуги и предметы |
| `/pricing` | `PricingPage` | Тарифы и стоимость занятий |
| `/reviews` | `ReviewsPage` | Отзывы учеников |
| `/contact` | `ContactPage` | Контактная информация |
| `/apply` | `ApplyPage` | Форма записи на занятия |
| `/login` | `LoginPage` | Авторизация (JWT) |

### Кабинет репетитора (роль: TUTOR)

| Маршрут | Компонент | Описание |
|---|---|---|
| `/dashboard` | `DashboardHome` | Обзор — статистика, ближайшие занятия, задолженности |
| `/dashboard/applications` | `ApplicationsPage` | Управление заявками (смена статуса) |
| `/dashboard/students` | `StudentsPage` | База учеников — добавление, просмотр, удаление |
| `/dashboard/schedule` | `SchedulePage` | Расписание по дням недели |
| `/dashboard/lessons` | `LessonsPage` | Все занятия — создание, редактирование, фильтрация |
| `/dashboard/homework` | `HomeworkPage` | Назначение домашних заданий |
| `/dashboard/materials` | `MaterialsPage` | Библиотека материалов |
| `/dashboard/payments` | `PaymentsPage` | Учёт оплат и задолженностей |
| `/dashboard/profile` | `ProfilePage` | Профиль репетитора |

### Кабинет ученика (роль: STUDENT)

| Маршрут | Компонент | Описание |
|---|---|---|
| `/student` | `StudentHome` | Дашборд — ближайшее занятие, задания, материалы |
| `/student/schedule` | `StudentSchedule` | Персональное расписание |
| `/student/lessons` | `StudentLessons` | История занятий |
| `/student/homework` | `StudentHomework` | Задания (просмотр и смена статуса) |
| `/student/materials` | `StudentMaterials` | Учебные материалы |
| `/student/profile` | `StudentProfile` | Профиль ученика |

---

## 8. Аутентификация и авторизация

### Серверная сторона

**Мидлвар `authenticate`** (`server/src/middleware/auth.ts`):
- Извлекает Bearer-токен из заголовка `Authorization`
- Верифицирует JWT через `process.env.JWT_SECRET`
- Прикрепляет `{ id, role, email }` к объекту `req.user`

**Мидлвар `requireTutor`**:
- Проверяет `req.user.role === 'TUTOR'`
- Возвращает `403 Forbidden` для учеников

### Клиентская сторона

**`authStore.ts`** (Zustand):
- Хранит `token` и `user`
- Персистирует токен в `localStorage`
- Метод `fetchMe()` — обновляет профиль пользователя при загрузке

**`ProtectedRoute`** (`components/ProtectedRoute.tsx`):
- Проверяет наличие токена и соответствие роли
- Перенаправляет неавторизованных на `/login`

**`api.ts`** (axios interceptors):
- Request interceptor: автоматически добавляет `Authorization: Bearer <token>`
- Response interceptor: при `401` очищает localStorage и редиректит на `/login`

---

## 9. Развёртывание и запуск

### Требования

- Node.js 18+
- PostgreSQL (локально или удалённо)

### Шаг 1 — Создание базы данных

```sql
CREATE DATABASE tutor_db;
```

### Шаг 2 — Настройка окружения

Файл `server/.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/tutor_db"
JWT_SECRET="your_secret_key_here"
PORT=5000
```

### Шаг 3 — Запуск бэкенда

```bash
cd server
npm install
npx prisma db push       # Применить схему БД
npm run db:seed          # Заполнить тестовыми данными
npm run dev              # Запуск dev-сервера
```

Сервер будет доступен на: `http://localhost:5000`

### Шаг 4 — Запуск фронтенда

```bash
cd client
npm install
npm run dev
```

Приложение будет доступно на: `http://localhost:5173`

### Доступные npm-скрипты (server)

| Скрипт | Описание |
|---|---|
| `npm run dev` | Запуск с горячей перезагрузкой (`tsx watch`) |
| `npm run build` | Компиляция TypeScript |
| `npm run start` | Запуск скомпилированной версии |
| `npm run db:push` | Применить схему Prisma к БД |
| `npm run db:seed` | Заполнить БД тестовыми данными |
| `npm run db:studio` | Открыть Prisma Studio (GUI для БД) |

---

## 10. Тестовые данные

После выполнения `npm run db:seed` в системе будут созданы:

### Аккаунты

| Роль | Email | Пароль |
|---|---|---|
| Репетитор | tutor@tutor.kz | tutor123 |
| Ученик | alina@student.kz | student123 |
| Ученик | daniyar@student.kz | student123 |
| Ученик | madina@student.kz | student123 |

### Тестовые ученики

- Алина Смирнова — Математика, 9 класс (подготовка к ОГЭ)
- Даниил Петров — Физика, 11 класс (поступление в вуз)
- Мария Иванова — Английский язык, Upper-Intermediate (IELTS)
- Анастасия Козлова — Химия, 10 класс (олимпиады)
- Тимур Волков — Математика, 8 класс (устранение пробелов)

Seed-скрипт автоматически создаёт занятия, домашние задания, материалы и платежи для каждого ученика.
