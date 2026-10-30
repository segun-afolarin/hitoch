import { useId } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1];

function Arrow({ diagonal = false, className = "" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path
        d={
          diagonal
            ? "M6 18 18 6M6 6h12v12"
            : "M5 12h14m-6-6 6 6-6 6"
        }
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NextStepArtwork({ reduceMotion }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      className="h-auto w-full overflow-visible"
    >
      {/* Fine architectural lines behind the artwork. */}
      <circle
        cx="200"
        cy="200"
        r="180"
        stroke="#D5E8F2"
      />

      <circle
        cx="200"
        cy="200"
        r="152"
        stroke="#E1EFF6"
      />

      <path
        d="M20 200h360M200 20v360"
        stroke="#E1EFF6"
      />

      <circle
        cx="200"
        cy="20"
        r="4"
        fill="#00AEEF"
      />

      <circle
        cx="380"
        cy="200"
        r="4"
        fill="white"
        stroke="#BBDDED"
      />

      {/* Layered surfaces create depth without a canvas. */}
      <rect
        x="70"
        y="140"
        width="210"
        height="210"
        rx="38"
        transform="rotate(-12 175 245)"
        fill="#E2F3FB"
        stroke="#CEE9F5"
      />

      <rect
        x="88"
        y="110"
        width="210"
        height="210"
        rx="38"
        transform="rotate(-6 193 215)"
        fill="white"
        stroke="#D3EAF5"
      />

      <motion.g
        variants={{
          hidden: {
            opacity: 0,
            y: 18,
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: reduceMotion ? 0 : 0.8,
              ease,
            },
          },
        }}
      >
        <rect
          x="110"
          y="80"
          width="210"
          height="210"
          rx="38"
          fill="#00AEEF"
        />

        <motion.path
          d="m168 232 94-94m-94 0h94v94"
          stroke="white"
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: {
              pathLength: 0,
              opacity: 0,
            },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: {
                duration: reduceMotion ? 0 : 0.8,
                delay: reduceMotion ? 0 : 0.2,
                ease,
              },
            },
          }}
        />
      </motion.g>
    </svg>
  );
}

export default function ClosingCTA() {
  const titleId = useId();
  const reduceMotion = useReducedMotion();

  const reveal = {
    hidden: {
      opacity: 0,
      y: 22,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.7,
        ease,
      },
    },
  };

  const buttonClass = `
    group inline-flex min-h-[58px]
    items-center justify-center gap-4
    rounded-lg border px-6 py-4
    text-sm font-semibold leading-relaxed
    transition-[background-color,border-color,box-shadow,transform]
    duration-200
    motion-safe:hover:-translate-y-0.5
    motion-safe:active:translate-y-0
    motion-reduce:transition-none
    focus-visible:outline focus-visible:outline-2
    focus-visible:outline-offset-4
    focus-visible:outline-[#00AEEF]
  `;

  return (
    <section
      aria-labelledby={titleId}
      className="
        overflow-hidden bg-[#F6FBFE] py-16 font-sans
        sm:py-20 lg:py-24
      "
    >
      <div className="site-container">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.1,
              },
            },
          }}
        >
          <motion.div
            variants={reveal}
            className="
              mb-8 flex items-center gap-3
              sm:mb-10
            "
          >
            <span
              aria-hidden="true"
              className="
                h-1.5 w-1.5 shrink-0
                rounded-full bg-[#00AEEF]
              "
            />

            <p
              className="
                text-[10px] font-semibold uppercase
                leading-relaxed tracking-[0.2em]
                text-[#6F6F73] sm:text-[11px]
              "
            >
              Your next chapter
            </p>

            <span
              aria-hidden="true"
              className="h-px w-12 bg-[#D4E7F0]"
            />
          </motion.div>

          <div
            className="
              grid items-center gap-12
              lg:grid-cols-[minmax(0,1.6fr)_minmax(240px,1fr)]
              lg:gap-8 xl:gap-12
            "
          >
            <div className="min-w-0">
              <motion.h2
                id={titleId}
                variants={reveal}
                className="
                  text-[clamp(2rem,4.5vw,4.25rem)]
                  font-semibold leading-[1.13]
                  tracking-[-0.045em] text-[#404041]
                "
              >
                Ready to take{" "}
                <span className="block text-[#00AEEF]">
                  your next step?
                </span>
              </motion.h2>

              <motion.p
                variants={reveal}
                className="
                  mt-6 max-w-[43ch]
                  text-sm leading-[1.9]
                  text-[#6F6F73] sm:text-base
                "
              >
                Create an account to get started, or talk
                through your study plans with an advisor.
              </motion.p>

              <motion.div
                variants={reveal}
                className="
                  mt-8 flex flex-col gap-3
                  sm:mt-9 sm:flex-row sm:flex-wrap
                "
              >
                <Link
                  to="/register"
                  className={`
                    ${buttonClass}
                    border-[#00AEEF] bg-[#00AEEF]
                    text-white
                    hover:border-[#009CD6]
                    hover:bg-[#009CD6]
                  `}
                >
                  Create an account

                  <Arrow
                    className="
                      transition-transform duration-200
                      motion-safe:group-hover:translate-x-1
                      motion-reduce:transition-none
                    "
                  />
                </Link>

                <Link
                  to="/contact"
                  className={`
                    ${buttonClass}
                    border-[#00AEEF]/45 bg-white
                    text-[#00AEEF]
                    hover:border-[#00AEEF]
                    hover:bg-[#F0FAFF]
                  `}
                >
                  Talk to an advisor

                  <Arrow
                    diagonal
                    className="
                      transition-transform duration-200
                      motion-safe:group-hover:-translate-y-0.5
                      motion-safe:group-hover:translate-x-0.5
                      motion-reduce:transition-none
                    "
                  />
                </Link>
              </motion.div>
            </div>

            {/* Simplified away on smaller screens. */}
            <motion.div
              aria-hidden="true"
              variants={reveal}
              className="
                pointer-events-none hidden
                w-full max-w-[380px]
                justify-self-end lg:block
              "
            >
              <NextStepArtwork
                reduceMotion={reduceMotion}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}