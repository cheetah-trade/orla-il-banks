---
type: scope
department: development
status: active
rev: 1
author: Antons-Mac-mini · task 0f16eb7fd601
date: 2026-10-15
---
# Development scope for orla-il-banks

## Environment
- Локально: Node.js 22+, npm ci, npm run check, npm test (как в CONTRIBUTING.md)
- CI: .github/workflows/ci.yml в GitHub Actions на Mac, Windows и Linux
- Банки только через тесты на формах данных библиотеки и run --from-json с выдуманными данными; живых логинов у агентов нет

## Can do alone
- Работать в своей ветке codex/ или claude/ в рабочей копии задачи
- Менять src/, test/, docs/, README.md, CONTRIBUTING.md, templates/, если тест падает без правки
- Запускать npm ci, npm run check, npm test, npm run build
- Коммитить с подписью DCO (git commit -s) после зелёных тестов
- Открывать PR в cheetah-trade/orla-il-banks; сливает только владелец

## Ask first
- Новая зависимость времени выполнения (по CONTRIBUTING её нужно обосновать заранее)
- Поднять закреплённую версию israeli-bank-scrapers или мажорную версию инструментов
- Выпустить релиз: версия, тег, release.yml
- Менять .github/workflows или dependabot.yml

## Never
- Сливать в main, пушить в main или master, делать force-push
- Логиниться в настоящий банк или брать чьи-то настоящие логины
- Слать строки или логины куда-то ещё, кроме Orla и банка, в том числе телеметрию
- Класть в git, логи, PR или канал пароли, ключи Orla, выписки из --save-json или полные номера счетов
- Делать npm publish руками

## Never commands
- `git push\b.*\b(main|master)\b`
- `git push\b.*(--force|-f\b)`
- `npm publish`
