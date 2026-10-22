# Delivery of orla-il-banks (counted 2026-10-22 06:00 from Task Floor's run logs and linked pull requests; counts only)

KPI 1: pull request wait to merge (open → merge). KPI 2: conversion to merge = merged / (merged + closed unmerged + reverted). Goal for nudges: zero (answers, permissions, «go on», status checks, restarts, stops for the owner). Outcomes: change failure = (reverted + hotfixes) / (merged + reverted); rework = finished work the owner sent back to verify or restart, or another task continued; time to restore = a reverted change's merge to its revert's.

## Last 24 hours

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Product lead | 1 | 2k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 2 (stops for you 2) | 0 | — | — | 0% | — |
| Backlog steward | 1 | 3k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 1 (stops for you 1) | 0 | — | — | 0% | — |
| Artifact steward | 1 | 3k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 1 (stops for you 1) | 0 | — | — | 0% | — |
| **All** | 3 | 7k | 0 | 0 | — | — | — | 0 / 0 / 0 / 3 | 4 (stops for you 4) | 0 | — | — | 0% | — |

## Last 7 days

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Backlog steward | 8 | 30k | 0 | 0 | — | — | — | 0 / 0 / 0 / 8 | 8 (stops for you 8) | 0 | — | — | 0% | — |
| Artifact steward | 7 | 14k | 0 | 0 | — | — | — | 0 / 0 / 0 / 7 | 5 (stops for you 5) | 0 | — | — | 0% | — |
| Product lead | 5 | 76k | 1 | 0 | — | — | — | 0 / 0 / 0 / 3 | 12 (stops for you 7, answers 4, restarts 1) | 0 | — | — | 0% | — |
| Development lead | 3 | 10k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 2 (stops for you 2) | 0 | — | — | 0% | — |
| Owner's conversations | 2 | 4k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 0 | 0 | — | — | 0% | — |
| **All** | 25 | 133k | 1 | 0 | — | — | — | 0 / 0 / 0 / 22 | 27 (stops for you 22, answers 4, restarts 1) | 0 | — | — | 0% | — |

## Outcomes over 30 days

Merged 0, reverted 0, hotfixes 0: change failure —, rework 0% (0 of 24 finished), time to restore median —.

## Context compactions by model and effort

Runs ended in the last 7 days; a long run has 46 turns or more. A compaction drops most of the context and the run goes on from a summary and its anchor.

| Model | Effort | Runs | Compactions | Per run | Runs compacted | Long runs | Per long run |
|---|---|---|---|---|---|---|---|
| claude-opus-5-5 | high | 34 | 0 | 0 | 0 | 0 | — |
| claude-sonnet-5-5 | medium | 3 | 0 | 0 | 0 | 0 | — |
| claude-sonnet-5-5 | low | 2 | 0 | 0 | 0 | 0 | — |

## Runaway runs

Usual run here: 90th percentile 5k output tokens, 12 turns.

- None.

## Sessions the owner rated

Score of 5 and the owner's note; the lowest first. Find why each low one went badly.

- None rated.

## Flow efficiency by department

Work as a share of task time that was not «off» (owner: waits for the owner, including finished turns whose questions were open), per week from Monday, the latest first.

| Department | 2026-10-19 | 2026-10-12 |
|---|---|---|
| development | 0% (45.3 h; owner 0%) | 2% (1.8 h; owner 19%) |
| product | 0% (130 h; owner 3%) | 0% (57.6 h; owner 31%) |
| No department | 0% (35.8 h; owner 0%) | — |

## What hangs now

