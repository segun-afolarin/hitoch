import { useEffect, useId, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Skeleton,
  SvgIcon,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

function ArrowIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function CalendarIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M7 3v4m10-4v4M3 10h18" />
        <path d="M7 14h2m6 0h2M7 17h2" />
      </g>
    </SvgIcon>
  );
}

function ClockIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3 2" />
      </g>
    </SvgIcon>
  );
}

// Date-only values stay on their intended local calendar date.
function parseDate(value) {
  if (value == null || value === "") return null;

  if (
    !(value instanceof Date) &&
    typeof value !== "string" &&
    typeof value !== "number"
  ) {
    return null;
  }

  const input = typeof value === "string" ? value.trim() : value;

  if (input === "") return null;

  const dateOnly =
    typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input);

  const date = new Date(dateOnly ? `${input}T12:00:00` : input);

  if (Number.isNaN(date.getTime())) return null;

  // Reject dates such as 31 April instead of rolling into another month.
  if (dateOnly) {
    const [year, month, day] = input.split("-").map(Number);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }
  }

  return date;
}

function calendarDay(date) {
  const utc = new Date(0);

  utc.setUTCFullYear(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  return Math.floor(utc.getTime() / 86400000);
}

function getTiming(date, today) {
  if (!date) return null;

  const days = calendarDay(date) - calendarDay(today);

  if (days < 0) {
    return {
      label: `${Math.abs(days)} ${days === -1 ? "day" : "days"} overdue`,
      urgent: true,
    };
  }

  if (days === 0) {
    return { label: "Due today", urgent: true };
  }

  if (days === 1) {
    return { label: "Due tomorrow", urgent: true };
  }

  return {
    label: `${days} days remaining`,
    urgent: days <= 2,
  };
}

// Refresh the day count at midnight and when the tab becomes visible.
function useCurrentDay() {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    let timer;

    function scheduleRefresh() {
      const now = new Date();
      const midnight = new Date(now);

      midnight.setHours(24, 0, 0, 100);

      timer = window.setTimeout(
        refresh,
        midnight.getTime() - now.getTime(),
      );
    }

    function refresh() {
      window.clearTimeout(timer);
      setToday(new Date());
      scheduleRefresh();
    }

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        refresh();
      }
    }

    scheduleRefresh();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return today;
}

const actionStyles = {
  minHeight: 48,
  px: 2.25,
  py: 1.25,
  borderRadius: "8px",
  justifyContent: "space-between",
  gap: 2,
  bgcolor: "primary.main",
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",

  "& .MuiButton-endIcon": {
    ml: 0,
    mr: 0,
    flexShrink: 0,
    transition: "transform 180ms ease",
  },

  "&:hover": {
    bgcolor: "primary.dark",
    boxShadow: "none",
  },

  "&:hover .MuiButton-endIcon": {
    transform: "translateX(3px)",
  },

  "&.Mui-focusVisible": {
    outline: "2px solid",
    outlineColor: "text.primary",
    outlineOffset: 3,
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",

    "& .MuiButton-endIcon": {
      transition: "none",
    },

    "&:hover .MuiButton-endIcon": {
      transform: "none",
    },
  },
};

