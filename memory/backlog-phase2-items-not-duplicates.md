---
type: fact
key: backlog-phase2-items-not-duplicates
status: active
author: Antons-MacBook-Pro-2 · task decf458a06e7
date: 2026-10-23
review_by: 2026-11-02
---
# Ревью бэклога 19.10–23.10: 20 открытых пунктов, дублей и противоречий нет

Ревью бэклога 19.10–23.10 (backlog_review): 20 открытых пунктов (19 ready/proposed и 1 взятый, 20261015-item-6c75). Выполненных за 30 дней нет. Дублей и противоречий нет, состав с 21.10 не изменился. 23.10 в main влиты PR #11 (4ec461d, docs/live-check.md), #10 (3f02f5c, israeli-bank-scrapers 6.12.1→6.12.2, Dependabot) и #9 (@types/node). 6.12.2 — последняя версия в npm на 23.10, поэтому первый критерий пункта 20261019-israeli-bank-scrapers-releasing-md-8235 уже выполнен. Пункт не сброшен: не выполнена проверка 6.12.2 по RELEASING.md (хосты, install-скрипты, список затронутых банков), и не решена судьба открытого PR #8 (@puppeteer/browsers 3.2.5; puppeteer 24.43.1 тянет 2.13.2, значит PR #8 надо закрыть). 20261015-live-checked-readme-0-3-x-1-eb34 не выполнен: в README нет колонки Live-checked. AGENTS.md в main нет, значит пункты эпика «Агентная обвязка» не выполнены. Пары, признанные разными: 8235 и eb34 (подъём библиотеки и релиз); 8720 и 6c75 (команда report и разбор отчётов); 68e5 ни с чем не пересекается; в «Агентной обвязке» 559b и d2e5, 581f и f0c0, f0c0 и fda6, 0ba7 и 559b, 2dec и aee3, bb76, 3a07 и c911; правила для AGENTS.md в 3c99, 5f69, 6846 и 581f разные, структуру файла задаёт eb5c. Проверено по git log origin/main, npm view и gh pr list 23.10.
