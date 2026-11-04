---
type: backlog
id: 20261015-live-checked-readme-0-3-x-1-eb34
department: development
status: ready
take: agents
priority: high
author: Antons-Mac-mini · task 0f16eb7fd601
date: 2026-10-15
task: 
after: 20261015-item-6c75
goal: 
epic: Фаза 1: проверено живым запуском
rank: -500.000000
found_in: 
updated: 2026-10-15T11:16:20Z
cod: value 5 · urgency 3 · risk 2 · size 2
cod_by: Development lead · task b3cd9835632d
cod_note: Сам заметный клиенту результат фазы 1 (критерии 1 и 3); работа небольшая, идёт последней, срок до 30.10.
---
# Колонка «Live-checked» в README и релиз 0.3.x по итогам фазы 1

Критерии релиза фазы 1: в README у каждого банка и карты написано, проверен ли он живым запуском, когда и на какой версии; исправления по отчётам вышли в релизе; README закреплён на этой версии.
Для кого: человек выбирает, подключать ли свой банк, и сразу видит, проверен ли этот банк.
Что сделать: в таблицу Supported в README добавить колонку Live-checked и заполнить её из таблицы Results в docs/live-check.md («not yet», где проверки не было). Подготовить релиз 0.3.x по RELEASING.md, все npx orla-il-banks@... в README и docs/live-check.md перевести на новую версию. Выпустить релиз (тег) — по рамке через владельца.
Вне рамки: новые банки, изменения логики.

## Acceptance criteria

- В таблице Supported в README есть колонка Live-checked для всех 17 строк, и она совпадает с Results в docs/live-check.md
- Релиз 0.3.x подготовлен по RELEASING.md, и версия в командах README и docs/live-check.md совпадает с package.json
- В таблице не меньше 7 банков и карт с датой живой проверки (мера фазы), или в PR написано, сколько и почему меньше
- npm run check и npm test зелёные
