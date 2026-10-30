import { useId, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Skeleton,
  SvgIcon,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

function Icon({ name, ...props }) {
  const paths = {
    search:
      "m20 20-4.5-4.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z",
    close: "m6 6 12 12M6 18 18 6",
    arrow: "M5 12h14m-6-6 6 6-6 6",
    check: "m5 12 4 4L19 6",
    building:
      "m3 8 9-5 9 5H3ZM5 10v8m5-8v8m4-8v8m5-8v8M3 21h18",
    folder:
      "M3 7a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9H3V7Z",
  };

  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path
        d={paths[name] || paths.folder}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

const primaryButtonSx = {
  minHeight: 44,
  px: 2.5,
  borderRadius: "8px",
  bgcolor: "primary.main",
  color: "#FFFFFF",
  boxShadow: "none",
  textTransform: "none",

  "&:hover": {
    bgcolor: "primary.dark",
    boxShadow: "none",
  },

  "&.Mui-focusVisible": {
    outline: "2px solid #404041",
    outlineOffset: 3,
  },
};

function filterApplications(records, query, filter) {
  const term = query.trim().toLowerCase();

  return records.filter((item) => {
    const text = [
      item.institutionName,
      item.programmeName,
      item.country,
      item.intakeLabel,
      item.reference,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesFilter =
      filter === "all" || item.requiresAction;

    const matchesSearch = !term || text.includes(term);

    return matchesFilter && matchesSearch;
  });
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  alert = false,
}) {
  return (
    <Box
      role={alert ? "alert" : "status"}
      sx={{
        px: 3,
        py: { xs: 5, sm: 6 },
        textAlign: "center",
      }}
    >
      <Box
        sx={(theme) => ({
          width: 64,
          height: 64,
          mx: "auto",
          mb: 2.5,
          borderRadius: "16px",
          display: "grid",
          placeItems: "center",
          color: "primary.main",
          bgcolor: alpha(
            theme.palette.primary.main,
            0.075,
          ),
        })}
      >
        <Icon name="folder" sx={{ fontSize: 30 }} />
      </Box>

      <Typography
        component="h3"
        sx={{
          fontSize: 18,
          fontWeight: 600,
          lineHeight: 1.5,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 1,
          maxWidth: 390,
          mx: "auto",
          fontSize: 14,
          lineHeight: 1.8,
          color: "text.secondary",
        }}
      >
        {description}
      </Typography>

      {typeof onAction === "function" && (
        <Button
          type="button"
          variant="contained"
          onClick={onAction}
          sx={{ ...primaryButtonSx, mt: 2.5 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

function ApplicationRow({
  application,
  selected,
  onSelect,
}) {
  return (
    <Box
      component="li"
      sx={{ borderTop: "1px solid #EDF0F3" }}
    >
      <ButtonBase
        component="button"
        type="button"
        disableRipple
        aria-pressed={selected}
        onClick={() => onSelect(application.id)}
        sx={(theme) => ({
          position: "relative",
          width: "100%",
          minWidth: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: 2.5,
          textAlign: "left",
          p: { xs: 2.5, sm: 3 },
          alignItems: "center",
          color: "text.primary",
          bgcolor: selected
            ? alpha(theme.palette.primary.main, 0.055)
            : "#FFFFFF",
          transition: "background-color 160ms ease",

          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 20,
            bottom: 20,
            width: 3,
            borderRadius: "0 4px 4px 0",
            bgcolor: selected
              ? "primary.main"
              : "transparent",
          },

          "&:hover": {
            bgcolor: alpha(
              theme.palette.primary.main,
              selected ? 0.085 : 0.035,
            ),
          },

          "&.Mui-focusVisible": {
            outline: "2px solid #404041",
            outlineOffset: -3,
          },

          "@container application-selector (min-width: 800px)": {
            gridTemplateColumns:
              "minmax(0, 1.5fr) minmax(0, 0.85fr) minmax(150px, 0.7fr)",
          },

          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
          },
        })}
      >
        {/* Institution and programme */}
        <Box
          component="span"
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.75,
            minWidth: 0,
          }}
        >
          <Avatar
            component="span"
            variant="rounded"
            src={application.institutionLogo || undefined}
            alt=""
            sx={(theme) => ({
              width: 46,
              height: 46,
              flexShrink: 0,
              borderRadius: "10px",
              bgcolor: "#FFFFFF",
              color: "primary.main",
              border: `1px solid ${alpha(
                theme.palette.primary.main,
                0.2,
              )}`,

              "& img": {
                objectFit: "contain",
                p: "5px",
                boxSizing: "border-box",
              },
            })}
          >
            <Icon
              name="building"
              sx={{ fontSize: 25 }}
            />
          </Avatar>

          <Box
            component="span"
            sx={{
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            <Typography
              component="span"
              sx={{
                display: "block",
                fontSize: 12.5,
                lineHeight: 1.6,
                color: "text.secondary",
              }}
            >
              {application.institutionName}
            </Typography>

            <Typography
              component="span"
              sx={{
                display: "block",
                mt: 0.5,
                fontSize: 17,
                fontWeight: 600,
                lineHeight: 1.5,
                letterSpacing: "-0.25px",
              }}
            >
              {application.programmeName}
            </Typography>

            {application.reference && (
              <Typography
                component="span"
                sx={{
                  display: "block",
                  mt: 0.75,
                  fontSize: 11.5,
                  color: "text.secondary",
                }}
              >
                Reference · {application.reference}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Application details */}
        <Box
          component="span"
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: 2,
          }}
        >
          {[
            [
              "Destination",
              application.country || "To be confirmed",
            ],
            [
              "Intake",
              application.intakeLabel || "To be confirmed",
            ],
          ].map(([label, value]) => (
            <Box
              component="span"
              key={label}
              sx={{ minWidth: 0 }}
            >
              <Typography
                component="span"
                sx={{
                  display: "block",
                  mb: 0.75,
                  fontSize: 10.5,
                  color: "text.secondary",
                }}
              >
                {label}
              </Typography>

              <Typography
                component="span"
                sx={{
                  display: "block",
                  fontSize: 12.5,
                  fontWeight: 500,
                  lineHeight: 1.65,
                  overflowWrap: "anywhere",
                }}
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Status and selection */}
        <Box
          component="span"
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            alignItems: "center",
            gap: 2,

            "@container application-selector (min-width: 800px)": {
              gridTemplateColumns: "minmax(0, 1fr)",
              justifyItems: "end",
              gap: 1.5,
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 0.75,
              minWidth: 0,
            }}
          >
            <Box
              component="span"
              aria-hidden="true"
              sx={{
                width: 6,
                height: 6,
                flexShrink: 0,
                borderRadius: "50%",
                mt: "7px",
                bgcolor: application.requiresAction
                  ? "secondary.main"
                  : "primary.main",
              }}
            />

            <Box component="span" sx={{ minWidth: 0 }}>
              <Typography
                component="span"
                sx={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: 1.6,
                  overflowWrap: "anywhere",
                }}
              >
                {application.statusLabel ||
                  "Status not available"}
              </Typography>

              {application.requiresAction && (
                <Typography
                  component="span"
                  sx={{
                    display: "block",
                    mt: 0.25,
                    fontSize: 10.5,
                    lineHeight: 1.6,
                    color: "text.secondary",
                  }}
                >
                  Your action is needed
                </Typography>
              )}
            </Box>
          </Box>

          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              minHeight: 40,
              minWidth: 98,
              px: 1.5,
              boxSizing: "border-box",
              borderRadius: "8px",
              bgcolor: selected
                ? "primary.main"
                : "#FFFFFF",
              color: selected
                ? "#FFFFFF"
                : "text.primary",
              border: "1px solid",
              borderColor: selected
                ? "primary.main"
                : "#DDE5EA",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {selected ? "Selected" : "Select"}

            <Icon
              name={selected ? "check" : "arrow"}
              sx={{ fontSize: 16 }}
            />
          </Box>
        </Box>
      </ButtonBase>
    </Box>
  );
}

export default function StudentApplicationSelector({
  applications = null,
  selectedId = null,
  onSelect,
  loading = false,
  error = false,
  onRetry,
}) {
  const headingId = useId();
  const searchId = useId();
  const searchRef = useRef(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const hasData = Array.isArray(applications);
  const records = hasData ? applications : [];
  const ready = hasData && !loading && !error;

  const attentionCount = records.filter(
    (item) => item.requiresAction,
  ).length;

  const visible = filterApplications(
    records,
    query,
    filter,
  );

  function clearSearch() {
    setQuery("");
    searchRef.current?.focus();
  }

  function resetFilters() {
    setQuery("");
    setFilter("all");
    searchRef.current?.focus();
  }

  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby={headingId}
      aria-busy={loading}
      sx={{
        containerType: "inline-size",
        containerName: "application-selector",
        minWidth: 0,
        overflow: "hidden",
        bgcolor: "#FFFFFF",
        borderColor: "#E5EAEE",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(64,64,65,0.025)",
      }}
    >
      {/* Heading and search */}
      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          p: { xs: 2.5, sm: 3 },

          "@container application-selector (min-width: 660px)": {
            gridTemplateColumns:
              "minmax(0, 1fr) minmax(240px, 320px)",
            alignItems: "center",
          },
        }}
      >
        <Box>
          <Typography
            id={headingId}
            component="h2"
            sx={{
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.5,
              letterSpacing: "-0.35px",
            }}
          >
            Your applications
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 12.5,
              lineHeight: 1.7,
              color: "text.secondary",
            }}
          >
            Choose the application you want to follow.
          </Typography>
        </Box>

        {ready && records.length > 0 && (
          <FormControl
            fullWidth
            size="small"
            variant="outlined"
          >
            <InputLabel htmlFor={searchId}>
              Search applications
            </InputLabel>

            <OutlinedInput
              id={searchId}
              inputRef={searchRef}
              label="Search applications"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              startAdornment={
                <InputAdornment position="start">
                  <Icon
                    name="search"
                    sx={{
                      fontSize: 19,
                      color: "text.secondary",
                    }}
                  />
                </InputAdornment>
              }
              endAdornment={
                query ? (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      aria-label="Clear search"
                      onClick={clearSearch}
                      edge="end"
                      size="small"
                      sx={{ width: 40, height: 40 }}
                    >
                      <Icon
                        name="close"
                        sx={{ fontSize: 17 }}
                      />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
              sx={{
                minHeight: 46,
                borderRadius: "8px",
                fontSize: { xs: 16, sm: 13 },

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#DDE5EA",
                },
              }}
            />
          </FormControl>
        )}
      </Box>

      {/* Filters */}
      {ready && records.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
            px: { xs: 2.5, sm: 3 },
            pb: 2.5,
          }}
        >
          <Box
            role="group"
            aria-label="Filter applications"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {[
              ["all", "All applications", records.length],
              ["attention", "Needs attention", attentionCount],
            ].map(([value, label, count]) => (
              <Button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                sx={{
                  minHeight: 42,
                  px: 1.75,
                  gap: 1,
                  fontSize: 12,
                  borderRadius: "8px",
                  textTransform: "none",
                  color:
                    filter === value
                      ? "#FFFFFF"
                      : "text.secondary",
                  bgcolor:
                    filter === value
                      ? "primary.main"
                      : "#FFFFFF",
                  border: "1px solid",
                  borderColor:
                    filter === value
                      ? "primary.main"
                      : "#E5EAEE",

                  "&:hover": {
                    bgcolor:
                      filter === value
                        ? "primary.dark"
                        : "#F5FAFC",
                  },

                  "&.Mui-focusVisible": {
                    outline: "2px solid #404041",
                    outlineOffset: 3,
                  },
                }}
              >
                {label}

                <Box
                  component="span"
                  sx={{
                    minWidth: 20,
                    px: 0.5,
                    py: 0.125,
                    borderRadius: "4px",
                    fontSize: 11,
                    lineHeight: 1.5,
                    fontVariantNumeric: "tabular-nums",
                    bgcolor:
                      filter === value
                        ? "rgba(255,255,255,0.18)"
                        : "#F1F4F6",
                  }}
                >
                  {count}
                </Box>
              </Button>
            ))}
          </Box>

          <Typography
            role="status"
            aria-live="polite"
            sx={{
              fontSize: 11.5,
              color: "text.secondary",
            }}
          >
            {visible.length} of {records.length} shown
          </Typography>
        </Box>
      )}

      {/* Application list and states */}
      {loading ? (
        <Box
          role="status"
          aria-label="Loading applications"
          sx={{ borderTop: "1px solid #EDF0F3" }}
        >
          {[0, 1, 2].map((item) => (
            <Box
              key={item}
              sx={{
                display: "flex",
                gap: 2,
                p: 3,

                "& + &": {
                  borderTop: "1px solid #EDF0F3",
                },
              }}
            >
              <Skeleton
                animation={false}
                variant="rounded"
                width={46}
                height={46}
                sx={{ flexShrink: 0 }}
              />

              <Box sx={{ flex: 1 }}>
                <Skeleton
                  animation={false}
                  width="45%"
                  height={20}
                />
                <Skeleton
                  animation={false}
                  width="75%"
                  height={28}
                />
                <Skeleton
                  animation={false}
                  width="30%"
                  height={18}
                />
              </Box>
            </Box>
          ))}
        </Box>
      ) : error ? (
        <EmptyState
          alert
          title="We couldn’t load your applications"
          description="Please try again shortly to view your applications."
          actionLabel="Try again"
          onAction={onRetry}
        />
      ) : !hasData ? (
        <EmptyState
          title="Applications are not available yet"
          description="Your application list will appear here when it is available."
          actionLabel="Try again"
          onAction={onRetry}
        />
      ) : records.length === 0 ? (
        <EmptyState
          title="Your application journey starts here"
          description="When an application is created for you, you’ll be able to select it here and follow its progress."
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No applications match your filters"
          description="Try another university, programme or reference, or clear your filters to see all applications."
          actionLabel="Clear filters"
          onAction={resetFilters}
        />
      ) : (
        <Box
          component="ul"
          sx={{
            m: 0,
            p: 0,
            listStyle: "none",
          }}
        >
          {visible.map((application) => (
            <ApplicationRow
              key={application.id}
              application={application}
              selected={application.id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
}