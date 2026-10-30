import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

const stats = [
  { label: "Students helped", value: 1000 },
  { label: "Programs", value: 50000 },
  { label: "Partner schools", value: 350 },
  { label: "Destinations", value: 21 },
];

const formatter = new Intl.NumberFormat("en-US");

function AnimatedCount({ value, delay = 0 }) {
  const countRef = useRef(null);
  const visible = useInView(countRef, {
    once: false, // CHANGED: re-trigger every time it enters the view
    amount: 0.6,
  });

  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);

  const rounded = useTransform(count, (latest) =>
    formatter.format(Math.round(latest))
  );

  useEffect(() => {
    if (reduceMotion) return;

    // CHANGED: reset to 0 when it leaves the view so it restarts next time
    if (!visible) {
      count.set(0);
      return;
    }

    count.set(0);

    const controls = animate(count, value, {
      duration: 3,
      delay,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [count, value, visible, reduceMotion, delay]);

  return (
    <span ref={countRef} className="relative inline-grid">
      <span className="sr-only">
        {formatter.format(value)}+
      </span>

      {/* Reserve the final number's width. */}
      <span
        aria-hidden="true"
        className="invisible col-start-1 row-start-1"
      >
        {formatter.format(value)}
        <span className="ml-1">+</span>
      </span>

      <span
        aria-hidden="true"
        className="col-start-1 row-start-1"
      >
        {reduceMotion ? (
          <span>{formatter.format(value)}</span>
        ) : (
          <motion.span>{rounded}</motion.span>
        )}

        <span className="ml-1 text-brand">+</span>
      </span>
    </span>
  );
}

export default function ImpactStats() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Hitouch Global in numbers"
      className="border-b border-line bg-white py-8 font-sans sm:py-12"
    >
      <div className="site-container">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={
                reduceMotion ? false : { opacity: 0, y: 14 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }} // CHANGED: replay fade-in too
              transition={{
                duration: reduceMotion ? 0 : 0.5,
                delay: reduceMotion ? 0 : index * 0.08,
              }}
              className={`
                min-w-0 border-line px-3 py-6
                text-center sm:px-6 lg:py-4
                ${index < 2 ? "border-b lg:border-b-0" : ""}
                ${index % 2 === 0 ? "border-r" : ""}
                ${index === 1 ? "lg:border-r" : ""}
              `}
            >
              <dt className="mb-4 text-xs font-medium leading-relaxed text-muted sm:text-sm">
                {stat.label}
              </dt>

              <dd
                className="
                  m-0 whitespace-nowrap
                  font-semibold leading-tight
                  tracking-[-0.045em] text-ink tabular-nums
                  text-[clamp(1.6rem,6vw,2.75rem)]
                  lg:text-[clamp(2rem,3.8vw,3.5rem)]
                "
              >
                <AnimatedCount
                  value={stat.value}
                  delay={0.15 + index * 0.12}
                />
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}