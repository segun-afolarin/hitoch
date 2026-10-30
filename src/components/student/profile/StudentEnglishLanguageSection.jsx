import { useId, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Skeleton,
  Snackbar,
  SvgIcon,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import StudentEnglishTestDialog from "./StudentEnglishTestDialog";

const statusLabels = {
  completed: "Results available",
  awaiting_results: "Awaiting results",
  booked: "Test booked",
};

const scoreFields = [
  { name: "overall", label: "Overall" },
  { name: "listening", label: "Listening" },
  { name: "reading", label: "Reading" },
  { name: "speaking", label: "Speaking" },
  { name: "writing", label: "Writing" },
];

function AddIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function formatDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "Not provided";
  }

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) return "Not provided";

  const [year, month, day] = value.split("-").map(Number);

  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function testName(record) {
  return record.testType === "Other"
    ? record.otherTestName || "Other English test"
    : record.testType || "English test";
}

export default function StudentEnglishLanguageSection({
  data = null,
  onSave,
  loading = false,
  error = false,
  onRetry,
}) {
  const id = useId();
  const busyRef = useRef(false);

  const [localData, setLocalData] = useState(null);
  const [editor, setEditor] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  const preview = typeof onSave !== "function";
  const available = localData !== null || data !== null || preview;
  const current = localData ?? data ?? { notTaken: false, tests: [] };
  const tests = Array.isArray(current.tests) ? current.tests : [];

  const canEdit = available && !loading && !error && !busy;

  async function persist(nextData, message) {
    if (busyRef.current) throw new Error("A save is already in progress.");

    busyRef.current = true;
    setBusy(true);
    setActionError("");

    try {
      /*
       * onSave receives:
       * { notTaken: boolean, tests: [...] }
       *
       * Return the canonical saved object, or resolve without a value.
       * Reject on failure. Archive omitted test records on the backend.
       */
      const response = preview ? nextData : await onSave(nextData);
      const saved = response ?? nextData;

      if (
        typeof saved.notTaken !== "boolean" ||
        !Array.isArray(saved.tests)
      ) {
        throw new Error("Invalid saved English language record.");
      }

      setLocalData(saved);
      setNotice(preview ? `${message} for this preview.` : `${message}.`);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  async function saveTest(record) {
    const exists = tests.some(
      (item) => String(item.id) === String(record.id)
    );

    await persist(
      {
        notTaken: false,
        tests: exists
          ? tests.map((item) =>
              String(item.id) === String(record.id) ? record : item
            )
          : [...tests, record],
      },
      "English test updated"
    );
  }

  async function removeTest(recordId) {
    await persist(
      {
        notTaken: false,
        tests: tests.filter(
          (item) => String(item.id) !== String(recordId)
        ),
      },
      "English test removed"
    );
  }

  async function markNotTaken() {
    if (busyRef.current) return;

    try {
      await persist(
        { notTaken: true, tests: [] },
        "English language information updated"
      );
    } catch {
      setActionError(
        "We couldn't save your answer. Please try again."
      );
    }
  }

  return (
    <>
      <Paper
        component="section"
        aria-labelledby={`${id}-heading`}
        aria-busy={loading || busy}
        elevation={0}
        sx={{
          minWidth: 0,
          overflow: "hidden",
          bgcolor: "#FFFFFF",
          border: "1px solid #E2E8ED",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            px: { xs: 2.5, sm: 4 },
            py: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                id={`${id}-heading`}
                component="h2"
                sx={{ fontSize: 18, fontWeight: 700 }}
              >
                English language
              </Typography>

              {tests.length > 0 && !loading && !error && (
                <Typography
                  sx={{ fontSize: 12, color: "text.secondary" }}
                >
                  {tests.length} {tests.length === 1 ? "test" : "tests"}
                </Typography>
              )}
            </Box>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 13,
                color: "text.secondary",
                lineHeight: 1.7,
              }}
            >
              Your English test bookings, results and individual scores.
            </Typography>
          </Box>

          <Button
            variant="contained"
            disableElevation
            disabled={!canEdit}
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={() => {
              setActionError("");
              setEditor({ record: null });
            }}
            sx={{
              minHeight: 44,
              px: 2,
              flexShrink: 0,
              fontSize: 12.5,
              color: "#FFFFFF",
            }}
          >
            Add test
          </Button>
        </Box>

        {actionError && (
          <Alert
            severity="error"
            sx={{ mx: { xs: 2.5, sm: 4 }, mb: 2 }}
          >
            {actionError}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ px: { xs: 2.5, sm: 4 }, pb: 3 }}>
            <Skeleton animation={false} width="40%" height={28} />
            <Skeleton animation={false} width="65%" />
            <Skeleton animation={false} width="85%" height={60} />
          </Box>
        ) : error || !available ? (
          <Box sx={{ px: { xs: 2.5, sm: 4 }, pb: 3 }}>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              {error
                ? "We couldn't load your English language information."
                : "English language information is not available yet."}
            </Typography>

            {error && typeof onRetry === "function" && (
              <Button onClick={onRetry} sx={{ mt: 1, minHeight: 44 }}>
                Try again
              </Button>
            )}
          </Box>
        ) : tests.length === 0 ? (
          <Box
            sx={{
              mx: { xs: 2.5, sm: 4 },
              pt: 2.5,
              pb: 3,
              borderTop: "1px solid #EDF1F4",
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              {current.notTaken
                ? "No English test booked or taken"
                : "Add your English test information"}
            </Typography>

            <Typography
              sx={{
                mt: 0.75,
                maxWidth: 550,
                fontSize: 13,
                color: "text.secondary",
                lineHeight: 1.8,
              }}
            >
              {current.notTaken
                ? "You can add a booking or test result here when it becomes available."
                : "Add a completed test or an upcoming booking. If you have not booked or taken a test, record that below."}
            </Typography>

            {!current.notTaken && (
              <Button
                variant="outlined"
                disabled={!canEdit}
                onClick={markNotTaken}
                startIcon={
                  busy ? <CircularProgress size={16} color="inherit" /> : null
                }
                sx={{
                  mt: 2,
                  minHeight: 44,
                  px: 2,
                  fontSize: 12.5,
                  color: "text.primary",
                  borderColor: "#DCE3E9",
                  "&:hover": {
                    bgcolor: "#F8FAFB",
                    borderColor: "#BFCAD3",
                  },
                }}
              >
                No test booked or taken
              </Button>
            )}
          </Box>
        ) : (
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
            {tests.map((record) => (
              <Box
                component="li"
                key={record.id}
                sx={{
                  px: { xs: 2.5, sm: 4 },
                  py: 3,
                  borderTop: "1px solid #EDF1F4",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      component="h3"
                      sx={{
                        fontSize: 15,
                        fontWeight: 600,
                        lineHeight: 1.6,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {testName(record)}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: 12,
                        color: "text.secondary",
                      }}
                    >
                      {record.status === "booked" ? "Scheduled date" : "Test date"}
                      {" · "}
                      {formatDate(record.testDate)}
                    </Typography>

                    <Typography
                      component="span"
                      sx={{
                        display: "inline-block",
                        mt: 1.25,
                        px: 1,
                        py: 0.35,
                        borderRadius: 1,
                        fontSize: 11,
                        fontWeight: 600,
                        color: "text.primary",
                        bgcolor: (theme) =>
                          alpha(
                            record.status === "completed"
                              ? theme.palette.primary.main
                              : theme.palette.secondary.main,
                            0.09
                          ),
                      }}
                    >
                      {statusLabels[record.status] || "Status not provided"}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    disabled={!canEdit}
                    aria-label={`Edit ${testName(record)}`}
                    onClick={() => setEditor({ record })}
                    sx={{
                      minHeight: 40,
                      minWidth: 62,
                      px: 1.5,
                      flexShrink: 0,
                      fontSize: 12,
                      color: "text.primary",
                      borderColor: "#DCE3E9",
                    }}
                  >
                    Edit
                  </Button>
                </Box>

                {record.status === "completed" ? (
                  <Box
                    component="dl"
                    sx={{
                      m: 0,
                      mt: 2.5,
                      pt: 2,
                      borderTop: "1px solid #F0F3F5",
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(2, minmax(0, 1fr))",
                        sm: "repeat(5, minmax(0, 1fr))",
                      },
                      gap: 2,
                    }}
                  >
                    {scoreFields.map((field) => {
                      const score = record.scores?.[field.name];
                      const hasScore =
                        score !== undefined &&
                        score !== null &&
                        String(score).trim() !== "";

                      return (
                        <Box
                          key={field.name}
                          sx={{
                            minWidth: 0,
                            gridColumn:
                              field.name === "overall"
                                ? { xs: "1 / -1", sm: "auto" }
                                : "auto",
                          }}
                        >
                          <Typography
                            component="dt"
                            sx={{
                              mb: 0.75,
                              fontSize: 11.5,
                              color: "text.secondary",
                            }}
                          >
                            {field.label}
                          </Typography>

                          <Typography
                            component="dd"
                            sx={{
                              m: 0,
                              fontSize:
                                hasScore && field.name === "overall" ? 24 : 14,
                              fontWeight: hasScore ? 600 : 400,
                              lineHeight: 1.4,
                              color: hasScore
                                ? "text.primary"
                                : "text.secondary",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {hasScore ? score : "Not added"}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      mt: 2,
                      fontSize: 13,
                      lineHeight: 1.7,
                      color: "text.secondary",
                    }}
                  >
                    {record.status === "booked"
                      ? "Update this record after taking your test."
                      : record.status === "awaiting_results"
                        ? "Add your scores when your report becomes available."
                        : "Edit this record to add its current status."}
                  </Typography>
                )}

                {record.notes && (
                  <Typography
                    sx={{
                      mt: 2,
                      fontSize: 12.5,
                      lineHeight: 1.8,
                      color: "text.secondary",
                      whiteSpace: "pre-line",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {record.notes}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {available && !loading && !error && (
          <Box
            sx={{
              px: { xs: 2.5, sm: 4 },
              py: 2,
              borderTop: "1px solid #EDF1F4",
            }}
          >
            <Typography
              sx={{
                fontSize: 11.5,
                lineHeight: 1.7,
                color: "text.secondary",
              }}
            >
              Score reports are managed in Documents.
              {preview && " Preview changes reset when you leave or refresh."}
            </Typography>
          </Box>
        )}
      </Paper>

      {editor && (
        <StudentEnglishTestDialog
          record={editor.record}
          onSave={saveTest}
          onRemove={removeTest}
          onClose={() => setEditor(null)}
          preview={preview}
        />
      )}

      <Snackbar
        open={Boolean(notice)}
        message={notice}
        autoHideDuration={4500}
        onClose={(event, reason) => {
          if (reason !== "clickaway") setNotice("");
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}