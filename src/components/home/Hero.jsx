import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

const MESSAGE_SECONDS = 9;
const SLIDE_SECONDS = 3;
const EASE = [0.22, 1, 0.36, 1];

const messages = [
  {
    id: "possibilities",
    headline: ["Your future", "won’t wait.", "Start today."],
    paragraph:
      "Every great journey begins with one decision. Choose your destination, get expert guidance from Hitouch Global, and take the first step toward the degree and the life you want.",
  },
  {
    id: "first-step",
    headline: ["Dream it.", "Plan it.", "Live it."],
    paragraph:
      "You don’t need every answer, just the courage to start. Our advisors help you choose the right course, country and next steps, so your dream becomes a plan you can act on.",
  },
  {
    id: "discovery",
    headline: ["Go global.", "Grow fast.", "Never look back."],
    paragraph:
      "Study in a new country, learn at leading universities and build a network that spans the globe. From your application to your accommodation, we’re beside you every step.",
  },
  {
    id: "next-chapter",
    headline: ["Ready when", "you are.", "Apply with us."],
    paragraph:
      "Create your account or talk to an advisor today. The earlier you start, the more options you’ll have, so make your move and let’s build your next chapter together.",
  },
  {
    id: "courage",
    headline: ["Be bold.", "Be brave.", "Be abroad."],
    paragraph:
      "The best things happen outside your comfort zone. Take the leap, and let our team guide you through every form, every deadline and every decision along the way.",
  },
  {
    id: "career",
    headline: ["Study smart.", "Think global.", "Lead anywhere."],
    paragraph:
      "A degree abroad can open doors you haven’t imagined yet. Build the skills, perspective and confidence that stay with you for life, and let us help you get there.",
  },
  {
    id: "support",
    headline: ["You dream.", "We guide.", "You arrive."],
    paragraph:
      "From choosing a course to settling in, you won’t do it alone. Admission support, education loan guidance, accommodation help and more, all in one place.",
  },
  {
    id: "open-world",
    headline: ["The world", "is open.", "Step in."],
    paragraph:
      "Canada, the UK, the US and beyond are waiting. Explore your destinations, talk to an advisor and turn today’s curiosity into tomorrow’s opportunity.",
  },
];

const destinations = [
  {
    name: "Canada",
    to: "/countries/canada",
    image:
      "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=960&q=80",
  },
  {
    name: "United Kingdom",
    to: "/countries/united-kingdom",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=960&q=80",
  },
  {
    name: "United States",
    to: "/countries/united-states",
    image:
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=960&q=80",
  },
];

const headlineClass = `
  block text-[clamp(2.125rem,4.6vw,4.5rem)]
  font-semibold leading-[1.17]
  tracking-[-0.035em] text-white
  [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]
`;

const paragraphClass = `
  mt-6 max-w-[46ch] text-[15px]
  leading-[1.85] text-white
  [text-shadow:0_1px_14px_rgba(0,0,0,0.55)]
  sm:text-base lg:text-[17px]
`;

const focusClass = `
  focus-visible:outline-white
  focus-visible:outline-offset-4
`;

