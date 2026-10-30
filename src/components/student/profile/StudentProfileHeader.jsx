import { useId, useState } from "react";
import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Paper,
  Skeleton,
  SvgIcon,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import StudentProfilePhoto from "./StudentProfilePhoto";
import StudentPersonalDetailsDialog from "./StudentPersonalDetailsDialog";

function EditIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        d="m15 5 4 4M4 20l4.5-1L20 7.5a2.8 2.8 0 0 0-4-4L4.5 15 4 20Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function formatBirthDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(`${value}T12:00:00`);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function StudentProfileHeader({
  student = null,
  details = {},
  completedSections,
  totalSections = 7,
  loading = false,
  onSave,
  onSavePhoto,
  preview = false,
}) {
  const id = useId();
  const [editing, setEditing] = useState(false);

  const displayName =
    details.fullName?.trim() || student?.name?.trim() || "Student";

  const hasProgress =
    Number.isInteger(completedSections) &&
    Number.isInteger(totalSections) &&
    totalSections > 0 &&
    completedSections >= 0 &&
    completedSections <= totalSections;

  const percentage = hasProgress
    ? Math.round((completedSections / totalSections) * 100)
    : 0;

  const fields = [
    {
      label: "Full name",
      value: details.fullName || student?.name,
    },
    {
      label: "Preferred name",
      value: details.preferredName,
    },
    {
      label: "Date of birth",
      value: formatBirthDate(details.dateOfBirth),
    },
    {
      label: "Nationality",
      value: details.nationality,
    },
  ];

  return (
    <>
      <Paper
        component="section"
        aria-labelledby={`${id}-heading`}
        aria-busy={loading}
        elevation={0}
        sx={{
          minWidth: 0,
          overflow: "hidden",
          bgcolor: "#FFFFFF",
          border: "1px solid #E2E8ED",
          borderRadius: 2,
          boxShadow: "0 4px 24px rgba(64, 64, 65, 0.035)",
        }}
      >
        {/* Page heading */}
        <Box
          sx={{
            px: { xs: 2.5, sm: 4 },
            py: { xs: 2.5, sm: 3 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: 2.5,
          }}
        >
          <Box>
            <Typography
              id={`${id}-heading`}
              component="h1"
              sx={{
                fontSize: { xs: 24, sm: 28 },
                fontWeight: 700,
                letterSpacing: "-0.8px",
                color: "text.primary",
                lineHeight: 1.25,
              }}
            >
              My profile
            </Typography>

            <Typography
              sx={{
                mt: 0.75,
                fontSize: 13,
                color: "text.secondary",
                lineHeight: 1.7,
              }}
            >
              Manage the information that supports your applications.
            </Typography>
          </Box>

          {hasProgress && !loading && (
            <Box
              sx={{
                width: { xs: "100%", md: 220 },
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "text.secondary",
                    fontWeight: 500,
                  }}
                >
                  Profile completion
                </Typography>

                <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                  {percentage}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={percentage}
                aria-label="Profile completion"
                aria-valuetext={`${completedSections} of ${totalSections} sections complete`}
                sx={{
                  height: 5,
                  borderRadius: 10,
                  bgcolor: (theme) =>
                    alpha(theme.palette.primary.main, 0.1),
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 10,
                    bgcolor: "primary.main",
                  },
                  "@media (prefers-reduced-motion: reduce)": {
                    "& .MuiLinearProgress-bar": { transition: "none" },
                  },
                }}
              />

              <Typography
                sx={{ mt: 0.75, fontSize: 11.5, color: "text.secondary" }}
              >
                {completedSections} of {totalSections} sections complete
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: "#E8EDF1" }} />

        {/* Student identity */}
        <Box
          sx={{
            px: { xs: 2.5, sm: 4 },
            py: { xs: 3, sm: 3.5 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: { xs: 2, sm: 3 },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          {loading ? (
            <Skeleton variant="circular" width={108} height={108} />
          ) : (
            <StudentProfilePhoto
              src={student?.avatarUrl}
              name={displayName}
              disabled={loading}
              onSavePhoto={onSavePhoto}
            />
          )}

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
                fontSize: 11.5,
                fontWeight: 600,
                color: "text.secondary",
                "&::before": {
                  content: '""',
                  width: 3,
                  height: 13,
                  borderRadius: 1,
                  bgcolor: "secondary.main",
                },
              }}
            >
              Student account
            </Typography>

            <Typography
              component="p"
              sx={{
                m: 0,
                fontSize: { xs: 22, sm: 26 },
                fontWeight: 700,
                letterSpacing: "-0.6px",
                lineHeight: 1.35,
                color: "text.primary",
                overflowWrap: "anywhere",
              }}
            >
              {loading ? <Skeleton width="65%" /> : displayName}
            </Typography>

            {student?.email && !loading && (
              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: 13,
                  color: "text.secondary",
                  overflowWrap: "anywhere",
                }}
              >
                {student.email}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider
          sx={{
            mx: { xs: 2.5, sm: 4 },
            borderColor: "#E8EDF1",
          }}
        />

        {/* Personal information */}
        <Box sx={{ px: { xs: 2.5, sm: 4 }, py: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                component="h2"
                sx={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                Personal details
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 12.5,
                  color: "text.secondary",
                  lineHeight: 1.7,
                }}
              >
                Keep these details consistent with your identification.
              </Typography>
            </Box>

            <Button
              variant="contained"
              disableElevation
              startIcon={<EditIcon sx={{ fontSize: 17 }} />}
              disabled={loading || typeof onSave !== "function"}
              onClick={() => setEditing(true)}
              sx={{
                alignSelf: { xs: "flex-start", sm: "center" },
                minHeight: 42,
                flexShrink: 0,
                px: 2,
                borderRadius: 1.5,
                fontSize: 12.5,
                bgcolor: "primary.main",
                color: "#FFFFFF",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Edit details
            </Button>
          </Box>

          <Box
            component="dl"
            sx={{
              m: 0,
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              columnGap: { sm: 4, lg: 8 },
            }}
          >
            {fields.map((field) => (
              <Box
                key={field.label}
                component="div"
                sx={{
                  minWidth: 0,
                  py: 2,
                  borderTop: "1px solid #EDF1F4",
                }}
              >
                <Typography
                  component="dt"
                  sx={{
                    mb: 0.75,
                    fontSize: 12,
                    fontWeight: 500,
                    color: "text.secondary",
                  }}
                >
                  {field.label}
                </Typography>

                <Typography
                  component="dd"
                  sx={{
                    m: 0,
                    fontSize: 14,
                    fontWeight: field.value ? 600 : 400,
                    color: field.value ? "text.primary" : "text.secondary",
                    lineHeight: 1.7,
                    overflowWrap: "anywhere",
                  }}
                >
                  {loading ? (
                    <Skeleton width="60%" />
                  ) : (
                    field.value || "Not provided"
                  )}
                </Typography>
              </Box>
            ))}
          </Box>

          {preview && (
            <Typography
              sx={{
                mt: 2,
                fontSize: 11.5,
                color: "text.secondary",
                lineHeight: 1.6,
              }}
            >
              Preview · Changes reset when you leave this page or refresh.
            </Typography>
          )}
        </Box>
      </Paper>

      {editing && (
        <StudentPersonalDetailsDialog
          details={details}
          onSave={onSave}
          onClose={() => setEditing(false)}
          preview={preview}
        />
      )}
    </>
  );
}