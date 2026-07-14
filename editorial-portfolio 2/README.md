# Editorial Portfolio

Статический сайт-портфолио, готовый для обычного хостинга: GitHub Pages, Netlify, Vercel, Cloudflare Pages или любого сервера с HTML-файлами.

## Файлы

- `index.html` — Home
- `work.html` — Work
- `about.html` — About
- `styles.css` — стили и адаптив
- `script.js` — параллакс, hover-превью, анимации появления и переходы
- `assets/images/` — изображения проектов
- `assets/fonts/` — папка для лицензированного файла Kudriashov

## Как запустить

Можно просто открыть `index.html` двойным кликом. Для корректной проверки переходов удобнее запустить локальный сервер:

```bash
python -m http.server 8080
```

Затем открыть `http://localhost:8080`.

## Шрифт Kudriashov

Kudriashov — отдельный коммерческий/лицензируемый шрифт, поэтому файл шрифта не включён в архив. Поместите свой лицензированный файл в:

`assets/fonts/Kudriashov.woff2`

CSS уже настроен. Пока файла нет, используется похожий системный serif fallback.

## Что заменить

1. Ссылки Behance, Telegram, Instagram и LinkedIn в трёх HTML-файлах.
3. Тексты, названия работ и SVG-картинки в `assets/images`.
4. Title и description в `<head>` каждой страницы.

## Публикация

Загрузите содержимое папки целиком в корень хостинга. Главным файлом должен остаться `index.html`.
