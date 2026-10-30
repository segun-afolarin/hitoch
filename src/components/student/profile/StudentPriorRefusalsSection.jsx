import { useId, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Skeleton,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

function dateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T12:00:00`);

  return !Number.isNaN(date.getTime()) && dateKey(date) === value;
}

function displayDate(value) {
  if (!validDate(value)) return "Date not provided";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function createRecord(record = {}) {
  return {
    id: record?.id ?? crypto.randomUUID(),
    country: record?.country ?? "",
    visaType: record?.visaType ?? "",
    decisionDate: record?.decisionDate ?? "",
    grounds: Array.isArray(record?.grounds) ? record.grounds : [],
    groundsText: record?.groundsText ?? "",
    groundsUnknown: Boolean(record?.groundsUnknown),
  };
}

function RefusalEditor({
  data,
  groundOptions,
  onSave,
  onClose,
  preview,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const id = useId();
  const busyRef = useRef(false);

  const [answer, setAnswer] = useState(data?.answer ?? "");
  const [records, setRecords] = useState(() =>
    (Array.isArray(data?.records) ? data.records : []).map(createRecord)
  );
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  function closeEditor() {
    if (!busyRef.current) onClose();
  }

  function updateRecord(recordId, updates) {
    setRecords((current) =>
      current.map((record) =>
        record.id === recordId ? { ...record, ...updates } : record
      )
    );

    setErrors({});
    setSaveError("");
  }

  function changeAnswer(event) {
    const next = event.target.value;
    setAnswer(next);
    setErrors({});
    setSaveError("");

    if (next === "yes") {
      setRecords((current) => (current.length ? current : [createRecord()]));
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (busyRef.current) return;

    const cleaned = records.map((record) => ({
      ...record,
      country: record.country.trim(),
      visaType: record.visaType.trim(),
      decisionDate: record.decisionDate.trim(),
      grounds: record.groundsUnknown ? [] : record.grounds,
      groundsText: record.groundsUnknown ? "" : record.groundsText.trim(),
    }));

    const nextErrors = {};

    if (!["yes", "no"].includes(answer)) {
      nextErrors.answer = "Choose Yes or No.";
    }

    if (answer === "yes") {
      if (!cleaned.length) {
        nextErrors.records = "Add at least one refusal record.";
      }

      cleaned.forEach((record) => {
        if (!record.country) {
          nextErrors[`${record.id}-country`] = "Enter the country.";
        }

        if (
          record.decisionDate &&
          (!validDate(record.decisionDate) ||
            record.decisionDate > dateKey(new Date()))
        ) {
          nextErrors[`${record.id}-decisionDate`] =
            "Enter a valid decision date that is not in the future.";
        }

        if (
          !record.groundsUnknown &&
          !record.grounds.length &&
          !record.groundsText
        ) {
          nextErrors[`${record.id}-grounds`] =
            "Add the grounds from your letter, or indicate that you do not know.";
        }
      });
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setSaveError("Please review the highlighted information.");
      return;
    }

    busyRef.current = true;
    setSaving(true);
    setSaveError("");

    try {
      await onSave({
        answer,
        records: answer === "yes" ? cleaned : [],
      });
    } catch {
      setSaveError(
        "We couldn't save this information. Your entries are still here."
      );
      busyRef.current = false;
      setSaving(false);
      return;
    }

    busyRef.current = false;
    onClose();
  }

  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      onClose={closeEditor}
      disableEscapeKeyDown={saving}
      transitionDuration={reducedMotion ? 0 : undefined}
      aria-labelledby={`${id}-title`}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "#FFFFFF",
            backgroundImage: "none",
            borderRadius: fullScreen ? 0 : 2,
          },
        },
      }}
    >
      <Box
        component="form"
        noValidate
        onSubmit={submit}
        aria-busy={saving}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: fullScreen ? "100%" : "auto",
          minHeight: 0,
        }}
      >
        <DialogTitle
          id={`${id}-title`}
          sx={{ px: 3, pt: 3, pb: 1, fontSize: 21, fontWeight: 700 }}
        >
          Prior refusals
        </DialogTitle>

        <Typography
          sx={{
            px: 3,
            pb: 3,
            fontSize: 13,
            color: "text.secondary",
            lineHeight: 1.7,
          }}
        >
          Tell us about previous visa refusals. Use the information in your
          decision letter where available.
        </Typography>

        <DialogContent
          dividers
          sx={{
            p: 3,
            borderColor: "#E8EDF1",
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
              fontSize: 14,
            },
            "& .MuiFormHelperText-root": {
              mx: 0,
              lineHeight: 1.6,
            },
          }}
        >
          {saveError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {saveError}
            </Alert>
          )}

          <FormControl
            component="fieldset"
            error={Boolean(errors.answer)}
            disabled={saving}
          >
            <FormLabel
              component="legend"
              sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}
            >
              Have you ever had a visa application refused?
            </FormLabel>

            <RadioGroup
              row
              name={`${id}-answer`}
              value={answer}
              onChange={changeAnswer}
              sx={{ mt: 0.5, gap: 2 }}
            >
              <FormControlLabel
                value="yes"
                control={<Radio size="small" />}
                label="Yes"
              />
              <FormControlLabel
                value="no"
                control={<Radio size="small" />}
                label="No"
              />
            </RadioGroup>

            {errors.answer && (
              <Typography sx={{ fontSize: 12, color: "error.main" }}>
                {errors.answer}
              </Typography>
            )}
          </FormControl>

          {answer === "no" && records.some((record) => record.country) && (
            <Typography
              sx={{
                mt: 2,
                pl: 1.5,
                borderLeft: "3px solid",
                borderColor: "secondary.main",
                color: "text.secondary",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              Saving “No” will remove the listed refusals from this profile.
              Cancel to keep your previous information.
            </Typography>
          )}

          {answer === "yes" && (
            <Box sx={{ mt: 3 }}>
              {records.map((record, index) => {
                const options = [
                  ...new Set([
                    ...groundOptions.filter(
                      (option) => typeof option === "string" && option.trim()
                    ),
                    ...record.grounds,
                  ]),
                ];

                return (
                  <Box
                    key={record.id}
                    sx={{
                      pt: 2.5,
                      pb: 3,
                      borderTop: "1px solid #E8EDF1",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Typography
                        component="h3"
                        sx={{ fontSize: 15, fontWeight: 700 }}
                      >
                        Refusal {index + 1}
                      </Typography>

                      <Button
                        type="button"
                        disabled={saving}
                        aria-label={`Remove refusal ${index + 1} from this draft`}
                        onClick={() => {
                          setRecords((current) =>
                            current.filter((item) => item.id !== record.id)
                          );
                          setErrors({});
                          setSaveError("");
                        }}
                        sx={{
                          color: "text.secondary",
                          fontSize: 12,
                          minHeight: 40,
                        }}
                      >
                        Remove
                      </Button>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "minmax(0, 1fr)",
                          sm: "repeat(2, minmax(0, 1fr))",
                        },
                        gap: 2.5,
                      }}
                    >
                      <TextField
                        label="Country"
                        required
                        fullWidth
                        disabled={saving}
                        value={record.country}
                        onChange={(event) =>
                          updateRecord(record.id, {
                            country: event.target.value,
                          })
                        }
                        error={Boolean(errors[`${record.id}-country`])}
                        helperText={errors[`${record.id}-country`]}
                      />

                      <TextField
                        label="Visa type"
                        fullWidth
                        disabled={saving}
                        value={record.visaType}
                        onChange={(event) =>
                          updateRecord(record.id, {
                            visaType: event.target.value,
                          })
                        }
                        helperText="If known."
                      />

                      <TextField
                        label="Decision date"
                        type="date"
                        fullWidth
                        disabled={saving}
                        value={record.decisionDate}
                        onChange={(event) =>
                          updateRecord(record.id, {
                            decisionDate: event.target.value,
                          })
                        }
                        error={Boolean(errors[`${record.id}-decisionDate`])}
                        helperText={
                          errors[`${record.id}-decisionDate`] ||
                          "If you know the decision date."
                        }
                        slotProps={{
                          inputLabel: { shrink: true },
                          htmlInput: { max: dateKey(new Date()) },
                        }}
                      />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <FormControl
                        component="fieldset"
                        fullWidth
                        error={Boolean(errors[`${record.id}-grounds`])}
                      >
                        <FormLabel
                          component="legend"
                          sx={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                        >
                          Refusal grounds
                        </FormLabel>

                        {options.length > 0 && (
                          <FormGroup sx={{ mt: 1 }}>
                            {options.map((option) => (
                              <FormControlLabel
                                key={option}
                                label={option}
                                sx={{
                                  "& .MuiFormControlLabel-label": {
                                    fontSize: 13,
                                    lineHeight: 1.6,
                                  },
                                }}
                                control={
                                  <Checkbox
                                    size="small"
                                    disabled={saving || record.groundsUnknown}
                                    checked={
                                      !record.groundsUnknown &&
                                      record.grounds.includes(option)
                                    }
                                    onChange={(event) =>
                                      updateRecord(record.id, {
                                        grounds: event.target.checked
                                          ? [...record.grounds, option]
                                          : record.grounds.filter(
                                              (ground) => ground !== option
                                            ),
                                      })
                                    }
                                  />
                                }
                              />
                            ))}
                          </FormGroup>
                        )}

                        <TextField
                          fullWidth
                          multiline
                          minRows={3}
                          label="Grounds stated in your letter"
                          disabled={saving || record.groundsUnknown}
                          value={record.groundsText}
                          onChange={(event) =>
                            updateRecord(record.id, {
                              groundsText: event.target.value,
                            })
                          }
                          error={Boolean(errors[`${record.id}-grounds`])}
                          helperText={
                            errors[`${record.id}-grounds`] ||
                            "Use the wording from your refusal letter."
                          }
                          sx={{ mt: 2 }}
                        />

                        <FormControlLabel
                          sx={{
                            mt: 0.5,
                            "& .MuiFormControlLabel-label": { fontSize: 13 },
                          }}
                          label="I do not know the refusal grounds"
                          control={
                            <Checkbox
                              size="small"
                              disabled={saving}
                              checked={record.groundsUnknown}
                              onChange={(event) =>
                                updateRecord(record.id, {
                                  groundsUnknown: event.target.checked,
                                })
                              }
                            />
                          }
                        />
                      </FormControl>
                    </Box>
                  </Box>
                );
              })}

              {errors.records && (
                <Typography
                  role="alert"
                  sx={{ mb: 1.5, fontSize: 13, color: "error.main" }}
                >
                  {errors.records}
                </Typography>
              )}

              <Button
                type="button"
                variant="outlined"
                disabled={saving}
                onClick={() => {
                  setRecords((current) => [...current, createRecord()]);
                  setErrors({});
                  setSaveError("");
                }}
                sx={{
                  minHeight: 44,
                  color: "text.primary",
                  borderColor: "#DCE3E9",
                }}
              >
                Add another refusal
              </Button>
            </Box>
          )}

          {preview && (
            <Typography
              sx={{ mt: 3, fontSize: 12, color: "text.secondary" }}
            >
              Preview changes reset when you leave this page or refresh.
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            type="button"
            disabled={saving}
            onClick={closeEditor}
            sx={{ minHeight: 44, color: "text.primary" }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disableElevation
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={16} color="inherit" /> : null
            }
            sx={{ minHeight: 44, color: "#FFFFFF" }}
          >
            {saving
              ? "Saving…"
              : preview
                ? "Apply to preview"
                : "Save changes"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default function StudentPriorRefusalsSection({
  data = null,
  groundOptions = [],
  onSave,
  loading = false,
}) {
  const id = useId();
  const [localData, setLocalData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");

  const preview = typeof onSave !== "function";
  const available = localData !== null || data !== null || preview;
  const current = localData ?? data ?? { answer: "", records: [] };
  const records = Array.isArray(current.records) ? current.records : [];

  async function saveInformation(values) {
    /*
     * A connected backend should archive removed records,
     * following the architecture's no-hard-deletes rule.
     */
    const saved = preview ? values : await onSave(values);

    setLocalData(saved ?? values);
    setNotice(
      preview
        ? "Refusal information updated for this preview."
        : "Refusal information saved."
    );
  }

  return (
    <>
      <Paper
        component="section"
        aria-labelledby={`${id}-heading`}
        aria-busy={loading}
        elevation={0}
        sx={{
          bgcolor: "#FFFFFF",
          border: "1px solid #E2E8ED",
          borderRadius: 2,
          minWidth: 0,
          overflow: "hidden",
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
            <Typography
              id={`${id}-heading`}
              component="h2"
              sx={{ fontSize: 18, fontWeight: 700 }}
            >
              Prior refusals
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 13,
                color: "text.secondary",
                lineHeight: 1.7,
              }}
            >
              Previous visa decisions relevant to your application history.
            </Typography>
          </Box>

          <Button
            variant="contained"
            disableElevation
            disabled={loading || !available}
            onClick={() => setEditing(true)}
            sx={{
              minHeight: 44,
              px: 2,
              fontSize: 12.5,
              flexShrink: 0,
              color: "#FFFFFF",
            }}
          >
            {current.answer ? "Edit information" : "Add information"}
          </Button>
        </Box>

        <Box sx={{ px: { xs: 2.5, sm: 4 }, pb: 3 }}>
          <Box sx={{ pt: 2.5, borderTop: "1px solid #EDF1F4" }}>
            {loading ? (
              <>
                <Skeleton animation={false} width="60%" />
                <Skeleton animation={false} width="40%" />
              </>
            ) : !available ? (
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                Refusal information is not available yet.
              </Typography>
            ) : current.answer === "no" ? (
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                No previous visa refusals declared.
              </Typography>
            ) : current.answer === "yes" ? (
              <>
                <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>
                  Previous visa refusals declared
                </Typography>

                {records.length === 0 ? (
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    Add a refusal record to complete this information.
                  </Typography>
                ) : (
                  <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
                    {records.map((record) => (
                      <Box
                        component="li"
                        key={record.id}
                        sx={{
                          py: 2,
                          "& + &": { borderTop: "1px solid #EDF1F4" },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            gap: 1,
                          }}
                        >
                          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                            {record.country}
                            {record.visaType ? ` · ${record.visaType}` : ""}
                          </Typography>

                          <Typography
                            sx={{ fontSize: 12, color: "text.secondary" }}
                          >
                            {displayDate(record.decisionDate)}
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: 13,
                            lineHeight: 1.8,
                            color: "text.secondary",
                            whiteSpace: "pre-line",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {record.groundsUnknown
                            ? "Refusal grounds not known."
                            : [
                                ...(Array.isArray(record.grounds)
                                  ? record.grounds
                                  : []),
                                record.groundsText,
                              ]
                                .filter(Boolean)
                                .join("\n") || "Grounds not provided."}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            ) : (
              <>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  Have you ever had a visa application refused?
                </Typography>

                <Typography
                  sx={{
                    mt: 0.75,
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: "text.secondary",
                  }}
                >
                  Add your answer and any previous refusal details so your
                  consultant can review your application history.
                </Typography>
              </>
            )}
          </Box>

          <Typography
            sx={{
              mt: 2.5,
              fontSize: 11.5,
              lineHeight: 1.7,
              color: "text.secondary",
            }}
          >
            Refusal letters are managed in Documents.
            {preview && " Preview changes reset when you leave or refresh."}
          </Typography>
        </Box>
      </Paper>

      {editing && (
        <RefusalEditor
          data={current}
          groundOptions={Array.isArray(groundOptions) ? groundOptions : []}
          onSave={saveInformation}
          onClose={() => setEditing(false)}
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