export default function StudentNextDeadline({
  deadline,
  loading = false,
  error = false,
  onRetry,
}) {
  const headingId = useId();
  const today = useCurrentDay();

  const date = parseDate(deadline?.dueDate);
  const timing = getTiming(date, today);

  const isDateOnly =
    typeof deadline?.dueDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(deadline.dueDate.trim());

  const dateTime = date
    ? isDateOnly
      ? deadline.dueDate.trim()
      : date.toISOString()
    : undefined;

  const canRetry =
    !loading && Boolean(error) && typeof onRetry === "function";

  const canNavigate =
    !loading && !error && Boolean(deadline?.to);

  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby={headingId}
      aria-busy={loading}
      sx={{
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        height: "100%",
        minHeight: 360,
        minWidth: 0,
        p: { xs: 2.5, sm: 3 },
        bgcolor: "#FFFFFF",
        color: "text.primary",
        border: "1px solid #E5EAEE",
        borderRadius: "12px",
        boxShadow: "0 4px 24px rgba(64, 64, 65, 0.04)",
      }}
    >
      {/* Heading */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography
          id={headingId}
          component="h2"
          sx={{
            minWidth: 0,
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1.4,
            letterSpacing: "-0.4px",
          }}
        >
          Next deadline
        </Typography>

        <Box
          aria-hidden="true"
          sx={(theme) => ({
            display: "grid",
            placeItems: "center",
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: "10px",
            color: "primary.main",
            bgcolor: alpha(theme.palette.primary.main, 0.08),
          })}
        >
          <CalendarIcon sx={{ fontSize: 23 }} />
        </Box>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {loading ? (
          <Box role="status" aria-label="Loading your next deadline">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Skeleton animation={false} width={76} height={64} />

              <Box sx={{ flex: 1 }}>
                <Skeleton animation={false} width="75%" height={26} />
                <Skeleton animation={false} width="50%" height={20} />
              </Box>
            </Box>

            <Skeleton
              animation={false}
              variant="rounded"
              width={140}
              height={28}
              sx={{ mt: 2 }}
            />

            <Box sx={{ mt: 3 }}>
              <Skeleton animation={false} width={100} height={20} />
              <Skeleton animation={false} width="80%" height={28} />
              <Skeleton animation={false} width="95%" height={22} />
              <Skeleton animation={false} width="65%" height={22} />
            </Box>
          </Box>
        ) : error ? (
          <Box role="alert" sx={{ py: 1 }}>
            <Typography
              component="h3"
              sx={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5 }}
            >
              We couldn’t load your deadline
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1, fontSize: 14, lineHeight: 1.75 }}
            >
              Please try again to see your next scheduled requirement.
            </Typography>
          </Box>
        ) : deadline ? (
          <>
            {/* Date */}
            {date ? (
              <Box
                component="time"
                dateTime={dateTime}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    pr: 2,
                    borderRight: "1px solid #E5EAEE",
                    fontSize: { xs: 48, sm: 56 },
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "-2.5px",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {String(date.getDate()).padStart(2, "0")}
                </Typography>

                <Box component="span" sx={{ minWidth: 0 }}>
                  <Typography
                    component="span"
                    sx={{
                      display: "block",
                      fontSize: 18,
                      fontWeight: 600,
                      lineHeight: 1.4,
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {date.toLocaleDateString("en-GB", {
                      month: "long",
                      year: "numeric",
                    })}
                  </Typography>

                  <Typography
                    component="span"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      mt: 0.5,
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    {date.toLocaleDateString("en-GB", {
                      weekday: "long",
                    })}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography
                  sx={{
                    fontSize: 22,
                    fontWeight: 600,
                    lineHeight: 1.4,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Date to be confirmed
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 0.75, fontSize: 13, lineHeight: 1.7 }}
                >
                  A confirmed due date is not available yet.
                </Typography>
              </Box>
            )}

            {/* Urgency */}
            {timing && (
              <Box
                sx={(theme) => ({
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  maxWidth: "100%",
                  mt: 2,
                  px: 1.25,
                  py: 0.625,
                  borderRadius: "6px",
                  bgcolor: alpha(
                    timing.urgent
                      ? theme.palette.secondary.main
                      : theme.palette.primary.main,
                    0.09,
                  ),
                })}
              >
                <ClockIcon
                  sx={{
                    fontSize: 16,
                    flexShrink: 0,
                    color: timing.urgent
                      ? "secondary.main"
                      : "primary.main",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    overflowWrap: "anywhere",
                  }}
                >
                  {timing.label}
                </Typography>
              </Box>
            )}

            {/* Related requirement */}
            <Box
              sx={(theme) => ({
                mt: 3,
                p: 2,
                borderRadius: "0 8px 8px 0",
                borderLeft: "3px solid",
                borderColor: timing?.urgent
                  ? "secondary.main"
                  : "primary.main",
                bgcolor: alpha(
                  timing?.urgent
                    ? theme.palette.secondary.main
                    : theme.palette.primary.main,
                  0.055,
                ),
              })}
            >
              <Typography
                sx={{
                  mb: 0.75,
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1.5,
                  letterSpacing: "0.9px",
                  textTransform: "uppercase",
                  color: "text.secondary",
                }}
              >
                Related requirement
              </Typography>

              <Typography
                component="h3"
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  lineHeight: 1.5,
                  letterSpacing: "-0.2px",
                  overflowWrap: "anywhere",
                }}
              >
                {deadline.title || "Review your requirement"}
              </Typography>

              {deadline.description && (
                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.75,
                    fontSize: 13,
                    lineHeight: 1.7,
                    overflowWrap: "anywhere",
                  }}
                >
                  {deadline.description}
                </Typography>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ py: 1 }}>
            <Typography
              component="h3"
              sx={{ fontSize: 17, fontWeight: 600, lineHeight: 1.5 }}
            >
              {deadline === null
                ? "No upcoming deadlines"
                : "Deadline information unavailable"}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1, fontSize: 14, lineHeight: 1.8 }}
            >
              {deadline === null
                ? "Your next scheduled requirement will appear here when a deadline is assigned."
                : "Your next deadline will appear here when the information becomes available."}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Final element: action only, with no caption underneath. */}
      {(loading || canRetry || canNavigate) && (
        <Box sx={{ pt: 3 }}>
          {loading ? (
            <Skeleton
              animation={false}
              variant="rounded"
              height={48}
              sx={{ borderRadius: "8px" }}
            />
          ) : canRetry ? (
            <Button
              fullWidth
              variant="contained"
              disableElevation
              onClick={onRetry}
              endIcon={<ArrowIcon sx={{ fontSize: 20 }} />}
              sx={actionStyles}
            >
              Try again
            </Button>
          ) : (
            <Button
              component={RouterLink}
              to={deadline.to}
              fullWidth
              variant="contained"
              disableElevation
              endIcon={<ArrowIcon sx={{ fontSize: 20 }} />}
              sx={actionStyles}
            >
              {deadline.actionLabel || "View requirement"}
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
}