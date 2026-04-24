# Кровавая луна — поздравление с Днём рождения

Статический сайт-поздравление в стиле тёмной славянской мифологии (ритуал кровавой луны). Чистый HTML + CSS + vanilla JS, без зависимостей и сборки.

## Быстрый старт

```bash
# локально — просто открыть в браузере
open index.html
```

## Деплой на GitHub Pages

1. Создать репозиторий на GitHub и запушить файлы в ветку `main`:
   ```bash
   git init
   git add .
   git commit -m "Kupala night birthday greeting"
   git branch -M main
   git remote add origin git@github.com:<USER>/<REPO>.git
   git push -u origin main
   ```
2. В настройках репозитория открыть **Settings → Pages**.
3. В разделе **Source** выбрать `Deploy from a branch`, ветку `main` и папку `/ (root)`. Сохранить.
4. Через 1–2 минуты сайт доступен по адресу `https://<USER>.github.io/<REPO>/`.

## Фото не отображаются на GitHub Pages?

1. Убедитесь, что файлы **закоммичены и запушены**:
   ```bash
   git add photos/
   git commit -m "add photos"
   git push
   ```
2. GitHub Pages **регистрозависим**. Резолвер в `script.js` автоматически перебирает `.jpg`, `.jpeg`, `.png`, `.webp` и их верхний регистр (`.JPG` и т.д.) — поэтому любое разумное имя подхватится. Но проверьте, что файл реально существует в репозитории после `git push`.
3. Убедитесь, что в `.gitignore` нет правил, исключающих `photos/` или `*.jpg`.
4. Подождите 1–2 минуты после пуша: GitHub Pages пересобирает сайт.

## Кастомизация

- **Фотографии в медальоны** — положите `1.jpg`, `2.jpg`, `3.jpg` в папку `photos/` (см. `photos/README.md`). Центральный медальон — `2.jpg`. Если файлов нет — показываются рунические placeholder-ы.
- **Текст поздравления** — в `index.html`, блок `<section class="greeting">`, помечен комментарием `<!-- EDIT_ME -->`.
- **Цвета** — CSS-переменные в самом верху `styles.css` (`:root { --c-blood, --c-crimson, ... }`).
- **Количество свечей / глаз / светлячков** — константы в `script.js` (`candleCount`, `eyeCount`, `fireflyCount`).

## Что внутри

- `index.html` — разметка сцены: небо, кровавая луна, лес, туман, свечи, алтарь с 3 медальонами, поздравление.
- `styles.css` — палитра, слои, keyframe-анимации, интро-последовательность, адаптив, reduced-motion.
- `script.js` — генерация декора, intro, parallax на мышь, искры, клик-ignite по медальонам.
- `photos/` — папка с фото: `1.jpg` — левый, `2.jpg` — центральный, `3.jpg` — правый.
