import { useEffect, useId, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  SvgIcon,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion, useInView, useSpring } from "framer-motion";

const ROTATION_MS = 9000;
const EASE = [0.22, 1, 0.36, 1];

function ArrowIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function StudentArtwork({ primary, secondary, primaryDark }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <Box
      component="svg"
      viewBox="0 0 520 400"
      aria-hidden="true"
      focusable="false"
      sx={{
        display: "block",
        width: "100%",
        height: "auto",
      }}
    >
      <defs>
        <linearGradient
          id={`${id}-shirt`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={primaryDark} />
        </linearGradient>

        <linearGradient
          id={`${id}-halo`}
          x1="0"
          y1="0"
          x2="0.7"
          y2="1"
        >
          <stop offset="0%" stopColor={primary} stopOpacity="0.12" />
          <stop offset="100%" stopColor={primary} stopOpacity="0.025" />
        </linearGradient>
      </defs>

      {/* Globe */}
      <circle
        cx="270"
        cy="198"
        r="158"
        fill={`url(#${id}-halo)`}
      />

      <g
        fill="none"
        stroke={primary}
        strokeOpacity="0.16"
        strokeWidth="1.2"
      >
        <circle cx="270" cy="198" r="139" />
        <ellipse cx="270" cy="198" rx="77" ry="139" />
        <ellipse cx="270" cy="198" rx="139" ry="50" />
        <path d="M131 198h278M270 59v278" />
      </g>

      {/* Travel arc */}
      <path
        d="M75 238C24 136 143 50 284 52c116 1 198 73 170 165"
        fill="none"
        stroke={primary}
        strokeOpacity="0.3"
        strokeWidth="1.5"
        strokeDasharray="4 7"
        strokeLinecap="round"
      />

      <circle cx="81" cy="244" r="5" fill={secondary} />

      <circle
        cx="435"
        cy="275"
        r="8"
        fill="none"
        stroke={primary}
        strokeOpacity="0.45"
        strokeWidth="2"
      />

      <path
        d="M110 89v14m-7-7h14"
        stroke={secondary}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Ground shadow */}
      <ellipse
        cx="266"
        cy="366"
        rx="115"
        ry="11"
        fill={primary}
        fillOpacity="0.09"
      />

      <ellipse
        cx="266"
        cy="366"
        rx="76"
        ry="5"
        fill={primary}
        fillOpacity="0.08"
      />

      {/* Floating paper plane */}
      <g transform="translate(426 94)">
        <g className="welcome-float">
          <circle
            r="30"
            fill="#FFFFFF"
            stroke={primary}
            strokeOpacity="0.16"
          />

          <path
            d="m-15 3 30-15-9 29-7-11-14-3Zm14 3L15-12"
            fill={primary}
            fillOpacity="0.1"
            stroke={primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>

      <g transform="translate(36 10) scale(1.05)">
        {/* Waving arm */}
        <g className="welcome-wave">
          <path
            d="M266 192Q286 214 300 190L319 139 300 130 277 173Z"
            fill="#B77853"
          />

          <path
            d="
              M300 139 292 122
              Q284 112 289 108
              Q293 105 299 112
              L302 116 298 90
              Q297 83 302 83
              Q307 82 308 88
              L312 108 312 78
              Q312 71 318 72
              Q323 72 322 79
              L322 106 328 82
              Q330 76 335 79
              Q339 81 337 87
              L331 112 339 94
              Q342 89 346 92
              Q350 94 347 100
              L338 123
              Q331 140 319 146Z
            "
            fill="#C98D65"
          />

          <path
            d="M305 120q12-6 18 4"
            fill="none"
            stroke="#9B5D40"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M244 184Q259 171 273 181L289 199 267 222 248 207Z"
            fill={primary}
          />

          <path
            d="m271 196 10 11"
            stroke={primaryDark}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* Shirt */}
        <path
          d="
            M157 184
            Q173 173 190 170H229
            Q254 173 268 190
            L276 329
            Q213 344 145 329
            L145 228 130 220
            Q140 195 157 184Z
          "
          fill={`url(#${id}-shirt)`}
        />

        <path
          d="m159 207-7 97M253 227l6 91"
          fill="none"
          stroke={primaryDark}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Neck and collar */}
        <path
          d="M196 148h29v28q-14 20-29 0Z"
          fill="#A96847"
        />

        <path
          d="m187 173 23 18-12 18-18-33M231 173l-21 18 12 18 18-33"
          fill="#FFFFFF"
        />

        <path
          d="M210 194v30"
          stroke={primaryDark}
          strokeWidth="3"
          opacity="0.4"
        />

        {/* Face */}
        <ellipse cx="175" cy="119" rx="7" ry="11" fill="#B77853" />
        <ellipse cx="244" cy="119" rx="7" ry="11" fill="#B77853" />

        <path
          d="M175 97q0-38 35-38t35 38v31q0 39-35 39t-35-39Z"
          fill="#C98D65"
        />

        {/* Hair */}
        <path
          d="
            M174 112
            q-9-26 0-40
            2-15 19-15
            11-13 25-5
            18-7 25 10
            15 7 9 28
            l-7 24-7-26
            q-30 9-52-4
            l-5 28Z
          "
          fill="#404041"
        />

        <path
          d="M187 73q21-12 42 0"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.1"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Eyebrows */}
        <path
          d="M188 108q8-5 14-1M220 107q7-4 14 1"
          fill="none"
          stroke="#404041"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Eyes */}
        <g className="welcome-blink" fill="#404041">
          <ellipse cx="196" cy="119" rx="2.7" ry="3.5" />
          <ellipse cx="226" cy="119" rx="2.7" ry="3.5" />
        </g>

        <path
          d="m211 120-3 11h6"
          fill="none"
          stroke="#9B5D40"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Smile */}
        <path
          d="M195 139q15 9 31-1-12 25-31 1Z"
          fill="#FFFFFF"
          stroke="#9B5D40"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Book */}
        <g transform="rotate(-9 218 267)">
          <rect
            x="171"
            y="207"
            width="98"
            height="120"
            rx="9"
            fill="#D7732D"
          />

          <rect
            x="177"
            y="209"
            width="92"
            height="108"
            rx="7"
            fill={secondary}
          />

          <path
            d="M181 316h87v10h-87q-6-5 0-10Z"
            fill="#FFF7EF"
          />

          <path
            d="M186 321h74"
            stroke="#E9C8AC"
            strokeWidth="2"
          />

          <rect
            x="196"
            y="233"
            width="39"
            height="30"
            rx="5"
            fill="#FFFFFF"
          />

          <path
            d="M205 242h21M205 248h15M205 254h18"
            stroke={primary}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <path
            d="M246 209v25l-6-4-6 4v-25"
            fill={primary}
          />
        </g>

        {/* Arm holding the book */}
        <path
          d="
            M134 231
            C125 237 127 248 136 257
            L163 280
            Q172 288 182 280
            L204 263
            Q210 258 204 253
            L184 259 171 264 148 238Z
          "
          fill="#C98D65"
        />

        <path
          d="m187 260 14-3m-17 9 15-5"
          fill="none"
          stroke="#9B5D40"
          strokeWidth="1.7"
          strokeLinecap="round"
        />

        <path
          d="M154 188q-18 6-28 29l-7 18 30 13 19-34Z"
          fill={primary}
        />

        <path
          d="m124 233 25 10"
          stroke={primaryDark}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>
    </Box>
  );
}

