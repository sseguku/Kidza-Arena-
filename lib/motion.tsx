"use client";

import {
  motion,
  type HTMLMotionProps,
  type Transition,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";

/** Kidza Arena motion presets — fun, energetic, approachable */

export const transitions = {
  bounce: { type: "spring", stiffness: 400, damping: 20 } satisfies Transition,
  smooth: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } satisfies Transition,
  playful: { type: "spring", stiffness: 300, damping: 15 } satisfies Transition,
} as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transitions.smooth },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.smooth },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: transitions.bounce },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: transitions.smooth },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

/** Playful hover tap for interactive cards and buttons */
export const tapScale = {
  whileTap: { scale: 0.97 },
  whileHover: { scale: 1.02 },
  transition: transitions.playful,
};

type MotionDivProps = HTMLMotionProps<"div">;
type MotionListProps = HTMLMotionProps<"ul">;
type MotionItemProps = HTMLMotionProps<"li">;

export function MotionDiv({ className, ...props }: MotionDivProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="visible"
      {...props}
    />
  );
}

export function MotionSection({ className, ...props }: MotionDivProps) {
  return (
    <motion.section
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      {...props}
    />
  );
}

export function MotionList({ className, ...props }: MotionListProps) {
  return (
    <motion.ul
      className={cn(className)}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      {...props}
    />
  );
}

export function MotionItem({ className, ...props }: MotionItemProps) {
  return (
    <motion.li className={cn(className)} variants={fadeInUp} {...props} />
  );
}

export { motion, type Variants, type Transition };
