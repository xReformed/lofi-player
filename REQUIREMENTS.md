# Lofi Player — Requirements

A standalone desktop lofi music player with a built-in visualizer. No login, no streaming account, works offline. Built with Tauri (Rust shell) + React + TypeScript.

---

## 1. Vision & Guiding Principles

The product exists to fill a real gap: every existing lofi "player" leans on Spotify and inherits its free-tier limits, while the standalone options are visualizers with no player. This app is a **self-contained, cozy, lightweight** lofi player that just works.

Three principles that override individual feature decisions:

1. **Standalone.** No account, no streaming dependency, no ads. Ships its own music.
2. **Lightweight.** Runs quietly in the background for hours. Low CPU/RAM/battery is a feature, not an afterthought. (This is why Tauri, not Electron.)
3. **Cozy.** The aesthetic *is* the product. Calm, warm, low-stimulation, restful for long sessions.

Any feature that breaks one of these three needs a very good reason.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Shell | Tauri v2 (Rust) | Small binary, native webview, low footprint |
| Frontend | React + TypeScript | 90% of the work lives here |
| Build | Vite | Comes with the scaffold |
| Audio | Web Audio API (or Howler.js) | Playback + `AnalyserNode` for the visualizer |
| Visuals | Canvas / WebGL (GLSL) | Audio-reactive visualizer |
| Storage | Tauri filesystem/store plugin | Local settings, no server |
| Music | CC0 tracks (e.g. Open-Lofi) | Redistributable public-domain audio only |

No server backend for the MVP. All state is local.

---

## 3. Constraints (non-negotiable)

