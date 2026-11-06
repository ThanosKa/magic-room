# Design system

The look is defined once in `app/globals.css` (tokens mapped into Tailwind) and `app/motion.css` (keyframes, reveal-on-scroll, compare slider). The site has one light theme.

## Tokens

- Use the token utilities: `bg-paper`, `bg-paper-2`, `text-ink`, `text-ink-2`, `text-ink-3`, `border-line`, `bg-night`, `text-cream`, `text-cream-2`, `accent` (purple), plus the shadcn names (`bg-background`, `text-muted-foreground`, `border-border`, ...).
- No raw `slate-*`, `gray-*` or `purple-*` classes and no `dark:` classes.
- Headlines use `font-serif` (Instrument Serif); body stays Geist (`font-sans`).
- Purple (`accent`) is for small accents only: focus ring, dots, credit pill, timers, small highlights.
- Primary buttons are ink (`<Button>`); on night bands use `<Button variant="cream">`.
- Use Tailwind utilities first, shadcn/ui primitives from `components/ui/`, and mobile-first breakpoints (`sm:`, `md:`, `lg:`). Custom CSS goes in the two files above.

## Interaction

- Hover styles apply only on `(hover: hover) and (pointer: fine)`; this is built into `hover:` here.
- Buttons and pressable cards scale on `:active` (`active:scale-[0.97]`; `<Button>` already has it).
- Every interactive element keeps a visible focus ring.
- Every animation has a `prefers-reduced-motion` fallback (`motion-reduce:`, or the block in `app/motion.css`).
- Server HTML ships visible. Hide content for an entrance only from the client, the way `useReveal` adds `.reveal-ready`: an `opacity-0` page fade once blanked every navigation.

## Animation

CSS by default. Motion (the `motion` / framer-motion library) only where CSS can't do it well: drag or swipe with physics (springs, momentum, snap back), exit animations (an element that must animate before it is removed), layout animations (items sliding to new positions when a list reorders or filters), and shared-element transitions (a thumbnail growing into full screen). Everything else (hover, press, fades, scroll reveals, menus and dialogs opening, image wipes, spinners) is CSS.

The library is not installed today, so all motion in the repo is CSS; adding it needs the owner's approval like any dependency.
