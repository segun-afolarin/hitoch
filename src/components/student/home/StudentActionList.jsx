import { useEffect, useId, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  SvgIcon,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

const INITIAL_VISIBLE_COUNT = 3;

const CATEGORIES = {
  document: "Documents",
  profile: "Profile",
  application: "Applications",
  payment: "Payments",
  other: "Other",
};

const ICONS = {
  document:
    "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Zm0 0v6h6M8 13h8M8 17h5",
  profile:
    "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
  application:
    "M9 4H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3M9 3h6v4H9V3Zm-1 11 3 3 5-6",
  payment:
    "M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm-2 5h18M7 15h3",
  other: "M9 6h11M9 12h11M9 18h11M3 6h1M3 12h1M3 18h1",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  chevron: "m7 10 5 5 5-5",
  check: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM8 12l3 3 5-6",
  alert:
    "M12 8v5m0 3h.01M10.3 4.2 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z",
};

function ActionIcon({ type = "other", ...props }) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path
        d={ICONS[type] || ICONS.other}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

// Keep date-only values on their intended local calendar date.
function parseDueDate(value) {
  if (value == null) return null;

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

// Update deadline labels at midnight and when the tab becomes visible.
function useToday() {
  const [today, setToday] = useState(() => calendarDay(new Date()));

  useEffect(() => {
    let timer;

    function schedule() {
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
      setToday(calendarDay(new Date()));
      schedule();
    }

    function onVisibility() {
      if (!document.hidden) refresh();
    }

    schedule();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return today;
}

function getDeadline(value, today) {
  const date = parseDueDate(value);

  if (!date) return null;

  const days = calendarDay(date) - today;

  const timing =
    days < 0
      ? `${Math.abs(days)} ${days === -1 ? "day" : "days"} overdue`
      : days === 0
        ? "Due today"
        : days === 1
          ? "Due tomorrow"
          : `In ${days} days`;

  const dateOnly =
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.trim());

  return {
    timestamp: date.getTime(),
    days,
    timing,
    urgent: days <= 2,
    dateTime: dateOnly ? value.trim() : date.toISOString(),
    formatted: date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  };
}

function prepareTasks(items, today) {
  return (Array.isArray(items) ? items : [])
    .filter(
      (task) =>
        task && typeof task === "object" && !Array.isArray(task),
    )
    .map((task, sourceIndex) => ({
      ...task,
      sourceIndex,
      category: Object.prototype.hasOwnProperty.call(
        CATEGORIES,
        task.kind,
      )
        ? task.kind
        : "other",
      deadline: getDeadline(task.dueDate, today),
    }))
    .sort((a, b) => {
      const first = a.deadline?.timestamp ?? Infinity;
      const second = b.deadline?.timestamp ?? Infinity;

      return first === second
        ? a.sourceIndex - b.sourceIndex
        : first - second;
    });
}

const actionButtonSx = {
  minHeight: 44,
  px: 2,
  py: 1,
  gap: 1.5,
  borderRadius: "8px",
  fontSize: 13,
  fontWeight: 600,
  textTransform: "none",
  lineHeight: 1.5,
  boxShadow: "none",
  overflowWrap: "anywhere",

  "& .MuiButton-endIcon": {
    ml: 0,
    mr: 0,
    flexShrink: 0,
    transition: "transform 160ms ease",
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

const primaryButtonSx = {
  ...actionButtonSx,
  bgcolor: "primary.main",
  color: "#FFFFFF",

  "&:hover": {
    bgcolor: "primary.dark",
    color: "#FFFFFF",
    boxShadow: "none",
  },
};

const rowLayoutSx = {
  display: "grid",
  alignItems: "center",
  minWidth: 0,
  gap: 2,
  gridTemplateColumns: "40px minmax(0, 1fr)",
  gridTemplateAreas: `
    "icon content"
    "deadline deadline"
    "action action"
  `,
  p: 2,
  border: "1px solid #E5EAEE",
  borderRadius: "10px",
  listStyle: "none",

  "@container student-actions (min-width: 520px)": {
    gridTemplateColumns:
      "44px minmax(0, 1fr) minmax(176px, 200px)",
    gridTemplateAreas: `
      "icon content content"
      ". deadline action"
    `,
    p: 2.5,
  },

  "@container student-actions (min-width: 820px)": {
    gridTemplateColumns: "44px minmax(0, 1fr) 145px 200px",
    gridTemplateAreas: '"icon content deadline action"',
    columnGap: 2.5,
  },
};

function RequirementRow({ task, index }) {
  const title = task.title || "Application requirement";
  const label = task.actionLabel || "View requirement";
  const primary = index === 0;
  const { deadline } = task;

  return (
    <Box
      component="li"
      sx={(theme) => ({
        ...rowLayoutSx,
        bgcolor: "#FFFFFF",
        borderColor: primary
          ? alpha(theme.palette.primary.main, 0.28)
          : "#E5EAEE",
        boxShadow: primary
          ? `inset 3px 0 0 ${theme.palette.primary.main}`
          : "none",
        animation: "actionRowEnter 320ms ease-out both",
        animationDelay: `${Math.min(index, 4) * 40}ms`,

        "&:focus-within": {
          borderColor: "primary.main",
        },

        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
        },
      })}
    >
      {/* Category icon */}
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          gridArea: "icon",
          display: "grid",
          placeItems: "center",
          alignSelf: "start",
          width: 40,
          height: 44,
          borderRadius: "10px",
          color: "primary.main",
          bgcolor: alpha(theme.palette.primary.main, 0.08),
        })}
      >
        <ActionIcon type={task.category} sx={{ fontSize: 22 }} />
      </Box>

      {/* Requirement details */}
      <Box sx={{ gridArea: "content", minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.7px",
            textTransform: "uppercase",
            color: "text.secondary",
          }}
        >
          {CATEGORIES[task.category]}
        </Typography>

        <Typography
          component="h3"
          sx={{
            mt: 0.5,
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 1.5,
            letterSpacing: "-0.25px",
            overflowWrap: "anywhere",
          }}
        >
          {title}
        </Typography>

        {task.description && (
          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,
              fontSize: 13,
              lineHeight: 1.75,
              overflowWrap: "anywhere",
            }}
          >
            {task.description}
          </Typography>
        )}

        {task.reviewNote && (
          <Box
            sx={(theme) => ({
              mt: 1.5,
              p: 1.5,
              borderLeft: "2px solid",
              borderColor: "secondary.main",
              borderRadius: "0 6px 6px 0",
              bgcolor: alpha(theme.palette.secondary.main, 0.075),
            })}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              Reviewer feedback
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                fontSize: 12.5,
                lineHeight: 1.7,
                overflowWrap: "anywhere",
              }}
            >
              {task.reviewNote}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Deadline */}
      <Box
        sx={{
          gridArea: "deadline",
          minWidth: 0,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,

          "@container student-actions (min-width: 520px)": {
            display: "block",
          },
        }}
      >
        <Box>
          <Typography
            color="text.secondary"
            sx={{ fontSize: 11.5, mb: 0.5 }}
          >
            Due date
          </Typography>

          <Typography
            component={deadline ? "time" : "p"}
            dateTime={deadline?.dateTime}
            sx={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.6,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {deadline?.formatted ||
              (task.dueDate
                ? "Date to be confirmed"
                : "No deadline set")}
          </Typography>
        </Box>

        {deadline && (
          <Box
            sx={(theme) => ({
              display: "inline-flex",
              alignItems: "center",
              gap: 0.625,
              px: 0.875,
              py: 0.5,
              borderRadius: "5px",
              maxWidth: "100%",
              bgcolor: alpha(
                deadline.urgent
                  ? theme.palette.secondary.main
                  : theme.palette.primary.main,
                0.09,
              ),

              "@container student-actions (min-width: 520px)": {
                mt: 0.75,
              },
            })}
          >
            <ActionIcon
              type="clock"
              sx={{
                fontSize: 14,
                flexShrink: 0,
                color: deadline.urgent
                  ? "secondary.main"
                  : "primary.main",
              }}
            />

            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                lineHeight: 1.5,
                overflowWrap: "anywhere",
              }}
            >
              {deadline.timing}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Requirement action */}
      <Button
        component={task.to ? RouterLink : "button"}
        to={task.to || undefined}
        disabled={!task.to}
        variant={primary ? "contained" : "outlined"}
        disableElevation
        aria-label={
          task.to
            ? `${label}: ${title}`
            : `Action unavailable: ${title}`
        }
        endIcon={<ActionIcon type="arrow" sx={{ fontSize: 18 }} />}
        sx={{
          ...(primary ? primaryButtonSx : actionButtonSx),
          gridArea: "action",
          width: "100%",
          justifyContent: "space-between",
          gap: 1,
          whiteSpace: "nowrap",
          overflowWrap: "normal",

          ...(!primary && {
            bgcolor: "#FFFFFF",
            color: "text.primary",
            borderColor: "#D9E4EA",

            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "#F4FBFE",
            },
          }),
        }}
      >
        {task.to ? label : "Action unavailable"}
      </Button>
    </Box>
  );
}

