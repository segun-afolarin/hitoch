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
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const qualificationTypes = [
  { value: "waec", label: "WAEC" },
  { value: "ond", label: "Ordinary National Diploma — OND" },
  { value: "hnd", label: "Higher National Diploma — HND" },
  { value: "degree", label: "Degree" },
  { value: "other", label: "Other qualification" },
];

function createValues(record) {
  return {
    type: record?.type ?? "",
    institution: record?.institution ?? "",
    title: record?.title ?? "",
    course: record?.course ?? "",
    status: record?.status ?? "completed",
    year: String(record?.year ?? ""),
    result: record?.result ?? "",
  };
}

function validate(values) {
  const errors = {};
  const currentYear = new Date().getFullYear();

  if (!qualificationTypes.some((option) => option.value === values.type)) {
    errors.type = "Choose a qualification.";
  }

  if (!values.institution.trim()) {
    errors.institution = "Enter the school or institution.";
  }

  if (values.type === "other" && !values.title.trim()) {
    errors.title = "Enter the qualification name.";
  }

  if (!["completed", "in_progress"].includes(values.status)) {
    errors.status = "Choose your study status.";
  }

  if (values.year && !/^\d{4}$/.test(values.year)) {
    errors.year = "Enter a four-digit year.";
  } else if (
    values.year &&
    values.status === "completed" &&
    Number(values.year) > currentYear
  ) {
    errors.year =
      "A completed qualification cannot have a future completion year.";
  }

  return errors;
}

export default function StudentQualificationDialog({
  record = null,
  onSave,
  onRemove,
  onClose,
  preview = false,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const id = useId();
  const busyRef = useRef(false);

  const [values, setValues] = useState(() => createValues(record));
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmRemoval, setConfirmRemoval] = useState(false);

  const editing = record?.id != null;
  const canRemove = editing && typeof onRemove === "function";

  function handleClose() {
    if (!busyRef.current) onClose();
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    setRequestError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (busyRef.current) return;

    const cleaned = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()])
    );

    if (!confirmRemoval) {
      const nextErrors = validate(cleaned);
      setErrors(nextErrors);

      const firstError = Object.keys(nextErrors)[0];

      if (firstError) {
        document.getElementById(`${id}-${firstError}`)?.focus();
        return;
      }
    }

    busyRef.current = true;
    setBusy(true);
    setRequestError("");

    try {
      if (confirmRemoval) {
        await onRemove(record.id);
      } else {
        await onSave({
          ...cleaned,
          id: record?.id,
          title: cleaned.type === "other" ? cleaned.title : "",
          course: cleaned.type === "waec" ? "" : cleaned.course,
          result: cleaned.status === "completed" ? cleaned.result : "",
        });
      }
    } catch {
      setRequestError(
        confirmRemoval
          ? "We couldn't remove this record. Please try again."
          : "We couldn't save this qualification. Your entries are still here."
      );

      busyRef.current = false;
      setBusy(false);
      return;
    }

    busyRef.current = false;
    onClose();
  }

  function fieldProps(name) {
    return {
      id: `${id}-${name}`,
      name,
      value: values[name],
      onChange: handleChange,
      disabled: busy,
      fullWidth: true,
      error: Boolean(errors[name]),
    };
  }

  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      onClose={handleClose}
      disableEscapeKeyDown={busy}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      transitionDuration={reduceMotion ? 0 : undefined}
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
        onSubmit={handleSubmit}
        aria-busy={busy}
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          height: fullScreen ? "100%" : "auto",
        }}
      >
        <DialogTitle
          id={`${id}-title`}
          sx={{
            px: 3,
            pt: 3,
            pb: 1,
            fontSize: 21,
            fontWeight: 700,
          }}
        >
          {confirmRemoval
            ? "Remove qualification?"
            : editing
              ? "Edit qualification"
              : "Add qualification"}
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
          {confirmRemoval
            ? "This record will no longer appear in your qualifications."
            : "Enter one qualification at a time. You can add further details later."}
        </Typography>

        <DialogContent
          dividers
          sx={{
            p: 3,
            borderColor: "#E8EDF1",
            flex: fullScreen ? 1 : undefined,
          }}
        >
          {requestError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {requestError}
            </Alert>
          )}

          {confirmRemoval ? (
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
                {record.institution}
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 13,
                  color: "text.secondary",
                  overflowWrap: "anywhere",
                }}
              >
                {record.course || record.title || record.type?.toUpperCase()}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  fontSize: 14,
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
              <TextField
                {...fieldProps("type")}
                select
                required
                autoFocus
                label="Qualification"
                helperText={errors.type}
              >
                {qualificationTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                {...fieldProps("status")}
                select
                label="Study status"
                helperText={errors.status}
              >
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="in_progress">In progress</MenuItem>
              </TextField>

              <TextField
                {...fieldProps("institution")}
                required
                label="School / institution"
                helperText={errors.institution}
                sx={{ gridColumn: "1 / -1" }}
              />

              {values.type === "other" && (
                <TextField
                  {...fieldProps("title")}
                  required
                  label="Qualification name"
                  helperText={errors.title}
                  sx={{ gridColumn: "1 / -1" }}
                />
              )}

              {values.type && values.type !== "waec" && (
                <TextField
                  {...fieldProps("course")}
                  label="Course / field of study"
                  helperText="Optional. Use the name on your academic record."
                  sx={{ gridColumn: "1 / -1" }}
                />
              )}

              <TextField
                {...fieldProps("year")}
                label={
                  values.status === "in_progress"
                    ? "Expected completion year"
                    : "Completion year"
                }
                helperText={errors.year || "Optional. Enter a four-digit year."}
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    maxLength: 4,
                  },
                }}
              />

              {values.status === "completed" && (
                <TextField
                  {...fieldProps("result")}
                  label="Result / grade"
                  helperText="Optional. Use the result on your certificate."
                />
              )}
            </Box>
          )}

          {preview && (
            <Typography
              sx={{
                mt: 3,
                fontSize: 12,
                color: "text.secondary",
                lineHeight: 1.6,
              }}
            >
              Preview mode: changes reset when you leave this page or refresh.
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
            {canRemove && !confirmRemoval && (
              <Button
                type="button"
                disabled={busy}
                onClick={() => {
                  setRequestError("");
                  setConfirmRemoval(true);
                }}
                sx={{
                  color: "text.secondary",
                  minHeight: 44,
                  px: 1,
                }}
              >
                Remove record
              </Button>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              type="button"
              disabled={busy}
              onClick={
                confirmRemoval
                  ? () => {
                      setConfirmRemoval(false);
                      setRequestError("");
                    }
                  : handleClose
              }
              sx={{
                color: "text.primary",
                minHeight: 44,
                flex: { xs: 1, sm: "initial" },
              }}
            >
              {confirmRemoval ? "Keep record" : "Cancel"}
            </Button>

            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={busy}
              startIcon={
                busy ? <CircularProgress size={16} color="inherit" /> : null
              }
              sx={{
                minHeight: 44,
                flex: { xs: 1, sm: "initial" },
                whiteSpace: "nowrap",
                bgcolor: "primary.main",
                color: "#FFFFFF",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              {busy
                ? "Please wait…"
                : confirmRemoval
                  ? "Remove record"
                  : preview
                    ? "Apply to preview"
                    : editing
                      ? "Save changes"
                      : "Add qualification"}
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
}