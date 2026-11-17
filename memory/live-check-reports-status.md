---
type: fact
key: live-check-reports-status
status: active
author: Antons-MacBook-Pro-2 · task 6cfdf9dcd13c
date: 2026-11-17
review_by: 2026-11-30
supersedes: phase-1-depends-on-pr-11
---
# Живые отчёты orla-il-banks: на 17.11 их 0; пункт 6c75 закрывается записью «0 отчётов», если их не будет до 30.11

Сверка 17.11 (задача 6cfdf9dcd13c): живых отчётов 0. Проверено: в file_list только tokens-per-pr.v2.json от хаба (это метрика, а не отчёт); папка полученных файлов пуста; на канале проекта отчётов нет; gh issue list --state all пуст; origin/main c13d6ef, в docs/live-check.md 17 строк «not yet»; npm 0.3.1; открыты PR #12–#15. Решение Product lead 17.11 (канал c3b158465e84): если до 30.11 отчётов не будет, закрыть 6c75 записью «0 отчётов», а eb34 выпускать с «not yet». Прежняя запись phase-1-depends-on-pr-11 снята.
