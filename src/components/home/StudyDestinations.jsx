import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const EASE = [0.22, 1, 0.36, 1];

// Plays once, the first time the element enters the viewport.
const VIEWPORT = { once: true, amount: 0.2, margin: "0px 0px -6% 0px" };

const destinations = [
  {
    slug: "canada",
    name: "Canada",
    code: "CA",
    region: "North America",
    description: "Find your place in a world of possibilities.",
    photo: "photo-1517935706615-2717063c2225",
    alt: "Toronto's skyline and the CN Tower beside Lake Ontario",
    position: "50% 50%",
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    code: "UK",
    region: "Europe",
    description: "A new perspective. A new chapter.",
    photo: "photo-1513635269975-59663e0ac1ad",
    alt: "Tower Bridge and the River Thames in London",
    position: "50% 50%",
  },
  {
    slug: "united-states",
    name: "United States",
    code: "US",
    region: "North America",
    description: "Give your biggest ideas room to grow.",
    photo: "photo-1485871981521-5b1fd3805eee",
    alt: "The Empire State Building and New York City's skyline at sunset",
    position: "50% 45%",
  },
  {
    slug: "australia",
    name: "Australia",
    code: "AU",
    region: "Oceania",
    description: "Take your ambition somewhere new.",
    photo: "photo-1506973035872-a4ec16b8e8d9",
    alt: "Sydney Harbour with the Opera House and city skyline",
    position: "35% 50%",
  },
  {
    slug: "ireland",
    name: "Ireland",
    code: "IE",
    region: "Europe",
    description: "Discover a new place to learn and grow.",
    photo: "photo-1590089415225-401ed6f9db8e",
    alt: "Colourful houses and a cathedral overlooking the water in Ireland",
    position: "50% 40%",
  },
  {
    slug: "germany",
    name: "Germany",
    code: "DE",
    region: "Europe",
    description: "Turn your curiosity into your next chapter.",
    photo: "photo-1467269204594-9661b134dd2b",
    alt: "Traditional buildings and flowers along a street in Germany",
    position: "50% 50%",
  },
];

const IMAGE_WIDTHS = [600, 900, 1400];

const IMAGE_SIZES = [
  "(min-width: 1328px) 411px",
  "(min-width: 1024px) calc((100vw - 6rem) / 3)",
  "(min-width: 640px) calc((100vw - 4.5rem) / 2)",
  "calc(100vw - 2.5rem)",
].join(", ");

