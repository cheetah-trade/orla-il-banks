---
type: fact
key: pr-12-status
status: active
author: Antons-Mac-mini · task c80a050e11e5
date: 2026-10-26
---
# PR #12 orla-il-banks (ACL на Windows, релиз 0.3.2): готов, ждёт только merge владельца (26.10)

26.10 вечер (gh pr view/checks, задача c80a050e11e5). PR cheetah-trade/orla-il-banks#12: открыт, не черновик, mergeable, mergeStateStatus CLEAN, конфликтов нет. Зелёные все 5 проверок: check, desktop macos-15, desktop windows-2025, docker, signed-off. Меток, ревью и auto-merge нет. Защиты ветки main нет, очереди слияния нет. Не обновлялся с 23.10 20:01. Да владельца на релиз 0.3.2 было 23.10. Проверка 6.12.2 по RELEASING.md пройдена (scrapers-6-12-2-releasing-check). Блокирует одно: merge делает владелец, агентам нельзя. После merge агент ветки ставит тег v0.3.2 на merge-коммит, release.yml публикует в npm и ghcr.
