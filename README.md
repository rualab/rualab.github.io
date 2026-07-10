# Ruâ — Art & Design Studio

**Portfolio site with a WebGL/GLSL landing, two-column navigation, and scroll-driven transitions.**

[rua.studio](https://rua.studio) · Mexico City

---

## About this project

Built in **vanilla HTML / CSS / JS**, with a **GLSL caustics shader rendered in WebGL** on the landing and a flexible, scroll-driven navigation system built on `IntersectionObserver`. No frameworks, no build tools — every interaction, shader, and transition is hand-written.

No external rendering dependencies — the shader, layout, and interactions all run on raw WebGL and JS.

## Technical highlights

**Landing — GLSL caustics shader**
A caustics-like light pattern generated in real time in the fragment shader, no textures or video involved — it's procedural math running on the GPU via WebGL.

**Two-column, scroll-driven navigation**
Fixed left column with a project index, right column with independent scroll. The active panel switch is triggered by `IntersectionObserver`, no external scroll libraries.

**Zero build step**
The entire site runs by opening `index.html` directly — zero config, zero npm dependencies for production.

## Stack

- **WebGL + GLSL** — caustics shader on the landing
- **Vanilla JavaScript** — interactions, keyboard nav, `IntersectionObserver`
- **CSS** — two-column layout, responsive design
- No frameworks, no build tools

## Structure

```
rua-studio/
├── index.html   ← structure and content
├── style.css    ← design and layout
├── main.js      ← WebGL shader, interactions, keyboard navigation
└── img/         ← visual assets for each project
```

## Running it locally

```bash
cd rua-studio
python3 -m http.server 8000
# open http://localhost:8000
```

Or just open `index.html` in the browser — no install required.

## About Ruâ

Ruâ is an independent art and design studio based in Mexico City, working at the intersection of graphic design, creative programming, and audiovisual art. The studio's work spans visual identity systems for cultural institutions and festivals, with clients including Eastern Bloc (Montréal), Universidad Veracruzana, Concordia University / Milieux Institute, and TOPO Montréal.

Its founder also works as an audiovisual artist under the name **ocsalev** — live coding, generative visuals, and live synthesis — which is why the code behind this site isn't just functional, but an extension of that practice: hand-written shaders, generative systems, and interaction treated as design material.

---

**Contact:** [rua.studio](https://rua.studio)
