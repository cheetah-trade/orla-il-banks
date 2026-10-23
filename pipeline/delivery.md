# Delivery of orla-il-banks (counted 2026-10-23 06:00 from Task Floor's run logs and linked pull requests; counts only)

KPI 1: pull request wait to merge (open → merge). KPI 2: conversion to merge = merged / (merged + closed unmerged + reverted). Goal for nudges: zero (answers, permissions, «go on», status checks, restarts, stops for the owner). Outcomes: change failure = (reverted + hotfixes) / (merged + reverted); rework = finished work the owner sent back to verify or restart, or another task continued; time to restore = a reverted change's merge to its revert's.

## Last 24 hours

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Product lead | 1 | 30 | 0 | 1 | 182.7 | 182.7 | 100% | 0 / 0 / 0 / 1 | 1 (stops for you 1) | 0 | — | 0% | 50% | — |
| Artifact steward | 1 | 3k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 1 (stops for you 1) | 0 | — | — | 0% | — |
| Backlog steward | 1 | 3k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 1 (stops for you 1) | 0 | — | — | 0% | — |
| Owner's conversations | 1 | 2k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 2 (stops for you 2) | 0 | — | — | 0% | — |
| Development lead | 1 | 5k | 0 | 0 | — | — | — | 0 / 0 / 0 / 1 | 0 | 0 | — | — | 0% | — |
| **All** | 5 | 13k | 0 | 1 | 182.7 | 182.7 | 100% | 0 / 0 / 0 / 5 | 5 (stops for you 5) | 0 | — | 0% | 17% | — |

## Last 7 days

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Artifact steward | 7 | 16k | 0 | 0 | — | — | — | 0 / 0 / 0 / 7 | 6 (stops for you 6) | 0 | — | — | 0% | — |
| Backlog steward | 7 | 25k | 0 | 0 | — | — | — | 0 / 0 / 0 / 7 | 8 (stops for you 8) | 0 | — | — | 0% | — |
| Product lead | 6 | 46k | 0 | 1 | 182.7 | 182.7 | 100% | 0 / 0 / 0 / 4 | 11 (stops for you 8, answers 2, restarts 1) | 0 | — | 0% | 20% | — |
| Owner's conversations | 3 | 6k | 0 | 0 | — | — | — | 0 / 0 / 0 / 3 | 2 (stops for you 2) | 0 | — | — | 0% | — |
| Development lead | 2 | 8k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 0 | 0 | — | — | 0% | — |
| **All** | 25 | 101k | 0 | 1 | 182.7 | 182.7 | 100% | 0 / 0 / 0 / 23 | 27 (stops for you 24, answers 2, restarts 1) | 0 | — | 0% | 4% | — |

## Outcomes over 30 days

Merged 1, reverted 0, hotfixes 0: change failure 0%, rework 3% (1 of 30 finished), time to restore median —.

## Pull requests Delivery sees

Of the people's pull requests merged in the last 7 days (bots left out), 1 of 1 (100%) are linked to a task or a session (by a link in the conversation or by its claude/… or codex/… branch).

## Context compactions by model and effort

Runs ended in the last 7 days; a long run has 46 turns or more. A compaction drops most of the context and the run goes on from a summary and its anchor.

| Model | Effort | Runs | Compactions | Per run | Runs compacted | Long runs | Per long run |
|---|---|---|---|---|---|---|---|
| claude-opus-5-5 | high | 31 | 0 | 0 | 0 | 0 | — |
| claude-sonnet-5-5 | medium | 5 | 0 | 0 | 0 | 0 | — |
| claude-sonnet-5-5 | low | 1 | 0 | 0 | 0 | 0 | — |

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
| development | 0% (68.5 h; owner 0%) | 2% (1.8 h; owner 19%) |
| product | 0% (184 h; owner 3%) | 0% (54.4 h; owner 33%) |
| No department | 0% (55.9 h; owner 35%) | — |

## What hangs now

