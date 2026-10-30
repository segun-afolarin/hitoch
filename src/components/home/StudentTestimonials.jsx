import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

// Replace these samples with approved feedback, then set sample: false.
// Choose avatar: "woman" or avatar: "man" for each student.
const writtenTestimonials = [
  {
    id: "written-01",
    name: "Sample student 04",
    avatar: "woman",
    detail: "Course and destination guidance",
    quote:
      "I had a goal, but I wasn’t sure where to begin. Talking through my options helped me understand what mattered to me — the course, the location, and the kind of future I wanted to build. My next step finally felt clear.",
    sample: true,
  },
  {
    id: "written-02",
    name: "Sample student 05",
    avatar: "man",
    detail: "Application preparation",
    quote:
      "Having a clear list of what to prepare made the application feel manageable. I could focus on one step at a time and ask questions whenever I needed clarity.",
    sample: true,
  },
  {
    id: "written-03",
    name: "Sample student 06",
    avatar: "woman",
    detail: "Preparing for life abroad",
    quote:
      "The small questions mattered to me too. Being able to talk through accommodation and arrival preparations helped me feel more comfortable about starting somewhere new.",
    sample: true,
  },
];

// Put your clips in public/videos/testimonials/.
//
// Example:
// videoSrc: "/videos/testimonials/student-01.mp4"
//
// Optional:
// posterSrc: "/images/testimonials/student-01.jpg"
// captionsSrc: "/videos/testimonials/student-01.vtt"
//
// Leave videoSrc empty until your real video is ready.
const videoTestimonials = [
  {
    id: "video-01",
    name: "Sample student 01",
    avatar: "woman",
    detail: "Course and destination guidance",
    videoSrc: "",
    posterSrc: "",
    captionsSrc: "",
    sample: true,
  },
  {
    id: "video-02",
    name: "Sample student 02",
    avatar: "man",
    detail: "Application preparation",
    videoSrc: "",
    posterSrc: "",
    captionsSrc: "",
    sample: true,
  },
  {
    id: "video-03",
    name: "Sample student 03",
    avatar: "woman",
    detail: "Preparing for life abroad",
    videoSrc: "",
    posterSrc: "",
    captionsSrc: "",
    sample: true,
  },
];

const formats = [
  {
    value: "written",
    label: "Written testimonials",
    icon: "written",
  },
  {
    value: "video",
    label: "Video testimonials",
    icon: "video",
  },
];

const cardClass =
  "m-0 flex h-full min-w-0 flex-col overflow-hidden rounded-[22px] " +
  "border border-[#E6EDF1] bg-white " +
  "shadow-[0_6px_24px_-14px_rgba(64,64,65,0.12)] " +
  "transition-[border-color,box-shadow] duration-300 " +
  "hover:border-[#00AEEF]/40 " +
  "hover:shadow-[0_12px_36px_-18px_rgba(0,174,239,0.22)] " +
  "motion-reduce:transition-none";

const controlClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border " +
  "transition-colors " +
  "disabled:cursor-not-allowed disabled:opacity-35 " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 " +
  "focus-visible:outline-[#404041] motion-reduce:transition-none";

function Icon({ name = "arrow", className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={"h-5 w-5 shrink-0 " + className}
    >
      {name === "arrow" && (
        <path d="M5 12h14m-6-6 6 6-6 6" />
      )}

      {name === "written" && (
        <>
          <rect
            x="4"
            y="3"
            width="16"
            height="18"
            rx="3"
          />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </>
      )}

      {name === "video" && (
        <>
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="4"
          />
          <path
            d="m10 9 5 3-5 3V9Z"
            fill="currentColor"
            stroke="none"
          />
        </>
      )}

      {name === "quote" && (
        <path
          d="M4 11h5v8H2v-8c0-4.5 2.5-7 7-7v3c-3 0-5 1.4-5 4Zm13 0h5v8h-7v-8c0-4.5 2.5-7 7-7v3c-3 0-5 1.4-5 4Z"
          fill="currentColor"
          stroke="none"
        />
      )}
    </svg>
  );
}

