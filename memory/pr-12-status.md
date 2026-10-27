---
type: fact
key: pr-12-status
status: active
author: Antons-Mac-mini · task c80a050e11e5
date: 2026-10-27
---
# PR #12 orla-il-banks (ACL на Windows, релиз 0.3.2): готов, ждёт только merge владельца (перепроверено 27.10)

26.10 вечером и 27.10 (gh pr view/checks, git fetch, npm view; задача c80a050e11e5). PR cheetah-trade/orla-il-banks#12: открыт, не черновик, mergeable, mergeStateStatus CLEAN, конфликтов нет. Зелёные все 5 проверок: check, desktop macos-15, desktop windows-2025, docker, signed-off. Меток, ревью и auto-merge нет. Защиты ветки main и очереди слияния нет. Не обновлялся с 23.10 20:01. main по-прежнему c13d6ef, в npm orla-il-banks 0.3.1, israeli-bank-scrapers 6.12.2. Да владельца на релиз 0.3.2 было 23.10. Проверка 6.12.2 по RELEASING.md пройдена (scrapers-6-12-2-releasing-check). Владельцу 26.10 задан вопрос «Влить PR #12 и выпустить 0.3.2?», ответа на 27.10 нет. Блокирует одно: merge делает владелец, агентам нельзя. После merge агент ветки ставит тег v0.3.2, release.yml публикует в npm и ghcr.
