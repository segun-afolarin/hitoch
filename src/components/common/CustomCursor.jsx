// src/components/common/CustomCursor.jsx
import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

const BLUE = "#00AEEF"; // brand blue
const BLUE_SOFT = "rgba(0,174,239,0.12)";

const RING = 36; // normal ring size (px)
const RING_HOVER = 68; // ring size over links and buttons (px)
const DOT = 8; // center dot size (px)
const FOLLOW = 0.08; // 0 to 1: lower = slower and smoother (was 0.16)

// anything matching this makes the ring expand
const INTERACTIVE =
  'a, button, [role="button"], summary, label[for], select, [data-cursor="hover"]';

// text fields keep the normal text cursor
const TEXT_FIELD = 'input:not([type="button"]):not([type="submit"]), textarea';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [overText, setOverText] = useState(false);

  // only on devices with a real mouse (not phones or tablets)
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const follow = reduceMotion ? 1 : FOLLOW;

    const mouse = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf;
    let first = true;

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // jump to the real position on the first move so it doesn't fly in
      if (first) {
        ring.x = mouse.x;
        ring.y = mouse.y;
        first = false;
      }

      setVisible(true);

      // dot sticks to the pointer exactly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px,${mouse.y}px,0)`;
      }
    };

    const onOver = (e) => {
      const target = e.target instanceof Element ? e.target : null;
      if (!target) return;
      setOverText(Boolean(target.closest(TEXT_FIELD)));
      setHovering(Boolean(target.closest(INTERACTIVE)));
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    // ring eases toward the pointer every frame (this is the smooth delay)
    const tick = () => {
      ring.x += (mouse.x - ring.x) * follow;
      ring.y += (mouse.y - ring.y) * follow;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px,${ring.y}px,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    // hide the system cursor everywhere except text fields
    document.documentElement.classList.add("has-custom-cursor");

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  const show = visible && !overText;
  const ringSize = hovering ? RING_HOVER : pressed ? RING * 0.8 : RING;

  return (
    <>
      {/* hides the system cursor while the custom one is active */}
      <style>{`
        html.has-custom-cursor,
        html.has-custom-cursor * { cursor: none !important; }
        html.has-custom-cursor input,
        html.has-custom-cursor textarea { cursor: text !important; }
      `}</style>

      {/* OUTER RING: follows with a delay, grows on links and buttons */}
      <Box
        ref={ringRef}
        aria-hidden="true"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: "translate(-50%, -50%)",
            width: ringSize,
            height: ringSize,
            borderRadius: "50%",
            boxSizing: "border-box",
            border: `1.5px solid ${BLUE}`,
            backgroundColor: hovering ? BLUE_SOFT : "transparent",
            // thin white halo keeps the ring visible on dark photos
            boxShadow: "0 0 0 1px rgba(255,255,255,0.55)",
            opacity: show ? 1 : 0,
            transition:
              "width 0.5s cubic-bezier(0.22,1,0.36,1), height 0.5s cubic-bezier(0.22,1,0.36,1), background-color 0.4s ease, opacity 0.3s ease",
          }}
        />
      </Box>

      {/* CENTER DOT: sticks to the pointer */}
      <Box
        ref={dotRef}
        aria-hidden="true"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10000,
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translate(-50%, -50%) scale(${hovering ? 0.6 : pressed ? 1.4 : 1})`,
            width: DOT,
            height: DOT,
            borderRadius: "50%",
            backgroundColor: BLUE,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.7)",
            opacity: show ? 1 : 0,
            transition: "transform 0.3s ease, opacity 0.3s ease",
          }}
        />
      </Box>
    </>
  );
};

export default CustomCursor;