import { useId, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

const places = [
  {
    name: "Toronto",
    province: "Ontario",
    alt: "Toronto skyline and CN Tower at sunset, viewed across the water",
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Sunset_Toronto_Skyline_Panorama_Crop_from_Snake_Island.jpg/1280px-Sunset_Toronto_Skyline_Panorama_Crop_from_Snake_Island.jpg",
    thumbnail:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Sunset_Toronto_Skyline_Panorama_Crop_from_Snake_Island.jpg/330px-Sunset_Toronto_Skyline_Panorama_Crop_from_Snake_Island.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Sunset_Toronto_Skyline_Panorama_Crop_from_Snake_Island.jpg",
    credit: "Jchmrt",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  {
    name: "Moraine Lake",
    province: "Alberta",
    alt: "Moraine Lake beneath the snow-covered Valley of the Ten Peaks in Banff National Park",
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Moraine_Lake_17092005.jpg/1280px-Moraine_Lake_17092005.jpg",
    thumbnail:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Moraine_Lake_17092005.jpg/330px-Moraine_Lake_17092005.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Moraine_Lake_17092005.jpg",
    credit: "Gorgo",
    license: "Public domain",
    licenseUrl: "",
  },
  {
    name: "Vancouver",
    province: "British Columbia",
    alt: "Vancouver skyline and marina reflected in the water near Stanley Park",
    src: "https://upload.wikimedia.org/wikipedia/commons/d/de/Vancouver_Skyline_from_Stanley_Park_%2841045168080%29.jpg",
    thumbnail:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Vancouver_Skyline_from_Stanley_Park_%2841045168080%29.jpg/330px-Vancouver_Skyline_from_Stanley_Park_%2841045168080%29.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Vancouver_Skyline_from_Stanley_Park_(41045168080).jpg",
    credit: "Lee Coursey from Decatur, GA",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
  },
  {
    name: "Québec City",
    province: "Quebec",
    alt: "Château Frontenac and the illuminated streets of Québec City at night",
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Chateau_Frontenac_illuminated_at_night_in_Quebec_City.jpg/1280px-Chateau_Frontenac_illuminated_at_night_in_Quebec_City.jpg",
    thumbnail:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Chateau_Frontenac_illuminated_at_night_in_Quebec_City.jpg/330px-Chateau_Frontenac_illuminated_at_night_in_Quebec_City.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Chateau_Frontenac_illuminated_at_night_in_Quebec_City.jpg",
    credit: "Wilfredor",
    license: "CC0",
    licenseUrl:
      "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
  },
  {
    name: "Niagara Falls",
    province: "Ontario",
    alt: "A rainbow over the Horseshoe Falls at Niagara Falls",
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Maid_of_the_Mist_VII_approaching_the_Horseshoe_Falls%2C_West_view_20170418_1.jpg/1280px-Maid_of_the_Mist_VII_approaching_the_Horseshoe_Falls%2C_West_view_20170418_1.jpg",
    thumbnail:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Maid_of_the_Mist_VII_approaching_the_Horseshoe_Falls%2C_West_view_20170418_1.jpg/330px-Maid_of_the_Mist_VII_approaching_the_Horseshoe_Falls%2C_West_view_20170418_1.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Maid_of_the_Mist_VII_approaching_the_Horseshoe_Falls,_West_view_20170418_1.jpg",
    credit: "DXR",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
];

function Arrow({ previous = false }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={previous ? "rotate-180" : ""}
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

export default function CanadaGallery() {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState({});

  const pointerStart = useRef(null);
  const reduceMotion = useReducedMotion();
  const imageId = useId();
  const place = places[active];

  function move(direction) {
    setActive(
      (current) =>
        (current + direction + places.length) % places.length
    );
  }

  function markFailed(src) {
    setFailed((current) => ({ ...current, [src]: true }));
  }

  function handleKeys(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      setActive(places.length - 1);
    }
  }

  return (
    <motion.div
      role="region"
      aria-roledescription="carousel"
      aria-label="Canada photo gallery"
      onKeyDown={handleKeys}
      initial={
        reduceMotion ? false : { opacity: 0, y: 24 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.7,
        delay: reduceMotion ? 0 : 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="min-w-0"
    >
      <figure className="m-0">
        <div
          id={imageId}
          role="img"
          aria-label={
            failed[place.src]
              ? `${place.name}: photo unavailable`
              : place.alt
          }
          className="
            relative aspect-[4/3] touch-pan-y overflow-hidden
            rounded-[22px] bg-[#EAF7FD]
            shadow-[0_20px_55px_-30px_rgba(64,64,65,0.35)]
          "
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return;

            pointerStart.current = {
              x: event.clientX,
              y: event.clientY,
              id: event.pointerId,
            };

            event.currentTarget.setPointerCapture?.(
              event.pointerId
            );
          }}
          onPointerCancel={() => {
            pointerStart.current = null;
          }}
          onPointerUp={(event) => {
            const start = pointerStart.current;
            pointerStart.current = null;

            if (!start || event.pointerId !== start.id) return;

            const dx = event.clientX - start.x;
            const dy = event.clientY - start.y;

            if (
              Math.abs(dx) > 55 &&
              Math.abs(dx) > Math.abs(dy) * 1.3
            ) {
              move(dx < 0 ? 1 : -1);
            }
          }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={place.name}
              aria-hidden="true"
              initial={{
                opacity: 0,
                scale: reduceMotion ? 1 : 1.025,
              }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute inset-0"
            >
              {failed[place.src] ? (
                <div
                  className="
                    flex h-full items-center justify-center
                    px-6 text-center text-xl font-semibold
                    text-[#007AA8]
                  "
                >
                  {place.name}
                </div>
              ) : (
                <img
                  src={place.src}
                  alt=""
                  width="1280"
                  height="960"
                  decoding="async"
                  fetchPriority={active === 0 ? "high" : "auto"}
                  draggable={false}
                  onError={() => markFailed(place.src)}
                  className="
                    h-full w-full select-none object-cover
                  "
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-0
              bg-gradient-to-t from-black/80
              via-black/0 to-black/10
            "
          />

          <span
            aria-hidden="true"
            className="
              absolute left-5 top-5 rounded-full
              border border-white/30 bg-black/35
              px-3 py-2 text-[10px] font-bold uppercase
              tracking-[0.14em] text-white backdrop-blur-md
            "
          >
            Discover Canada
          </span>

          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-x-6 bottom-6
              text-white sm:inset-x-7 sm:bottom-7
            "
          >
            <p
              className="
                mb-2 text-[11px] font-semibold uppercase
                tracking-[0.14em] text-white/90
              "
            >
              {place.province}
            </p>

            <p
              className="
                text-[clamp(1.65rem,3vw,2.35rem)]
                font-semibold leading-tight
                tracking-[-0.035em]
              "
            >
              {place.name}
            </p>
          </div>
        </div>

        <figcaption
          className="
            mt-4 flex flex-wrap items-center
            justify-between gap-3
          "
        >
          <p
            aria-live="polite"
            aria-atomic="true"
            className="text-sm font-semibold text-[#404041]"
          >
            {place.name}

            <span
              className="
                ml-2 font-normal tabular-nums text-[#626268]
              "
            >
              {active + 1} / {places.length}
            </span>
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous Canada photo"
              aria-controls={imageId}
              className="
                flex h-11 w-11 items-center justify-center
                rounded-full border border-[#D9E4EB]
                bg-white text-[#404041] transition-colors
                hover:border-[#00AEEF] hover:bg-[#F0FAFE]
                focus-visible:outline-[#00AEEF]
                motion-reduce:transition-none
              "
            >
              <Arrow previous />
            </button>

            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next Canada photo"
              aria-controls={imageId}
              className="
                flex h-11 w-11 items-center justify-center
                rounded-full border border-[#D9E4EB]
                bg-white text-[#404041] transition-colors
                hover:border-[#00AEEF] hover:bg-[#F0FAFE]
                focus-visible:outline-[#00AEEF]
                motion-reduce:transition-none
              "
            >
              <Arrow />
            </button>
          </div>
        </figcaption>
      </figure>

      <div
        role="group"
        aria-label="Choose a Canada photo"
        className="mt-3 grid grid-cols-5 gap-2 sm:gap-3"
      >
        {places.map((item, index) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show ${item.name}`}
            aria-pressed={index === active}
            aria-controls={imageId}
            className={`
              group relative min-h-14 overflow-hidden
              rounded-lg border-2 bg-[#EAF7FD] p-0.5
              transition-[border-color,opacity] duration-200
              focus-visible:outline-[#00AEEF]
              sm:min-h-16 motion-reduce:transition-none
              ${
                index === active
                  ? "border-[#00AEEF] opacity-100"
                  : "border-transparent opacity-70 hover:opacity-100"
              }
            `}
          >
            <span
              className="
                absolute inset-0 flex items-center
                justify-center text-xs font-semibold
                text-[#404041]
              "
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            {!failed[item.thumbnail] && (
              <img
                src={item.thumbnail}
                alt=""
                width="330"
                height="220"
                loading="lazy"
                decoding="async"
                onError={() => markFailed(item.thumbnail)}
                className="
                  relative aspect-[4/3] h-full w-full
                  rounded-md object-cover
                "
              />
            )}
          </button>
        ))}
      </div>

      <p
        className="
          mt-3 min-h-9 text-[11px]
          leading-relaxed text-[#626268]
        "
      >
        Photo:{" "}
        <a
          href={place.source}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          {place.credit}
        </a>
        {" · "}
        <a
          href={place.licenseUrl || place.source}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          {place.license}
        </a>
      </p>
    </motion.div>
  );
}