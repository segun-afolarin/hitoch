import { useId, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

const testTypes = [
  "IELTS Academic",
  "IELTS General Training",
  "TOEFL iBT",
  "PTE Academic",
  "Duolingo English Test",
  "Cambridge English",
  "Other",
];

const statuses = [
  {
    value: "completed",
    label: "Results available",
    description: "Record the scores from your report.",
  },
  {
    value: "awaiting_results",
    label: "Awaiting results",
    description: "You have taken the test.",
  },
  {
    value: "booked",
    label: "Test booked",
    description: "Record your scheduled test date.",
  },
];

const scoreFields = [
  { name: "overall", label: "Overall" },
  { name: "listening", label: "Listening" },
  { name: "reading", label: "Reading" },
  { name: "speaking", label: "Speaking" },
  { name: "writing", label: "Writing" },
];

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

export default function StudentEnglishTestDialog({
  record = null,
  onSave,
  onRemove,
  onClose,
  preview = false,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const id = useId();
  const busyRef = useRef(false);

  const [recordId] = useState(() => record?.id ?? crypto.randomUUID());

  const [values, setValues] = useState(() => ({
    testType: record?.testType ?? "",
    otherTestName: record?.otherTestName ?? "",
    status: record?.status ?? "",
    testDate: record?.testDate ?? "",
    notes: record?.notes ?? "",
    scores: Object.fromEntries(
      scoreFields.map(({ name }) => [
        name,
        String(record?.scores?.[name] ?? ""),
      ])
    ),
  }));

  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const options =
    values.testType && !testTypes.includes(values.testType)
      ? [...testTypes, values.testType]
      : testTypes;

  function closeEditor() {
    if (!busyRef.current) onClose();
  }

  function changeField(event) {
    const { name, value } = event.target;

    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSaveError("");
  }

  function changeScore(name, value) {
    setValues((current) => ({
      ...current,
      scores: { ...current.scores, [name]: value },
    }));

    setErrors((current) => ({
      ...current,
      [`score-${name}`]: undefined,
    }));

    setSaveError("");
  }

  async function submit(event) {
    event.preventDefault();
    if (busyRef.current) return;

    const cleaned = {
      id: recordId,
      testType: values.testType.trim(),
      otherTestName:
        values.testType === "Other" ? values.otherTestName.trim() : "",
      status: values.status,
      testDate: values.testDate.trim(),
      notes: values.notes.trim(),
      scores:
        values.status === "completed"
          ? Object.fromEntries(
              Object.entries(values.scores).map(([name, value]) => [
                name,
                value.trim(),
              ])
            )
          : {},
    };

    if (!removing) {
      const nextErrors = {};

      if (!statuses.some((status) => status.value === cleaned.status)) {
        nextErrors.status = "Choose your test status.";
      }

      if (!cleaned.testType) {
        nextErrors.testType = "Choose the test you booked or took.";
      }

      if (cleaned.testType === "Other" && !cleaned.otherTestName) {
        nextErrors.otherTestName = "Enter the test name.";
      }

      if (cleaned.testDate) {
        if (!validDate(cleaned.testDate)) {
          nextErrors.testDate = "Enter a valid test date.";
        } else if (
          cleaned.status !== "booked" &&
          cleaned.testDate > dateKey(new Date())
        ) {
          nextErrors.testDate = "A completed test cannot have a future date.";
        }
      }

      if (cleaned.status === "completed" && cleaned.testType !== "Other") {
        Object.entries(cleaned.scores).forEach(([name, value]) => {
          if (
            value &&
            (!/^\d+(?:\.\d+)?$/.test(value) ||
              !Number.isFinite(Number(value)))
          ) {
            nextErrors[`score-${name}`] =
              "Enter the numeric score shown on your report.";
          }
        });
      }

      setErrors(nextErrors);

      const firstError = Object.keys(nextErrors)[0];

      if (firstError) {
        document.getElementById(`${id}-${firstError}`)?.focus();
        return;
      }
    }

    busyRef.current = true;
    setSaving(true);
    setSaveError("");

    try {
      if (removing) {
        await onRemove(record.id);
      } else {
        await onSave(cleaned);
      }
    } catch {
      setSaveError(
        removing
          ? "We couldn't remove this test. Please try again."
          : "We couldn't save this test. Your entries are still here."
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
      aria-describedby={`${id}-description`}
      slotProps={{
        paper: {
          sx: {
            borderRadius: fullScreen ? 0 : 2,
            bgcolor: "#FFFFFF",
            backgroundImage: "none",
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
          minHeight: 0,
          height: fullScreen ? "100%" : "auto",
        }}
      >
        <DialogTitle
          id={`${id}-title`}
          sx={{ px: 3, pt: 3, pb: 1, fontSize: 21, fontWeight: 700 }}
        >
          {removing
            ? "Remove English test?"
            : record
              ? "Edit English test"
              : "Add English test"}
        </DialogTitle>

        <Typography
          id={`${id}-description`}
          sx={{
            px: 3,
            pb: 3,
            color: "text.secondary",
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          {removing
            ? "This test will no longer appear in your English language records."
            : "Record one test at a time. Use the details from your booking or score report."}
        </Typography>

        <DialogContent
          dividers
          sx={{
            p: 3,
            borderColor: "#E8EDF1",
            "& .MuiOutlinedInput-root": {
              fontSize: 14,
              borderRadius: 1.5,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#DCE3E9",
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

          {removing ? (
            <Box
              sx={{
                p: 2,
                border: "1px solid #E2E8ED",
                borderLeft: "3px solid",
                borderLeftColor: "secondary.main",
                borderRadius: 1,
              }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                {record.testType === "Other"
                  ? record.otherTestName
                  : record.testType}
              </Typography>

              <Typography
                sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}
              >
                {record.testDate || "Test date not provided"}
              </Typography>
            </Box>
          ) : (
            <>
              <FormControl
                component="fieldset"
                fullWidth
                disabled={saving}
                error={Boolean(errors.status)}
              >
                <FormLabel
                  id={`${id}-status-label`}
                  component="legend"
                  sx={{ fontSize: 13, fontWeight: 600 }}
                >
                  Test status
                </FormLabel>

                <RadioGroup
                  id={`${id}-status`}
                  tabIndex={-1}
                  aria-labelledby={`${id}-status-label`}
                  name="status"
                  value={values.status}
                  onChange={changeField}
                  sx={{ mt: 1, gap: 0.5 }}
                >
                  {statuses.map((status) => (
                    <FormControlLabel
                      key={status.value}
                      value={status.value}
                      control={<Radio size="small" />}
                      sx={{
                        m: 0,
                        p: 0.75,
                        borderRadius: 1.5,
                        bgcolor:
                          values.status === status.value
                            ? alpha(theme.palette.primary.main, 0.06)
                            : "transparent",
                      }}
                      label={
                        <Box sx={{ py: 0.5 }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                            {status.label}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.25,
                              fontSize: 12,
                              color: "text.secondary",
                            }}
                          >
                            {status.description}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>

                {errors.status && (
                  <Typography sx={{ mt: 1, fontSize: 12, color: "error.main" }}>
                    {errors.status}
                  </Typography>
                )}
              </FormControl>

              <Box
                sx={{
                  mt: 3,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 2.5,
                }}
              >
                <TextField
                  id={`${id}-testType`}
                  name="testType"
                  label="Test type"
                  select
                  fullWidth
                  required
                  disabled={saving}
                  value={values.testType}
                  onChange={changeField}
                  error={Boolean(errors.testType)}
                  helperText={errors.testType}
                >
                  {options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  id={`${id}-testDate`}
                  name="testDate"
                  label={
                    values.status === "booked" ? "Scheduled test date" : "Test date"
                  }
                  type="date"
                  fullWidth
                  disabled={saving}
                  value={values.testDate}
                  onChange={changeField}
                  error={Boolean(errors.testDate)}
                  helperText={errors.testDate || "Optional if not available."}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput:
                      values.status === "booked"
                        ? {}
                        : { max: dateKey(new Date()) },
                  }}
                />

                {values.testType === "Other" && (
                  <TextField
                    id={`${id}-otherTestName`}
                    name="otherTestName"
                    label="Test name"
                    required
                    fullWidth
                    disabled={saving}
                    value={values.otherTestName}
                    onChange={changeField}
                    error={Boolean(errors.otherTestName)}
                    helperText={errors.otherTestName}
                    sx={{ gridColumn: "1 / -1" }}
                  />
                )}
              </Box>

              {values.status === "completed" && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    component="h3"
                    sx={{ fontSize: 14, fontWeight: 600 }}
                  >
                    Scores from your report
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      mb: 2,
                      fontSize: 12,
                      color: "text.secondary",
                      lineHeight: 1.7,
                    }}
                  >
                    Enter scores exactly as shown. Leave fields blank if your
                    report does not include them.
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 2,
                    }}
                  >
                    {scoreFields.map((field) => (
                      <TextField
                        key={field.name}
                        id={`${id}-score-${field.name}`}
                        label={field.label}
                        fullWidth
                        disabled={saving}
                        value={values.scores[field.name]}
                        onChange={(event) =>
                          changeScore(field.name, event.target.value)
                        }
                        error={Boolean(errors[`score-${field.name}`])}
                        helperText={errors[`score-${field.name}`]}
                        slotProps={{
                          htmlInput: {
                            inputMode:
                              values.testType === "Other" ? "text" : "decimal",
                          },
                        }}
                        sx={{
                          gridColumn: field.name === "overall" ? "1 / -1" : "auto",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {values.status &&
                values.status !== "completed" &&
                Object.values(values.scores).some((value) => value.trim()) && (
                  <Typography
                    sx={{
                      mt: 2.5,
                      pl: 1.5,
                      borderLeft: "3px solid",
                      borderColor: "secondary.main",
                      fontSize: 12,
                      lineHeight: 1.7,
                      color: "text.secondary",
                    }}
                  >
                    Saving this status will clear the scores from this test
                    record.
                  </Typography>
                )}

              <TextField
                name="notes"
                label="Additional scores or notes"
                multiline
                minRows={2}
                fullWidth
                disabled={saving}
                value={values.notes}
                onChange={changeField}
                helperText="Optional. Include other details shown on your report."
                sx={{ mt: 3 }}
              />
            </>
          )}

          {preview && (
            <Typography
              sx={{ mt: 3, fontSize: 12, color: "text.secondary" }}
            >
              Preview changes reset when you leave this page or refresh.
            </Typography>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
            gap: 1.5,
            "& > :not(style) ~ :not(style)": { ml: 0 },
          }}
        >
          <Box>
            {record && typeof onRemove === "function" && !removing && (
              <Button
                type="button"
                disabled={saving}
                onClick={() => {
                  setRemoving(true);
                  setSaveError("");
                }}
                sx={{ minHeight: 44, px: 1, color: "text.secondary" }}
              >
                Remove test
              </Button>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              type="button"
              disabled={saving}
              onClick={
                removing
                  ? () => {
                      setRemoving(false);
                      setSaveError("");
                    }
                  : closeEditor
              }
              sx={{ minHeight: 44, color: "text.primary" }}
            >
              {removing ? "Keep test" : "Cancel"}
            </Button>

            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={saving}
              startIcon={
                saving ? <CircularProgress size={16} color="inherit" /> : null
              }
              sx={{
                minHeight: 44,
                color: "#FFFFFF",
                whiteSpace: "nowrap",
              }}
            >
              {saving
                ? "Please wait…"
                : removing
                  ? "Remove test"
                  : preview
                    ? "Apply to preview"
                    : "Save test"}
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
}