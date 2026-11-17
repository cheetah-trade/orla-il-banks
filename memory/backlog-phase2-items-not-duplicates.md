---
type: fact
key: backlog-phase2-items-not-duplicates
status: active
author: Antons-MacBook-Pro-2 · task 8903425dda89
date: 2026-11-17
review_by: 2026-11-24
---
# Ревью бэклога 19.10–17.11: 20 открытых пунктов, дублей и противоречий нет

Ревью бэклога 17.11 (backlog_review): те же 20 открытых пунктов, что 23.10 и 26.10 (19 ready/proposed и 1 взятый, 20261015-item-6c75). Выполненных за 30 дней нет. Дублей и противоречий нет, ничего не слито и не снято. main с 23.10 не изменился (последний c13d6ef), AGENTS.md и CLAUDE.md в main нет — пункты эпика «Агентная обвязка» не выполнены. В package.json israeli-bank-scrapers 6.12.2, в npm уже 6.13.0 (Dependabot PR #15, открыт 05.11); PR #13 (@puppeteer/browsers 3.2.6, мажор, как закрытый #8) открыт 29.10; PR #14 (actions/setup-node 7.1.0) открыт; PR #12 (ACL Windows, 0.3.2) по-прежнему не влит. Пункт 20261019-israeli-bank-scrapers-releasing-md-8235 не устарел: он про «последнюю версию на момент работы», теперь это 6.13.0, а его текст ещё называет PR #8 и #10 (их судьба уже решена; новые — #13 и #15). Пары, признанные разными: 8235 и eb34; 8720 и 6c75; 68e5 ни с чем не пересекается; в «Агентной обвязке» 559b и d2e5, 581f и f0c0, f0c0 и fda6, 0ba7 и 559b, 2dec и aee3, bb76, 3a07 и c911, 3c99 и aee3; правила для AGENTS.md в 3c99, 5f69, 6846 и 581f разные, структуру файла задаёт eb5c. Проверено: git fetch + git log/ls-tree origin/main, gh pr list, npm view 17.11.
