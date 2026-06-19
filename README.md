# 🎮 CX Board Game: Hunter AI Edition

A futuristic, highly responsive cyber-themed **10x10 Checkers (Drafts)** variant written in pure JavaScript, HTML5, and CSS3. The game features an aggressive custom Minimax adversarial algorithm ("Hunter AI Override"), multiple local match variants, fully custom cosmetics, and native multilingual localization support.

---

## 🚀 Features

### 🧠 Aggressive "Hunter Override" AI

* Powered by a advanced **Minimax search tree algorithm** utilizing Alpha-Beta pruning to maximize efficiency.
* **Three Difficulty Levels:**
* **Easy:** Depth 1 search pool with normalized randomized weighting.
* **Intermediate:** Depth 3 depth scanning featuring safe-jump assessment frameworks.
* **Hard (Extreme Aggression):** Depth 5 intensive search pool looking steps ahead to trap your units.



### ⚙️ Distinct Mechanics & Hardcore Rules

* **10x10 Board Matrix:** Expanded traditional board configuration ($10 \times 10$) instead of the traditional $8 \times 8$ framework.
* **Anti-Cowardice Rule Override:** If a promoted **King** opts out of an active capture line to play safe, the engine triggers a forced validation check and instantly destroys the offending piece!
* **Turn Timer & Blitz Rules:** Players have a strict 10-second window per turn. Clocking out 3 times results in an instant structural forfeit.

### 🎨 Fully Customizable UI/UX

* **Four Integrated Themes:** Quickly cycle layout skins among Default (Cyber Green), Classic (Warm Mahogany), Cyber (Neon Cyan), and Royal (Deep Crimson).
* **Custom Unit Palette Pickers:** Dynamically recalculates color variables and glows in real-time using CSS root hex manipulations.
* **Dynamic Visual Audio Matrix:** Procedural sound effect rendering generated programmatically using the browser's native `AudioContext` (no external `.mp3` loading required).

### 🌐 Native Multilingual Core

Includes seamless localization swaps on the fly for 5 languages:

* English (EN), Japanese (日本語), Thai (ไทย), Vietnamese (VI), and Burmese (မြန်မာ).

---

## 📂 File Architecture

The game is built with a lightweight, dependency-free architecture:

```bash
├── index.html       # DOM node architecture, multi-screen wrappers, and localization elements
├── style.css        # Glassmorphic UI frameworks, animations, and aesthetic custom properties
└── app.js           # Minimax engine, game state tracking, AudioContext synth, and logic loops

```

---

## 🛠️ Installation & Execution

Since the game relies solely on native web technologies, no builders, package installations, or servers are required.

1. Clone or download the files into a uniform local directory.
2. Launch the framework by double-clicking **`index.html`** or serving it via a local extension like Live Server.

---

## 🕹️ Technical Specifications Reference

### Deep Logic State Engine

The application state tracks active coordinates, board configurations, and timers using a single state engine wrapper:

```javascript
let state = {
    board: [],              // 10x10 matrix reference array
    turn: 'blue',           // Active turn indicator ('blue' vs 'red')
    mode: 'pvp',            // Mode state ('pvp' or 'npc')
    diff: 'easy',           // Minimax depth setting ('easy', 'medium', 'hard')
    timeLeft: 10,           // Per-turn countdown value
    missedCount: { blue: 0, red: 0 } // Tracks timeout violations per side
};

```

### Heuristic Board Matrix Evaluation

Position scores inside the custom AI matrix look for individual weight states and favor edge containment to lock down positional control over human targets:

$$\text{Piece Value} = \begin{cases} 30 & \text{if King} \\ 10 + (\text{Row Position} \times 0.5) & \text{if Regular Piece} \end{cases}$$

$$\text{Boundary Bonus} = +2.0 \text{ score points if occupying an outer edge square.}$$

---

## 📜 License

This system is open-source and ready for customization. Pull requests, custom algorithms, and layout additions are always welcome!