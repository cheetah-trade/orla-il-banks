# Delivery of orla-il-banks (counted 2026-10-17 06:00 from Task Floor's run logs and linked pull requests; counts only)

KPI 1: pull request wait to merge (open → merge). KPI 2: conversion to merge = merged / (merged + closed unmerged + reverted). Goal for nudges: zero (answers, permissions, «go on», status checks, restarts, stops for the owner). Outcomes: change failure = (reverted + hotfixes) / (merged + reverted); rework = finished work the owner sent back to verify or restart, or another task continued; time to restore = a reverted change's merge to its revert's.

## Last 24 hours

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Artifact steward | 1 | 1k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| Backlog steward | 1 | 3k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 1 (stops for you 1) | 0 | — | — | 0% | — |
| Development lead | 0 | 0 | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| **All** | 2 | 5k | 0 | 0 | — | — | — | 0 / 0 / 0 / 3 | 1 (stops for you 1) | 0 | — | — | 0% | — |

## Last 7 days

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Backlog steward | 3 | 11k | 0 | 0 | — | — | — | 0 / 0 / 0 / 3 | 2 (stops for you 2) | 0 | — | — | 0% | — |
| Artifact steward | 2 | 2k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 0 | 0 | — | — | 0% | — |
| Development lead | 2 | 7k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 2 (stops for you 2) | 0 | — | — | 0% | — |
| Product lead | 2 | 32k | 1 | 0 | — | — | — | 0 / 0 / 0 / 1 | 2 (answers 2) | 0 | — | — | 0% | — |
| Owner's conversations | 1 | 7k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 7 (status checks 1, stops for you 6) | 0 | — | — | 0% | — |
| **All** | 10 | 58k | 1 | 0 | — | — | — | 0 / 0 / 0 / 9 | 13 (stops for you 10, answers 2, status checks 1) | 0 | — | — | 0% | — |

## Outcomes over 30 days

Merged 0, reverted 0, hotfixes 0: change failure —, rework 0% (0 of 9 finished), time to restore median —.

## Context compactions by model and effort

Runs ended in the last 7 days; a long run has 46 turns or more. A compaction drops most of the context and the run goes on from a summary and its anchor.

| Model | Effort | Runs | Compactions | Per run | Runs compacted | Long runs | Per long run |
|---|---|---|---|---|---|---|---|
| claude-opus-5-5 | high | 11 | 0 | 0 | 0 | 0 | — |
| claude-opus-5-5 | medium | 3 | 0 | 0 | 0 | 0 | — |
| claude-sonnet-5-5 | low | 1 | 0 | 0 | 0 | 0 | — |

## Runaway runs

Usual run here: 90th percentile 8k output tokens, 19 turns.

- None.

## Sessions the owner rated

Score of 5 and the owner's note; the lowest first. Find why each low one went badly.

- None rated.

## Flow efficiency by department

Work as a share of task time that was not «off» (owner: waits for the owner, including finished turns whose questions were open), per week from Monday, the latest first.

| Department | 2026-10-12 |
|---|---|
| development | 2% (1.8 h; owner 19%) |
| product | 0% (35.7 h; owner 47%) |

## What hangs now

- queued: «Product pulse · 15.10» (0f16eb7fd601): queued 42.0 h: No eligible profile: member-70ee94bc_claude-07: limit reached until 18.10 10:00
- offline: «Anton MacBook Air Old» (member-1cf130e8): Anton MacBook Air Old silent since 17.10 05:40
- offline: «Roman Dubina's Mac» (member-4c77dcbf): Roman Dubina's Mac silent since 13.10 19:51
- offline: «Anton MacBook Pro Old» (member-6d504cb7): Anton MacBook Pro Old silent since 17.10 01:29

## Quality by agent and model

The owner's ratings, grade verdicts, the claims judge and the Academy on real work, per model the run used; each figure with its sample (n). Small samples and harder tasks mislead: a report, not a routing rule.

| Agent | Model | Rating (n) | As is (n) | Claims checked: confirmed / unseen / contradicted | Exams: score (n) |
|---|---|---|---|---|---|
| Product lead | claude-opus-5-5 | — | 100% (2) | 1: 0 / 0 / 0 | — |

## Quality under load

Outcomes by how many other runs were going as a run started (last 30 days): on its subscription, on its Mac and of its agent; each figure with its sample (n). Ratings, «as is» and claims count for the run they judged. A report: no cap changes by itself.

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 5 | 0% | 0% | — | — | — |
| Same subscription | 1 | 7 | 0% | 0% | — | — | — |
| Same subscription | 2–3 | 3 | 0% | 0% | — | — | — |
| Same Mac | 0 | 5 | 0% | 0% | — | — | — |
| Same Mac | 1 | 3 | 0% | 0% | — | — | — |
| Same Mac | 2–3 | 6 | 0% | 0% | — | — | — |
| Same Mac | 4–7 | 1 | 0% | 0% | — | — | — |
| Same agent | 0 | 2 | 0% | 0% | — | — | — |
| Same agent | 1 | 5 | 0% | 0% | — | — | — |
| Same agent | 2–3 | 4 | 0% | 0% | — | — | — |
| Same agent | 4–7 | 1 | 0% | 0% | — | — | — |

### All projects

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 568 | 5% | 0% | — | 0% (4) | 2% (95) |
| Same subscription | 1 | 816 | 4% | 0% | — | 0% (7) | 7% (113) |
| Same subscription | 2–3 | 684 | 2% | 0% | — | 0% (9) | 3% (183) |
| Same Mac | 0 | 496 | 7% | 0% | — | 0% (2) | 5% (73) |
| Same Mac | 1 | 579 | 3% | 0% | — | 0% (5) | 5% (74) |
| Same Mac | 2–3 | 678 | 3% | 0% | — | 0% (10) | 4% (179) |
| Same Mac | 4–7 | 297 | 1% | 1% | — | 0% (3) | 0% (62) |
| Same Mac | 8+ | 18 | 0% | 6% | — | — | 0% (3) |
| Same agent | 0 | 746 | 4% | 0% | — | 0% (10) | 6% (143) |
| Same agent | 1 | 419 | 4% | 0% | — | 0% (5) | 4% (103) |
| Same agent | 2–3 | 352 | 3% | 0% | — | 0% (4) | 3% (78) |
| Same agent | 4–7 | 127 | 6% | 2% | — | 0% (1) | 0% (24) |
| Same agent | 8+ | 1 | 0% | 0% | — | — | 0% (1) |

## Owner stops per backlog item

Decisions you made for one item (cards and design decisions), items done in the last 14 days against the 14 before; a large item counts with its slices.

| Items | Last 14 days | 14 days before |
|---|---|---|
| Small | — (n=0) | — (n=0) |
| Large | — (n=0) | — (n=0) |
