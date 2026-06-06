import { useMotionValue, useSpring, useTransform } from "motion/react";

export function useTilt(strength = 14) {
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  const rotateY = useSpring(useTransform(rawX, [0, 1], [-strength, strength]), {
    stiffness: 350,
    damping: 35,
  });
  const rotateX = useSpring(useTransform(rawY, [0, 1], [strength, -strength]), {
    stiffness: 350,
    damping: 35,
  });

  const glareX = useTransform(rawX, [0, 1], ["-30%", "130%"]);
  const glareY = useTransform(rawY, [0, 1], ["-30%", "130%"]);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width);
    rawY.set((e.clientY - rect.top) / rect.height);
  };

  const onMouseLeave = () => {
    rawX.set(0.5);
    rawY.set(0.5);
  };

  return { rotateX, rotateY, glareX, glareY, onMouseMove, onMouseLeave };
}