// Decorative illustrations, not photographs of the named students.
function StudentAvatar({
  variant = "woman",
  className = "h-12 w-12",
}) {
  const woman = variant === "woman";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={
        "shrink-0 overflow-hidden rounded-full ring-1 ring-black/5 " +
        className
      }
    >
      <circle
        cx="32"
        cy="32"
        r="32"
        fill={woman ? "#FFF3E8" : "#EAF8FE"}
      />

      {/* Long hair behind the face */}
      {woman && (
        <path
          d="M16 31C16 17 22 10 32 10s16 7 16 21v20H16V31Z"
          fill="#404041"
        />
      )}

      {/* Shoulders */}
      <path
        d="M9 64c1-13 9-20 23-20s22 7 23 20H9Z"
        fill={woman ? "#00AEEF" : "#FD933D"}
      />

      {/* Neck */}
      <path
        d="M26 39h12v9c-3 5-9 5-12 0v-9Z"
        fill="#D99A75"
      />

      {/* Ears */}
      <ellipse
        cx="20.5"
        cy="29"
        rx="3"
        ry="4"
        fill="#E7AF8B"
      />
      <ellipse
        cx="43.5"
        cy="29"
        rx="3"
        ry="4"
        fill="#E7AF8B"
      />

      {/* Face */}
      <path
        d="M20 25c0-9 5-14 12-14s12 5 12 14v6c0 9-5 15-12 15s-12-6-12-15v-6Z"
        fill="#E7AF8B"
      />

      {/* Hairstyle */}
      {woman ? (
        <path
          d="M19 28c-2-11 4-17 13-17 10 0 15 8 13 18-6-2-10-6-12-11-3 6-7 9-14 10Z"
          fill="#404041"
        />
      ) : (
        <path
          d="M19 28v-7c0-8 6-12 13-12 6 0 10 3 11 7 3 1 4 4 3 8l-2 5-2-8c-8 2-14 1-19-2l-2 9h-2Z"
          fill="#404041"
        />
      )}

      {/* Eyes */}
      <circle cx="27" cy="30" r="1.25" fill="#404041" />
      <circle cx="37" cy="30" r="1.25" fill="#404041" />

      {/* Smile */}
      <path
        d="M28 37c2.5 2 5.5 2 8 0"
        stroke="#9B5D43"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      {/* Collar */}
      <path
        d="m23 49 9 7 9-7"
        stroke="white"
        strokeOpacity=".75"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SampleBadge({ show }) {
  if (!show) return null;

  return (
    <span
      className="
        rounded-full border border-[#E6EDF1]
        bg-white px-2.5 py-1
        text-[10px] font-medium text-[#6F6F73]
      "
    >
      Sample testimonial
    </span>
  );
}

function StudentDetails({
  student,
  as: Component = "figcaption",
}) {
  return (
    <Component
      className="
        mt-6 flex items-center gap-3.5
        border-t border-[#E6EDF1] pt-5
      "
    >
      <StudentAvatar variant={student.avatar} />

      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#404041]">
          {student.name}
        </p>

        <p className="mt-1 text-xs leading-relaxed text-[#6F6F73]">
          {student.detail}
        </p>
      </div>
    </Component>
  );
}

function WrittenTestimonialCard({ testimonial }) {
  return (
    <figure className={cardClass + " p-6 sm:p-7 lg:p-8"}>
      <div className="mb-6 flex items-center justify-between gap-3">
        <span
          className="
            flex h-11 w-11 items-center justify-center
            rounded-xl bg-[#F0FAFE] text-[#00AEEF]
          "
        >
          <Icon name="quote" />
        </span>

        <SampleBadge show={testimonial.sample} />
      </div>

      <blockquote
        className="
          m-0 flex-1 text-[15px]
          leading-[1.9] text-[#404041]
          sm:text-base
        "
      >
        <p>“{testimonial.quote}”</p>
      </blockquote>

      <StudentDetails student={testimonial} />
    </figure>
  );
}

function VideoTestimonialCard({ testimonial }) {
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    // Pause when scrolled or swiped out of view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          !entry.isIntersecting ||
          entry.intersectionRatio < 0.2
        ) {
          video.pause();
        }
      },
      {
        threshold: [0, 0.2],
      }
    );

    function pauseWhenHidden() {
      if (document.hidden) {
        video.pause();
      }
    }

    observer.observe(video);

    document.addEventListener(
      "visibilitychange",
      pauseWhenHidden
    );

    return () => {
      // Also stops playback when switching to written testimonials.
      video.pause();
      observer.disconnect();

      document.removeEventListener(
        "visibilitychange",
        pauseWhenHidden
      );
    };
  }, [testimonial.videoSrc]);

  return (
    <figure className={cardClass}>
      {testimonial.videoSrc ? (
        <video
          ref={videoRef}
          src={testimonial.videoSrc}
          poster={testimonial.posterSrc || undefined}
          controls
          playsInline
          preload="none"
          aria-label={
            "Video testimonial from " + testimonial.name
          }
          onError={() => setFailed(true)}
          onLoadedMetadata={() => setFailed(false)}
          className="
            aspect-video w-full
            bg-[#404041] object-contain
            focus-visible:outline-2
            focus-visible:outline-offset-[-4px]
            focus-visible:outline-white
          "
        >
          {testimonial.captionsSrc && (
            <track
              kind="captions"
              src={testimonial.captionsSrc}
              srcLang={
                testimonial.captionsLanguage || "en"
              }
              label={
                testimonial.captionsLabel || "English"
              }
              default
            />
          )}
        </video>
      ) : (
        <div
          className="
            flex aspect-video flex-col
            items-center justify-center gap-3
            bg-gradient-to-br
            from-[#F0FAFE] via-white to-[#FFF3E8]
            p-5
          "
        >
          <StudentAvatar
            variant={testimonial.avatar}
            className="h-20 w-20"
          />

          <span
            className="
              flex items-center gap-2
              text-xs font-medium text-[#6F6F73]
            "
          >
            <Icon name="video" />
            Video testimonial coming soon
          </span>
        </div>
      )}

      <figcaption className="flex flex-1 flex-col p-6">
        <div
          className="
            flex flex-wrap items-center
            justify-between gap-2
          "
        >
          <p
            className="
              text-[11px] font-semibold uppercase
              tracking-[0.1em] text-[#6F6F73]
            "
          >
            Video testimonial
          </p>

          <SampleBadge show={testimonial.sample} />
        </div>

        {failed && (
          <p
            role="alert"
            className="
              mt-3 text-sm leading-relaxed
              text-[#6F6F73]
            "
          >
            This video is currently unavailable. Please try
            again later.
          </p>
        )}

        <div className="flex-1" />

        <StudentDetails
          student={testimonial}
          as="div"
        />
      </figcaption>
    </figure>
  );
}

function TestimonialsCarousel({
  items,
  format,
  reduceMotion,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const trackRef = useRef(null);
  const id = useId();
  const trackId = id + "-carousel";

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    function syncActiveIndex() {
      const left = track.getBoundingClientRect().left;

      let closest = 0;
      let distance = Infinity;

      Array.from(track.children).forEach((card, index) => {
        const next = Math.abs(
          card.getBoundingClientRect().left - left
        );

        if (next < distance) {
          distance = next;
          closest = index;
        }
      });

      setActiveIndex(closest);
    }

    const observer = new ResizeObserver(syncActiveIndex);

    observer.observe(track);

    track.addEventListener("scroll", syncActiveIndex, {
      passive: true,
    });

    syncActiveIndex();

    return () => {
      observer.disconnect();

      track.removeEventListener(
        "scroll",
        syncActiveIndex
      );
    };
  }, [items.length]);

  function goTo(index) {
    const track = trackRef.current;

    if (
      !track ||
      track.scrollWidth <= track.clientWidth + 1
    ) {
      return;
    }

    const next = Math.max(
      0,
      Math.min(index, items.length - 1)
    );

    const card = track.children[next];

    if (!card) return;

    track.scrollTo({
      left:
        track.scrollLeft +
        card.getBoundingClientRect().left -
        track.getBoundingClientRect().left,
      behavior: reduceMotion ? "instant" : "smooth",
    });
  }

  function handleKeyDown(event) {
    // Do not override the video's native keyboard controls.
    if (event.target !== event.currentTarget) return;

    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return;
    }

    const track = trackRef.current;

    if (
      !track ||
      track.scrollWidth <= track.clientWidth + 1
    ) {
      return;
    }

    const targets = {
      ArrowRight: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: items.length - 1,
    };

    if (!(event.key in targets)) return;

    event.preventDefault();
    goTo(targets[event.key]);
  }

  function handlePlay(event) {
    const playing = event.target;

    if (playing.tagName !== "VIDEO") return;

    // Only one video plays at a time.
    trackRef.current
      ?.querySelectorAll("video")
      .forEach((video) => {
        if (video !== playing) {
          video.pause();
        }
      });
  }

  if (!items.length) {
    return (
      <p className="py-10 text-center text-sm text-[#6F6F73]">
        More student testimonials are coming soon.
      </p>
    );
  }

  return (
    <>
      <p
        className="
          mb-3 text-center text-xs
          text-[#6F6F73] md:hidden
        "
      >
        Swipe to{" "}
        {format === "video"
          ? "browse video"
          : "read more"}{" "}
        testimonials
      </p>

      <ul
        id={trackId}
        ref={trackRef}
        tabIndex={0}
        aria-label={
          format === "video"
            ? "Video testimonials"
            : "Written testimonials"
        }
        onKeyDown={handleKeyDown}
        onPlayCapture={handlePlay}
        className="
          m-0 flex list-none items-stretch gap-5
          snap-x snap-mandatory
          overflow-x-auto overscroll-x-contain
          p-0 pb-4 pt-1
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          focus-visible:outline-2
          focus-visible:outline-offset-[-2px]
          focus-visible:outline-[#404041]
          md:grid md:grid-cols-3
          md:overflow-visible md:pb-0
          lg:gap-6
        "
      >
        {items.map((testimonial) => (
          <li
            key={testimonial.id}
            className="
              min-w-0 shrink-0
              basis-full snap-start
            "
          >
            {format === "video" ? (
              <VideoTestimonialCard
                testimonial={testimonial}
              />
            ) : (
              <WrittenTestimonialCard
                testimonial={testimonial}
              />
            )}
          </li>
        ))}
      </ul>

      {items.length > 1 && (
        <>
          <div
            className="
              mt-4 flex items-center
              justify-center gap-2 md:hidden
            "
          >
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous testimonial"
              aria-controls={trackId}
              className={
                controlClass +
                " border-[#E6EDF1] bg-white text-[#404041] " +
                "enabled:hover:border-[#00AEEF] " +
                "enabled:hover:bg-[#F0FAFE]"
              }
            >
              <Icon className="rotate-180" />
            </button>

            <div
              role="group"
              aria-label="Choose a testimonial"
              className="
                flex min-w-0 items-center
                overflow-x-auto
              "
            >
              {items.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={
                    "Show testimonial " +
                    (index + 1) +
                    " of " +
                    items.length
                  }
                  aria-current={
                    index === activeIndex
                      ? "true"
                      : undefined
                  }
                  aria-controls={trackId}
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-full
                    focus-visible:outline-2
                    focus-visible:outline-offset-[-2px]
                    focus-visible:outline-[#404041]
                  "
                >
                  <span
                    aria-hidden="true"
                    className={
                      "h-2 rounded-full " +
                      "transition-[width,background-color] " +
                      "duration-200 motion-reduce:transition-none " +
                      (index === activeIndex
                        ? "w-6 bg-[#00AEEF]"
                        : "w-2 bg-[#C9D2D8]")
                    }
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={
                activeIndex === items.length - 1
              }
              aria-label="Next testimonial"
              aria-controls={trackId}
              className={
                controlClass +
                " border-[#00AEEF] bg-[#00AEEF] text-white " +
                "enabled:hover:bg-[#009CD6]"
              }
            >
              <Icon />
            </button>
          </div>

          <p
            role="status"
            aria-atomic="true"
            className="
              mt-2 text-center text-[11px]
              font-medium tabular-nums
              text-[#6F6F73] md:hidden
            "
          >
            {activeIndex + 1} / {items.length}
          </p>
        </>
      )}
    </>
  );
}

export default function StudentTestimonials() {
  const [format, setFormat] = useState("written");

  const tabRefs = useRef([]);
  const id = useId();
  const reduceMotion = useReducedMotion();

  function handleTabKeyDown(event) {
    const current = formats.findIndex(
      (item) => item.value === format
    );

    let next = current;

    if (event.key === "ArrowRight") {
      next = (current + 1) % formats.length;
    } else if (event.key === "ArrowLeft") {
      next =
        (current - 1 + formats.length) %
        formats.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = formats.length - 1;
    } else {
      return;
    }

    event.preventDefault();

    setFormat(formats[next].value);
    tabRefs.current[next]?.focus({
      preventScroll: true,
    });
  }

  // Downward entrance once.
  // No reverse animation when scrolling back up.
  const reveal = {
    initial: reduceMotion
      ? false
      : {
          opacity: 0,
          y: -20,
        },
    whileInView: {
      opacity: 1,
      y: 0,
    },
    viewport: {
      once: true,
      amount: 0.15,
    },
    transition: {
      duration: reduceMotion ? 0 : 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  };

  return (
    <section
      id="testimonials"
      aria-labelledby={id + "-title"}
      className="
        overflow-hidden bg-white font-sans
        pb-16 pt-8
        sm:pb-20 sm:pt-10
        lg:pb-24 lg:pt-12
      "
    >
      <div className="site-container">
        <motion.header
          {...reveal}
          className="
            mx-auto mb-7 max-w-2xl
            text-center sm:mb-8
          "
        >
          <div
            className="
              mb-4 flex items-center
              justify-center gap-3
            "
          >
            <span
              aria-hidden="true"
              className="
                h-0.5 w-7 rounded-full
                bg-[#FD933D]
              "
            />

            <p
              className="
                text-[11px] font-bold uppercase
                tracking-[0.16em] text-[#6F6F73]
              "
            >
              Student testimonials
            </p>

            <span
              aria-hidden="true"
              className="
                h-0.5 w-7 rounded-full
                bg-[#FD933D]
              "
            />
          </div>

          <h2
            id={id + "-title"}
            className="
              text-[clamp(2rem,3.8vw,3.5rem)]
              font-semibold leading-[1.17]
              tracking-[-0.04em] text-[#404041]
            "
          >
            What our students say.
          </h2>

          <p
            className="
              mx-auto mt-4 max-w-lg
              text-sm leading-[1.9]
              text-[#6F6F73] sm:text-[15px]
            "
          >
            Hear from students we’ve helped take their
            next step towards studying abroad.
          </p>
        </motion.header>

        <motion.div {...reveal}>
          {/* Written / video switch */}
          <div className="mb-7 flex justify-center sm:mb-9">
            <div
              role="tablist"
              aria-label="Testimonial format"
              onKeyDown={handleTabKeyDown}
              className="
                grid w-full max-w-[460px]
                grid-cols-2 gap-1
                rounded-2xl border border-[#E6EDF1]
                bg-[#F5FBFE] p-1.5
              "
            >
              {formats.map((item, index) => (
                <button
                  key={item.value}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={id + "-" + item.value + "-tab"}
                  type="button"
                  role="tab"
                  aria-selected={
                    format === item.value
                  }
                  aria-controls={
                    id + "-" + item.value + "-panel"
                  }
                  tabIndex={
                    format === item.value ? 0 : -1
                  }
                  onClick={() => setFormat(item.value)}
                  className={
                    "flex min-h-12 min-w-0 items-center " +
                    "justify-center gap-2 rounded-xl px-2 py-3 " +
                    "text-center text-xs font-semibold leading-relaxed " +
                    "transition-colors focus-visible:outline-2 " +
                    "focus-visible:outline-offset-2 " +
                    "focus-visible:outline-[#404041] " +
                    "motion-reduce:transition-none sm:px-5 sm:text-sm " +
                    (format === item.value
                      ? "bg-[#00AEEF] text-white shadow-sm"
                      : "text-[#6F6F73] hover:bg-white hover:text-[#404041]")
                  }
                >
                  <Icon
                    name={item.icon}
                    className="hidden min-[360px]:block"
                  />

                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Only the selected view is mounted, so hidden videos stop. */}
          {formats.map((item) => (
            <div
              key={item.value}
              id={id + "-" + item.value + "-panel"}
              role="tabpanel"
              aria-labelledby={
                id + "-" + item.value + "-tab"
              }
              hidden={format !== item.value}
            >
              {format === item.value && (
                <TestimonialsCarousel
                  key={item.value}
                  items={
                    item.value === "written"
                      ? writtenTestimonials
                      : videoTestimonials
                  }
                  format={item.value}
                  reduceMotion={reduceMotion}
                />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}