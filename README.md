# Push Workout Tracker

A minimalist workout tracking app that combines the flexibility of spreadsheets with clean mobile UI.

## Motivation

I've tried dozens of workout apps. They're either too rigid (hard-coded structures), over-engineered (features I don't need), or poorly designed. I always end up back at spreadsheets or Apple Notes — they're flexible but ugly.

This app bridges that gap: spreadsheet-level customization with modern mobile UX.

**Long-term vision:** Add LLM-powered natural language input. Type "bench 60x8 60x8 62.5x6" and it parses into structured data. Spreadsheet flexibility + voice-note speed + clean interface.

## Goals

- Replace my current tracking system (Notes/Excel)
- Learn React Native and mobile development
- Build a portfolio project with documented design process

## Current Status

In design phase. Creating wireframes and defining user flows.

## Design Process

I'm documenting the full design process in `/docs/design/`:

- User needs analysis (analyzed 50+ past workouts)
- Wireframe iterations (v0.1 → v0.2 → v0.3)
- Design decisions and rationale

Design inspirations: Wealthsimple (minimalism), Strong (functionality), Notion (flexibility).

## Tech Stack

- React Native (Expo)
- Custom design system (no UI library)
- AsyncStorage for persistence
- Future: LLM integration for natural language input

## Roadmap

**v0.1 — MVP (Current)**
- Basic workout tracking
- View previous session data
- Plan next session

**v0.2 — Persistence**
- Save data locally
- Load on launch

**v1.0 — Polish**
- Stats and progress charts
- Export data
- App Store release

**v2.0 — AI Integration**
- Natural language parsing
- Voice input
- Smart suggestions

## Installation
```bash
git clone https://github.com/hturlet/push-workout-app.git
cd push-workout-app
npm install
npx expo start
```

## What I'm Learning

- User-centered design methodology
- React Native architecture
- Building reusable design systems
- Design-first development workflow

## License

MIT

---

Built by Hugo Turlet  
[LinkedIn](https://linkedin.com/in/hugo-turlet) • [Portfolio](#)