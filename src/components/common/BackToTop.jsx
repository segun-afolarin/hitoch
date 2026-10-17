// src/components/common/BackToTop.jsx
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const BLUE = "#00AEEF";

// Square blue button that glides in after you scroll down
const BackToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <IconButton
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      sx={{
        position: "fixed",
        right: { xs: 16, md: 28 },
        bottom: { xs: 16, md: 28 },
        zIndex: 1300,
        width: 48,
        height: 48,
        borderRadius: 0,
        backgroundColor: BLUE,
        color: "#fff",
        opacity: show ? 1 : 0,
        visibility: show ? "visible" : "hidden",
        transform: show ? "translateY(0)" : "translateY(16px)",
        transition:
          "opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1), visibility 0.4s, background-color 0.3s ease",
        "&:hover": { backgroundColor: "#0095cc", transform: "translateY(-4px)" },
        "&:focus-visible": { outline: `2px solid ${BLUE}`, outlineOffset: 3 },
      }}
    >
      <KeyboardArrowUpIcon sx={{ fontSize: 28, color: "#fff" }} />
    </IconButton>
  );
};

export default BackToTop;