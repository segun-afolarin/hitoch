import { useId, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

function parseDueDate(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return null;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  const date = new Date(`${value}T12:00:00`);

  return !Number.isNaN(date.getTime()) &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
}

function internalPath(value) {
  return typeof value === "string" &&
    /^\/(?!\/)/.test(value) &&
    !/[\\\u0000-\u0020]/.test(value)
    ? value
    : null;
}

const buttonSx = {
  minHeight: 44,
  borderRadius: "8px",
  px: 2,
  fontSize: 12.5,
  textTransform: "none",
  boxShadow: "none",

  "&.Mui-focusVisible": {
    outline: "2px solid #404041",
    outlineOffset: 3,
  },
};

export default function StudentApplicationActions({
  actions: source,
  waitingMessage,
}) {
  const headingId = useId();
  const dialogId = useId();

  const [detail, setDetail] = useState(null);

  const actions = Array.isArray(source)
    ? source
        .filter(
          (item) =>
            item && typeof item.title === "string",
        )
        .map((item, index) => ({
          ...item,
          sourceIndex: index,
          date: parseDueDate(item.dueDate),
        }))
        .sort(
          (a, b) =>
            (a.date?.getTime() ?? Infinity) -
              (b.date?.getTime() ?? Infinity) ||
            a.sourceIndex - b.sourceIndex,
        )
    : null;

  return (
    <>
      <Paper
        component="section"
        variant="outlined"
        aria-labelledby={headingId}
        sx={{
          minWidth: 0,
          overflow: "hidden",
          bgcolor: "#FFFFFF",
          borderColor: "#E5EAEE",
          borderRadius: "16px",
        }}
      >
        <Box
          sx={{
            p: { xs: 2.5, sm: 3 },
            pb: 2.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
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
              Required actions
            </Typography>

            {actions && (
              <Box
                sx={(theme) => ({
                  display: "grid",
                  placeItems: "center",
                  minWidth: 30,
                  height: 30,
                  px: 0.75,
                  borderRadius: "8px",
                  fontSize: 12,
                  fontWeight: 700,
                  bgcolor: alpha(
                    theme.palette.secondary.main,
                    0.14,
                  ),
                })}
              >
                {actions.length}
              </Box>
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
            Your next steps for this application.
          </Typography>
        </Box>

        {!actions?.length ? (
          <Box
            sx={{
              px: { xs: 2.5, sm: 3 },
              pb: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {actions
                ? "No action needed from you"
                : "Requirements are not available yet"}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: 12.5,
                lineHeight: 1.85,
                color: "text.secondary",
              }}
            >
              {actions
                ? waitingMessage ||
                  "Your next requirement will appear here when it is shared with you."
                : "Check again for the latest requirements for this application."}
            </Typography>
          </Box>
        ) : (
          <Box
            component="ol"
            sx={{
              listStyle: "none",
              m: 0,
              p: 0,
            }}
          >
            {actions.map((action, index) => {
              const to = internalPath(action.to);

              return (
                <Box
                  component="li"
                  key={action.id || action.sourceIndex}
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderTop: "1px solid #EDF0F3",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 1.25,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                        color: "text.secondary",
                      }}
                    >
                      {action.category || "Requirement"}
                    </Typography>

                    {action.date && (
                      <Typography
                        component="time"
                        dateTime={action.dueDate}
                        sx={{
                          ml: "auto",
                          fontSize: 11.5,
                          fontWeight: 500,
                        }}
                      >
                        Due{" "}
                        {action.date.toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </Typography>
                    )}
                  </Box>

                  <Typography
                    component="h3"
                    sx={{
                      fontSize: 15,
                      fontWeight: 600,
                      lineHeight: 1.6,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {action.title}
                  </Typography>

                  {action.description && (
                    <Typography
                      sx={{
                        mt: 0.75,
                        fontSize: 12.5,
                        lineHeight: 1.85,
                        color: "text.secondary",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {action.description}
                    </Typography>
                  )}

                  {action.reviewNote && (
                    <Box
                      sx={(theme) => ({
                        mt: 1.75,
                        py: 1.25,
                        px: 1.5,
                        borderLeft: "3px solid",
                        borderColor: "secondary.main",
                        bgcolor: alpha(
                          theme.palette.secondary.main,
                          0.065,
                        ),
                        borderRadius: "0 6px 6px 0",
                      })}
                    >
                      <Typography
                        sx={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          mb: 0.5,
                        }}
                      >
                        Consultant feedback
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12,
                          lineHeight: 1.8,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {action.reviewNote}
                      </Typography>
                    </Box>
                  )}

                  <Button
                    component={to ? RouterLink : "button"}
                    to={to || undefined}
                    type={to ? undefined : "button"}
                    onClick={
                      to
                        ? undefined
                        : () => setDetail(action)
                    }
                    variant={
                      index === 0
                        ? "contained"
                        : "outlined"
                    }
                    sx={{
                      ...buttonSx,
                      mt: 2,
                      width: "100%",
                      color:
                        index === 0
                          ? "#FFFFFF"
                          : "text.primary",
                      bgcolor:
                        index === 0
                          ? "primary.main"
                          : "#FFFFFF",
                      borderColor: "#DDE5EA",

                      "&:hover": {
                        bgcolor:
                          index === 0
                            ? "primary.dark"
                            : "#F5FAFC",
                        borderColor: "primary.main",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {to
                      ? action.actionLabel ||
                        "Open requirement"
                      : "View requirement"}
                  </Button>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      <Dialog
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        aria-labelledby={dialogId}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "16px",
            m: 2,
            width: "calc(100% - 32px)",
          },
        }}
      >
        <DialogTitle
          id={dialogId}
          sx={{
            fontSize: 19,
            fontWeight: 600,
            pr: 3,
          }}
        >
          {detail?.title}
        </DialogTitle>

        <DialogContent dividers>
          <Typography
            sx={{
              fontSize: 14,
              lineHeight: 1.85,
              color: "text.secondary",
            }}
          >
            {detail?.description}
          </Typography>

          {Array.isArray(detail?.instructions) && (
            <Box
              component="ul"
              sx={{
                pl: 2.5,
                my: 2,

                "& li + li": {
                  mt: 1.5,
                },
              }}
            >
              {detail.instructions.map(
                (instruction, index) => (
                  <Typography
                    component="li"
                    key={index}
                    sx={{
                      fontSize: 13,
                      lineHeight: 1.85,
                    }}
                  >
                    {instruction}
                  </Typography>
                ),
              )}
            </Box>
          )}

          {detail?.reviewNote && (
            <Typography
              sx={{
                mt: 2,
                fontSize: 13,
                lineHeight: 1.85,
              }}
            >
              <Box
                component="span"
                sx={{ fontWeight: 600 }}
              >
                Consultant feedback:{" "}
              </Box>
              {detail.reviewNote}
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setDetail(null)}
            variant="contained"
            sx={{
              ...buttonSx,
              bgcolor: "primary.main",
              color: "#FFFFFF",

              "&:hover": {
                bgcolor: "primary.dark",
                boxShadow: "none",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}