# Design Process

## Overview

This document explains how I arrived at the final design for Push Workout Tracker, from initial chaos to a clear, validated design ready for implementation.

---

## The Journey

### 1. The False Start

This was my first time working with React Native and mobile development. I did what many developers do: jumped straight into coding to learn by doing.

**What happened:**
- Started building UI components immediately to understand how React Native worked
- Tried different layouts and ideas directly in code
- Quickly realized my approach wasn't working : I had no clear direction
- Spent time coding features, only to discard them because the layout didn't feel right
- Lost time building things I'd immediately throw away

**Evidence of the mess:** See the `/first_trials/` folder for abandoned experiments.

**Key realization:** I couldn't code my way out of unclear requirements.

---

### 2. Starting Over - Requirements First

I decided to pause and start properly this time.

**Step 1: Define what I actually wanted**

I wrote [`requirements.md`](../requirements.md) to clearly define:
- ✅ What I **must have** (core MVP features)
- 🎯 What I'd **like to have** (nice-to-haves for later)
- ❌ What I **don't want** (features that would complicate the app)

This gave me a clear direction and constraints to design within.

---

### 3. Paper Sketching - Fighting Perfectionism

With requirements defined, it was time to design. But I'm a perfectionist who easily gets stuck with blank page syndrome. Opening Figma would have paralyzed me.

**The solution: Timeboxed sketching**

**My process:**
1. Set a timer for **5 minutes**
2. Sketch one design idea as fast as possible (no erasing, no judging)
3. When the timer ends, note what I liked and what I didn't
4. Start fresh with a new 5-minute sketch
5. Repeat

**Why this worked:**
- No time to overthink = no perfectionism paralysis
- "Ugly first, pretty later" freed me to explore ideas
- Multiple iterations revealed patterns in what felt right
- Bad ideas on paper are free; bad ideas in code are expensive

**Result:** After 12+ paper sketches, I had a solid concept I was happy with.

**Artifacts:** All paper sketches are available in [`wireframes/sketches/`](wireframes/sketches/)

---

### 4. Digital Design - Figma Refinement

Once I had a paper design I liked, I moved to Figma to refine the details.

This is where I could test variations quickly, especially around small details like:
- How to differentiate planned vs. previous session data
- What colors to use (or not use)
- Where to place validation checkmarks
- How to organize columns in the table

**Iterations:**
After **7 versions** in Figma, I arrived at a design I was satisfied with.

**Primary focus:** The **Workout Screen** - this is where I'll spend 90% of my time in the app (tracking sets during workouts). Most design effort went here.

**Secondary screens:**
I also designed three additional screens:
- **Workout Choice** - Select which workout to do (likely the home screen)
- **Programs** - Choose which program to follow
- **Graphs** - Track metrics like volume and weight progression (planned for future versions)

These secondary screens are intentionally simple since they're not critical to the MVP. I may revisit and refine them later based on real usage.

**Artifacts:** All Figma iterations are available in [`wireframes/figma/`](wireframes/figma/)

---

## Design Decisions

### Core Principle: Maximum Clarity, Minimum Clutter

The overriding goal was to keep the interface as clean as possible while displaying all necessary information. Every element had to justify its presence.

---

### Color System

I'm still testing exact color values, but the tones and their meanings are locked:

#### 🟡 Yellow → Exercise notes/comments
- Used for the note banner under each exercise name
- Signals supplementary information without being intrusive

#### 🟢 Green → Completed sets
- A set row turns green only when all columns are filled (weight, reps, RIR)
- Provides immediate visual feedback on workout progress

#### ⚫ Black → Data entered today
- Current session values appear in black
- Clear distinction from historical data

#### ⚪ Gray → Previous session data
- Values from the last workout appear in gray
- Provides context without competing for attention with current data

#### ⚪📅 Gray + calendar icon → Planned values
- Future session targets marked with calendar icon
- Distinct from both current and previous data

---

### View Switching: Current / Previous / Next

For each exercise, I can switch between three views:

**Current** — Today's workout (default view)  
- Shows data being entered right now
- Displays previous session data for reference (in grey, I can overwrite the values)

**Next** — Plan future session  
- Set target weights and reps for next workout (will add the calendar icon next to them)
- Accessed via navigation arrows

**Previous** — Review last session  
- View-only mode showing complete previous workout data
- Accessed via navigation arrows

This keeps the interface clean while making all temporal data accessible.

---

### Bottom Action Bar (3 Buttons)

I chose to consolidate actions into three buttons at the bottom rather than cluttering the main interface:

**Left: ⭐ (Future LLM Assistant)**  
- Placeholder for AI features (v0.2+)
- Will parse voice/text input to log sets quickly

**Center: ▶️ 01:30 (Integrated Timer)**  
- Built-in rest timer
- Eliminates need to switch to Clock app during workouts
- Always accessible without leaving the screen

**Right: + (Add)**  
- Opens menu to add sets, exercises, or notes
- Deliberately not placed inline to avoid visual clutter

**Why bottom buttons instead of inline controls:**  
I prioritized a clean main view. Adding "+/−" buttons next to every set or exercise would create visual noise. Consolidating these actions into a single "+" menu keeps the workout table uncluttered while maintaining full functionality.

---

### What I'm Still Refining

- Exact hex values for colors (testing for optimal contrast and aesthetics)
- Bottom button iconography and styling
- Potential adjustments to spacing and typography

But the core information architecture and interaction patterns are locked.

---

## Key Learnings

**What worked:**
- Writing requirements before designing
- Timeboxed paper sketching to overcome perfectionism
- Iterating quickly in Figma for detail refinement

**What didn't work:**
- Jumping straight into code without a plan
- Trying to design by building

---

## File Structure
```
docs/design/
├── README.md (this file)
├── wireframes/
│   ├── sketches/ (paper iterations)
│   ├── first_trials/ (when I jumped right into code)
│   └── figma/ (digital mockups)
└── [additional design docs as needed]
```

---

**Status:** ✅ Ready for implementation  
**Date:** February 2025