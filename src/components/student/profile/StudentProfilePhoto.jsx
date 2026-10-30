import { useEffect, useId, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  SvgIcon,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function CameraIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        d="M8 6 9.5 4h5L16 6h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="13"
        r="3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </SvgIcon>
  );
}

/* Illustrated fallback — no initials or external image required. */
function StudentAvatarIllustration() {
  const theme = useTheme();

  return (
    <svg
      viewBox="0 0 120 120"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        width="120"
        height="120"
        fill={alpha(theme.palette.primary.main, 0.08)}
      />

      {/* Shirt */}
      <path
        d="M17 120v-12c0-19 15-30 33-33h20c18 3 33 14 33 33v12Z"
        fill={theme.palette.primary.main}
      />

      {/* Neck */}
      <path
        d="M50 65h20v15c0 8-20 8-20 0Z"
        fill="#C98C67"
      />

      {/* Hair behind face */}
      <path
        d="M35 49V33c0-16 11-25 26-25 17 0 26 11 26 26v17Z"
        fill={theme.palette.text.primary}
      />

      {/* Ears and face */}
      <ellipse cx="37" cy="49" rx="5" ry="8" fill="#D99D77" />
      <ellipse cx="83" cy="49" rx="5" ry="8" fill="#D99D77" />
      <rect
        x="39"
        y="25"
        width="42"
        height="51"
        rx="21"
        fill="#E2AC86"
      />

      {/* Hairline */}
      <path
        d="M37 43V31c0-14 12-22 25-22 15 0 24 10 24 23v11l-7-10c-10 2-19-1-25-8-3 9-9 14-17 18Z"
        fill={theme.palette.text.primary}
      />

      {/* Eyes and eyebrows */}
      <path
        d="m47 44 7-1m12 0 7 1"
        fill="none"
        stroke={theme.palette.text.primary}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="51" cy="50" r="1.8" fill="#404041" />
      <circle cx="69" cy="50" r="1.8" fill="#404041" />

      {/* Nose and smile */}
      <path
        d="m60 52-2 6h4"
        fill="none"
        stroke="#BC805E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M53 63q7 6 14 0"
        fill="none"
        stroke="#81523C"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Collar */}
      <path
        d="m49 77 11 10-8 8-10-15Zm22 0L60 87l8 8 10-15Z"
        fill="#FFFFFF"
      />

      {/* Small brand accent */}
      <path
        d="M84 96h8v15h-8Z"
        fill={theme.palette.secondary.main}
      />
    </svg>
  );
}

function Photo({ src, name, size }) {
  return (
    <Avatar
      src={src || undefined}
      alt={`${name}'s profile picture`}
      sx={{
        width: size,
        height: size,
        bgcolor: "#FFFFFF",
        "& .MuiAvatar-img": {
          objectFit: "cover",
          objectPosition: "center",
        },
      }}
    >
      <StudentAvatarIllustration />
    </Avatar>
  );
}

/* Each temporary browser URL is released when no longer needed. */
function useFilePreview(file) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return undefined;
    }

    const url = URL.createObjectURL(file);

    setPreview({ file, url });

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // Wait until a preview exists for the currently selected file.
  if (!file || !preview || preview.file !== file) {
    return "";
  }

  return preview.url;
}

