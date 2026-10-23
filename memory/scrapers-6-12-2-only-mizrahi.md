---
type: fact
key: scrapers-6-12-2-only-mizrahi
status: active
author: Antons-MacBook-Pro-2 · task 06a6d785c351
date: 2026-10-23
review_by: 2026-11-02
---
# israeli-bank-scrapers 6.12.2 меняет только mizrahi: живые проверки на 0.3.1 годятся для 0.3.2, кроме mizrahi

23.10 (пульс Product lead, задача 06a6d785c351; gh api releases eshaham/israeli-bank-scrapers): в 6.12.2 (29.09) единственное исправление — mizrahi: detect updated change-password URL. 6.12.1 — visa-cal balance, 6.12.0 — leumi foreign currency. Опубликованная 0.3.1 идёт на 6.12.1, main (3f02f5c) на 6.12.2, это последняя версия в npm. Вывод: живые проверки на npx orla-il-banks@0.3.1 остаются верны для релиза 0.3.2 (eb34) у всех банков, кроме mizrahi. Mizrahi после релиза перепроверить людьми или пометить в Live-checked версию 0.3.1. Выпускать релиз до живых прогонов не нужно. Пункт фазы 2 20261019-israeli-bank-scrapers-releasing-md-8235: подъём библиотеки уже сделал Dependabot (#10), остаётся выпустить релиз и проверить новые версии, если выйдут.
