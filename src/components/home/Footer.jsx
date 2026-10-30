import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

const PRIVACY_URL = "https://hitouchglobal.com/privacy-policy/";
const TERMS_URL = "https://hitouchglobal.com/terms-condition/";

const ICEF_BADGE =
  "https://icef-api-production.s3.eu-central-1.amazonaws.com/ias_material/0016M00002QQMEbQAP_badge.png";

const EASE = [0.22, 1, 0.36, 1];

const footerGroups = [
  {
    title: "Students",
    links: [
      { label: "Study destinations", to: "/countries" },
      { label: "Our services", to: "/services" },
      { label: "Create an account", to: "/register" },
      { label: "Sign in", to: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Hitouch", to: "/about" },
      { label: "Blog", to: "/blog" },
      { label: "Contact us", to: "/contact" },
    ],
  },
  {
    title: "Partnerships",
    links: [
      { label: "University partners", to: "/partners/universities" },
      { label: "Recruitment partners", to: "/partners/agents" },
      { label: "For institutions", to: "/partners/institutions" },
    ],
  },
];

const trustPoints = [
  "Personalised study counselling",
  "Support from application to arrival",
  "ICEF accredited education agency",
];

function Arrow({ className = "" }) {
  return (
    <svg
      width="19"
      height="19"
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

function Check({ className = "" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="10" fill="#00AEEF" fillOpacity="0.12" />
      <path
        d="m7.5 12.5 3 3 6-6.5"
        stroke="#00AEEF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FooterLink({ to, href, children }) {
  const Element = href ? "a" : Link;

  return (
    <Element
      {...(href ? { href } : { to })}
      className="
        group inline-flex min-h-10 max-w-full items-center
        rounded-sm text-[14px] font-medium leading-relaxed
        text-[#6F6F73] transition-colors duration-200
        hover:text-[#404041]
        focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-4
        focus-visible:outline-[#00AEEF]
        motion-reduce:transition-none
      "
    >
      <span
        className="
          relative py-1
          after:absolute after:inset-x-0 after:bottom-0
          after:h-px after:origin-left after:scale-x-0
          after:bg-[#00AEEF]
          after:transition-transform after:duration-300
          group-hover:after:scale-x-100
          group-focus-visible:after:scale-x-100
          motion-reduce:after:transition-none
        "
      >
        {children}
      </span>
    </Element>
  );
}

function NewsletterForm({ id, onSubscribe }) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "idle",
    message: "",
  });

  const submitting = useRef(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting.current) return;

    if (typeof onSubscribe !== "function") {
      setFeedback({
        type: "error",
        message:
          "Newsletter signup is temporarily unavailable. Please try again later.",
      });
      return;
    }

    submitting.current = true;
    setPending(true);
    setFeedback({ type: "idle", message: "" });

    try {
      // Return { success: true } after your backend accepts the email.
      const result = await onSubscribe(email.trim());

      if (result?.success !== true) {
        throw new Error("Subscription not confirmed");
      }

      setEmail("");
      setFeedback({
        type: "success",
        message: "Thank you. Your subscription request has been received.",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "We couldn’t submit your request. Please try again.",
      });
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby={`${id}-title`}
      aria-busy={pending}
    >
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={254}
          required
          disabled={pending}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);

            if (feedback.message) {
              setFeedback({ type: "idle", message: "" });
            }
          }}
          aria-describedby={`${id}-privacy ${id}-status`}
          placeholder="Your email address"
          className="
            h-[52px] min-w-0 flex-1 appearance-none rounded-md
            border border-[#CFDCE4] bg-white px-4
            text-[15px] font-medium text-[#404041]
            shadow-none outline-none
            transition-[border-color,box-shadow] duration-200
            placeholder:text-[#8A8A8F]
            hover:border-[#9FDDF7]
            focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/15
            [&:-webkit-autofill]:[-webkit-text-fill-color:#404041]
            [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#fff_inset]
            disabled:opacity-60
            motion-reduce:transition-none
          "
        />

        <button
          type="submit"
          disabled={pending}
          className="
            group inline-flex h-[52px] shrink-0
            items-center justify-center gap-3
            rounded-md bg-[#00AEEF] px-6
            text-[15px] font-semibold text-white
            transition-[background-color,transform] duration-200
            hover:bg-[#009CD6]
            motion-safe:active:scale-[0.98]
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-4
            focus-visible:outline-[#00AEEF]
            disabled:cursor-wait disabled:opacity-65
            motion-reduce:transition-none
          "
        >
          {pending ? "Subscribing…" : "Subscribe"}

          {!pending && (
            <Arrow
              className="
                shrink-0 transition-transform duration-200
                motion-safe:group-hover:translate-x-1
                motion-reduce:transition-none
              "
            />
          )}
        </button>
      </div>

      <p
        id={`${id}-privacy`}
        className="mt-3 text-[13px] font-medium leading-[1.8] text-[#6F6F73]"
      >
        By subscribing, you agree to receive email updates.{" "}
        <a
          href={PRIVACY_URL}
          className="
            rounded-sm font-semibold text-[#404041] underline
            decoration-[#00AEEF]/60 underline-offset-4
            transition-colors hover:decoration-[#00AEEF]
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-[#00AEEF]
          "
        >
          Privacy Policy
        </a>
        .
      </p>

      <p
        id={`${id}-status`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`
          mt-2 min-h-5 text-sm font-medium leading-relaxed
          ${feedback.type === "error" ? "text-[#A33333]" : "text-[#0A7A3E]"}
        `}
      >
        {feedback.message}
      </p>
    </form>
  );
}

export default function Footer({
  logoSrc = "/images/logo.png",
  accreditationSrc = ICEF_BADGE,
  onSubscribe,
}) {
  const footerId = useId();
  const reduceMotion = useReducedMotion();

  const [failedLogo, setFailedLogo] = useState(null);
  const [failedBadge, setFailedBadge] = useState(null);

  const newsletterId = `${footerId}-newsletter`;

  // Every block animates on its own, the first time it scrolls into view.
  // No parent/child variant chain, so nothing can silently skip it.
  const appear = (delay = 0, distance = 36) => ({
    initial: reduceMotion ? false : { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: {
      duration: reduceMotion ? 0 : 0.8,
      delay: reduceMotion ? 0 : delay,
      ease: EASE,
    },
  });

  const grow = (delay = 0) => ({
    initial: reduceMotion ? false : { scaleX: 0 },
    whileInView: { scaleX: 1 },
    viewport: { once: true, amount: 0.1 },
    transition: {
      duration: reduceMotion ? 0 : 0.8,
      delay: reduceMotion ? 0 : delay,
      ease: EASE,
    },
  });

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  const columnTitle = `
    mb-4 text-[12px] font-bold uppercase
    leading-relaxed tracking-[0.14em] text-[#404041]
  `;

  return (
    <footer
      aria-label="Site footer"
      className="
        relative overflow-hidden border-t border-[#E3EDF2]
        bg-white font-sans font-medium text-[#404041]
      "
    >
      {/* Newsletter */}
      <div className="border-b border-[#E3EDF2] bg-[#F6FBFE]">
        <div className="site-container">
          <div
            className="
              grid items-center gap-8 py-10
              sm:py-12
              lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]
              lg:gap-16
            "
          >
            <motion.div {...appear(0)} className="min-w-0">
              <p
                className="
                  mb-4 flex items-center gap-3
                  text-[11px] font-bold uppercase
                  tracking-[0.16em] text-[#6F6F73]
                "
              >
                <motion.span
                  {...grow(0.25)}
                  aria-hidden="true"
                  className="h-0.5 w-7 shrink-0 origin-left bg-[#FD933D]"
                />
                Newsletter
              </p>

              <h2
                id={`${newsletterId}-title`}
                className="
                  text-[clamp(1.5rem,2.6vw,2.125rem)]
                  font-semibold leading-[1.2]
                  tracking-[-0.03em] text-[#404041]
                "
              >
                Study news &amp; updates.
              </h2>

              <p className="mt-3 max-w-[46ch] text-[15px] font-medium leading-[1.8] text-[#6F6F73]">
                Study tips, destination news and updates from Hitouch
                Global, delivered straight to your inbox.
              </p>
            </motion.div>

            <motion.div {...appear(0.15)} className="min-w-0">
              <NewsletterForm id={newsletterId} onSubscribe={onSubscribe} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Brand, navigation, accreditation */}
      <div className="site-container">
        <div
          className="
            grid grid-cols-2 gap-x-8 gap-y-10 py-12
            sm:py-14
            lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))_auto]
            lg:gap-x-12
          "
        >
          <motion.div
            {...appear(0)}
            className="col-span-2 min-w-0 lg:col-span-1"
          >
            <Link
              to="/"
              aria-label="Hitouch Global home"
              className="
                inline-flex min-h-14 items-center rounded-sm
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-4
                focus-visible:outline-[#00AEEF]
              "
            >
              {failedLogo === logoSrc ? (
                <span className="text-2xl font-bold tracking-tight">
                  Hitouch <span className="text-[#00AEEF]">Global</span>
                </span>
              ) : (
                <img
                  src={logoSrc}
                  alt="Hitouch Global"
                  width="200"
                  height="64"
                  loading="lazy"
                  decoding="async"
                  onError={() => setFailedLogo(logoSrc)}
                  className="
                    h-14 w-44 object-contain object-left
                    sm:h-16 sm:w-[200px]
                  "
                />
              )}
            </Link>

            <p className="mt-4 max-w-[40ch] text-[14px] font-medium leading-[1.9] text-[#6F6F73]">
              Helping you explore study opportunities and take your
              next step with confidence. From choosing the right
              country and course to applications, offers and
              pre-departure support, our advisers stay with you at
              every stage of your journey.
            </p>
          </motion.div>

          {footerGroups.map((group, index) => (
            <motion.nav
              key={group.title}
              {...appear(0.12 * (index + 1))}
              aria-labelledby={`${footerId}-group-${index}`}
              className="min-w-0"
            >
              <h2
                id={`${footerId}-group-${index}`}
                className={columnTitle}
              >
                {group.title}
              </h2>

              <ul className="m-0 list-none p-0">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <FooterLink to={link.to}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}

          <motion.div
            {...appear(0.48)}
            className="min-w-0 lg:justify-self-end"
          >
            <h2 className={columnTitle}>Accreditation</h2>

            {failedBadge === accreditationSrc ? (
              <p className="max-w-[150px] text-sm font-medium leading-relaxed text-[#6F6F73]">
                Accreditation badge is temporarily unavailable.
              </p>
            ) : (
              <motion.img
                src={accreditationSrc}
                alt="ICEF Accredited Agency badge, agency number 5440"
                width="650"
                height="762"
                loading="lazy"
                decoding="async"
                onError={() => setFailedBadge(accreditationSrc)}
                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="h-auto w-24 max-w-full object-contain sm:w-[112px]"
              />
            )}
          </motion.div>
        </div>

        {/* Trust strip */}
        <ul
          className="
            m-0 grid list-none gap-3 border-t border-[#E3EDF2]
            p-0 py-6
            sm:grid-cols-3 sm:gap-6
          "
        >
          {trustPoints.map((point, index) => (
            <motion.li
              key={point}
              {...appear(0.1 * index, 24)}
              className="flex items-center gap-2.5 text-[13px] font-semibold text-[#404041]"
            >
              <Check className="shrink-0" />
              {point}
            </motion.li>
          ))}
        </ul>

        {/* Legal */}
        <motion.div
          {...appear(0, 20)}
          className="
            flex flex-col gap-3
            border-t border-[#E3EDF2] py-4
            sm:flex-row sm:items-center
            sm:justify-between sm:gap-5
          "
        >
          <p className="text-[13px] font-medium leading-relaxed text-[#6F6F73]">
            © {new Date().getFullYear()} Hitouch Global Ltd. All
            rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <nav aria-label="Legal information">
              <ul className="m-0 flex list-none flex-wrap gap-x-6 p-0">
                <li>
                  <FooterLink href={PRIVACY_URL}>Privacy Policy</FooterLink>
                </li>
                <li>
                  <FooterLink href={TERMS_URL}>Terms &amp; Condition</FooterLink>
                </li>
              </ul>
            </nav>

            <motion.button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              whileHover={reduceMotion ? undefined : { y: -3 }}
              whileTap={reduceMotion ? undefined : { scale: 0.92 }}
              className="
                inline-flex h-11 w-11 items-center justify-center
                rounded-full border border-[#CFDCE4] bg-white
                text-[#404041] shadow-none outline-none
                transition-colors duration-200
                hover:border-[#00AEEF] hover:bg-[#00AEEF] hover:text-white
                focus-visible:ring-2 focus-visible:ring-[#00AEEF]
                focus-visible:ring-offset-2
              "
            >
              <Arrow className="-rotate-90" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}