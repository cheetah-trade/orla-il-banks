# Delivery of orla-il-banks (counted 2026-10-18 06:00 from Task Floor's run logs and linked pull requests; counts only)

KPI 1: pull request wait to merge (open → merge). KPI 2: conversion to merge = merged / (merged + closed unmerged + reverted). Goal for nudges: zero (answers, permissions, «go on», status checks, restarts, stops for the owner). Outcomes: change failure = (reverted + hotfixes) / (merged + reverted); rework = finished work the owner sent back to verify or restart, or another task continued; time to restore = a reverted change's merge to its revert's.

## Last 24 hours

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Artifact steward | 1 | 1k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 1 (stops for you 1) | 0 | — | — | 0% | — |
| Backlog steward | 1 | 4k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 1 (stops for you 1) | 0 | — | — | 0% | — |
| **All** | 2 | 6k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 2 (stops for you 2) | 0 | — | — | 0% | — |

## Last 7 days

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Backlog steward | 4 | 15k | 0 | 0 | — | — | — | 0 / 0 / 0 / 4 | 3 (stops for you 3) | 0 | — | — | 0% | — |
| Artifact steward | 3 | 4k | 0 | 0 | — | — | — | 0 / 0 / 0 / 3 | 1 (stops for you 1) | 0 | — | — | 0% | — |
| Development lead | 2 | 7k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 2 (stops for you 2) | 0 | — | — | 0% | — |
| Product lead | 2 | 32k | 1 | 0 | — | — | — | 0 / 0 / 0 / 1 | 2 (answers 2) | 0 | — | — | 0% | — |
| Owner's conversations | 1 | 7k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 7 (status checks 1, stops for you 6) | 0 | — | — | 0% | — |
| **All** | 12 | 64k | 1 | 0 | — | — | — | 0 / 0 / 0 / 11 | 15 (stops for you 12, answers 2, status checks 1) | 0 | — | — | 0% | — |

## Outcomes over 30 days

Merged 0, reverted 0, hotfixes 0: change failure —, rework 0% (0 of 11 finished), time to restore median —.

## Context compactions by model and effort

Runs ended in the last 7 days; a long run has 46 turns or more. A compaction drops most of the context and the run goes on from a summary and its anchor.

| Model | Effort | Runs | Compactions | Per run | Runs compacted | Long runs | Per long run |
|---|---|---|---|---|---|---|---|
| claude-opus-5-5 | high | 13 | 0 | 0 | 0 | 0 | — |
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
| product | 0% (53.2 h; owner 33%) |

## What hangs now

- queued: «Product pulse · 15.10» (0f16eb7fd601): queued 66.0 h: No eligible profile: member-70ee94bc_claude-07: limit reached until 18.10 10:00
- offline: «Roman Dubina's Mac» (member-4c77dcbf): Roman Dubina's Mac silent since 13.10 19:51
- offline: «Anton MacBook Pro Old» (member-6d504cb7): Anton MacBook Pro Old silent since 18.10 05:20

## Quality by agent and model

The owner's ratings, grade verdicts, the claims judge and the Academy on real work, per model the run used; each figure with its sample (n). Small samples and harder tasks mislead: a report, not a routing rule.

| Agent | Model | Rating (n) | As is (n) | Claims checked: confirmed / unseen / contradicted | Exams: score (n) |
|---|---|---|---|---|---|
| Product lead | claude-opus-5-5 | — | 100% (2) | 1: 0 / 0 / 0 | — |
| Artifact steward | claude-opus-5-5 | — | — | 1: 1 / 0 / 0 | — |
| Backlog steward | claude-opus-5-5 | — | — | 1: 1 / 0 / 0 | — |

## Quality under load

Outcomes by how many other runs were going as a run started (last 30 days): on its subscription, on its Mac and of its agent; each figure with its sample (n). Ratings, «as is» and claims count for the run they judged. A report: no cap changes by itself.

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 5 | 0% | 0% | — | — | — |
| Same subscription | 1 | 8 | 0% | 0% | — | — | 0% (1) |
| Same subscription | 2–3 | 4 | 0% | 0% | — | — | 0% (1) |
| Same Mac | 0 | 5 | 0% | 0% | — | — | — |
| Same Mac | 1 | 4 | 0% | 0% | — | — | 0% (1) |
| Same Mac | 2–3 | 7 | 0% | 0% | — | — | 0% (1) |
| Same Mac | 4–7 | 1 | 0% | 0% | — | — | — |
| Same agent | 0 | 3 | 0% | 0% | — | — | 0% (1) |
| Same agent | 1 | 5 | 0% | 0% | — | — | — |
| Same agent | 2–3 | 5 | 0% | 0% | — | — | 0% (1) |
| Same agent | 4–7 | 1 | 0% | 0% | — | — | — |

### All projects

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 819 | 3% | 0% | — | 0% (15) | 4% (158) |
| Same subscription | 1 | 1041 | 3% | 0% | — | 0% (15) | 5% (154) |
| Same subscription | 2–3 | 847 | 2% | 0% | — | 0% (17) | 4% (204) |
| Same Mac | 0 | 736 | 5% | 0% | — | 0% (8) | 2% (129) |
| Same Mac | 1 | 793 | 2% | 0% | — | 0% (18) | 7% (136) |
| Same Mac | 2–3 | 845 | 2% | 0% | — | 0% (15) | 4% (179) |
| Same Mac | 4–7 | 313 | 1% | 1% | — | 0% (6) | 0% (69) |
| Same Mac | 8+ | 20 | 0% | 5% | — | — | 0% (3) |
| Same agent | 0 | 1086 | 3% | 0% | — | 0% (23) | 4% (210) |
| Same agent | 1 | 522 | 3% | 0% | — | 0% (11) | 4% (107) |
| Same agent | 2–3 | 464 | 3% | 0% | — | 0% (9) | 3% (113) |
| Same agent | 4–7 | 137 | 5% | 1% | — | 0% (4) | 0% (30) |
| Same agent | 8+ | 1 | 0% | 0% | — | — | 0% (1) |

## Owner stops per backlog item

Decisions you made for one item (cards and design decisions), items done in the last 14 days against the 14 before; a large item counts with its slices.

| Items | Last 14 days | 14 days before |
|---|---|---|
| Small | — (n=0) | — (n=0) |
| Large | — (n=0) | — (n=0) |
