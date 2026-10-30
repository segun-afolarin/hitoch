import { useId, useState } from "react";
import {
  Box,
  ButtonBase,
  Collapse,
  Paper,
  SvgIcon,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

function CheckIcon() {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      sx={{ fontSize: 17 }}
    >
      <path
        d="m5 12 4 4L19 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function prepareStages(value) {
  if (!Array.isArray(value)) return null;

  const seen = new Set();

  const stages = value.filter((stage) => {
    if (
      !stage ||
      typeof stage.label !== "string" ||
      !stage.label.trim()
    ) {
      return false;
    }

    if (
      stage.id === null ||
      stage.id === undefined ||
      !String(stage.id).trim()
    ) {
      return false;
    }

    const id = String(stage.id);

    if (seen.has(id)) return false;

    seen.add(id);
    return true;
  });

  const currentCount = stages.filter(
    (stage) => stage.state === "current",
  ).length;

  return stages.map((stage) => {
    const recognisedState = [
      "complete",
      "current",
      "upcoming",
    ].includes(stage.state);

    const conflictingCurrent =
      stage.state === "current" && currentCount > 1;

    return {
      ...stage,
      id: String(stage.id),
      state:
        recognisedState && !conflictingCurrent
          ? stage.state
          : "unknown",
    };
  });
}

export default function StudentApplicationTracker({
  stages: source,
}) {
  const headingId = useId();
  const panelId = useId();

  const reduceMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  const [openId, setOpenId] = useState(undefined);

  const stages = prepareStages(source);

  const current = stages?.find(
    (stage) => stage.state === "current",
  );

  const completed =
    stages?.filter(
      (stage) => stage.state === "complete",
    ).length || 0;

  const expandedId =
    openId === undefined ? current?.id : openId;

  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby={headingId}
      sx={{
        minWidth: 0,
        p: { xs: 2.5, sm: 3 },
        bgcolor: "#FFFFFF",
        borderColor: "#E5EAEE",
        borderRadius: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          id={headingId}
          component="h2"
          sx={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "-0.35px",
          }}
        >
          Application journey
        </Typography>

        {Boolean(stages?.length) && (
          <Typography
            sx={{
              fontSize: 11.5,
              color: "text.secondary",
            }}
          >
            {completed} of {stages.length} complete
          </Typography>
        )}
      </Box>

      <Typography
        sx={{
          mt: 0.75,
          fontSize: 12.5,
          lineHeight: 1.8,
          color: "text.secondary",
        }}
      >
        Follow your progress. Select a stage to see what
        it involves.
      </Typography>

      {current && (
        <Box
          sx={(theme) => ({
            mt: 2.5,
            p: 2,
            borderRadius: "10px",
            bgcolor: alpha(
              theme.palette.primary.main,
              0.055,
            ),
            border: `1px solid ${alpha(
              theme.palette.primary.main,
              0.15,
            )}`,
          })}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.7px",
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            Current stage
          </Typography>

          <Typography
            sx={{
              mt: 0.75,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {current.label}
          </Typography>

          {current.owner && (
            <Typography
              sx={{
                mt: 0.75,
                fontSize: 12,
                color: "text.secondary",
              }}
            >
              Next move: {current.owner}
            </Typography>
          )}
        </Box>
      )}

      {!stages?.length ? (
        <Typography
          sx={{
            py: 3,
            fontSize: 13,
            color: "text.secondary",
          }}
        >
          Your recorded application stages will appear
          here when available.
        </Typography>
      ) : (
        <Box
          component="ol"
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            mt: 3,
          }}
        >
          {stages.map((stage, index) => {
            const done = stage.state === "complete";
            const active = stage.state === "current";
            const expanded = expandedId === stage.id;

            const contentId = `${panelId}-${index}`;
            const buttonId = `${contentId}-button`;

            const stamp =
              typeof stage.completedAt === "string"
                ? new Date(stage.completedAt)
                : null;

            const validDate =
              stamp && !Number.isNaN(stamp.getTime());

            const status = done
              ? "Completed"
              : active
                ? "In progress"
                : stage.state === "upcoming"
                  ? "Upcoming"
                  : "Status unavailable";

            return (
              <Box
                component="li"
                key={stage.id}
                aria-current={
                  active ? "step" : undefined
                }
                sx={{
                  position: "relative",
                  pb:
                    index === stages.length - 1
                      ? 0
                      : 1.75,
                }}
              >
                {index < stages.length - 1 && (
                  <Box
                    aria-hidden="true"
                    sx={{
                      position: "absolute",
                      left: 15,
                      top: 35,
                      bottom: 1,
                      width: 2,
                      bgcolor: done
                        ? "primary.main"
                        : "#E9EEF2",
                      opacity: done ? 0.3 : 1,
                    }}
                  />
                )}

                <ButtonBase
                  id={buttonId}
                  type="button"
                  disableRipple
                  aria-expanded={expanded}
                  aria-controls={contentId}
                  onClick={() =>
                    setOpenId(
                      expanded ? null : stage.id,
                    )
                  }
                  sx={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns:
                      "32px minmax(0, 1fr) 16px",
                    gap: 1.75,
                    textAlign: "left",
                    alignItems: "start",
                    borderRadius: "8px",
                    py: 0.75,

                    "&.Mui-focusVisible": {
                      outline: "2px solid #404041",
                      outlineOffset: 3,
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={(theme) => ({
                      width: 32,
                      height: 32,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "50%",
                      fontSize: 12,
                      fontWeight: 600,
                      bgcolor:
                        done || active
                          ? "primary.main"
                          : "#F4F6F8",
                      color:
                        done || active
                          ? "#FFFFFF"
                          : "text.secondary",
                      boxShadow: active
                        ? `0 0 0 5px ${alpha(
                            theme.palette.primary.main,
                            0.1,
                          )}`
                        : "none",
                    })}
                  >
                    {done ? <CheckIcon /> : index + 1}
                  </Box>

                  <Box
                    component="span"
                    sx={{ minWidth: 0, pt: 0.25 }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        display: "block",
                        fontSize: 13.5,
                        fontWeight: active ? 700 : 500,
                        lineHeight: 1.6,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {stage.label}
                    </Typography>

                    <Typography
                      component="span"
                      sx={{
                        display: "block",
                        fontSize: 11,
                        lineHeight: 1.7,
                        color: "text.secondary",
                      }}
                    >
                      {status}

                      {done && validDate
                        ? ` · ${stamp.toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}`
                        : ""}
                    </Typography>
                  </Box>

                  <SvgIcon
                    viewBox="0 0 24 24"
                    sx={{
                      mt: 1,
                      fontSize: 16,
                      color: "text.secondary",
                      transform: expanded
                        ? "rotate(180deg)"
                        : "none",
                    }}
                  >
                    <path
                      d="m6 9 6 6 6-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </SvgIcon>
                </ButtonBase>

                <Collapse
                  in={expanded}
                  timeout={reduceMotion ? 0 : 180}
                >
                  <Box
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    sx={{
                      ml: "46px",
                      pt: 0.75,
                      pb: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12.5,
                        lineHeight: 1.85,
                        color: "text.secondary",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {stage.description ||
                        "Further details will appear when this stage is updated."}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
}