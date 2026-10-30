import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "motion/react";

const AUTOPLAY_INTERVAL = 7_000;

// Sample universities. Replace with your confirmed partners.
const universities = [
  {
    name: "Coventry University",
    logo: "https://hitouchglobal.com/wp-content/uploads/2024/04/coventry-university.png",
  },
  {
    name: "University of Windsor",
    logo: "https://hitouchglobal.com/wp-content/uploads/2024/04/uwin-logo-new.webp",
  },
  {
    name: "Cape Breton University",
    logo: "https://hitouchglobal.com/wp-content/uploads/2024/04/CBU.png",
  },
  {
    name: "Canterbury Christ Church University",
    logo: "https://hitouchglobal.com/wp-content/uploads/2024/04/CANTERBURY-CHRIST-CHURCH-UNI.webp",
  },
  {
    name: "University of Portsmouth",
    logo: "https://www.port.ac.uk/themes/custom/portsmouth/logo.svg",
  },
  {
    name: "University of Hertfordshire",
    logo: "https://www.herts.ac.uk/__data/assets/git_bridge/0005/258683/dist/mysource_files/herts-logo.svg?h=987654321",
    dark: true,
  },
  {
    name: "University of Greenwich",
    logo: "https://www.gre.ac.uk/__data/assets/image/0035/265688/logo_final_on_white.png",
  },
  {
    name: "The University of Manchester",
    logo: "https://assets.manchester.ac.uk/corporate/images/design/logo-university-of-manchester.png",
  },
  {
    name: "University of Birmingham",
    logo: "https://www.birmingham.ac.uk/Images/logos/uob/uob-uk-logo-light.svg",
  },
  {
    name: "University of Nottingham",
    logo: "https://www.nottingham.ac.uk/etc.clientlibs/uon/clientlibs/clientlib-v2/resources/images/UoN-Logo-Light.svg",
  },
  {
    name: "University of Oxford",
    logo: "https://www.ox.ac.uk/themes/custom/numiko/dist/oxford-logo-DzIWfeXH.svg",
  },
  {
    name: "University of Sheffield",
    logo: "https://www.sheffield.ac.uk/themes/custom/uos_public/images/logos/uos-crest.svg",
  },
];

