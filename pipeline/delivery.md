# Delivery of orla-il-banks (counted 2026-11-01 06:00 from Task Floor's run logs and linked pull requests; counts only)

KPI 1: pull request wait to merge (open → merge). KPI 2: conversion to merge = merged / (merged + closed unmerged + reverted). Goal for nudges: zero (answers, permissions, «go on», status checks, restarts, stops for the owner). Outcomes: change failure = (reverted + hotfixes) / (merged + reverted); rework = finished work the owner sent back to verify or restart, or another task continued; time to restore = a reverted change's merge to its revert's.

## Last 24 hours

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Product lead | 2 | 8k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| Development lead | 1 | 3k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| **All** | 3 | 10k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 0 | 0 | — | — | 0% | — |

## Last 7 days

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Product lead | 3 | 43k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 2 (answers 1, status checks 1) | 0 | — | — | 50% | — |
| Artifact steward | 1 | 3k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| Backlog steward | 1 | 4k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| Development lead | 1 | 6k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| **All** | 6 | 56k | 0 | 0 | — | — | — | 0 / 0 / 0 / 5 | 2 (answers 1, status checks 1) | 0 | — | — | 20% | — |

## Outcomes over 30 days

Merged 1, reverted 0, hotfixes 0: change failure 0%, rework 5% (2 of 37 finished), time to restore median —.

## Context compactions by model and effort

Runs ended in the last 7 days; a long run has 46 turns or more. A compaction drops most of the context and the run goes on from a summary and its anchor.

| Model | Effort | Runs | Compactions | Per run | Runs compacted | Long runs | Per long run |
|---|---|---|---|---|---|---|---|
| claude-opus-5-5 | high | 15 | 0 | 0 | 0 | 0 | — |

## Runaway runs

Usual run here: 90th percentile 5k output tokens, 12 turns.

- None.

## Sessions the owner rated

Score of 5 and the owner's note; the lowest first. Find why each low one went badly.

- None rated.

## Flow efficiency by department

Work as a share of task time that was not «off» (owner: waits for the owner, including finished turns whose questions were open), per week from Monday, the latest first.

| Department | 2026-10-26 | 2026-10-19 | 2026-10-12 |
|---|---|---|---|
| development | 0% (31 h; owner 0%) | 0% (69 h; owner 0%) | 2% (1.8 h; owner 19%) |
| product | 1% (55.6 h; owner 28%) | 0% (217 h; owner 2%) | 0% (54.4 h; owner 33%) |
| No department | — | 0% (55.9 h; owner 35%) | — |

## What hangs now

- queued: «Product pulse · 26.10» (7273acc143fe): queued 138.0 h: No eligible profile: member-70ee94bc_claude-default: usage refresh needed after 
- failed: «Разбор отчётов живых прогонов: у каждого сбоя исправление или пункт» (2596428c0fb6): failed
- offline: «Anton MacBook Air Old» (member-1cf130e8): Anton MacBook Air Old silent since 01.11 05:04
- offline: «Roman Dubina's Mac» (member-4c77dcbf): Roman Dubina's Mac silent since 13.10 19:51
- offline: «Anton MacBook Pro» (member-500ccf82): Anton MacBook Pro silent since 01.11 05:50
- offline: «Gera Skalski's Mac» (member-c20323c4): Gera Skalski's Mac silent since 22.10 16:09
- offline: «Gera Skalski's Mac» (member-d7405858): Gera Skalski's Mac silent since 22.10 15:59
- offline: «Anton MacBook Air» (member-e1dacae1): Anton MacBook Air silent since 01.11 04:53
- offline: «Irina's Mac» (member-fd1d09bf): Irina's Mac silent since 01.11 04:16

## Quality by agent and model

The owner's ratings, grade verdicts, the claims judge and the Academy on real work, per model the run used; each figure with its sample (n). Small samples and harder tasks mislead: a report, not a routing rule.

| Agent | Model | Rating (n) | As is (n) | Claims checked: confirmed / unseen / contradicted | Exams: score (n) |
|---|---|---|---|---|---|
| Product lead | claude-opus-5-5 | — | — | 3: 2 / 1 / 0 | — |
| Backlog steward | claude-opus-5-5 | — | — | 1: 1 / 0 / 0 | — |
| Development lead | claude-opus-5-5 | — | — | 1: 1 / 1 / 0 | — |

## Quality under load

Outcomes by how many other runs were going as a run started (last 30 days): on its subscription, on its Mac and of its agent; each figure with its sample (n). Ratings, «as is» and claims count for the run they judged. A report: no cap changes by itself.

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 19 | 11% | 0% | — | — | 0% (5) |
| Same subscription | 1 | 32 | 0% | 0% | — | — | 0% (7) |
| Same subscription | 2–3 | 29 | 3% | 3% | — | — | 0% (1) |
| Same Mac | 0 | 18 | 11% | 6% | — | — | 0% (3) |
| Same Mac | 1 | 32 | 0% | 0% | — | — | 0% (8) |
| Same Mac | 2–3 | 24 | 4% | 0% | — | — | 0% (2) |
| Same Mac | 4–7 | 6 | 0% | 0% | — | — | — |
| Same agent | 0 | 32 | 9% | 0% | — | — | 0% (9) |
| Same agent | 1 | 22 | 0% | 5% | — | — | — |
| Same agent | 2–3 | 16 | 0% | 0% | — | — | 0% (2) |
| Same agent | 4–7 | 2 | 0% | 0% | — | — | — |

### All projects

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 2039 | 3% | 0% | — | 0% (27) | 4% (417) |
| Same subscription | 1 | 2246 | 2% | 0% | — | 0% (28) | 6% (360) |
| Same subscription | 2–3 | 1774 | 2% | 0% | — | 0% (25) | 6% (318) |
| Same Mac | 0 | 1841 | 4% | 0% | — | 0% (18) | 3% (318) |
| Same Mac | 1 | 2006 | 2% | 0% | — | 0% (36) | 8% (345) |
| Same Mac | 2–3 | 1617 | 2% | 0% | — | 0% (20) | 5% (287) |
| Same Mac | 4–7 | 575 | 3% | 0% | — | 0% (6) | 2% (142) |
| Same Mac | 8+ | 20 | 0% | 5% | — | — | 0% (3) |
| Same agent | 0 | 2698 | 2% | 0% | — | 0% (41) | 5% (508) |
| Same agent | 1 | 1239 | 3% | 0% | — | 0% (20) | 6% (222) |
| Same agent | 2–3 | 889 | 3% | 0% | — | 0% (15) | 5% (167) |
| Same agent | 4–7 | 144 | 6% | 1% | — | 0% (4) | 0% (29) |
| Same agent | 8+ | 1 | 0% | 0% | — | — | 0% (1) |

## Owner stops per backlog item

Decisions you made for one item (cards and design decisions), items done in the last 14 days against the 14 before; a large item counts with its slices.

| Items | Last 14 days | 14 days before |
|---|---|---|
| Small | — (n=0) | — (n=0) |
| Large | — (n=0) | — (n=0) |
