import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

const navigation = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Countries",
    match: "/countries",
    links: [
      { label: "Canada", to: "/countries/canada" },
      {
        label: "United Kingdom",
        to: "/countries/united-kingdom",
      },
      {
        label: "United States",
        to: "/countries/united-states",
      },
      { label: "Australia", to: "/countries/australia" },
      { label: "Ireland", to: "/countries/ireland" },
      { label: "Germany", to: "/countries/germany" },
    ],
    footer: {
      label: "Explore all countries",
      to: "/countries",
    },
  },
  {
    label: "Services",
    to: "/services",
  },
  {
    label: "Partnerships",
    links: [
      {
        label: "University partners",
        to: "/partners/universities",
      },
      {
        label: "Recruitment partners",
        to: "/partners/agents",
      },
      {
        label: "For institutions",
        to: "/partners/institutions",
      },
    ],
    footer: {
      label: "Discuss a partnership",
      to: "/contact",
    },
  },
  {
    label: "About",
    to: "/about",
  },
];

function Arrow({ className = "" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
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

function Dropdown({
  item,
  open,
  onOpen,
  onClose,
  onNavigate,
}) {
  const panelId = useId();
  const triggerRef = useRef(null);
  const closeTimer = useRef(null);
  const reduceMotion = useReducedMotion();
  const { pathname } = useLocation();

  // Active when the current page lives under this menu's section
  const isActive = Boolean(
    item.match &&
      (pathname === item.match ||
        pathname.startsWith(`${item.match}/`))
  );

  function cancelClose() {
    window.clearTimeout(closeTimer.current);
  }

  useEffect(() => {
    return () => window.clearTimeout(closeTimer.current);
  }, []);

  return (
    <li
      className="relative border-b border-line xl:border-0"
      onPointerEnter={(event) => {
        const isDesktop = window.matchMedia(
          "(min-width: 1280px)"
        ).matches;

        if (event.pointerType === "mouse" && isDesktop) {
          cancelClose();
          onOpen();
        }
      }}
      onPointerLeave={(event) => {
        const isDesktop = window.matchMedia(
          "(min-width: 1280px)"
        ).matches;

        if (
          event.pointerType === "mouse" &&
          isDesktop &&
          !event.currentTarget.contains(document.activeElement)
        ) {
          cancelClose();
          closeTimer.current = window.setTimeout(onClose, 180);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          cancelClose();
          onClose();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          cancelClose();
          triggerRef.current?.focus();
          onClose();
        }
      }}
    >
      {/* Mobile: static heading, links are always visible below. */}
      <span
        className={`
          block pb-1.5 pt-4 text-[11px] font-bold uppercase
          tracking-[0.12em] xl:hidden
          ${isActive ? "text-action" : "text-muted"}
        `}
      >
        {item.label}
      </span>

      {/* Desktop: hover / click trigger. */}
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          cancelClose();
          open ? onClose() : onOpen();
        }}
        className={`
          group relative hidden min-h-11 items-center rounded-md
          px-3.5 py-2.5 text-sm font-semibold
          transition-colors duration-200 xl:flex
          ${
            open || isActive
              ? "text-action"
              : "text-ink hover:text-action"
          }
        `}
      >
        {item.label}

        <span
          aria-hidden="true"
          className={`
            absolute inset-x-3.5 bottom-1
            h-0.5 origin-left
            rounded-full bg-brand
            transition-transform duration-200
            group-hover:scale-x-100
            motion-reduce:transition-none
            ${isActive ? "scale-x-100" : "scale-x-0"}
          `}
        />
      </button>

      <div
        id={panelId}
        className={`
          block pb-3
          xl:absolute xl:left-1/2 xl:top-full
          xl:z-20 xl:w-[240px] xl:-translate-x-1/2
          xl:pb-0 xl:pt-2.5
          ${open ? "xl:block" : "xl:hidden"}
        `}
      >
        <motion.div
          key={String(open)}
          initial={
            reduceMotion ? false : { opacity: 0, y: 8 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="
            overflow-hidden bg-white
            xl:rounded-xl xl:border xl:border-line
            xl:shadow-[0_24px_64px_-16px_rgba(19,47,58,0.18)]
          "
        >
          <ul className="list-none space-y-1 py-1 xl:p-2.5">
            {item.links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => {
                    cancelClose();
                    onNavigate();
                  }}
                  className="
                    flex min-h-11 items-center
                    rounded-lg px-3.5 py-2.5 text-ink
                    transition-colors duration-200
                    hover:bg-canvas hover:text-action
                  "
                >
                  <span className="block text-[13px] font-semibold">
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            to={item.footer.to}
            onClick={() => {
              cancelClose();
              onNavigate();
            }}
            className="
              flex min-h-11 items-center px-3.5 py-2.5
              text-xs font-bold text-action
              transition-colors hover:bg-canvas
              xl:min-h-12 xl:border-t xl:border-line xl:px-5
            "
          >
            {item.footer.label}
          </Link>
        </motion.div>
      </div>
    </li>
  );
}

export default function Navbar({
  logoSrc = "/images/logo.png",
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const headerRef = useRef(null);
  const mobileButtonRef = useRef(null);
  const navigationId = useId();
  const reduceMotion = useReducedMotion();

  function closeNavigation() {
    setMobileOpen(false);
    setActiveMenu(null);
  }

  useEffect(() => {
    function updateScroll() {
      setScrolled(window.scrollY > 8);
    }

    function handleOutsideClick(event) {
      if (!headerRef.current?.contains(event.target)) {
        setMobileOpen(false);
        setActiveMenu(null);
      }
    }

    const desktop = window.matchMedia(
      "(min-width: 1280px)"
    );

    function handleBreakpointChange() {
      setMobileOpen(false);
      setActiveMenu(null);
    }

    updateScroll();

    window.addEventListener("scroll", updateScroll, {
      passive: true,
    });

    document.addEventListener(
      "pointerdown",
      handleOutsideClick
    );

    desktop.addEventListener(
      "change",
      handleBreakpointChange
    );

    return () => {
      window.removeEventListener("scroll", updateScroll);

      document.removeEventListener(
        "pointerdown",
        handleOutsideClick
      );

      desktop.removeEventListener(
        "change",
        handleBreakpointChange
      );
    };
  }, []);

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={
          reduceMotion ? false : { opacity: 0, y: -12 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            closeNavigation();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            closeNavigation();

            if (mobileOpen) {
              mobileButtonRef.current?.focus();
            }
          }
        }}
        className={`
          fixed inset-x-0 top-0 z-50
          border-b bg-white font-sans
          transition-[box-shadow,border-color] duration-300
          motion-reduce:transition-none
          ${
            scrolled
              ? "border-line shadow-[0_8px_30px_rgba(19,47,58,0.14)]"
              : "border-transparent shadow-none"
          }
        `}
      >
        <a
          href="#main-content"
          className="skip-link"
          onClick={closeNavigation}
        >
          Skip to content
        </a>

        <div
          className={`
            site-container flex items-center
            justify-between gap-8
            transition-[height] duration-300 ease-out
            motion-reduce:transition-none
            ${
              scrolled
                ? "h-[76px] xl:h-[92px]"
                : "h-[88px] xl:h-[104px]"
            }
          `}
        >
          <Link
            to="/"
            aria-label="Hitouch Global home"
            onClick={closeNavigation}
            className="flex shrink-0 items-center"
          >
            <img
              src={logoSrc}
              alt="Hitouch Global"
              className={`
                object-contain object-left
                transition-[width,height] duration-300
                motion-reduce:transition-none
                ${
                  scrolled
                    ? "h-11 w-32 xl:h-14 xl:w-40"
                    : "h-14 w-40 xl:h-16 xl:w-44"
                }
              `}
            />
          </Link>

          <button
            ref={mobileButtonRef}
            type="button"
            aria-expanded={mobileOpen}
            aria-controls={navigationId}
            aria-label={
              mobileOpen
                ? "Close navigation"
                : "Open navigation"
            }
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setActiveMenu(null);
            }}
            className="
              flex min-h-11 shrink-0 items-center
              justify-center gap-3 rounded-lg
              border border-line bg-white
              px-3.5 py-2 text-xs font-semibold text-ink
              transition-colors hover:border-action
              xl:hidden
            "
          >
            {mobileOpen ? "Close" : "Menu"}

            <span
              className="relative block h-5 w-5"
              aria-hidden="true"
            >
              {[0, 1].map((line) => (
                <motion.span
                  key={line}
                  animate={{
                    rotate: mobileOpen
                      ? line === 0
                        ? 45
                        : -45
                      : 0,
                    y: mobileOpen
                      ? 0
                      : line === 0
                        ? -3
                        : 3,
                  }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.2,
                  }}
                  className="
                    absolute left-0 top-1/2
                    h-px w-5 bg-ink
                  "
                />
              ))}
            </span>
          </button>

          <nav
            id={navigationId}
            aria-label="Main navigation"
            className={`
              ${mobileOpen ? "block" : "hidden"}
              ${
                scrolled
                  ? "max-h-[calc(100dvh-76px)]"
                  : "max-h-[calc(100dvh-88px)]"
              }
              absolute inset-x-0 top-full
              overflow-y-auto overscroll-contain
              border-b border-line bg-white
              px-6 pb-6 pt-2 shadow-lg shadow-ink/5
              xl:static xl:flex xl:max-h-none xl:flex-1
              xl:items-center xl:justify-end xl:gap-7
              xl:overflow-visible xl:border-0
              xl:p-0 xl:shadow-none
            `}
          >
            <ul
              className="
                list-none xl:flex xl:items-center xl:gap-1.5
              "
            >
              {navigation.map((item) =>
                item.links ? (
                  <Dropdown
                    key={item.label}
                    item={item}
                    open={activeMenu === item.label}
                    onOpen={() => setActiveMenu(item.label)}
                    onClose={() =>
                      setActiveMenu((current) =>
                        current === item.label ? null : current
                      )
                    }
                    onNavigate={closeNavigation}
                  />
                ) : (
                  <li
                    key={item.to}
                    className="
                      border-b border-line xl:border-0
                    "
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === "/"}
                      onClick={closeNavigation}
                      className={({ isActive }) => `
                        group relative flex min-h-12
                        items-center rounded-md py-3
                        text-sm font-semibold
                        transition-colors duration-200
                        xl:min-h-11 xl:px-3.5 xl:py-2.5
                        ${
                          isActive
                            ? "text-action"
                            : "text-ink hover:text-action"
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          {item.label}

                          <span
                            aria-hidden="true"
                            className={`
                              absolute inset-x-3.5 bottom-1
                              hidden h-0.5 origin-left
                              rounded-full bg-brand
                              transition-transform duration-200
                              group-hover:scale-x-100
                              motion-reduce:transition-none
                              xl:block
                              ${
                                isActive
                                  ? "scale-x-100"
                                  : "scale-x-0"
                              }
                            `}
                          />
                        </>
                      )}
                    </NavLink>
                  </li>
                )
              )}
            </ul>

            <div
              className="
                mt-5 flex flex-wrap items-center gap-5
                xl:mt-0 xl:flex-nowrap xl:gap-6
                xl:border-l xl:border-line xl:pl-7
              "
            >
              <Link
                to="/login"
                onClick={closeNavigation}
                className="
                  inline-flex min-h-11 items-center
                  whitespace-nowrap text-sm font-semibold
                  text-ink transition-colors hover:text-action
                "
              >
                Sign in
              </Link>

              <Link
                to="/contact"
                onClick={closeNavigation}
                className="
                  group inline-flex min-h-11
                  items-center justify-center gap-3.5
                  whitespace-nowrap rounded-lg bg-action
                  px-5 py-2.5 text-[13px] font-semibold text-white
                  transition-[background-color,box-shadow]
                  duration-200 hover:bg-action
                  hover:shadow-[0_8px_24px_rgba(0,107,142,0.18)]
                  motion-reduce:transition-none
                "
              >
                Book a consultation

                <Arrow
                  className="
                    shrink-0 transition-transform duration-200
                    group-hover:translate-x-1
                    motion-reduce:transition-none
                  "
                />
              </Link>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Keeps page content clear of the fixed navbar. */}
      <div
        aria-hidden="true"
        className="h-[88px] xl:h-[104px]"
      />
    </>
  );
}