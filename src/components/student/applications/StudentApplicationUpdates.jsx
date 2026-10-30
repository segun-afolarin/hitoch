import { useId, useState } from "react";
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

function timestamp(value) {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function documentUrl(value) {
  try {
    if (typeof value !== "string") return null;

    const url = new URL(value);

    return url.protocol === "https:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function prepareUpdates(value) {
  if (!Array.isArray(value)) return null;

  // The API must enforce student visibility before
  // returning records. This filter is an extra safeguard.
  return value
    .filter(
      (item) =>
        item &&
        item.visibility === "student" &&
        typeof item.title === "string",
    )
    .map((item, index) => ({
      ...item,
      sourceIndex: index,
      date: timestamp(item.createdAt),
    }))
    .sort(
      (a, b) =>
        (b.date?.getTime() ?? -Infinity) -
          (a.date?.getTime() ?? -Infinity) ||
        a.sourceIndex - b.sourceIndex,
    );
}

const buttonSx = {
  minHeight: 44,
  px: 1.75,
  borderRadius: "8px",
  fontSize: 12,
  textTransform: "none",
  color: "text.primary",
  borderColor: "#DDE5EA",

  "&:hover": {
    bgcolor: "#F5FAFC",
    borderColor: "primary.main",
  },

  "&.Mui-focusVisible": {
    outline: "2px solid #404041",
    outlineOffset: 3,
  },
};

export default function StudentApplicationUpdates({
  updates: source,
}) {
  const headingId = useId();
  const dialogId = useId();

  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState(null);

  const updates = prepareUpdates(source);

  const visible = expanded
    ? updates
    : updates?.slice(0, 3);

  return (
    <>
      <Paper
        component="section"
        variant="outlined"
        aria-labelledby={headingId}
        sx={{
          p: { xs: 2.5, sm: 3 },
          minWidth: 0,
          bgcolor: "#FFFFFF",
          borderColor: "#E5EAEE",
          borderRadius: "16px",
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
          Application updates
        </Typography>

        <Typography
          sx={{
            mt: 0.75,
            fontSize: 12.5,
            color: "text.secondary",
            lineHeight: 1.8,
          }}
        >
          Updates and documents shared with you.
        </Typography>

        {!updates?.length ? (
          <Typography
            sx={{
              py: 3,
              fontSize: 13,
              lineHeight: 1.8,
              color: "text.secondary",
            }}
          >
            {updates
              ? "Updates will appear here when they are shared with you."
              : "Application updates are not available yet."}
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
            {visible.map((update, index) => {
              const url = documentUrl(
                update.attachment?.url,
              );

              const hasNote =
                typeof update.attachment?.content ===
                  "string" &&
                update.attachment.content.trim();

              return (
                <Box
                  component="li"
                  key={update.id || update.sourceIndex}
                  sx={{
                    position: "relative",
                    pl: 3,
                    pb:
                      index === visible.length - 1
                        ? 0
                        : 3,
                  }}
                >
                  <Box
                    aria-hidden="true"
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: 6,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: update.attachment
                        ? "secondary.main"
                        : "primary.main",
                    }}
                  />

                  {index < visible.length - 1 && (
                    <Box
                      aria-hidden="true"
                      sx={{
                        position: "absolute",
                        left: 3,
                        top: 20,
                        bottom: 3,
                        width: 1,
                        bgcolor: "#E5EAEE",
                      }}
                    />
                  )}

                  <Typography
                    component={
                      update.date ? "time" : "p"
                    }
                    dateTime={update.date?.toISOString()}
                    sx={{
                      display: "block",
                      fontSize: 10.5,
                      lineHeight: 1.7,
                      color: "text.secondary",
                    }}
                  >
                    {update.date
                      ? update.date.toLocaleString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : "Date not available"}
                  </Typography>

                  <Typography
                    component="h3"
                    sx={{
                      mt: 0.75,
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: 1.6,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {update.title}
                  </Typography>

                  {update.body && (
                    <Typography
                      sx={{
                        mt: 0.75,
                        fontSize: 12.5,
                        lineHeight: 1.85,
                        color: "text.secondary",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {update.body}
                    </Typography>
                  )}

                  {update.authorName && (
                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: 11,
                        fontWeight: 500,
                      }}
                    >
                      {update.authorName}
                      {update.authorRole
                        ? ` · ${update.authorRole}`
                        : ""}
                    </Typography>
                  )}

                  {update.attachment && (
                    <Box sx={{ mt: 1.5 }}>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 600,
                          mb: 1,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {update.attachment.name ||
                          "Shared document"}
                      </Typography>

                      {url ? (
                        <Button
                          component="a"
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${
                            update.attachment.name ||
                            "document"
                          } in a new tab`}
                          variant="outlined"
                          sx={buttonSx}
                        >
                          Open document ↗
                        </Button>
                      ) : hasNote ? (
                        <Button
                          type="button"
                          onClick={() =>
                            setNote(update.attachment)
                          }
                          variant="outlined"
                          sx={buttonSx}
                        >
                          Read note
                        </Button>
                      ) : (
                        <Typography
                          sx={{
                            fontSize: 11.5,
                            color: "text.secondary",
                          }}
                        >
                          Document link is not available.
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        )}

        {updates?.length > 3 && (
          <Button
            type="button"
            aria-expanded={expanded}
            onClick={() =>
              setExpanded((value) => !value)
            }
            variant="outlined"
            sx={{
              ...buttonSx,
              mt: 3,
              width: "100%",
            }}
          >
            {expanded
              ? "Show fewer updates"
              : `View all ${updates.length} updates`}
          </Button>
        )}
      </Paper>

      <Dialog
        open={Boolean(note)}
        onClose={() => setNote(null)}
        fullWidth
        maxWidth="sm"
        aria-labelledby={dialogId}
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
          }}
        >
          {note?.name}
        </DialogTitle>

        <DialogContent dividers>
          <Typography
            sx={{
              whiteSpace: "pre-wrap",
              fontSize: 14,
              lineHeight: 1.9,
              overflowWrap: "anywhere",
            }}
          >
            {note?.content}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setNote(null)}
            variant="outlined"
            sx={buttonSx}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}