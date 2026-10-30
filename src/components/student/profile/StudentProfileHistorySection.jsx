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
  FormControlLabel,
  MenuItem,
  Paper,
  Skeleton,
  Snackbar,
  SvgIcon,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

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

function HistoryEditor({
  config,
  record,
  onSave,
  onRemove,
  onClose,
  preview,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const id = useId();
  const busyRef = useRef(false);

  const [recordId] = useState(() => record?.id ?? crypto.randomUUID());
  const [values, setValues] = useState(() => ({
    ...config.defaults,
    ...record,
  }));
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState("");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const visibleFields = config.fields.filter(
    (field) => !field.when || field.when(values)
  );

  function closeEditor() {
    if (!busyRef.current) onClose();
  }

  function changeField(event) {
    const { name, value, checked, type } = event.target;

    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({ ...current, [name]: undefined }));
    setRequestError("");
  }

  async function submit(event) {
    event.preventDefault();
    if (busyRef.current) return;

    const cleaned = {
      ...config.normalize(values),
      id: recordId,
    };

    if (!removing) {
      const nextErrors = config.validate(cleaned);
      setErrors(nextErrors);

      const firstError = Object.keys(nextErrors)[0];

      if (firstError) {
        document.getElementById(`${id}-${firstError}`)?.focus();
        return;
      }
    }

    busyRef.current = true;
    setSaving(true);
    setRequestError("");

    try {
      if (removing) {
        await onRemove(record.id);
      } else {
        await onSave(cleaned);
      }
    } catch {
      setRequestError(
        removing
          ? "We couldn't remove this record. Please try again."
          : "We couldn't save your changes. Your entries are still here."
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
            ? "Remove this record?"
            : `${record ? "Edit" : "Add"} ${config.recordLabel}`}
        </DialogTitle>

        <Typography
          id={`${id}-description`}
          sx={{
            px: 3,
            pb: 3,
            fontSize: 13,
            color: "text.secondary",
            lineHeight: 1.7,
          }}
        >
          {removing
            ? "This record will no longer appear in your profile."
            : config.editorDescription}
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
          {requestError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {requestError}
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
                {config.summary(record).title}
              </Typography>

              <Typography
                sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}
              >
                {config.summary(record).subtitle}
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
              }}
            >
              {visibleFields.map((field, index) => {
                const label =
                  typeof field.label === "function"
                    ? field.label(values)
                    : field.label;

                const helper =
                  typeof field.helper === "function"
                    ? field.helper(values)
                    : field.helper;

                const disabled =
                  saving ||
                  Boolean(field.disabled?.(values, Boolean(record)));

                const inputProps =
                  typeof field.inputProps === "function"
                    ? field.inputProps(values)
                    : field.inputProps;

                if (field.type === "checkbox") {
                  return (
                    <Box key={field.name} sx={{ gridColumn: "1 / -1" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            name={field.name}
                            checked={Boolean(values[field.name])}
                            onChange={changeField}
                            disabled={disabled}
                          />
                        }
                        label={label}
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: 13,
                            lineHeight: 1.6,
                          },
                        }}
                      />

                      {helper && (
                        <Typography
                          sx={{ fontSize: 12, color: "text.secondary" }}
                        >
                          {helper}
                        </Typography>
                      )}
                    </Box>
                  );
                }

                return (
                  <TextField
                    key={field.name}
                    id={`${id}-${field.name}`}
                    name={field.name}
                    label={label}
                    type={
                      ["select", "textarea"].includes(field.type)
                        ? "text"
                        : field.type || "text"
                    }
                    select={field.type === "select"}
                    multiline={field.type === "textarea"}
                    minRows={field.type === "textarea" ? 3 : undefined}
                    required={Boolean(field.required)}
                    fullWidth
                    autoFocus={index === 0 && !disabled}
                    disabled={disabled}
                    value={values[field.name] ?? ""}
                    onChange={changeField}
                    error={Boolean(errors[field.name])}
                    helperText={errors[field.name] || helper}
                    slotProps={{
                      inputLabel: ["date", "month"].includes(field.type)
                        ? { shrink: true }
                        : undefined,
                      htmlInput: inputProps,
                    }}
                    sx={{ gridColumn: field.wide ? "1 / -1" : "auto" }}
                  >
                    {field.type === "select"
                      ? field.options.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))
                      : undefined}
                  </TextField>
                );
              })}
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
            {record && !removing && (
              <Button
                type="button"
                disabled={saving}
                onClick={() => {
                  setRemoving(true);
                  setRequestError("");
                }}
                sx={{ minHeight: 44, px: 1, color: "text.secondary" }}
              >
                Remove record
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
                      setRequestError("");
                    }
                  : closeEditor
              }
              sx={{ minHeight: 44, color: "text.primary" }}
            >
              {removing ? "Keep record" : "Cancel"}
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
                  ? "Remove record"
                  : preview
                    ? "Apply to preview"
                    : "Save changes"}
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default function StudentProfileHistorySection({
  config,
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

  function validHistory(value) {
    if (
      !value ||
      typeof value.noneDeclared !== "boolean" ||
      !Array.isArray(value.records)
    ) {
      return false;
    }

    const ids = value.records.map((record) => record?.id);

    if (
      ids.some(
        (recordId) =>
          !["string", "number"].includes(typeof recordId) || recordId === ""
      ) ||
      new Set(ids.map(String)).size !== ids.length
    ) {
      return false;
    }

    return !(
      value.noneDeclared &&
      value.records.some(config.affectsDeclaration)
    );
  }

  const source = localData ?? data;
  const available = source === null ? preview : validHistory(source);
  const current =
    available && source
      ? source
      : { noneDeclared: false, records: [] };

  const records = current.records;
  const orderedRecords = config.sort
    ? [...records].sort(config.sort)
    : records;

  const canEdit = available && !loading && !error && !busy;
  const canDeclareNone = !records.some(config.affectsDeclaration);

  async function persist(nextData, message) {
    if (busyRef.current) throw new Error("A save is already in progress.");

    busyRef.current = true;
    setBusy(true);
    setActionError("");

    try {
      /*
       * Callback contract:
       * onSave({ noneDeclared: boolean, records: [...] })
       *
       * Return the canonical saved object, or resolve without a value.
       * Reject on failure. Archive removed records in the backend.
       */
      const response = preview ? nextData : await onSave(nextData);
      const saved = response ?? nextData;

      if (!validHistory(saved)) {
        throw new Error("The saved history has an invalid structure.");
      }

      setLocalData(saved);
      setNotice(preview ? `${message} for this preview.` : `${message}.`);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  async function saveRecord(record) {
    const exists = records.some(
      (item) => String(item.id) === String(record.id)
    );

    await persist(
      {
        noneDeclared: config.affectsDeclaration(record)
          ? false
          : current.noneDeclared,
        records: exists
          ? records.map((item) =>
              String(item.id) === String(record.id) ? record : item
            )
          : [...records, record],
      },
      "Record updated"
    );
  }

  async function removeRecord(recordId) {
    await persist(
      {
        noneDeclared: current.noneDeclared,
        records: records.filter(
          (item) => String(item.id) !== String(recordId)
        ),
      },
      "Record removed"
    );
  }

  async function declareNone() {
    if (busyRef.current || !canDeclareNone) return;

    try {
      await persist(
        { noneDeclared: true, records },
        "Information updated"
      );
    } catch {
      setActionError("We couldn't save your answer. Please try again.");
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
          <Box sx={{ minWidth: 0 }}>
            <Typography
              id={`${id}-heading`}
              component="h2"
              sx={{ fontSize: 18, fontWeight: 700 }}
            >
              {config.title}
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 13,
                color: "text.secondary",
                lineHeight: 1.7,
              }}
            >
              {config.description}
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
            {config.addLabel}
          </Button>
        </Box>

        {actionError && (
          <Alert severity="error" sx={{ mx: { xs: 2.5, sm: 4 }, mb: 2 }}>
            {actionError}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ px: { xs: 2.5, sm: 4 }, pb: 3 }}>
            <Skeleton animation={false} width="45%" height={28} />
            <Skeleton animation={false} width="65%" />
            <Skeleton animation={false} width="80%" height={50} />
          </Box>
        ) : error || !available ? (
          <Box sx={{ px: { xs: 2.5, sm: 4 }, pb: 3 }}>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              {error
                ? "We couldn't load this information."
                : "This information is not available yet."}
            </Typography>

            {typeof onRetry === "function" && (
              <Button onClick={onRetry} sx={{ mt: 1, minHeight: 44 }}>
                Try again
              </Button>
            )}
          </Box>
        ) : (
          <>
            {(records.length === 0 || canDeclareNone) && (
              <Box
                sx={{
                  mx: { xs: 2.5, sm: 4 },
                  py: 2.5,
                  borderTop: "1px solid #EDF1F4",
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  {current.noneDeclared
                    ? config.noneTitle
                    : records.length
                      ? config.nonePrompt
                      : config.emptyTitle}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.75,
                    maxWidth: 620,
                    fontSize: 13,
                    color: "text.secondary",
                    lineHeight: 1.8,
                  }}
                >
                  {current.noneDeclared
                    ? config.noneDescription
                    : records.length
                      ? config.noneHelp
                      : config.emptyDescription}
                </Typography>

                {!current.noneDeclared && canDeclareNone && (
                  <Button
                    variant="outlined"
                    disabled={!canEdit}
                    onClick={declareNone}
                    startIcon={
                      busy ? <CircularProgress size={16} color="inherit" /> : null
                    }
                    sx={{
                      mt: 2,
                      minHeight: 44,
                      px: 2,
                      color: "text.primary",
                      borderColor: "#DCE3E9",
                      fontSize: 12.5,
                    }}
                  >
                    {config.noneButton}
                  </Button>
                )}
              </Box>
            )}

            <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
              {orderedRecords.map((record) => {
                const summary = config.summary(record);

                return (
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
                          {summary.title}
                        </Typography>

                        {summary.subtitle && (
                          <Typography
                            sx={{
                              mt: 0.5,
                              fontSize: 13,
                              color: "text.secondary",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {summary.subtitle}
                          </Typography>
                        )}

                        {summary.tag && (
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
                                  summary.tag.tone === "secondary"
                                    ? theme.palette.secondary.main
                                    : theme.palette.primary.main,
                                  0.09
                                ),
                            }}
                          >
                            {summary.tag.label}
                          </Typography>
                        )}
                      </Box>

                      <Button
                        variant="outlined"
                        disabled={!canEdit}
                        aria-label={`Edit ${summary.title}`}
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

                    <Box
                      component="dl"
                      sx={{
                        m: 0,
                        mt: 2.5,
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "minmax(0, 1fr)",
                          sm: "repeat(2, minmax(0, 1fr))",
                          md: "repeat(3, minmax(0, 1fr))",
                        },
                        gap: 2,
                      }}
                    >
                      {summary.details.map((detail) => (
                        <Box key={detail.label} sx={{ minWidth: 0 }}>
                          <Typography
                            component="dt"
                            sx={{
                              mb: 0.5,
                              fontSize: 11.5,
                              color: "text.secondary",
                            }}
                          >
                            {detail.label}
                          </Typography>

                          <Typography
                            component="dd"
                            sx={{
                              m: 0,
                              fontSize: 13,
                              fontWeight: detail.value ? 500 : 400,
                              color: detail.value
                                ? "text.primary"
                                : "text.secondary",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {detail.value || "Not provided"}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {summary.notes && (
                      <Typography
                        sx={{
                          mt: 2,
                          fontSize: 12.5,
                          lineHeight: 1.8,
                          whiteSpace: "pre-line",
                          overflowWrap: "anywhere",
                          color: "text.secondary",
                        }}
                      >
                        {summary.notes}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          </>
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
              sx={{ fontSize: 11.5, lineHeight: 1.7, color: "text.secondary" }}
            >
              {config.footer}
              {preview && " Preview changes reset when you leave or refresh."}
            </Typography>
          </Box>
        )}
      </Paper>

      {editor && (
        <HistoryEditor
          config={config}
          record={editor.record}
          onSave={saveRecord}
          onRemove={removeRecord}
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