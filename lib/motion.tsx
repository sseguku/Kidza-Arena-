"use client";

import {
  motion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

type MotionDivProps = HTMLMotionProps<"div">;

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

export { motion, type Variants };
