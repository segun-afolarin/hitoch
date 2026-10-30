import { useId } from "react";
import {
  Avatar,
  Box,
  Paper,
  SvgIcon,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

export default function StudentApplicationSummary({
  application,
}) {
  const headingId = useId();

  if (!application) return null;

  const updated =
    typeof application.updatedAt === "string"
      ? new Date(application.updatedAt)
      : null;

  const validDate =
    updated && !Number.isNaN(updated.getTime());

  const fields = [
    ["Application reference", application.reference],
    ["Destination", application.country],
    ["Intake", application.intakeLabel],
    ["Your consultant", application.consultantName],
  ];

  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby={headingId}
      sx={{
        minWidth: 0,
        bgcolor: "#FFFFFF",
        borderColor: "#E5EAEE",
        borderRadius: "16px",
        containerType: "inline-size",
        containerName: "application-summary",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          <Typography
            id={headingId}
            component="h2"
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            Application overview
          </Typography>

          <Box
            sx={(theme) => ({
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.75,
              borderRadius: "7px",
              bgcolor: alpha(
                application.requiresAction
                  ? theme.palette.secondary.main
                  : theme.palette.primary.main,
                0.1,
              ),
            })}
          >
            <Box
              aria-hidden="true"
              sx={{
                width: 6,
                height: 6,
                flexShrink: 0,
                borderRadius: "50%",
                bgcolor: application.requiresAction
                  ? "secondary.main"
                  : "primary.main",
              }}
            />

            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                overflowWrap: "anywhere",
              }}
            >
              {application.statusLabel ||
                "Status not available"}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: { xs: 1.75, sm: 2.5 },
            minWidth: 0,
          }}
        >
          <Avatar
            src={application.institutionLogo || undefined}
            alt=""
            variant="rounded"
            sx={(theme) => ({
              width: { xs: 48, sm: 64 },
              height: { xs: 48, sm: 64 },
              borderRadius: "12px",
              flexShrink: 0,
              bgcolor: alpha(
                theme.palette.primary.main,
                0.065,
              ),
              color: "primary.main",

              "& img": {
                objectFit: "contain",
                p: "8px",
                boxSizing: "border-box",
              },
            })}
          >
            <SvgIcon
              viewBox="0 0 24 24"
              sx={{ fontSize: 30 }}
            >
              <path
                d="m3 8 9-5 9 5H3ZM5 11v7m5-7v7m4-7v7m5-7v7M3 21h18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </SvgIcon>
          </Avatar>

          <Box
            sx={{
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                color: "text.secondary",
                mb: 0.75,
              }}
            >
              {application.institutionName}
            </Typography>

            <Typography
              component="h3"
              sx={{
                fontSize: { xs: 21, sm: 27 },
                fontWeight: 700,
                lineHeight: 1.35,
                letterSpacing: "-0.65px",
              }}
            >
              {application.programmeName}
            </Typography>

            {(application.studyLevel ||
              application.studyMode) && (
              <Typography
                sx={{
                  mt: 1,
                  fontSize: 12.5,
                  lineHeight: 1.7,
                  color: "text.secondary",
                }}
              >
                {[
                  application.studyLevel,
                  application.studyMode,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          component="dl"
          sx={{
            m: 0,
            mt: 3.5,
            pt: 2.5,
            borderTop: "1px solid #EDF0F3",
            display: "grid",
            gap: 2.5,
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",

            "@container application-summary (min-width: 760px)": {
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
            },
          }}
        >
          {fields.map(([label, value]) => (
            <Box key={label} sx={{ minWidth: 0 }}>
              <Typography
                component="dt"
                sx={{
                  mb: 0.75,
                  fontSize: 11.5,
                  color: "text.secondary",
                }}
              >
                {label}
              </Typography>

              <Typography
                component="dd"
                sx={{
                  m: 0,
                  fontSize: 13.5,
                  fontWeight: 600,
                  lineHeight: 1.6,
                  overflowWrap: "anywhere",
                }}
              >
                {value || "To be confirmed"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {validDate && (
        <Box
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: 1.5,
            borderTop: "1px solid #EDF0F3",
            bgcolor: "#FAFCFD",
          }}
        >
          <Typography
            sx={{
              fontSize: 11.5,
              color: "text.secondary",
            }}
          >
            Last updated{" "}
            <Box
              component="time"
              dateTime={updated.toISOString()}
            >
              {updated.toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Box>
          </Typography>
        </Box>
      )}
    </Paper>
  );
}