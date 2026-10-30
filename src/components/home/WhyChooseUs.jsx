import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

const EASE = [0.22, 1, 0.36, 1];

// Plays once, the first time the element enters the viewport.
const VIEWPORT = { once: true, amount: 0.2, margin: "0px 0px -6% 0px" };

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85";

const reasons = [
  {
    id: "personal",
    title: "Guidance shaped around you",
    description:
      "Start with your goals, preferred destinations, and study plans. Get support with the decisions that matter to your journey.",
  },
  {
    id: "clarity",
    title: "Clear steps, better preparation",
    description:
      "Understand the documents, requirements, and actions involved, so you can approach your applications with greater confidence.",
  },
  {
    id: "support",
    title: "Support beyond your application",
    description:
      "Explore help with education financing, accommodation, travel insurance, and the practical details of preparing for life abroad.",
  },
];

/*
 * Icon strokes draw themselves when `animated` is true. Without it (for
 * example the image fallback) the icon is simply drawn in full.
 */
function BenefitIcon({ type, className = "", animated = false, reduceMotion }) {
  const draw = animated
    ? {
        hidden: {
          pathLength: reduceMotion ? 1 : 0,
          opacity: reduceMotion ? 1 : 0,
        },
        show: {
          pathLength: 1,
          opacity: 1,
          transition: { duration: reduceMotion ? 0 : 0.9, ease: "easeInOut" },
        },
      }
    : undefined;

  const Path = animated ? motion.path : "path";
  const Circle = animated ? motion.circle : "circle";
  const Rect = animated ? motion.rect : "rect";

  const artwork = {
    personal: (
      <>
        <Circle variants={draw} cx="9" cy="8" r="3" />
        <Path
          variants={draw}
          d="M3 20v-2a6 6 0 0 1 12 0v2M16 5h5v6h-3l-2 2V5Z"
        />
      </>
    ),
    clarity: (
      <Path
        variants={draw}
        d="m3 6 1.5 1.5L7 5M11 6h10M3 12l1.5 1.5L7 11M11 12h10M3 18l1.5 1.5L7 17M11 18h10"
      />
    ),
    support: (
      <>
        <Rect variants={draw} x="3" y="8" width="18" height="13" rx="2" />
        <Path
          variants={draw}
          d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M3 13a24 24 0 0 0 18 0M12 12v4"
        />
      </>
    ),
  };

  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {artwork[type]}
    </svg>
  );
}

function Arrow({ className = "" }) {
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
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ConsultationImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        aria-hidden="true"
        className="flex h-full items-center justify-center bg-brand/5"
      >
        <span
          className="
            flex h-24 w-24 items-center justify-center
            rounded-full bg-brand text-white
            ring-[18px] ring-brand/10
          "
        >
          <BenefitIcon type="personal" className="h-11 w-11" />
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width="1200"
      height="800"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover object-center"
    />
  );
}

