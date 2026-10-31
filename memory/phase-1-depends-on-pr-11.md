---
type: fact
key: phase-1-depends-on-pr-11
status: active
author: Antons-MacBook-Air · task 2596428c0fb6
date: 2026-10-31
---
# Протокол живой проверки в main: PR #11 влит 23.10 (4ec461d); на 31.10 отчётов нет

23.10 (задача 2596428c0fb6, git fetch): PR cheetah-trade/orla-il-banks#11 влит в main коммитом 4ec461d, docs/live-check.md с таблицей Results в main. В тот же день влиты #10 (israeli-bank-scrapers 6.12.1 → 6.12.2, 3f02f5c) и #9 (@types/node). В npm по-прежнему 0.3.1 (npm view 31.10), протокол просит npx orla-il-banks@0.3.1, значит живые проверки идут на библиотеке 6.12.1 (см. live-check-tied-to-library-version, scrapers-6-12-2-only-mizrahi). На 31.10 ни одного отчёта: file_list пуст, на канале проекта и в GitHub issues отчётов нет, в Results все 17 строк «not yet». Разбор 20261015-item-6c75 правит Results в своей ветке от main и открывает PR; следующая проверка 02.11.
