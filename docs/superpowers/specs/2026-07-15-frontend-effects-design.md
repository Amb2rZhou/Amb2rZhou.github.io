# Frontend Effects & Interactions — Design

Date: 2026-07-15 · Status: Approved

## Goal

Add polish and one memorable interaction to amb2r.top without hurting performance,
China accessibility, or the professional tone. No frameworks, no CDN additions.

## Principles

- All new interaction code lives in a new `effects.js`, loaded after `script.js`
  (uses its globals: `translations`, `currentLang`, `toggleLang`, `sendMessage`, `_t`, `isCleanMode`).
- Everything respects `prefers-reduced-motion: reduce` (static fallbacks).
- Pointer-dependent effects (glow, tilt, magnetic, particle disturbance) gated on `pointer: fine`.
- Particles disabled at viewport ≤768px; canvas paused via IntersectionObserver when hero off-screen.
- Bilingual: new UI strings go through the existing i18n system; `setLang` dispatches a
  `langchanged` CustomEvent that effects.js listens to (typewriter word swap, count-up re-scan).

## Components

### A. Micro-interactions
1. **Typewriter** — new `.hero-roles` line under the hero name cycling role words
   (EN/ZH word lists, restart on language switch).
2. **Count-up** — timeline numbers (250, 100, 20, 75, 10) wrapped in `<span data-countup>`;
   animate 0→target on first intersection; re-scan after each `setLang` (innerHTML is replaced).
3. **Card glow** — `.project-card` / `.about-card` get a cursor-following radial gradient
   overlay (`--mx`/`--my` CSS vars set on pointermove, delegated listener).
4. **Timeline growth** — accent-colored `::after` overlay on the timeline spine, height driven
   by scroll progress (`--tl-progress`); dots muted by default (only when JS adds `.tl-animated`),
   lit as they pass 65% viewport height.
5. **Stagger** — existing `.fade-in` elements get per-sibling `transition-delay` (cleared on
   `transitionend` so hover transforms aren't delayed); magnetic hover on `.hero-btn`.

### B. Particle neural network
- Canvas absolutely positioned behind hero content. ~50–70 nodes (scaled by area),
  lines drawn under 130px distance, mouse repulsion. Colors read from `--accent`
  (MutationObserver on `data-theme` re-reads on theme switch). DPR capped at 2.

### C. Command palette
- `⌘K` / `Ctrl+K` / `/` opens a Spotlight-style overlay; Esc or backdrop click closes.
- Commands (bilingual labels): jump to sections, open Insights page (hidden in clean mode),
  toggle theme, switch language, open chat, GitHub/LinkedIn.
- Any free text renders an "Ask AI: '…'" row → opens the chat widget, fills the input,
  calls `sendMessage()`.
- Discovery: `⌘K` badge button in desktop nav and mobile controls (tap to open on mobile).

### D. Easter eggs
- **Avatar tilt** — 3D rotateX/rotateY following cursor over the hero avatar.
- **Footer terminal** — `amber@web:~$` line typing `whoami` etc.; click cycles through
  a small script list (`ls ~/projects`, `fortune`, `sudo hire amber`).

## Explicitly unchanged

Clean mode (`?ref=t`) behavior, chatbot logic, analytics, i18n mechanism, themes.

## Verification

Local `python3 -m http.server` + headless browser: console-error check, screenshots in
light/dark and mobile width; then deploy and spot-check live.
