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

  // Student visibility must also be enforced by the API.
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
  fontWeight: 600,
  textTransform: "none",
  color: "text.primary",
  borderColor: "#DDE5EA",

  "&:hover": {
    bgcolor: "#F5FAFC",
    borderColor: "#00AEEF",
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
  const listId = useId();

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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              pt: 3.5,
              pb: 3,
              px: 1,
            }}
          >
            <Box
              component="svg"
              viewBox="0 0 220 168"
              aria-hidden="true"
              focusable="false"
              sx={{
                display: "block",
                width: 176,
                maxWidth: "100%",
                height: "auto",
                mb: 2,
              }}
            >
              <circle
                cx="109"
                cy="77"
                r="60"
                fill="#F3F9FD"
              />

              <ellipse
                cx="110"
                cy="149"
                rx="62"
                ry="5"
                fill="#EAF1F5"
              />

              {/* Folder back */}
              <path
                d="M42 103V89a8 8 0 0 1 8-8h28l10 10h74a8 8 0 0 1 8 8v34a10 10 0 0 1-10 10H52a10 10 0 0 1-10-10Z"
                fill="#C8EAF9"
                stroke="#A1D8EE"
                strokeWidth="1.5"
              />

              {/* Document stack */}
              <rect
                x="80"
                y="24"
                width="77"
                height="105"
                rx="10"
                fill="#E5F2FA"
                stroke="#D7E9F3"
                strokeWidth="1.5"
                transform="rotate(8 118 76)"
              />

              <rect
                x="64"
                y="20"
                width="78"
                height="111"
                rx="10"
                fill="#FFFFFF"
                stroke="#D8E7EF"
                strokeWidth="1.5"
              />

              <rect
                x="78"
                y="35"
                width="25"
                height="23"
                rx="6"
                fill="#EAF7FD"
              />

              <path
                d="M85 43h11M85 49h7"
                fill="none"
                stroke="#00AEEF"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M79 72h47M79 84h36M79 96h41"
                fill="none"
                stroke="#D9E6EE"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Folder front */}
              <path
                d="M46 101h128a5 5 0 0 1 5 6l-8 29a10 10 0 0 1-10 7H55a10 10 0 0 1-10-8l-4-28a5 5 0 0 1 5-6Z"
                fill="#E5F5FC"
                stroke="#A7DAEF"
                strokeWidth="1.5"
              />

              <path
                d="M62 121h29"
                stroke="#8AC8E0"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <circle
                cx="151"
                cy="121"
                r="3"
                fill="#00AEEF"
                opacity=".55"
              />

              {/* Consultant note */}
              <path
                d="M160 46h25a9 9 0 0 1 9 9v13a9 9 0 0 1-9 9h-13l-10 8v-8h-2a9 9 0 0 1-9-9V55a9 9 0 0 1 9-9Z"
                fill="#FFFFFF"
                stroke="#EEDBCC"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              <circle
                cx="163"
                cy="62"
                r="2"
                fill="#FD933D"
              />

              <circle
                cx="173"
                cy="62"
                r="2"
                fill="#FD933D"
              />

              <circle
                cx="183"
                cy="62"
                r="2"
                fill="#FD933D"
              />

              {/* Decorative accents */}
              <circle
                cx="31"
                cy="69"
                r="3.5"
                fill="#C3E8F7"
              />

              <circle
                cx="192"
                cy="120"
                r="3"
                fill="#FD933D"
                opacity=".55"
              />

              <path
                d="M44 36h8m-4-4v8"
                stroke="#B5DCEB"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </Box>

            <Typography
              component="h3"
              sx={{
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "-0.2px",
                lineHeight: 1.5,
                color: "#404041",
              }}
            >
              {updates
                ? "No updates shared yet"
                : "Updates are currently unavailable"}
            </Typography>

            <Typography
              sx={{
                mt: 0.75,
                maxWidth: 290,
                fontSize: 13,
                lineHeight: 1.85,
                color: "#6F6F73",
              }}
            >
              {updates
                ? "Progress updates, notes and documents from your consultant will appear here."
                : "Please check again shortly to view your application updates."}
            </Typography>
          </Box>
        ) : (
          <Box
            component="ol"
            id={listId}
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
                  key={update.id ?? update.sourceIndex}
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
                        ? "#FD933D"
                        : "#00AEEF",
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
                        width: "1px",
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

                  {typeof update.body === "string" &&
                    update.body.trim() && (
                      <Typography
                        sx={{
                          mt: 0.75,
                          fontSize: 12.5,
                          lineHeight: 1.85,
                          color: "text.secondary",
                          overflowWrap: "anywhere",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {update.body}
                      </Typography>
                    )}

                  {typeof update.authorName === "string" &&
                    update.authorName.trim() && (
                      <Typography
                        sx={{
                          mt: 1,
                          fontSize: 11,
                          fontWeight: 500,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {update.authorName}

                        {typeof update.authorRole ===
                          "string" &&
                        update.authorRole.trim()
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
                        {typeof update.attachment.name ===
                          "string" &&
                        update.attachment.name.trim()
                          ? update.attachment.name
                          : "Shared document"}
                      </Typography>

                      {url ? (
                        <Button
                          component="a"
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${
                            typeof update.attachment.name ===
                              "string" &&
                            update.attachment.name.trim()
                              ? update.attachment.name
                              : "document"
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
            aria-controls={listId}
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
            overflowWrap: "anywhere",
          }}
        >
          {typeof note?.name === "string" &&
          note.name.trim()
            ? note.name
            : "Shared note"}
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