function Arrow({ left = false }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={left ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6"}
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function UniversityLogo({ university, reduceMotion }) {
  const [failed, setFailed] = useState(false);

  return (
    <li className="min-w-0 snap-start">
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={{ duration: 0.25 }}
        className={`
          flex h-32 items-center justify-center
          rounded-xl border border-line
          px-4 py-6 sm:h-36 sm:px-6
          transition-shadow duration-300
          hover:shadow-[0_10px_30px_-15px_rgba(64,64,65,0.2)]
          motion-reduce:transition-none
          ${university.dark ? "bg-ink text-white" : "bg-white text-ink"}
        `}
      >
        {failed ? (
          <span className="text-center text-sm font-semibold leading-relaxed">
            {university.name}
          </span>
        ) : (
          <img
            src={university.logo}
            alt={university.name}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => setFailed(true)}
            className="h-auto max-h-20 w-auto max-w-full select-none object-contain"
          />
        )}
      </motion.div>
    </li>
  );
}

function getStops(track) {
  const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
  const trackLeft = track.getBoundingClientRect().left;
  const stops = [0];

  for (const card of track.children) {
    const left =
      card.getBoundingClientRect().left - trackLeft + track.scrollLeft;

    const stop = Math.min(maximum, Math.max(0, left));

    if (Math.abs(stop - stops[stops.length - 1]) > 2) {
      stops.push(stop);
    }
  }

  return stops;
}

function nearestStop(stops, left) {
  return stops.reduce(
    (best, stop, index) =>
      Math.abs(stop - left) < Math.abs(stops[best] - left) ? index : best,
    0
  );
}

export default function UniversityPartners() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const carouselId = useId();
  const reduceMotion = useReducedMotion();
  const inView = useInView(sectionRef, { amount: 0.25 });

  const [position, setPosition] = useState({ index: 0, count: 1 });

  // Autoplay state
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [cycle, setCycle] = useState(0);

  const canAutoplay = !reduceMotion && position.count > 1;
  const autoplayOn = canAutoplay && !userPaused;
  const running =
    autoplayOn && inView && !hovering && !focused && !touching && !tabHidden;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame;

    function update() {
      const stops = getStops(track);
      const index = nearestStop(stops, track.scrollLeft);

      setPosition((previous) =>
        previous.index === index && previous.count === stops.length
          ? previous
          : { index, count: stops.length }
      );
    }

    function scheduleUpdate() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    }

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(track);

    track.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    update();

    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    function sync() {
      setTabHidden(document.hidden);
    }
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  /*
   * direction: -1 | 1 | "first" | "last" | "loop"
   * "loop" moves forward and wraps to the start (used by autoplay).
   */
  function navigate(direction) {
    const track = trackRef.current;
    if (!track) return;

    const stops = getStops(track);
    const current = nearestStop(stops, track.scrollLeft);
    const lastIndex = stops.length - 1;

    let target;

    if (direction === "first") target = 0;
    else if (direction === "last") target = lastIndex;
    else if (direction === "loop") target = current >= lastIndex ? 0 : current + 1;
    else target = Math.min(lastIndex, Math.max(0, current + direction));

    track.scrollTo({
      left: stops[target],
      behavior: reduceMotion ? "auto" : "smooth",
    });

    // Any movement restarts the 7 second countdown.
    setCycle((value) => value + 1);
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby={`${carouselId}-heading`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovering(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setHovering(false);
      }}
      onTouchStart={() => setTouching(true)}
      onTouchEnd={() => setTouching(false)}
      onTouchCancel={() => setTouching(false)}
      onFocus={(event) => {
        // Only pause for keyboard focus, not after a mouse click on a button.
        if (event.target.matches(":focus-visible")) setFocused(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
        }
      }}
      className="overflow-hidden bg-white py-14 font-sans sm:py-18 lg:py-20"
    >
      <style>{`
        @keyframes partners-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>

      <div className="site-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          className="
            mb-8 flex flex-col justify-between gap-6
            sm:flex-row sm:items-end
          "
        >
          <div className="max-w-[650px]">
            <p
              className="
                mb-4 flex items-center gap-3
                text-[11px] font-bold uppercase
                tracking-[0.16em] text-muted
              "
            >
              <span aria-hidden="true" className="h-0.5 w-7 bg-secondary" />
              University partners
            </p>

            <h2
              id={`${carouselId}-heading`}
              className="
                text-[clamp(1.85rem,3.2vw,2.8rem)]
                font-semibold leading-[1.25]
                tracking-[-0.025em] text-ink
              "
            >
              Big ambitions.
              <br />
              Global possibilities.
            </h2>

            <p className="mt-4 text-sm leading-[1.85] text-muted sm:text-base">
              Discover where your next chapter could begin.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label="Previous universities"
              aria-controls={carouselId}
              onClick={() => navigate(-1)}
              className="
                flex h-12 w-12 items-center justify-center
                rounded-full border border-line
                bg-white text-ink transition-colors
                hover:border-brand hover:bg-brand-soft
                motion-reduce:transition-none
              "
            >
              <Arrow left />
            </button>

            <button
              type="button"
              aria-label="Next universities"
              aria-controls={carouselId}
              onClick={() => navigate(1)}
              className="
                flex h-12 w-12 items-center justify-center
                rounded-full border border-brand
                bg-brand text-white transition-colors
                hover:bg-[#33BEF2]
                motion-reduce:transition-none
              "
            >
              <Arrow />
            </button>
          </div>
        </motion.div>

        <p id={`${carouselId}-help`} className="sr-only">
          Swipe or use the arrow buttons to browse universities. When this
          list is focused, use the left and right arrow keys, Home or End.
          The list scrolls automatically every 7 seconds and pauses while you
          hover, touch or focus it.
        </p>

        <ul
          id={carouselId}
          ref={trackRef}
          tabIndex={0}
          aria-label="University logos"
          aria-describedby={`${carouselId}-help`}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;

            const actions = {
              ArrowLeft: -1,
              ArrowRight: 1,
              Home: "first",
              End: "last",
            };

            if (event.key in actions) {
              event.preventDefault();
              navigate(actions[event.key]);
            }
          }}
          className="
            relative m-0 grid list-none grid-flow-col gap-4
            auto-cols-[calc((100%_-_1rem)/2)]
            overflow-x-auto overscroll-x-contain
            snap-x snap-mandatory pt-3 pb-6
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            sm:auto-cols-[calc((100%_-_2rem)/3)]
            lg:auto-cols-[calc((100%_-_3rem)/4)]
            xl:auto-cols-[calc((100%_-_4rem)/5)]
          "
        >
          {universities.map((university) => (
            <UniversityLogo
              key={university.logo}
              university={university}
              reduceMotion={reduceMotion}
            />
          ))}
        </ul>

        {/* Footer: the top border doubles as the 7 second progress track */}
        <div
          className="
            relative mt-2 flex flex-wrap items-center justify-between
            gap-x-4 gap-y-1 border-t border-line pt-4
          "
        >
          {autoplayOn && (
            <span
              key={`${position.index}-${cycle}`}
              aria-hidden="true"
              onAnimationEnd={() => navigate("loop")}
              className="
                pointer-events-none absolute left-0 top-[-1px]
                h-0.5 w-full origin-left bg-secondary
              "
              style={{
                animation: `partners-progress ${AUTOPLAY_INTERVAL}ms linear forwards`,
                animationPlayState: running ? "running" : "paused",
              }}
            />
          )}

          <div className="flex items-center gap-4">
            <span
              role="status"
              aria-live={running ? "off" : "polite"}
              className="text-xs font-medium tabular-nums text-muted"
            >
              <span className="sr-only">Carousel position </span>

              {String(position.index + 1).padStart(2, "0")}
              <span className="mx-2 text-muted/50">/</span>
              {String(position.count).padStart(2, "0")}
            </span>

            {canAutoplay && (
              <button
                type="button"
                onClick={() => setUserPaused((current) => !current)}
                aria-label={
                  userPaused
                    ? "Start automatic scrolling"
                    : "Pause automatic scrolling"
                }
                className="
                  inline-flex min-h-11 items-center gap-2
                  rounded-md px-2 text-xs font-medium text-muted
                  transition-colors hover:text-ink
                  motion-reduce:transition-none
                "
              >
                <PlaybackIcon playing={!userPaused} />
                {userPaused ? "Play" : "Pause"}
              </button>
            )}
          </div>

          <Link
            to="/partners/universities"
            className="
              inline-flex min-h-11 items-center gap-3
              text-sm font-semibold text-ink hover:underline
            "
          >
            Explore universities
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}