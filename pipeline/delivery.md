# Delivery of orla-il-banks (counted 2026-10-20 06:00 from Task Floor's run logs and linked pull requests; counts only)

KPI 1: pull request wait to merge (open → merge). KPI 2: conversion to merge = merged / (merged + closed unmerged + reverted). Goal for nudges: zero (answers, permissions, «go on», status checks, restarts, stops for the owner). Outcomes: change failure = (reverted + hotfixes) / (merged + reverted); rework = finished work the owner sent back to verify or restart, or another task continued; time to restore = a reverted change's merge to its revert's.

## Last 24 hours

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Product lead | 3 | 34k | 0 | 0 | — | — | — | 0 / 0 / 1 / 1 | 5 (stops for you 4, answers 1) | 0 | — | — | 50% | — |
| Owner's conversations | 2 | 4k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 0 | 0 | — | — | 0% | — |
| Development lead | 1 | 3k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| Backlog steward | 1 | 5k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 1 (stops for you 1) | 0 | — | — | 0% | — |
| Artifact steward | 1 | 1k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| **All** | 8 | 47k | 0 | 0 | — | — | — | 0 / 0 / 1 / 6 | 6 (stops for you 5, answers 1) | 0 | — | — | 14% | — |

## Last 7 days

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Backlog steward | 6 | 23k | 0 | 0 | — | — | — | 0 / 0 / 0 / 6 | 6 (stops for you 6) | 0 | — | — | 0% | — |
| Artifact steward | 5 | 6k | 0 | 0 | — | — | — | 0 / 0 / 0 / 5 | 2 (stops for you 2) | 0 | — | — | 0% | — |
| Product lead | 4 | 72k | 1 | 0 | — | — | — | 0 / 0 / 1 / 2 | 9 (stops for you 4, answers 4, restarts 1) | 0 | — | — | 33% | — |
| Owner's conversations | 3 | 11k | 0 | 0 | — | — | — | 0 / 0 / 0 / 3 | 7 (status checks 1, stops for you 6) | 0 | — | — | 0% | — |
| Development lead | 3 | 10k | 0 | 0 | — | — | — | 0 / 0 / 0 / 3 | 2 (stops for you 2) | 0 | — | — | 0% | — |
| **All** | 21 | 122k | 1 | 0 | — | — | — | 0 / 0 / 1 / 19 | 26 (stops for you 20, answers 4, restarts 1, status checks 1) | 0 | — | — | 5% | — |

## Outcomes over 30 days

Merged 0, reverted 0, hotfixes 0: change failure —, rework 5% (1 of 20 finished), time to restore median —.

## Context compactions by model and effort

Runs ended in the last 7 days; a long run has 46 turns or more. A compaction drops most of the context and the run goes on from a summary and its anchor.

| Model | Effort | Runs | Compactions | Per run | Runs compacted | Long runs | Per long run |
|---|---|---|---|---|---|---|---|
| claude-opus-5-5 | high | 29 | 0 | 0 | 0 | 0 | — |
| claude-sonnet-5-5 | medium | 3 | 0 | 0 | 0 | 0 | — |
| claude-opus-5-5 | medium | 3 | 0 | 0 | 0 | 0 | — |
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
| development | 5% (0.294 h; owner 0%) | 2% (1.8 h; owner 19%) |
| product | 1% (17.9 h; owner 15%) | 0% (58.2 h; owner 31%) |
| No department | 1% (4.64 h; owner 0%) | — |

## What hangs now

- queued: «Product planning · 19.10» (8e3ccf413e5a): queued 20.0 h: No eligible profile: member-6d504cb7_claude-06: 13% available; this task needs ≥
- offline: «Roman Dubina's Mac» (member-4c77dcbf): Roman Dubina's Mac silent since 13.10 19:51
- offline: «Irina's Mac» (member-fd1d09bf): Irina's Mac silent since 20.10 04:25

## Quality by agent and model

The owner's ratings, grade verdicts, the claims judge and the Academy on real work, per model the run used; each figure with its sample (n). Small samples and harder tasks mislead: a report, not a routing rule.

| Agent | Model | Rating (n) | As is (n) | Claims checked: confirmed / unseen / contradicted | Exams: score (n) |
|---|---|---|---|---|---|
| Product lead | claude-opus-5-5 | — | 100% (2) | 3: 2 / 0 / 0 | — |
| Artifact steward | claude-opus-5-5 | — | — | 2: 1 / 0 / 0 | — |
| Backlog steward | claude-opus-5-5 | — | — | 1: 1 / 0 / 0 | — |

## Quality under load

Outcomes by how many other runs were going as a run started (last 30 days): on its subscription, on its Mac and of its agent; each figure with its sample (n). Ratings, «as is» and claims count for the run they judged. A report: no cap changes by itself.

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 9 | 0% | 0% | — | — | 0% (1) |
| Same subscription | 1 | 19 | 0% | 0% | — | — | 0% (4) |
| Same subscription | 2–3 | 10 | 0% | 0% | — | — | 0% (1) |
| Same Mac | 0 | 11 | 0% | 0% | — | — | — |
| Same Mac | 1 | 15 | 0% | 0% | — | — | 0% (5) |
| Same Mac | 2–3 | 11 | 0% | 0% | — | — | 0% (1) |
| Same Mac | 4–7 | 1 | 0% | 0% | — | — | — |
| Same agent | 0 | 12 | 0% | 0% | — | — | 0% (3) |
| Same agent | 1 | 12 | 0% | 0% | — | — | — |
| Same agent | 2–3 | 7 | 0% | 0% | — | — | 0% (1) |
| Same agent | 4–7 | 1 | 0% | 0% | — | — | — |

### All projects

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 1119 | 3% | 0% | — | 0% (25) | 5% (204) |
| Same subscription | 1 | 1473 | 2% | 0% | — | 0% (23) | 5% (248) |
| Same subscription | 2–3 | 1053 | 1% | 0% | — | 0% (22) | 7% (227) |
| Same Mac | 0 | 1079 | 3% | 0% | — | 0% (13) | 4% (173) |
| Same Mac | 1 | 1162 | 2% | 0% | — | 0% (31) | 10% (223) |
| Same Mac | 2–3 | 1071 | 2% | 0% | — | 0% (20) | 5% (212) |
| Same Mac | 4–7 | 313 | 1% | 1% | — | 0% (6) | 0% (68) |
| Same Mac | 8+ | 20 | 0% | 5% | — | — | 0% (3) |
| Same agent | 0 | 1556 | 2% | 0% | — | 0% (36) | 6% (280) |
| Same agent | 1 | 778 | 3% | 0% | — | 0% (19) | 7% (165) |
| Same agent | 2–3 | 567 | 2% | 0% | — | 0% (11) | 3% (127) |
| Same agent | 4–7 | 138 | 5% | 1% | — | 0% (4) | 0% (30) |
| Same agent | 8+ | 1 | 0% | 0% | — | — | 0% (1) |

## Owner stops per backlog item

Decisions you made for one item (cards and design decisions), items done in the last 14 days against the 14 before; a large item counts with its slices.

| Items | Last 14 days | 14 days before |
|---|---|---|
| Small | — (n=0) | — (n=0) |
| Large | — (n=0) | — (n=0) |