export default function WhyChooseUs({
  imageSrc = DEFAULT_IMAGE,
  imageAlt = "Two people discussing documents at a table",
}) {
  const headingId = useId();
  const figureRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // The photograph drifts gently as the figure crosses the screen.
  const { scrollYProgress } = useScroll({
    target: figureRef,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.6,
  });
  const imageY = useTransform(smoothProgress, [0, 1], ["-6%", "6%"]);

  const offset = reduceMotion ? 0 : 32;

  const fade = (distance) => ({
    hidden: { opacity: 0, y: reduceMotion ? 0 : distance },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.7, ease: EASE },
    },
  });

  // Blocks that move in as one unit
  const block = {
    hidden: {
      opacity: 0,
      y: offset,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.7,
        ease: EASE,
        staggerChildren: reduceMotion ? 0 : 0.12,
      },
    },
  };

  const introItem = fade(16);

  const bar = {
    hidden: { scaleX: reduceMotion ? 1 : 0 },
    show: {
      scaleX: 1,
      transition: { duration: reduceMotion ? 0 : 0.7, ease: EASE },
    },
  };

  // Photograph: wipes open from the top, then settles
  const figure = {
    hidden: {
      opacity: 0,
      y: offset,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.6,
        ease: EASE,
        staggerChildren: reduceMotion ? 0 : 0.18,
      },
    },
  };

  const photoFrame = {
    hidden: {
      clipPath: reduceMotion
        ? "inset(0% 0% 0% 0%)"
        : "inset(0% 0% 100% 0%)",
    },
    show: {
      clipPath: "inset(0% 0% 0% 0%)",
      transition: { duration: reduceMotion ? 0 : 1.1, ease: EASE },
    },
  };

  const photoSettle = {
    hidden: { scale: reduceMotion ? 1 : 1.18 },
    show: {
      scale: 1,
      transition: { duration: reduceMotion ? 0 : 1.4, ease: EASE },
    },
  };

  const caption = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.8,
        delay: reduceMotion ? 0 : 0.35,
        ease: EASE,
      },
    },
  };

  // Reason rows
  const row = {
    hidden: {
      opacity: 0,
      y: offset,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.7,
        ease: EASE,
        staggerChildren: reduceMotion ? 0 : 0.1,
        delayChildren: reduceMotion ? 0 : 0.1,
      },
    },
  };

  const tile = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.6 },
    show: {
      opacity: 1,
      scale: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : { type: "spring", stiffness: 280, damping: 20 },
    },
  };

  const text = fade(14);

  return (
    <section
      id="why-hitouch"
      aria-labelledby={headingId}
      className="
        overflow-hidden bg-white font-sans
        pb-16 pt-6
        sm:pb-20 sm:pt-8
        lg:pb-24 lg:pt-10
      "
    >
      <div className="site-container">
        <div
          className="
            grid items-start gap-10
            lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]
            lg:gap-x-14 lg:gap-y-8
            xl:gap-x-20
          "
        >
          {/* Introduction: appears first on mobile */}
          <motion.div
            variants={block}
            initial={reduceMotion ? false : "hidden"}
            whileInView="show"
            viewport={VIEWPORT}
            className="min-w-0 lg:col-start-2 lg:row-start-1"
          >
            <motion.p
              variants={introItem}
              className="
                mb-4 flex items-center gap-3
                text-[11px] font-bold uppercase
                tracking-[0.16em] text-muted
              "
            >
              <motion.span
                variants={bar}
                aria-hidden="true"
                className="h-0.5 w-7 shrink-0 origin-left bg-secondary"
              />
              Why choose Hitouch Global
            </motion.p>

            <motion.h2
              variants={introItem}
              id={headingId}
              className="
                max-w-[600px] text-balance
                text-[clamp(2rem,3.6vw,3.25rem)]
                font-semibold leading-[1.2]
                tracking-[-0.025em] text-ink
              "
            >
              Your ambition deserves the right support.
            </motion.h2>

            <motion.p
              variants={introItem}
              className="mt-5 max-w-[54ch] text-base leading-[1.85] text-muted"
            >
              Studying abroad brings important decisions. Hitouch Global helps
              you explore your options and prepare the practical steps ahead.
            </motion.p>
          </motion.div>

          {/* Photograph and supporting message */}
          <motion.figure
            ref={figureRef}
            variants={figure}
            initial={reduceMotion ? false : "hidden"}
            whileInView="show"
            viewport={VIEWPORT}
            className="
              relative m-0 w-full min-w-0
              max-w-[560px] justify-self-center
              lg:col-start-1 lg:row-start-1
              lg:row-span-2 lg:max-w-none lg:self-center
            "
          >
            <motion.div
              variants={photoFrame}
              className="
                aspect-[5/4] overflow-hidden
                rounded-[20px] bg-brand/5
                sm:rounded-[24px]
              "
            >
              <motion.div
                style={reduceMotion ? undefined : { y: imageY, scale: 1.12 }}
                className="h-full w-full"
              >
                <motion.div variants={photoSettle} className="h-full w-full">
                  <ConsultationImage key={imageSrc} src={imageSrc} alt={imageAlt} />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.figcaption
              variants={caption}
              className="
                relative z-10 -mt-10 mx-5
                rounded-xl border border-line
                bg-white p-5
                shadow-[0_16px_40px_-24px_rgba(64,64,65,0.35)]
                sm:ml-10 sm:mr-6 sm:p-6 lg:mr-4
              "
            >
              <span
                aria-hidden="true"
                className="mb-4 block h-0.5 w-9 bg-secondary"
              />

              <p
                className="
                  text-lg font-semibold leading-[1.4]
                  tracking-[-0.02em] text-ink sm:text-xl
                "
              >
                A clearer place to start.
              </p>

              <p className="mt-2 text-sm leading-[1.8] text-muted">
                Bring your questions. Let’s explore your next steps together.
              </p>
            </motion.figcaption>
          </motion.figure>

          {/* Reasons and primary action */}
          <div className="min-w-0 lg:col-start-2 lg:row-start-2">
            <ul className="m-0 list-none divide-y divide-line p-0">
              {reasons.map((reason) => (
                <motion.li
                  key={reason.id}
                  variants={row}
                  initial={reduceMotion ? false : "hidden"}
                  whileInView="show"
                  viewport={VIEWPORT}
                  className="
                    group grid grid-cols-[44px_minmax(0,1fr)]
                    gap-4 py-5
                    first:pt-0 last:pb-0 sm:gap-5
                  "
                >
                  <motion.div variants={tile} className="mt-0.5">
                    <span
                      className="
                        flex h-11 w-11
                        items-center justify-center
                        rounded-xl bg-brand text-white
                        transition-transform duration-300
                        motion-safe:group-hover:scale-[1.06]
                        motion-reduce:transition-none
                      "
                    >
                      <BenefitIcon
                        type={reason.id}
                        animated
                        reduceMotion={reduceMotion}
                      />
                    </span>
                  </motion.div>

                  <motion.div variants={text} className="min-w-0">
                    <h3
                      className="
                        text-[17px] font-semibold
                        leading-[1.45] tracking-[-0.015em]
                        text-ink sm:text-lg
                      "
                    >
                      {reason.title}
                    </h3>

                    <p className="mt-2 text-sm leading-[1.85] text-muted">
                      {reason.description}
                    </p>
                  </motion.div>
                </motion.li>
              ))}
            </ul>

            <motion.div
              variants={block}
              initial={reduceMotion ? false : "hidden"}
              whileInView="show"
              viewport={VIEWPORT}
              className="mt-8 sm:mt-9"
            >
              <Link
                to="/contact"
                className="
                  group relative inline-flex min-h-[54px] w-full
                  items-center justify-center gap-5 overflow-hidden
                  rounded-md bg-brand px-6 py-4
                  text-sm font-semibold text-white
                  transition-[background-color,box-shadow,transform]
                  duration-200
                  hover:bg-[#009CD6]
                  hover:shadow-[0_8px_24px_-12px_rgba(0,174,239,0.5)]
                  focus-visible:outline-2 focus-visible:outline-offset-4
                  focus-visible:outline-brand
                  motion-safe:hover:-translate-y-0.5
                  motion-reduce:transition-none
                  sm:w-auto
                "
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

                <span className="relative">Talk to an advisor</span>

                <Arrow
                  className="
                    relative shrink-0 text-white
                    transition-transform duration-200
                    motion-safe:group-hover:translate-x-1
                    motion-safe:group-focus-visible:translate-x-1
                    motion-reduce:transition-none
                  "
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}