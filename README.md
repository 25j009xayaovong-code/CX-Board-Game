# CX Board Game - Aggressive AI Edition

A modern, highly polished, arcade-grade web-based board game built with pure vanilla front-end web technologies (`HTML5`, `CSS3`, and `JavaScript`). This project features an aggressive, tactical artificial intelligence engine powered by a depth-scalable Alpha-Beta Minimax search tree, complete with arcade physics impact, rich customization properties, and native localization options.

---

## 🚀 Features

### ⚔️ Core Mechanics & Custom Engine Modifications
* **Alpha-Beta Minimax AI Engine:** Scalable depth calculations supporting **Easy** (Depth 1), **Intermediate** (Depth 3), and **Hard/Extreme Aggression** (Depth 5) configurations. 
* **Tactical Hunter Override System:** In Medium and Hard modes, the AI scans the board aggressively to force tactical eliminations, filtering candidate vectors to prioritize paths that safely evade counter-trap loops.
* **U-Turn Trajectory Lock:** Enforces a strict gameplay rule preventing any King or Queen unit from reversing direction $180^\circ$ on the exact same diagonal path to perform consecutive backtrack captures during a multi-jump combo turn.
* **Deterministic Single-Turn Undo Buffer:** Saves granular matrix snapshot histories allowing localized rollback steps for human players to recover from accidental click trajectories without restarting the active context match.

### 🎨 Visual & Aesthetic Configurations
* **Adaptive Theme Profiles:** On-the-fly toggling between a modern glass-morphic **Dark Mode** and a clean, accessible **Light Mode**.
* **Dynamic Board Skin Palettes:** Instantly switch between four customized canvas profiles:
  * 🟢 **Default:** Sleek Black and Forest Green design.
  * 🪵 **Classic:** Warm Antique Mahogany and Amber wood textures.
  * 🌌 **Cyber:** High-contrast Dark Indigo and Neon Cyan cyber-grid.
  * 👑 **Royal:** Regal Deep Crimson and Slate Gray layout.
* **Geometric Piece Patterns:** Toggle units among distinct aesthetic layouts: **Solid Glow**, **Holographic Ring**, and **Cyber Stripes**.
* **RGB Spectrum Customizers:** In-app color pickers map custom hex color values directly into CSS root variables, allowing complete color redesigns for Player 1 and Player 2 units on-the-fly.

### 🎮 Sound Effects & Cinematic Polish
* **Synthesized Web Audio API Node Generation:** Fully native, procedurally generated audio waves requiring no external asset downloads. Distinct tones are outputted dynamically for piece selections, standard relocations, unit eliminations, and King promotion milestones.
* **Immersive Game Alerts:** Features distinct ending musical motifs for victory maps and catastrophic defeat states, completely replacing unstyled browser pop-ups.
* **Rumble Screenshake & Explosion Visual FX:** Eliminating an enemy piece triggers a local canvas shockwave rumble along with explosion particle animations injected directly into the target element node.

### 🌐 Native Multi-Language Translation
The global UI is completely abstracted through dynamic key-value dictionary bindings. Localization toggles translate all titles, status trackers, setup buttons, combat notices, and terminal feeds seamlessly into five languages:
* 🇺🇸 English
* 🇯🇵 日本語 (Japanese)
* 🇹🇭 ไทย (Thai)
* 🇻🇳 Tiếng Việt (Vietnamese)
* 🇲🇲 မြန်မာဘာသာ (Burmese)

---

## 📂 Project Architecture

For maximum maintainability and modular formatting, the code structure is split cleanly into three decoupled web assets:

```text
├── index.html       # Structural layout, data attributes, and localization nodes
├── style.css        # Glass-morphic design definitions, light/dark hooks, and animations
└── app.js           # Matrix validation state, Minimax algorithm logic, and audio processors
