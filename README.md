# Flood17Plus — Genshin Impact Community Portal

Статический сайт-портал для Telegram флуд-чата по Genshin Impact.

## Возможности

- Кастомный курсор с плавным следованием и hover-эффектами
- Магнитные кнопки (притягиваются к курсору)
- GSAP ScrollTrigger — параллакс, reveal-анимации, счётчики
- Gradient orbs с анимацией и параллаксом
- Прелоадер с анимированной линией
- Noise текстура поверх всего сайта
- Glassmorphism навигация при скролле
- Стагерные анимации карточек
- Объявления с приоритетами
- Ивенты с поиском и фильтрацией по тегам
- Детальная страница ивента (lightbox)
- Lazy load изображений
- Полный адаптив (mobile-first)
- Мобильное меню со стагерной анимацией
- Auto-detect past/upcoming по дате
- Hash-роутинг для ивентов

## Структура

```
flood17plus/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── data/
│   ├── events.json
│   └── announcements.json
└── README.md
```

## Запуск

```bash
cd flood17plus
python3 -m http.server 8080
```

Открыть http://localhost:8080

## Деплой на GitHub Pages

1. Создайте репозиторий на GitHub
2. Запушьте код:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/flood17plus.git
   git push -u origin main
   ```
3. Settings -> Pages -> Source: Deploy from branch `main`, folder `/ (root)`
4. Сайт: `https://YOUR_USERNAME.github.io/flood17plus/`

## Управление контентом

Редактируйте JSON файлы в папке `data/`.
Статус ивентов определяется автоматически по дате.

## Зависимости

- GSAP 3.12 (CDN) — анимации
- Google Fonts: Cormorant Garamond + Inter
- Без фреймворков
