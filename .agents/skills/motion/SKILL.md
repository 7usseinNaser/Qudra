---
name: motion
description: Declarative animation and gesture library for React and web interfaces (formerly Framer Motion). Use for fluid spring animations, layout transitions, exit/enter presence, micro-interactions, and 60fps gesture feedback.
---

# Motion - React Animation & Micro-Interactions

Motion (formerly Framer Motion) is the production-standard animation library for React web applications.

## When to Use in QUDRA

- **Micro-Interactions**: Subtle button presses, card hover elevations, stepper step transitions, and tag status changes.
- **Data Visualizations**: Donut chart entries, radar/DNA polygon morphs, timeline node animations.
- **Page & View Transitions**: Smooth fading and slide-ins between problem steps and candidate comparisons without layout jank.
- **Mobile Drawer & BottomNav Transitions**: Native-feeling spring physics for overlays, toasts, and mobile navigation items.

## Golden Rules for QUDRA Refinement

1. **Keep it Subtly Premium**: Animations must feel snappy (150ms–300ms) and purposeful. Never distract from content.
2. **Spring Physics over Linear**: Use spring dynamics with damping (`damping: 25, stiffness: 300`) for natural tactile response.
3. **Hardware-Accelerated**: Only animate `transform` (scale, x, y) and `opacity`. Avoid animating width/height or top/left directly.
4. **Respect Reduced Motion**: Always respect user preferences with `useReducedMotion()`.

## Common Snippets

```tsx
import { motion, AnimatePresence } from 'motion/react';

// 1. Subtle Card Appearance
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
  className="card"
>
  {content}
</motion.div>

// 2. Micro-Interaction on Hover & Tap
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  className="btn"
>
  تأكيد
</motion.button>

// 3. Dynamic Height/Layout Changes
<motion.div layout transition={{ duration: 0.2 }}>
  {children}
</motion.div>
```
