# EnvisionStudio Design System Specification

**Version:** 1.0.0  
**Status:** Approved for Implementation  
**Reference Origin:** Studio Visual Language Analysis & Modern Brutalist Editorial Aesthetics  

---

## 1. Visual Identity & Brand Philosophy

**EnvisionStudio** combines high-end Swiss editorial typography, motion-blur long-exposure imagery, and precision brutalist framing. The layout abandons generic centered card-grids in favor of:
- **Asymmetric Canvas Framing:** The entire viewport sits inside an ambient red-to-black vertical gradient backdrop (`#C1272D` to `#0A0A0A`), within which the site rests as a rounded container canvas (`rounded-[28px]`).
- **Rhythmic Contrast:** Alternating stark white (`#FFFFFF`) and deep black (`#0B0B0B`) sections connected by delicate 1px dotted dividers.
- **Editorial Headline Treatment:** High-contrast Grotesk headlines where key closing phrases smoothly transition into soft mid-grey (`#9A9A9A`).
- **Signature Accent Red:** A single vivid scarlet `#E5322B` used with disciplined restraint for indicators, badges, dotted accents, and primary actions—strictly avoiding generic purple/blue gradients.

---

## 2. Color Palette & Semantic Tokens

```
/* Canvas Frame & Atmosphere */
--color-bg-backdrop-top:    #C1272D;  /* Ambient crimson glow at top of viewport */
--color-bg-backdrop-bottom: #0A0A0A;  /* Deep obsidian fade */
--color-canvas-light:       #FFFFFF;  /* Crisp editorial paper */
--color-canvas-dark:        #0B0B0B;  /* Deep black canvas */
--color-card-dark:          #121212;  /* Hero card & dark surface cards */
--color-card-subtle:        #1A1A1A;  /* Elevated cards / interactive hover */

/* Primary Brand Accent */
--color-accent-red:         #E5322B;  /* Signature brand red */
--color-accent-red-hover:   #CF251F;  /* Hover state */
--color-accent-red-glow:    rgba(229, 50, 43, 0.25);

/* Typography & Neutrals */
--color-text-primary-dark:  #0B0B0B;  /* Black text on light sections */
--color-text-primary-light: #FFFFFF;  /* White text on dark sections */
--color-text-headline-grey: #9A9A9A;  /* Gray word fade trick in large statements */
--color-text-muted:         #6E6E73;  /* Sub-labels & secondary copy */
--color-text-faint:         #A1A1AA;  /* Form labels, placeholder text */

/* Dividers & Borders */
--color-divider-dotted-light: rgba(229, 50, 43, 0.4); /* Red dotted lines on light sections */
--color-divider-dotted-dark:  rgba(255, 255, 255, 0.15); /* Subdued dotted lines on dark sections */
--color-border-subtle:        rgba(255, 255, 255, 0.08);

/* Status Badges */
--color-status-active-bg:   rgba(229, 50, 43, 0.12);
--color-status-active-fg:   #E5322B;
--color-status-completed-bg:rgba(16, 185, 129, 0.12);
--color-status-completed-fg:#10B981;
--color-status-onhold-bg:   rgba(245, 158, 11, 0.12);
--color-status-onhold-fg:   #F59E0B;
```

---

## 3. Typography Scale & Hierarchy

- **Primary Typeface:** `Geist` / `Satoshi` / `General Sans` (Modern grotesque sans with tight letter-spacing, optical kerning, and medium/bold weights). *Inter and Roboto are explicitly forbidden.*
- **Monospace Typeface:** `JetBrains Mono` (Dedicated strictly to numeric counters, project IDs, timestamps, and technical tags).

### Type Hierarchy
| Level | Font Size | Line Height | Tracking | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display H1** | `clamp(52px, 6.5vw, 108px)` | `0.96` | `-0.035em` | `600 / SemiBold` | Hero headline |
| **Section H2** | `clamp(36px, 4.5vw, 68px)` | `1.02` | `-0.03em` | `600 / SemiBold` | "Who we are", "Our Services" |
| **Headline Trick Text**| `clamp(36px, 4.5vw, 68px)` | `1.02` | `-0.03em` | `500` (ends in `#9A9A9A`) | Statement emphasis |
| **Stat Numerals** | `clamp(48px, 5.5vw, 84px)` | `0.95` | `-0.03em` | `700 / Bold` | "1%", "30+", "100%", "8+" |
| **H3 / Card Title** | `22px - 28px` | `1.15` | `-0.02em` | `600 / SemiBold` | Project titles, modal headings |
| **Body Large** | `17px - 19px` | `1.45` | `-0.01em` | `400 / Regular` | Hero summary copy |
| **Body Standard** | `14px - 15px` | `1.5` | `0` | `400 / Regular` | Dashboard copy, descriptions |
| **Section Tag / Label** | `11px - 12px` | `1.0` | `+0.12em` | `700 / Bold` (UPPERCASE) | Red square + section titles |
| **Monospace Meta** | `11px - 13px` | `1.2` | `+0.02em` | `500 / Medium` | `PRJ-001`, dates, counts |

