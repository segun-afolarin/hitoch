import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import UniversityEmptyState from "./UniversityEmptyState";

const EMPTY_LIST = [];
const PAGE_SIZE = 6;

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[’']/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function advisorLink(
  countrySlug,
  universityName = "",
  query = ""
) {
  const params = new URLSearchParams({ country: countrySlug });

  if (universityName) {
    params.set("university", universityName);
  }

  if (query.trim()) {
    params.set("search", query.trim());
  }

  return `/contact?${params.toString()}`;
}

function SearchIcon({ className = "" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="10.75"
        cy="10.75"
        r="6.75"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m16 16 4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UniversityCard({ university, countrySlug }) {
  const [failedPhoto, setFailedPhoto] = useState(null);
  const photo = university.image;

  return (
    <li
      className="
        group flex min-w-0 flex-col overflow-hidden
        rounded-[20px] border border-[#E1E8EC] bg-white
        transition-[border-color,box-shadow] duration-300
        hover:border-[#00AEEF]/40
        hover:shadow-[0_16px_45px_-24px_rgba(64,64,65,0.25)]
        motion-reduce:transition-none
      "
    >
      <div
        className="
          relative aspect-[16/10] overflow-hidden bg-[#EEF7FB]
        "
      >
        {photo?.src && failedPhoto !== photo.src ? (
          <img
            src={photo.src}
            alt={photo.alt}
            width="960"
            height="600"
            loading="lazy"
            decoding="async"
            onError={() => setFailedPhoto(photo.src)}
            className="
              h-full w-full object-cover
              transition-transform duration-700 ease-out
              group-hover:scale-[1.035]
              motion-reduce:transform-none
              motion-reduce:transition-none
            "
          />
        ) : (
          <div
            role="img"
            aria-label={`${university.name}: campus photo unavailable`}
            className="
              flex h-full flex-col items-center
              justify-center gap-3 px-6 text-[#52646F]
            "
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 19 24 9l18 10H6Zm4 20h28M14 23v12m10-12v12m10-12v12"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-xs font-medium">
              Campus photo unavailable
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {photo?.credit && (
          <p
            className="
              mb-4 text-[11px] leading-relaxed text-[#626268]
            "
          >
            Photo:{" "}
            <a
              href={photo.source}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              {photo.credit}
            </a>
            {" · "}
            <a
              href={photo.licenseUrl || photo.source}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              {photo.license}
            </a>
          </p>
        )}

        <h3
          className="
            text-[20px] font-semibold leading-[1.4]
            tracking-[-0.025em] text-[#404041]
          "
        >
          {university.name}
        </h3>

        <p
          className="
            mt-2 text-sm leading-relaxed text-[#6F6F73]
          "
        >
          {[university.city, university.region]
            .filter(Boolean)
            .join(", ")}
        </p>

        {university.description && (
          <p
            className="
              mt-5 text-sm leading-[1.85] text-[#55555A]
            "
          >
            {university.description}
          </p>
        )}

        <dl
          className="
            mt-6 space-y-5 border-t border-[#E8EDF0] pt-5
          "
        >
          {university.studyLevels?.length > 0 && (
            <div>
              <dt className="text-xs font-bold text-[#404041]">
                Study levels
              </dt>
              <dd
                className="
                  mt-2 text-sm leading-[1.8] text-[#55555A]
                "
              >
                {university.studyLevels.join(" · ")}
              </dd>
            </div>
          )}

          {university.campuses?.length > 0 && (
            <div>
              <dt className="text-xs font-bold text-[#404041]">
                Study locations
              </dt>
              <dd
                className="
                  mt-2 space-y-1 text-sm
                  leading-[1.8] text-[#55555A]
                "
              >
                {university.campuses.map((campus) => (
                  <span key={campus} className="block">
                    {campus}
                  </span>
                ))}
              </dd>
            </div>
          )}

          {university.studyAreas?.length > 0 && (
            <div>
              <dt className="text-xs font-bold text-[#404041]">
                Study areas include
              </dt>
              <dd className="mt-2.5 flex flex-wrap gap-2">
                {university.studyAreas.map((area) => (
                  <span
                    key={area}
                    className="
                      max-w-full rounded-md
                      border border-[#E3EDF2] bg-[#F5FAFD]
                      px-2.5 py-1.5 text-xs font-medium
                      leading-relaxed text-[#4F5961]
                    "
                  >
                    {area}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>

        {university.planningNote && (
          <div
            className="
              mt-6 border-l-2 border-[#00AEEF] pl-3.5
            "
          >
            <p className="text-xs font-bold text-[#404041]">
              Before you apply
            </p>
            <p
              className="
                mt-1.5 text-[13px] leading-[1.8]
                text-[#55555A]
              "
            >
              {university.planningNote}
            </p>
          </div>
        )}

        <div className="mt-auto pt-6">
          <Link
            to={advisorLink(countrySlug, university.name)}
            aria-label={`Ask an advisor about ${university.name}`}
            className="
              flex min-h-12 items-center justify-between
              gap-3 rounded-md bg-[#00AEEF]
              px-4 py-3 text-[13px] font-semibold text-white
              transition-colors hover:bg-[#009CD6]
              focus-visible:outline-[#00AEEF]
              focus-visible:outline-offset-4
              motion-reduce:transition-none
            "
          >
            Ask about this university

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <path
                d="M5 12h14m-6-6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </li>
  );
}

export default function UniversitySearch({
  countryName = "Canada",
  countrySlug = "canada",
  universities = EMPTY_LIST,
  loading = false,
  error = false,
  onRetry,
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [announcement, setAnnouncement] = useState("");

  const resultsHeadingRef = useRef(null);
  const inputRef = useRef(null);

  const id = useId();
  const reduceMotion = useReducedMotion();

  const inputId = `${id}-search`;
  const headingId = `${id}-heading`;
  const helpId = `${id}-help`;
  const resultsId = `${id}-results`;
  const searchText = normalize(query);

  const filtered = useMemo(() => {
    const words = searchText.split(/\s+/).filter(Boolean);

    return universities.filter((university) => {
      const text = normalize(
        [
          university.name,
          university.city,
          university.region,
          ...(university.aliases ?? []),
          ...(university.campuses ?? []),
          ...(university.studyAreas ?? []),
          ...(university.studyLevels ?? []),
        ].join(" ")
      );

      return words.every((word) => text.includes(word));
    });
  }, [universities, searchText]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const visibleUniversities = filtered.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const range = `Showing ${startIndex + 1}–${Math.min(
    startIndex + PAGE_SIZE,
    filtered.length
  )} of ${filtered.length} ${
    filtered.length === 1 ? "university" : "universities"
  }`;

  const status = loading
    ? "Loading universities…"
    : error
      ? "University listings could not be loaded."
      : universities.length === 0
        ? "University listings are not available yet."
        : filtered.length === 0
          ? "No universities match your search."
          : `${range}. Page ${currentPage} of ${totalPages}.`;

  useEffect(() => {
    const timer = window.setTimeout(
      () => setAnnouncement(status),
      300
    );

    return () => window.clearTimeout(timer);
  }, [status]);

  function updateQuery(value) {
    setQuery(value);
    setPage(1);
  }

  function changePage(nextPage) {
    const next = Math.max(1, Math.min(nextPage, totalPages));

    if (next === currentPage) return;

    setPage(next);

    resultsHeadingRef.current?.focus({
      preventScroll: true,
    });

    resultsHeadingRef.current?.scrollIntoView({
      behavior: reduceMotion ? "instant" : "smooth",
      block: "start",
    });
  }

  function clearSearch() {
    updateQuery("");
    inputRef.current?.focus();
  }

  return (
    <section
      aria-labelledby={headingId}
      className="
        bg-white py-12 font-sans
        text-[#404041] sm:py-16
      "
    >
      <div className="site-container">
        <div className="mb-7 max-w-[680px] sm:mb-8">
          <p
            className="
              mb-3 flex items-center gap-3 text-[11px]
              font-bold uppercase tracking-[0.16em]
              text-[#6F6F73]
            "
          >
            <span
              aria-hidden="true"
              className="h-0.5 w-6 bg-[#00AEEF]"
            />
            Find your university
          </p>

          <h2
            id={headingId}
            className="
              text-[clamp(1.85rem,3.2vw,2.65rem)]
              font-semibold leading-[1.25]
              tracking-[-0.035em]
            "
          >
            Explore universities in {countryName}
          </h2>

          <p
            className="
              mt-4 max-w-[580px] text-[15px]
              leading-[1.85] text-[#6F6F73] sm:text-base
            "
          >
            Compare study areas, degree levels and campus
            locations. Find an option that interests you,
            then discuss your next steps with an advisor.
          </p>
        </div>

        <form
          role="search"
          aria-label={`Search universities in ${countryName}`}
          onSubmit={(event) => event.preventDefault()}
          className="
            mb-7 rounded-[18px] border border-[#E1E8EC]
            bg-[#F8FBFD] p-4 sm:p-5
          "
        >
          <label
            htmlFor={inputId}
            className="
              mb-2 block text-[13px] font-semibold
              text-[#404041]
            "
          >
            Search universities
          </label>

          <div
            className="
              flex min-h-14 items-center gap-3 rounded-xl
              border border-[#D8E2E8] bg-white pl-4 pr-1.5
              transition-[border-color,box-shadow]
              focus-within:border-[#00AEEF]
              focus-within:ring-4
              focus-within:ring-[#00AEEF]/10
              motion-reduce:transition-none
            "
          >
            <SearchIcon className="shrink-0 text-[#6F6F73]" />

            <input
              ref={inputRef}
              id={inputId}
              type="text"
              role="searchbox"
              value={query}
              onChange={(event) =>
                updateQuery(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Escape" && query) {
                  event.preventDefault();
                  clearSearch();
                }
              }}
              placeholder="Name, location or study area"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="search"
              maxLength={120}
              aria-describedby={helpId}
              aria-controls={resultsId}
              disabled={
                loading ||
                Boolean(error) ||
                universities.length === 0
              }
              className="
                min-w-0 flex-1 border-0 bg-transparent
                py-3.5 text-base leading-normal
                text-[#404041] outline-none
                placeholder:text-[#75757A]
                focus-visible:outline-none
                disabled:cursor-not-allowed
                disabled:text-[#6F6F73]
              "
            />

            {query && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear university search"
                className="
                  flex h-11 w-11 shrink-0 items-center
                  justify-center rounded-lg text-[#6F6F73]
                  transition-colors hover:bg-[#EDF7FC]
                  hover:text-[#404041]
                  focus-visible:outline-[#00AEEF]
                  motion-reduce:transition-none
                "
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m6 6 12 12M6 18 18 6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>

          <div
            className="
              mt-3 flex flex-col gap-1
              sm:flex-row sm:justify-between sm:gap-5
            "
          >
            <p
              id={helpId}
              className="text-xs leading-relaxed text-[#6F6F73]"
            >
              Search the listed universities by name,
              campus, study area or degree level.
            </p>

            <p
              className="
                text-xs font-semibold leading-relaxed
                text-[#404041]
              "
            >
              Six per page
            </p>
          </div>
        </form>

        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </p>

        <div
          className="
            mb-5 flex flex-wrap items-center
            justify-between gap-3
          "
        >
          <h3
            ref={resultsHeadingRef}
            tabIndex={-1}
            className="
              scroll-mt-4 text-sm font-semibold
              leading-relaxed focus:outline-none
            "
          >
            {loading || error || filtered.length === 0
              ? status
              : range}
          </h3>

          {!loading && !error && filtered.length > 0 && (
            <p className="text-xs text-[#626268]">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        <div id={resultsId} aria-busy={loading}>
          {loading ? (
            <div
              aria-hidden="true"
              className="
                grid gap-5 md:grid-cols-2 xl:grid-cols-3
              "
            >
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="
                    rounded-[18px] border
                    border-[#E1E8EC] p-6
                  "
                >
                  <div
                    className="
                      mb-5 aspect-[16/10]
                      rounded-xl bg-[#EEF3F6]
                    "
                  />
                  <div className="h-5 w-3/4 rounded bg-[#EEF3F6]" />
                  <div className="mt-3 h-4 w-1/2 rounded bg-[#F3F6F8]" />
                  <div className="mt-6 h-20 rounded bg-[#F3F6F8]" />
                  <div className="mt-5 h-40 rounded bg-[#F3F6F8]" />
                  <div className="mt-6 h-12 rounded-md bg-[#EEF3F6]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <UniversityEmptyState
              kind="error"
              onRetry={onRetry}
              advisorTo={advisorLink(countrySlug)}
            />
          ) : universities.length === 0 ? (
            <UniversityEmptyState
              kind="empty"
              countryName={countryName}
              advisorTo={advisorLink(countrySlug)}
            />
          ) : filtered.length === 0 ? (
            <UniversityEmptyState
              query={query}
              onClear={clearSearch}
              advisorTo={advisorLink(countrySlug, "", query)}
            />
          ) : (
            <motion.ul
              key={currentPage}
              aria-label="University results"
              initial={
                reduceMotion ? false : { opacity: 0, y: 10 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.35,
              }}
              className="
                m-0 grid list-none gap-5 p-0
                md:grid-cols-2 xl:grid-cols-3
              "
            >
              {visibleUniversities.map((university) => (
                <UniversityCard
                  key={university.id}
                  university={university}
                  countrySlug={countrySlug}
                />
              ))}
            </motion.ul>
          )}
        </div>

        {!loading && !error && totalPages > 1 && (
          <nav
            aria-label="University pages"
            className="
              mt-8 flex flex-wrap items-center
              justify-center gap-2 border-t
              border-[#E6EDF1] pt-6 sm:justify-end
            "
          >
            <button
              type="button"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="
                inline-flex min-h-11 items-center gap-2
                rounded-lg border border-[#D9E4EB] px-3
                text-sm font-semibold text-[#404041]
                transition-colors hover:border-[#00AEEF]
                hover:bg-[#F0FAFE]
                disabled:cursor-not-allowed
                disabled:opacity-40
                disabled:hover:border-[#D9E4EB]
                disabled:hover:bg-white
                motion-reduce:transition-none
              "
            >
              <span aria-hidden="true">←</span>
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => changePage(number)}
                aria-label={`Go to page ${number}`}
                aria-current={
                  number === currentPage ? "page" : undefined
                }
                className={`
                  flex h-11 min-w-11 items-center
                  justify-center rounded-lg border px-3
                  text-sm font-semibold transition-colors
                  motion-reduce:transition-none
                  ${
                    number === currentPage
                      ? "border-[#00AEEF] bg-[#00AEEF] text-white"
                      : "border-[#D9E4EB] bg-white text-[#404041] hover:border-[#00AEEF] hover:bg-[#F0FAFE]"
                  }
                `}
              >
                {number}
              </button>
            ))}

            <button
              type="button"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="
                inline-flex min-h-11 items-center gap-2
                rounded-lg border border-[#D9E4EB] px-3
                text-sm font-semibold text-[#404041]
                transition-colors hover:border-[#00AEEF]
                hover:bg-[#F0FAFE]
                disabled:cursor-not-allowed
                disabled:opacity-40
                disabled:hover:border-[#D9E4EB]
                disabled:hover:bg-white
                motion-reduce:transition-none
              "
            >
              Next
              <span aria-hidden="true">→</span>
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}