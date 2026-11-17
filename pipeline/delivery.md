# Delivery of orla-il-banks (counted 2026-11-17 06:00 from Task Floor's run logs and linked pull requests; counts only)

KPI 1: pull request wait to merge (open → merge). KPI 2: conversion to merge = merged / (merged + closed unmerged + reverted). Goal for nudges: zero (answers, permissions, «go on», status checks, restarts, stops for the owner). Outcomes: change failure = (reverted + hotfixes) / (merged + reverted); rework = finished work the owner sent back to verify or restart, or another task continued; time to restore = a reverted change's merge to its revert's.

## Last 24 hours

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Artifact steward | 1 | 3k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| Backlog steward | 1 | 3k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| **All** | 2 | 6k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 0 | 0 | — | — | 0% | — |

## Last 7 days

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Artifact steward | 1 | 3k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| Backlog steward | 1 | 3k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| Development lead | 0 | 0 | 0 | 0 | — | — | — | 0 / 0 / 0 / 0 | 0 | 0 | — | — | — | — |
| **All** | 2 | 6k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 0 | 0 | — | — | 0% | — |

## Outcomes over 30 days

Merged 0, reverted 0, hotfixes 0: change failure —, rework 10% (3 of 30 finished), time to restore median —.

## Context compactions by model and effort

Runs ended in the last 7 days; a long run has 46 turns or more. A compaction drops most of the context and the run goes on from a summary and its anchor.

| Model | Effort | Runs | Compactions | Per run | Runs compacted | Long runs | Per long run |
|---|---|---|---|---|---|---|---|
| claude-opus-5-5 | high | 2 | 0 | 0 | 0 | 0 | — |

## Runaway runs

Usual run here: under ten runs yet; all runs are measured against 26k tokens and 46 turns.

- None.

## Sessions the owner rated

Score of 5 and the owner's note; the lowest first. Find why each low one went badly.

- None rated.

## Flow efficiency by department

Work as a share of task time that was not «off» (owner: waits for the owner, including finished turns whose questions were open), per week from Monday, the latest first.

| Department | 2026-11-16 | 2026-11-09 | 2026-11-02 | 2026-10-26 |
|---|---|---|---|---|
| development | 0% (30 h; owner 0%) | 0% (63 h; owner 0%) | 99% (0.0553 h; owner 0%) | 0% (31 h; owner 0%) |
| product | 0% (94.5 h; owner 0%) | 0% (636 h; owner 0%) | 0% (231 h; owner 0%) | 0% (73.6 h; owner 21%) |

## What hangs now

- queued: «Product planning · 16.11» (4b973eb41d98): queued 20.5 h: No eligible profile: member-1cf130e8_claude-01: sign-in required; member-500ccf8
- queued: «Разбор отчётов живых прогонов: у каждого сбоя исправление или пункт» (6cfdf9dcd13c): queued 298.2 h: No eligible profile: member-70ee94bc_claude-default: sign-in required
- offline: «Anton MacBook Air Old» (member-1cf130e8): Anton MacBook Air Old silent since 16.11 21:41
- offline: «Roman Dubina's Mac» (member-4c77dcbf): Roman Dubina's Mac silent since 13.10 19:51
- offline: «Anton MacBook Pro» (member-500ccf82): Anton MacBook Pro silent since 17.11 05:52
- offline: «Anton MacBook Pro Old» (member-6d504cb7): Anton MacBook Pro Old silent since 17.11 04:33
- offline: «Gera Skalski's Mac» (member-c20323c4): Gera Skalski's Mac silent since 22.10 16:09
- offline: «Gera Skalski's Mac» (member-d7405858): Gera Skalski's Mac silent since 22.10 15:59
- offline: «Anton MacBook Air» (member-e1dacae1): Anton MacBook Air silent since 17.11 02:13
- offline: «Irina's Mac» (member-fd1d09bf): Irina's Mac silent since 17.11 05:47

## Quality by agent and model

The owner's ratings, grade verdicts, the claims judge and the Academy on real work, per model the run used; each figure with its sample (n). Small samples and harder tasks mislead: a report, not a routing rule.

| Agent | Model | Rating (n) | As is (n) | Claims checked: confirmed / unseen / contradicted | Exams: score (n) |
|---|---|---|---|---|---|
| Artifact steward | claude-opus-5-5 | — | — | 1: 1 / 0 / 0 | — |
| Backlog steward | claude-opus-5-5 | — | — | 1: 1 / 0 / 0 | — |

## Quality under load

Outcomes by how many other runs were going as a run started (last 30 days): on its subscription, on its Mac and of its agent; each figure with its sample (n). Ratings, «as is» and claims count for the run they judged. A report: no cap changes by itself.

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 15 | 13% | 0% | — | — | 0% (5) |
| Same subscription | 1 | 24 | 0% | 0% | — | — | 0% (6) |
| Same subscription | 2–3 | 28 | 4% | 4% | — | — | 0% (2) |
| Same Mac | 0 | 14 | 14% | 7% | — | — | 0% (3) |
| Same Mac | 1 | 28 | 0% | 0% | — | — | 0% (7) |
| Same Mac | 2–3 | 20 | 5% | 0% | — | — | 0% (3) |
| Same Mac | 4–7 | 5 | 0% | 0% | — | — | — |
| Same agent | 0 | 32 | 9% | 0% | — | — | 0% (9) |
| Same agent | 1 | 17 | 0% | 6% | — | — | — |
| Same agent | 2–3 | 12 | 0% | 0% | — | — | 0% (2) |
| Same agent | 4–7 | 1 | 0% | 0% | — | — | — |

### All projects

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 2064 | 2% | 0% | — | 0% (12) | 4% (384) |
| Same subscription | 1 | 1900 | 2% | 0% | — | 0% (13) | 6% (287) |
| Same subscription | 2–3 | 1565 | 2% | 0% | — | 0% (8) | 7% (253) |
| Same Mac | 0 | 1748 | 2% | 0% | — | 0% (10) | 3% (287) |
| Same Mac | 1 | 1889 | 2% | 0% | — | 0% (18) | 8% (309) |
| Same Mac | 2–3 | 1543 | 1% | 0% | — | 0% (5) | 5% (226) |
| Same Mac | 4–7 | 349 | 4% | 0% | — | — | 4% (102) |
| Same agent | 0 | 2185 | 2% | 0% | — | 0% (18) | 5% (407) |
| Same agent | 1 | 933 | 2% | 0% | — | 0% (9) | 6% (175) |
| Same agent | 2–3 | 539 | 3% | 0% | — | 0% (6) | 6% (108) |
| Same agent | 4–7 | 7 | 14% | 0% | — | — | — |


## Runs by agent, model and effort

Runs ended in the last 7 days, each once, as the hub noted them.

| Agent | Model | Effort | Runs | Output tokens |
|---|---|---|---|---|
| Artifact steward | claude-opus-5-5 | high | 1 | 3k |
| Backlog steward | claude-opus-5-5 | high | 1 | 3k |
## Owner stops per backlog item

Decisions you made for one item (cards and design decisions), items done in the last 14 days against the 14 before; a large item counts with its slices.

| Items | Last 14 days | 14 days before |
|---|---|---|
| Small | — (n=0) | — (n=0) |
| Large | — (n=0) | — (n=0) |
