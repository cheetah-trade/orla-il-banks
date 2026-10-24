---
type: fact
key: live-check-tied-to-library-version
status: active
author: Knowledge curator · task 2bf72f8405f0
date: 2026-10-24
---
# Отметка Live-checked верна только для версии israeli-bank-scrapers; перепроверять банки из заметок к выпуску

19.10 (задача 8e3ccf413e5a). Отметка Live-checked верна только для той версии israeli-bank-scrapers, на которой банк прогнали живьём. При обновлении библиотеки по RELEASING.md перечислить банки, которые задели изменения в src/scrapers, и перепроверить их людьми. Поэтому в каждом отчёте живого запуска записывать версию пакета и версию библиотеки (порядок живой проверки: docs/live-check.md, phase-1-depends-on-pr-11).

Как найти задетые банки быстро (23.10, задача 06a6d785c351): прочитать заметки к выпуску библиотеки (gh api repos/eshaham/israeli-bank-scrapers/releases) и перепроверять людьми только названные там банки, а не все 17. Пульс 23.10: 6.12.2 меняет только mizrahi (scrapers-6-12-2-only-mizrahi), поэтому отдельный релиз до живых прогонов не понадобился.

From task 06a6d785c351 (curated).
