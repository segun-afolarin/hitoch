import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import UnitedKingdomUniversities from "../components/countries/UnitedKingdomUniversities";

const EASE = [0.22, 1, 0.36, 1];

export default function UnitedKingdom() {
  const reduceMotion = useReducedMotion();
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  function exploreUniversities(event) {
    event.preventDefault();

    const section = document.getElementById(
      "united-kingdom-universities"
    );

    section?.focus({ preventScroll: true });

    section?.scrollIntoView({
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
        <title>Study in the United Kingdom | Hitouch Global</title>

        <meta
          name="description"
          content="Explore universities in the United Kingdom, compare study areas and campuses, and discuss your study plans with Hitouch Global."
        />

        <section
          aria-labelledby="united-kingdom-title"
          className="
            border-b border-[#E6EDF1]
            pb-10 pt-5 sm:pb-12 sm:pt-7
          "
        >
          <div className="site-container">
            <nav
              aria-label="Breadcrumb"
              className="mb-7 sm:mb-9"
            >
              <ol
                className="
                  m-0 flex list-none flex-wrap
                  items-center gap-3 p-0 text-[13px]
                "
              >
                <li>
                  <Link
                    to="/"
                    className="
                      inline-flex min-h-11 items-center
                      rounded-sm text-[#626268]
                      hover:underline
                      focus-visible:outline-[#00AEEF]
                    "
                  >
                    Home
                  </Link>
                </li>

                <li aria-hidden="true">/</li>

                <li>
                  <Link
                    to="/countries"
                    className="
                      inline-flex min-h-11 items-center
                      rounded-sm text-[#626268]
                      hover:underline
                      focus-visible:outline-[#00AEEF]
                    "
                  >
                    Countries
                  </Link>
                </li>

                <li aria-hidden="true">/</li>

                <li>
                  <span
                    aria-current="page"
                    className="font-semibold"
                  >
                    United Kingdom
                  </span>
                </li>
              </ol>
            </nav>

            <div
              className="
                grid items-center gap-8
                lg:grid-cols-[1.05fr_1fr] lg:gap-14
              "
            >
              <motion.div
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: 20 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.75,
                  ease: EASE,
                }}
              >
                <p
                  className="
                    mb-5 flex items-center gap-3
                    text-[11px] font-bold uppercase
                    tracking-[0.16em] text-[#626268]
                  "
                >
                  <span
                    aria-hidden="true"
                    className="h-0.5 w-7 bg-[#00AEEF]"
                  />
                  Europe
                </p>

                <h1
                  id="united-kingdom-title"
                  className="
                    text-[clamp(2.5rem,5vw,4.5rem)]
                    font-semibold leading-[1.12]
                    tracking-[-0.045em]
                  "
                >
                  Your next chapter.
                  <br />
                  <span className="text-[#00AEEF]">
                    Study in the UK.
                  </span>
                </h1>

                <p
                  className="
                    mt-6 max-w-[500px] text-base
                    leading-[1.9] text-[#626268]
                    sm:text-[17px]
                  "
                >
                  Explore university options, compare the
                  subjects you can study and get to know the
                  campuses. Start with what matters to you,
                  then talk through your application plans
                  with our team.
                </p>

                <div
                  className="
                    mt-7 flex flex-col gap-3
                    sm:flex-row sm:flex-wrap
                  "
                >
                  <a
                    href="#united-kingdom-universities"
                    onClick={exploreUniversities}
                    className="
                      inline-flex min-h-[54px]
                      items-center justify-center
                      rounded-md bg-[#00AEEF] px-6 py-3.5
                      text-sm font-semibold text-white
                      transition-colors hover:bg-[#009CD6]
                      focus-visible:outline-[#00AEEF]
                      motion-reduce:transition-none
                    "
                  >
                    Explore universities
                  </a>

                  <Link
                    to="/contact?country=united-kingdom"
                    className="
                      inline-flex min-h-[54px]
                      items-center justify-center
                      rounded-md border border-[#B8D7E5]
                      bg-white px-6 py-3.5
                      text-sm font-semibold text-[#007AA8]
                      transition-colors
                      hover:border-[#00AEEF] hover:bg-[#F0FAFE]
                      focus-visible:outline-[#00AEEF]
                      motion-reduce:transition-none
                    "
                  >
                    Talk to an advisor
                  </Link>
                </div>
              </motion.div>

              <motion.figure
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: 25 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.8,
                  delay: reduceMotion ? 0 : 0.12,
                  ease: EASE,
                }}
                className="
                  relative m-0 aspect-[4/3]
                  overflow-hidden rounded-[22px]
                  bg-[#EAF7FD]
                "
              >
                {photoFailed ? (
                  <div
                    role="img"
                    aria-label="United Kingdom destination illustration"
                    className="
                      flex h-full items-center justify-center
                      text-3xl font-semibold text-[#007AA8]
                    "
                  >
                    United Kingdom
                  </div>
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80"
                    srcSet={[480, 800, 1200, 1600]
                      .map(
                        (width) =>
                          `https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=${width}&q=80 ${width}w`
                      )
                      .join(", ")}
                    sizes="(min-width: 1280px) 580px, (min-width: 1024px) 46vw, 100vw"
                    alt="A view of London in the United Kingdom"
                    width="1200"
                    height="900"
                    fetchPriority="high"
                    decoding="async"
                    onError={() => setPhotoFailed(true)}
                    className="
                      absolute inset-0 h-full w-full object-cover
                    "
                  />
                )}

                <figcaption
                  className="
                    absolute bottom-4 left-4 right-4
                    rounded-xl border border-white/80
                    bg-white/95 px-5 py-4
                    text-sm font-semibold text-[#404041]
                    sm:bottom-5 sm:left-5 sm:right-auto
                  "
                >
                  United Kingdom
                  <span className="mx-2 text-[#00AEEF]">/</span>
                  Explore your study options
                </figcaption>
              </motion.figure>
            </div>
          </div>
        </section>

        <div
          id="united-kingdom-universities"
          tabIndex={-1}
          className="scroll-mt-4 focus:outline-none"
        >
          <UnitedKingdomUniversities />
        </div>

        <div className="site-container pb-8">
          <Link
            to="/countries"
            className="
              inline-flex min-h-11 items-center gap-3
              rounded-sm text-sm font-semibold
              text-[#007AA8] underline-offset-4
              hover:underline focus-visible:outline-[#00AEEF]
            "
          >
            <span aria-hidden="true">←</span>
            Explore other destinations
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}