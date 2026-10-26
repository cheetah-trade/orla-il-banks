---
type: backlog
id: 20261019-israeli-bank-scrapers-releasing-md-8235
department: development
status: proposed
take: owner
priority: normal
author: Antons-MacBook-Pro · task 8e3ccf413e5a
date: 2026-10-19
task: 
after: 
goal: 
epic: Фаза 2: свежая версия и первый запуск сам
rank: 
found_in: 
updated: 2026-10-19T08:27:27Z
stale: Untouched since 19 Oct: approve it or drop it
checks: security
cod: value 4 · urgency 4 · risk 4 · size 3
cod_by: Development lead · task 827759d992a3
cod_note: Банки меняют сайты, закреплённая 6.12.1 стареет, PR #10 и #8 висят 10–17 дней; живые проверки фазы 2 нужны на свежей версии; риск — регрессии парсеров.
---
# Поднять israeli-bank-scrapers до актуальной версии по RELEASING.md

Для кого: каждый, у кого банк поменял сайт. Банки меняют сайты, библиотека за ними успевает, а у нас закреплена 6.12.1: Dependabot PR #10 (6.12.2) висит 10,5 дня, PR #8 (@puppeteer/browsers 3.x, мажор) 17,5 дня. Живые проверки фазы 1 должны быть на версии, которую мы выпустим, иначе отметка «Live-checked» относится к старому коду. Что сделать: поднять библиотеку до последней версии на момент работы строго по разделу «Raising israeli-bank-scrapers» в RELEASING.md (прочитать diff src/scrapers и src/helpers, проверить хосты и install-скрипты, puppeteer и @puppeteer/browsers равны тем, что она тянет, shrinkwrap, тесты). PR #8 и #10 закрыть со ссылкой на этот PR или влить, если они и есть нужная версия. Вне рамок: сам релиз и README (это 20261015-live-checked-readme-0-3-x-1-eb34), latest не ставить.

## Acceptance criteria

- Новая версия закреплена точно (--save-exact), npm-shrinkwrap.json обновлён, CI зелёный на macOS, Windows и Docker
- В описании PR: список хостов из lib до и после, вывод npm view … scripts, и вывод «только банковские домены, install-скриптов нет»
- puppeteer и @puppeteer/browsers равны версиям, которые разрешает библиотека; судьба PR #8 и #10 записана в PR (закрыты со ссылкой или влиты)
- В PR перечислено, какие банки затронуты изменениями библиотеки: их отметку Live-checked надо подтвердить заново
