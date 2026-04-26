# Movies Explorer — REST API

> Бэкенд для Movies Explorer. Node.js, Express, MongoDB (Mongoose), JWT-авторизация, rate limiting, логирование через Winston. 

**Репозиторий фронтенда:** [movies-explorer-frontend](https://github.com/Yaroslav-Chertov/movies-explorer-frontend)

---

## О проекте

REST API для SPA Movies Explorer. Обеспечивает регистрацию и авторизацию пользователей, хранение избранных фильмов, валидацию запросов и базовую защиту от атак.

---

## Стек

| Слой | Технология |
|---|---|
| Сервер | Node.js, Express 4 |
| База данных | MongoDB, Mongoose 7 |
| Авторизация | JWT (jsonwebtoken), bcrypt |
| Валидация | Celebrate (Joi) |
| Безопасность | Helmet, CORS, express-rate-limit |
| Логирование | Winston, express-winston |
| Линтинг | ESLint (Airbnb config) |

---

## Архитектура

```
app.js                  # Точка входа, подключение middleware и роутов
├── routes/
│   ├── index.js        # Корневой роутер
│   ├── users.js        # Роуты пользователей
│   └── movies.js       # Роуты фильмов
├── controllers/
│   ├── users.js        # Логика пользователей
│   └── movies.js       # Логика фильмов
├── models/
│   ├── user.js         # Mongoose-схема пользователя
│   └── movie.js        # Mongoose-схема фильма
├── middlewares/
│   ├── auth.js         # Верификация JWT
│   └── errors.js       # Централизованный обработчик ошибок
├── errors/             # Кастомные классы ошибок (404, 401, 403 и др.)
└── utils/
    └── constants.js    # Константы (JWT_SECRET, коды ошибок)
```

**Ключевые решения:**

- **Централизованный обработчик ошибок** — все ошибки пробрасываются через `next(err)` и обрабатываются в едином middleware. Нет дублирования обработки по контроллерам.
- **Кастомные классы ошибок** — `NotFoundError`, `UnauthorizedError`, `ForbiddenError` и др. Каждый класс несёт нужный HTTP-статус, контроллеры просто кидают нужный тип.
- **Celebrate для валидации** — схемы Joi на уровне роутов. Невалидный запрос не доходит до контроллера.
- **bcrypt для хэширования паролей** — пароли никогда не хранятся в открытом виде, поле `password` исключено из всех выборок через `.select('-password')`.
- **express-rate-limit** — ограничение количества запросов с одного IP для защиты от brute-force атак.
- **Winston + express-winston** — логирование всех запросов и ошибок в отдельные файлы.

---

## Эндпоинты

**Авторизация (публичные)**

| Метод | Эндпоинт | Описание |
|---|---|---|
| POST | `/signup` | Регистрация пользователя |
| POST | `/signin` | Вход, получение JWT |

**Пользователи (защищённые)**

| Метод | Эндпоинт | Описание |
|---|---|---|
| GET | `/users/me` | Данные текущего пользователя |
| PATCH | `/users/me` | Обновление имени и email |

**Фильмы (защищённые)**

| Метод | Эндпоинт | Описание |
|---|---|---|
| GET | `/movies` | Сохранённые фильмы пользователя |
| POST | `/movies` | Сохранить фильм |
| DELETE | `/movies/:movieId` | Удалить фильм (только свой) |

Все защищённые роуты требуют заголовок `Authorization: Bearer <token>`.

---

## Безопасность

- **Helmet** — выставляет безопасные HTTP-заголовки, скрывает fingerprint-информацию
- **CORS** — настроен список разрешённых origins
- **Rate limiting** — лимит запросов с одного IP (1000 запросов за 15 минут)
- **Валидация на уровне роутов** — Celebrate отсекает невалидные данные до контроллера
- **Пароли** — хэшируются через bcrypt, никогда не возвращаются в ответах API

---

## Локальный запуск

```bash
# Установка зависимостей
npm install

# Настройка окружения
cp .env.example .env
# Заполнить: JWT_SECRET, MONGO_URL, PORT

# Dev-сервер с hot reload
npm run dev

# Продакшн
npm start
```

---

## Переменные окружения

| Переменная | Описание |
|---|---|
| `JWT_SECRET` | Секрет для подписи JWT-токенов |
| `MONGO_URL` | URL подключения к MongoDB |
| `PORT` | Порт сервера (по умолчанию 3000) |

---

## Что в планах

- Миграция на TypeScript
- Refresh-токены вместо долгоживущего JWT
- Покрытие эндпоинтов интеграционными тестами (Jest + Supertest)
- Swagger-документация

---

## Другие проекты

- [Structura — SaaS-планер продуктивности](https://github.com/Yaroslav-Chertov/structura) — Next.js 16, React 19, TypeScript, ЮКасса, Resend
- [GALITSKIY & GALITSKIY](https://github.com/Yaroslav-Chertov/galitskiy-and-galitskiy) — JSX, кастомный scroll-controller, Lighthouse 90+
- [ONY Career Page](https://github.com/Yaroslav-Chertov/ony-agency) — JSX, SSR + интеграция Bitrix API, Telegram-уведомления
- [Стажер Онлайн — HR-платформа](https://github.com/Yaroslav-Chertov/hr-platform) — Vue 3, TypeScript, Pinia, REST API (Django)