async function checkImage(file) {
  const url = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.src = url;
    await image.decode();

    if (!image.naturalWidth || !image.naturalHeight) {
      throw new Error("Invalid image");
    }
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function StudentProfilePhoto({
  src,
  name = "Student",
  disabled = false,
  onSavePhoto,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const id = useId();

  const inputRef = useRef(null);
  const selectionVersion = useRef(0);
  const saveLock = useRef(false);

  const [open, setOpen] = useState(false);
  const [draftFile, setDraftFile] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [appliedPhoto, setAppliedPhoto] = useState(null);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const draftUrl = useFilePreview(draftFile);
  const appliedUrl = useFilePreview(appliedPhoto?.file);

  const previewMode = typeof onSavePhoto !== "function";

  const currentSrc = appliedPhoto
    ? appliedPhoto.file
      ? appliedUrl
      : appliedPhoto.url
    : src || "";

  const editorSrc = removePhoto ? "" : draftUrl || currentSrc;
  const hasChanges = Boolean(draftFile || removePhoto);

  useEffect(() => {
    return () => {
      selectionVersion.current += 1;
    };
  }, []);

  function openEditor() {
    setDraftFile(null);
    setRemovePhoto(false);
    setError("");
    setChecking(false);
    setOpen(true);
  }

  function closeEditor() {
    if (saveLock.current) return;

    selectionVersion.current += 1;
    setOpen(false);
    setDraftFile(null);
    setChecking(false);
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const version = ++selectionVersion.current;
    setChecking(false);
    setError("");

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Choose a JPG, PNG or WebP image.");
      return;
    }

    if (!file.size || file.size > MAX_FILE_SIZE) {
      setError("Choose an image smaller than 5 MB.");
      return;
    }

    setChecking(true);

    try {
      await checkImage(file);

      if (version !== selectionVersion.current) return;

      setDraftFile(file);
      setRemovePhoto(false);
    } catch {
      if (version === selectionVersion.current) {
        setError("This image could not be opened. Please choose another.");
      }
    } finally {
      if (version === selectionVersion.current) {
        setChecking(false);
      }
    }
  }

  function handleRemove() {
    selectionVersion.current += 1;
    setDraftFile(null);
    setRemovePhoto(true);
    setError("");
    setChecking(false);
  }

  async function handleApply() {
    if (saveLock.current || checking || !hasChanges || error) return;

    saveLock.current = true;
    setSaving(true);
    setError("");

    try {
      if (previewMode) {
        setAppliedPhoto(
          removePhoto ? { url: "" } : { file: draftFile }
        );
      } else {
        /*
         * onSavePhoto receives File for an upload, or null for removal.
         * An upload must resolve with the stored image URL.
         * Reject the promise if the operation fails.
         */
        const savedUrl = await onSavePhoto(
          removePhoto ? null : draftFile
        );

        if (
          !removePhoto &&
          (typeof savedUrl !== "string" || !savedUrl.trim())
        ) {
          throw new Error("The upload did not return an image URL.");
        }

        setAppliedPhoto({ url: removePhoto ? "" : savedUrl });
      }

      setNotice(
        previewMode
          ? "Profile picture updated for this preview."
          : "Profile picture updated."
      );

      setOpen(false);
      setDraftFile(null);
    } catch {
      setError(
        "We couldn't update your picture. Your selection is still here. Please try again."
      );
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  }

  return (
    <>
      <ButtonBase
        type="button"
        onClick={openEditor}
        disabled={disabled}
        aria-label={currentSrc ? "Change profile picture" : "Add profile picture"}
        aria-haspopup="dialog"
        sx={{
          display: "inline-flex",
          flexDirection: "column",
          gap: 1,
          flexShrink: 0,
          borderRadius: 2,
          p: 0.5,
          "&.Mui-focusVisible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: 5,
          },
          "&:hover .profile-camera": {
            bgcolor: "primary.dark",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            p: 0.75,
            borderRadius: "50%",
            border: "1px solid",
            borderColor: (theme) =>
              alpha(theme.palette.primary.main, 0.2),
            bgcolor: "#FFFFFF",
          }}
        >
          <Photo
            src={currentSrc}
            name={name}
            size={{ xs: 80, sm: 96 }}
          />

          <Box
            className="profile-camera"
            sx={{
              position: "absolute",
              right: 0,
              bottom: 1,
              width: 34,
              height: 34,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              border: "3px solid #FFFFFF",
              bgcolor: "primary.main",
              color: "#FFFFFF",
            }}
          >
            <CameraIcon sx={{ fontSize: 17 }} />
          </Box>
        </Box>

        <Typography
          component="span"
          sx={{
            color: "text.secondary",
            fontSize: 11.5,
            fontWeight: 600,
          }}
        >
          {currentSrc ? "Change photo" : "Add photo"}
        </Typography>
      </ButtonBase>

      <Dialog
        open={open}
        onClose={closeEditor}
        fullWidth
        maxWidth="xs"
        fullScreen={fullScreen}
        disableEscapeKeyDown={saving}
        transitionDuration={reduceMotion ? 0 : undefined}
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
        <DialogTitle
          id={`${id}-title`}
          sx={{ px: 3, pt: 3, fontSize: 21, fontWeight: 700 }}
        >
          Profile picture
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 3 }}>
          <Typography
            id={`${id}-description`}
            sx={{
              color: "text.secondary",
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            Choose a clear photo of yourself. Your picture will be displayed
            in a circle.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              py: 3,
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: "50%",
                border: "1px solid #E2E8ED",
              }}
            >
              <Photo src={editorSrc} name={name} size={152} />
            </Box>

            {draftFile && (
              <Typography
                title={draftFile.name}
                noWrap
                sx={{
                  maxWidth: "100%",
                  fontSize: 12,
                  color: "text.secondary",
                }}
              >
                {draftFile.name}
              </Typography>
            )}

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                disabled={saving || checking}
                onClick={() => inputRef.current?.click()}
                startIcon={
                  checking ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <CameraIcon sx={{ fontSize: 18 }} />
                  )
                }
                sx={{
                  minHeight: 44,
                  color: "text.primary",
                  borderColor: "#D8E1E8",
                }}
              >
                {checking ? "Checking…" : "Choose photo"}
              </Button>

              {currentSrc && !removePhoto && (
                <Button
                  onClick={handleRemove}
                  disabled={saving || checking}
                  sx={{ minHeight: 44, color: "text.secondary" }}
                >
                  Remove
                </Button>
              )}
            </Box>

            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              JPG, PNG or WebP · Up to 5 MB
            </Typography>
          </Box>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={handleFileChange}
          />

          {error && (
            <Box
              role="alert"
              sx={{
                p: 1.5,
                mb: 2,
                borderLeft: "3px solid",
                borderColor: "secondary.main",
                bgcolor: (theme) =>
                  alpha(theme.palette.secondary.main, 0.07),
                color: "text.primary",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {error}
            </Box>
          )}

          {previewMode && (
            <Typography
              sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.7 }}
            >
              Preview mode: your picture resets when you leave this page
              or refresh.
            </Typography>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            borderTop: "1px solid #E8EDF1",
            gap: 1,
            "& > :not(style) ~ :not(style)": { ml: 0 },
          }}
        >
          <Button
            onClick={closeEditor}
            disabled={saving}
            sx={{ minHeight: 44, color: "text.primary" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disableElevation
            onClick={handleApply}
            disabled={!hasChanges || saving || checking || Boolean(error)}
            startIcon={
              saving ? <CircularProgress size={16} color="inherit" /> : null
            }
            sx={{
              minHeight: 44,
              color: "#FFFFFF",
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            {saving
              ? "Saving…"
              : previewMode
                ? "Apply to preview"
                : "Save picture"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={4500}
        message={notice}
        onClose={(event, reason) => {
          if (reason !== "clickaway") setNotice("");
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}