- queued: «Product planning · 19.10» (8e3ccf413e5a): queued 92.0 h: No eligible profile: member-6d504cb7_claude-06: Anton MacBook Pro Old is busy: l
- offline: «Roman Dubina's Mac» (member-4c77dcbf): Roman Dubina's Mac silent since 13.10 19:51
- offline: «Gera Skalski's Mac» (member-c20323c4): Gera Skalski's Mac silent since 22.10 16:09
- offline: «Gera Skalski's Mac» (member-d7405858): Gera Skalski's Mac silent since 22.10 15:59
- offline: «Anton MacBook Air» (member-e1dacae1): Anton MacBook Air silent since 23.10 05:35
- offline: «Irina's Mac» (member-fd1d09bf): Irina's Mac silent since 23.10 05:56

## Quality by agent and model

The owner's ratings, grade verdicts, the claims judge and the Academy on real work, per model the run used; each figure with its sample (n). Small samples and harder tasks mislead: a report, not a routing rule.

| Agent | Model | Rating (n) | As is (n) | Claims checked: confirmed / unseen / contradicted | Exams: score (n) |
|---|---|---|---|---|---|
| Artifact steward | claude-opus-5-5 | — | — | 3: 1 / 1 / 0 | — |
| Backlog steward | claude-opus-5-5 | — | — | 2: 1 / 0 / 0 | — |
| Product lead | claude-opus-5-5 | — | — | 2: 2 / 0 / 0 | — |

## Quality under load

Outcomes by how many other runs were going as a run started (last 30 days): on its subscription, on its Mac and of its agent; each figure with its sample (n). Ratings, «as is» and claims count for the run they judged. A report: no cap changes by itself.

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 9 | 0% | 0% | — | — | 0% (1) |
| Same subscription | 1 | 26 | 0% | 0% | — | — | 0% (5) |
| Same subscription | 2–3 | 17 | 0% | 6% | — | — | 0% (1) |
| Same Mac | 0 | 12 | 0% | 8% | — | — | — |
| Same Mac | 1 | 24 | 0% | 0% | — | — | 0% (6) |
| Same Mac | 2–3 | 15 | 0% | 0% | — | — | 0% (1) |
| Same Mac | 4–7 | 1 | 0% | 0% | — | — | — |
| Same agent | 0 | 17 | 0% | 0% | — | — | 0% (4) |
| Same agent | 1 | 17 | 0% | 6% | — | — | — |
| Same agent | 2–3 | 9 | 0% | 0% | — | — | 0% (1) |
| Same agent | 4–7 | 1 | 0% | 0% | — | — | — |

### All projects

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 1265 | 2% | 0% | — | 0% (27) | 5% (204) |
| Same subscription | 1 | 1760 | 2% | 0% | — | 0% (28) | 6% (235) |
| Same subscription | 2–3 | 1270 | 1% | 0% | — | 0% (25) | 7% (236) |
| Same Mac | 0 | 1306 | 3% | 0% | — | 0% (18) | 6% (180) |
| Same Mac | 1 | 1449 | 2% | 0% | — | 0% (36) | 9% (212) |
| Same Mac | 2–3 | 1207 | 1% | 0% | — | 0% (20) | 5% (215) |
| Same Mac | 4–7 | 313 | 1% | 1% | — | 0% (6) | 0% (65) |
| Same Mac | 8+ | 20 | 0% | 5% | — | — | 0% (3) |
| Same agent | 0 | 1924 | 2% | 0% | — | 0% (41) | 6% (280) |
| Same agent | 1 | 894 | 2% | 0% | — | 0% (20) | 7% (155) |
| Same agent | 2–3 | 609 | 2% | 0% | — | 0% (15) | 4% (128) |
| Same agent | 4–7 | 139 | 5% | 1% | — | 0% (4) | 0% (30) |
| Same agent | 8+ | 1 | 0% | 0% | — | — | 0% (1) |

## Owner stops per backlog item

Decisions you made for one item (cards and design decisions), items done in the last 14 days against the 14 before; a large item counts with its slices.

| Items | Last 14 days | 14 days before |
|---|---|---|
| Small | — (n=0) | — (n=0) |
| Large | — (n=0) | — (n=0) |