function LoadingRows() {
  return (
    <Box role="status" aria-label="Loading requirements">
      <Box
        component="ul"
        sx={{ m: 0, p: 0, display: "grid", gap: 1.5 }}
      >
        {[0, 1, 2].map((index) => (
          <Box component="li" key={index} sx={rowLayoutSx}>
            <Skeleton
              animation={false}
              variant="rounded"
              width={40}
              height={44}
              sx={{ gridArea: "icon", alignSelf: "start" }}
            />

            <Box sx={{ gridArea: "content", minWidth: 0 }}>
              <Skeleton animation={false} width="30%" height={18} />
              <Skeleton animation={false} width="75%" height={28} />
              <Skeleton animation={false} width="95%" height={22} />
            </Box>

            <Box sx={{ gridArea: "deadline" }}>
              <Skeleton animation={false} width="70%" height={20} />
              <Skeleton animation={false} width="85%" height={22} />
            </Box>

            <Skeleton
              animation={false}
              variant="rounded"
              height={44}
              sx={{ gridArea: "action" }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function MessageState({
  icon,
  title,
  description,
  children,
  alert = false,
}) {
  return (
    <Box
      role={alert ? "alert" : undefined}
      sx={{ py: 4, px: 1, textAlign: "center" }}
    >
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          display: "grid",
          placeItems: "center",
          width: 56,
          height: 56,
          mx: "auto",
          mb: 2,
          borderRadius: "14px",
          color: alert ? "secondary.main" : "primary.main",
          bgcolor: alpha(
            alert
              ? theme.palette.secondary.main
              : theme.palette.primary.main,
            0.08,
          ),
        })}
      >
        <ActionIcon type={icon} sx={{ fontSize: 27 }} />
      </Box>

      <Typography
        component="h3"
        sx={{ fontSize: 17, fontWeight: 600, lineHeight: 1.5 }}
      >
        {title}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          maxWidth: 440,
          mx: "auto",
          mt: 1,
          fontSize: 13.5,
          lineHeight: 1.8,
        }}
      >
        {description}
      </Typography>

      {children && <Box sx={{ mt: 2.5 }}>{children}</Box>}
    </Box>
  );
}

export default function StudentActionList({
  items = null,
  loading = false,
  error = false,
  onRetry,
}) {
  const headingId = useId();
  const filterId = useId();
  const listId = useId();
  const today = useToday();

  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const hasData = Array.isArray(items);
  const showContent = !loading && !error;
  const tasks = prepareTasks(items, today);

  const filters = [
    {
      value: "all",
      label: "All requirements",
      count: tasks.length,
    },
    ...Object.entries(CATEGORIES)
      .map(([value, label]) => ({
        value,
        label,
        count: tasks.filter((task) => task.category === value).length,
      }))
      .filter((option) => option.count > 0 || option.value === filter),
  ];

  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((task) => task.category === filter);

  const visibleTasks = expanded
    ? filteredTasks
    : filteredTasks.slice(0, INITIAL_VISIBLE_COUNT);

  const canExpand = filteredTasks.length > INITIAL_VISIBLE_COUNT;

  const emptyFilter =
    hasData && tasks.length > 0 && filteredTasks.length === 0;

  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby={headingId}
      aria-busy={loading}
      sx={{
        minWidth: 0,
        width: "100%",
        boxSizing: "border-box",
        bgcolor: "#FFFFFF",
        border: "1px solid #E5EAEE",
        borderRadius: "14px",
        boxShadow: "0 6px 28px rgba(64,64,65,0.04)",
        containerType: "inline-size",
        containerName: "student-actions",

        "@keyframes actionRowEnter": {
          from: {
            opacity: 0,
            transform: "translateY(6px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      {/* Section header */}
      <Box
        sx={{
          display: "grid",
          alignItems: "center",
          gap: 2.5,
          p: 2.5,
          borderBottom: "1px solid #EDF1F4",

          "@container student-actions (min-width: 700px)": {
            gridTemplateColumns: "minmax(0, 1fr) 220px",
            p: 3,
          },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.25,
            }}
          >
            <Typography
              id={headingId}
              component="h2"
              sx={{
                fontSize: 21,
                fontWeight: 700,
                lineHeight: 1.4,
                letterSpacing: "-0.5px",
              }}
            >
              Action centre
            </Typography>

            {showContent && hasData && (
              <Box
                component="span"
                sx={(theme) => ({
                  px: 1,
                  py: 0.375,
                  borderRadius: "6px",
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: "text.primary",
                  fontSize: 11.5,
                  fontWeight: 600,
                  lineHeight: 1.5,
                })}
              >
                {tasks.length} outstanding
              </Box>
            )}
          </Box>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.75, fontSize: 13.5, lineHeight: 1.75 }}
          >
            Review requests and complete the next steps for your application.
          </Typography>
        </Box>

        {/* Category filter */}
        {showContent && tasks.length > 0 && (
          <FormControl fullWidth size="small">
            <InputLabel id={filterId}>
              Show requirements
            </InputLabel>

            <Select
              labelId={filterId}
              label="Show requirements"
              value={filter}
              onChange={(event) => {
                setFilter(event.target.value);
                setExpanded(false);
              }}
              renderValue={(value) =>
                filters.find((option) => option.value === value)?.label ||
                "All requirements"
              }
              sx={{
                minHeight: 44,
                bgcolor: "#FFFFFF",
                borderRadius: "8px",
                fontSize: 13,

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#D9E4EA",
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
            >
              {filters.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{
                    minHeight: 44,
                    fontSize: 13,
                    gap: 3,
                    justifyContent: "space-between",
                  }}
                >
                  <span>{option.label}</span>

                  <Typography
                    component="span"
                    color="text.secondary"
                    sx={{ fontSize: 12 }}
                  >
                    {option.count}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Content */}
      <Box
        sx={{
          p: 2,

          "@container student-actions (min-width: 700px)": {
            p: 3,
          },
        }}
      >
        {loading ? (
          <LoadingRows />
        ) : error ? (
          <MessageState
            alert
            icon="alert"
            title="We couldn’t load your requirements"
            description="Please try again to see the requests that need your attention."
          >
            {typeof onRetry === "function" && (
              <Button
                onClick={onRetry}
                variant="contained"
                disableElevation
                sx={primaryButtonSx}
              >
                Try again
              </Button>
            )}
          </MessageState>
        ) : visibleTasks.length === 0 ? (
          <MessageState
            icon={hasData && !emptyFilter ? "check" : "other"}
            title={
              emptyFilter
                ? `No requirements in ${
                    CATEGORIES[filter] || "this category"
                  }`
                : hasData
                  ? "No outstanding requirements"
                  : "Requirements are not available yet"
            }
            description={
              emptyFilter
                ? "Choose another category to see your other requests."
                : hasData
                  ? "Any new requests from your consultant will appear here."
                  : "Your requests will appear here when the information becomes available."
            }
          >
            {emptyFilter && (
              <Button
                variant="contained"
                disableElevation
                onClick={() => {
                  setFilter("all");
                  setExpanded(false);
                }}
                sx={primaryButtonSx}
              >
                Show all requirements
              </Button>
            )}
          </MessageState>
        ) : (
          <>
            <Typography
              color="text.secondary"
              sx={{ mb: 1.5, fontSize: 11.5, lineHeight: 1.6 }}
            >
              Earliest deadlines first
            </Typography>

            <Box
              component="ul"
              id={listId}
              sx={{
                m: 0,
                p: 0,
                display: "grid",
                gap: 1.5,
              }}
            >
              {visibleTasks.map((task, index) => (
                <RequirementRow
                  key={task.id ?? task.sourceIndex}
                  task={task}
                  index={index}
                />
              ))}
            </Box>

            {/* Final control — no sample label beneath it. */}
            {canExpand && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  pt: 2.5,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setExpanded((value) => !value)}
                  aria-expanded={expanded}
                  aria-controls={listId}
                  endIcon={
                    <ActionIcon
                      type="chevron"
                      sx={{
                        fontSize: 18,
                        transform: expanded ? "rotate(180deg)" : "none",
                      }}
                    />
                  }
                  sx={{
                    ...actionButtonSx,
                    width: "100%",
                    color: "text.primary",
                    borderColor: "#D9E4EA",

                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "#F4FBFE",
                    },

                    "&:hover .MuiButton-endIcon": {
                      transform: "none",
                    },

                    "@container student-actions (min-width: 520px)": {
                      width: "auto",
                      minWidth: 210,
                    },
                  }}
                >
                  {expanded
                    ? "Show fewer requirements"
                    : `View all ${filteredTasks.length} requirements`}
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Paper>
  );
}