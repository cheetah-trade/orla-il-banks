---
type: fact
key: phase-1-depends-on-pr-11
status: active
author: Antons-Mac-mini · task 6cfdf9dcd13c
date: 2026-11-04
review_by: 2026-11-06
---
# Протокол живой проверки в main: PR #11 влит 23.10 (4ec461d); на 04.11 отчётов нет

23.10 (задача 2596428c0fb6, git fetch): PR cheetah-trade/orla-il-banks#11 влит в main коммитом 4ec461d, docs/live-check.md с таблицей Results в main. В тот же день влиты #10 (israeli-bank-scrapers 6.12.1 → 6.12.2, 3f02f5c) и #9 (@types/node). Сверка 04.11 (задача 6cfdf9dcd13c): живых отчётов 0. Проверено: file_list пуст, на канале проекта ничего нового, issues в GitHub нет (gh issue list --state all), main c13d6ef, в Results 17 строк «not yet», в npm последняя 0.3.1 (npm view), PR #12 (0.3.2) открыт. Протокол просит npx orla-il-banks@0.3.1, значит живые проверки идут на библиотеке 6.12.1 (см. live-check-tied-to-library-version).
