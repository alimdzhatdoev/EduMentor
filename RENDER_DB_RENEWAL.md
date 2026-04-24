# Обновление базы данных на Render

Бесплатная БД на Render живёт 90 дней, после чего удаляется.
Когда это произойдёт — сайт перестанет работать. Следуй этой инструкции.

---

## Шаг 1 — Создать новую базу данных

1. Зайди на https://dashboard.render.com
2. **New +** → **PostgreSQL**
3. Название: `edumentor-db`
4. Plan: **Free**
5. Нажми **Create Database**
6. Подожди 1–2 минуты (статус → Available)
7. Скопируй **Internal Database URL**
8. Скопируй **External Database URL** (понадобится для seed)

---

## Шаг 2 — Обновить переменную в Web Service

1. Открой сервис **EduMentor** → вкладка **Environment**
2. Найди переменную `DATABASE_URL`
3. Замени значение на новый **Internal Database URL**
4. Нажми **Save Changes**
5. Сервис автоматически перезапустится и накатит схему (`prisma db push`)

---

## Шаг 3 — Залить тестовые данные (seed)

В PowerShell в папке `server`:

```powershell
cd D:\Diploms\2025-2026\Aisha\Project\server
$env:DATABASE_URL="вставь_сюда_EXTERNAL_DATABASE_URL"
npx tsx prisma/seed.ts
```

---

## Готово

Сайт снова работает с новой базой и тестовыми данными.

### Демо-аккаунты после seed:
| Роль | Email | Пароль |
|------|-------|--------|
| Репетитор | tutor@tutor.ru | tutor123 |
| Ученик | alina@student.ru | student123 |