- queued: «Канал агентов: взять просьбу Anton MacBook Pro · task 51591cda391c» (a5bfbba8c7e5): queued 31.1 h: No eligible profile: member-1cf130e8_claude-01: sign-in required; member-500ccf8
- queued: «Product planning · 19.10» (8e3ccf413e5a): queued 68.0 h: Waiting for its computer: Anton MacBook Pro Old, offline since 04:04
- queued: «Разбор отчётов живых прогонов: у каждого сбоя исправление или пункт» (2596428c0fb6): queued 158.3 h: No eligible profile: member-70ee94bc_claude-h03: limit reached until 23.10 13:00
- queued: «Product pulse · 15.10» (0f16eb7fd601): queued 162.0 h: No eligible profile: member-70ee94bc_claude-07: limit reached until 25.10 09:00
- offline: «Anton MacBook Air Old» (member-1cf130e8): Anton MacBook Air Old silent since 22.10 04:31
- offline: «Roman Dubina's Mac» (member-4c77dcbf): Roman Dubina's Mac silent since 13.10 19:51
- offline: «Anton MacBook Pro Old» (member-6d504cb7): Anton MacBook Pro Old silent since 22.10 04:04
- offline: «Anton MacBook Air» (member-e1dacae1): Anton MacBook Air silent since 22.10 04:52
- offline: «Irina's Mac» (member-fd1d09bf): Irina's Mac silent since 22.10 05:57

## Quality by agent and model

The owner's ratings, grade verdicts, the claims judge and the Academy on real work, per model the run used; each figure with its sample (n). Small samples and harder tasks mislead: a report, not a routing rule.

| Agent | Model | Rating (n) | As is (n) | Claims checked: confirmed / unseen / contradicted | Exams: score (n) |
|---|---|---|---|---|---|
| Product lead | claude-opus-5-5 | — | 100% (2) | 2: 2 / 0 / 0 | — |
| Artifact steward | claude-opus-5-5 | — | — | 3: 1 / 1 / 0 | — |
| Backlog steward | claude-opus-5-5 | — | — | 2: 1 / 0 / 0 | — |

## Quality under load

Outcomes by how many other runs were going as a run started (last 30 days): on its subscription, on its Mac and of its agent; each figure with its sample (n). Ratings, «as is» and claims count for the run they judged. A report: no cap changes by itself.

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 9 | 0% | 0% | — | — | 0% (1) |
| Same subscription | 1 | 22 | 0% | 0% | — | — | 0% (5) |
| Same subscription | 2–3 | 15 | 0% | 0% | — | — | 0% (1) |
| Same Mac | 0 | 11 | 0% | 0% | — | — | — |
| Same Mac | 1 | 20 | 0% | 0% | — | — | 0% (6) |
| Same Mac | 2–3 | 14 | 0% | 0% | — | — | 0% (1) |
| Same Mac | 4–7 | 1 | 0% | 0% | — | — | — |
| Same agent | 0 | 15 | 0% | 0% | — | — | 0% (4) |
| Same agent | 1 | 15 | 0% | 0% | — | — | — |
| Same agent | 2–3 | 9 | 0% | 0% | — | — | 0% (1) |
| Same agent | 4–7 | 1 | 0% | 0% | — | — | — |

### All projects

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 1248 | 2% | 0% | — | 0% (27) | 5% (214) |
| Same subscription | 1 | 1610 | 2% | 0% | — | 0% (28) | 5% (237) |
| Same subscription | 2–3 | 1205 | 1% | 0% | — | 0% (25) | 7% (225) |
| Same Mac | 0 | 1262 | 3% | 0% | — | 0% (18) | 5% (182) |
| Same Mac | 1 | 1284 | 2% | 0% | — | 0% (36) | 9% (215) |
| Same Mac | 2–3 | 1184 | 1% | 0% | — | 0% (20) | 5% (208) |
| Same Mac | 4–7 | 313 | 1% | 1% | — | 0% (6) | 0% (68) |
| Same Mac | 8+ | 20 | 0% | 5% | — | — | 0% (3) |
| Same agent | 0 | 1813 | 2% | 0% | — | 0% (41) | 6% (282) |
| Same agent | 1 | 842 | 2% | 0% | — | 0% (20) | 7% (158) |
| Same agent | 2–3 | 593 | 2% | 0% | — | 0% (15) | 4% (126) |
| Same agent | 4–7 | 138 | 5% | 1% | — | 0% (4) | 0% (30) |
| Same agent | 8+ | 1 | 0% | 0% | — | — | 0% (1) |

## Owner stops per backlog item

Decisions you made for one item (cards and design decisions), items done in the last 14 days against the 14 before; a large item counts with its slices.

| Items | Last 14 days | 14 days before |
|---|---|---|
| Small | — (n=0) | — (n=0) |
| Large | — (n=0) | — (n=0) |
