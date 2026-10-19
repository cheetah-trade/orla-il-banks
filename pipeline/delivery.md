# Delivery of orla-il-banks (counted 2026-10-19 09:59 from Task Floor's run logs and linked pull requests; counts only)

KPI 1: pull request wait to merge (open → merge). KPI 2: conversion to merge = merged / (merged + closed unmerged + reverted). Goal for nudges: zero (answers, permissions, «go on», status checks, restarts, stops for the owner). Outcomes: change failure = (reverted + hotfixes) / (merged + reverted); rework = finished work the owner sent back to verify or restart, or another task continued; time to restore = a reverted change's merge to its revert's.

## Last 24 hours

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Product lead | 1 | 6k | 0 | 0 | — | — | — | 0 / 0 / 1 / 0 | 2 (answers 1, restarts 1) | 0 | — | — | 100% | — |
| **All** | 1 | 6k | 0 | 0 | — | — | — | 0 / 0 / 1 / 0 | 2 (answers 1, restarts 1) | 0 | — | — | 100% | — |

## Last 7 days

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Backlog steward | 5 | 18k | 0 | 0 | — | — | — | 0 / 0 / 0 / 5 | 5 (stops for you 5) | 0 | — | — | 0% | — |
| Artifact steward | 4 | 5k | 0 | 0 | — | — | — | 0 / 0 / 0 / 4 | 2 (stops for you 2) | 0 | — | — | 0% | — |
| Development lead | 2 | 7k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 2 (stops for you 2) | 0 | — | — | 0% | — |
| Product lead | 2 | 38k | 1 | 0 | — | — | — | 0 / 0 / 1 / 1 | 4 (answers 3, restarts 1) | 0 | — | — | 50% | — |
| Owner's conversations | 1 | 7k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 7 (status checks 1, stops for you 6) | 0 | — | — | 0% | — |
| **All** | 14 | 75k | 1 | 0 | — | — | — | 0 / 0 / 1 / 13 | 20 (stops for you 15, answers 3, restarts 1, status checks 1) | 0 | — | — | 7% | — |

## Outcomes over 30 days

Merged 0, reverted 0, hotfixes 0: change failure —, rework 7% (1 of 14 finished), time to restore median —.

## Context compactions by model and effort

Runs ended in the last 7 days; a long run has 46 turns or more. A compaction drops most of the context and the run goes on from a summary and its anchor.

| Model | Effort | Runs | Compactions | Per run | Runs compacted | Long runs | Per long run |
|---|---|---|---|---|---|---|---|
| claude-opus-5-5 | high | 19 | 0 | 0 | 0 | 0 | — |
| claude-opus-5-5 | medium | 3 | 0 | 0 | 0 | 0 | — |
| claude-sonnet-5-5 | low | 1 | 0 | 0 | 0 | 0 | — |

## Runaway runs

Usual run here: 90th percentile 5k output tokens, 12 turns.

- None.

## Sessions the owner rated

Score of 5 and the owner's note; the lowest first. Find why each low one went badly.

- None rated.

## Flow efficiency by department

Work as a share of task time that was not «off» (owner: waits for the owner, including finished turns whose questions were open), per week from Monday, the latest first.

| Department | 2026-10-12 |
|---|---|
| development | 2% (1.8 h; owner 19%) |
| product | 0% (58.3 h; owner 31%) |

## What hangs now

- offline: «Roman Dubina's Mac» (member-4c77dcbf): Roman Dubina's Mac silent since 13.10 19:51

## Quality by agent and model

The owner's ratings, grade verdicts, the claims judge and the Academy on real work, per model the run used; each figure with its sample (n). Small samples and harder tasks mislead: a report, not a routing rule.

| Agent | Model | Rating (n) | As is (n) | Claims checked: confirmed / unseen / contradicted | Exams: score (n) |
|---|---|---|---|---|---|
| Product lead | claude-opus-5-5 | — | 100% (2) | 2: 1 / 0 / 0 | — |
| Artifact steward | claude-opus-5-5 | — | — | 1: 1 / 0 / 0 | — |
| Backlog steward | claude-opus-5-5 | — | — | 1: 1 / 0 / 0 | — |

## Quality under load

Outcomes by how many other runs were going as a run started (last 30 days): on its subscription, on its Mac and of its agent; each figure with its sample (n). Ratings, «as is» and claims count for the run they judged. A report: no cap changes by itself.

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 6 | 0% | 0% | — | — | — |
| Same subscription | 1 | 10 | 0% | 0% | — | — | 0% (1) |
| Same subscription | 2–3 | 7 | 0% | 0% | — | — | 0% (2) |
| Same Mac | 0 | 7 | 0% | 0% | — | — | — |
| Same Mac | 1 | 7 | 0% | 0% | — | — | 0% (2) |
| Same Mac | 2–3 | 8 | 0% | 0% | — | — | 0% (1) |
| Same Mac | 4–7 | 1 | 0% | 0% | — | — | — |
| Same agent | 0 | 7 | 0% | 0% | — | — | 0% (2) |
| Same agent | 1 | 6 | 0% | 0% | — | — | — |
| Same agent | 2–3 | 6 | 0% | 0% | — | — | 0% (1) |
| Same agent | 4–7 | 1 | 0% | 0% | — | — | — |

### All projects

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 980 | 3% | 0% | — | 0% (16) | 5% (192) |
| Same subscription | 1 | 1189 | 3% | 0% | — | 0% (16) | 5% (190) |
| Same subscription | 2–3 | 969 | 1% | 0% | — | 0% (20) | 6% (247) |
| Same Mac | 0 | 900 | 4% | 0% | — | 0% (9) | 4% (158) |
| Same Mac | 1 | 948 | 2% | 0% | — | 0% (20) | 9% (189) |
| Same Mac | 2–3 | 957 | 2% | 0% | — | 0% (17) | 4% (210) |
| Same Mac | 4–7 | 313 | 1% | 1% | — | 0% (6) | 0% (69) |
| Same Mac | 8+ | 20 | 0% | 5% | — | — | 0% (3) |
| Same agent | 0 | 1292 | 2% | 0% | — | 0% (27) | 5% (250) |
| Same agent | 1 | 631 | 3% | 0% | — | 0% (12) | 6% (144) |
| Same agent | 2–3 | 538 | 2% | 0% | — | 0% (9) | 3% (139) |
| Same agent | 4–7 | 138 | 5% | 1% | — | 0% (4) | 0% (30) |
| Same agent | 8+ | 1 | 0% | 0% | — | — | 0% (1) |

## Owner stops per backlog item

Decisions you made for one item (cards and design decisions), items done in the last 14 days against the 14 before; a large item counts with its slices.

| Items | Last 14 days | 14 days before |
|---|---|---|
| Small | — (n=0) | — (n=0) |
| Large | — (n=0) | — (n=0) |