- **Music licensing:** Only **CC0 / public-domain** tracks may be bundled or served. Royalty-free-but-not-CC0 (e.g. Pixabay License) is **not** permitted, because serving files in a player = standalone redistribution, which those licenses restrict. Keep a provenance record per track (source, license, link).
- **No copyrighted/borrowed assets** for scenes, art, or audio. Generate or use CC0/owned content. (Consistent with the rest of the project's IP discipline.)
- **Offline-first:** core playback must work with no internet connection.
- **Resource ceiling:** avoid perpetually-decoding video backgrounds; prefer static scene + CSS effects or an efficient WebGL visualizer.

---

## 4. Phased Requirements (build in this order)

The phases are sequenced so a usable app exists as early as possible. **Do not start a later phase until the previous one works.**

### Phase 0 — Project Setup ✅ (done)
- [x] Scaffold Tauri + React + TS project
- [x] `npm run tauri dev` launches a window
- [x] Git repo initialized and pushed to GitHub
- [ ] Confirm `.gitignore` excludes `node_modules/`, `dist/`, `src-tauri/target/`
- [ ] Resolve any duplicate project folders (single source of truth)

### Phase 1 — MVP Core: "It plays music" 🎯
The minimum thing worth using. Ship this before anything pretty.

- [ ] Define `Track` type and `catalog.json` data model
- [ ] Load the CC0 track catalog into the app
- [ ] Audio engine: play a single track (play / pause)
- [ ] Transport controls: play, pause, next, previous
- [ ] Shuffle and repeat
- [ ] Progress bar (seek + elapsed/total time)
- [ ] Volume control
- [ ] Track list: browse and select a track
- [ ] "Now playing" info (title, artist)

**Definition of done for Phase 1:** you can open the app, pick a track, and it plays with working controls. No visualizer yet. No styling polish yet.

### Phase 2 — The Differentiator: visuals
What makes it *this* app and not a bare player.

- [ ] Central scene area (static cozy image to start — your own/CC0 art)
- [ ] Cozy visual theme: warm/muted palette, rounded panels, calm layout
- [ ] Audio-reactive visualizer: `AnalyserNode` → frequency data → WebGL/canvas
- [ ] (Optional) light CSS ambiance: subtle drift, glow, day/night tint
- [ ] Toggle between scene view and visualizer view

**Definition of done for Phase 2:** the app looks cozy and the visualizer reacts to the music.

### Phase 3 — Standalone Polish
The features that make it a real desktop app, not a web page in a window.

- [ ] Always-on-top **mini mode** (compact player)
- [ ] System tray icon + basic tray controls
- [ ] Global hotkeys (play/pause, next/prev) via Tauri plugin
- [ ] Persist settings locally (volume, last track, view preference)
- [ ] Persist favorites / recently played
- [ ] Autostart on boot (optional)

### Phase 4 — Cozy Extras (post-MVP, pick selectively)
Only after Phases 1–3 are solid. **Do not build all of these.**

- [ ] Ambient sound layering (rain, café, fire) with independent volume
- [ ] Pomodoro / study timer
- [ ] Animated / time-of-day-reactive scene
- [ ] Playlists (create, edit, custom art)
- [ ] Multiple visualizer styles / user-selectable

### Phase 5 — Stretch / "if it takes off" (needs a real backend)
These require server-side infrastructure and are explicitly out of MVP scope.

- [ ] Streaming library from a server (update music without app updates)
- [ ] User accounts / cross-device sync
- [ ] "Study together" shared listening rooms
- [ ] Generative / endless lofi
- [ ] Recognizable original character / brand tie-in

> If/when a real backend is needed, a .NET Web API is a reasonable choice and would put existing C#/.NET skills to use.

---

## 5. Functional Requirements Summary

| ID | Requirement | Phase |
|----|-------------|-------|
| F1 | Play/pause audio | 1 |
| F2 | Skip to next/previous track | 1 |
| F3 | Shuffle and repeat modes | 1 |
| F4 | Seek within a track | 1 |
| F5 | Adjust volume | 1 |
| F6 | Browse and select tracks from the library | 1 |
| F7 | Display current track info | 1 |
| F8 | Audio-reactive visualizer | 2 |
| F9 | Cozy themed UI | 2 |
| F10 | Always-on-top mini mode | 3 |
| F11 | Global hotkeys | 3 |
| F12 | Persist user settings & favorites locally | 3 |

## 6. Non-Functional Requirements

- **Performance:** idle CPU usage should stay low during continuous background playback; no fan spin-up from the visual layer.
- **Startup:** app should launch and be ready to play quickly.
- **Footprint:** keep the bundle and memory usage small (a core reason for choosing Tauri).
- **Offline:** all Phase 1–3 features function without internet.
- **Cross-platform (optional):** primary target Windows; Tauri allows Mac/Linux later, but do not spend MVP effort on multi-platform parity.

---

## 7. Data Model (starting point)

A `Track` and a catalog manifest. Example shape:

```json
{
  "tracks": [
    {
      "id": "amber-skies",
      "title": "Amber Skies",
      "artist": "Artist Name",
      "file": "audio/amber-skies.mp3",
      "duration": 208,
      "mood": "chill",
      "license": "CC0"
    }
  ]
}
```

Corresponding TypeScript type:

```ts
export interface Track {
  id: string;
  title: string;
  artist: string;
  file: string;      // path under public/audio or a URL
  duration: number;  // seconds
  mood?: string;
  license: "CC0";    // enforce clean licensing at the type level
}
```

---

## 8. Explicitly Out of Scope (for the MVP)

Listed on purpose, to prevent scope creep:

- No user accounts or authentication
- No cloud sync
- No server backend or database
- No streaming from external services (Spotify, YouTube, etc.)
- No music uploading by the user
- No social / multiplayer features
- No mobile build
- No monetization

These are not "never" — they are "not now." The MVP is a cozy, standalone player that plays a CC0 library beautifully. Everything else is earned by shipping that first.

---

## 9. Suggested Folder Structure

```
src/
├── components/
│   ├── Player/          # transport controls, track info
│   ├── Visualizer/      # canvas/WebGL + shaders
│   ├── Library/         # track list
│   └── MiniMode/        # compact always-on-top view
├── hooks/
│   ├── useAudioPlayer.ts    # playback state + controls (core)
│   └── useAudioAnalyser.ts  # AnalyserNode → frequency data
├── audio/
│   └── AudioEngine.ts   # Web Audio / Howler wrapper
├── data/
│   ├── catalog.json     # CC0 track manifest
│   └── tracks.ts        # types + loader
├── types/
├── styles/
├── App.tsx
└── main.tsx

src-tauri/               # Rust shell: window, tray, hotkeys (minimal)
public/audio/            # bundled CC0 tracks (mind repo size)
```

---

## 10. Definition of "Version 1.0 shipped"

- Plays the CC0 library with full transport controls
- Cozy themed UI with a working audio-reactive visualizer
- Always-on-top mini mode + tray + global hotkeys
- Settings and favorites persist between sessions
- Runs light enough to leave open all day
- Every bundled track is documented CC0

Ship that. Then decide what Phase 4/5 features actually earn their place.
