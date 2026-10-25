# Delivery of orla-il-banks (counted 2026-10-25 06:00 from Task Floor's run logs and linked pull requests; counts only)

KPI 1: pull request wait to merge (open → merge). KPI 2: conversion to merge = merged / (merged + closed unmerged + reverted). Goal for nudges: zero (answers, permissions, «go on», status checks, restarts, stops for the owner). Outcomes: change failure = (reverted + hotfixes) / (merged + reverted); rework = finished work the owner sent back to verify or restart, or another task continued; time to restore = a reverted change's merge to its revert's.

## Last 24 hours

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| — | 0 | | | | | | | | | | | | | |

## Last 7 days

| Agent | Tasks | Output tokens | PRs opened | Merged | Wait median h | Wait mean h | Conversion | Closed / reverted / open / no PR | Nudges | Runaway | Rating | Change failure | Rework | Restore h |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Product lead | 7 | 61k | 0 | 1 | 182.7 | 182.7 | 100% | 0 / 0 / 0 / 6 | 13 (restarts 2, answers 3, stops for you 8) | 0 | — | 0% | 29% | — |
| Artifact steward | 6 | 16k | 0 | 0 | — | — | — | 0 / 0 / 0 / 6 | 5 (stops for you 5) | 0 | — | — | 0% | — |
| Backlog steward | 6 | 22k | 0 | 0 | — | — | — | 0 / 0 / 0 / 6 | 6 (stops for you 6) | 0 | — | — | 0% | — |
| Owner's conversations | 3 | 6k | 0 | 0 | — | — | — | 0 / 0 / 0 / 3 | 2 (stops for you 2) | 0 | — | — | 0% | — |
| Development lead | 2 | 12k | 0 | 0 | — | — | — | 0 / 0 / 0 / 2 | 0 | 0 | — | — | 0% | — |
| **All** | 24 | 118k | 0 | 1 | 182.7 | 182.7 | 100% | 0 / 0 / 0 / 23 | 26 (restarts 2, answers 3, stops for you 21) | 0 | — | 0% | 8% | — |

## Outcomes over 30 days

Merged 1, reverted 0, hotfixes 0: change failure 0%, rework 6% (2 of 34 finished), time to restore median —.

## Pull requests Delivery sees

Of the people's pull requests merged in the last 7 days (bots left out), 1 of 1 (100%) are linked to a task or a session (by a link in the conversation or by its claude/… or codex/… branch).

## Context compactions by model and effort

Runs ended in the last 7 days; a long run has 46 turns or more. A compaction drops most of the context and the run goes on from a summary and its anchor.

| Model | Effort | Runs | Compactions | Per run | Runs compacted | Long runs | Per long run |
|---|---|---|---|---|---|---|---|
| claude-opus-5-5 | high | 37 | 0 | 0 | 0 | 0 | — |
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
| development | 0% (69 h; owner 0%) | 2% (1.8 h; owner 19%) |
| product | 0% (217 h; owner 2%) | 0% (54.4 h; owner 33%) |
| No department | 0% (55.9 h; owner 35%) | — |

## What hangs now

- offline: «Anton MacBook Air Old» (member-1cf130e8): Anton MacBook Air Old silent since 25.10 05:37
- offline: «Roman Dubina's Mac» (member-4c77dcbf): Roman Dubina's Mac silent since 13.10 19:51
- offline: «Anton MacBook Pro» (member-500ccf82): Anton MacBook Pro silent since 25.10 04:09
- offline: «Anton MacBook Pro Old» (member-6d504cb7): Anton MacBook Pro Old silent since 25.10 00:02
- offline: «Gera Skalski's Mac» (member-c20323c4): Gera Skalski's Mac silent since 22.10 16:09
- offline: «Gera Skalski's Mac» (member-d7405858): Gera Skalski's Mac silent since 22.10 15:59
- offline: «Irina's Mac» (member-fd1d09bf): Irina's Mac silent since 25.10 05:07

## Quality by agent and model

The owner's ratings, grade verdicts, the claims judge and the Academy on real work, per model the run used; each figure with its sample (n). Small samples and harder tasks mislead: a report, not a routing rule.

| Agent | Model | Rating (n) | As is (n) | Claims checked: confirmed / unseen / contradicted | Exams: score (n) |
|---|---|---|---|---|---|
| Product lead | claude-opus-5-5 | — | — | 3: 3 / 0 / 0 | — |
| Artifact steward | claude-opus-5-5 | — | — | 2: 0 / 1 / 0 | — |
| Backlog steward | claude-opus-5-5 | — | — | 1: 0 / 0 / 0 | — |
| Development lead | claude-opus-5-5 | — | — | 1: 1 / 0 / 0 | — |

## Quality under load

Outcomes by how many other runs were going as a run started (last 30 days): on its subscription, on its Mac and of its agent; each figure with its sample (n). Ratings, «as is» and claims count for the run they judged. A report: no cap changes by itself.

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 9 | 0% | 0% | — | — | 0% (1) |
| Same subscription | 1 | 27 | 0% | 0% | — | — | 0% (5) |
| Same subscription | 2–3 | 26 | 0% | 4% | — | — | 0% (3) |
| Same Mac | 0 | 13 | 0% | 8% | — | — | 0% (1) |
| Same Mac | 1 | 26 | 0% | 0% | — | — | 0% (6) |
| Same Mac | 2–3 | 17 | 0% | 0% | — | — | 0% (1) |
| Same Mac | 4–7 | 6 | 0% | 0% | — | — | 0% (1) |
| Same agent | 0 | 18 | 0% | 0% | — | — | 0% (5) |
| Same agent | 1 | 22 | 0% | 5% | — | — | 0% (1) |
| Same agent | 2–3 | 13 | 0% | 0% | — | — | 0% (1) |
| Same agent | 4–7 | 1 | 0% | 0% | — | — | — |

### All projects

| Load | Other runs | Runs | Failed | Stopped by you | Rating (n) | As is (n) | Claims contradicted (n) |
|---|---|---|---|---|---|---|---|
| Same subscription | 0 | 1510 | 3% | 0% | — | 0% (27) | 4% (294) |
| Same subscription | 1 | 2032 | 3% | 0% | — | 0% (28) | 5% (318) |
| Same subscription | 2–3 | 1703 | 2% | 0% | — | 0% (25) | 6% (322) |
| Same Mac | 0 | 1493 | 3% | 0% | — | 0% (18) | 4% (252) |
| Same Mac | 1 | 1752 | 2% | 0% | — | 0% (36) | 9% (290) |
| Same Mac | 2–3 | 1443 | 2% | 0% | — | 0% (20) | 4% (247) |
| Same Mac | 4–7 | 537 | 3% | 0% | — | 0% (6) | 2% (142) |
| Same Mac | 8+ | 20 | 0% | 5% | — | — | 0% (3) |
| Same agent | 0 | 2323 | 2% | 0% | — | 0% (41) | 5% (426) |
| Same agent | 1 | 1140 | 3% | 0% | — | 0% (20) | 6% (200) |
| Same agent | 2–3 | 813 | 3% | 0% | — | 0% (15) | 3% (166) |
| Same agent | 4–7 | 140 | 6% | 1% | — | 0% (4) | 0% (29) |
| Same agent | 8+ | 1 | 0% | 0% | — | — | 0% (1) |

## Owner stops per backlog item

Decisions you made for one item (cards and design decisions), items done in the last 14 days against the 14 before; a large item counts with its slices.

| Items | Last 14 days | 14 days before |
|---|---|---|
| Small | — (n=0) | — (n=0) |
| Large | — (n=0) | — (n=0) |
