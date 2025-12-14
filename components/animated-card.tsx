"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode;
  delay?: number;
}

/**
 * AnimatedCard wraps shadcn Card with Framer Motion entrance animations
 */
export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay,
          ease: "easeOut",
        }}
        whileHover={{ y: -4 }}
      >
        <Card {...props}>{children}</Card>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition wraps page content with entrance animations
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
