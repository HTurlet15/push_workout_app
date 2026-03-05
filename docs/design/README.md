# Design Process

How I went from blank page to a validated design for Push Workout Tracker.

## The Short Version

I tried coding first, wasted time, stopped. Wrote requirements. Did 12+ timed paper sketches to beat perfectionism. Refined in Figma over 7 iterations. Built it.

## Phase 1 — The False Start

First React Native project. I jumped straight into code to "learn by doing." Built components, tried layouts, threw them away. No clear direction meant no useful output.

The abandoned experiments live in [`wireframes/first_trials/`](wireframes/first_trials/) as a reminder.

## Phase 2 — Requirements

Paused and wrote [`requirements.md`](requirements.md): must-haves, nice-to-haves, and explicit exclusions. This gave constraints to design within.

## Phase 3 — Paper Sketches

Opening Figma with no plan would have led to pixel-tweaking paralysis. Instead:

1. Set a 5-minute timer
2. Sketch one idea fast — no erasing, no judgment
3. Note what works, what doesn't
4. Start fresh, repeat

After 12+ sketches, patterns emerged. All sketches are in [`wireframes/sketches/`](wireframes/sketches/).

## Phase 4 — Figma

Moved the best paper concept to Figma. Seven versions to nail down details: color semantics, column layout, how to differentiate planned vs. previous data, button placement.

Primary focus was the **Workout Screen** — where 90% of actual usage happens. Secondary screens (workout list, programs, graphs) are intentionally simpler.

All iterations in [`wireframes/figma/`](wireframes/figma/).

## Design Decisions

### Color System

Each color carries specific meaning:

| Color | Meaning | Example |
|-------|---------|---------|
| **Black** | Data entered this session | Current weight/reps values |
| **Gray** | Carried from previous session | Pre-filled set values |
| **Gray + calendar** | Planned for this session | Values set in advance via Next view |
| **Green** | Set completed | Row turns green when weight + reps are filled |
| **Yellow** | Exercise note | Optional note banner under exercise name |

### Three Views Per Exercise

- **Current** — today's session, pre-filled with previous data in gray
- **Previous** — read-only review of last session
- **Next** — plan weights/reps for next time (calendar icon marks these values)

Swipe left/right to switch. Keeps the UI clean while making all temporal data accessible.

### Bottom Bar

Three actions consolidated at the bottom instead of cluttering the workout table:

- **Timer** — rest countdown, starts on set completion
- **Edit** — add/remove sets, exercises, notes
- **Help** — contextual guidance

### What I'd Do Differently

- Start with requirements from day one
- Sketch even more variations before going digital
- Test with real workouts earlier in the process

## File Structure

```
docs/design/
├── README.md          ← this file
├── requirements.md    ← feature scope definition
├── screenshots/       ← actual app screenshots for showcase
└── wireframes/
    ├── sketches/      ← paper iterations
    ├── first_trials/  ← abandoned code experiments
    └── figma/         ← digital mockups (v1–v7)
```