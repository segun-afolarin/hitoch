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
  IconButton,
  SvgIcon,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const fields = [
  {
    name: "fullName",
    label: "Full name",
    autoComplete: "name",
    required: true,
    helperText: "Enter your name as it appears on your identification.",
  },
  {
    name: "preferredName",
    label: "Preferred name",
    autoComplete: "nickname",
    helperText: "Optional. The name you would like us to use.",
  },
  {
    name: "dateOfBirth",
    label: "Date of birth",
    type: "date",
    autoComplete: "bday",
    helperText: "You can complete this later.",
  },
  {
    name: "nationality",
    label: "Nationality",
    autoComplete: "off",
    helperText: "For example, Nigerian.",
  },
];

function getToday() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(`${value}T12:00:00`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
}

export default function StudentPersonalDetailsDialog({
  details,
  onSave,
  onClose,
  preview = false,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const id = useId();
  const submitting = useRef(false);

  const [values, setValues] = useState(() => ({
    fullName: details?.fullName ?? "",
    preferredName: details?.preferredName ?? "",
    dateOfBirth: details?.dateOfBirth ?? "",
    nationality: details?.nationality ?? "",
  }));

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSaveError("");
  }

  function handleClose() {
    if (!submitting.current) onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting.current) return;

    const form = event.currentTarget;
    const cleaned = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()])
    );

    const nextErrors = {};

    if (!cleaned.fullName) {
      nextErrors.fullName = "Enter your full name.";
    }

    if (cleaned.dateOfBirth) {
      if (!isValidDate(cleaned.dateOfBirth)) {
        nextErrors.dateOfBirth = "Enter a valid date of birth.";
      } else if (cleaned.dateOfBirth > getToday()) {
        nextErrors.dateOfBirth = "Date of birth cannot be in the future.";
      }
    }

    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors)[0];

    if (firstError) {
      form.elements.namedItem(firstError)?.focus();
      return;
    }

    submitting.current = true;
    setSaving(true);
    setSaveError("");

    try {
      await onSave(cleaned);
    } catch {
      setSaveError(
        "We couldn't save your changes. Your entries are still here. Please try again."
      );
      submitting.current = false;
      setSaving(false);
      return;
    }

    submitting.current = false;
    onClose();
  }

  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      onClose={handleClose}
      disableEscapeKeyDown={saving}
      transitionDuration={reduceMotion ? 0 : undefined}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      slotProps={{
        paper: {
          sx: {
            borderRadius: fullScreen ? 0 : 2,
            backgroundImage: "none",
            bgcolor: "#FFFFFF",
          },
        },
      }}
    >
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        aria-busy={saving}
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          height: fullScreen ? "100%" : "auto",
        }}
      >
        <Box sx={{ position: "relative", flexShrink: 0 }}>
          <DialogTitle
            id={`${id}-title`}
            sx={{
              pt: 3,
              pb: 1,
              pl: 3,
              pr: 8,
              fontSize: 21,
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            Edit personal details
          </DialogTitle>

          <IconButton
            aria-label="Close personal details editor"
            onClick={handleClose}
            disabled={saving}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 44,
              height: 44,
              color: "text.secondary",
            }}
          >
            <SvgIcon>
              <path
                d="m6 6 12 12M18 6 6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </SvgIcon>
          </IconButton>

          <Typography
            id={`${id}-description`}
            sx={{
              px: 3,
              pb: 3,
              color: "text.secondary",
              fontSize: 13.5,
              lineHeight: 1.7,
            }}
          >
            Keep your information consistent with your identification
            documents. Optional details can be added later.
          </Typography>
        </Box>

        <DialogContent
          dividers
          sx={{
            p: 3,
            borderColor: "#E8EDF1",
            flex: fullScreen ? 1 : undefined,
          }}
        >
          {saveError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {saveError}
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            {fields.map((field, index) => (
              <TextField
                key={field.name}
                id={`${id}-${field.name}`}
                name={field.name}
                label={field.label}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                autoFocus={index === 0}
                required={field.required}
                fullWidth
                disabled={saving}
                value={values[field.name]}
                onChange={handleChange}
                error={Boolean(errors[field.name])}
                helperText={errors[field.name] || field.helperText}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput:
                    field.type === "date"
                      ? { max: getToday() }
                      : undefined,
                }}
                sx={{
                  gridColumn: field.name === "fullName" ? "1 / -1" : "auto",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    fontSize: 14,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#DCE3E9",
                  },
                  "& .MuiFormHelperText-root": {
                    mx: 0,
                    mt: 1,
                    lineHeight: 1.5,
                  },
                }}
              />
            ))}
          </Box>

          {preview && (
            <Typography
              sx={{
                mt: 3,
                color: "text.secondary",
                fontSize: 12,
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
            gap: 1,
            flexShrink: 0,
            "& > :not(style) ~ :not(style)": { ml: 0 },
          }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            disabled={saving}
            sx={{
              minHeight: 44,
              color: "text.primary",
              borderColor: "#DCE3E9",
              "&:hover": {
                borderColor: "#BFCAD3",
                bgcolor: "#F8FAFB",
              },
            }}
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
            sx={{
              minHeight: 44,
              minWidth: 150,
              bgcolor: "primary.main",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "primary.dark" },
            }}
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