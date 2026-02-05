# Requirements

**Project:** Push Workout Tracker  
**Version:** 0.1 (MVP)  
**Date:** February 3, 2025  
**Author:** Hugo Turlet

---

## Problem Statement

Current workout tracking methods (Notes, Excel) are highly flexible but lack structure and visual clarity. 

Existing apps are either:
- Too rigid (hard-coded structures)
- Over-engineered (unnecessary features)

**Goal:** Build a workout tracker that combines spreadsheet-level flexibility with clean, modern mobile UX.

---

## MVP Scope (v0.1)

### Must Have

**Workout Management:**
- View, add, and remove workouts
- View, add, and remove exercises within workouts
- View, add, and remove sets within exercises

**Exercise Tracking:**
- Set format/target (e.g., "3x8-12", "4x10-15")
- Rest time between sets
- Support bodyweight exercises (weight = 0 or "BW")

**Per-Set Data:**
- Weight (lbs)
- Reps performed
- RIR (Reps in Reserve)

**Session Context:**
- View previous session data
- Plan next session targets (weight and reps)
- Display set numbers clearly (Set 1, Set 2, etc.)

### Should Have (v0.2)

- Add notes/comments per exercise (form cues, injuries)
- First-time onboarding flow:
  - "Create your workout" screen
  - Options: Build from scratch / Import from notes / Use template
- LLM integration to parse quickly-entered data (e.g., "bench 60x8 60x8 62.5x6")

### Could Have (v0.3+)

- Built-in rest timer with notifications
- Customizable tracking columns (swap RIR for "form quality", etc.)
- Set type variations (warm-ups, dropsets)
- Auto-suggest next session based on RIR (e.g., RIR 3 → suggest +1 rep)
- Exercise database for program creation
- Pre-built workout templates
- Share templates with friends

### Won't Have

**Explicitly out of scope:**
- Social network features
- User accounts/authentication
- Cloud sync (local only for MVP)
- Meal/nutrition tracking
- Cardio tracking
- Video tutorials
- Workout reminders/notifications

---

## User Workflow

### Current Behavior (Notes)

1. Check last session numbers
2. Load weight and check planned rep target
3. Perform set
4. After set: Start rest timer, write RIR, optionally note form quality
5. Check next set's target
6. Repeat until all sets complete
7. After exercise: Write estimated targets for next session
8. Move to next exercise

### Target Behavior (App)

1. Open workout → see last session pre-filled
2. Perform set
3. After set: Confirm or adjust values
4. After exercise: Input planned targets for next session
5. Repeat for remaining exercises

---

## Technical Constraints

| Constraint | Requirement |
|------------|-------------|
| **Connectivity** | Must work offline |
| **Speed** | Faster than typing in Notes (~5 sec/exercise) |
| **Usability** | Large touch targets, high contrast (sweaty hands) |
| **Persistence** | Data must persist between sessions |
| **Units** | Default: pounds (lbs) / Future: kg/lbs toggle |

---

## Success Criteria

**MVP is successful if:**

- ✅ Logging a workout is faster than using Notes
- ✅ Data persists between app restarts
- ✅ UI remains readable during actual workouts
- ✅ I consistently use it for 2+ weeks

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| **First time exercise** | No previous data shown, user inputs from scratch |
| **Failed set (0 reps)** | Allow logging, don't suggest 0 for next session |
| **Bodyweight exercises** | Allow weight = 0, display as "BW" |
| **Exercise reordering** | MVP: Fixed order / Future: Drag-and-drop |

---

## Assumptions

- User tracks one workout at a time (no concurrent sessions)
- User completes sets in sequential order
- User has basic gym knowledge (RIR, rest time concepts)
- Mobile device accessible during entire workout

