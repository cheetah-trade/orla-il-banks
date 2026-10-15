---
type: scope
department: devops
status: proposed
rev: 1
author: Antons-Mac-mini · task 0f16eb7fd601
date: 2026-10-15
---
# Devops scope for orla-il-banks

## Environment
- GitHub Actions репозитория cheetah-trade/orla-il-banks: ci.yml, dco.yml, release.yml
- Чтение истории запусков и PR через gh, только чтение

## Can do alone
- Читать историю CI, PR и релизов, чтобы мерить исходы (DORA, переделки, инциденты на изменение)
- Писать замеры и отчёты в docs/ в своей ветке codex/ или claude/ и открывать PR; сливает только владелец
- Предлагать изоляцию автономных запусков и лимиты попыток документом или PR

## Ask first
- Менять .github/workflows, настройки репозитория, защиту веток, trusted publishing на npm
- Добавлять или менять секреты репозитория
- Включать платные функции GitHub (их по правилам не включаем)

## Never
- Читать, печатать или копировать значения секретов
- Выпускать пакет, сливать в main, делать force-push
- Отключать проверки CI или DCO, чтобы пройти

## Never commands
- `git push\b.*\b(main|master)\b`
- `git push\b.*(--force|-f\b)`
- `npm publish`
- `gh secret (set|delete)`
