// src/components/common/ScrollProgress.jsx
import { useEffect, useRef } from "react";
import { Box } from "@mui/material";

const BLUE = "#00AEEF";

// Thin blue bar at the very top that fills as you scroll
const ScrollProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 1400,
        pointerEvents: "none",
      }}
    >
      <Box
        ref={barRef}
        sx={{
          height: "100%",
          backgroundColor: BLUE,
          transform: "scaleX(0)",
          transformOrigin: "left center",
          willChange: "transform",
        }}
      />
    </Box>
  );
};

export default ScrollProgress;