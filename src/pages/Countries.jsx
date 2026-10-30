import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";

const EASE = [0.22, 1, 0.36, 1];

const REGIONS = [
  "All destinations",
  "Europe",
  "North America",
  "Oceania",
];

const destinations = [
  {
    slug: "canada",
    name: "Canada",
    region: "North America",
    photo:
      "https://images.unsplash.com/photo-1559869824-929df9dab35e",
    alt: "The Toronto waterfront and CN Tower in Canada",
    description:
      "Explore Canadian study options and get guidance on choosing a course and preparing your application.",
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    region: "Europe",
    photo:
      "https://images.unsplash.com/photo-1486299267070-83823f5448dd",
    alt: "Big Ben and Westminster Bridge in London",
    description:
      "Discover study opportunities across England, Scotland, Wales, and Northern Ireland.",
  },
  {
    slug: "united-states",
    name: "United States",
    region: "North America",
    photo:
      "https://images.unsplash.com/photo-1644985163278-3cabba5b6ab7",
    alt: "A waterfront city skyline in the United States",
    description:
      "Consider different campuses, cities, and study pathways as you plan your next chapter.",
  },
  {
    slug: "australia",
    name: "Australia",
    region: "Oceania",
    photo:
      "https://images.unsplash.com/photo-1584772121849-56c717d6c542",
    alt: "The Sydney Opera House beside Sydney Harbour in Australia",
    description:
      "Explore studying in Australia and start planning your course, application, and life abroad.",
  },
  {
    slug: "ireland",
    name: "Ireland",
    region: "Europe",
    photo:
      "https://images.unsplash.com/photo-1683884492733-00474ae4aa59",
    alt: "Buildings along the River Liffey in Dublin, Ireland",
    description:
      "Take a closer look at studying in Ireland and preparing for life in a new place.",
  },
  {
    slug: "germany",
    name: "Germany",
    region: "Europe",
    photo:
      "https://images.unsplash.com/photo-1587330979470-3595ac045ab0",
    alt: "The illuminated Brandenburg Gate in Berlin, Germany",
    description:
      "Explore your study plans in Germany, from course choices to preparing your application.",
  },
];