function Arrow({
  diagonal = false,
  previous = false,
  className = "",
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d={
          diagonal
            ? "M6 18 18 6M6 6h12v12"
            : previous
              ? "M19 12H5m6-6-6 6 6 6"
              : "M5 12h14m-6-6 6 6-6 6"
        }
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlaybackIcon({ playing }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {playing ? (
        <path
          d="M9 5v14M15 5v14"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="m9 5 10 7-10 7V5Z"
          fill="currentColor"
          stroke="currentColor"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function usePageVisible() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const sync = () => setVisible(!document.hidden);

    sync();
    document.addEventListener("visibilitychange", sync);

    return () => {
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return visible;
}

/*
 * One animation drives a progress bar and the automatic change.
 * Pause/resume preserves elapsed time, and picking an item
 * manually restarts the countdown.
 */
function useClock(index, seconds, running, onAdvance) {
  const progress = useMotionValue(0);
  const controls = useRef(null);
  const advanceRef = useRef(onAdvance);

  useEffect(() => {
    advanceRef.current = onAdvance;
  }, [onAdvance]);

  useEffect(() => {
    progress.set(0);

    const animation = animate(progress, 1, {
      duration: seconds,
      ease: "linear",
      onComplete: () => advanceRef.current(),
    });

    animation.pause();
    controls.current = animation;

    return () => animation.stop();
  }, [index, seconds, progress]);

  useEffect(() => {
    if (running) {
      controls.current?.play();
    } else {
      controls.current?.pause();
    }
  }, [index, running]);

  return progress;
}

/* Words fade and rise in one after another. */
function Words({ text, variants }) {
  const words = text.split(" ");

  return words.map((word, index) => (
    <span key={`${word}-${index}`}>
      <motion.span variants={variants} className="inline-block">
        {word}
      </motion.span>
      {index < words.length - 1 ? " " : null}
    </span>
  ));
}

function HeroCopy({ index, reduceMotion, titleId }) {
  const message = messages[index];

  // The headline lines and the paragraph are children of one wrapper,
  // so they enter in sequence and leave in reverse.
  const wrap = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.11,
        delayChildren: reduceMotion ? 0 : 0.05,
      },
    },
    exit: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.05,
        staggerDirection: -1,
      },
    },
  };

  const line = {
    hidden: {
      y: reduceMotion ? 0 : "105%",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: reduceMotion ? 0 : 0.85, ease: EASE },
    },
    exit: {
      y: reduceMotion ? 0 : "-105%",
      opacity: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.4,
        ease: [0.55, 0, 0.8, 0.4],
      },
    },
  };

  const paragraph = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.016,
        delayChildren: reduceMotion ? 0 : 0.08,
      },
    },
    exit: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.004 },
    },
  };

  const word = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.55, ease: EASE },
    },
    exit: {
      opacity: 0,
      transition: { duration: reduceMotion ? 0 : 0.2 },
    },
  };

  return (
    <div className="relative grid min-w-0">
      {/* Reserve the tallest message to prevent layout shifts. */}
      {messages.map((item) => (
        <div
          key={item.id}
          aria-hidden="true"
          className="
            pointer-events-none invisible
            col-start-1 row-start-1
            min-w-0 select-none
          "
        >
          <span className={headlineClass}>
            {item.headline.map((text) => (
              <span key={text} className="block">
                {text}
              </span>
            ))}
          </span>

          <p className={paragraphClass}>{item.paragraph}</p>
        </div>
      ))}

      <AnimatePresence mode="wait">
        <motion.div
          key={message.id}
          variants={wrap}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          exit="exit"
          className="absolute inset-x-0 top-0 min-w-0"
        >
          <h1 id={titleId} className={headlineClass}>
            {message.headline.map((text, lineIndex) => (
              <span
                key={text}
                className="
                  -mb-[0.12em] block
                  overflow-hidden pb-[0.12em]
                "
              >
                <motion.span
                  variants={line}
                  className={`
                    block
                    ${lineIndex === 2 ? "text-[#00AEEF]" : "text-white"}
                  `}
                >
                  {text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p variants={paragraph} className={paragraphClass}>
            <Words text={message.paragraph} variants={word} />
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DestinationCarousel({ reduceMotion, running }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const pointer = useRef(null);
  const slideId = useId();
  const destination = destinations[index];

  // Slides change automatically every few seconds.
  const progress = useClock(index, SLIDE_SECONDS, running, () => {
    setDirection(1);
    setIndex((current) => (current + 1) % destinations.length);
  });

  function select(next, nextDirection = 1) {
    setDirection(nextDirection);

    setIndex((next + destinations.length) % destinations.length);
  }

  function onKeyDown(event) {
    pointer.current = null;

    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const keys = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: destinations.length - 1,
    };

    if (!(event.key in keys)) return;

    event.preventDefault();

    select(keys[event.key], event.key === "ArrowLeft" ? -1 : 1);
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Study destinations"
      onKeyDown={onKeyDown}
      className="
        mx-auto w-full min-w-0 max-w-[460px]
        md:ml-auto md:mr-0
      "
    >
      <div className="mb-5">
        <p
          className="
            mb-2 text-[10px] font-semibold uppercase
            tracking-[0.16em] text-white/75
          "
        >
          A world of possibility
        </p>

        <h2
          className="
            max-w-[310px] text-[21px]
            font-medium leading-[1.4]
            tracking-[-0.02em] text-white
            sm:text-2xl
          "
        >
          Where will your ambition take you?
        </h2>
      </div>

      <div className="relative">
        {/* Restrained depth behind the active card, gently floating. */}
        <motion.div
          aria-hidden="true"
          animate={
            reduceMotion
              ? undefined
              : { y: [0, 5, 0], rotate: [1.5, 2.4, 1.5] }
          }
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="
            pointer-events-none absolute inset-0
            hidden translate-x-2 translate-y-2
            rotate-[1.5deg] rounded-[22px]
            border border-white/15 bg-white/5
            md:block
          "
        />

        <div
          className="
            relative isolate h-[190px] touch-pan-y
            overflow-hidden rounded-[20px]
            border border-white/25 bg-[#404041]
            shadow-[0_24px_70px_rgba(0,0,0,0.25)]
            sm:h-[240px] md:h-[300px]
            lg:h-[340px] xl:h-[360px]
          "
          onPointerDown={(event) => {
            pointer.current = null;

            if (event.button !== 0 || event.target.closest("button")) {
              return;
            }

            pointer.current = {
              x: event.clientX,
              y: event.clientY,
              moved: false,
            };
          }}
          onPointerMove={(event) => {
            if (!pointer.current) return;

            const dx = event.clientX - pointer.current.x;
            const dy = event.clientY - pointer.current.y;

            if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
              pointer.current.moved = true;
            }
          }}
          onPointerUp={(event) => {
            if (!pointer.current) return;

            const dx = event.clientX - pointer.current.x;
            const dy = event.clientY - pointer.current.y;

            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
              pointer.current.moved = true;

              select(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
            }
          }}
          onPointerCancel={() => {
            pointer.current = null;
          }}
          onClickCapture={(event) => {
            // Swiping must not accidentally open the destination.
            if (pointer.current?.moved) {
              event.preventDefault();
              event.stopPropagation();
            }

            pointer.current = null;
          }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={destination.to}
              custom={direction}
              aria-hidden="true"
              variants={{
                enter: (d) => ({
                  opacity: 0,
                  x: reduceMotion ? 0 : d * 48,
                }),
                center: {
                  opacity: 1,
                  x: 0,
                },
                exit: (d) => ({
                  opacity: 0,
                  x: reduceMotion ? 0 : d * -32,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: reduceMotion ? 0 : 0.7,
                ease: EASE,
              }}
              className="pointer-events-none absolute inset-0"
            >
              {/* Slow push-in while each slide is on screen */}
              <motion.img
                src={destination.image}
                alt=""
                draggable={false}
                width="960"
                height="1200"
                decoding="async"
                initial={reduceMotion ? false : { scale: 1.16 }}
                animate={{ scale: reduceMotion ? 1 : 1.03 }}
                transition={{ duration: 4.5, ease: "linear" }}
                onError={(event) => {
                  event.currentTarget.hidden = true;
                }}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-0
              bg-[linear-gradient(180deg,rgba(0,0,0,0.25),transparent_35%,rgba(0,0,0,0.85))]
            "
          />

          <div
            id={slideId}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${destinations.length}: ${destination.name}`}
            className="absolute inset-0"
          >
            <Link
              to={destination.to}
              draggable={false}
              className="
                group absolute inset-0
                flex items-end justify-between
                gap-4 p-5 text-white
                focus-visible:outline-white
                focus-visible:outline-offset-[-6px]
                sm:p-7
              "
            >
              <span className="sr-only">{destination.name}</span>

              {/* The name rises word by word out of a mask */}
              <span
                key={destination.name}
                aria-hidden="true"
                className="
                  flex flex-wrap gap-x-[0.28em]
                  text-[26px] font-semibold
                  leading-[1.25] tracking-[-0.025em]
                  sm:text-[32px]
                "
              >
                {destination.name.split(" ").map((word, wordIndex) => (
                  <span
                    key={word}
                    className="block overflow-hidden pb-[0.1em] -mb-[0.1em]"
                  >
                    <motion.span
                      initial={reduceMotion ? false : { y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.65,
                        delay: reduceMotion ? 0 : 0.15 + wordIndex * 0.08,
                        ease: EASE,
                      }}
                      className="block"
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>

              <span
                className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-full border border-white/50
                  bg-black/20 text-white backdrop-blur-md
                  transition-[background-color,transform]
                  group-hover:bg-[#00AEEF]
                  motion-safe:group-hover:scale-110
                  motion-reduce:transition-none
                "
              >
                <Arrow
                  diagonal
                  className="
                    transition-transform duration-300
                    motion-safe:group-hover:translate-x-0.5
                    motion-safe:group-hover:-translate-y-0.5
                    motion-reduce:transition-none
                  "
                />
              </span>
            </Link>
          </div>

          <span
            aria-hidden="true"
            className="
              pointer-events-none absolute left-5 top-5
              flex items-center overflow-hidden
              rounded-full border border-white/25
              bg-black/35 px-3 py-2
              text-[10px] font-semibold tabular-nums
              text-white backdrop-blur-md
            "
          >
            <motion.span
              key={index}
              initial={reduceMotion ? false : { y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                ease: EASE,
              }}
              className="inline-block"
            >
              {String(index + 1).padStart(2, "0")}
            </motion.span>
            <span className="ml-1">
              {" / "}
              {String(destinations.length).padStart(2, "0")}
            </span>
          </span>

          <div className="absolute right-4 top-4 flex gap-2">
            <button
              type="button"
              aria-label="Previous destination"
              aria-controls={slideId}
              onClick={() => select(index - 1, -1)}
              className={`
                flex h-11 w-11 items-center
                justify-center rounded-full
                border border-white/30 bg-black/40
                text-white backdrop-blur-md
                transition-[background-color,transform]
                hover:bg-[#00AEEF]
                motion-safe:active:scale-90
                motion-reduce:transition-none
                ${focusClass}
              `}
            >
              <Arrow previous />
            </button>

            <button
              type="button"
              aria-label="Next destination"
              aria-controls={slideId}
              onClick={() => select(index + 1, 1)}
              className={`
                flex h-11 w-11 items-center
                justify-center rounded-full
                border border-white/30 bg-black/40
                text-white backdrop-blur-md
                transition-[background-color,transform]
                hover:bg-[#00AEEF]
                motion-safe:active:scale-90
                motion-reduce:transition-none
                ${focusClass}
              `}
            >
              <Arrow />
            </button>
          </div>
        </div>
      </div>

      <div
        className="
          mt-3 flex flex-wrap items-center
          justify-between gap-x-4
        "
      >
        <div
          role="group"
          aria-label="Choose a destination"
          className="flex gap-1"
        >
          {destinations.map((item, itemIndex) => (
            <button
              key={item.to}
              type="button"
              aria-label={`Show ${item.name}`}
              aria-pressed={index === itemIndex}
              aria-controls={slideId}
              onClick={() => select(itemIndex, itemIndex < index ? -1 : 1)}
              className={`
                flex h-11 w-8 items-center
                rounded-sm ${focusClass}
              `}
            >
              <span
                aria-hidden="true"
                className="
                  relative h-0.5 w-full overflow-hidden
                  rounded-full bg-white/35
                "
              >
                {index === itemIndex && (
                  <motion.span
                    style={{ scaleX: reduceMotion ? 1 : progress }}
                    className="absolute inset-0 origin-left bg-[#FD933D]"
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        <Link
          to="/countries"
          className={`
            group inline-flex min-h-11 items-center
            gap-2 rounded-sm text-xs font-semibold
            text-white ${focusClass}
          `}
        >
          View all destinations
          <Arrow
            className="
              h-4 w-4 transition-transform
              motion-safe:group-hover:translate-x-1
              motion-reduce:transition-none
            "
          />
        </Link>
      </div>

      <p
        aria-live={running ? "off" : "polite"}
        aria-atomic="true"
        className="sr-only"
      >
        {destination.name}, {index + 1} of {destinations.length}
      </p>
    </div>
  );
}

export default function Hero({
  videoSrc = "/videos/hero.mp4",
  posterSrc,
}) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const playbackChoice = useRef(null);

  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const pageVisible = usePageVisible();
  const inView = useInView(sectionRef, { amount: 0.1 });

  const [messageIndex, setMessageIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failedSource, setFailedSource] = useState(null);
  const [playbackMessage, setPlaybackMessage] = useState("");

  const videoFailed = failedSource === videoSrc;
  const motionAllowed = reduceMotion === false;

  // Both the text and the slides run only while the hero is on screen
  // and the visitor is not hovering, focusing, or has paused.
  const running =
    motionAllowed &&
    inView &&
    pageVisible &&
    !paused &&
    !hovered &&
    !focusWithin;

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(media.matches);

    sync();
    media.addEventListener("change", sync);

    return () => {
      media.removeEventListener("change", sync);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
  });

  // The video drifts slowest and the glass panel lifts a little faster.
  const videoY = useTransform(smooth, [0, 1], [0, 28]);
  const panelY = useTransform(smooth, [0, 1], [0, -44]);

  const scrollMotion = motionAllowed && desktop;

  const progress = useClock(messageIndex, MESSAGE_SECONDS, running, () => {
    setMessageIndex((current) => (current + 1) % messages.length);
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const wantsPlayback = playbackChoice.current ?? motionAllowed;

    if (wantsPlayback && inView && pageVisible && !videoFailed) {
      video.muted = true;
      video.play().catch(() => {});
    } else {
      video.pause();
    }

    return () => video.pause();
  }, [motionAllowed, inView, pageVisible, videoFailed, videoSrc]);

  async function toggleVideo() {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    setPlaybackMessage("");

    if (!video.paused) {
      playbackChoice.current = false;
      video.pause();
      return;
    }

    playbackChoice.current = true;

    try {
      video.muted = true;
      await video.play();
    } catch (error) {
      if (error.name === "AbortError" || !video.isConnected) {
        return;
      }

      playbackChoice.current = false;
      setPlaybackMessage(
        "The background video could not start. Please try again."
      );
    }
  }

  function reveal(delay = 0) {
    return {
      initial: reduceMotion ? false : { opacity: 0, y: 18 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: reduceMotion ? 0 : 0.75,
        delay: reduceMotion ? 0 : delay,
        ease: EASE,
      },
    };
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby={titleId}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          setHovered(true);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") {
          setHovered(false);
        }
      }}
      onFocusCapture={(event) => {
        // The pause button itself should never hold the slideshow still.
        if (event.target.closest("[data-rotation-control]")) {
          setFocusWithin(false);
          return;
        }

        // Only keyboard focus pauses; clicking a button with a mouse does not.
        if (event.target.matches?.(":focus-visible")) {
          setFocusWithin(true);
        }
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusWithin(false);
        }
      }}
      className="
        relative isolate overflow-hidden
        bg-[#171717] font-sans text-white
      "
    >
      {/* Your existing background video: slow push-in plus scroll drift */}
      <motion.div
        aria-hidden="true"
        style={scrollMotion ? { y: videoY } : undefined}
        className={`
          pointer-events-none absolute -z-20
          ${scrollMotion ? "-inset-8" : "inset-0"}
        `}
      >
        <motion.div
          initial={reduceMotion ? false : { scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 2.6, ease: EASE }}
          className="h-full w-full"
        >
          <video
            key={videoSrc}
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => {
              setFailedSource(videoSrc);
              setPlaying(false);
            }}
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
      </motion.div>

      {/* Light tint only: the video stays clear and bright */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          -z-10 bg-black/10
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 -z-10
          bg-[linear-gradient(180deg,rgba(0,0,0,0.25),transparent_40%,rgba(0,0,0,0.55))]
        "
      />

      {/* Slow ambient light that drifts behind the content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <motion.div
          animate={
            motionAllowed ? { x: [0, 50, 0], y: [0, -34, 0] } : undefined
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="
            absolute -left-28 top-1/4 h-80 w-80
            rounded-full bg-[#00AEEF]/15 blur-3xl
          "
        />
        <motion.div
          animate={
            motionAllowed ? { x: [0, -44, 0], y: [0, 40, 0] } : undefined
          }
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="
            absolute -right-24 bottom-0 h-72 w-72
            rounded-full bg-[#FD933D]/10 blur-3xl
          "
        />
      </div>

      <div
        className="
          site-container relative flex
          min-h-[calc(100svh-80px)]
          flex-col justify-center
          py-8 sm:py-10 lg:py-12
          xl:min-h-[calc(100svh-88px)]
        "
      >
        <motion.div
          style={scrollMotion ? { y: panelY } : undefined}
          className="min-w-0"
        >
        <motion.div
          {...reveal(0.05)}
          className="
            relative grid items-center gap-9
            rounded-[24px] border border-white/20
            bg-black/35 p-5
            shadow-[0_24px_80px_rgba(0,0,0,0.18)]
            supports-[backdrop-filter:blur(1px)]:bg-black/12
            supports-[backdrop-filter:blur(1px)]:backdrop-blur-[6px]
            sm:rounded-[28px] sm:p-8
            md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]
            md:gap-8 lg:gap-12 lg:p-10 xl:gap-16 xl:p-12
          "
        >
          {/* Fine highlight along the top edge of the glass */}
          <span
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-x-8 top-0 h-px
              bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]
            "
          />

          {/* Main headline and actions */}
          <motion.div
            className="min-w-0"
          >
            <motion.div
              {...reveal()}
              className="
                mb-6 flex items-center gap-3
                lg:mb-8
              "
            >
              <motion.span
                aria-hidden="true"
                initial={reduceMotion ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.8,
                  delay: reduceMotion ? 0 : 0.3,
                  ease: EASE,
                }}
                className="h-0.5 w-8 shrink-0 origin-left bg-[#FD933D]"
              />

              <p
                className="
                  text-[10px] font-semibold uppercase
                  leading-relaxed tracking-[0.16em]
                  text-white/90 sm:text-[11px]
                "
              >
                Think bigger. Go further.
              </p>
            </motion.div>

            <HeroCopy
              index={messageIndex}
              reduceMotion={reduceMotion}
              titleId={titleId}
            />

            <motion.div
              {...reveal(0.3)}
              className="
                mt-7 flex flex-col gap-3
                sm:flex-row sm:flex-wrap
              "
            >
              <Link
                to="/register"
                className={`
                  group relative inline-flex min-h-[54px]
                  items-center justify-center gap-4 overflow-hidden
                  rounded-md bg-[#00AEEF]
                  px-6 py-3.5 text-sm
                  font-semibold text-white
                  transition-[background-color,transform] duration-200
                  hover:bg-[#009CD6]
                  motion-safe:hover:-translate-y-0.5
                  motion-reduce:transition-none
                  ${focusClass}
                `}
              >
                {/* Soft light sweep on hover */}
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute inset-y-0 -left-1/3 w-1/3
                    -translate-x-full -skew-x-[20deg] bg-white/25
                    transition-transform duration-700 ease-out
                    group-hover:translate-x-[450%]
                    motion-reduce:hidden
                  "
                />

                <span className="relative">Create your account</span>

                <Arrow
                  className="
                    relative shrink-0 text-white
                    transition-transform duration-200
                    motion-safe:group-hover:translate-x-1
                    motion-reduce:transition-none
                  "
                />
              </Link>

              <Link
                to="/contact"
                className={`
                  group inline-flex min-h-[54px]
                  items-center justify-center gap-4
                  rounded-md border border-white/40
                  bg-black/15 px-5 py-3.5
                  text-sm font-semibold text-white
                  backdrop-blur-md
                  transition-[background-color,border-color,transform]
                  hover:border-white/70 hover:bg-white/15
                  motion-safe:hover:-translate-y-0.5
                  motion-reduce:transition-none
                  ${focusClass}
                `}
              >
                Talk to an advisor
                <Arrow
                  diagonal
                  className="
                    shrink-0 text-white
                    transition-transform duration-200
                    motion-safe:group-hover:-translate-y-0.5
                    motion-safe:group-hover:translate-x-0.5
                    motion-reduce:transition-none
                  "
                />
              </Link>
            </motion.div>

            <motion.p
              {...reveal(0.4)}
              className="
                mt-5 max-w-[42ch] text-xs
                leading-[1.8] text-white/80
              "
            >
              Explore your options. Create an account
              when you’re ready.
            </motion.p>

            {/* Message pagination and auto-play control */}
            <motion.div
              {...reveal(0.5)}
              className="
                mt-5 flex flex-wrap items-center gap-x-4
              "
            >
              <div
                role="group"
                aria-label="Choose a hero message"
                className="flex gap-1"
              >
                {messages.map((message, index) => (
                  <button
                    key={message.id}
                    type="button"
                    aria-label={`Show message ${index + 1}: ${message.headline.join(" ")}`}
                    aria-pressed={index === messageIndex}
                    onClick={() => setMessageIndex(index)}
                    className={`
                      flex h-11 w-8 items-center
                      rounded-sm ${focusClass}
                    `}
                  >
                    <span
                      aria-hidden="true"
                      className={`
                        relative h-0.5 w-full
                        overflow-hidden rounded-full
                        ${
                          index === messageIndex
                            ? "bg-[#00AEEF]"
                            : "bg-white/25"
                        }
                      `}
                    >
                      {index === messageIndex && (
                        <motion.span
                          style={{
                            scaleX: motionAllowed ? progress : 1,
                          }}
                          className="
                            absolute inset-0
                            origin-left bg-[#FD933D]
                          "
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>

              {motionAllowed && (
                <button
                  type="button"
                  data-rotation-control
                  aria-label={
                    paused
                      ? "Resume automatic changes"
                      : "Pause automatic changes"
                  }
                  onClick={() => {
                    setPaused((current) => !current);
                  }}
                  className={`
                    inline-flex min-h-11 items-center
                    gap-2 rounded-sm text-[11px]
                    font-medium text-white/85
                    transition-colors hover:text-white
                    ${focusClass}
                  `}
                >
                  <PlaybackIcon playing={!paused} />
                  {paused ? "Resume auto-play" : "Pause auto-play"}
                </button>
              )}
            </motion.div>
          </motion.div>

          {/* Interactive destinations */}
          <motion.div className="min-w-0">
            <motion.div {...reveal(0.18)} className="min-w-0">
              <DestinationCarousel
                reduceMotion={reduceMotion}
                running={running}
              />
            </motion.div>
          </motion.div>
        </motion.div>
        </motion.div>

        {/* Quiet footer and video playback control */}
        <motion.div
          {...reveal(0.6)}
          className="
            mt-7 flex flex-wrap items-center
            justify-between gap-3
            border-t border-white/20 pt-4
            lg:mt-8
          "
        >
          <p
            className="
              text-[10px] font-medium uppercase
              leading-relaxed tracking-[0.13em]
              text-white/80
            "
          >
            Hitouch Global · Your next chapter
          </p>

          {!videoFailed && (
            <button
              type="button"
              onClick={toggleVideo}
              aria-label={
                playing
                  ? "Pause background video"
                  : "Play background video"
              }
              className={`
                inline-flex min-h-11 items-center
                justify-center gap-2.5 rounded-full
                border border-white/25 bg-black/25
                px-4 py-2 text-xs
                font-medium text-white backdrop-blur-md
                transition-colors hover:bg-black/50
                motion-reduce:transition-none
                ${focusClass}
              `}
            >
              <PlaybackIcon playing={playing} />
              {playing ? "Pause video" : "Play video"}
            </button>
          )}
        </motion.div>

        <p role="status" className="sr-only">
          {videoFailed
            ? "The background video is unavailable."
            : playbackMessage}
        </p>
      </div>
    </section>
  );
}