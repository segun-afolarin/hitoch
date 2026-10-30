import { useId } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  LinearProgress,
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

function ProfileIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="9" cy="9" r="2" />
        <path d="M5.8 16c.4-2 1.5-3 3.2-3s2.8 1 3.2 3" />
        <path d="M15 8h3m-3 4h3m-3 4h2" />
      </g>
    </SvgIcon>
  );
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

export default function StudentProfileProgress({
  profile = null,
  loading = false,
  error = false,
  onRetry,
}) {
  const headingId = useId();

  const total = profile?.totalSections;
  const completed = profile?.completedSections;

  const hasProgress =
    Number.isSafeInteger(total) &&
    total > 0 &&
    Number.isSafeInteger(completed) &&
    completed >= 0 &&
    completed <= total;

  const isComplete = hasProgress && completed === total;
  const progressValue = hasProgress ? (completed / total) * 100 : 0;

  const percentage = isComplete
    ? 100
    : Math.min(99, Math.round(progressValue));

  const remaining = hasProgress ? total - completed : null;
  const nextSection = !isComplete ? profile?.nextSection : null;

  const nextSectionLabel =
    typeof nextSection?.label === "string"
      ? nextSection.label.trim()
      : "";

  const destination = nextSection?.to || "/student/profile";

  const buttonLabel = !hasProgress
    ? "View profile"
    : isComplete
      ? "Review profile"
      : completed === 0
        ? "Start your profile"
        : "Continue profile";

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
          Profile completeness
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
          <ProfileIcon sx={{ fontSize: 23 }} />
        </Box>
      </Box>

      {loading ? (
        <Box
          role="status"
          aria-label="Loading profile completeness"
          sx={{ display: "flex", flexDirection: "column", flex: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Skeleton animation={false} width={120} height={64} />
            <Skeleton animation={false} width={92} height={36} />
          </Box>

          <Skeleton
            animation={false}
            variant="rounded"
            height={8}
            sx={{ mt: 2, mb: 3 }}
          />

          <Skeleton animation={false} width={100} height={20} />
          <Skeleton animation={false} width="70%" height={28} />
          <Skeleton animation={false} width="90%" height={22} />

          <Box sx={{ mt: "auto", pt: 3 }}>
            <Skeleton
              animation={false}
              variant="rounded"
              height={48}
              sx={{ borderRadius: "8px" }}
            />
          </Box>
        </Box>
      ) : error ? (
        <>
          <Box role="alert" sx={{ flex: 1 }}>
            <Typography
              component="h3"
              sx={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5 }}
            >
              We couldn’t load your progress
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1, fontSize: 14, lineHeight: 1.75 }}
            >
              Please try again to see your completed sections and next step.
            </Typography>
          </Box>

          {typeof onRetry === "function" && (
            <Box sx={{ pt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                disableElevation
                onClick={onRetry}
                endIcon={<ArrowIcon />}
                sx={actionStyles}
              >
                Try again
              </Button>
            </Box>
          )}
        </>
      ) : (
        <>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {hasProgress ? (
              <>
                {/* Progress summary */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Typography
                    component="p"
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 0.25,
                      fontSize: { xs: 48, sm: 56 },
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: "-2.5px",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {percentage}

                    <Box
                      component="span"
                      sx={{
                        fontSize: 25,
                        fontWeight: 500,
                        letterSpacing: "-0.5px",
                        color: "text.secondary",
                      }}
                    >
                      %
                    </Box>
                  </Typography>

                  <Box sx={{ pb: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 700,
                        lineHeight: 1.4,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {completed}
                      <Box
                        component="span"
                        sx={{ color: "text.secondary", fontWeight: 400 }}
                      >
                        {" "}of {total}
                      </Box>
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{ mt: 0.25, fontSize: 12.5, lineHeight: 1.5 }}
                    >
                      sections complete
                    </Typography>
                  </Box>
                </Box>

                {/* Each segment represents one section for smaller totals. */}
                <Box sx={{ position: "relative", mt: 2.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    aria-label="Profile completeness"
                    aria-valuetext={`${completed} of ${total} sections complete`}
                    sx={{
                      height: 8,
                      borderRadius: "3px",
                      bgcolor: "#EDF1F4",

                      "& .MuiLinearProgress-bar": {
                        bgcolor: "primary.main",
                        borderRadius: 0,
                      },

                      "@media (prefers-reduced-motion: reduce)": {
                        "& .MuiLinearProgress-bar": {
                          transition: "none",
                        },
                      },
                    }}
                  />

                  {total > 1 && total <= 12 && (
                    <Box
                      aria-hidden="true"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))`,
                        pointerEvents: "none",
                      }}
                    >
                      {Array.from({ length: total }, (_, index) => (
                        <Box
                          key={index}
                          sx={{
                            "&:not(:last-child)": {
                              borderRight: "4px solid #FFFFFF",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 1.25, fontSize: 12.5, lineHeight: 1.6 }}
                >
                  {isComplete
                    ? "All sections completed"
                    : `${remaining} ${
                        remaining === 1 ? "section" : "sections"
                      } remaining`}
                </Typography>

                {/* Next action */}
                <Box
                  sx={(theme) => ({
                    mt: 3,
                    p: 2,
                    borderRadius: "0 8px 8px 0",
                    borderLeft: "3px solid",
                    borderColor: isComplete
                      ? "primary.main"
                      : "secondary.main",
                    bgcolor: alpha(
                      isComplete
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
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
                    {isComplete ? "Profile complete" : "Next to complete"}
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
                    {isComplete
                      ? "Your information is up to date"
                      : nextSectionLabel || "Review your remaining sections"}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{ mt: 0.75, fontSize: 13, lineHeight: 1.7 }}
                  >
                    {isComplete
                      ? "Review your details whenever your circumstances change."
                      : "Complete your details to help your consultant review your study options."}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ py: 1 }}>
                <Typography
                  component="h3"
                  sx={{ fontSize: 17, fontWeight: 600, lineHeight: 1.5 }}
                >
                  Your profile overview
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 1, fontSize: 14, lineHeight: 1.8 }}
                >
                  Progress is currently unavailable. Open your profile to
                  review and update your information.
                </Typography>
              </Box>
            )}
          </Box>

          {/* Final element: nothing is rendered beneath this button. */}
          <Box sx={{ pt: 3 }}>
            <Button
              component={RouterLink}
              to={destination}
              fullWidth
              variant="contained"
              disableElevation
              endIcon={<ArrowIcon sx={{ fontSize: 20 }} />}
              sx={actionStyles}
            >
              {buttonLabel}
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
}