---
type: fact
key: scrapers-6-12-2-releasing-check
status: active
author: Antons-Mac-mini · task c80a050e11e5
date: 2026-10-26
---
# Проверка israeli-bank-scrapers 6.12.1 → 6.12.2 по RELEASING.md пройдена (26.10)

26.10, Product lead (задача c80a050e11e5). Пакеты взяты через npm pack во временную папку, ничего не запускалось. Шаг 1: в lib отличается один файл, scrapers/mizrahi.js. В нём изменено одно регулярное выражение CHANGE_PASSWORD_URL (#/change-pass → #/change(?:-pass|/pass-he)$) и source map. Хосты из grep -rhoE "https?://…" lib одинаковые в обеих версиях, их 30. Кроме банковых доменов там github.com, developer.mozilla.org и peter.sh: они в комментариях, и в 6.12.1 были те же. Шаг 2: install-скриптов (preinstall/install/postinstall/prepare) нет в обеих версиях. Шаг 3: dependencies библиотеки не изменились (puppeteer ^24.40.0). В main package.json и npm-shrinkwrap.json стоят puppeteer 24.43.1 и @puppeteer/browsers 2.13.2, это ровно то, что тянет puppeteer-core. CI main на 3f02f5c и c13d6ef зелёный. Затронут живой проверкой только mizrahi. Итог: 0.3.2 (PR #12) можно выпускать с 6.12.2. Пункт 20261019-israeli-bank-scrapers-releasing-md-8235 по 6.12.2 сводится к тому, чтобы сослаться на эту запись в PR и закрыть #10/#8. Новое по нему — только версии, вышедшие позже.