function photoUrl(photo, width) {
  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=80`;
}

/* Number of grid columns at the current breakpoint, used to stagger each row. */
function useColumns() {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const large = window.matchMedia("(min-width: 1024px)");
    const small = window.matchMedia("(min-width: 640px)");

    function update() {
      setColumns(large.matches ? 3 : small.matches ? 2 : 1);
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

function Arrow({ diagonal = false, className = "" }) {
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
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M5 12h14m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DestinationCard({ destination, index, columns, reduceMotion }) {
  const id = useId();
  const cardRef = useRef(null);
  const [imageFailed, setImageFailed] = useState(false);

  // Scroll-linked parallax: the photo drifts as the card crosses the screen.
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  const offset = reduceMotion ? 0 : 48;
  const delay = reduceMotion ? 0 : (index % columns) * 0.1;

  const card = {
    hidden: {
      opacity: 0,
      y: offset,
      scale: reduceMotion ? 1 : 0.97,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.75,
        delay,
        ease: EASE,
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : delay + 0.2,
      },
    },
  };

  const pill = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : -10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.5, ease: EASE },
    },
  };

  const content = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.7, ease: EASE },
    },
  };

  return (
    <motion.li
      ref={cardRef}
      className="min-w-0"
      variants={card}
      initial={reduceMotion ? false : "hidden"}
      whileInView="show"
      viewport={VIEWPORT}
    >
      <Link
        to={`/countries/${destination.slug}`}
        aria-labelledby={`${id}-name ${id}-action`}
        className="
          group relative isolate flex h-[360px] flex-col
          overflow-hidden rounded-2xl bg-ink text-white
          shadow-[0_8px_24px_-16px_rgba(0,0,0,0.35)]
          transition-[transform,box-shadow] duration-300 ease-out
          hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.45)]
          focus-visible:outline-2 focus-visible:outline-offset-4
          focus-visible:outline-ink
          motion-safe:hover:-translate-y-1
          motion-safe:focus-visible:-translate-y-1
          motion-reduce:transition-none
          sm:h-[400px] xl:h-[440px]
        "
      >
        {/* Destination photograph */}
        {imageFailed ? (
          <span
            aria-hidden="true"
            className="
              absolute left-6 top-10
              text-[8rem] font-bold leading-none
              tracking-tight text-white/10
            "
          >
            {destination.code}
          </span>
        ) : (
          <motion.div
            style={reduceMotion ? undefined : { y: imageY, scale: 1.16 }}
            className="absolute inset-0"
          >
            <img
              src={photoUrl(destination.photo, 900)}
              srcSet={IMAGE_WIDTHS.map(
                (width) => `${photoUrl(destination.photo, width)} ${width}w`
              ).join(", ")}
              sizes={IMAGE_SIZES}
              alt={destination.alt}
              width="900"
              height="1100"
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              style={{ objectPosition: destination.position }}
              className="
                h-full w-full object-cover
                transition-transform duration-700 ease-out
                motion-safe:group-hover:scale-[1.05]
                motion-safe:group-focus-visible:scale-[1.05]
                motion-reduce:transition-none
              "
            />
          </motion.div>
        )}

        {/* Keeps the text readable over every photograph */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0
            bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.08)_25%,rgba(0,0,0,0.65)_62%,rgba(0,0,0,0.92)_100%)]
          "
        />

        <div className="relative flex h-full flex-col p-6 xl:p-7">
          <motion.span
            variants={pill}
            className="
              inline-flex w-fit items-center rounded-full
              border border-white/25 bg-black/40
              px-3 py-1.5 text-[11px] font-medium tracking-wide
              supports-[backdrop-filter:blur(1px)]:backdrop-blur-md
            "
          >
            {destination.region}
          </motion.span>

          <motion.div variants={content} className="mt-auto pt-12">
            <h3
              id={`${id}-name`}
              className="
                text-[28px] font-semibold leading-[1.2]
                tracking-[-0.025em] text-white sm:text-[30px]
              "
            >
              {destination.name}
            </h3>

            <p className="mt-3 max-w-[30ch] text-sm leading-[1.75] text-white/90">
              {destination.description}
            </p>

            <div
              className="
                mt-5 flex items-center justify-between
                gap-4 border-t border-white/25 pt-4
              "
            >
              <span id={`${id}-action`} className="text-[13px] font-semibold">
                Explore destination
              </span>

              <span
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-full border border-white/30 bg-white/10
                  transition-colors duration-300
                  group-hover:border-brand group-hover:bg-brand
                  group-hover:text-white
                  group-focus-visible:border-brand
                  group-focus-visible:bg-brand
                  group-focus-visible:text-white
                  motion-reduce:transition-none
                "
              >
                <Arrow diagonal className="h-[18px] w-[18px]" />
              </span>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.li>
  );
}

export default function StudyDestinations() {
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
      id="study-destinations"
      aria-labelledby={headingId}
      className="
        overflow-hidden bg-white font-sans
        pb-16 pt-6
        sm:pb-20 sm:pt-8
        lg:pb-24 lg:pt-10
      "
    >
      <div className="site-container">
        {/* Section introduction */}
        <motion.header
          variants={header}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={VIEWPORT}
          className="
            mb-8 grid gap-5
            lg:mb-10 lg:grid-cols-[1.4fr_1fr]
            lg:items-end lg:gap-14
          "
        >
          <div>
            <motion.p
              variants={headerItem}
              className="
                mb-4 flex items-center gap-3
                text-[11px] font-bold uppercase
                tracking-[0.16em] text-muted
              "
            >
              <motion.span
                variants={bar}
                aria-hidden="true"
                className="h-0.5 w-7 origin-left bg-secondary"
              />
              Study destinations
            </motion.p>

            <motion.h2
              variants={headerItem}
              id={headingId}
              className="
                max-w-[650px]
                text-[clamp(2rem,4vw,3.5rem)]
                font-semibold leading-[1.18]
                tracking-[-0.025em] text-ink
              "
            >
              Where will your
              <br className="hidden sm:block" /> next chapter begin?
            </motion.h2>
          </div>

          <motion.p
            variants={headerItem}
            className="max-w-[44ch] text-base leading-[1.85] text-muted lg:pb-1"
          >
            Start with a place that inspires you. Explore your study
            destinations and imagine what your future could look like.
          </motion.p>
        </motion.header>

        {/* Destination cards */}
        <ul
          className="
            m-0 grid list-none grid-cols-1
            gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3
          "
        >
          {destinations.map((destination, index) => (
            <DestinationCard
              key={destination.slug}
              destination={destination}
              index={index}
              columns={columns}
              reduceMotion={reduceMotion}
            />
          ))}
        </ul>

        {/* Closing action */}
        <motion.div
          variants={closing}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={VIEWPORT}
          className="
            mt-10 flex flex-col items-start
            justify-between gap-5
            border-t border-line pt-8
            sm:flex-row sm:items-center
          "
        >
          <p className="max-w-[40ch] text-sm leading-[1.8] text-muted">
            You don’t need every answer to take the first step. Start
            exploring.
          </p>

          <Link
            to="/countries"
            className="
              group inline-flex min-h-[54px]
              w-full shrink-0 items-center justify-center
              gap-5 rounded-md bg-brand
              px-6 py-4 text-[13px] font-semibold text-white
              [text-shadow:0_1px_2px_rgba(0,0,0,0.22)]
              transition-colors duration-200
              hover:bg-[#33BEF2]
              focus-visible:outline-2 focus-visible:outline-offset-4
              focus-visible:outline-ink
              motion-reduce:transition-none sm:w-auto
            "
          >
            View all destinations

            <Arrow
              className="
                shrink-0 transition-transform duration-200
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