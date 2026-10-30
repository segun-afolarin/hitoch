import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

const MESSAGES = [
  {
    id: "possibilities",
    headline: ["Your future", "starts beyond", "borders."],
    paragraph:
      "Take your ambition further. Discover study destinations, explore new possibilities, and get personal guidance from Hitouch Global as you prepare for your next chapter.",
  },
  {
    id: "first-step",
    headline: ["Dream bigger.", "Start today.", "Go further."],
    paragraph:
      "You don’t need every answer to take the first step. Explore your options, ask questions, and start shaping a study journey that feels right for you.",
  },
  {
    id: "discovery",
    headline: ["New places.", "New ideas.", "A new you."],
    paragraph:
      "Imagine learning in a new environment, meeting people from around the world, and discovering what you’re capable of. Let’s explore where your ambition could take you.",
  },
  {
    id: "next-chapter",
    headline: ["Your next", "chapter starts", "with you."],
    paragraph:
      "Turn “one day” into a first step. Create your account when you’re ready, or talk to an advisor about your goals and the options ahead.",
  },
];

const ROTATION_INTERVAL = 30_000;

const headlineClasses = `
  block text-[clamp(2.3rem,4.6vw,4.5rem)]
  font-bold leading-[1.08]
  tracking-[-0.05em] text-white
`;

const paragraphClasses = `
  mt-6 max-w-[460px]
  text-sm leading-[1.85] text-white/85
  sm:text-base
`;

export default function HeroHeadline({ active = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const reduceMotion = useReducedMotion();
  const message = MESSAGES[currentIndex];

  useEffect(() => {
    if (!active || paused || reduceMotion !== false) {
      return;
    }

    let intervalId;

    function syncTimer() {
      window.clearInterval(intervalId);

      if (!document.hidden) {
        intervalId = window.setInterval(() => {
          setCurrentIndex(
            (current) => (current + 1) % MESSAGES.length
          );
        }, ROTATION_INTERVAL);
      }
    }

    syncTimer();

    document.addEventListener("visibilitychange", syncTimer);

    return () => {
      window.clearInterval(intervalId);

      document.removeEventListener(
        "visibilitychange",
        syncTimer
      );
    };
  }, [active, paused, reduceMotion]);

  return (
    <div>
      <div className="relative grid">
        {/*
          These invisible copies reserve the height of the
          longest message at every screen size.
        */}
        {MESSAGES.map((item) => (
          <div
            key={item.id}
            aria-hidden="true"
            className="
              invisible pointer-events-none
              col-start-1 row-start-1 select-none
            "
          >
            <span className={headlineClasses}>
              {item.headline.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </span>

            <p className={paragraphClasses}>
              {item.paragraph}
            </p>
          </div>
        ))}

        {/* Headline and paragraph animate as one message. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={message.id}
            initial={{
              opacity: 0,
              y: reduceMotion ? 0 : 20,
              filter: reduceMotion
                ? "blur(0px)"
                : "blur(5px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: reduceMotion ? 0 : -12,
              filter: reduceMotion
                ? "blur(0px)"
                : "blur(4px)",
              transition: {
                duration: reduceMotion ? 0 : 0.25,
                ease: "easeIn",
              },
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-x-0 top-0"
          >
            <h1
              id="hero-title"
              className={headlineClasses}
            >
              {message.headline.map((line, index) => (
                <span
                  key={index}
                  className={`block ${
                    index === 2
                      ? "text-brand"
                      : "text-white"
                  }`}
                >
                  {line}
                </span>
              ))}
            </h1>

            <p className={paragraphClasses}>
              {message.paragraph}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle indicators and a reading pause control. */}
      <div className="mt-4 flex min-h-11 items-center gap-4">
        <div
          aria-hidden="true"
          className="flex items-center gap-1.5"
        >
          {MESSAGES.map((item, index) => (
            <span
              key={item.id}
              className={`
                block h-1 rounded-full
                transition-[width,background-color]
                duration-300
                motion-reduce:transition-none
                ${
                  index === currentIndex
                    ? "w-7 bg-secondary"
                    : "w-3 bg-white/30"
                }
              `}
            />
          ))}
        </div>

        {!reduceMotion && (
          <button
            type="button"
            onClick={() => setPaused((current) => !current)}
            aria-label={
              paused
                ? "Resume changing hero messages"
                : "Pause changing hero messages"
            }
            className="
              inline-flex min-h-11 items-center gap-2
              rounded-md px-2 text-[11px] font-medium
              text-white/75 transition-colors
              hover:text-white
              focus-visible:outline-white
            "
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              {paused ? (
                <path
                  d="m8 5 11 7-11 7V5Z"
                  fill="currentColor"
                />
              ) : (
                <path
                  d="M9 5v14M15 5v14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}
            </svg>

            {paused ? "Resume text" : "Pause text"}
          </button>
        )}
      </div>
    </div>
  );
}