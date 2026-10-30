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
  Paper,
  Skeleton,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const fields = [
  {
    name: "email",
    label: "Contact email",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Phone number",
    type: "tel",
    autoComplete: "tel",
    helper: "Include the country code.",
  },
  {
    name: "country",
    label: "Country of residence",
    autoComplete: "country-name",
    wide: true,
  },
  {
    name: "addressLine1",
    label: "Street address",
    autoComplete: "address-line1",
    wide: true,
  },
  {
    name: "addressLine2",
    label: "Apartment / additional address",
    autoComplete: "address-line2",
    wide: true,
  },
  {
    name: "city",
    label: "City / town",
    autoComplete: "address-level2",
  },
  {
    name: "region",
    label: "State / province / region",
    autoComplete: "address-level1",
  },
  {
    name: "postalCode",
    label: "Postal code",
    autoComplete: "postal-code",
  },
];

function createValues(data) {
  return Object.fromEntries(
    fields.map(({ name }) => [name, String(data?.[name] ?? "")])
  );
}

function ContactEditor({ data, onSave, onClose, preview }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const id = useId();
  const busyRef = useRef(false);

  const [values, setValues] = useState(() => createValues(data));
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  function closeEditor() {
    if (!busyRef.current) onClose();
  }

  function changeField(event) {
    const { name, value } = event.target;

    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSaveError("");
  }

  async function submit(event) {
    event.preventDefault();
    if (busyRef.current) return;

    const cleaned = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()])
    );

    const nextErrors = {};
    const normalizedPhone = cleaned.phone.replace(/[\s()-]/g, "");

    if (
      cleaned.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (
      normalizedPhone &&
      !/^\+[1-9]\d{6,14}$/.test(normalizedPhone)
    ) {
      nextErrors.phone =
        "Include + and the country code, followed by the phone number.";
    }

    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors)[0];

    if (firstError) {
      document.getElementById(`${id}-${firstError}`)?.focus();
      return;
    }

    busyRef.current = true;
    setSaving(true);
    setSaveError("");

    try {
      await onSave({ ...cleaned, phone: normalizedPhone });
    } catch {
      setSaveError(
        "We couldn't save your contact details. Your entries are still here."
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
          Edit contact & address
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
          Add the contact information and residential address used for
          your applications. You can complete missing details later.
        </Typography>

        <DialogContent dividers sx={{ p: 3, borderColor: "#E8EDF1" }}>
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
              gap: 2.5,
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
            {fields.map((field, index) => (
              <TextField
                key={field.name}
                id={`${id}-${field.name}`}
                name={field.name}
                label={field.label}
                type={field.type || "text"}
                autoComplete={field.autoComplete}
                autoFocus={index === 0}
                fullWidth
                disabled={saving}
                value={values[field.name]}
                onChange={changeField}
                error={Boolean(errors[field.name])}
                helperText={errors[field.name] || field.helper}
                sx={{ gridColumn: field.wide ? "1 / -1" : "auto" }}
              />
            ))}
          </Box>

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

export default function StudentContactDetailsSection({
  data = null,
  initialEmail = "",
  onSave,
  loading = false,
}) {
  const id = useId();
  const [localData, setLocalData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");

  const preview = typeof onSave !== "function";
  const available = localData !== null || data !== null || preview;
  const values = createValues(localData ?? data ?? { email: initialEmail });

  const address = [
    values.addressLine1,
    values.addressLine2,
    [values.city, values.region, values.postalCode].filter(Boolean).join(", "),
    values.country,
  ]
    .filter(Boolean)
    .join("\n");

  const details = [
    { label: "Contact email", value: values.email },
    { label: "Phone number", value: values.phone },
    { label: "Residential address", value: address, wide: true },
  ];

  async function saveDetails(nextValues) {
    const saved = preview ? nextValues : await onSave(nextValues);

    setLocalData(saved ?? nextValues);
    setNotice(
      preview
        ? "Contact details updated for this preview."
        : "Contact details saved."
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
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              id={`${id}-heading`}
              component="h2"
              sx={{ fontSize: 18, fontWeight: 700 }}
            >
              Contact & address
            </Typography>

            <Typography
              sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}
            >
              Your contact information and current place of residence.
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
              flexShrink: 0,
              fontSize: 12.5,
              color: "#FFFFFF",
            }}
          >
            Edit details
          </Button>
        </Box>

        <Box sx={{ px: { xs: 2.5, sm: 4 }, pb: 3 }}>
          {!available && !loading ? (
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              Contact information is not available yet.
            </Typography>
          ) : (
            <Box
              component="dl"
              sx={{
                m: 0,
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                columnGap: 4,
              }}
            >
              {details.map((detail) => (
                <Box
                  key={detail.label}
                  sx={{
                    gridColumn: detail.wide ? "1 / -1" : "auto",
                    minWidth: 0,
                    py: 2,
                    borderTop: "1px solid #EDF1F4",
                  }}
                >
                  <Typography
                    component="dt"
                    sx={{ mb: 0.75, fontSize: 12, color: "text.secondary" }}
                  >
                    {detail.label}
                  </Typography>

                  <Typography
                    component="dd"
                    sx={{
                      m: 0,
                      fontSize: 14,
                      lineHeight: 1.8,
                      fontWeight: detail.value ? 500 : 400,
                      color: detail.value ? "text.primary" : "text.secondary",
                      whiteSpace: "pre-line",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {loading ? (
                      <Skeleton animation={false} width="60%" />
                    ) : (
                      detail.value || "Not provided"
                    )}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {preview && (
            <Typography sx={{ mt: 1, fontSize: 11.5, color: "text.secondary" }}>
              Preview · Changes reset when you leave or refresh.
            </Typography>
          )}
        </Box>
      </Paper>

      {editing && (
        <ContactEditor
          data={values}
          onSave={saveDetails}
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