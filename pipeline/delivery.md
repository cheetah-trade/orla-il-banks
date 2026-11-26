# Delivery of orla-il-banks (counted 2026-11-26 06:00 from Task Floor's run logs and linked pull requests; counts only)

KPI 1: pull request wait to merge (open → merge). KPI 2: conversion to merge = merged / (merged + closed unmerged + reverted). Goal for nudges: zero (answers, permissions, «go on», status checks, restarts, stops for the owner). Outcomes: change failure = (reverted + hotfixes) / (merged + reverted); rework = finished work the owner sent back to verify or restart, or another task continued; time to restore = a reverted change's merge to its revert's.

## Last 24 hours

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| — | 0 | | | | | | | | | | | | | |

## Last 7 days

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Product lead | 1 | 16k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 1 (answers 1) | 0 | — | — | 0% | — |
| Artifact steward | 1 | 2k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| Backlog steward | 1 | 3k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| **All** | 3 | 22k | 0 | 0 | — | — | — | 0 / 0 / 0 / 3 | 1 (answers 1) | 0 | — | — | 0% | — |

## Outcomes over 30 days

Merged 0, reverted 0, hotfixes 0: change failure —, rework 27% (3 of 11 finished), time to restore median —.

## Context compactions by model and effort

Runs ended in the last 7 days; a long run has 46 turns or more. A compaction drops most of the context and the run goes on from a summary and its anchor.

| Model | Effort | Runs | Compactions | Per run | Runs compacted | Long runs | Per long run |
|---|---|---|---|---|---|---|---|
| claude-opus-5-5 | high | 4 | 0 | 0 | 0 | 0 | — |

## Runaway runs

Usual run here: 90th percentile 12k output tokens, 26 turns.

- None.

## Sessions the owner rated

Score of 5 and the owner's note; the lowest first. Find why each low one went badly.

- None rated.

## Flow efficiency by department

Work as a share of task time that was not «off» (owner: waits for the owner, including finished turns whose questions were open), per week from Monday, the latest first.

| Department | 2026-11-23 | 2026-11-16 | 2026-11-09 | 2026-11-02 |
|---|---|---|---|---|
| development | — | 0% (36.6 h; owner 0%) | 0% (63 h; owner 0%) | 99% (0.0553 h; owner 0%) |
| product | 4% (2.1 h; owner 95%) | 0% (156 h; owner 1%) | 0% (636 h; owner 0%) | 0% (231 h; owner 0%) |

## What hangs now

- offline: «Roman Dubina's Mac» (member-4c77dcbf): Roman Dubina's Mac silent since 13.10 19:51
- offline: «Anton MacBook Pro» (member-500ccf82): Anton MacBook Pro silent since 26.11 05:26
- offline: «Gera Skalski's Mac» (member-c20323c4): Gera Skalski's Mac silent since 22.10 16:09
- offline: «Gera Skalski's Mac» (member-d7405858): Gera Skalski's Mac silent since 22.10 15:59
- offline: «Irina's Mac» (member-fd1d09bf): Irina's Mac silent since 26.11 05:12

## Quality by agent and model

The owner's ratings, grade verdicts, the claims judge and the Academy on real work, per model the run used; each figure with its sample (n). Small samples and harder tasks mislead: a report, not a routing rule.

| Agent | Model | Rating (n) | As is (n) | Claims checked: confirmed / unseen / contradicted | Exams: score (n) |
|---|---|---|---|---|---|
| Product lead | claude-opus-5-5 | — | — | 1: 0 / 1 / 0 | — |
| Artifact steward | claude-opus-5-5 | — | — | 1: 1 / 0 / 0 | — |
| Backlog steward | claude-opus-5-5 | — | — | 1: 1 / 0 / 0 | — |

## Quality under load

Outcomes by how many other runs were going as a run started (last 30 days): on its subscription, on its Mac and of its agent; each figure with its sample (n). Ratings, «as is» and claims count for the run they judged. A report: no cap changes by itself.

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 10 | 20% | 0% | — | — | 0% (5) |
| Same subscription | 1 | 8 | 0% | 0% | — | — | 0% (3) |
| Same subscription | 2–3 | 7 | 14% | 0% | — | — | 0% (4) |
| Same Mac | 0 | 7 | 29% | 0% | — | — | 0% (3) |
| Same Mac | 1 | 12 | 0% | 0% | — | — | 0% (5) |
| Same Mac | 2–3 | 6 | 17% | 0% | — | — | 0% (4) |
| Same agent | 0 | 18 | 17% | 0% | — | — | 0% (8) |
| Same agent | 1 | 2 | 0% | 0% | — | — | — |
| Same agent | 2–3 | 4 | 0% | 0% | — | — | 0% (3) |
| Same agent | 4–7 | 1 | 0% | 0% | — | — | 0% (1) |

### All projects

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 1619 | 2% | 0% | — | — | 2% (313) |
| Same subscription | 1 | 1030 | 2% | 0% | — | — | 4% (160) |
| Same subscription | 2–3 | 897 | 2% | 0% | — | — | 3% (232) |
| Same Mac | 0 | 1344 | 2% | 0% | — | — | 2% (250) |
| Same Mac | 1 | 1036 | 2% | 0% | — | — | 4% (182) |
| Same Mac | 2–3 | 1042 | 2% | 0% | — | — | 3% (241) |
| Same Mac | 4–7 | 124 | 1% | 0% | — | — | 3% (32) |
| Same agent | 0 | 1029 | 2% | 0% | — | — | 5% (200) |
| Same agent | 1 | 319 | 1% | 0% | — | — | 1% (67) |
| Same agent | 2–3 | 187 | 1% | 0% | — | — | 6% (50) |
| Same agent | 4–7 | 8 | 0% | 0% | — | — | 0% (3) |


## Runs by agent, model and effort

Runs ended in the last 7 days, each once, as the hub noted them.

| Agent | Model | Effort | Runs | Output tokens |
|---|---|---|---|---|
| Product lead | claude-opus-5-5 | high | 2 | 16k |
| Artifact steward | claude-opus-5-5 | high | 1 | 2k |
| Backlog steward | claude-opus-5-5 | high | 1 | 3k |
## Owner stops per backlog item

Decisions you made for one item (cards and design decisions), items done in the last 14 days against the 14 before; a large item counts with its slices.

| Items | Last 14 days | 14 days before |
|---|---|---|
| Small | — (n=0) | — (n=0) |
| Large | — (n=0) | — (n=0) |
