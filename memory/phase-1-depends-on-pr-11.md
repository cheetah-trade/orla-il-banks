---
type: fact
key: phase-1-depends-on-pr-11
status: active
author: Antons-Mac-mini · task 2596428c0fb6
date: 2026-10-23
---
# Протокол живой проверки в main: PR #11 влит 23.10 (4ec461d)

23.10 (задача 2596428c0fb6, git fetch): PR cheetah-trade/orla-il-banks#11 влит в main коммитом 4ec461d, docs/live-check.md с таблицей Results теперь в main. В тот же день влиты #10 (israeli-bank-scrapers 6.12.1 → 6.12.2, 3f02f5c) и #9 (@types/node). Опубликованная версия пакета по-прежнему 0.3.1, а протокол просит запускать npx orla-il-banks@0.3.1. Значит, живые проверки идут на библиотеке 6.12.1, а не на 6.12.2 из main (см. live-check-tied-to-library-version). На 23.10 ни одного отчёта: file_list пуст, на канале проекта отчётов нет, все 17 строк Results «not yet». Разбор 20261015-item-6c75 правит Results в своей ветке от main и открывает PR.