const planningTopics = [
  {
    title: "Your study goals",
    detail:
      "The subjects and career direction that interest you.",
  },
  {
    title: "Your budget",
    detail:
      "Tuition, accommodation and the everyday costs to plan for.",
  },
  {
    title: "Your starting date",
    detail:
      "A timeline that gives you room to prepare your application.",
  },
];

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
        d={
          diagonal
            ? "M6 18 18 6M6 6h12v12"
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

function Globe({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function photoUrl(src, width) {
  if (!src.startsWith("https://images.unsplash.com/")) {
    return src;
  }

  const url = new URL(src);

  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", "80");

  return url.toString();
}

function DestinationPhoto({
  src,
  alt,
  label,
  priority = false,
  className = "",
  sizes = "(min-width: 1280px) 410px, (min-width: 768px) 46vw, 100vw",
}) {
  const [failedSource, setFailedSource] = useState(null);

  const responsive = src.startsWith(
    "https://images.unsplash.com/"
  );

  if (failedSource === src) {
    return (
      <div
        role="img"
        aria-label={`${label} destination illustration`}
        className="
          absolute inset-0 flex flex-col
          items-center justify-center gap-3
          bg-[#EAF7FD] p-6
        "
      >
        <Globe className="h-14 w-14 text-[#00AEEF]" />

        <span className="text-center text-sm font-semibold text-[#404041]">
          {label}
        </span>
      </div>
    );
  }

  return (
    <img
      src={photoUrl(src, 1000)}
      srcSet={
        responsive
          ? [480, 800, 1200, 1600]
              .map(
                (width) =>
                  `${photoUrl(src, width)} ${width}w`
              )
              .join(", ")
          : undefined
      }
      sizes={responsive ? sizes : undefined}
      alt={alt}
      width="1200"
      height="800"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setFailedSource(src)}
      className={`
        absolute inset-0 h-full w-full object-cover
        ${className}
      `}
    />
  );
}

function CountryCard({ country, index, reduceMotion }) {
  return (
    <motion.li
      initial={
        reduceMotion ? false : { opacity: 0, y: 24 }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduceMotion ? 0 : 0.6,
        delay: reduceMotion ? 0 : (index % 3) * 0.07,
        ease: EASE,
      }}
      className="min-w-0"
    >
      <Link
        to={`/countries/${country.slug}`}
        aria-label={`Explore ${country.name}`}
        className="
          group flex h-full flex-col overflow-hidden
          rounded-[20px] border border-[#DFE8ED]
          bg-white
          transition-[transform,border-color,box-shadow]
          duration-300
          hover:border-[#00AEEF]/50
          hover:shadow-[0_18px_42px_-26px_rgba(64,64,65,0.3)]
          focus-visible:outline-[#00AEEF]
          motion-safe:hover:-translate-y-1
          motion-reduce:transition-none
        "
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-[#EAF7FD]">
          <DestinationPhoto
            src={country.photo}
            alt={country.alt}
            label={country.name}
            className="
              transition-transform duration-700 ease-out
              motion-safe:group-hover:scale-[1.045]
              motion-safe:group-focus-visible:scale-[1.045]
              motion-reduce:transition-none
            "
          />

          <span
            className="
              absolute left-4 top-4 rounded-full
              border border-white/70 bg-white/95
              px-3 py-1.5 text-[10px] font-bold
              uppercase tracking-[0.1em] text-[#404041]
            "
          >
            {country.region}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3
            className="
              text-[25px] font-semibold leading-[1.3]
              tracking-[-0.035em] text-[#404041]
            "
          >
            {country.name}
          </h3>

          <p
            className="
              mb-6 mt-3 flex-1 text-[15px]
              leading-[1.85] text-[#626268]
            "
          >
            {country.description}
          </p>

          <span
            className="
              mt-auto flex min-h-[50px]
              items-center justify-between gap-3
              rounded-md bg-[#00AEEF] px-4 py-3
              text-[13px] font-semibold text-white
              transition-colors group-hover:bg-[#009CD6]
              motion-reduce:transition-none
            "
          >
            Explore {country.name}

            <Arrow
              diagonal
              className="
                shrink-0 transition-transform duration-200
                motion-safe:group-hover:-translate-y-0.5
                motion-safe:group-hover:translate-x-0.5
                motion-reduce:transition-none
              "
            />
          </span>
        </div>
      </Link>
    </motion.li>
  );
}

export default function Countries() {
  const reduceMotion = useReducedMotion();

  const [region, setRegion] = useState("All destinations");

  const visibleCountries = destinations.filter(
    (country) =>
      region === "All destinations" ||
      country.region === region
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  function reveal(delay = 0) {
    return {
      initial: reduceMotion
        ? false
        : { opacity: 0, y: 22 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.12 },
      transition: {
        duration: reduceMotion ? 0 : 0.7,
        delay: reduceMotion ? 0 : delay,
        ease: EASE,
      },
    };
  }

  function exploreDestinations(event) {
    event.preventDefault();

    const target = document.getElementById(
      "study-destinations"
    );

    target?.focus({ preventScroll: true });

    target?.scrollIntoView({
      behavior: reduceMotion ? "instant" : "smooth",
      block: "start",
    });
  }

  return (
    <>
      <Navbar />

      <main
        id="main-content"
        tabIndex={-1}
        className="bg-white font-sans text-[#404041]"
      >
        <title>Study Destinations | Hitouch Global</title>

        <meta
          name="description"
          content="Explore study destinations with Hitouch Global. Discover Canada, the United Kingdom, the United States, Australia, Ireland, and Germany."
        />

        {/* Introduction */}
        <section
          aria-labelledby="countries-title"
          className="
            overflow-hidden pb-12 pt-5
            sm:pt-7 lg:pb-16
          "
        >
          <div className="site-container">
            <nav
              aria-label="Breadcrumb"
              className="mb-7 sm:mb-10"
            >
              <ol className="m-0 flex list-none items-center gap-3 p-0 text-[13px]">
                <li>
                  <Link
                    to="/"
                    className="
                      inline-flex min-h-11 items-center
                      rounded-sm text-[#626268]
                      hover:text-[#404041] hover:underline
                      focus-visible:outline-[#00AEEF]
                    "
                  >
                    Home
                  </Link>
                </li>

                <li aria-hidden="true" className="text-[#6F6F73]">
                  /
                </li>

                <li>
                  <span
                    aria-current="page"
                    className="font-semibold"
                  >
                    Countries
                  </span>
                </li>
              </ol>
            </nav>

            <div
              className="
                grid items-center gap-9
                lg:grid-cols-[1.05fr_1fr]
                lg:gap-12 xl:gap-16
              "
            >
              <div className="min-w-0">
                <motion.p
                  {...reveal()}
                  className="
                    mb-5 flex items-center gap-3
                    text-[11px] font-bold uppercase
                    leading-relaxed tracking-[0.17em]
                    text-[#626268]
                  "
                >
                  <span
                    aria-hidden="true"
                    className="h-0.5 w-7 bg-[#00AEEF]"
                  />
                  Study destinations
                </motion.p>

                <h1
                  id="countries-title"
                  className="
                    max-w-[650px]
                    text-[clamp(2.35rem,4.6vw,4.1rem)]
                    font-semibold leading-[1.14]
                    tracking-[-0.045em]
                  "
                >
                  {[
                    "Find your next",
                    "study destination.",
                  ].map((line, index) => (
                    <span
                      key={line}
                      className="block overflow-hidden pb-1"
                    >
                      <motion.span
                        initial={
                          reduceMotion
                            ? false
                            : { y: "105%", opacity: 0 }
                        }
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.85,
                          delay: reduceMotion
                            ? 0
                            : 0.1 + index * 0.12,
                          ease: EASE,
                        }}
                        className={`
                          block
                          ${index === 1 ? "text-[#00AEEF]" : ""}
                        `}
                      >
                        {line}
                      </motion.span>
                    </span>
                  ))}
                </h1>

                <motion.div {...reveal(0.22)}>
                  <p
                    className="
                      mt-5 max-w-[480px] text-base
                      leading-[1.9] text-[#626268]
                      sm:text-[17px]
                    "
                  >
                    A new place to learn. A new perspective
                    to discover. Explore your study destinations
                    and start shaping a plan that feels right
                    for you.
                  </p>

                  <a
                    href="#study-destinations"
                    onClick={exploreDestinations}
                    className="
                      group mt-7 inline-flex min-h-[54px]
                      w-full items-center justify-center gap-5
                      rounded-md bg-[#00AEEF] px-6 py-3.5
                      text-sm font-semibold text-white
                      transition-colors hover:bg-[#009CD6]
                      focus-visible:outline-[#00AEEF]
                      motion-reduce:transition-none sm:w-auto
                    "
                  >
                    Explore destinations

                    <Arrow
                      className="
                        shrink-0 rotate-90
                        transition-transform duration-200
                        motion-safe:group-hover:translate-y-1
                        motion-reduce:transition-none
                      "
                    />
                  </a>

                  <p className="mt-4 text-[13px] leading-relaxed text-[#626268]">
                    Explore your options before creating an account.
                  </p>
                </motion.div>
              </div>

              <motion.figure
                {...reveal(0.14)}
                className="
                  relative m-0 min-w-0
                  pb-5 pr-4 sm:pr-5
                "
              >
                <div
                  aria-hidden="true"
                  className="
                    absolute bottom-0 right-0 top-7
                    w-[90%] rounded-[24px]
                    border border-[#CFEAF6] bg-[#F0FAFE]
                  "
                />

                <div
                  className="
                    relative aspect-[4/3] overflow-hidden
                    rounded-[22px] bg-[#EAF7FD]
                  "
                >
                  <motion.div
                    initial={
                      reduceMotion ? false : { scale: 1.06 }
                    }
                    animate={{ scale: 1 }}
                    transition={{
                      duration: reduceMotion ? 0 : 1.4,
                      ease: EASE,
                    }}
                    className="absolute inset-0"
                  >
                    <DestinationPhoto
                      src="https://images.unsplash.com/photo-1775623606645-470e04a881cb"
                      alt="Graduates celebrating together and throwing their caps into the air"
                      label="Your next chapter"
                      priority
                      sizes="(min-width: 1280px) 580px, (min-width: 1024px) 46vw, 100vw"
                    />
                  </motion.div>

                  <span
                    className="
                      absolute left-4 top-4 inline-flex
                      items-center gap-2.5 rounded-full
                      border border-white/70 bg-white/95
                      px-4 py-2 text-xs font-semibold
                      text-[#404041] sm:left-5 sm:top-5
                    "
                  >
                    <Globe className="h-4 w-4 text-[#00AEEF]" />
                    {destinations.length} study destinations
                  </span>
                </div>

                <figcaption
                  className="
                    relative mt-4 flex items-center gap-3
                    text-xs font-medium leading-relaxed
                    text-[#626268] sm:text-[13px]
                  "
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-8 shrink-0 bg-[#00AEEF]"
                  />
                  Your next chapter starts with a choice.
                </figcaption>
              </motion.figure>
            </div>
          </div>
        </section>

        {/* Destination directory */}
        <section
          id="study-destinations"
          tabIndex={-1}
          aria-labelledby="destinations-title"
          className="
            scroll-mt-4 border-y border-[#E6EDF1]
            bg-[#F8FBFD] py-10 focus:outline-none
            sm:py-12 lg:py-14
          "
        >
          <div className="site-container">
            <motion.div
              {...reveal()}
              className="
                mb-7 flex flex-col gap-4
                sm:flex-row sm:items-end
                sm:justify-between sm:gap-8
              "
            >
              <div>
                <p
                  className="
                    mb-3 text-[11px] font-bold uppercase
                    tracking-[0.16em] text-[#626268]
                  "
                >
                  Explore your possibilities
                </p>

                <h2
                  id="destinations-title"
                  className="
                    max-w-[640px]
                    text-[clamp(1.8rem,3vw,2.6rem)]
                    font-semibold leading-[1.25]
                    tracking-[-0.035em]
                  "
                >
                  Where would you like to study?
                </h2>
              </div>

              <p
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="shrink-0 text-sm text-[#626268]"
              >
                <span
                  className="
                    mr-1.5 font-semibold tabular-nums
                    text-[#404041]
                  "
                >
                  {visibleCountries.length}
                </span>

                {visibleCountries.length === 1
                  ? "destination"
                  : "destinations"}{" "}
                to explore
              </p>
            </motion.div>

            <div
              role="group"
              aria-label="Filter destinations by region"
              className="mb-7 flex flex-wrap gap-2 sm:mb-8"
            >
              {REGIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={region === item}
                  aria-controls="destination-results"
                  onClick={() => setRegion(item)}
                  className={`
                    min-h-11 rounded-full border
                    px-4 py-2 text-[13px] font-semibold
                    transition-colors duration-200
                    focus-visible:outline-[#00AEEF]
                    motion-reduce:transition-none
                    ${
                      region === item
                        ? "border-[#00AEEF] bg-[#00AEEF] text-white"
                        : "border-[#D8E4EB] bg-white text-[#55555A] hover:border-[#00AEEF] hover:bg-[#EFF9FE]"
                    }
                  `}
                >
                  {item}
                </button>
              ))}
            </div>

            <ul
              id="destination-results"
              className="
                m-0 grid list-none gap-5 p-0
                md:grid-cols-2 xl:grid-cols-3 xl:gap-6
              "
            >
              {visibleCountries.map((country, index) => (
                <CountryCard
                  key={country.slug}
                  country={country}
                  index={index}
                  reduceMotion={reduceMotion}
                />
              ))}
            </ul>
          </div>
        </section>

        {/* Advisor invitation */}
        <section
          aria-labelledby="countries-advice-title"
          className="pb-6 pt-12 sm:pb-8 sm:pt-14"
        >
          <div className="site-container">
            <motion.div
              {...reveal()}
              className="
                grid gap-8 rounded-[22px]
                border border-[#DCE8EE] bg-[#F5FBFE]
                p-6 sm:p-8
                lg:grid-cols-[1.1fr_1fr]
                lg:items-center lg:gap-14 lg:p-10
              "
            >
              <div>
                <p
                  className="
                    mb-4 text-[11px] font-bold uppercase
                    tracking-[0.15em] text-[#626268]
                  "
                >
                  Let’s find your direction
                </p>

                <h2
                  id="countries-advice-title"
                  className="
                    max-w-[460px]
                    text-[clamp(1.9rem,3.4vw,2.8rem)]
                    font-semibold leading-[1.22]
                    tracking-[-0.04em]
                  "
                >
                  Still deciding?
                  <br />
                  <span className="text-[#00AEEF]">
                    Let’s talk it through.
                  </span>
                </h2>

                <p
                  className="
                    mt-5 max-w-[440px] text-[15px]
                    leading-[1.9] text-[#626268]
                  "
                >
                  You don’t need to have everything figured out.
                  Talk through your goals with our team and get
                  help deciding where to start.
                </p>

                <Link
                  to="/contact"
                  className="
                    group mt-6 inline-flex min-h-[54px]
                    w-full items-center justify-center gap-5
                    rounded-md bg-[#00AEEF] px-6 py-3.5
                    text-sm font-semibold text-white
                    transition-colors hover:bg-[#009CD6]
                    focus-visible:outline-[#00AEEF]
                    motion-reduce:transition-none sm:w-auto
                  "
                >
                  Talk to an advisor
                  <Arrow diagonal className="shrink-0" />
                </Link>
              </div>

              <div
                className="
                  border-t border-[#DCE8EE] pt-6
                  lg:border-l lg:border-t-0
                  lg:pl-9 lg:pt-0
                "
              >
                <h3
                  className="
                    mb-2 text-xs font-bold uppercase
                    tracking-[0.12em]
                  "
                >
                  A useful starting point
                </h3>

                <ol className="m-0 list-none divide-y divide-[#DCE8EE] p-0">
                  {planningTopics.map((topic, index) => (
                    <li
                      key={topic.title}
                      className="flex items-start gap-4 py-5 last:pb-0"
                    >
                      <span
                        aria-hidden="true"
                        className="
                          pt-1 text-xs font-semibold
                          tabular-nums text-[#626268]
                        "
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <p className="text-[15px] font-semibold leading-relaxed">
                          {topic.title}
                        </p>

                        <p className="mt-1 text-[13px] leading-[1.8] text-[#626268]">
                          {topic.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}