# GREEN-API Chat

React-интерфейс чата для MAX / WhatsApp / Telegram через GREEN-API.

## Стек

- React 19 + TypeScript + Vite;
- Tailwind CSS 4;
- Axios;
- Zustand;
- TanStack Query 5;
- Lucide React;
- React Router 7;
- Zod 4.

## Запуск

Выберите один пакетный менеджер.

### Bun

```bash
bun install --frozen-lockfile
bun run dev
```

### npm

```bash
npm ci
npm run dev
```

В форме подключения укажите `API URL`, `idInstance`, `apiTokenInstance` и номер телефона получателя в международном формате. Приложение преобразует номер в `chatId`; первое отправленное сообщение создаёт новый чат. Для получения ответов у инстанса должен быть пустой `webhookUrl` и включены входящие уведомления.

Чтобы отображались статусы доставки, прочтения и изменения состояния инстанса, включите в настройках GREEN-API уведомления о сообщениях, отправленных через API, статусы исходящих сообщений и изменения состояния авторизации. Настройки применимы к MAX, WhatsApp и Telegram.

Входящие уведомления получаются последовательным long polling через `ReceiveNotification` с таймаутом 60 секунд. После обработки каждое уведомление подтверждается методом `DeleteNotification`.

## Структура

```text
src/
├── app/          # корневой компонент и провайдеры
├── components/   # экраны и UI-компоненты
├── hooks/        # polling и отправка сообщений
├── pages/        # страницы маршрутов / и /chat
├── schemas/      # Zod-схемы валидации
├── services/     # Axios-клиент GREEN-API
├── store/        # Zustand store
├── styles/       # Tailwind v4 и глобальная тема
├── types/        # доменные типы
└── utils/        # чистые вспомогательные функции
```

## Проверка

```bash
npm run lint
npm run build
```

или через Bun:

```bash
bun run lint
bun run build
```
