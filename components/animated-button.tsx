"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(({ children, ...props }, ref) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button ref={ref} {...props}>
        {children}
      </Button>
    </motion.div>
  );
});

AnimatedButton.displayName = "AnimatedButton";

