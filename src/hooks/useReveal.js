// src/hooks/useReveal.js  (replace the whole file)
import { useEffect, useRef, useState } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Returns [ref, visible].
// once = false (default): animates in every time you scroll to it, and resets when it leaves.
// once = true: animates in only the first time.
export const useReveal = (threshold = 0.15, once = false) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // people who prefer less motion just see everything
    if (reducedMotion()) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= threshold) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!entry.isIntersecting && !once) {
          setVisible(false); // fully out of view: reset so it can play again
        }
      },
      { threshold: [0, threshold], rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, visible];
};

const FROM = {
  up: "translate3d(0,48px,0)",
  down: "translate3d(0,-48px,0)",
  left: "translate3d(-56px,0,0)",
  right: "translate3d(56px,0,0)",
  zoom: "scale(0.94)",
  none: "none",
};

const SMOOTH = "cubic-bezier(0.33, 1, 0.68, 1)";

// reveal(visible, delay, from)  ->  from: "up" | "down" | "left" | "right" | "zoom" | "none"
// Slow, soft glide in (1.2s). Leaving is quicker and has no delay, so it resets cleanly.
export const reveal = (visible, delay = 0, from = "up") => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "none" : FROM[from] || FROM.up,
  transition: visible
    ? `opacity 1.2s ${SMOOTH} ${delay}s, transform 1.2s ${SMOOTH} ${delay}s`
    : `opacity 0.5s ease 0s, transform 0.5s ease 0s`,
  willChange: "opacity, transform",
});

// stagger(index) -> delay in seconds for cards in a row or grid
export const stagger = (index, base = 0.1, step = 0.14) => base + index * step;