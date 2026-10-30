import { useId } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

function SearchIllustration() {
  const shadowId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 280 210"
      width="280"
      height="210"
      aria-hidden="true"
      focusable="false"
      className="h-auto w-52 shrink-0 sm:w-60"
    >
      <defs>
        <filter
          id={shadowId}
          x="-30%"
          y="-30%"
          width="160%"
          height="180%"
        >
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="8"
            floodColor="#404041"
            floodOpacity="0.09"
          />
        </filter>
      </defs>

      <circle cx="140" cy="100" r="84" fill="#EAF8FE" />

      <ellipse
        cx="143"
        cy="185"
        rx="88"
        ry="8"
        fill="#E5EEF3"
      />

      <circle
        cx="42"
        cy="81"
        r="4"
        fill="#00AEEF"
        opacity="0.25"
      />

      <circle
        cx="237"
        cy="58"
        r="3"
        fill="#00AEEF"
        opacity="0.45"
      />

      <rect
        x="64"
        y="39"
        width="155"
        height="126"
        rx="16"
        fill="#DDF2FC"
        stroke="#C4E8F8"
        transform="rotate(-8 140 105)"
      />

      <g filter={`url(#${shadowId})`}>
        <rect
          x="52"
          y="29"
          width="168"
          height="128"
          rx="16"
          fill="white"
          stroke="#DCE8EF"
        />

        <path d="M53 62h166" stroke="#E6EDF1" />

        <circle cx="69" cy="46" r="3" fill="#00AEEF" />
        <circle cx="80" cy="46" r="3" fill="#D8E8F0" />
        <circle cx="91" cy="46" r="3" fill="#D8E8F0" />

        <rect
          x="69"
          y="78"
          width="42"
          height="43"
          rx="10"
          fill="#F0F9FD"
        />

        <path
          d="m77 94 13-8 13 8H77Zm3 4v12m10-12v12m10-12v12m-23 4h26"
          fill="none"
          stroke="#00AEEF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <rect
          x="124"
          y="84"
          width="64"
          height="6"
          rx="3"
          fill="#CFDCE4"
        />

        <rect
          x="124"
          y="98"
          width="47"
          height="5"
          rx="2.5"
          fill="#E3EBF0"
        />

        <rect
          x="70"
          y="134"
          width="77"
          height="5"
          rx="2.5"
          fill="#E3EBF0"
        />
      </g>

      <motion.g
        initial={
          reduceMotion
            ? false
            : { x: -15, y: -5, opacity: 0 }
        }
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{
          duration: reduceMotion ? 0 : 0.75,
          delay: reduceMotion ? 0 : 0.12,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <path
          d="m214 151 22 22"
          stroke="#00AEEF"
          strokeWidth="12"
          strokeLinecap="round"
        />

        <circle
          cx="194"
          cy="129"
          r="29"
          fill="white"
          stroke="#00AEEF"
          strokeWidth="6"
        />

        <circle
          cx="194"
          cy="129"
          r="20"
          fill="#F0FAFE"
        />

        <path
          d="M187 129h14"
          stroke="#8EB2C3"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <path
          d="M179 120a18 18 0 0 1 12-9"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </motion.g>
    </svg>
  );
}

export default function UniversityEmptyState({
  kind = "search",
  query = "",
  countryName = "Canada",
  onClear,
  onRetry,
  advisorTo = "/contact",
}) {
  const titleId = useId();
  const reduceMotion = useReducedMotion();

  const isSearch = kind === "search";
  const isError = kind === "error";

  const action = isSearch
    ? onClear
    : isError
      ? onRetry
      : null;

  const hasAction = typeof action === "function";

  const buttonClass = `
    inline-flex min-h-12 items-center justify-center
    rounded-md border px-5 py-3
    text-[13px] font-semibold
    transition-colors
    focus-visible:outline-[#00AEEF]
    focus-visible:outline-offset-4
    motion-reduce:transition-none
  `;

  return (
    <motion.div
      aria-labelledby={titleId}
      initial={
        reduceMotion ? false : { opacity: 0, y: 10 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.35,
      }}
      className="
        flex flex-col items-center justify-center
        gap-4 rounded-[20px]
        border border-[#E2EBF0] bg-[#F8FBFD]
        px-5 py-8 text-center
        sm:px-8 md:flex-row md:gap-10
        md:py-10 md:text-left
      "
    >
      <SearchIllustration />

      <div className="min-w-0 max-w-[430px]">
        <h3
          id={titleId}
          className="
            text-[23px] font-semibold
            leading-[1.35] tracking-[-0.025em]
            text-[#404041] sm:text-[27px]
          "
        >
          {isSearch
            ? "No matching universities"
            : isError
              ? "We couldn’t load the universities"
              : "Let’s explore your options"}
        </h3>

        <p className="mt-3 text-[15px] leading-[1.85] text-[#6F6F73]">
          {isSearch ? (
            <>
              No matches for{" "}
              <span className="break-words font-semibold text-[#404041]">
                “{query.trim()}”
              </span>{" "}
              in this list. Try a university name, a city,
              or a shorter search.
            </>
          ) : isError ? (
            "Please try again, or talk to an advisor for help with your university search."
          ) : (
            `University listings for ${countryName} aren’t available here yet. Our advisors can help you explore your study options.`
          )}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:justify-start">
          {hasAction && (
            <button
              type="button"
              onClick={action}
              className={`
                ${buttonClass}
                border-transparent bg-[#00AEEF]
                text-white hover:bg-[#009CD6]
              `}
            >
              {isSearch ? "Clear search" : "Try again"}
            </button>
          )}

          <Link
            to={advisorTo}
            className={`
              ${buttonClass}
              ${
                hasAction
                  ? `
                      border-[#00AEEF]/35 bg-white
                      text-[#007AA8] hover:bg-[#EDF9FE]
                    `
                  : `
                      border-transparent bg-[#00AEEF]
                      text-white hover:bg-[#009CD6]
                    `
              }
            `}
          >
            Talk to an advisor
          </Link>
        </div>
      </div>
    </motion.div>
  );
}