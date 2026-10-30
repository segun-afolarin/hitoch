import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1];

// Plays once, the first time the element enters the viewport.
const VIEWPORT = { once: true, amount: 0.2, margin: "0px 0px -6% 0px" };

const featuredServices = [
  {
    id: "admission",
    title: "Admission Processing",
    description:
      "Get help preparing your documents, completing applications, and understanding each stage of the admission process.",
  },
  {
    id: "immigration",
    title: "Immigration Consultancy",
    description:
      "Understand the requirements relevant to your plans and get support with the documents involved in your application.",
  },
  {
    id: "loan",
    title: "Education Loan",
    description:
      "Explore education loan options and get guidance on the information and documents needed to apply.",
  },
  {
    id: "accommodation",
    title: "Accommodation",
    description:
      "Explore accommodation options that suit your destination, preferences, and plans for life abroad.",
  },
];

/* Columns at the current breakpoint, used to stagger each row. */
function useColumns() {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const large = window.matchMedia("(min-width: 1024px)");
    const small = window.matchMedia("(min-width: 640px)");

    function update() {
      setColumns(large.matches ? 4 : small.matches ? 2 : 1);
    }

    update();
    large.addEventListener("change", update);
    small.addEventListener("change", update);

    return () => {
      large.removeEventListener("change", update);
      small.removeEventListener("change", update);
    };
  }, []);

  return columns;
}

/* Icon strokes draw themselves as the card appears. */
function ServiceIcon({ type, reduceMotion }) {
  const draw = {
    hidden: { pathLength: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 },
    show: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: reduceMotion ? 0 : 0.9, ease: "easeInOut" },
    },
  };

  const artwork = {
    admission: (
      <>
        <motion.path
          variants={draw}
          d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"
        />
        <motion.path variants={draw} d="M14 3v6h6M8 15l2.5 2.5L16 12" />
      </>
    ),
    immigration: (
      <>
        <motion.circle variants={draw} cx="12" cy="12" r="9" />
        <motion.ellipse variants={draw} cx="12" cy="12" rx="4" ry="9" />
        <motion.path variants={draw} d="M3 12h18" />
      </>
    ),
    loan: (
      <>
        <motion.path variants={draw} d="m3 9 9-6 9 6H3ZM3 21h18M4 18h16" />
        <motion.path variants={draw} d="M6 9v9M10 9v9M14 9v9M18 9v9" />
      </>
    ),
    accommodation: (
      <>
        <motion.path variants={draw} d="m3 10 9-7 9 7M5 9v12h14V9" />
        <motion.path variants={draw} d="M9 21v-8h6v8" />
      </>
    ),
  };

  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-white"
    >
      {artwork[type]}
    </svg>
  );
}