export default function StudentWelcome({
  studentName = "Afolarin Oluwasegun",
  profileTo = "/student/profile",
}) {
  const theme = useTheme();
  const headingId = useId();
  const sectionRef = useRef(null);

  const inView = useInView(sectionRef, { amount: 0.15 });

  const reduceMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  const finePointer = useMediaQuery(
    "(hover: hover) and (pointer: fine)",
  );

  const [paused, setPaused] = useState(false);
  const [slide, setSlide] = useState(0);

  const [pageVisible, setPageVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );

  const rotateX = useSpring(0, { stiffness: 130, damping: 24 });
  const rotateY = useSpring(0, { stiffness: 130, damping: 24 });

  const firstName =
    (typeof studentName === "string" &&
      studentName.trim().split(/\s+/)[0]) ||
    "there";

  const playing = !paused && !reduceMotion && inView && pageVisible;
  const allowTilt = playing && finePointer;
  const activeSlide = reduceMotion ? 1 : slide;

  const greetings = [
    { lead: "Welcome to", name: "Hi-Touch Global" },
    { lead: "Welcome,", name: firstName },
  ];

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing) return undefined;

    const timer = window.setInterval(() => {
      setSlide((value) => 1 - value);
    }, ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [playing]);

  function handlePointerMove(event) {
    if (!allowTilt) return;

    const bounds = event.currentTarget.getBoundingClientRect();

    if (!bounds.width || !bounds.height) return;

    rotateY.set(
      ((event.clientX - bounds.left) / bounds.width - 0.5) * 7,
    );

    rotateX.set(
      -((event.clientY - bounds.top) / bounds.height - 0.5) * 5,
    );
  }

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <Box
      ref={sectionRef}
      component="section"
      aria-labelledby={headingId}
      sx={{
        width: "100%",
        minWidth: 0,
        containerType: "inline-size",
        containerName: "student-welcome",

        "@keyframes welcomeWave": {
          "0%, 12%, 48%, 100%": {
            transform: "rotate(0deg)",
          },
          "18%, 30%": {
            transform: "rotate(-7deg)",
          },
          "24%, 36%": {
            transform: "rotate(8deg)",
          },
          "42%": {
            transform: "rotate(-3deg)",
          },
        },

        "@keyframes welcomeFloat": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-7px)",
          },
        },

        "@keyframes welcomeBlink": {
          "0%, 43%, 47%, 100%": {
            transform: "scaleY(1)",
          },
          "45%": {
            transform: "scaleY(0.12)",
          },
        },

        "& .welcome-wave": {
          transformBox: "view-box",
          transformOrigin: "264px 198px",
          animation: "welcomeWave 7.2s ease-in-out infinite",
        },

        "& .welcome-float": {
          animation: "welcomeFloat 6s ease-in-out infinite",
        },

        "& .welcome-blink": {
          transformBox: "fill-box",
          transformOrigin: "center",
          animation: "welcomeBlink 8s linear infinite",
        },

        "& .welcome-wave, & .welcome-float, & .welcome-blink": {
          animationPlayState: playing ? "running" : "paused",
        },

        "@media (prefers-reduced-motion: reduce)": {
          "& .welcome-wave, & .welcome-float, & .welcome-blink": {
            animation: "none",
            transform: "none",
          },

          "& .welcome-depth": {
            transform: "none !important",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          isolation: "isolate",
          overflow: "hidden",
          boxSizing: "border-box",
          bgcolor: "#FFFFFF",
          border: "1px solid #E5EDF2",
          borderRadius: "18px",
          p: 2.5,
          boxShadow: "0 10px 36px rgba(64, 64, 65, 0.045)",

          "@container student-welcome (min-width: 560px)": {
            p: 3.5,
          },

          "@container student-welcome (min-width: 1000px)": {
            p: 5,
          },
        }}
      >
        {/* Motion control */}
        {!reduceMotion && (
          <Tooltip
            title={paused ? "Resume animation" : "Pause animation"}
          >
            <IconButton
              onClick={() => setPaused((value) => !value)}
              aria-label={
                paused
                  ? "Resume welcome animation"
                  : "Pause welcome animation"
              }
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 3,
                width: 44,
                height: 44,
                color: "text.secondary",
                borderRadius: "50%",

                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.07),
                },

                "&.Mui-focusVisible": {
                  outline: "2px solid",
                  outlineColor: "text.primary",
                },
              }}
            >
              <SvgIcon sx={{ fontSize: 18 }}>
                <path
                  d={
                    paused
                      ? "M8 5v14l11-7z"
                      : "M7 5h3v14H7zM14 5h3v14h-3z"
                  }
                />
              </SvgIcon>
            </IconButton>
          </Tooltip>
        )}

        {/* Layout responds to the component's width. */}
        <Box
          sx={{
            display: "grid",
            minWidth: 0,
            alignItems: "center",
            gap: 2,
            gridTemplateColumns: "minmax(0, 1fr)",
            gridTemplateAreas: '"copy" "art" "action"',

            "@container student-welcome (min-width: 560px)": {
              gridTemplateColumns:
                "minmax(0, 1.15fr) minmax(0, 0.85fr)",
              gridTemplateAreas: '"copy art" "action art"',
              columnGap: 2,
              rowGap: 3,
            },

            "@container student-welcome (min-width: 1000px)": {
              gridTemplateColumns:
                "minmax(0, 1.1fr) minmax(0, 1fr)",
              columnGap: 4,
            },
          }}
        >
          {/* Welcome copy */}
          <Box
            sx={{
              gridArea: "copy",
              minWidth: 0,
              alignSelf: "end",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                mb: 2.5,
                pr: 4,
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  width: 22,
                  height: 3,
                  flexShrink: 0,
                  borderRadius: 2,
                  bgcolor: "secondary.main",
                }}
              />

              <Typography
                sx={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  lineHeight: 1.6,
                  letterSpacing: "1.65px",
                  textTransform: "uppercase",
                  color: "text.secondary",
                }}
              >
                Your next chapter
              </Typography>
            </Box>

            <Box
              component="h1"
              id={headingId}
              sx={{
                position: "relative",
                m: 0,
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 32,
                lineHeight: 1.14,
                letterSpacing: "-1.2px",
                color: "text.primary",
                overflowWrap: "anywhere",

                "@supports (font-size: 1cqw)": {
                  fontSize: "clamp(2rem, 4.8cqw, 3.5rem)",
                },
              }}
            >
              {/* Stable heading for assistive technology. */}
              <Box
                component="span"
                sx={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  p: 0,
                  m: -1,
                  overflow: "hidden",
                  clipPath: "inset(50%)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              >
                Welcome to Hi-Touch Global, {firstName}.
              </Box>

              {/* Both greetings reserve their space, including long names. */}
              <Box
                component="span"
                aria-hidden="true"
                sx={{ display: "grid" }}
              >
                {greetings.map((greeting, index) => (
                  <motion.span
                    key={index}
                    initial={false}
                    animate={{
                      opacity: activeSlide === index ? 1 : 0,
                      y: activeSlide === index ? 0 : 8,
                    }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.6,
                      ease: EASE,
                    }}
                    style={{
                      display: "block",
                      gridArea: "1 / 1",
                      minWidth: 0,
                      pointerEvents: "none",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: "block",
                        mb: 0.75,
                        fontSize: "0.65em",
                        fontWeight: 500,
                        lineHeight: 1.4,
                        letterSpacing: "-0.4px",
                      }}
                    >
                      {greeting.lead}
                    </Box>

                    <Box
                      component="span"
                      sx={{
                        backgroundImage: `linear-gradient(
                          transparent 83%,
                          ${alpha(theme.palette.primary.main, 0.14)} 83%
                        )`,
                        boxDecorationBreak: "clone",
                        WebkitBoxDecorationBreak: "clone",
                      }}
                    >
                      {greeting.name}
                    </Box>

                    <Box
                      component="span"
                      sx={{ color: "secondary.main" }}
                    >
                      .
                    </Box>
                  </motion.span>
                ))}
              </Box>
            </Box>

            <Typography
              color="text.secondary"
              sx={{
                mt: 2.5,
                maxWidth: "43ch",
                fontSize: 14,
                lineHeight: 1.85,

                "@container student-welcome (min-width: 760px)": {
                  fontSize: 15,
                },
              }}
            >
              Big plans begin with one clear step. Keep your profile,
              documents and applications together as you shape your next
              chapter.
            </Typography>
          </Box>

          {/* Illustration */}
          <Box
            aria-hidden="true"
            onPointerMove={handlePointerMove}
            onPointerLeave={resetTilt}
            onPointerCancel={resetTilt}
            sx={{
              gridArea: "art",
              minWidth: 0,
              width: "100%",
              maxWidth: 290,
              justifySelf: "center",
              position: "relative",

              "@container student-welcome (min-width: 560px)": {
                maxWidth: 520,
              },
            }}
          >
            <motion.div
              className="welcome-depth"
              style={{
                rotateX: allowTilt ? rotateX : 0,
                rotateY: allowTilt ? rotateY : 0,
                transformPerspective: 900,
              }}
            >
              <StudentArtwork
                primary={theme.palette.primary.main}
                secondary={theme.palette.secondary.main}
                primaryDark={theme.palette.primary.dark}
              />
            </motion.div>
          </Box>

          {/* Main action */}
          <Box
            sx={{
              gridArea: "action",
              minWidth: 0,
              alignSelf: "start",
            }}
          >
            <Button
              component={RouterLink}
              to={profileTo}
              variant="contained"
              disableElevation
              endIcon={<ArrowIcon sx={{ fontSize: 20 }} />}
              sx={{
                width: "100%",
                minHeight: 48,
                px: 2.5,
                py: 1.25,
                justifyContent: "space-between",
                gap: 2,
                borderRadius: "8px",
                bgcolor: "primary.main",
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 600,
                boxShadow: "none",
                textTransform: "none",

                "@container student-welcome (min-width: 560px)": {
                  width: "auto",
                  minWidth: 192,
                },

                "& .MuiButton-endIcon": {
                  ml: 0,
                  mr: 0,
                  transition: "transform 180ms ease",
                },

                "&:hover": {
                  bgcolor: "primary.dark",
                  boxShadow: "none",
                },

                "&:hover .MuiButton-endIcon": {
                  transform: "translateX(3px)",
                },

                "&.Mui-focusVisible": {
                  outline: "2px solid",
                  outlineColor: "text.primary",
                  outlineOffset: 3,
                },

                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",

                  "& .MuiButton-endIcon": {
                    transition: "none",
                  },

                  "&:hover .MuiButton-endIcon": {
                    transform: "none",
                  },
                },
              }}
            >
              Open my profile
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}