---

## 4. Spacing, Geometry & Radii

### Corner Radii
- **Viewport Canvas Container:** `28px` (Mobile: `18px`) with outer gradient padding (`12px` mobile, `24px` desktop).
- **Hero Card:** `24px` with overflow hidden.
- **Motion-blur Image Cards:** `20px`.
- **Standard Cards & Modals:** `16px`.
- **Action Buttons & Nav Pills:** `9999px` (`rounded-full`).
- **Section Indicator Square:** `4px` (`w-2.5 h-2.5` red square).

### Spacing & Grid System
- **12-Column Asymmetric Fluid Grid** (`max-w-[1440px]` content boundary).
- **Section Vertical Rhythm:** `py-20` to `py-32` (`80px` to `128px`).
- **Separators:** 1px dotted horizontal lines (`border-t border-dotted`).

---

## 5. Signature Component Specifications

### 5.1 Floating Navbar
- **Structure:** 3-part layout: Left brand mark, Center navigation pill, Right action pill.
- **Brand Mark:** Custom 9-cell red square cluster glyph + `EnvisionStudio` text in tight grotesque.
- **Center Pill:** Floating dark frosted pill (`backdrop-blur-md bg-black/60 border border-white/10 px-6 py-2.5 rounded-full`).
  - Active links: `Home`, `Studio`, `Work` (with inline badge `[25]`), `Careers`, `Blog`, `Contact`.
- **Right Action Pill:** Crisp white pill button `Book A Intro ↗` with circular avatar icon on the left.

### 5.2 Section Tags
- Composed of a solid `#E5322B` rounded square (`size-2.5 rounded-[2px]`) followed by uppercase mono/grotesk label with wide letter-spacing (e.g., `■ NEXT-GEN DESIGN AGENCY`, `■ WHO WE ARE`, `■ BY THE NUMBERS`, `■ SERVICES`).

### 5.3 Buttons
- **Primary Pill (Red):** Background `#E5322B`, text `#FFFFFF`, rounded full, with trailing arrow `↗` that animates on hover.
- **Secondary Pill (White):** Background `#FFFFFF`, text `#0B0B0B`, rounded full.
- **Ghost Pill:** Border 1px white/20, text white, transparent background.
- **Magnetic Micro-interaction:** Subtly follows cursor within a 20px radius.

### 5.4 Draggable Motion-Blur Image Strip
- Horizontally flowing cards (aspect ratio ~ 3:4 portrait, height `440px - 520px`).
- Styling: Long-exposure, motion-blurred duotone lighting (neon red, warm tungsten, ethereal motion blur).
- Drag behavior: Pointer-driven horizontal inertia scroll with GSAP draggable/custom smooth drag + ScrollTrigger subtle parallax.

### 5.5 Interactive Services List
- Numbered index `[01]` through `[05]` in JetBrains Mono.
- Large title in Sans (`Branding`, `UI/UX Design`, `Web Development`, `Mobile Apps`, `Growth & SEO`).
- Row separated by dotted dividers.
- On mouseenter/mousemove: An animated floating preview thumbnail emerges and follows cursor coordinates with spring physics.

### 5.6 Project Management Dashboard UI
- **Shell:** Floating slim left rail on desktop (icons + active indicator), bottom navigation bar on mobile.
- **Theme:** Obsidian dark theme (`#0B0B0B`) with crisp white "paper" cards for featured metrics.
- **Interactive Three.js Constellation:** Real-time 3D orbital node visualization of live projects with status colors and task weight.
- **Project Table/Grid:** Status filter pill tabs with live count badges, search, slide-over drawer for Create/Edit project, and animated task checkboxes with strike-through.

---

## 6. Motion & Micro-interactions
- **Lenis Smooth Scroll:** Natural inertia scrolling configured for 1.2 duration with smooth touch response.
- **Page Entrance Timeline:** Navbar descends from `-40px`, hero headline reveals line-by-line via masked clip-path split, followed by secondary copy and buttons stagger.
- **Headline Scroll Reveal:** The statement words in the "Who we are" section transition from grey to solid black as they scroll through the viewport center.
- **Three.js Shader Hero:** A smooth GLSL fragment shader displaying dark flowing fluid noise with streaks of red and white light reacting smoothly to mouse velocity. Capped at `dpr: 2`, with automatic pause on scroll out-of-view and static fallback for reduced-motion.
- **Reduced Motion:** All GSAP timelines respect `window.matchMedia("(prefers-reduced-motion: reduce)")`.