function Arrow({ className = "" }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-white ${className}`}
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

function ServiceCard({ service, index, columns, reduceMotion }) {
  const offset = reduceMotion ? 0 : 40;
  const delay = reduceMotion ? 0 : (index % columns) * 0.1;

  const card = {
    hidden: {
      opacity: 0,
      y: offset,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.7,
        delay,
        ease: EASE,
        staggerChildren: reduceMotion ? 0 : 0.09,
        delayChildren: reduceMotion ? 0 : delay + 0.15,
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

  const rise = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.6, ease: EASE },
    },
  };

  return (
    <motion.li
      className="min-w-0"
      variants={card}
      initial={reduceMotion ? false : "hidden"}
      whileInView="show"
      viewport={VIEWPORT}
    >
      <Link
        to="/services"
        aria-label={`Learn more about ${service.title}`}
        className="
          group relative flex h-full flex-col
          rounded-xl border border-line
          border-t-2 border-t-brand
          bg-white p-6 xl:p-7
          transition-[transform,border-color,box-shadow]
          duration-300 ease-out
          hover:border-brand/60
          hover:shadow-[0_18px_45px_-24px_rgba(0,174,239,0.3)]
          focus-visible:outline-brand
          focus-visible:outline-offset-4
          motion-safe:hover:-translate-y-1
          motion-safe:focus-visible:-translate-y-1
          motion-reduce:transition-none
        "
      >
        {/* Service icon */}
        <motion.div variants={tile} className="mb-6 w-fit">
          <span
            className="
              flex h-14 w-14 shrink-0
              items-center justify-center
              rounded-xl bg-brand text-white
              shadow-[0_6px_16px_-8px_rgba(0,174,239,0.45)]
              transition-transform duration-300
              motion-safe:group-hover:scale-[1.06]
              motion-safe:group-focus-visible:scale-[1.06]
              motion-reduce:transition-none
            "
          >
            <ServiceIcon type={service.id} reduceMotion={reduceMotion} />
          </span>
        </motion.div>

        {/* Service message */}
        <motion.div variants={rise}>
          <h3
            className="
              text-xl font-semibold leading-[1.4]
              tracking-[-0.02em] text-ink
              sm:min-h-[3.5rem]
            "
          >
            {service.title}
          </h3>

          <p className="mb-7 mt-3 text-sm leading-[1.85] text-muted">
            {service.description}
          </p>
        </motion.div>

        {/* The entire card is one accessible link. */}
        <motion.div
          variants={rise}
          className="mt-auto border-t border-line pt-5"
        >
          <span
            className="
              relative inline-flex min-h-11 w-full
              items-center justify-between gap-4
              overflow-hidden rounded-md bg-brand px-4 py-3
              text-[13px] font-semibold text-white
              transition-colors duration-200
              group-hover:bg-[#009CD6]
              group-focus-visible:bg-[#009CD6]
              motion-reduce:transition-none
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
                group-focus-visible:translate-x-[450%]
                motion-reduce:hidden
              "
            />

            <span className="relative">Learn more</span>

            <Arrow
              className="
                relative transition-transform duration-200
                motion-safe:group-hover:translate-x-1
                motion-safe:group-focus-visible:translate-x-1
                motion-reduce:transition-none
              "
            />
          </span>
        </motion.div>
      </Link>
    </motion.li>
  );
}

export default function ServicesPreview() {
  const headingId = useId();
  const reduceMotion = useReducedMotion();
  const columns = useColumns();

  const offset = reduceMotion ? 0 : 28;

  const header = {
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

  const headerItem = {
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

  const closing = {
    hidden: {
      opacity: 0,
      y: offset,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.7, ease: EASE },
    },
  };

  return (
    <section
      id="our-services"
      aria-labelledby={headingId}
      className="
        overflow-hidden bg-white font-sans
        pb-16 pt-4
        sm:pb-20 sm:pt-6
        lg:pt-8
      "
    >
      <div className="site-container">
        {/* Section introduction */}
        <motion.div
          variants={header}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto mb-10 max-w-[720px] text-center sm:mb-12"
        >
          <motion.p
            variants={headerItem}
            className="
              mb-4 flex items-center justify-center gap-3
              text-[11px] font-bold uppercase
              tracking-[0.16em] text-muted
            "
          >
            <motion.span
              variants={bar}
              aria-hidden="true"
              className="h-0.5 w-7 origin-right bg-secondary"
            />
            Our services
            <motion.span
              variants={bar}
              aria-hidden="true"
              className="h-0.5 w-7 origin-left bg-secondary"
            />
          </motion.p>

          <motion.h2
            variants={headerItem}
            id={headingId}
            className="
              text-[clamp(2rem,3.8vw,3.25rem)]
              font-semibold leading-[1.2]
              tracking-[-0.025em] text-ink
            "
          >
            Support for your
            <br className="hidden sm:block" /> study journey.
          </motion.h2>

          <motion.p
            variants={headerItem}
            className="mx-auto mt-5 max-w-[54ch] text-base leading-[1.85] text-muted"
          >
            Get guidance with your admission, immigration plans, education
            financing, and accommodation. Take your next step with a clearer
            understanding of what comes next.
          </motion.p>
        </motion.div>

        {/* Four featured services */}
        <ul
          className="
            m-0 grid list-none grid-cols-1
            gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4
          "
        >
          {featuredServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              columns={columns}
              reduceMotion={reduceMotion}
            />
          ))}
        </ul>

        {/* Full services page */}
        <motion.div
          variants={closing}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={VIEWPORT}
          className="
            mt-9 flex flex-col items-start
            justify-between gap-5
            border-t border-line pt-7
            sm:mt-10 sm:flex-row sm:items-center
          "
        >
          <p className="max-w-[42ch] text-sm leading-[1.8] text-muted">
            Discover more ways we can support your journey.
          </p>

          <Link
            to="/services"
            className="
              group relative inline-flex min-h-[54px]
              w-full shrink-0 items-center justify-center
              gap-5 overflow-hidden rounded-md bg-brand
              px-7 py-4 text-sm font-semibold text-white
              transition-[background-color,box-shadow,transform]
              duration-200
              hover:bg-[#009CD6]
              hover:shadow-[0_8px_24px_-12px_rgba(0,174,239,0.5)]
              focus-visible:outline-brand
              focus-visible:outline-offset-4
              motion-safe:hover:-translate-y-0.5
              motion-reduce:transition-none
              sm:w-auto
            "
          >
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

            <span className="relative">View all services</span>

            <Arrow
              className="
                relative transition-transform duration-200
                motion-safe:group-hover:translate-x-1
                motion-reduce:transition-none
              "
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}