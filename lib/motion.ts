import type { Transition, Variants } from "framer-motion";

export const MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

export const viewportDefaults = {
  once: true,
  amount: 0.25
} as const;

const easeOut = [0.22, 1, 0.36, 1] as const;

export const transitionDefaults: Transition = {
  duration: 0.48,
  ease: easeOut
};

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 22
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionDefaults
  }
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.42,
      ease: easeOut
    }
  }
};

export const slideLeft: Variants = {
  hidden: {
    opacity: 0,
    x: 30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitionDefaults
  }
};

export const slideRight: Variants = {
  hidden: {
    opacity: 0,
    x: -30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitionDefaults
  }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06
    }
  }
};

export const stagger = staggerContainer;

export const hoverCard: Variants = {
  rest: {
    y: 0,
    scale: 1,
    transition: {
      duration: 0.24,
      ease: "easeOut"
    }
  },
  hover: {
    y: -6,
    scale: 1.01,
    transition: {
      duration: 0.24,
      ease: "easeOut"
    }
  }
};

export const hoverButton: Variants = {
  rest: {
    y: 0,
    scale: 1,
    transition: {
      duration: 0.22,
      ease: "easeOut"
    }
  },
  hover: {
    y: -2,
    scale: 1.015,
    transition: {
      duration: 0.22,
      ease: "easeOut"
    }
  }
};

export function shouldReduceMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(MOTION_MEDIA_QUERY).matches;
}
