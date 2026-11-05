# Delivery of orla-il-banks (counted 2026-11-05 06:00 from Task Floor's run logs and linked pull requests; counts only)

KPI 1: pull request wait to merge (open → merge). KPI 2: conversion to merge = merged / (merged + closed unmerged + reverted). Goal for nudges: zero (answers, permissions, «go on», status checks, restarts, stops for the owner). Outcomes: change failure = (reverted + hotfixes) / (merged + reverted); rework = finished work the owner sent back to verify or restart, or another task continued; time to restore = a reverted change's merge to its revert's.

## Last 24 hours

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Development lead | 1 | 4k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 0 | 0 | — | — | 50% | — |
| Product lead | 0 | 0 | 0 | 0 | — | — | — | 0 / 0 / 0 / 3 | 0 | 0 | — | — | 33% | — |
| **All** | 1 | 4k | 0 | 0 | — | — | — | 0 / 0 / 0 / 5 | 0 | 0 | — | — | 40% | — |

## Last 7 days

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Development lead | 2 | 7k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 0 | 0 | — | — | 50% | — |
| Product lead | 2 | 8k | 0 | 0 | — | — | — | 0 / 0 / 0 / 3 | 0 | 0 | — | — | 33% | — |
| **All** | 4 | 15k | 0 | 0 | — | — | — | 0 / 0 / 0 / 5 | 0 | 0 | — | — | 40% | — |

## Outcomes over 30 days

Merged 0, reverted 0, hotfixes 0: change failure —, rework 8% (3 of 39 finished), time to restore median —.

## Context compactions by model and effort

Runs ended in the last 7 days; a long run has 46 turns or more. A compaction drops most of the context and the run goes on from a summary and its anchor.

| Model | Effort | Runs | Compactions | Per run | Runs compacted | Long runs | Per long run |
|---|---|---|---|---|---|---|---|
| claude-opus-5-5 | high | 5 | 0 | 0 | 0 | 0 | — |

## Runaway runs

Usual run here: 90th percentile 7k output tokens, 15 turns.

- None.

## Sessions the owner rated

Score of 5 and the owner's note; the lowest first. Find why each low one went badly.

- None rated.

## Flow efficiency by department

Work as a share of task time that was not «off» (owner: waits for the owner, including finished turns whose questions were open), per week from Monday, the latest first.

| Department | 2026-11-02 | 2026-10-26 | 2026-10-19 | 2026-10-12 |
|---|---|---|---|---|
| development | 100% (0.0394 h; owner 0%) | 0% (31 h; owner 0%) | 0% (69 h; owner 0%) | 2% (1.8 h; owner 19%) |
| product | 0% (231 h; owner 0%) | 0% (73.6 h; owner 21%) | 0% (217 h; owner 2%) | 0% (54.4 h; owner 33%) |
| No department | — | — | 0% (55.9 h; owner 35%) | — |

## What hangs now

- offline: «Anton MacBook Air Old» (member-1cf130e8): Anton MacBook Air Old silent since 02.11 18:30
- offline: «Roman Dubina's Mac» (member-4c77dcbf): Roman Dubina's Mac silent since 13.10 19:51
- offline: «Anton MacBook Pro Old» (member-6d504cb7): Anton MacBook Pro Old silent since 05.11 05:36
- offline: «Gera Skalski's Mac» (member-c20323c4): Gera Skalski's Mac silent since 22.10 16:09
- offline: «Gera Skalski's Mac» (member-d7405858): Gera Skalski's Mac silent since 22.10 15:59
- offline: «Irina's Mac» (member-fd1d09bf): Irina's Mac silent since 05.11 05:42

## Quality by agent and model

The owner's ratings, grade verdicts, the claims judge and the Academy on real work, per model the run used; each figure with its sample (n). Small samples and harder tasks mislead: a report, not a routing rule.

| Agent | Model | Rating (n) | As is (n) | Claims checked: confirmed / unseen / contradicted | Exams: score (n) |
|---|---|---|---|---|---|
| Product lead | claude-opus-5-5 | — | — | 2: 1 / 1 / 0 | — |
| Development lead | claude-opus-5-5 | — | — | 1: 1 / 0 / 0 | — |

## Quality under load

Outcomes by how many other runs were going as a run started (last 30 days): on its subscription, on its Mac and of its agent; each figure with its sample (n). Ratings, «as is» and claims count for the run they judged. A report: no cap changes by itself.

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 20 | 10% | 0% | — | — | 0% (6) |
| Same subscription | 1 | 32 | 0% | 0% | — | — | 0% (7) |
| Same subscription | 2–3 | 29 | 3% | 3% | — | — | 0% (1) |
| Same Mac | 0 | 19 | 11% | 5% | — | — | 0% (4) |
| Same Mac | 1 | 32 | 0% | 0% | — | — | 0% (8) |
| Same Mac | 2–3 | 24 | 4% | 0% | — | — | 0% (2) |
| Same Mac | 4–7 | 6 | 0% | 0% | — | — | — |
| Same agent | 0 | 33 | 9% | 0% | — | — | 0% (10) |
| Same agent | 1 | 22 | 0% | 5% | — | — | — |
| Same agent | 2–3 | 16 | 0% | 0% | — | — | 0% (2) |
| Same agent | 4–7 | 2 | 0% | 0% | — | — | — |

### All projects

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 2187 | 3% | 0% | — | 0% (27) | 4% (440) |
| Same subscription | 1 | 2371 | 2% | 0% | — | 0% (28) | 6% (373) |
| Same subscription | 2–3 | 1823 | 2% | 0% | — | 0% (25) | 6% (321) |
| Same Mac | 0 | 1936 | 3% | 0% | — | 0% (18) | 3% (330) |
| Same Mac | 1 | 2154 | 2% | 0% | — | 0% (36) | 8% (363) |
| Same Mac | 2–3 | 1691 | 2% | 0% | — | 0% (20) | 5% (292) |
| Same Mac | 4–7 | 580 | 3% | 0% | — | 0% (6) | 2% (146) |
| Same Mac | 8+ | 20 | 0% | 5% | — | — | 0% (3) |
| Same agent | 0 | 2797 | 2% | 0% | — | 0% (41) | 5% (520) |
| Same agent | 1 | 1266 | 3% | 0% | — | 0% (20) | 6% (226) |
| Same agent | 2–3 | 906 | 3% | 0% | — | 0% (15) | 5% (177) |
| Same agent | 4–7 | 144 | 6% | 1% | — | 0% (4) | 0% (29) |
| Same agent | 8+ | 1 | 0% | 0% | — | — | 0% (1) |

## Owner stops per backlog item

Decisions you made for one item (cards and design decisions), items done in the last 14 days against the 14 before; a large item counts with its slices.

| Items | Last 14 days | 14 days before |
|---|---|---|
| Small | — (n=0) | — (n=0) |
| Large | — (n=0) | — (n=0) |
