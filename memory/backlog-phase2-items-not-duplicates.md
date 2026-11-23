---
type: fact
key: backlog-phase2-items-not-duplicates
status: active
author: Antons-MacBook-Pro-2 · task 16577bcdb2b9
date: 2026-11-23
review_by: 2026-11-30
---
# Ревью бэклога 19.10–23.11: 20 открытых пунктов, дублей и противоречий нет

Ревью бэклога 23.11 (backlog_review): те же 20 открытых пунктов, что 17.11 (19 ready/proposed и 1 взятый, 20261015-item-6c75). Выполненных за 30 дней нет. Дублей и противоречий нет, ничего не слито и не снято. main не изменился с 23.10 (c13d6ef), AGENTS.md и CLAUDE.md в main нет; package.json: 0.3.1, israeli-bank-scrapers 6.12.2. PR: #12 (ACL Windows, 0.3.2) открыт; #15 (scrapers 6.13.0) открыт; #14 (setup-node 7.1.0) открыт; #13 закрыт 19.11, вместо него Dependabot открыл #16 (@puppeteer/browsers 3.2.7, мажор). Пункт 8235 не устарел («последняя версия на момент работы»), но его текст называет PR #8 и #10 — сейчас актуальны #15 и #16. Пункт eb34 не устарел: это пункт 4 фазы 2 (product-phase-next), номер версии в фазе 2 — 0.4.0 вместо «0.3.x» из заголовка; это правка текста, не дубль. Пары, признанные разными: 8235 и eb34; 8720 и 6c75; 68e5 ни с чем; в «Агентной обвязке» 559b и d2e5, 581f и f0c0, f0c0 и fda6, 0ba7 и 559b, 2dec и aee3, bb76, 3a07 и c911, 3c99 и aee3; правила для AGENTS.md в 3c99, 5f69, 6846 и 581f разные, структуру файла задаёт eb5c. Проверено 23.11: git fetch + git log/ls-tree origin/main, gh pr list --state all.
