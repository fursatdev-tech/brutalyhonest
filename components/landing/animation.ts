import { easeIn } from "framer-motion";
import { cubicBezier } from "framer-motion/dom";

export const imageTransition = {
  duration: 1,
  ease: cubicBezier(0.2, 0.8, 0.2, 1),
};

export const headingTransition = {
  duration: 0.75,
  ease: [0.33, 1, 0.68, 1],
};

export const imageAnimation = {
  initial: {
    opacity: 0,
    x: "400px",
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      ...imageTransition,
      delay: 0.9,
    },
  },
  exit: {
    opacity: 0,
    x: "-400px",
  },
};

export const h1Animation = {
  initial: {
    y: "-100%",
  },
  enter: (i: number) => ({
    y: "0",
    transition: {
      ...headingTransition,
      delay: 0.5 + i * 0.1,
    },
  }),
};

export const h2Animation = {
  initial: {
    y: "100%",
  },
  enter: (i: number) => ({
    y: "0",
    transition: {
      duration: 0.75,
      ease: [0.33, 1, 0.68, 1],
      delay: i,
    },
  }),
};

export const fadeInAnimation = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: easeIn,
    },
  },
};
