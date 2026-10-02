import React from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Plain wrapper. It used to fade in from opacity 0 on mount, but the server
 * HTML shipped `style="opacity:0"`, so every navigation (and every hard load)
 * blanked the page body for ~0.4s while the header/footer stayed visible,
 * which read as a flash. Kept as a component so call sites don't change.
 */
export function PageTransition({ children }: PageTransitionProps) {
  return <div>{children}</div>;
}
