# Requirements

**Project:** Push Workout Tracker  
**Date:** February 3, 2025  
**Author:** Hugo Turlet

---

## Problem Statement

Current workout tracking methods (Apple Notes, Excel) are highly flexible but lack structure and visual clarity. Existing apps are either too rigid (hard-coded structures) or over-engineered (unnecessary features).

**Goal:** Build a workout tracker that combines spreadsheet-level flexibility with clean, modern mobile UX.

---

## Must Have (MVP - v0.1)

**Core functionality required for first release:**

- View, add, and remove workouts
- View, add, and remove exercises within workouts
- View, add, and remove sets within exercises
- Track exercise metadata:
  - Set format/target (e.g., "3x8-12", "4x10-15")
  - Rest time between sets
- Track per-set data:
  - Weight (kg)
  - Reps performed
  - RIR (Reps in Reserve)
- View previous session data for each exercise
- Plan next session (target weight and reps)
- Display set numbers clearly (Set 1, Set 2, etc.)

---

## Should Have (v0.2)

**Important but not blocking MVP:**

- Add notes/comments per exercise (form cues, injuries, etc.)
- First-time onboarding flow:
  - "Create your workout" screen
  - Options: Build from scratch / Import from notes / Use template
- LLM integration to parse quickly-entered data (e.g., "bench 60x8 60x8 62.5x6")

---

## Could Have (v0.3+)

**Nice-to-have features for future versions:**

- Built-in rest timer with notifications
- Customizable columns per user (swap RIR for "form quality" or other metrics)
- Change Sets numbers for other types of sets (warm-ups, dropsets..)
- Auto-suggest next session targets based on RIR (e.g., RIR 3 → suggest +1 rep)
- Exercise database to browse when creating programs
- Pre-built workout templates
- Share workout templates with friends

---

## Won't Have (Out of Scope)

**Features explicitly excluded from this project:**

- Social network features (feed, followers, likes)
- User accounts or authentication system

---

## User Workflow

### Current Behavior (Apple Notes)
1. Check last session numbers before starting
2. Load weight for first set and check planned rep target
3. Perform set
4. After set: Start rest timer, write down RIR, optionally note form quality
5. Check next set's target reps
6. Repeat steps 3-5 until all sets complete
7. After exercise: Write estimated targets for next session (weight and reps)
8. Move to next exercise and repeat

### Target Behavior (App)
1. Open workout screen
2. See last session data pre-filled
3. Perform set
4. After set: Confirm values or adjust if different from plan
5. After exercise: Input planned targets for next session
6. Move to next exercise and repeat

---

## Technical Constraints

- Must work offline (no internet required for core functionality)
- Must be faster than typing in Notes (~5 seconds per exercise)
- Must be readable with sweaty hands (large touch targets, high contrast)
- Must persist data locally between sessions

---

## Success Criteria

**MVP is successful if:**
- Logging a workout is faster than using Notes
- Data persists between app restarts
- UI remains readable during actual workouts (gym environment)
- I consistently use it for 2+ weeks without reverting to Notes

---

## Open Questions

_(To be answered during design phase)_

- Should RIR field be always visible or optional/collapsible?
- Inline editing vs. modal for set data entry?
- When to input "next session" plan: during workout or after completion?
- How to handle exercises with no previous data (first time)?