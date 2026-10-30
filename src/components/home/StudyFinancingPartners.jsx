import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1];

// Plays once, the first time the element enters the viewport.
const VIEWPORT = { once: true, amount: 0.2, margin: "0px 0px -6% 0px" };

const partners = [
  {
    name: "CIBC",
    logo: "https://hitouchglobal.com/wp-content/uploads/2024/05/cibc-1024x536.jpg",
    width: 1024,
    height: 536,
    logoClass: "max-w-[180px]",
  },
  {
    name: "MPOWER Financing",
    logo: "https://hitouchglobal.com/wp-content/uploads/2024/05/M-Power-logo.png",
    width: 253,
    height: 120,
    logoClass: "max-w-[240px]",
  },
];

function PartnerLogo({ partner }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex h-40 items-center justify-center px-6 sm:h-44">
      {failed ? (
        <span className="text-center text-xl font-semibold text-[#404041]">
          {partner.name}
        </span>
      ) : (
        <img
          src={partner.logo}
          alt={partner.name}
          width={partner.width}
          height={partner.height}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-auto w-full object-contain ${partner.logoClass}`}
        />
      )}
    </div>
  );
}

function Arrow() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="
        relative shrink-0 text-white
        transition-transform duration-200
        motion-safe:group-hover:translate-x-1
        motion-safe:group-focus-visible:translate-x-1
        motion-reduce:transition-none
      "
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function StudyFinancingPartners() {
  const reduceMotion = useReducedMotion();

  const offset = reduceMotion ? 0 : 36;

  // The whole panel arrives first, then its two halves follow.
  const panel = {
    hidden: {
      opacity: 0,
      y: offset,
      scale: reduceMotion ? 1 : 0.985,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.8,
        ease: EASE,
        staggerChildren: reduceMotion ? 0 : 0.14,
        delayChildren: reduceMotion ? 0 : 0.15,
      },
    },
  };

  const intro = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.1 },
    },
  };

  const rise = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.7, ease: EASE },
    },
  };

  const bar = {
    hidden: { scaleX: reduceMotion ? 1 : 0 },
    show: {
      scaleX: 1,
      transition: { duration: reduceMotion ? 0 : 0.7, ease: EASE },
    },
  };

  const list = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.14,
        delayChildren: reduceMotion ? 0 : 0.1,
      },
    },
  };

  const card = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 28,
      scale: reduceMotion ? 1 : 0.97,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.75,
        ease: EASE,
        staggerChildren: reduceMotion ? 0 : 0.1,
        delayChildren: reduceMotion ? 0 : 0.15,
      },
    },
  };

  const logo = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: reduceMotion ? 0 : 0.8, ease: EASE },
    },
  };

  const label = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: reduceMotion ? 0 : 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      aria-labelledby="financing-title"
      className="
        overflow-hidden bg-white font-sans
        pb-16 pt-6
        sm:pb-20 sm:pt-8
        lg:pb-24 lg:pt-10
      "
    >
      <div className="site-container">
        <motion.div
          variants={panel}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={VIEWPORT}
          className="
            rounded-[24px] border border-[#E3EDF2]
            bg-[#F6FBFE] p-6 sm:p-10 lg:p-12
          "
        >
          <div
            className="
              grid items-center gap-10
              lg:grid-cols-[1fr_1.05fr]
              lg:gap-12 xl:gap-16
            "
          >
            {/* Section introduction */}
            <motion.div variants={intro} className="min-w-0">
              <motion.div variants={rise} className="mb-5 flex items-center gap-3">
                <motion.span
                  variants={bar}
                  aria-hidden="true"
                  className="
                    h-0.5 w-7 shrink-0 origin-left
                    rounded-full bg-[#FD933D]
                  "
                />

                <p
                  className="
                    text-[10px] font-bold uppercase
                    leading-relaxed tracking-[0.15em]
                    text-[#6F6F73] sm:text-[11px]
                  "
                >
                  Study Financing Partners
                </p>
              </motion.div>

              <motion.h2
                variants={rise}
                id="financing-title"
                className="
                  max-w-[540px] text-balance
                  text-[clamp(1.875rem,3.1vw,2.75rem)]
                  font-semibold leading-[1.25]
                  tracking-[-0.035em] text-[#404041]
                "
              >
                Don’t let finances stop you from achieving your dreams.
              </motion.h2>

              <motion.p
                variants={rise}
                className="
                  mt-5 max-w-[450px] text-sm
                  leading-[1.9] text-[#6F6F73]
                  sm:text-[15px]
                "
              >
                Explore study financing options with our partners. Speak with
                our team about your plans and the next steps to consider.
              </motion.p>

              <motion.div variants={rise} className="mt-7">
                <Link
                  to="/contact"
                  className="
                    group relative inline-flex min-h-[54px]
                    w-full items-center justify-center
                    gap-4 overflow-hidden rounded-md bg-[#00AEEF]
                    px-6 py-3.5 text-sm font-semibold
                    text-white
                    transition-[background-color,box-shadow,transform]
                    duration-200
                    hover:bg-[#009CD6]
                    hover:shadow-[0_8px_24px_-12px_rgba(0,174,239,0.5)]
                    focus-visible:outline-2 focus-visible:outline-offset-4
                    focus-visible:outline-[#00AEEF]
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
                  <Arrow />
                </Link>
              </motion.div>
            </motion.div>

            {/* Financing partner cards */}
            <motion.ul
              variants={list}
              aria-label="Study financing partners"
              className="
                m-0 grid min-w-0 list-none
                gap-4 p-0 sm:grid-cols-2
              "
            >
              {partners.map((partner) => (
                <motion.li
                  key={partner.logo}
                  variants={card}
                  className="min-w-0"
                >
                  <div
                    className="
                      group h-full overflow-hidden rounded-xl
                      border border-[#E6EDF1] bg-white
                      shadow-[0_8px_28px_-16px_rgba(64,64,65,0.18)]
                      transition-[transform,border-color,box-shadow]
                      duration-300 ease-out
                      hover:border-[#00AEEF]/50
                      hover:shadow-[0_18px_40px_-22px_rgba(0,174,239,0.4)]
                      motion-safe:hover:-translate-y-1
                      motion-reduce:transition-none
                    "
                  >
                    <motion.div variants={logo}>
                      <PartnerLogo partner={partner} />
                    </motion.div>

                    <motion.div
                      variants={label}
                      aria-hidden="true"
                      className="
                        relative border-t border-[#EEF2F4]
                        px-4 py-4 text-center
                        text-xs font-semibold
                        leading-relaxed text-[#6F6F73]
                      "
                    >
                      {/* Accent line that grows under the label on hover */}
                      <span
                        className="
                          absolute inset-x-0 top-[-1px] h-0.5 origin-left
                          scale-x-0 bg-[#00AEEF]
                          transition-transform duration-500 ease-out
                          group-hover:scale-x-100
                          motion-reduce:transition-none
                        "
                      />
                      {partner.name}
                    </motion.div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}